'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { useMode } from '@/lib/mode'
import { track } from '@/lib/analytics'

/** A case-study link that counts the click; the only client code the flagship cards need. */
export function ProjectLink({
  slug,
  ...props
}: Omit<ComponentProps<typeof Link>, 'href' | 'onClick'> & { slug: string }) {
  const { mode } = useMode()
  return (
    <Link
      {...props}
      href={`/work/${slug}/`}
      prefetch={false}
      onClick={() => track({ name: 'project_opened', slug, mode })}
    />
  )
}
