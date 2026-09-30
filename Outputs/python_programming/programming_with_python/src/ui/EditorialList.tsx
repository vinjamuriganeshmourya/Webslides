import type { ReactNode } from 'react'
import { Step } from '@/motion/Stepper'
import { colors } from '@/design/tokens'

/**
 * A set of things, set as type. No boxes at all.
 *
 * THE FORM, AND WHY IT IS NOT A LIST OF CARDS
 *
 * Six job titles are not six objects. They are six ANSWERS to "what can I
 * become", and the thing the room wants from that slide is to read the names.
 * Drawing a border around each name adds a container the content never asked
 * for: it makes six titles look like six products, and it costs the type the size
 * it needs to be read from the back of a room.
 *
 * So: a hairline rule between rows, an oversized tabular number in the gutter,
 * the name at display size, and one line of gloss. Nothing else. The rhythm comes
 * from the rules and the numbers, not from boxes.
 *
 * This is deliberately the OPPOSITE choice from `RadialSpread` on a neighbouring
 * slide of the same deck. Two consecutive slides that both argue "many things"
 * must not use the same figure, or the second one reads as the first one again
 * with different words.
 *
 * WHEN NOT TO USE IT
 *
 *   - When the items relate to each other or to a centre. Nothing here draws a
 *     relationship; it is a list, and an honest one.
 *   - When each item needs more than one line. That is a card, and `Card` exists.
 *   - Fewer than four items. Three big rows and a lot of white is an unfinished
 *     slide, not an editorial one.
 *
 * NUMBERS ARE OFF BY DEFAULT, AND THAT IS THE POINT
 *
 * The first version numbered every row, and it was wrong on the slide it was
 * built for. Six job titles have no first and no sixth: `01` next to "Python
 * Developer" claims a rank or an order that the content does not have, and the
 * room reads it as one. `STYLE_GUIDE.md` §8 already said "do not invent
 * structure the content does not have"; numbering is the quietest way to break
 * that rule, because it looks like tidiness rather than a claim.
 *
 * So `numbered` is opt-in, and it earns its place only when the set really is
 * ordered or counted: a ranked list, or a run the room is being walked through
 * where knowing "three to go" is the point. If you cannot say what the number
 * MEANS, leave it off. Without it the rules between rows carry the rhythm, which
 * is what they are there for.
 *
 * When numbers are on, their width is fixed rather than intrinsic so every name
 * starts on the same x, and `tabular-nums` keeps `01` and `11` the same width.
 */

export interface EditorialRow {
  label: string
  /** One line of gloss. Optional. */
  body?: ReactNode
}

export function EditorialList({
  rows,
  /** Two columns for six or more rows, one for fewer. */
  cols = 1,
  /**
   * Number the rows. OFF by default: only turn it on when the set is genuinely
   * ordered or counted, and you can say what the number means.
   */
  numbered = false,
  stepped = true,
  className = '',
}: {
  rows: EditorialRow[]
  cols?: 1 | 2
  numbered?: boolean
  stepped?: boolean
  className?: string
}) {
  const grid = cols === 2 ? 'grid-cols-2 gap-x-12' : 'grid-cols-1'

  return (
    <div className={`grid ${grid} ${className}`}>
      {rows.map((r, i) => {
        const node = (
          <div
            className={`flex items-baseline py-3 ${numbered ? 'gap-5' : ''}`}
            style={{ borderTop: `1px solid ${colors.line}` }}
          >
            {numbered && (
              <span
                className="shrink-0 text-right font-mono text-[15px] font-bold tabular-nums"
                style={{ width: 34, color: colors.muted }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            )}
            <span className="min-w-0">
              <span
                className="block text-balance font-heading text-[26px] font-extrabold leading-tight"
                style={{ color: colors.ink }}
              >
                {r.label}
              </span>
              {r.body && (
                <span
                  className="mt-0.5 block text-pretty text-body-sm leading-snug"
                  style={{ color: colors.body }}
                >
                  {r.body}
                </span>
              )}
            </span>
          </div>
        )
        return stepped ? (
          <Step key={r.label} dir="up">
            {node}
          </Step>
        ) : (
          <div key={r.label}>{node}</div>
        )
      })}
    </div>
  )
}
