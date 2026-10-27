"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveArticle, saveAsset } from "@/app/xadmin/blog/actions";
import { wordCount, type BlogPost, type BlogAsset } from "@/lib/blog/types";
import ArticleBody from "./ArticleBody";
import BlogImage from "./BlogImage";
export default function BlogEditor({ initial }: { initial: BlogPost }) {
  const [post, setPost] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(false);
  const router = useRouter();
  const field = (key: keyof BlogPost, value: string | string[]) =>
    setPost((p) => ({ ...p, [key]: value }));
  async function save(status: "draft" | "published") {
    setBusy(true);
    const result = await saveArticle({ ...post, status });
    setBusy(false);
    setMessage(
      result.ok
        ? status === "published"
          ? "Published. Your article is live."
          : "Draft saved."
        : result.error || "Unable to save.",
    );
    if (result.ok) {
      setPost((p) => ({ ...p, status }));
      router.replace(`/xadmin/blog/${post.id}`);
      router.refresh();
    }
  }
  async function upload(file: File) {
    setBusy(true);
    setMessage("Optimizing and uploading image…");
    try {
      const saved = await saveArticle({ ...post, status: "draft" });
      if (!saved.ok) throw new Error(saved.error);
      setPost((p) => ({ ...p, status: "draft" }));
      const form = new FormData();
      form.set("file", file);
      form.set("post_id", post.id);
      const response = await fetch("/api/admin/blog/assets", {
        method: "POST",
        body: form,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setPost((p) => ({ ...p, assets: [...p.assets, result.asset] }));
      setMessage(
        "Image uploaded. Add alt text and a caption, then save image details.",
      );
      router.replace(`/xadmin/blog/${post.id}`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }
  async function updateAsset(asset: BlogAsset) {
    setBusy(true);
    const r = await saveAsset(
      asset.id,
      asset.alt,
      asset.caption,
      asset.generated,
    );
    setMessage(r.ok ? "Image details saved." : r.error || "Unable to save.");
    setBusy(false);
  }
  return (
    <main className="blog-editor">
      <Link href="/xadmin/blog">← All articles</Link>
      <h1 className="mt-6">{initial.title ? "Edit article" : "New article"}</h1>
      <div className="editor-toolbar">
        <button
          className="blog-button"
          disabled={busy}
          onClick={() => save("draft")}
        >
          Save draft
        </button>
        <button
          className="blog-button"
          disabled={busy}
          onClick={() => save("published")}
        >
          Publish
        </button>
        <button className="underline" onClick={() => setPreview(!preview)}>
          {preview ? "Back to editor" : "Preview"}
        </button>
        <span>
          {wordCount(post.body)} words · {post.assets.length} images ·{" "}
          {post.status}
        </span>
        {post.status === "published" && (
          <Link href={`/blog/${post.slug}`}>View live ↗</Link>
        )}
      </div>
      <p role="status" className="p-3 bg-white">
        {message ||
          "Use 800–1,600 words and 3–5 distinct images. Dates and reading times are never shown."}
      </p>
      {preview ? (
        <article>
          <header className="article-header mt-8">
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
          </header>
          {post.assets[0] && <BlogImage asset={post.assets[0]} featured />}
          <div className="article-reading">
            <ArticleBody body={post.body} assets={post.assets} />
          </div>
        </article>
      ) : (
        <>
          <label htmlFor="title">Article title</label>
          <input
            id="title"
            value={post.title}
            onChange={(e) => field("title", e.target.value)}
          />
          <div className="editor-grid">
            <div>
              <label htmlFor="slug">URL slug</label>
              <input
                id="slug"
                value={post.slug}
                onChange={(e) => field("slug", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <input
                id="category"
                value={post.category}
                onChange={(e) => field("category", e.target.value)}
              />
            </div>
          </div>
          <label htmlFor="excerpt">Short introduction / card excerpt</label>
          <textarea
            id="excerpt"
            rows={3}
            value={post.excerpt}
            onChange={(e) => field("excerpt", e.target.value)}
          />
          <label htmlFor="seo-title">SEO title</label>
          <input
            id="seo-title"
            value={post.seo_title}
            onChange={(e) => field("seo_title", e.target.value)}
          />
          <label htmlFor="seo-description">Meta description</label>
          <textarea
            id="seo-description"
            rows={2}
            value={post.seo_description}
            onChange={(e) => field("seo_description", e.target.value)}
          />
          <label htmlFor="body">Article content</label>
          <p className="text-sm mb-3">
            Use ## for headings, ### for subheadings, - for lists and [link
            text](/treatments) for links. Place supporting images with{" "}
            {"{{image:1}}"} and {"{{image:2}}"} on separate lines. Image 0 is
            the featured image and appears automatically.
          </p>
          <textarea
            id="body"
            rows={25}
            value={post.body}
            onChange={(e) => field("body", e.target.value)}
          />
          <label htmlFor="related">
            Related article slugs (comma-separated)
          </label>
          <input
            id="related"
            value={post.related_slugs.join(", ")}
            onChange={(e) =>
              field(
                "related_slugs",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
          />
          <h2 className="mt-10">Article photography</h2>
          <p>
            Use original images assigned only to this article. Uploads are
            converted to WebP at up to 1,600 pixels. Duplicate files are
            rejected. Crops or edits of another article’s photo must not be
            reused. Uploading saves this article as a draft.
          </p>
          {[...post.assets]
            .sort((a, b) => a.position - b.position)
            .map((a) => (
              <div key={a.id} className="editor-asset">
                <p className="mb-3">
                  {a.position === 0
                    ? "Featured image"
                    : `Supporting image ${a.position}`}
                </p>
                <BlogImage asset={a} />
                <label htmlFor={`alt-${a.id}`}>Alt text</label>
                <input
                  id={`alt-${a.id}`}
                  value={a.alt}
                  onChange={(e) =>
                    setPost((p) => ({
                      ...p,
                      assets: p.assets.map((v) =>
                        v.id === a.id ? { ...v, alt: e.target.value } : v,
                      ),
                    }))
                  }
                />
                <label htmlFor={`caption-${a.id}`}>Caption</label>
                <input
                  id={`caption-${a.id}`}
                  value={a.caption}
                  onChange={(e) =>
                    setPost((p) => ({
                      ...p,
                      assets: p.assets.map((v) =>
                        v.id === a.id ? { ...v, caption: e.target.value } : v,
                      ),
                    }))
                  }
                />
                <label className="flex gap-3">
                  <input
                    type="checkbox"
                    className="!w-auto"
                    checked={a.generated}
                    onChange={(e) =>
                      setPost((p) => ({
                        ...p,
                        assets: p.assets.map((v) =>
                          v.id === a.id
                            ? { ...v, generated: e.target.checked }
                            : v,
                        ),
                      }))
                    }
                  />
                  AI-generated editorial illustration
                </label>
                <button
                  className="blog-read"
                  disabled={busy}
                  onClick={() => updateAsset(a)}
                >
                  Save image details
                </button>
              </div>
            ))}
          {post.assets.length < 5 && (
            <>
              <label htmlFor="upload">
                Upload a new, unused photograph (JPEG, PNG or WebP; up to 4 MB)
              </label>
              <input
                id="upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={busy}
                onChange={(e) => {
                  if (e.target.files?.[0]) void upload(e.target.files[0]);
                  e.target.value = "";
                }}
              />
            </>
          )}
        </>
      )}
    </main>
  );
}
