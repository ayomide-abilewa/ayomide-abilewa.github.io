import { profile } from '@/data/profile'

/**
 * Scrolling strip of the stack, built from the skill groups in profile.ts.
 * The list is printed twice so the loop is seamless; the copy is hidden from
 * assistive tech, and the motion stops under reduced motion and lofi.
 */

const ITEMS = profile.skills
  .flatMap((g) => g.items)
  .filter((s) => !s.includes('(fundamentals)'))
  .slice(0, 22)

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap px-6">
          <span aria-hidden="true" className="mr-6 h-1 w-1 rounded-full bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export function Ticker() {
  return (
    <section aria-label="Tools and technologies" className="ticker border-y border-hairline bg-surface-sunken py-4">
      <div className="ticker-track flex w-max font-mono text-caption uppercase tracking-[0.1em] text-content-muted">
        <Row />
        <Row hidden />
      </div>
    </section>
  )
}
