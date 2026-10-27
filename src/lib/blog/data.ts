import "server-only";
import { cache } from "react";
import { getRPCHSupabaseClient } from "@/lib/supabase-rpch";
import type { BlogPost } from "./types";
const fields =
  "id,slug,title,excerpt,seo_title,seo_description,category,body,related_slugs,status,assets:spa_blog_assets(*)";
export const getPublishedPosts = cache(async (): Promise<BlogPost[]> => {
  const { data, error } = await getRPCHSupabaseClient()
    .from("spa_blog_posts")
    .select(fields)
    .eq("status", "published")
    .order("publication_order", { ascending: false })
    .order("id");
  if (error) throw new Error("Unable to load articles. Please try again.");
  return (data as BlogPost[]).map((p) => ({
    ...p,
    assets: p.assets.sort((a, b) => a.position - b.position),
  }));
});
export const getPublishedPost = cache(async (slug: string) =>
  (await getPublishedPosts()).find((p) => p.slug === slug),
);
