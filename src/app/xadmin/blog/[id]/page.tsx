import { notFound, redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { requireBlogAdmin } from "@/lib/blog/admin";
import BlogEditor from "@/components/blog/BlogEditor";
import type { BlogPost } from "@/lib/blog/types";
export default async function EditArticle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const sb = await requireBlogAdmin().catch(() => null);
  if (!sb) redirect("/xadmin/login");
  const { id } = await params;
  if (id === "new")
    return (
      <BlogEditor
        initial={{
          id: randomUUID(),
          slug: "",
          title: "",
          excerpt: "",
          seo_title: "",
          seo_description: "",
          category: "Treatments",
          body: "## Start with the answer\n\nWrite your introduction here.\n\n{{image:1}}\n\n## Helpful details\n\n{{image:2}}",
          related_slugs: [],
          status: "draft",
          assets: [],
        }}
      />
    );
  const { data, error } = await sb
    .from("spa_blog_posts")
    .select(
      "id,slug,title,excerpt,seo_title,seo_description,category,body,related_slugs,status,assets:spa_blog_assets(*)",
    )
    .eq("id", id)
    .single();
  if (error || !data) notFound();
  return <BlogEditor initial={data as BlogPost} />;
}
