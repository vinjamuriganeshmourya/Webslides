import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { poseAt } from '@/rig/compose'
import { idlePose } from '@/rig/idle'
import { ACTIONS, EXPRESSIONS } from '@/actions'

const tl = (seed: number) => ({
  seed,
  idle: {},
  expression: { action: EXPRESSIONS.happy, start: 0 },
  gesture: { action: ACTIONS.wave, start: 0.5 },
})

function walk(dir: string, out: string[] = []): string[] {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

describe('determinism', () => {
  it('the same timeline at the same time gives the same pose', () => {
    for (const t of [0, 0.37, 1.2, 4.8, 9.99]) expect(poseAt(tl(7), t)).toEqual(poseAt(tl(7), t))
  })
  it('idle is a function of (t, seed)', () => {
    expect(idlePose(3.3, 1)).toEqual(idlePose(3.3, 1))
    const a = JSON.stringify(idlePose(3.3, 1))
    const b = JSON.stringify(idlePose(3.3, 2))
    expect(a).not.toEqual(b)
  })
  it('no clock or dice under src/rig or src/actions', () => {
    const files = [...walk(join(__dirname, '../src/rig')), ...walk(join(__dirname, '../src/actions'))]
    for (const f of files) {
      /* comments may talk about the rule; code may not break it */
      const src = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
      /* the runtime clock is the one place allowed to read time */
      if (f.endsWith('useCharacter.ts')) continue
      expect(src, f).not.toMatch(/Math\.random|Date\.now|performance\.now/)
    }
  })
})
