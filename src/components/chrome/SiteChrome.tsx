'use client'

import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { RouteSweep } from '@/components/motion/RouteSweep'
import { PageEnter } from '@/components/motion/PageEnter'

/**
 * Page frame. Skip link first in the tab order, then persistent nav, then the
 * page, then the footer.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <RouteSweep />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-control focus:border focus:border-accent focus:bg-surface-raised focus:px-3 focus:py-2 focus:text-caption focus:text-content"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <PageEnter>{children}</PageEnter>
      </main>
      <Footer />
    </div>
  )
}
