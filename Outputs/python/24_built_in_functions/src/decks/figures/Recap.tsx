import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Focus, Group, Lines } from './common'
import { BLANK } from './Code'
import { Ask, sentences } from './pieces'
import { CodePane } from './trace'
import { SPEC } from './spec'

/**
 * RECAP: THREE CALLS FROM LAST CLASS. Spec card S-RECAP, seven presses,
 * format "rapid": the room says each output out loud before its tile turns.
 *
 * Three tiles, side by side, all there from press 1. Tiles 1 and 2 share one
 * program whose last line is a blank; tile 3 holds the increment program.
 * Each pair of presses: the tile's line lights in its program (the blank
 * fills), then the tile's face turns over to show what it prints and the why
 * line. A turned tile stays turned. Tile 3 is last (its must line). Every
 * program, output and why line is the spec's data, run on CPython.
 */
const R = SPEC['S-RECAP']
type Tile = { code: string; line: string; prints: string; why: string }
const TILES: Tile[] = R.data.tiles

/** Tiles 1 and 2 open with their last line a fill-in blank (rule G4); tile 3 holds its whole program from the start. */
function codeOf(t: Tile, i: number, lit: boolean) {
  const lines = t.code.split('\n')
  const last = lines.length - 1
  if (lit || i === 2) return t.code
  return [...lines.slice(0, last), BLANK].join('\n')
}
const lineNo = (t: Tile) => t.code.split('\n').lastIndexOf(t.line) + 1

function FlipFace({ n, tile, turned }: { n: number; tile: Tile; turned: boolean }) {
  const instant = useInstant()
  const face = 'absolute inset-0 rounded-card [backface-visibility:hidden]'
  return (
    <div className="relative h-[138px] w-full [perspective:900px]">
      <div
        className="relative h-full w-full [transform-style:preserve-3d]"
        style={{ transform: turned ? 'rotateY(180deg)' : 'none', transition: instant ? 'none' : 'transform 720ms cubic-bezier(0.22, 1, 0.36, 1)' }}
      >
        {/* the back: face down, the tile's number */}
        <div className={`${face} grid place-items-center`} style={{ background: colors.surface2, boxShadow: `inset 0 0 0 2px ${colors.line}` }}>
          <span className="font-heading text-[44px] font-bold leading-none" style={{ color: colors.brandDark, opacity: 0.35 }}>
            {n}
          </span>
        </div>
        {/* the face: the output and the why line */}
        <div className={`${face} flex flex-col gap-2 px-4 py-3`} style={{ transform: 'rotateY(180deg)', background: colors.white, boxShadow: `inset 0 0 0 2px ${colors.success}` }}>
          <span className="self-start rounded-md px-3 py-1 font-mono text-[22px] font-bold" style={{ background: `${colors.success}14`, color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${colors.success}` }}>
            {tile.prints}
          </span>
          <span className="text-[15.5px] font-semibold leading-snug" style={{ color: colors.body }}>
            <Lines lines={sentences(tile.why)} />
          </span>
        </div>
      </div>
    </div>
  )
}

export function RecapTiles() {
  const beat = useBeats(7)
  /* beats 2, 4, 6 light tile 0, 1, 2; beats 3, 5, 7 turn it */
  const lit = (i: number) => beat >= 2 + i * 2
  const turned = (i: number) => beat >= 3 + i * 2
  /* the program whose output was just shown is ringed; the ring leaves on the next press, or when the tile turns back */
  const justShown = (i: number) => beat === 3 + i * 2
  return (
    <>
      <div className="flex flex-col gap-4">
        {/* unequal outer columns, so the middle tile is not read as a centred block (content rule 38) */}
        <div className="grid gap-5" style={{ gridTemplateColumns: '384px 360px 366px' }}>
          {TILES.map((t, i) => (
            /* one tile = its program and its output, in one group (rule G3) */
            <Group key={i} pad={10} className="flex min-w-0 flex-col gap-2.5">
              <Focus on={justShown(i)}>
                <CodePane code={codeOf(t, i, lit(i))} highlight={lit(i) ? lineNo(t) : undefined} fontSize={14} rows={6} />
              </Focus>
              <FlipFace n={i + 1} tile={t} turned={turned(i)} />
            </Group>
          ))}
        </div>
        <Ask size={22}>
          <Lines lines={sentences(R.show[0])} />
        </Ask>
      </div>
      <StepControls at={beat} total={7} />
    </>
  )
}
