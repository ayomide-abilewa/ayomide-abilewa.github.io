'use client'

import { useEffect, useState } from 'react'

const fmt = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Africa/Lagos',
})

/** Local time in Lagos. Renders a placeholder on the server so hydration matches. */
export function LagosClock() {
  const [now, setNow] = useState<string | null>(null)
  useEffect(() => {
    const tick = () => setNow(fmt.format(new Date()))
    tick()
    const id = window.setInterval(tick, 15_000)
    return () => window.clearInterval(id)
  }, [])
  return <span suppressHydrationWarning>{now ?? '--:--'}</span>
}
