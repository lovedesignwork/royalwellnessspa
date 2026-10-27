import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/blog/types";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/xadmin", "/api/", "/payment/", "/th/payment/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
