import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Group, Lines } from './common'
import { Ask, sentences } from './pieces'
import { SPEC } from './spec'

/**
 * RECAP: THREE QUICK ONES. Spec card S-RECAP, four presses, format "rapid".
 *
 * Last class's two set lines on top, and three tiles, one per print line,
 * face down (the question side up). The room writes all three answers
 * first; then one tile turns per press, in order, showing what the line
 * printed and the why line beside it. Each tile is a full-width row, so the
 * 62-character TypeError sits on one line (align-check: no token wraps).
 * Nobody is named. Every line was run on CPython 3.12.3.
 */
const R = SPEC['S-RECAP']
type Tile = { line: string; output: string; why: string }
const TILES: Tile[] = R.data.tiles
const H = 96
/* The turn: 0.7s on a symmetric ease, so the rotation is on screen the whole way and the tile is edge-on at exactly 0.35s. */
const TURN = 0.7
const TURN_EASE = [0.45, 0, 0.55, 1] as const

function FlipTile({ t, n, open }: { t: Tile; n: number; open: boolean }) {
  const instant = useInstant()
  const tween = useTween(520)
  const err = /Error/.test(t.output)
  const side = 'absolute inset-0 rounded-2xl'
  /* Both sides stay on the page through the turn (backface-visibility culls the one facing away, every frame); the side
     that turned away is hidden only once the turn is over, so at rest only the side the room sees is on the page
     (overlap-check measures both otherwise). It used to hide the back and show the face at a fixed 0.38s, but on the
     house ease the tile is edge-on by 0.1s, so the room saw a blink of the back, a blank, and the face popping in
     nearly flat: no visible flip (fix pass, 2026-10-12). */
  const vis = (on: boolean) => ({ visibility: on ? 'visible' : 'hidden', transition: instant ? 'none' : `visibility 0s linear ${on ? 0 : TURN}s` }) as const
  return (
    <div className="relative w-full" style={{ height: H, perspective: 1400 }}>
      <motion.div className="relative h-full w-full" style={{ transformStyle: 'preserve-3d' }} initial={false} animate={{ rotateX: open ? 0 : 180 }} transition={{ duration: instant ? 0 : TURN, ease: TURN_EASE }}>
        {/* the face: the line, what it printed, why */}
        <div className={`${side} flex items-center gap-4 px-5`} style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', background: colors.white, boxShadow: `0 0 0 2px ${err ? colors.danger : colors.success}, 0 14px 30px -18px rgba(16,32,58,0.35)`, ...vis(open), transitionProperty: 'visibility, box-shadow', transitionDuration: instant ? '0s' : '0s, 520ms', transitionDelay: instant ? '0s' : `${open ? 0 : TURN}s, 0s` }}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-heading text-[18px] font-bold" style={{ background: colors.brandDark, color: colors.white }}>
            {n}
          </span>
          <span className="shrink-0 whitespace-nowrap rounded-lg px-3 py-1 font-mono text-[15px] font-bold" style={{ background: colors.night2, color: colors.white }}>
            {t.line}
          </span>
          <span className="shrink-0 whitespace-pre rounded-md px-2.5 py-0.5 font-mono text-[14px] font-bold leading-[20px]" style={{ background: err ? '#FDECEC' : '#E9F8EF', color: err ? colors.danger : colors.ink, boxShadow: `inset 0 0 0 1.5px ${err ? colors.danger : colors.success}` }}>
            {t.output}
          </span>
          <span className="min-w-0 text-[15px] font-semibold leading-snug" style={{ color: colors.body }}>
            <Lines lines={sentences(t.why)} />
          </span>
        </div>
        {/* the back, up first: the tile's number and its print line */}
        <div className={`${side} flex items-center gap-4 px-5`} style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateX(180deg)', background: `repeating-linear-gradient(135deg, ${colors.surface2} 0 14px, ${colors.surface} 14px 28px)`, boxShadow: `0 0 0 1.5px ${colors.line}, 0 12px 28px -20px rgba(16,32,58,0.3)`, ...vis(!open) }}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-heading text-[18px] font-bold" style={{ background: colors.white, color: colors.brandDark, boxShadow: `0 0 0 2px ${colors.line}`, transition: tween }}>
            {n}
          </span>
          <span className="whitespace-nowrap rounded-lg px-3 py-1.5 font-mono text-[16px] font-bold" style={{ background: colors.night2, color: colors.white }}>
            {t.line}
          </span>
        </div>
      </motion.div>
    </div>
  )
}

export function RecapTiles() {
  const beat = useBeats(4)
  return (
    <>
      <div className="flex flex-col gap-3">
        <Group pad={10} className="flex flex-col gap-2" active={beat === 1}>
          <div className="flex items-center gap-4">
            <span className="whitespace-nowrap text-[16px] font-semibold" style={{ color: colors.body }}>
              <Lines lines={sentences(R.show[0])} />
            </span>
            <span className="rounded-lg px-3 py-1 font-mono text-[14px] font-semibold leading-[20px]" style={{ background: colors.night2, color: colors.white }}>
              {(R.data.base as string).split('\n').map((l, i) => (
                <span key={i} className="block whitespace-pre">
                  {l}
                </span>
              ))}
            </span>
          </div>
          <Ask size={20}>{R.show[1]}</Ask>
        </Group>
        <div className="flex flex-col gap-3">
          {TILES.map((t, i) => (
            <FlipTile key={t.line} t={t} n={i + 1} open={beat >= i + 2} />
          ))}
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
