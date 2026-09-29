import { Reveal, RevealGroup } from '@/motion/Reveal'
import { colors } from '@/design/tokens'
import { iconByName } from '@/ui/icons'
import { VERDICT, type VerdictFigureProps } from './contract'

/**
 * VARIANT 5 — SPLIT VERDICT. Two columns, side by side, for a genuine pair.
 *
 * This one is not a list at all, and that is the argument. A do and a don't are
 * not two items in a set; they are one decision with two sides, and stacking
 * them vertically makes the room read them in sequence when the whole point is
 * to hold them against each other.
 *
 * Each column carries a solid header band with the glyph and the word, then the
 * claim and its reason on a tinted body. The two columns are the same width and
 * the same height, deliberately: equal geometry says the two options looked
 * equally plausible, which is exactly why the slide is needed.
 *
 * BEST AT: two buttons that sit next to each other and do opposite things. The
 * `Complete your AWS registration` and `Upgrade plan` pair is the case that
 * produced it, and the wrong click there costs money.
 *
 * WORST AT: anything that is not a pair. Three columns is a comparison table
 * with no header row, and one column is a `Callout`. The component takes the
 * first two items and ignores the rest rather than degrading quietly, so a
 * five-item set fails loudly here instead of rendering something misleading.
 *
 * NO `immediate` BEHAVIOUR. The two sides always arrive together: revealing the
 * correct one first and the wrong one on a second click teaches the pair in an
 * order that does not exist on the screen the learner is looking at.
 */
export function SplitVerdict({ items, className = '' }: VerdictFigureProps) {
  const pair = items.slice(0, 2)
  return (
    <RevealGroup stagger={0.1} className={`grid grid-cols-2 gap-6 ${className}`}>
      {pair.map((item, i) => {
        const v = VERDICT[item.verdict]
        const Icon = iconByName[v.icon]
        return (
          /*
             `h-full` and the flex column are load-bearing, not tidiness.

             The grid stretches both columns to the taller one's height, but the
             tinted body only ever wrapped its own text, so the shorter column
             showed a strip of the card's white background under its tint. A
             two-line claim beside a three-line one looked like a rendering
             fault, and it was reported as one. The body now grows to fill
             whatever height the row was given.
          */
          <Reveal key={i} dir="up" className="flex h-full flex-col overflow-hidden rounded-card ring-1 ring-line">
            <div className={`flex items-center gap-3 px-5 py-3 text-white ${v.solid}`}>
              <Icon width={22} height={22} />
              <span className="text-[15px] font-bold uppercase tracking-wide">
                {item.label ?? v.word}
              </span>
            </div>
            <div className={`flex-1 px-5 py-4 ${v.tint}`}>
              <span className="block text-body-lg font-semibold text-ink">{item.claim}</span>
              {item.reason && (
                <span className="mt-1.5 block text-body-sm" style={{ color: colors.body }}>
                  {item.reason}
                </span>
              )}
            </div>
          </Reveal>
        )
      })}
    </RevealGroup>
  )
}
