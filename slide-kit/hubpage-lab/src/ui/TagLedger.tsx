import { Reveal, RevealGroup } from '@/motion/Reveal'
import { colors } from '@/design/tokens'
import type { RegistryPageProps } from './registryPage'

/**
 * CANDIDATE 2 -- TAG LEDGER. The repository with no browser around it.
 *
 * THE CONTROL, and the question it asks is whether the window earns its space.
 * A browser frame is roughly 90px of vertical chrome plus an address bar's worth
 * of characters, and it carries exactly one fact: that this is reached through a
 * browser. The lead sentence carries that fact for free. So this candidate keeps
 * everything section 6.1 authorises -- the repository name, the PUBLIC badge,
 * the tag rows with size and push time, the pull line -- and throws the window
 * away.
 *
 * It is also the honest baseline. With no window there is nothing for a viewer
 * to mistake for a screenshot, so if the room understands this one as well as
 * they understand `RepoPage`, the window was decoration and the decoration was
 * the risky part.
 *
 * The address is NOT drawn here, deliberately. Half-drawing a browser -- a URL
 * pinned to a panel with no window -- is the worst of both: it claims a page
 * without showing one. Either the figure is a page or it is a ledger.
 *
 * WORST AT: the word "page". The slide's claim is that the image now HAS a page
 * anyone can open, and a ledger draws the contents of that page without drawing
 * that it is one. It is also the flattest reading of the payoff moment: the room
 * has seen four ledgers of tabular facts already by this point in the session,
 * so the slide that is supposed to feel like an arrival looks like another
 * table.
 */
export function TagLedger({
  repo,
  visibility,
  tags,
  pullCommand,
  caption,
  compact = false,
  className = '',
}: RegistryPageProps) {
  const mono = compact ? 17 : 19

  return (
    <div className={`mx-auto w-full ${compact ? 'max-w-[560px]' : 'max-w-[820px]'} ${className}`}>
      <RevealGroup className="block" stagger={0.1}>
        <Reveal dir="up">
          <div
            className="overflow-hidden rounded-card"
            style={{
              background: [
                `radial-gradient(120% 100% at 14% 0%, ${colors.white}99 0%, ${colors.white}00 62%)`,
                `linear-gradient(135deg, ${colors.white} 0%, ${colors.white} 52%, ${colors.surface} 100%)`,
              ].join(', '),
              boxShadow: [
                `0 8px 24px -12px ${colors.brandDeep}59`,
                `inset 0 1px 0 0 ${colors.white}`,
                `inset 0 -1px 0 0 ${colors.brandDeep}2e`,
                `inset 0 0 0 1px ${colors.line}`,
              ].join(', '),
            }}
          >
            {/* THE TITLE ROW. The repository IS the title, so it is set in
                monospace at heading weight rather than paraphrased in prose. */}
            <div
              className={`flex flex-wrap items-center gap-x-3 gap-y-2 px-5 ${compact ? 'py-3' : 'py-4'}`}
              style={{
                background: [
                  `radial-gradient(120% 160% at 10% 0%, ${colors.white}1f 0%, ${colors.white}00 62%)`,
                  `linear-gradient(135deg, ${colors.night3} 0%, ${colors.brandDeep} 52%, ${colors.night} 100%)`,
                ].join(', '),
                boxShadow: [
                  `inset 0 1px 0 0 ${colors.white}40`,
                  `inset 0 -1px 0 0 ${colors.night}`,
                ].join(', '),
              }}
            >
              <span
                className="font-heading text-kicker uppercase"
                style={{ color: `${colors.white}b3` }}
              >
                Repository
              </span>
              <span
                className="font-mono font-bold leading-tight"
                style={{ fontSize: compact ? 19 : 24, color: colors.white }}
              >
                {repo}
              </span>
              <span
                className="ml-auto rounded-pill px-3 py-1 font-heading text-kicker uppercase"
                style={{
                  color: colors.white,
                  background: [
                    `radial-gradient(120% 140% at 14% 0%, ${colors.white}80 0%, ${colors.white}00 62%)`,
                    `linear-gradient(135deg, ${colors.success} 0%, ${colors.success} 52%, ${colors.tealDark} 100%)`,
                  ].join(', '),
                  boxShadow: [
                    `0 3px 10px -4px ${colors.success}59`,
                    `inset 0 1px 0 0 ${colors.white}b3`,
                    `inset 0 -1px 0 0 ${colors.success}2e`,
                  ].join(', '),
                }}
              >
                {visibility}
              </span>
            </div>

            {/* THE LEDGER. Column heads, then one drawn row per tag. */}
            <div className={`px-5 ${compact ? 'pt-3 pb-1' : 'pt-4 pb-2'}`}>
              <div
                className="mb-1.5 grid gap-x-3 px-3 font-heading text-kicker uppercase"
                style={{ gridTemplateColumns: '1fr auto auto', color: colors.muted }}
              >
                <span>Tag</span>
                <span className="text-right">Size</span>
                <span className={compact ? 'w-[112px] text-right' : 'w-[132px] text-right'}>Pushed</span>
              </div>

              <div className="flex flex-col gap-1.5">
                {tags.map((t) => (
                  <div
                    key={t.tag}
                    className="grid items-center gap-x-3 rounded-[10px] px-3 py-2.5"
                    style={{
                      gridTemplateColumns: '1fr auto auto',
                      background: t.key
                        ? [
                            `radial-gradient(120% 200% at 6% 0%, ${colors.white}cc 0%, ${colors.white}00 60%)`,
                            `linear-gradient(135deg, ${colors.white} 0%, ${colors.surface} 52%, ${colors.surface2} 100%)`,
                          ].join(', ')
                        : colors.white,
                      boxShadow: t.key
                        ? [
                            `0 3px 10px -4px ${colors.brand}59`,
                            `inset 0 1px 0 0 ${colors.white}`,
                            `inset 3px 0 0 0 ${colors.brand}`,
                            `inset 0 -1px 0 0 ${colors.brand}2e`,
                          ].join(', ')
                        : `inset 0 0 0 1px ${colors.line}`,
                    }}
                  >
                    <span
                      className="font-mono font-bold"
                      style={{ fontSize: mono, color: t.key ? colors.brandDark : colors.ink }}
                    >
                      {t.tag}
                    </span>
                    <span className="text-right font-mono" style={{ fontSize: compact ? 16 : 17, color: colors.body }}>
                      {t.size}
                    </span>
                    <span
                      className={`text-right ${compact ? 'w-[112px]' : 'w-[132px]'}`}
                      style={{ fontSize: compact ? 16 : 17, color: colors.muted }}
                    >
                      {t.pushed}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* THE PULL LINE, in a recessed well: it is the thing the page hands
                you, so it sits INSIDE the repository rather than beside it. */}
            <div className={`px-5 ${compact ? 'pb-3.5 pt-2' : 'pb-4 pt-2.5'}`}>
              <div
                className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[12px] px-3.5 py-2.5"
                style={{
                  background: `linear-gradient(180deg, ${colors.surface2} 0%, ${colors.surface} 100%)`,
                  boxShadow: [
                    `inset 0 2px 5px -2px ${colors.brandDeep}1f`,
                    `inset 0 -1px 0 0 ${colors.white}`,
                    `inset 0 0 0 1px ${colors.line}`,
                  ].join(', '),
                }}
              >
                <span
                  className="font-heading text-kicker uppercase"
                  style={{ color: colors.muted }}
                >
                  Anyone can run
                </span>
                <span className="font-mono font-semibold" style={{ fontSize: mono, color: colors.ink }}>
                  {pullCommand}
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        {caption && (
          <Reveal dir="up">
            <p className="mt-3 text-center text-body-sm leading-snug" style={{ color: colors.body }}>
              {caption}
            </p>
          </Reveal>
        )}
      </RevealGroup>
    </div>
  )
}
