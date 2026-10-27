# Publishing the Royal Wellness journal

The live source of articles is Supabase (`spa_blog_posts`, `spa_blog_assets` and the `spa-blog` Storage bucket in the existing Royal Phuket City project). Content publishing does not require a GitHub commit, build or deployment. The repository's `content/blog` directory is the launch backup and image provenance record, not the live CMS.

## Publish an article

1. Open https://www.royalwellnessspaphuket.com/xadmin/blog and sign in with an existing Royal administrator account. Access requires a matching `admin_users` entry with the `admin`, `superadmin` or `editor` role. There is no public signup.
2. Select **New article**. Enter its title, permanent URL slug, category, short introduction, SEO title and meta description.
3. Write 800–1,600 words in the content field. Use `## Heading`, `### Subheading`, Markdown lists, tables and `[link text](/treatments)` links. The title supplies the only H1.
4. Save a draft. Upload 3–5 distinct photographs, each under 4 MB. The first is the featured image. Uploads convert to WebP, preserve orientation, avoid upscaling and resize to a maximum 1,600-pixel edge. Large outputs are compressed toward 250 KB.
5. Enter descriptive alt text and a useful caption for each photo, tick **AI-generated editorial illustration** when appropriate, then select **Save image details** for each image. Generated images receive a visible disclosure automatically.
6. Place `{{image:1}}`, `{{image:2}}` and any further supporting images on separate lines in the article. Each supporting image must occur once. Do not insert image 0; the featured image appears automatically.
7. Enter relevant related article slugs, separated by commas. Use **Preview**, review the content and photographs, then select **Publish**.
8. Open **View live**. The article appears in the archive and sitemap immediately. A newly published article enters the homepage's latest three; editing an older article does not reset its original order.

**Save draft also unpublishes an existing article. Uploading an image saves the article as a draft.** Republish after editing. Draft bodies are unavailable through public pages or anonymous database reads. Uploaded media URLs are public, so do not upload confidential files.

## Photo ownership

Every uploaded image belongs to one article. The database enforces unique image URLs and normalized image fingerprints. Duplicate uploads are rejected. Cropping, recoloring or renaming another article's photo is still reuse: compare visually against the existing library before uploading. The featured photo can appear on its own article card and social preview.

The launch uses 30 unique photos: 19 existing originals and 11 generated editorial illustrations. See `content/blog/image-ownership.json` for the initial assignment, source, dimensions, bytes and fingerprint. Future ownership is recorded in `spa_blog_assets`. Some original photos are smaller than 100 KB; their native resolution was retained rather than enlarged artificially.

The generated close-ups use the existing cream, warm wood, beige fabric and coral palette without inventing recognizable facilities or people. Higgsfield requests specified `nano_banana_pro`; the returned job metadata identified `nano_banana_2`. The exact request/result discrepancy is recorded in `content/blog/generated-media.json`; Pro execution could not be independently confirmed.

## Public presentation

Dates, timestamps and reading-time estimates are omitted from cards, pages and Article structured data. An internal numeric publication order provides sorting. Articles are written in English; the existing Thai navigation remains available and article canonicals point to the English URLs.

The editor validates word count, SEO fields, image count, alt text and supporting-image placement. Review factual claims, medical wording, links, image rights and visual relevance before publishing. It does not replace editorial review.

## Maintenance

Application changes follow the established GitHub `main` → existing Vercel production project workflow. This is separate from ordinary content publishing. Verify the exact deployment commit after every code push.

The migration is `supabase/migrations/20261027170232_spa_blog.sql`. It adds dedicated blog objects and policies without modifying booking tables. `scripts/prepare-blog.mjs` was the one-time launch preparation utility; it depends on temporary source assets and generates new IDs. Do not rerun it against the live database as a synchronization command.

The current editor supports adding images and editing their text. Image removal/reordering and a visual rich-text editor are not included.
