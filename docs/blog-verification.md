# Blog verification

## Launch scope

Ten selected articles (topics 1, 2, 3, 4, 5, 7, 8, 9, 11 and 14), each approximately 1,000 words and containing three different images. The 30 image assignments are unique across articles; all are WebP and no edge exceeds 1,600 pixels. Generated close-ups are visibly disclosed as editorial illustrations.

## Checks completed before deployment

- Production Next.js build and TypeScript check passed. Targeted ESLint checks for the new blog and modified navigation passed.
- Browser checks covered all ten articles: one H1, canonical URL, date-free structured data, expandable contents, descriptive image alt text and successful image decoding.
- Archive retains ten articles; homepage displays three latest published articles.
- Desktop and 390-pixel mobile views checked for overflow, header overlap, readable article width, mobile navigation and table-of-contents anchor positioning. Wide comparison tables scroll within the reading column.
- Authenticated editor tested with a temporary administrator: sign-in, draft save, private draft returning 404, invalid publication rejection, image optimization/upload, duplicate rejection, alt/caption save, preview and successful publication of an unchanged approved article.
- Removed administrator access prevented further editor access. Anonymous writes were denied. Test users, draft records and uploaded fixtures were removed afterward.
- Supabase security review reported no new blog-specific warnings. Existing warnings outside the new objects were not changed.
- Booking regression reached guest details and payment options after selecting a treatment, date and time. No reservation or payment was submitted.

## Limits

- The repository-wide lint command still reports pre-existing errors outside the blog work. The new and modified blog code passes its targeted checks.
- No real payment transaction was performed.
- Existing source photos with smaller native dimensions were not upscaled to reach an arbitrary file-size target.
- Higgsfield accepted requests specifying Nano Banana Pro but returned Nano Banana 2 in result metadata. See the saved generation records.
- Production deployment status and live checks must be verified against the exact Git commit; a local build is not deployment evidence.

Use `node scripts/check-blog.mjs https://www.royalwellnessspaphuket.com` for a repeatable public HTTP check of the launch pages, sitemap, metadata and media. The launch snapshot is a baseline, so update this check if articles are intentionally removed or their slugs change.
