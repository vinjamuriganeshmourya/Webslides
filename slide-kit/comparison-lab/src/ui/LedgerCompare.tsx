import { RevealGroup, Reveal } from '@/motion/Reveal'
import { colors } from '@/design/tokens'
import type { CompareFigureProps } from './compareFigure'

/**
 * CANDIDATE 1 — LEDGER. One spine down the middle, one row per pairing.
 *
 * The closest thing to `AnalogyMap`, with its four faults fixed rather than its
 * shape replaced. It is here as the control: if none of the bolder candidates
 * earns its complexity, this is what the kit should get.
 *
 * WHAT IT FIXES
 *
 *   1. THE SPINE CARRIES THE RELATION, not a 20px arrow. A continuous vertical
 *      rule with a tick at every row says "these two belong together" once, for
 *      the whole figure, instead of four times weakly.
 *   2. THE KEY ROW LOOKS LIKE THE KEY ROW. `key` gives it the brand ramp, a
 *      tinted shadow and a heavier weight, so "which one is the point" is
 *      answered by the drawing.
 *   3. CODE IS SET AS CODE. `code` puts both cells in monospace on a tinted
 *      ground, so `make "up"` reads as something you type.
 *   4. EVERY SURFACE IS LIT (STYLE_GUIDE section 9), which the flat
 *      `bg-surface-card` boxes were not.
 *
 * WORST AT: a pairing where either side runs past about six words. Both columns
 * are fixed at 1fr, so one long cell wraps and its partner does not, and the
 * row stops reading as a pair of equals. `MirrorCards` handles that case.
 */
export function LedgerCompare({
  leftLabel,
  rightLabel,
  pairs,
  caption,
  className = '',
}: CompareFigureProps) {
  const cols = 'grid grid-cols-[1fr_44px_1fr] items-stretch'
  return (
    <div className={`mx-auto w-full max-w-[1000px] ${className}`}>
      <div className={`${cols} mb-2.5`}>
        <p className="pr-4 text-right font-heading text-body-sm font-bold uppercase tracking-wider text-body">
          {leftLabel}
        </p>
        <span />
        <p
          className="pl-4 font-heading text-body-sm font-bold uppercase tracking-wider"
          style={{ color: colors.brand }}
        >
          {rightLabel}
        </p>
      </div>

      <RevealGroup className="block" stagger={0.09}>
        {pairs.map((p, i) => {
          const first = i === 0
          const last = i === pairs.length - 1
          const cellBase = 'flex items-center px-4 py-3 text-body-lg leading-snug'
          const mono = p.code ? 'font-mono text-[17px]' : ''
          return (
            <Reveal key={i} dir="up">
              <div className={cols}>
                {/* LEFT: the familiar side, quiet on purpose. It is the thing the
                    room already has, so it should not compete with the thing it
                    is being used to explain. */}
                <div
                  className={`${cellBase} ${mono} justify-end rounded-l-card border-2 border-r-0 text-right`}
                  style={{
                    borderColor: colors.line,
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #FDFEFF 58%, #F5F8FC 100%)',
                    boxShadow: `inset 0 1px 0 0 #FFFFFF`,
                    color: colors.body,
                  }}
                >
                  {p.from}
                </div>

                {/* THE SPINE. A continuous rule with a tick at each row, drawn
                    once for the whole figure. This is the part that replaces four
                    separate arrow glyphs, and it is why the two columns can sit
                    flush against it with no gap: the rule IS the gap. */}
                <div className="relative grid place-items-center">
                  <span
                    className="absolute w-[2px]"
                    style={{
                      background: `${colors.brand}2e`,
                      top: first ? '50%' : 0,
                      bottom: last ? '50%' : 0,
                    }}
                  />
                  <span
                    className="relative h-2.5 w-2.5 rounded-full"
                    style={{
                      background: p.key ? colors.brand : `${colors.brand}59`,
                      boxShadow: p.key ? `0 0 0 4px ${colors.brand}1f` : undefined,
                    }}
                  />
                </div>

                {/* RIGHT: the thing being explained, and on the key row the
                    loudest object in the figure. */}
                <div
                  className={`${cellBase} ${mono} rounded-r-card border-2 border-l-0`}
                  style={
                    p.key
                      ? {
                          borderColor: colors.brand,
                          background: [
                            'radial-gradient(120% 200% at 6% 0%, #FFFFFFcc 0%, #FFFFFF00 62%)',
                            `linear-gradient(135deg, #F2F6FF 0%, #EAF1FF 52%, #DCE8FF 100%)`,
                          ].join(', '),
                          boxShadow: `0 3px 12px -6px ${colors.brand}80, inset 0 1px 0 0 #FFFFFF`,
                          color: colors.brandDark,
                          fontWeight: 700,
                        }
                      : {
                          borderColor: colors.line,
                          background: 'linear-gradient(135deg, #FFFFFF 0%, #FDFEFF 58%, #F6F9FE 100%)',
                          boxShadow: `inset 0 1px 0 0 #FFFFFF`,
                          color: colors.ink,
                        }
                  }
                >
                  {p.to}
                </div>
              </div>
              {!last && <div className="h-2" />}
            </Reveal>
          )
        })}
      </RevealGroup>

      {caption && (
        <Reveal dir="up">
          <p className="mt-4 text-center text-body-sm leading-snug" style={{ color: colors.body }}>
            {caption}
          </p>
        </Reveal>
      )}
    </div>
  )
}
