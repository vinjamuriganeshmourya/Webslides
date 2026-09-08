import { RevealGroup, Reveal } from '@/motion/Reveal'
import { colors } from '@/design/tokens'
import type { CompareFigureProps } from './compareFigure'

/**
 * CANDIDATE 4 — CALLER VIEW. The comparison redrawn as what is exposed and what
 * is hidden.
 *
 * The other three all answer "what maps to what". This one refuses that question
 * and answers a different one: what does the caller SEE, and what is behind the
 * line. It is the only candidate that draws the interface itself rather than
 * tabulating facts about it.
 *
 * HOW IT READS. One short thing sits above a hard rule and everything below the
 * rule is dimmed and set small. The rule is the interface boundary, labelled
 * once. For the session 5 content that is literally the argument: `make_coffee()`
 * above the line, three function calls below it; `make "up"` above the line, a
 * docker compose command below it.
 *
 * WHY THIS MIGHT WIN. It is the only one of the four where the DRAWING makes the
 * claim. The other three are legible arrangements of a claim made in the lead.
 * `PEDAGOGY_GUIDELINES.md` §3 wants a figure that argues something a sentence
 * cannot, and "there is a line, and you are above it" is that.
 *
 * WHY IT MIGHT LOSE. It only works when the pairs really are
 * exposed-versus-hidden. Feed it four arbitrary pairings and it lies: it will
 * draw the fourth row as though it were hidden implementation when it is just
 * another fact. So it takes `pairs` in a specific way -- the FIRST pair is the
 * exposed line and every remaining pair is what sits below it -- which is a
 * narrower contract than the other three, and a caller who does not know that
 * gets a figure that misrepresents the content.
 *
 * WORST AT: a comparison with no direction. Also at more than three hidden rows
 * per side, at which point the dimmed block stops reading as "detail" and starts
 * reading as a second list competing with the first.
 */
export function CallerView({
  leftLabel,
  rightLabel,
  pairs,
  caption,
  className = '',
}: CompareFigureProps) {
  const [exposed, ...hidden] = pairs

  function Side({ label, side, accent }: { label: string; side: 'from' | 'to'; accent: string }) {
    return (
      <div
        className="flex h-full flex-col rounded-card border-2 p-4"
        style={{
          borderColor: side === 'to' ? accent : colors.line,
          background: [
            'radial-gradient(120% 60% at 12% 0%, #FFFFFF 0%, #FFFFFF00 58%)',
            `linear-gradient(135deg, #FFFFFF 0%, #FDFEFF 55%, ${side === 'to' ? accent + '0d' : '#F4F7FC'} 100%)`,
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

        {/* ABOVE THE LINE: the one thing the caller writes. Set large, in
            monospace, because on both sides of this comparison it is code. */}
        <p
          className="font-mono text-[21px] font-bold leading-none"
          style={{ color: side === 'to' ? colors.brandDark : colors.ink }}
        >
          {exposed?.[side]}
        </p>
        <p className="mt-1.5 text-body-sm" style={{ color: colors.muted }}>
          what the caller writes
        </p>

        {/* THE BOUNDARY. Labelled once, and it is the only hard rule in the
            figure, so nothing else can be mistaken for it. */}
        <div className="relative my-4">
          <span className="block h-[2px] w-full" style={{ background: `${accent}3d` }} />
          {/*
            THE PILL HAS TO BE OPAQUE.

            It was `${accent}14`, an 8% tint, and the 2px rule ran straight
            through the words behind it: at a glance "the interface" read as
            struck through, which is close to the opposite of what this figure
            claims. The label sits ON the boundary, so it has to mask it, and an
            opaque ground is the only thing that does.
          */}
          <span
            className="absolute left-0 -top-[9px] rounded-pill px-2 py-0.5 font-heading text-[10px] font-bold uppercase tracking-wider"
            style={{
              background: '#FFFFFF',
              color: accent,
              boxShadow: `0 0 0 3px #FFFFFF, inset 0 0 0 1px ${accent}29`,
            }}
          >
            the interface
          </span>
        </div>

        {/* BELOW THE LINE: the detail, dimmed and small. It is present because
            "hidden" has to mean "still there, just not your problem" -- an empty
            space below the rule would say the implementation does not exist. */}
        <div
          className="mt-auto flex flex-col gap-1.5 rounded-xl px-3 py-2.5"
          style={{
            background: 'linear-gradient(180deg, #EDF2F9 0%, #F4F7FC 100%)',
            boxShadow: `inset 0 2px 5px -2px ${colors.brandDeep}1f, inset 0 -1px 0 0 #FFFFFF`,
          }}
        >
          {hidden.map((p, i) => (
            <span
              key={i}
              className="font-mono text-[13px] leading-snug"
              style={{ color: colors.muted }}
            >
              {p[side]}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`mx-auto w-full max-w-[1000px] ${className}`}>
      <RevealGroup className="grid grid-cols-2 items-stretch gap-5" stagger={0.14}>
        <Reveal dir="up">
          <Side label={leftLabel} side="from" accent={colors.brand} />
        </Reveal>
        <Reveal dir="up">
          <Side label={rightLabel} side="to" accent={colors.brand} />
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
