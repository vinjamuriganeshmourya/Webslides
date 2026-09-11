import { Reveal, RevealGroup } from '@/motion/Reveal'
import { colors } from '@/design/tokens'
import type { RegistryPageProps } from './registryPage'

/**
 * CANDIDATE 4 -- SPLIT PROOF. Not a page, a correspondence.
 *
 * THE ONLY CANDIDATE WHERE THE DRAWING MAKES THE CLAIM. The other three arrange
 * facts that the lead sentence has already asserted. This one argues something a
 * sentence has to be believed for: the thing sitting on your laptop and the
 * thing sitting on Docker Hub are THE SAME IMAGE. Left is the row the room
 * already saw from `docker images`; right is the tag now on Hub; and the twelve
 * characters they share are drawn once, between them, as the join.
 *
 * WHY THE ID IS IN THE SPINE AND NOT IN THE RIGHT PANEL. Hub's Tags tab shows a
 * DIGEST, not this short image ID, so an `IMAGE ID` cell drawn under a "Docker
 * Hub" heading would be a figure claiming a page displays something it does not.
 * Putting it once in the spine keeps the claim to what the deck can actually
 * back: the room watched `docker images` print that ID for both the local name
 * and the tagged name (session 6 already quotes exactly that output), so the
 * identity is quoted rather than invented. The panels then only show what each
 * side really lists.
 *
 * WORST AT: the word "public". Its whole subject is sameness, and sameness is
 * true of a private repository too, so the badge has to carry the public claim
 * alone against a drawing that is arguing something else. It also needs the
 * `local` field, which no other candidate reads -- the widest contract of the
 * four, and the one most easily fed a fixture it cannot honour. And it is two
 * panels plus a spine, so at half width it stacks, the spine turns from a join
 * into a divider, and the correspondence weakens into a sequence.
 */
export function SplitProof({
  repo,
  visibility,
  tags,
  pullCommand,
  local,
  caption,
  compact = false,
  className = '',
}: RegistryPageProps) {
  const hero = tags.find((t) => t.key) ?? tags[0]
  const sharedId = local?.imageId ?? hero?.imageId

  return (
    <div className={`mx-auto w-full ${compact ? 'max-w-[560px]' : 'max-w-[980px]'} ${className}`}>
      <RevealGroup className="block" stagger={0.1}>
        <Reveal dir="up">
          <div className={compact ? 'flex flex-col gap-2' : 'grid items-stretch gap-3 md:gap-3'}
            style={compact ? undefined : { gridTemplateColumns: '1fr auto 1fr' }}
          >
            {/* LEFT: the learner's own machine. Recessed, because it is the
                familiar side and it is where the room already is. */}
            <Side
              eyebrow="On your laptop"
              title={local?.repository ?? ''}
              recessed
              compact={compact}
              rows={
                local
                  ? [
                      { label: 'Tag', value: local.tag },
                      { label: 'Created', value: local.created, plain: true },
                      { label: 'Size', value: local.size },
                    ]
                  : []
              }
            />

            {/* THE SPINE. The shared ID lives here and nowhere else. */}
            <div
              className={
                compact
                  ? 'flex items-center gap-3 rounded-[12px] px-3.5 py-1.5'
                  : 'flex flex-col items-center justify-center gap-2 rounded-[12px] px-3 py-3'
              }
              style={{
                background: [
                  `radial-gradient(120% 140% at 14% 0%, ${colors.white}80 0%, ${colors.white}00 62%)`,
                  `linear-gradient(135deg, ${colors.white} 0%, ${colors.surface} 52%, ${colors.surface2} 100%)`,
                ].join(', '),
                boxShadow: [
                  `0 3px 10px -4px ${colors.brand}59`,
                  `inset 0 1px 0 0 ${colors.white}`,
                  `inset 0 -1px 0 0 ${colors.brand}2e`,
                  `inset 0 0 0 1.5px ${colors.brand}`,
                ].join(', '),
                minWidth: compact ? undefined : 132,
              }}
            >
              <span
                className="text-center font-heading text-kicker uppercase"
                style={{ color: colors.brandDark }}
              >
                Same image
              </span>
              <span
                className="text-center font-mono font-bold leading-tight"
                style={{ fontSize: compact ? 17 : 19, color: colors.ink }}
              >
                {sharedId}
              </span>
              <span
                className="text-center font-heading text-kicker uppercase"
                style={{ color: colors.muted }}
              >
                Image ID
              </span>
            </div>

            {/* RIGHT: Docker Hub. Raised, because it is the new place. */}
            <Side
              eyebrow="On Docker Hub"
              title={repo}
              badge={visibility}
              compact={compact}
              rows={
                hero
                  ? [
                      { label: 'Tag', value: hero.tag },
                      { label: 'Pushed', value: hero.pushed, plain: true },
                      { label: 'Size', value: hero.size },
                    ]
                  : []
              }
            />
          </div>
        </Reveal>

        {/* THE PULL LINE. It belongs to the right-hand side only, which is the
            point of the whole figure: the same image, but now with an address
            anyone can fetch it from. */}
        <Reveal dir="up">
          <div
            className={`${compact ? 'mt-2' : 'mt-3'} flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-[12px] px-4 ${compact ? 'py-2' : 'py-2.5'}`}
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
            <span
              className="font-mono font-semibold"
              style={{ fontSize: compact ? 17 : 19, color: colors.ink }}
            >
              {pullCommand}
            </span>
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

function Side({
  eyebrow,
  title,
  rows,
  badge,
  recessed = false,
  compact,
}: {
  eyebrow: string
  title: string
  rows: { label: string; value: string; plain?: boolean }[]
  badge?: string
  recessed?: boolean
  compact: boolean
}) {
  return (
    <div
      className={`overflow-hidden rounded-card ${compact ? 'px-4 py-2' : 'px-5 py-4'}`}
      style={{
        background: recessed
          ? `linear-gradient(180deg, ${colors.surface2} 0%, ${colors.surface} 100%)`
          : [
              `radial-gradient(120% 100% at 14% 0%, ${colors.white}99 0%, ${colors.white}00 62%)`,
              `linear-gradient(135deg, ${colors.white} 0%, ${colors.white} 52%, ${colors.surface} 100%)`,
            ].join(', '),
        boxShadow: recessed
          ? /* Flatter means less light, never no light: the familiar side keeps
               its hairlines and drops the drop shadow. */
            [
              `inset 0 2px 5px -2px ${colors.brandDeep}1f`,
              `inset 0 -1px 0 0 ${colors.white}`,
              `inset 0 0 0 1px ${colors.line}`,
            ].join(', ')
          : [
              `0 8px 22px -12px ${colors.brandDeep}59`,
              `inset 0 1px 0 0 ${colors.white}`,
              `inset 0 -1px 0 0 ${colors.brandDeep}2e`,
              `inset 0 0 0 1px ${colors.line}`,
            ].join(', '),
      }}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span
          className="font-heading text-kicker uppercase"
          style={{ color: recessed ? colors.muted : colors.brandDark }}
        >
          {eyebrow}
        </span>
        {badge && (
          <span
            className="rounded-pill px-2.5 py-0.5 font-heading text-kicker uppercase"
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
            {badge}
          </span>
        )}
      </div>

      <p
        className="mt-1.5 break-words font-mono font-bold leading-tight"
        style={{ fontSize: compact ? 17 : 21, color: colors.ink }}
      >
        {title}
      </p>

      <div className={`${compact ? 'mt-2' : 'mt-3'} flex flex-col gap-0.5`}>
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-3">
            <span
              className="font-heading text-kicker uppercase"
              style={{ color: colors.muted }}
            >
              {r.label}
            </span>
            <span
              className={`${r.plain ? '' : 'font-mono'} font-semibold`}
              style={{ fontSize: compact ? 16 : 17, color: colors.body }}
            >
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
