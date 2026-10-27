import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";
export default function BlogCards({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="blog-grid">
      {posts.map((post) => (
        <article key={post.id} className="blog-card">
          <Link
            href={`/blog/${post.slug}`}
            className="blog-card-image"
            tabIndex={-1}
            aria-hidden="true"
          >
            {post.assets[0] && (
              <Image
                src={post.assets[0].src}
                alt=""
                width={post.assets[0].width}
                height={post.assets[0].height}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
              />
            )}
          </Link>
          <div className="blog-card-copy">
            <p className="blog-eyebrow">{post.category}</p>
            <h3>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h3>
            <p>{post.excerpt}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="blog-read"
              aria-label={`Read ${post.title}`}
            >
              Read the article <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
