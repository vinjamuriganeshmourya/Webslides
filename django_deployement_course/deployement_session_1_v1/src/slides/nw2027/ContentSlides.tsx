import type { CSSProperties, ReactNode } from 'react'
import { Card, InstructorTile, Slide2027, SlideHeading } from '@/ui/nw2027/Frame'
import { nwColors, nwFonts, nwGradients, nwLayout, nwShadow, nwType } from '@/design/nw2027'

/** Top of the content well, measured below the kicker + rule + title block. */
export const NW_CONTENT_TOP = 330

export interface NwContentChrome {
  /** Session name shown above the rule ("Battery Technology"). */
  kicker?: ReactNode
  /** Section number rendered before the title. */
  index?: number | string
  title: ReactNode
  /** Instructor still shown top-right. Pass `''` for an empty placeholder tile. */
  instructor?: string
  /** Segmented bottom bar: `{ total, current }` (1-based). */
  progress?: { total: number; current: number }
  /** 3D character asset anchored bottom-right, behind the content well. */
  mascot?: string
  /** Use the full-height instructor treatment instead of the compact tile. */
  instructorTall?: boolean
}

/** The 3D character that stands at the bottom-right of some content slides. */
function Mascot({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      className="pointer-events-none absolute select-none"
      style={{ right: 124, bottom: 0, height: 640, width: 'auto', objectFit: 'contain' }}
    />
  )
}

/**
 * The standard content slide: session kicker, gradient rule, numbered title,
 * instructor tile, segmented progress bar — and a free content well.
 *
 * Figma: "Slide 16:9 - 69" and siblings.
 */
export function ContentSlide2027({
  kicker,
  index,
  title,
  instructor,
  instructorTall,
  progress,
  mascot,
  children,
  contentStyle,
}: NwContentChrome & { children?: ReactNode; contentStyle?: CSSProperties }) {
  return (
    <Slide2027 variant="light" progress={progress}>
      <SlideHeading kicker={kicker} index={index} title={title} />
      {instructor !== undefined && (
        <InstructorTile src={instructor || undefined} tall={instructorTall} />
      )}
      {mascot && <Mascot src={mascot} />}
      <div
        className="absolute"
        style={{
          left: nwLayout.marginX,
          right: nwLayout.marginX,
          top: NW_CONTENT_TOP,
          bottom: nwLayout.marginBottom + 40,
          ...contentStyle,
        }}
      >
        {children}
      </div>
    </Slide2027>
  )
}

export interface NwColumn {
  label: ReactNode
  /** Relative width. Defaults to 1. */
  weight?: number
}

/**
 * Table slide — a blue header band of separated pills over white row cards.
 * Each cell is its own rounded card with a gap, matching the Figma treatment
 * (there are no ruled borders).
 *
 * Figma: "Slide 16:9 - Agenda" (the HTTP status-code table).
 */
export function TableSlide2027({
  columns,
  rows,
  align = 'center',
  ...chrome
}: NwContentChrome & {
  columns: NwColumn[]
  rows: ReactNode[][]
  align?: 'center' | 'left'
}) {
  const gap = 14
  const template = columns.map((c) => `${c.weight ?? 1}fr`).join(' ')
  const cell: CSSProperties = {
    display: 'grid',
    placeItems: align === 'center' ? 'center' : 'center start',
    paddingInline: align === 'center' ? 24 : 44,
    textAlign: align,
  }

  return (
    <ContentSlide2027 {...chrome}>
      <div style={{ display: 'grid', gap, height: '100%', gridTemplateRows: `128px repeat(${rows.length}, 1fr)` }}>
        <div style={{ display: 'grid', gridTemplateColumns: template, gap }}>
          {columns.map((c, i) => {
            // A comparison table's top-left corner is usually blank. Painting
            // it with the brand gradient makes an empty pill that pulls the eye
            // to the one cell with nothing to say, so blank headers stay clear.
            const blank = c.label == null || c.label === ''
            return (
              <div
                key={i}
                style={{
                  ...cell,
                  ...nwType('subHeadL'),
                  color: nwColors.white,
                  background: blank ? 'transparent' : nwGradients.brand,
                  borderRadius: nwLayout.radius.card,
                }}
              >
                {c.label}
              </div>
            )
          })}
        </div>
        {rows.map((row, r) => (
          <div key={r} style={{ display: 'grid', gridTemplateColumns: template, gap }}>
            {row.map((cellContent, c) => (
              <Card key={c} style={{ ...cell, ...nwType('subHeadL'), color: nwColors.primaryDarkBlue }}>
                {cellContent}
              </Card>
            ))}
          </div>
        ))}
      </div>
    </ContentSlide2027>
  )
}

/**
 * Terminal / code slide — a white card with a chrome bar, over a dark code
 * body. Command lines are prefixed with the Figma's `»` marker.
 *
 * Figma: "Slide 16:9 - 69".
 */
/**
 * One line in a terminal panel.
 *
 * The original layout prefixed *every* line with the Figma's `»` command
 * marker, which is right for a slide showing only commands but wrong the moment
 * output is shown alongside — a pulled image digest or a `SyntaxError` marked
 * as something you type is actively misleading. `kind` separates the two, and
 * plain strings still mean "a command", so existing decks are unaffected.
 */
export type NwTerminalLine =
  | string
  | {
      text: string
      /** `cmd` gets the » marker; `out` is unprefixed; `note` is dimmed. */
      kind?: 'cmd' | 'out' | 'note'
      tone?: 'default' | 'success' | 'error'
    }

export function TerminalSlide2027({
  lead,
  label = 'Terminal',
  lines,
  width = 1120,
  fontSize = 34,
  ...chrome
}: NwContentChrome & {
  /** Sentence above the terminal ("Run these commands in the Terminal"). */
  lead?: ReactNode
  label?: ReactNode
  lines: NwTerminalLine[]
  width?: number
  /** Drop to ~26 when a slide shows a long verbatim output block. */
  fontSize?: number
}) {
  return (
    <ContentSlide2027 {...chrome}>
      {lead && (
        <p
          style={{
            ...nwType('subHeadXl'),
            color: nwColors.primaryBlue,
            textAlign: 'center',
            width,
            margin: '0 0 40px',
          }}
        >
          {lead}
        </p>
      )}
      <div style={{ width, borderRadius: nwLayout.radius.panel, overflow: 'hidden', boxShadow: nwShadow.card }}>
        <div
          style={{
            ...nwType('subHeadS'),
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: nwColors.white,
            color: nwColors.primaryDarkBlue,
            padding: '18px 30px',
            fontFamily: nwFonts.mono,
          }}
        >
          <span style={{ opacity: 0.55 }}>{'</>'}</span>
          {label}
        </div>
        <pre
          style={{
            margin: 0,
            background: '#0E1A2B',
            color: '#EAF1FF',
            padding: '34px 30px',
            fontFamily: nwFonts.mono,
            fontSize,
            lineHeight: 1.75,
            whiteSpace: 'pre-wrap',
          }}
        >
          {lines.map((line, i) => {
            const l = typeof line === 'string' ? { text: line, kind: 'cmd' as const } : line
            const kind = l.kind ?? 'cmd'
            const tone =
              l.tone === 'success' ? '#5AD68A' : l.tone === 'error' ? '#FF8A8A' : undefined
            return (
              <div
                key={i}
                style={{
                  color: tone ?? (kind === 'out' ? '#B9C8E4' : kind === 'note' ? '#8496B5' : '#EAF1FF'),
                  ...(kind === 'note' ? { fontStyle: 'italic' } : null),
                }}
              >
                {kind === 'cmd' ? (
                  <span style={{ color: nwColors.primaryBlue, marginRight: 22 }}>»</span>
                ) : (
                  // Output is indented to the command's text column rather than
                  // marked, so the eye still groups it under its command.
                  <span style={{ display: 'inline-block', width: 22 + 22 }} />
                )}
                {l.text}
              </div>
            )
          })}
        </pre>
      </div>
    </ContentSlide2027>
  )
}

/** The content well's inner size, derived from the margins above. */
const WELL = { w: 1920 - nwLayout.marginX * 2, h: 1080 - NW_CONTENT_TOP - (nwLayout.marginBottom + 40) }

/** The filled blue check used as the bullet marker on takeaway slides. */
function CheckMark({ size = 48 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center"
      style={{ width: size, height: size, borderRadius: '50%', background: nwColors.primaryBlue }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 12.5l4.5 4.5L19 7.5"
          stroke="#FFFFFF"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

/**
 * Key-takeaways slide — a checked list, optionally with the 3D character
 * standing at the bottom-right.
 *
 * Figma: "Slide 16:9 - 66" (Key Takeaways).
 */
export function BulletsSlide2027({
  points,
  ...chrome
}: NwContentChrome & { points: ReactNode[] }) {
  return (
    <ContentSlide2027 {...chrome} contentStyle={{ right: chrome.mascot ? 700 : nwLayout.marginX }}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 44 }}>
        {points.map((p, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 30 }}>
            <span style={{ marginTop: 2 }}>
              <CheckMark />
            </span>
            <span style={{ ...nwType('subHeadM'), color: nwColors.primaryDarkBlue }}>{p}</span>
          </li>
        ))}
      </ul>
    </ContentSlide2027>
  )
}

export interface NwHierarchyLeaf {
  label: ReactNode
  /** Optional icon element rendered in the leaf's chip. */
  icon?: ReactNode
}

/**
 * Hierarchy slide — a centred lead, a circled root node, and dotted connectors
 * fanning down to pill-shaped leaves.
 *
 * Figma: "Slide 16:9 - 67" (Basic Cell Structure).
 */
export function HierarchySlide2027({
  lead,
  root,
  leaves,
  ...chrome
}: NwContentChrome & {
  lead?: ReactNode
  /** Icon rendered inside the root circle. */
  root?: ReactNode
  leaves: (NwHierarchyLeaf | string)[]
}) {
  const items = leaves.map((l) => (typeof l === 'string' ? { label: l } : l))
  const rootY = lead ? 210 : 140
  const leafY = WELL.h - 90
  const rootR = 70
  // The full-height instructor treatment eats the right of the slide, so the
  // diagram has to centre on what's left rather than on the whole well.
  const wellW = chrome.instructorTall ? WELL.w - 500 : WELL.w
  // Leaves are spread across the middle 78% of the available width.
  const span = wellW * 0.78
  const xFor = (i: number) =>
    items.length === 1 ? wellW / 2 : wellW / 2 - span / 2 + (span * i) / (items.length - 1)

  return (
    <ContentSlide2027
      {...chrome}
      contentStyle={{ right: nwLayout.marginX + (chrome.instructorTall ? 500 : 0) }}
    >
      {lead && (
        <p
          style={{
            ...nwType('subHeadM'),
            color: nwColors.primaryDarkBlue,
            textAlign: 'center',
            margin: 0,
            width: '100%',
            whiteSpace: 'pre-line',
          }}
        >
          {lead}
        </p>
      )}

      <svg
        className="pointer-events-none absolute inset-0"
        width={wellW}
        height={WELL.h}
        viewBox={`0 0 ${wellW} ${WELL.h}`}
        fill="none"
        aria-hidden
      >
        {items.map((_, i) => (
          <line
            key={i}
            x1={wellW / 2}
            y1={rootY + rootR}
            x2={xFor(i)}
            y2={leafY - 46}
            stroke={nwColors.primaryDarkBlue}
            strokeWidth={2}
            strokeDasharray="4 10"
            strokeLinecap="round"
            opacity={0.55}
          />
        ))}
      </svg>

      {/* Root node */}
      <div
        className="absolute grid place-items-center"
        style={{
          left: wellW / 2 - rootR,
          top: rootY - rootR,
          width: rootR * 2,
          height: rootR * 2,
          borderRadius: '50%',
          background: nwColors.white,
          border: `4px solid ${nwColors.primaryBlue}`,
          color: nwColors.primaryBlue,
          boxShadow: nwShadow.cardSoft,
        }}
      >
        {root}
      </div>

      {/* Leaves */}
      {items.map((leaf, i) => (
        <div
          key={i}
          className="absolute flex items-center"
          style={{
            left: xFor(i),
            top: leafY,
            transform: 'translate(-50%, -50%)',
            gap: 22,
            padding: '20px 42px 20px 20px',
            borderRadius: nwLayout.radius.tag,
            background: '#E9EEF8',
          }}
        >
          <span
            className="grid shrink-0 place-items-center"
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: nwGradients.brand,
              color: nwColors.white,
            }}
          >
            {leaf.icon}
          </span>
          <span
            style={{
              ...nwType('subHeadS'),
              color: nwColors.primaryDarkBlue,
              fontStyle: 'italic',
              whiteSpace: 'pre-line',
            }}
          >
            {leaf.label}
          </span>
        </div>
      ))}
    </ContentSlide2027>
  )
}

/**
 * Bulleted / card-grid content slide — evenly sized white cards in a row or
 * grid, each with an optional number chip.
 */
export function CardsSlide2027({
  cards,
  columns = 3,
  dense = false,
  ...chrome
}: NwContentChrome & {
  cards: { title: ReactNode; body?: ReactNode }[]
  columns?: number
  /**
   * Two-row grids (6 cards) overflow the content well at the default sizing —
   * the second row is clipped by the progress bar. `dense` shrinks the chip,
   * padding and title so two rows fit, and is only correct with copy trimmed to
   * roughly three lines a card.
   */
  dense?: boolean
}) {
  const pad = dense ? 30 : 44
  const chip = dense ? 54 : 76
  return (
    <ContentSlide2027 {...chrome}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: dense ? 24 : 32,
          // Cards size to their content rather than stretching down the well,
          // so a short three-card row doesn't read as three empty panels.
          gridAutoRows: dense ? 'minmax(0, 1fr)' : 'minmax(280px, max-content)',
          alignContent: 'start',
          ...(dense ? { height: '100%' } : null),
        }}
      >
        {cards.map((c, i) => (
          <Card
            key={i}
            style={{ padding: pad, display: 'flex', flexDirection: 'column', gap: dense ? 12 : 20, overflow: 'hidden' }}
          >
            <span
              style={{
                ...nwType(dense ? 'subHeadS' : 'subHeadM'),
                display: 'grid',
                placeItems: 'center',
                width: chip,
                height: chip,
                flexShrink: 0,
                borderRadius: 999,
                color: nwColors.white,
                background: nwGradients.brand,
              }}
            >
              {i + 1}
            </span>
            <h3
              style={{
                ...nwType(dense ? 'subHeadM' : 'subHeadL'),
                color: nwColors.primaryDarkBlue,
                margin: 0,
              }}
            >
              {c.title}
            </h3>
            {c.body && (
              <p style={{ ...nwType('bodyS'), color: nwColors.ink, margin: 0 }}>{c.body}</p>
            )}
          </Card>
        ))}
      </div>
    </ContentSlide2027>
  )
}
