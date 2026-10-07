import { RevealGroup, Reveal } from '@/motion/Reveal'
import { colors } from '@/design/tokens'
import type { CompareFigureProps } from './compareFigure'

/**
 * CANDIDATE 2 — MIRROR CARDS. Two panels side by side, paired by numbered badge.
 *
 * The structural opposite of the ledger. Instead of interleaving the two systems
 * row by row, each system gets its own panel and keeps its own reading order,
 * and the pairing is carried by a numbered badge that appears once on each side.
 *
 * WHY THIS SHAPE MIGHT WIN. A ledger row forces both sides to be the same
 * length, because they share a baseline. These do not: the left panel can say
 * `make_coffee()` in three words and the right can take a full clause, and
 * neither is distorted by the other. That matters for the session 5 content,
 * where "Caller never reads the body" pairs with "Nobody needs to know the
 * Docker flags" -- three words against six.
 *
 * The badge pairing is `SyntaxBreakdown`'s device, and it is here for the reason
 * that component's header gives: colour alone fails on a projector and in
 * greyscale, and a number survives both.
 *
 * WORST AT: two pairings. With only two rows the badges are overhead -- the eye
 * pairs two things by position without help, and the numbers become furniture.
 * Below three pairs, use `LedgerCompare`.
 *
 * ALSO WORST AT: a `key` row. Emphasis inside a panel competes with the panel's
 * own heading, so `key` here only tints the badge and the row, and it is the
 * quietest of the four candidates on that axis.
 */
export function MirrorCards({
  leftLabel,
  rightLabel,
  pairs,
  caption,
  className = '',
}: CompareFigureProps) {
  function Panel({
    label,
    side,
    accent,
  }: {
    label: string
    side: 'from' | 'to'
    accent: string
  }) {
    return (
      <div
        className="rounded-card border-2 p-4"
        style={{
          borderColor: side === 'to' ? accent : colors.line,
          background: [
            'radial-gradient(120% 70% at 12% 0%, #FFFFFF 0%, #FFFFFF00 60%)',
            `linear-gradient(135deg, #FFFFFF 0%, #FDFEFF 55%, ${side === 'to' ? accent + '0f' : '#F4F7FC'} 100%)`,
          ].join(', '),
          boxShadow: [
            `0 8px 24px -14px ${side === 'to' ? accent : colors.brandDeep}66`,
            'inset 0 1px 0 0 #FFFFFF',
          ].join(', '),
        }}
      >
        <p
          className="mb-3 font-heading text-body-sm font-bold uppercase tracking-wider"
          style={{ color: side === 'to' ? accent : colors.muted }}
        >
          {label}
        </p>
        <div className="flex flex-col gap-2">
          {pairs.map((p, i) => {
            const content = p[side]
            return (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-xl px-3 py-2.5"
                style={{
                  background: p.key
                    ? `linear-gradient(135deg, ${accent}0f 0%, ${accent}1f 100%)`
                    : 'transparent',
                  boxShadow: p.key ? `inset 0 1px 0 0 #FFFFFF` : undefined,
                }}
              >
                {/* THE BADGE, identical on both sides. This is the whole pairing
                    mechanism: badge 3 on the left is badge 3 on the right, and
                    nothing else has to line up. */}
                <span
                  className="mt-[3px] grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full font-heading text-[11.5px] font-extrabold text-white"
                  style={{
                    background: p.key
                      ? `linear-gradient(135deg, ${accent} 0%, ${accent} 55%, rgba(0,0,0,0.2) 100%)`
                      : `linear-gradient(135deg, ${colors.muted} 0%, ${colors.muted} 60%, rgba(0,0,0,0.18) 100%)`,
                    boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.45)',
                  }}
                >
                  {i + 1}
                </span>
                <span
                  className={`text-body-lg leading-snug ${p.code ? 'font-mono text-[16px]' : ''}`}
                  style={{
                    color: p.key ? (side === 'to' ? colors.brandDark : colors.ink) : colors.body,
                    fontWeight: p.key ? 600 : 400,
                  }}
                >
                  {content}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={`mx-auto w-full max-w-[1060px] ${className}`}>
      <RevealGroup className="grid grid-cols-2 gap-5" stagger={0.14}>
        <Reveal dir="up">
          <Panel label={leftLabel} side="from" accent={colors.brand} />
        </Reveal>
        <Reveal dir="up">
          <Panel label={rightLabel} side="to" accent={colors.brand} />
        </Reveal>
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
