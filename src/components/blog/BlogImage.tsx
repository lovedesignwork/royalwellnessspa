import Image from "next/image";
import type { BlogAsset } from "@/lib/blog/types";
export default function BlogImage({
  asset,
  featured = false,
}: {
  asset: BlogAsset;
  featured?: boolean;
}) {
  return (
    <figure className={`blog-figure ${featured ? "blog-featured" : ""}`}>
      <Image
        src={asset.src}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        sizes={
          featured
            ? "(max-width: 768px) 100vw, 1120px"
            : "(max-width: 768px) 100vw, 760px"
        }
        priority={featured}
        className="h-auto w-full"
      />
      <figcaption>
        {asset.caption}
        {asset.generated
          ? " · AI-generated editorial illustration; not a photograph of the premises or its guests."
          : ""}
      </figcaption>
    </figure>
  );
}
