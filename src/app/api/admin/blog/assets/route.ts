import { NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import sharp from "sharp";
import { requireBlogAdmin } from "@/lib/blog/admin";
import { RPCH_SUPABASE_URL } from "@/lib/supabase-rpch";
export async function POST(request: Request) {
  try {
    const sb = await requireBlogAdmin();
    const form = await request.formData();
    const file = form.get("file");
    const postId = String(form.get("post_id"));
    if (
      !(file instanceof File) ||
      file.size > 4 * 1024 * 1024 ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    )
      return NextResponse.json(
        { error: "Use a JPEG, PNG or WebP image smaller than 4 MB." },
        { status: 400 },
      );
    const { data: post } = await sb
      .from("spa_blog_posts")
      .select("id,status")
      .eq("id", postId)
      .single();
    if (!post || post.status !== "draft")
      throw new Error("Save the article as a draft before adding photographs.");
    const { data: assets } = await sb
      .from("spa_blog_assets")
      .select("position")
      .eq("post_id", postId);
    if ((assets?.length || 0) >= 5)
      throw new Error("An article can have up to five images.");
    const input = Buffer.from(await file.arrayBuffer());
    const fingerprint = createHash("sha256")
      .update(
        await sharp(input)
          .rotate()
          .resize(64, 64, { fit: "fill" })
          .removeAlpha()
          .raw()
          .toBuffer(),
      )
      .digest("hex");
    const { data: existing } = await sb
      .from("spa_blog_assets")
      .select("id")
      .eq("fingerprint", fingerprint)
      .maybeSingle();
    if (existing)
      throw new Error(
        "This photograph already belongs to an article. Choose a different original.",
      );
    let quality = 85;
    let output = await sharp(input)
      .rotate()
      .resize({
        width: 1600,
        height: 1600,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toBuffer();
    while (output.length > 250 * 1024 && quality > 40) {
      quality -= 5;
      output = await sharp(input)
        .rotate()
        .resize({
          width: 1600,
          height: 1600,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality })
        .toBuffer();
    }
    const meta = await sharp(output).metadata();
    const id = randomUUID();
    const filename =
      file.name
        .replace(/\.[^.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .slice(0, 60) || "spa-photo";
    const path = `${postId}/${id}-${filename}.webp`;
    const { error: uploadError } = await sb.storage
      .from("spa-blog")
      .upload(path, output, { contentType: "image/webp", upsert: false });
    if (uploadError) throw uploadError;
    const asset = {
      id,
      post_id: postId,
      src: `${RPCH_SUPABASE_URL}/storage/v1/object/public/spa-blog/${path}`,
      fingerprint,
      alt: "",
      caption: "",
      generated: false,
      width: meta.width,
      height: meta.height,
      position: assets?.length || 0,
    };
    const { error } = await sb.from("spa_blog_assets").insert(asset);
    if (error) throw error;
    return NextResponse.json({ asset });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Image upload failed." },
      { status: 400 },
    );
  }
}
