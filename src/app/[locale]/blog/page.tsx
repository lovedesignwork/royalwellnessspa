import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCards from "@/components/blog/BlogCards";
import { getPublishedPosts } from "@/lib/blog/data";
import { SITE_URL } from "@/lib/blog/types";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "The Wellness Journal | Royal Wellness Spa Phuket",
  description:
    "Explore practical guides to Thai massage, couples treatments, aromatherapy and relaxing spa visits in Phuket Town.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "The Wellness Journal | Royal Wellness Spa",
    description:
      "Thoughtful guides to treatments and making time for yourself in Phuket Town.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};
export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return (
    <>
      <Header />
      <main className="blog-page">
        <div className="blog-container">
          <header className="blog-archive-header">
            <p className="blog-eyebrow">ROYAL WELLNESS SPA · PHUKET TOWN</p>
            <h1>
              The Wellness
              <br />
              <em>Journal</em>
            </h1>
            <p>
              Know your treatment. Find your moment.
              <br />
              Practical advice for a more comfortable, considered spa
              experience.
            </p>
          </header>
          <div className="blog-archive-label">
            <span>ALL ARTICLES</span>
            <span>Treatments · Travel · Time together</span>
          </div>
          <BlogCards posts={posts} />
        </div>
      </main>
      <Footer />
    </>
  );
}
