import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { Character } from '@/rig/Character'
import { defaultPose } from '@/rig/channels'
import { buildSkin, PRESETS, type CharacterConfig } from '@/skins'
import { poseAt } from '@/rig/compose'
import { ACTIONS } from '@/actions'

const HAIR = ['short', 'sidePart', 'quiff', 'curly', 'buzz', 'braid', 'ponytail', 'bob', 'long', 'bun', 'wavy'] as const
const TOPS = ['shirt', 'tshirt', 'kurta', 'hoodie', 'blouse', 'polo'] as const
const BOTTOMS = ['trousers', 'jeans', 'skirt', 'salwar', 'shorts'] as const
const JAWS = ['round', 'oval', 'square'] as const
const TONES = ['fair', 'wheatish', 'medium', 'dusky', 'deep', '#8D5524'] as const

function variant(i: number): CharacterConfig {
  const base = i % 2 ? PRESETS.riya : PRESETS.arjun
  return {
    ...base,
    name: `v${i}`,
    skinTone: TONES[i % TONES.length],
    hair: { style: HAIR[i % HAIR.length], color: i % 3 ? 'black' : '#5A3825' },
    face: { ...base.face, jaw: JAWS[i % JAWS.length] },
    outfit: { ...base.outfit, top: TOPS[i % TOPS.length], bottom: BOTTOMS[i % BOTTOMS.length] },
    accessories: { glasses: i % 3 === 0 ? 'round' : i % 3 === 1 ? 'rect' : 'none', beard: i % 4 === 0 ? 'stubble' : 'none', earrings: i % 2 === 1, bindi: i % 5 === 0, flower: i % 7 === 0, watch: i % 2 === 0, necklace: i % 6 === 0 },
    build: { height: 0.9 + (i % 5) * 0.05, shoulders: 0.9 + (i % 3) * 0.1 },
  }
}

function markup(cfg: CharacterConfig, pose = defaultPose()) {
  return renderToStaticMarkup(<Character pose={pose} skin={buildSkin(cfg)} />)
}

describe('configuration', () => {
  it('both presets draw', () => {
    for (const cfg of Object.values(PRESETS)) {
      const svg = markup(cfg)
      expect(svg).toMatch(/^<svg/)
      expect(svg).not.toMatch(/NaN|undefined/)
    }
  })
  it('sixty mixed configurations all draw without NaN', () => {
    for (let i = 0; i < 60; i++) {
      const svg = markup(variant(i))
      expect(svg, `variant ${i}`).toMatch(/^<svg/)
      expect(svg, `variant ${i}`).not.toMatch(/NaN|undefined/)
    }
  })
  it('a mid-gesture pose draws without NaN', () => {
    const pose = poseAt({ seed: 1, idle: {}, gesture: { action: ACTIONS.wave, start: 0 } }, 0.9)
    expect(markup(PRESETS.riya, pose)).not.toMatch(/NaN|undefined/)
  })
  it('two actors on one page share no id', () => {
    const page = renderToStaticMarkup(
      <div>
        <Character pose={defaultPose()} skin={buildSkin(PRESETS.arjun)} />
        <Character pose={defaultPose()} skin={buildSkin(PRESETS.riya)} />
      </div>,
    )
    const ids = [...page.matchAll(/ id="([^"]+)"/g)].map((m) => m[1])
    expect(new Set(ids).size, 'duplicate ids').toBe(ids.length)
  })
  it('the parts a harness looks for are named', () => {
    const svg = markup(PRESETS.arjun)
    for (const part of ['head', 'arm-L', 'arm-R', 'mouth']) expect(svg, part).toContain(`data-part="${part}"`)
  })
})
