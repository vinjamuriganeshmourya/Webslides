import type { ReactNode } from 'react'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import { iconByName } from './icons'
import { colors } from '@/design/tokens'

/**
 * What the word `localhost` actually draws: a boundary.
 *
 * Inside the box, the browser and both dev servers are neighbours on one
 * machine. Outside it, a friend's browser sends the same request and it dies at
 * the boundary — because `localhost` resolved on *their* computer, and there is
 * nothing there.
 *
 * Scope note (R2): the failed request is the point of the figure. Nothing here
 * is a server, a globe or a public address — this is still Problem 1.
 */

function Tile({
  icon,
  label,
  port,
  color,
  muted = false,
}: {
  icon: keyof typeof iconByName
  label: string
  port?: string
  color: string
  muted?: boolean
}) {
  const Icon = iconByName[icon]
  return (
    <div
      className="flex items-center gap-2.5 rounded-xl border-2 bg-white px-3 py-2"
      style={{ borderColor: color, opacity: muted ? 0.55 : 1 }}
    >
      <span
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
        style={{ background: `${color}18`, color }}
      >
        <Icon width={17} height={17} />
      </span>
      <span className="leading-tight">
        <span className="block text-body-sm font-semibold text-ink">{label}</span>
        {port && (
          <span className="block font-mono text-xs" style={{ color }}>
            {port}
          </span>
        )}
      </span>
    </div>
  )
}

export interface MachineBoundaryTile {
  icon: 'devices' | 'code' | 'server'
  label: string
  port?: string
}

/**
 * PARAMETERISED 2026-09-10, defaults unchanged.
 *
 * The figure's ARGUMENT is the boundary, not the three programs behind it, and
 * a second deck needed to make the same argument about a different pair: an
 * automation server on `localhost:8080` that a webhook cannot reach. Rendering
 * React and Django dev servers on that slide would have been an honest figure
 * for a claim nobody was making, which is the illustration-honesty rule.
 *
 * Every prop defaults to what this component has always drawn, so existing
 * decks render byte for byte as before.
 */
export function MachineBoundary({
  className = '',
  inside = [
    { icon: 'devices', label: 'Your browser' },
    { icon: 'code', label: 'React dev server', port: 'localhost:3000' },
    { icon: 'server', label: 'Django runserver', port: 'localhost:8000' },
  ],
  insideNote = 'Neighbours inside one box',
  outsider = { icon: 'devices', label: "A friend's browser", port: 'localhost:3000' },
  outsiderNote,
  failure = 'connection refused',
}: {
  className?: string
  /** The programs sharing the machine. */
  inside?: MachineBoundaryTile[]
  insideNote?: string
  /** The one outside that cannot get in. */
  outsider?: MachineBoundaryTile
  /** Defaults to the "their localhost is their machine" line. */
  outsiderNote?: ReactNode
  failure?: string
}) {
  return (
    <RevealGroup className={`flex flex-col items-center gap-3 ${className}`} stagger={0.12}>
      {/* Inside the boundary */}
      <Reveal dir="up" className="w-full">
        <div
          className="relative rounded-card border-[2.5px] border-dashed px-4 pb-4 pt-6"
          style={{ borderColor: colors.brand, background: '#F4F8FF' }}
        >
          <span
            className="absolute -top-[11px] left-4 rounded-pill px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white"
            style={{ background: colors.brand }}
          >
            Your machine
          </span>
          <div className="flex flex-col gap-2">
            {inside.map((t, i) => (
              <Tile
                key={i}
                icon={t.icon}
                label={t.label}
                port={t.port}
                color={i === 0 ? colors.brand : colors.teal}
              />
            ))}
          </div>
          <p className="mt-2.5 text-center text-xs font-semibold text-brand-600">
            {insideNote}
          </p>
        </div>
      </Reveal>

      {/* The request that dies at the boundary */}
      <Reveal dir="up" className="flex w-full items-center justify-center gap-3">
        <svg width="30" height="34" viewBox="0 0 30 34" fill="none" aria-hidden>
          <path
            d="M15 32V10M15 10 8 17M15 10l7 7"
            stroke={colors.danger}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="5 4"
          />
          <path
            d="m9 4 12 12M21 4 9 16"
            stroke={colors.danger}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <span className="font-mono text-body-sm font-semibold" style={{ color: colors.danger }}>
          {failure}
        </span>
      </Reveal>

      <Reveal dir="up" className="w-full">
        <div className="mx-auto w-[62%]">
          <Tile icon={outsider.icon} label={outsider.label} port={outsider.port} color={colors.muted} muted />
        </div>
        <p className="mt-1.5 text-center text-xs text-body">
          {outsiderNote ?? (
            <>
              Their <span className="font-mono">localhost</span> is their machine
            </>
          )}
        </p>
      </Reveal>
    </RevealGroup>
  )
}
