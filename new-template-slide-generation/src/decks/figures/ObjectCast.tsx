import type { ReactNode } from 'react'
import { LayoutGroup, motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Lines } from './common'
import { OVER_SLOT, Speaker } from './Characters'
import { Note, Show, sentences } from './pieces'

/**
 * EVERY VALUE IS AN OBJECT; EACH OBJECT GETS AN ID. Spec cards C2 and C3.
 *
 * The story cast is session 18's: Anu at her laptop and the computer drawn
 * with a face (the spec: "PF 18's Anu and computer may be reused"). Anu
 * types three values; the computer keeps each one as an object, drawn as a
 * box in its memory; each object gets an id, labelled as an example, and on a
 * second run the id changes.
 *
 * The three values move from Anu's side into the memory panel by shared
 * layout (framer-motion `layoutId`), so the room sees the SAME value go in.
 * Bubbles are the spec's exact lines, one sentence per line (rule 36).
 */
const VALUES = ['"A"', '1.25', '[1, 2, 3]']
/* The original deck's own example ids (its slide 13), labelled as examples. */
const ID_A = '140035229724336'
const ID_A_AGAIN = '140589419285168'

const MOVE = { type: 'tween', duration: 0.8, ease: [0.22, 1, 0.36, 1] } as const

function Value({ v, id, boxed }: { v: string; id: string; boxed: boolean }) {
  const instant = useInstant()
  return (
    <motion.span
      layoutId={id}
      transition={instant ? { duration: 0 } : MOVE}
      className="inline-block rounded-xl px-4 py-1.5 font-mono text-[24px] font-semibold"
      style={{
        color: v.startsWith('"') ? colors.success : colors.brandDark,
        background: boxed ? colors.white : 'transparent',
        border: `2px solid ${boxed ? colors.brandDark : 'transparent'}`,
      }}
    >
      {v}
    </motion.span>
  )
}

function MemoryPanel({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[300px] w-[380px] shrink-0 flex-col rounded-card px-5 py-3" style={{ background: colors.surface2, boxShadow: `inset 0 0 0 2px ${colors.line}` }}>
      <span className="font-heading text-[15px] font-bold uppercase tracking-wider" style={{ color: colors.body }}>
        Computer memory
      </span>
      <div className="mt-3 flex flex-1 flex-col items-start gap-3">{children}</div>
    </div>
  )
}

function IdLabel({ id }: { id: string }) {
  const instant = useInstant()
  return (
    <motion.span
      key={id}
      initial={instant ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
      className="ml-3 inline-flex flex-col leading-tight"
    >
      <span className="font-mono text-[17px] font-bold" style={{ color: colors.accentDark }}>
        Id {id}
      </span>
      <span className="text-[14px] font-semibold italic" style={{ color: colors.muted }}>
        your number will be different
      </span>
    </motion.span>
  )
}

function Scene({ anu, pc, inMemory, idOf, banner }: { anu?: string; pc?: string; inMemory: boolean; idOf?: string; banner?: string }) {
  return (
    <LayoutGroup>
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-6">
          <Speaker who="anu" tail="over" slot={OVER_SLOT} height={170} bubbleWidth={230} size={18} say={anu ? <Lines lines={sentences(anu)} /> : undefined} beatKey={anu} />
          <div className="flex h-[300px] w-[200px] shrink-0 flex-col items-start justify-end gap-3 pb-6">
            {!inMemory && VALUES.map((v, i) => <Value key={v} v={v} id={`val-${i}`} boxed={false} />)}
          </div>
          <Speaker who="computer" tail="over" slot={OVER_SLOT} height={150} bubbleWidth={240} size={18} say={pc ? <Lines lines={sentences(pc)} /> : undefined} beatKey={pc} />
          <MemoryPanel>
            {inMemory &&
              VALUES.map((v, i) => (
                <div key={v} className="flex items-center">
                  <Value v={v} id={`val-${i}`} boxed />
                  {i === 0 && idOf && <IdLabel id={idOf} />}
                </div>
              ))}
          </MemoryPanel>
        </div>
        <Show on={!!banner}>
          <Note lines={banner ? [banner] : [' ']} size={20} />
        </Show>
      </div>
    </LayoutGroup>
  )
}

/** C2: Anu types three values; the computer keeps each one as an object. */
export function ObjectCast() {
  const beat = useBeats(3)
  return (
    <>
      <Scene anu="Anu types three values." pc={beat >= 2 ? 'I keep each one as an object.' : undefined} inMemory={beat >= 2} banner={beat >= 3 ? 'Strings, numbers, lists: all objects' : undefined} />
      <StepControls at={beat} total={3} />
    </>
  )
}

/** C3: where it is kept, its id (an example), and a second run with a new id. */
export function IdCast() {
  const beat = useBeats(3)
  return (
    <>
      <Scene
        anu="Where do you keep it?"
        pc={beat === 2 ? 'In my memory. Its id is its number.' : beat >= 3 ? 'Run again, and the id can change.' : undefined}
        inMemory
        idOf={beat === 2 ? ID_A : beat >= 3 ? ID_A_AGAIN : undefined}
      />
      <StepControls at={beat} total={3} />
    </>
  )
}
