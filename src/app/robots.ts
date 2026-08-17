import type { MetadataRoute } from 'next'

/**
 * robots.txt, generated at build time.
 *
 * Everything on this site is meant to be found — there is no private area and no
 * search-result or filter URLs worth excluding. The only disallow is Next's build
 * asset directory, which contains no indexable content and only wastes crawl
 * budget if a bot walks it.
 *
 * `force-static` is required, not optional: with `output: 'export'` Next treats a
 * metadata route as dynamic unless told otherwise, and refuses to collect it.
 */
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/_next/',
      },
    ],
    sitemap: 'https://ayomide-abilewa.github.io/sitemap.xml',
    host: 'https://ayomide-abilewa.github.io',
  }
}
