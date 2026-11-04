import { ogCard, ogCardFor, ogCardNames } from '@/lib/og'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams(): { card: string }[] {
  return ogCardNames().map((name) => ({ card: `${name}.png` }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ card: string }> }) {
  const { card } = await params
  const def = ogCardFor(card.replace(/\.png$/, ''))
  if (!def) return new Response('Not found', { status: 404 })
  return ogCard(def)
}
