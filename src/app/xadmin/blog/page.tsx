import Link from "next/link";
import { redirect } from "next/navigation";
import { requireBlogAdmin } from "@/lib/blog/admin";
export const dynamic = "force-dynamic";
export default async function BlogAdmin() {
  const sb = await requireBlogAdmin().catch(() => null);
  if (!sb) redirect("/xadmin/login");
  const { data, error } = await sb
    .from("spa_blog_posts")
    .select("id,title,status,slug")
    .order("publication_order", { ascending: false, nullsFirst: true });
  if (error) throw new Error("Unable to load articles.");
  return (
    <main className="blog-editor">
      <Link href="/xadmin">← Dashboard</Link>
      <div className="editor-toolbar">
        <h1>Blog articles</h1>
        <Link href="/xadmin/blog/new" className="blog-button">
          New article
        </Link>
        <Link href="/blog" className="blog-read">
          View blog
        </Link>
      </div>
      <p>
        Save drafts, add photographs, preview your article and publish.
        Published articles automatically appear on the homepage and in the
        sitemap.
      </p>
      <div className="mt-8">
        {data?.map((p) => (
          <div
            key={p.id}
            className="border-b border-stone-300 py-5 flex justify-between gap-5"
          >
            <div>
              <h2>{p.title}</h2>
              <p className="text-sm">
                {p.status === "published" ? "Published" : "Draft"}
              </p>
            </div>
            <Link className="blog-read" href={`/xadmin/blog/${p.id}`}>
              Edit →
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
