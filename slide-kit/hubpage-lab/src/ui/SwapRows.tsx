import { RevealGroup, Reveal } from '@/motion/Reveal'
import { colors } from '@/design/tokens'
import type { CompareFigureProps } from './compareFigure'

/**
 * CANDIDATE 3 — SWAP ROWS. Each pairing is ONE object, not two boxes and an arrow.
 *
 * The bet here is that the fault in `AnalogyMap` is not its emphasis or its
 * surfaces but its GRAMMAR. Two bordered boxes with a glyph between them is
 * three objects, and the eye counts three things and then has to be told they
 * are one. So a pairing is drawn as a single rounded object, divided internally,
 * with the familiar side recessed into it and the new side raised out of it.
 *
 * That inversion is the argument: the left half is a well, the right half is a
 * lid sitting on top of it, and the whole row is the sentence "this stands in
 * for that". Nothing between them needs an arrow, because there is no gap to
 * cross.
 *
 * WHY IT MIGHT WIN. It is the only candidate where the pairing survives being
 * read at a glance from the back of a room. The other three all rely on the
 * viewer scanning horizontally and holding the left cell in memory while they
 * read the right one.
 *
 * WORST AT: more than four pairings. Each row is 64px of drawn object rather
 * than 44px of text, so five rows overflow the well on a slide that also carries
 * a lead. It is also the wrong figure when the two sides are PEERS rather than
 * one standing in for the other, because the raised/recessed treatment asserts a
 * direction that a peer comparison does not have -- reach for `MirrorCards`
 * there.
 */
export function SwapRows({
  leftLabel,
  rightLabel,
  pairs,
  caption,
  className = '',
}: CompareFigureProps) {
  return (
    <div className={`mx-auto w-full max-w-[1020px] ${className}`}>
      <div className="mb-2.5 grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-x-0 px-1">
        <p className="font-heading text-body-sm font-bold uppercase tracking-wider text-body">
          {leftLabel}
        </p>
        <p
          className="pl-5 font-heading text-body-sm font-bold uppercase tracking-wider"
          style={{ color: colors.brand }}
        >
          {rightLabel}
        </p>
      </div>

      <RevealGroup className="flex flex-col gap-2.5" stagger={0.09}>
        {pairs.map((p, i) => (
          <Reveal key={i} dir="up">
            <div
              /* ONE OBJECT. The border, the radius and the shadow belong to the
                 ROW, not to either half, which is the whole point: there are no
                 two boxes here to relate to each other. */
              className="overflow-hidden rounded-card border-2"
              style={{
                borderColor: p.key ? colors.brand : colors.line,
                boxShadow: p.key
                  ? `0 4px 16px -8px ${colors.brand}8c, inset 0 1px 0 0 #FFFFFF`
                  : `0 2px 10px -8px ${colors.brandDeep}59, inset 0 1px 0 0 #FFFFFF`,
              }}
            >
              <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-stretch">
                {/* THE WELL: the familiar side, recessed. A dark hairline on the
                    top edge and a white one on the bottom is the standard way a
                    surface reads as cut INTO a panel rather than sitting on it. */}
                <div
                  className={`flex items-center px-4 py-3.5 ${p.code ? 'font-mono text-[17px]' : 'text-body-lg'} leading-snug`}
                  style={{
                    background: 'linear-gradient(180deg, #EDF2F9 0%, #F4F7FC 100%)',
                    boxShadow: [
                      `inset 0 2px 5px -2px ${colors.brandDeep}1f`,
                      'inset 0 -1px 0 0 #FFFFFF',
                    ].join(', '),
                    color: colors.body,
                  }}
                >
                  {p.from}
                </div>

                {/* THE LID: the new side, raised out of the same object. */}
                <div
                  className={`flex flex-col justify-center px-5 py-3.5 ${p.code ? 'font-mono text-[17px]' : 'text-body-lg'} leading-snug`}
                  style={{
                    background: p.key
                      ? [
                          'radial-gradient(120% 200% at 6% 0%, #FFFFFFcc 0%, #FFFFFF00 60%)',
                          `linear-gradient(135deg, #F2F6FF 0%, #EAF1FF 52%, #DCE8FF 100%)`,
                        ].join(', ')
                      : 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 62%, #FAFCFF 100%)',
                    boxShadow: `inset 3px 0 0 0 ${p.key ? colors.brand : colors.line}, inset 0 1px 0 0 #FFFFFF`,
                    color: p.key ? colors.brandDark : colors.ink,
                    fontWeight: p.key ? 700 : 500,
                  }}
                >
                  <span>{p.to}</span>
                  {p.note && (
                    <span className="mt-0.5 text-body-sm font-normal" style={{ color: colors.muted }}>
                      {p.note}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
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
