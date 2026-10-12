import { Arc, CornerLogo, Stage } from '@/ui/shared'
import { colors, type } from '@/design/tokens'

export interface AgendaItem {
  title: string
  body?: string
}

export interface AgendaSlideProps {
  /** The course or module name above the rule. */
  kicker?: string
  title?: string
  /** Up to five items, one column each. */
  items: AgendaItem[]
}

/**
 * The five columns, as the reference lays them out: text left edges and the
 * divider left of each column (none before the first). They are NOT equal —
 * the third is wider for its two-line title — and are kept as measured.
 */
const COLUMNS = [
  /*
    `body` is the measure that reproduces the reference's line breaks:
    "latest innovations" fits the first, "business needs." fits but
    "designed for your" does not fit the second and fourth, "companies across
    21" fits the third and fifth. Titles get a wider measure than bodies: in
    the reference "Battery Types" stays on one line above a body that wraps
    narrower than it, so the two cannot share a box.
  */
  { text: 96, divider: null, title: 300, body: 246 },
  { text: 419, divider: 380, title: 300, body: 228 },
  { text: 742, divider: 704, title: 300, body: 311 },
  { text: 1123, divider: 1083, title: 300, body: 228 },
  { text: 1444, divider: 1406, title: 300, body: 316 },
] as const

/**
 * AGENDA — the session's sections in a row of numbered columns.
 *
 * Reference: `slidestraining/agendaslides/`. Measured:
 *   - kicker caps top at y=70 (black); the rule 4px at y=126 from x=80, solid
 *     #0146C7 to x≈160 then fading to nothing by x≈660; title caps top at
 *     y=155 (black);
 *   - numerals (#0146C7, light) caps top y=476; item titles (#1C1C1C, bold)
 *     caps top y=567; bodies (#1C1C1C) caps top y=625 in the first column;
 *   - dividers 2px #0146C7, alpha 0.78 at y=432 easing to 0.64 at y=632 and
 *     linearly to 0 at y=788;
 *   - ground (240,243,252) with the azure corner wash; two rings of the
 *     background blue at a quarter strength; the colour mark in the corner;
 *     a 12px #2D63FB bar along the bottom. No grain (measured: none).
 */
export function AgendaSlide({ kicker = 'Battery Technology', title = 'Agenda', items }: AgendaSlideProps) {
  return (
    <Stage ground="paper" style={{ color: colors.black }}>
      <Arc
        cx={1159}
        cy={753}
        color={colors.deep}
        opacity={0.26}
        mask="linear-gradient(90deg, transparent 0%, transparent 52%, #000 72%)"
      />
      <Arc cx={2428} cy={36} color={colors.deep} opacity={0.27} />

      {/* header */}
      <p style={{ ...type.agendaKicker, position: 'absolute', left: 80, top: 63, margin: 0, color: colors.ink }}>
        {kicker}
      </p>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 80,
          top: 126,
          width: 600,
          height: 4,
          background: `linear-gradient(90deg, ${colors.deep} 0%, ${colors.deep} 13%, rgba(45,99,251,0.55) 68%, rgba(45,99,251,0) 100%)`,
        }}
      />
      <h2 style={{ ...type.agendaTitle, position: 'absolute', left: 80, top: 141, margin: 0, color: colors.ink }}>
        {title}
      </h2>

      {/* columns */}
      {items.slice(0, COLUMNS.length).map((item, i) => {
        const col = COLUMNS[i]
        return (
          <div key={i}>
            {col.divider != null && (
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  left: col.divider,
                  top: 432,
                  width: 2,
                  height: 356,
                  background:
                    'linear-gradient(180deg, rgba(1,70,199,0.78) 0%, rgba(1,70,199,0.64) 56%, rgba(1,70,199,0) 100%)',
                }}
              />
            )}
            <div style={{ position: 'absolute', left: col.text, top: 468 }}>
              <p style={{ ...type.agendaNumber, margin: 0, color: colors.deep }}>
                {String(i + 1).padStart(2, '0')}
              </p>
              <p style={{ ...type.agendaItem, margin: '34px 0 0', width: col.title, color: colors.black }}>
                {item.title}
              </p>
              {item.body && (
                <p style={{ ...type.agendaBody, margin: '13px 0 0', width: col.body, color: colors.black }}>
                  {item.body}
                </p>
              )}
            </div>
          </div>
        )
      })}

      <CornerLogo />

      <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 12, background: colors.blue }} />
    </Stage>
  )
}
