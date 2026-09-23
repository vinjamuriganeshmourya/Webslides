import { Reveal, RevealGroup } from '@/motion/Reveal'
import { colors } from '@/design/tokens'
import type { RegistryPageProps } from './registryPage'

/**
 * CANDIDATE 3 -- PULL CARD. The command is the hero, the page is its footnote.
 *
 * THE REFUSAL. The other candidates all answer "what does the page look like".
 * This one asks whether the room needs the page at all. What actually changed
 * when the push finished is that ONE LINE now works on any machine on earth, and
 * that line is the payoff. So the command is set at hero scale on a lit navy
 * slab, and the repository, the tag, the size and the push time drop to a
 * supporting line beneath it.
 *
 * It is the only candidate with no table, which is why it is the only one that
 * cannot be misread as a screenshot: nothing here imitates a page's layout, so
 * there is nothing to imitate wrongly. The dark slab is the deck's own code
 * register, and the room has read commands on that ground since session 1.
 *
 * The PUBLIC badge stays, and it is the load-bearing word: `docker pull` on a
 * private repository fails for everyone but its owner, so "the command works"
 * and "the repository is public" are one claim, not two.
 *
 * WORST AT: the word "visible". The slide sits under the middle box of the
 * target picture, which the deck has drawn twice as a place things LIVE, and a
 * command is not a place. Also more than one tag: a second row demotes the hero
 * line to a heading over a list, at which point `TagLedger` does the same job
 * with less ceremony. And it is the candidate most likely to duplicate the NEXT
 * slide, `c3-pull`, which runs this exact command in a terminal -- two slides
 * whose hero is one string is a repetition the room will feel.
 */
export function PullCard({
  repo,
  visibility,
  tags,
  pullCommand,
  caption,
  compact = false,
  className = '',
}: RegistryPageProps) {
  const hero = tags.find((t) => t.key) ?? tags[0]

  return (
    <div className={`mx-auto w-full ${compact ? 'max-w-[560px]' : 'max-w-[860px]'} ${className}`}>
      <RevealGroup className="block" stagger={0.1}>
        <Reveal dir="up">
          <div
            /* THE SLAB. Navy, lit from the top-left, and the ramp travels the
               full corner-to-corner distance section 9 asks for. */
            className={`overflow-hidden rounded-card ${compact ? 'px-5 py-5' : 'px-8 py-7'}`}
            style={{
              background: [
                `radial-gradient(120% 120% at 12% 0%, ${colors.white}26 0%, ${colors.white}00 60%)`,
                `linear-gradient(135deg, ${colors.night3} 0%, ${colors.brandDeep} 52%, ${colors.night} 100%)`,
              ].join(', '),
              boxShadow: [
                `0 14px 34px -14px ${colors.brandDeep}8c`,
                `inset 0 1px 0 0 ${colors.white}40`,
                `inset 0 -1px 0 0 ${colors.night}`,
              ].join(', '),
            }}
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span
                className="font-heading text-kicker uppercase"
                style={{ color: `${colors.white}b3` }}
              >
                On any machine
              </span>
              <span
                className="rounded-pill px-3 py-1 font-heading text-kicker uppercase"
                style={{
                  color: colors.white,
                  background: [
                    `radial-gradient(120% 140% at 14% 0%, ${colors.white}80 0%, ${colors.white}00 62%)`,
                    `linear-gradient(135deg, ${colors.success} 0%, ${colors.success} 52%, ${colors.tealDark} 100%)`,
                  ].join(', '),
                  boxShadow: [
                    `0 3px 10px -4px ${colors.success}8c`,
                    `inset 0 1px 0 0 ${colors.white}b3`,
                    `inset 0 -1px 0 0 ${colors.success}2e`,
                  ].join(', '),
                }}
              >
                {visibility}
              </span>
            </div>

            {/* THE HERO LINE. Sized so it fills the slab's width at either
                measure WITHOUT WRAPPING: a command that wraps stops reading as
                one thing you type. The compact size is 17 and not the 21 it
                started at, because at 21 this exact fixture broke after
                `nxttrendz-` in the 460px column beside a points list, which is
                the one place the compact size exists for. */}
            <p
              className={`${compact ? 'mt-3' : 'mt-4'} break-words font-mono font-bold leading-tight`}
              style={{
                fontSize: compact ? 17 : 32,
                color: colors.white,
                textShadow: `0 2px 6px ${colors.night}cc`,
              }}
            >
              {pullCommand}
            </p>

            {/* THE SUPPORTING LINE. Everything section 6.1 authorises, demoted
                to one row of facts under the command it explains. */}
            <div
              className={`${compact ? 'mt-3.5 pt-3' : 'mt-5 pt-4'} flex flex-wrap items-baseline gap-x-6 gap-y-2`}
              style={{ boxShadow: `inset 0 1px 0 0 ${colors.white}26` }}
            >
              <Fact label="Repository" value={repo} mono compact={compact} />
              {hero && <Fact label="Tag" value={hero.tag} mono compact={compact} />}
              {hero && <Fact label="Size" value={hero.size} mono compact={compact} />}
              {hero && <Fact label="Pushed" value={hero.pushed} compact={compact} />}
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

function Fact({
  label,
  value,
  mono = false,
  compact,
}: {
  label: string
  value: string
  mono?: boolean
  compact: boolean
}) {
  return (
    <span className="flex min-w-0 flex-col gap-0.5">
      <span
        className="font-heading text-kicker uppercase"
        style={{ color: `${colors.white}a6` }}
      >
        {label}
      </span>
      <span
        className={`truncate ${mono ? 'font-mono' : ''} font-semibold`}
        style={{ fontSize: compact ? 16 : 19, color: colors.white }}
      >
        {value}
      </span>
    </span>
  )
}
