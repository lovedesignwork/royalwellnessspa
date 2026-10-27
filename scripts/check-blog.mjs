import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const canonicalBase = 'https://www.royalwellnessspaphuket.com';
const posts = JSON.parse(await readFile(new URL('../content/blog/launch.json', import.meta.url)));
const images = JSON.parse(await readFile(new URL('../content/blog/image-ownership.json', import.meta.url)));
const page = async (path) => {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, `${path} must return 200`);
  return response.text();
};
const visibleMarkup = (html) => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, '');
const count = (html, pattern) => [...html.matchAll(pattern)].length;

assert.equal(new Set(images.map((a) => a.src)).size, images.length, 'Image URL reuse');
assert.equal(new Set(images.map((a) => a.fingerprint)).size, images.length, 'Image fingerprint reuse');
const archive = visibleMarkup(await page('/blog'));
assert(count(archive, /class="blog-card"/g) >= posts.length, 'Archive must retain launch articles');
const home = visibleMarkup(await page('/'));
assert.equal(count(home, /class="blog-card"/g), 3, 'Homepage must display three articles');
const sitemap = await page('/sitemap.xml');
assert(!/lastmod|private-verification-/.test(sitemap), 'Sitemap must omit timestamps and test drafts');

for (const post of posts) {
  const path = `/blog/${post.slug}`;
  const html = await page(path);
  const markup = visibleMarkup(html);
  assert.equal(count(markup, /<h1\b/g), 1, `${path}: H1`);
  assert(html.includes(`<link rel="canonical" href="${canonicalBase}${path}"`), `${path}: canonical`);
  assert(html.includes('property="og:image"') && html.includes('name="twitter:card"'), `${path}: social metadata`);
  assert(sitemap.includes(canonicalBase + path), `${path}: sitemap`);
  const schema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => JSON.parse(m[1]));
  assert(schema.some((s) => s['@type'] === 'Article'), `${path}: Article schema`);
  assert(schema.some((s) => s['@type'] === 'BreadcrumbList'), `${path}: breadcrumb schema`);
  assert(!/datePublished|dateModified|uploadDate/.test(JSON.stringify(schema)), `${path}: no schema dates`);
  assert(!/<time\b|\d+\s+min(?:ute)?s?\s+read|Published on|Updated on/i.test(markup), `${path}: no date/read-time labels`);
  const article = markup.match(/<article>([\s\S]*?)<\/article>/)?.[1];
  assert(article, `${path}: article content`);
  assert.equal(count(article, /<figure\b/g), 3, `${path}: distinct photos`);
  const body = article.split('<div class="article-body">')[1]?.split('<aside class="article-cta">')[0];
  assert(body, `${path}: crawlable body`);
  const text = body.replace(/<figure\b[\s\S]*?<\/figure>/g, '').replace(/<[^>]+>/g, ' ').replace(/&[^;]+;/g, ' ');
  const words = text.trim().split(/\s+/).length;
  assert(words >= 800 && words <= 1600, `${path}: ${words} body words`);
  console.log(`${post.slug}: ${words} words, 3 photos, metadata OK`);
}

for (const asset of images) {
  assert(asset.width <= 1600 && asset.height <= 1600, `${asset.src}: dimensions`);
  assert(asset.alt.trim().length > 10, `${asset.src}: alt text`);
  const response = await fetch(asset.src, { method: 'HEAD' });
  assert(response.ok && response.headers.get('content-type')?.includes('image/webp'), `${asset.src}: media available`);
  assert(Number(response.headers.get('content-length')) <= 250 * 1024, `${asset.src}: file size`);
}
const missing = await fetch(base + '/blog/private-verification-nonexistent');
assert.equal(missing.status, 404, 'Unknown articles must return 404');
const admin = await fetch(base + '/xadmin/blog', { redirect: 'manual' });
assert([302, 303, 307, 308].includes(admin.status), 'Unauthenticated admin must redirect');
assert(admin.headers.get('location')?.endsWith('/xadmin/login'), 'Admin redirect must lead to sign-in');
const robots = await page('/robots.txt');
assert(robots.includes('Disallow: /xadmin') && robots.includes('Sitemap:'), 'Crawler rules');
console.log(`PASS: ${posts.length} launch articles, ${images.length} unique images, homepage, sitemap, access and metadata on ${base}`);
