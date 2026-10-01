/* The query string is how the harnesses set up one actor. Everything here
 * is optional and tolerant: a bad value falls back to a sane default with a
 * console warning rather than a blank page, because a contact sheet of 80
 * clips should not die on one typo. */
import { PRESETS, type CharacterConfig } from '@/skins'
import type { PlayOptions } from '@/rig/useCharacter'

export type UrlSetup = {
  /** what data-skin on the actor element says: the preset name or the config's name */
  skinId: string
  config: CharacterConfig
  expression?: string
  intensity?: number
  gesture?: string
  play: PlayOptions
  say?: string
  seed?: number
  /** given means a manual clock, seeked here */
  t?: number
  reel: boolean
  bg: string
}

function num(v: string | null): number | undefined {
  if (v === null || v.trim() === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

function preset(name: string | null): keyof typeof PRESETS {
  if (name && name in PRESETS) return name as keyof typeof PRESETS
  if (name) console.warn(`unknown skin "${name}", using arjun`)
  return 'arjun'
}

/* A config overrides the preset it sits on top of; a partial config is
   therefore fine, it just keeps the preset's other fields. */
function parseConfig(raw: string | null, base: CharacterConfig): CharacterConfig {
  if (!raw) return base
  try {
    return { ...base, ...(JSON.parse(raw) as Partial<CharacterConfig>) }
  } catch (err) {
    console.warn('could not parse ?config=', err)
    return base
  }
}

/** null means no single-actor setup was asked for: show the lab. */
export function readUrl(search: string): UrlSetup | null {
  const q = new URLSearchParams(search)
  const reel = q.get('reel') === '1'
  if (!q.has('skin') && !q.has('config') && !reel) return null

  const skin = preset(q.get('skin'))
  const config = parseConfig(q.get('config'), PRESETS[skin])
  const side = q.get('side')

  return {
    skinId: q.has('config') ? config.name.toLowerCase() : skin,
    config,
    expression: q.get('expression') ?? undefined,
    intensity: num(q.get('intensity')),
    gesture: q.get('gesture') ?? undefined,
    play: {
      speed: num(q.get('speed')),
      amplitude: num(q.get('amplitude')),
      side: side === 'L' || side === 'R' ? side : undefined,
      loop: q.get('loop') === '1' ? true : undefined,
    },
    say: q.get('say') ?? undefined,
    seed: num(q.get('seed')),
    t: num(q.get('t')),
    reel,
    bg: q.get('bg') ?? (reel ? '#FFFFFF' : '#F6F8FB'),
  }
}
