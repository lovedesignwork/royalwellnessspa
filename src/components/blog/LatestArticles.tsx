import Link from "next/link";
import { getPublishedPosts } from "@/lib/blog/data";
import BlogCards from "./BlogCards";
import type { BlogPost } from "@/lib/blog/types";
export default async function LatestArticles() {
  let posts: BlogPost[];
  try {
    posts = (await getPublishedPosts()).slice(0, 3);
  } catch (error) {
    // A journal outage must not take the spa homepage and booking links offline.
    console.error("Unable to load homepage articles", error);
    return null;
  }
  if (!posts.length) return null;
  return (
    <section className="latest-articles" aria-labelledby="latest-title">
      <div className="blog-container">
        <div className="blog-section-heading">
          <div>
            <p className="blog-eyebrow">THE ROYAL WELLNESS JOURNAL</p>
            <h2 id="latest-title">
              A little knowledge.
              <br />
              <em>A deeper sense of ease.</em>
            </h2>
          </div>
          <div>
            <p>
              Thoughtful guides to treatments, travel and making time for
              yourself in Phuket.
            </p>
            <Link href="/blog" className="blog-read">
              Explore the blog ↗
            </Link>
          </div>
        </div>
        <BlogCards posts={posts} />
      </div>
    </section>
  );
}
