'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Architecture, ArchNode, ArchNodeKind } from '@/data/types'

/**
 * Block-diagram renderer.
 *
 * Architecture is stored as nodes and edges in profile.ts, not as an image, for
 * three reasons: the text stays selectable and searchable, it costs no image
 * bytes, and a diagram that is data cannot drift out of sync with the project it
 * describes.
 *
 * Layout is a CSS grid — the browser decides the box sizes. Edges are then
 * measured from the real DOM and drawn in pixel space, so lines meet block edges
 * exactly at any width instead of being hand-placed at one breakpoint.
 *
 * Small screens get a genuinely different presentation: the same
 * graph written out as an ordered signal path, which reads better on a phone than
 * a shrunken four-column diagram. That list is also what screen readers get on
 * desktop, so nothing here lives only inside the graphic.
 */

type Rect = { left: number; right: number; top: number; bottom: number; cx: number; cy: number }

const KIND_LABEL: Record<ArchNodeKind, string> = {
  sensor: 'Sensor',
  compute: 'Compute',
  actuator: 'Actuator',
  model: 'Model',
  storage: 'Store',
  service: 'Service',
  ui: 'Interface',
  output: 'Output',
}

/** Restrained differentiation: a left rule and a label, not eight colour schemes. */
const KIND_STYLE: Record<ArchNodeKind, string> = {
  sensor: 'border-l-2 border-l-accent',
  compute: 'border-l-2 border-l-content-muted bg-surface-raised',
  actuator: 'border-l-2 border-l-accent-strong',
  model: 'border-l-2 border-l-content-muted border-dashed bg-surface-raised',
  storage: 'border-l-2 border-l-content-faint',
  service: 'border-l-2 border-l-content-faint border-dashed',
  ui: 'border-l-2 border-l-content',
  output: 'border-l-2 border-l-accent-strong',
}

const EDGE_DASH: Record<NonNullable<Architecture['edges'][number]['kind']>, string> = {
  data: '',
  signal: '',
  control: '4 3',
  power: '1 3',
}

function rectOf(el: HTMLElement, origin: DOMRect): Rect {
  const r = el.getBoundingClientRect()
  return {
    left: r.left - origin.left,
    right: r.right - origin.left,
    top: r.top - origin.top,
    bottom: r.bottom - origin.top,
    cx: r.left - origin.left + r.width / 2,
    cy: r.top - origin.top + r.height / 2,
  }
}

/** Orthogonal routing: straight where possible, one rounded dog-leg otherwise. */
function routeEdge(a: Rect, b: Rect): { d: string; mid: { x: number; y: number } } {
  const sameRow = Math.abs(a.cy - b.cy) < 8
  const sameCol = Math.abs(a.cx - b.cx) < 8

  if (sameRow) {
    const forward = b.cx > a.cx
    const x1 = forward ? a.right : a.left
    const x2 = forward ? b.left : b.right
    return { d: `M ${x1} ${a.cy} L ${x2} ${a.cy}`, mid: { x: (x1 + x2) / 2, y: a.cy } }
  }

  if (sameCol) {
    const down = b.cy > a.cy
    const y1 = down ? a.bottom : a.top
    const y2 = down ? b.top : b.bottom
    return { d: `M ${a.cx} ${y1} L ${a.cx} ${y2}`, mid: { x: a.cx, y: (y1 + y2) / 2 } }
  }

  const forward = b.cx > a.cx
  const x1 = forward ? a.right : a.left
  const x2 = forward ? b.left : b.right
  const midX = (x1 + x2) / 2
  const dirX = forward ? 1 : -1
  const dirY = b.cy > a.cy ? 1 : -1
  // Corner radius, clamped so short edges do not fold back on themselves.
  const r = Math.min(7, Math.abs(x2 - x1) / 2.5, Math.abs(b.cy - a.cy) / 2.5)
  const d = [
    `M ${x1} ${a.cy}`,
    `L ${midX - dirX * r} ${a.cy}`,
    `Q ${midX} ${a.cy} ${midX} ${a.cy + dirY * r}`,
    `L ${midX} ${b.cy - dirY * r}`,
    `Q ${midX} ${b.cy} ${midX + dirX * r} ${b.cy}`,
    `L ${x2} ${b.cy}`,
  ].join(' ')
  return { d, mid: { x: midX, y: (a.cy + b.cy) / 2 } }
}

function NodeBlock({ node }: { node: ArchNode }) {
  return (
    <>
      <span className="eyebrow block">{KIND_LABEL[node.kind]}</span>
      <span className="mt-1.5 block text-caption font-medium leading-tight text-content">
        {node.label}
      </span>
      {node.detail && (
        <span className="mt-1 block font-mono text-micro leading-tight text-content-faint">
          {node.detail}
        </span>
      )}
    </>
  )
}

export function ArchitectureDiagram({ architecture }: { architecture: Architecture }) {
  const { caption, cols, rows, nodes, edges } = architecture
  const containerRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef(new Map<string, HTMLElement>())
  const [paths, setPaths] = useState<
    { key: string; d: string; label?: string; mid: { x: number; y: number }; dash: string }[]
  >([])
  const [box, setBox] = useState({ w: 0, h: 0 })

  const measure = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const origin = container.getBoundingClientRect()
    if (origin.width === 0) return

    const rects = new Map<string, Rect>()
    nodeRefs.current.forEach((el, id) => rects.set(id, rectOf(el, origin)))

    const next = edges.flatMap((edge, i) => {
      const a = rects.get(edge.from)
      const b = rects.get(edge.to)
      if (!a || !b) return []
      const { d, mid } = routeEdge(a, b)
      return [
        {
          key: `${edge.from}-${edge.to}-${i}`,
          d,
          label: edge.label,
          mid,
          dash: EDGE_DASH[edge.kind ?? 'data'],
        },
      ]
    })

    setBox({ w: origin.width, h: origin.height })
    setPaths(next)
  }, [edges])

  useEffect(() => {
    measure()
    const container = containerRef.current
    if (!container || typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure, { passive: true })
      return () => window.removeEventListener('resize', measure)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    // Fonts land after first paint and change block heights.
    document.fonts?.ready.then(measure).catch(() => {})
    return () => observer.disconnect()
  }, [measure])

  const registerNode = useCallback((id: string, el: HTMLElement | null) => {
    if (el) nodeRefs.current.set(id, el)
    else nodeRefs.current.delete(id)
  }, [])

  return (
    <figure className="not-prose">
      {/* Desktop: measured block diagram. */}
      <div
        ref={containerRef}
        aria-hidden="true"
        className="relative hidden grid-field-fine rounded-panel border border-hairline bg-surface-sunken/40 p-6 md:grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, auto))`,
          columnGap: 'clamp(2rem, 6vw, 5.5rem)',
          rowGap: '1.75rem',
        }}
      >
        {/* Edges sit behind the blocks, in the container's own pixel space. */}
        {box.w > 0 && (
          <svg
            className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
            viewBox={`0 0 ${box.w} ${box.h}`}
            width={box.w}
            height={box.h}
            fill="none"
          >
            <defs>
              <marker
                id="arch-arrow"
                viewBox="0 0 8 8"
                refX="7"
                refY="4"
                markerWidth="8"
                markerHeight="8"
                markerUnits="userSpaceOnUse"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 7 4 L 0 7 z" fill="rgb(var(--content-faint))" />
              </marker>
            </defs>
            {paths.map((p) => (
              <g key={p.key}>
                <path
                  d={p.d}
                  stroke="rgb(var(--content-faint))"
                  strokeWidth="1.25"
                  strokeDasharray={p.dash || undefined}
                  markerEnd="url(#arch-arrow)"
                />
                {p.label && (
                  <text
                    x={p.mid.x}
                    y={p.mid.y - 6}
                    textAnchor="middle"
                    className="font-mono"
                    fontSize="10"
                    letterSpacing="0.06em"
                    fill="rgb(var(--content-muted))"
                    stroke="rgb(var(--surface))"
                    strokeWidth="4"
                    paintOrder="stroke"
                  >
                    {p.label}
                  </text>
                )}
              </g>
            ))}
          </svg>
        )}

        {nodes.map((node) => (
          <div
            key={node.id}
            ref={(el) => registerNode(node.id, el)}
            className={`relative z-10 rounded-control bg-surface px-3.5 py-3 ${KIND_STYLE[node.kind]}`}
            // Node coordinates are zero-based in the data; CSS grid lines are not.
            style={{ gridColumn: node.col + 1, gridRow: node.row + 1 }}
          >
            <NodeBlock node={node} />
          </div>
        ))}
      </div>

      {/*
        Mobile view, and the accessible description on desktop. Written as an
        ordered signal path rather than a grid, because that is what a diagram
        this shape is actually telling you.
      */}
      <div className="md:sr-only">
        <ol className="space-y-3 border-l border-hairline pl-4">
          {nodes.map((node) => {
            const out = edges.filter((e) => e.from === node.id)
            return (
              <li key={node.id} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[1.0625rem] top-2 h-1.5 w-1.5 rounded-full bg-accent"
                />
                <span className="eyebrow block">{KIND_LABEL[node.kind]}</span>
                <span className="mt-0.5 block text-caption font-medium text-content">
                  {node.label}
                  {node.detail && (
                    <span className="font-normal text-content-faint"> — {node.detail}</span>
                  )}
                </span>
                {out.length > 0 && (
                  <span className="mt-1 block font-mono text-micro text-content-muted">
                    {out
                      .map((e) => {
                        const target = nodes.find((n) => n.id === e.to)
                        const name = target ? target.label : e.to
                        return e.label ? `→ ${name} (${e.label})` : `→ ${name}`
                      })
                      .join('  ')}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </div>

      <figcaption className="mt-4 border-t border-hairline pt-3 text-caption text-content-muted text-pretty">
        {caption}
      </figcaption>
    </figure>
  )
}
