"use server";
import { revalidatePath } from "next/cache";
import { requireBlogAdmin } from "@/lib/blog/admin";
import { wordCount, type BlogPost } from "@/lib/blog/types";
export async function saveArticle(post: BlogPost) {
  try {
    const sb = await requireBlogAdmin();
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(post.slug))
      throw new Error("Use lowercase words separated by hyphens for the URL.");
    if (!post.title.trim()) throw new Error("Add an article title.");
    if (post.status === "published") {
      const count = wordCount(post.body);
      if (count < 800 || count > 1600)
        throw new Error(
          `Article has ${count} words; publishing requires 800–1,600.`,
        );
      const { data: assets, error } = await sb
        .from("spa_blog_assets")
        .select("position,alt")
        .eq("post_id", post.id);
      if (error) throw error;
      if (
        !assets ||
        assets.length < 3 ||
        assets.length > 5 ||
        !assets.some((a) => a.position === 0)
      )
        throw new Error("Add a featured image and 2–4 supporting images.");
      if (assets.some((a) => !a.alt.trim()))
        throw new Error("Add descriptive alt text to every image.");
      const tokens = [...post.body.matchAll(/\{\{image:(\d+)\}\}/g)].map((m) =>
        Number(m[1]),
      );
      if (
        tokens.includes(0) ||
        new Set(tokens).size !== tokens.length ||
        assets.some((a) => a.position > 0 && !tokens.includes(a.position)) ||
        tokens.some((n) => !assets.some((a) => a.position === n))
      )
        throw new Error(
          "Place every supporting image exactly once in the article using {{image:1}}, {{image:2}}, etc. Do not repeat the featured image.",
        );
      if (/^# /m.test(post.body))
        throw new Error(
          "Use ## for section headings; the article title is the only H1.",
        );
    }
    const { assets: _assets, ...record } = post;
    void _assets;
    const { error } = await sb.from("spa_blog_posts").upsert(record);
    if (error) throw error;
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unable to save the article.",
    };
  }
}
export async function saveAsset(
  id: string,
  alt: string,
  caption: string,
  generated: boolean,
) {
  try {
    if (!alt.trim()) throw new Error("Add descriptive alt text before saving.");
    const sb = await requireBlogAdmin();
    const { error } = await sb
      .from("spa_blog_assets")
      .update({ alt, caption, generated })
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unable to save image details.",
    };
  }
}
