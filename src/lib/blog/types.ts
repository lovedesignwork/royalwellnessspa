export type BlogAsset = {
  id: string;
  post_id: string;
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  generated: boolean;
  position: number;
  fingerprint: string;
};
export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  category: string;
  body: string;
  related_slugs: string[];
  status: "draft" | "published";
  assets: BlogAsset[];
};
export const SITE_URL = "https://www.royalwellnessspaphuket.com";
export function wordCount(text: string) {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*|_`>-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
