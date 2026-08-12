import type { NextConfig } from 'next'

/**
 * Static export for GitHub Pages.
 *
 * This is a *user* site (ayomide-abilewa.github.io), so it is served from the
 * domain root — no basePath or assetPrefix required. If this ever moves to a
 * project repo, set basePath/assetPrefix to '/<repo-name>'.
 *
 * `images.unoptimized` is mandatory: the Next image optimizer needs a server,
 * which a static export does not have. Responsive variants are produced ahead
 * of time by scripts/build-images.ts instead.
 */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
}

export default nextConfig
