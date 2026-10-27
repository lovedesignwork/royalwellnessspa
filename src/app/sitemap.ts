import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog/data";
import { SITE_URL } from "@/lib/blog/types";
import { treatments } from "@/lib/spa-data";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  return [
    ...["", "/about", "/contact", "/treatments", "/book"].flatMap((p) => [
      { url: SITE_URL + p },
      { url: SITE_URL + "/th" + p },
    ]),
    ...treatments.map((t) => ({ url: `${SITE_URL}/treatments/${t.id}` })),
    { url: `${SITE_URL}/blog` },
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}` })),
  ];
}
