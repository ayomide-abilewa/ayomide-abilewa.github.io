import type { Metadata } from 'next'
import { CtaRow } from '@/components/section/Cta'

/**
 * 404.
 *
 * Static export writes this to /404.html, which is exactly the file GitHub Pages
 * serves for an unknown path. A visitor should never feel trapped, so
 * this page is mostly exits, and it names the four paths rather than dumping them
 * back at the front door to choose again.
 */

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="shell flex min-h-[70vh] flex-col justify-center py-section">
      <p className="eyebrow flex items-center gap-2.5">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-content-faint" />
        <span>404 — no signal on this address</span>
      </p>

      <h1 className="mt-5 max-w-[30ch] text-h1 font-medium tracking-tight text-balance">
        Nothing is at this URL.
      </h1>

      <p className="mt-6 max-w-measure text-lead leading-snug text-content text-pretty">
        Either the link is wrong or the page moved. Everything on the site is reachable from
        here.
      </p>

      <CtaRow
        className="mt-9"
        label="Where to go instead"
        actions={[
          { label: 'Home', href: '/', weight: 'primary' },
          { label: 'Projects', href: '/work/' },
          { label: 'Engineering', href: '/engineering/' },
          { label: 'Research', href: '/research/' },
          { label: 'Scholarship', href: '/scholarship/' },
          { label: 'CV', href: '/cv/' },
          { label: 'Contact', href: '/contact/', weight: 'quiet' },
        ]}
      />
    </div>
  )
}
