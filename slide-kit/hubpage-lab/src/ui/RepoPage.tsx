import { Reveal, RevealGroup } from '@/motion/Reveal'
import { colors } from '@/design/tokens'
import type { RegistryPageProps } from './registryPage'

/**
 * CANDIDATE 1 -- REPO PAGE. The fullest answer: a drawn browser view.
 *
 * The bet: the slide's claim is "your image now has a PAGE, at an address,
 * that anyone can open", and a page is the thing the room has to picture. So
 * this draws the page: a window with the address in it, the repository name
 * with a PUBLIC badge, a Tags table, and the pull command in a copy row.
 *
 * TWO DISCIPLINES SHAPE IT, AND BOTH CUT THINGS OUT.
 *
 * ONE, `Terminal`'s rule. `Terminal` ships two chromes because "a slide saying
 * Administrator PowerShell while drawing VS Code's panel is telling the room two
 * different things, and the one it draws is the one that wins". The same applies
 * to a browser: everything drawn here is something the room will actually see on
 * their own screen at that address. No tab strip with invented tab titles, no
 * back and forward arrows, no bookmark star, no profile avatar.
 *
 * TWO, honesty. This stands in for a capture that R6 forbids, so it must read as
 * a DIAGRAM OF a page and never as a photograph of one. Three things enforce
 * that, on purpose:
 *   - the window is in the DECK's palette, not Docker Hub's. No Docker blue, no
 *     Hub navy, no whale. A figure that reproduces a real product's chrome is a
 *     fabricated screenshot wearing a diagram's job.
 *   - the address field is a labelled field, not a pixel-accurate omnibox.
 *   - the only cells with content are the ones section 6.1 authorises. There is
 *     no star count, no pull count and no description, and their absence is
 *     visible rather than filled with plausible-looking furniture.
 *
 * WORST AT: half width. It is four stacked regions inside a window, and at 560px
 * the table's three columns and the pull row both have to give up characters, so
 * it is the one candidate that loses information rather than just density. It is
 * also the most chrome per fact of the four -- a window, a header, a tab and a
 * table, to deliver a repository name, one tag row and one command.
 */
export function RepoPage({
  repo,
  visibility,
  url,
  tags,
  pullCommand,
  caption,
  compact = false,
  className = '',
}: RegistryPageProps) {
  const mono = compact ? 17 : 19

  return (
    <div className={`mx-auto w-full ${compact ? 'max-w-[560px]' : 'max-w-[900px]'} ${className}`}>
      <RevealGroup className="block" stagger={0.1}>
        <Reveal dir="up">
          <div
            /* THE WINDOW. One object, lit from the top-left per STYLE_GUIDE
               section 9: highlight, ramp, tinted shadow, two hairlines. */
            className="overflow-hidden rounded-card"
            style={{
              background: [
                `radial-gradient(120% 100% at 14% 0%, ${colors.white}99 0%, ${colors.white}00 62%)`,
                `linear-gradient(135deg, ${colors.white} 0%, ${colors.surface} 52%, ${colors.surface2} 100%)`,
              ].join(', '),
              boxShadow: [
                /* The window edge is stronger than the other candidates' panels
                   on purpose: the figure sits on `bg-brand-soft`, which is close
                   enough to the window's own ground that at a 1px hairline the
                   boundary disappeared on the first render and the page read as
                   loose furniture on the slide rather than as one window. */
                `0 12px 30px -12px ${colors.brandDeep}73`,
                `inset 0 1px 0 0 ${colors.white}`,
                `inset 0 -1px 0 0 ${colors.brandDeep}2e`,
                `inset 0 0 0 1.5px ${colors.line}`,
              ].join(', '),
            }}
          >
            {/* THE ADDRESS BAR. A labelled field, not an imitation omnibox. */}
            <div
              className="flex items-center gap-3 px-4 py-2.5"
              style={{
                background: `linear-gradient(180deg, ${colors.surface2} 0%, ${colors.surface} 100%)`,
                boxShadow: `inset 0 -1px 0 0 ${colors.line}`,
              }}
            >
              <span
                className="shrink-0 font-heading text-kicker uppercase"
                style={{ color: colors.muted }}
              >
                Browser
              </span>
              <span
                className="flex min-w-0 flex-1 items-center gap-2 rounded-pill px-3 py-1"
                style={{
                  background: colors.white,
                  boxShadow: `inset 0 0 0 1px ${colors.line}, inset 0 1px 2px 0 ${colors.brandDeep}14`,
                }}
              >
                {/* A padlock: the room does see this, and it is the only glyph
                    in the bar for that reason. */}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0"
                  stroke={colors.muted} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="10" width="16" height="11" rx="2.5" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                <span
                  className="truncate font-mono"
                  style={{ fontSize: compact ? 16 : 17, color: colors.body }}
                >
                  {url ?? `hub.docker.com/r/${repo}`}
                </span>
              </span>
            </div>

            {/* THE REPOSITORY HEADER. */}
            <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 px-5 ${compact ? 'pt-3.5 pb-3' : 'pt-5 pb-4'}`}>
              <span
                className="font-mono font-bold leading-tight"
                style={{ fontSize: compact ? 19 : 26, color: colors.ink }}
              >
                {repo}
              </span>
              <span
                /* THE BADGE. Lit like every other surface, and it says the one
                   word the slide is about. */
                className="rounded-pill px-3 py-1 font-heading text-kicker uppercase"
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
                  textShadow: `0 1px 1px ${colors.brandDeep}4d`,
                }}
              >
                {visibility}
              </span>
            </div>

            {/* THE TAB. ONE tab, because Tags is the only one this slide sends
                the room to and inventing the others is inventing chrome. */}
            <div
              className="flex items-end gap-6 px-5"
              style={{ boxShadow: `inset 0 -1.5px 0 0 ${colors.line}` }}
            >
              <span
                className="pb-2 font-heading text-body-sm font-bold"
                style={{
                  color: colors.brandDark,
                  boxShadow: `inset 0 -2.5px 0 0 ${colors.brand}`,
                }}
              >
                Tags
              </span>
            </div>

            {/* THE TAGS TABLE. */}
            <div className={`px-5 ${compact ? 'py-3' : 'py-4'}`}>
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
                    <span
                      className="text-right font-mono"
                      style={{ fontSize: compact ? 16 : 17, color: colors.body }}
                    >
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

            {/* THE COPY ROW. Hub puts the pull command on the page for copying,
                so the figure puts it on the page. The button is drawn because it
                is what the room clicks, and it says COPY rather than showing a
                clipboard glyph the deck would then have to teach. */}
            <div
              className="flex items-center gap-3 px-5 py-3"
              style={{
                background: `linear-gradient(180deg, ${colors.surface} 0%, ${colors.surface2} 100%)`,
                boxShadow: `inset 0 1px 0 0 ${colors.white}, inset 0 1.5px 0 0 ${colors.line}`,
              }}
            >
              <span
                className="min-w-0 flex-1 truncate rounded-[10px] px-3 py-2 font-mono"
                style={{
                  fontSize: mono,
                  color: colors.ink,
                  background: colors.white,
                  boxShadow: `inset 0 0 0 1px ${colors.line}, inset 0 1px 2px 0 ${colors.brandDeep}14`,
                }}
              >
                {pullCommand}
              </span>
              <span
                className="shrink-0 rounded-[10px] px-3 py-2 font-heading text-kicker uppercase"
                style={{
                  color: colors.white,
                  background: [
                    `radial-gradient(120% 140% at 14% 0%, ${colors.white}80 0%, ${colors.white}00 62%)`,
                    /* `#4C7AFD` is `brand` lifted ~12%: the palette only ramps
                       darker, and section 9 accepts a lift above the base. */
                    `linear-gradient(135deg, #4C7AFD 0%, ${colors.brand} 52%, ${colors.brandDark} 100%)`,
                  ].join(', '),
                  boxShadow: [
                    `0 3px 10px -4px ${colors.brand}59`,
                    `inset 0 1px 0 0 ${colors.white}b3`,
                    `inset 0 -1px 0 0 ${colors.brandDeep}2e`,
                  ].join(', '),
                  textShadow: `0 1px 1px ${colors.brandDeep}4d`,
                }}
              >
                Copy
              </span>
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
