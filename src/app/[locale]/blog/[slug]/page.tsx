import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogImage from "@/components/blog/BlogImage";
import BlogCards from "@/components/blog/BlogCards";
import ArticleBody, { headingId } from "@/components/blog/ArticleBody";
import { getPublishedPost, getPublishedPosts } from "@/lib/blog/data";
import { SITE_URL } from "@/lib/blog/types";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string; locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedPost((await params).slug);
  if (!post) return { title: "Article not found", robots: { index: false } };
  const url = `${SITE_URL}/blog/${post.slug}`;
  const a = post.assets[0];
  return {
    title: post.seo_title,
    description: post.seo_description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.seo_title,
      description: post.seo_description,
      url,
      images: a
        ? [
            {
              url: new URL(a.src, SITE_URL).href,
              width: a.width,
              height: a.height,
              alt: a.alt,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo_title,
      description: post.seo_description,
      images: a ? [new URL(a.src, SITE_URL).href] : [],
    },
  };
}
export default async function ArticlePage({ params }: Props) {
  const post = await getPublishedPost((await params).slug);
  if (!post) notFound();
  const all = await getPublishedPosts();
  const related = all
    .filter((p) => post.related_slugs.includes(p.slug))
    .slice(0, 3);
  const headings = [...post.body.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
  const url = `${SITE_URL}/blog/${post.slug}`;
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      mainEntityOfPage: url,
      url,
      image: post.assets.map((a) => new URL(a.src, SITE_URL).href),
      inLanguage: "en",
      author: {
        "@type": "Organization",
        name: "Royal Wellness Spa",
        url: SITE_URL,
      },
      publisher: {
        "@type": "Organization",
        name: "Royal Wellness Spa",
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/Logo-Royal-Spa.png` },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${SITE_URL}/blog`,
        },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];
  return (
    <>
      <Header />
      <main className="blog-page" lang="en">
        <article>
          <header className="article-header">
            <nav aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/blog">Blog</Link>
              <span>/</span>
              <span>{post.category}</span>
            </nav>
            <p className="blog-eyebrow">{post.category}</p>
            <h1>{post.title}</h1>
            <p className="article-intro">{post.excerpt}</p>
            <p className="article-byline">By Royal Wellness Spa</p>
          </header>
          <div className="blog-container">
            {post.assets[0] && <BlogImage asset={post.assets[0]} featured />}
          </div>
          <div className="article-reading">
            <details className="blog-toc">
              <summary>
                In this article <span aria-hidden="true">＋</span>
              </summary>
              <ol>
                {headings.map((h) => (
                  <li key={h}>
                    <a href={`#${headingId(h)}`}>{h}</a>
                  </li>
                ))}
              </ol>
            </details>
            <ArticleBody body={post.body} assets={post.assets} />
            <aside className="article-cta">
              <p className="blog-eyebrow">MAKE TIME FOR YOURSELF</p>
              <h2>Your next quiet moment starts here.</h2>
              <p>
                Explore the menu or tell us what you would like from your visit.
              </p>
              <div>
                <Link href="/book" className="blog-button">
                  Book your spa visit ↗
                </Link>
                <Link href="/treatments" className="blog-read">
                  View treatments
                </Link>
              </div>
            </aside>
          </div>
        </article>
        {related.length > 0 && (
          <section className="related-articles blog-container">
            <p className="blog-eyebrow">CONTINUE EXPLORING</p>
            <h2>A little more to discover</h2>
            <BlogCards posts={related} />
          </section>
        )}
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
