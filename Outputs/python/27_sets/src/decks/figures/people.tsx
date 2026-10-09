import { memo, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { TEJA } from './Cast'
import { Character } from './cast/rig/Character'
import { useCharacter } from './cast/rig/useCharacter'
import { buildSkin, type CharacterConfig } from './cast/skins/config'

/**
 * THE PEOPLE OF PF 27 "SETS" (spec note 2: Teja's Instagram story and his
 * Close Friends list). Every person is a character-lab character (generate-
 * slides 2b, item 12): the chips in the bag and the rows in the app wear a
 * face cut from the lab's rig (`FACE` crop), held still in a happy
 * expression. No beard on anyone (a beard is round or oval, or none).
 *
 * Teja is session 26's Teja, the same student (spec note 2).
 */
const base = { art: 'soft', shading: 'flat', accessories: {}, build: { height: 1, shoulders: 1 } } as const

const RAVI: CharacterConfig = {
  ...base,
  name: 'Ravi',
  gender: 'male',
  skinTone: 'medium',
  hair: { style: 'sidePart', color: 'black' },
  face: { jaw: 'round', brows: 'medium', eyes: 'oval', mouth: 'full' },
  outfit: { top: 'tshirt', topColor: '#FF8A3D', bottom: 'jeans', bottomColor: '#1B2238' },
}

const ANU: CharacterConfig = {
  ...base,
  name: 'Anu',
  gender: 'female',
  art: 'line',
  skinTone: 'wheatish',
  hair: { style: 'ponytail', color: 'darkBrown' },
  face: { jaw: 'oval', brows: 'thin', eyes: 'dot', mouth: 'line' },
  outfit: { top: 'blouse', topColor: '#B24A7A', bottom: 'jeans', bottomColor: '#1B2238' },
  accessories: { earrings: true },
}

const KIRAN: CharacterConfig = {
  ...base,
  name: 'Kiran',
  gender: 'male',
  skinTone: 'dusky',
  hair: { style: 'buzz', color: 'black' },
  face: { jaw: 'square', brows: 'thick', eyes: 'oval', mouth: 'full' },
  outfit: { top: 'polo', topColor: '#2D63FB', bottom: 'trousers', bottomColor: '#1B2238' },
  accessories: { glasses: 'round' },
}

const SNEHA: CharacterConfig = {
  ...base,
  name: 'Sneha',
  gender: 'female',
  art: 'line',
  skinTone: 'fair',
  hair: { style: 'long', color: 'black' },
  face: { jaw: 'oval', brows: 'thin', eyes: 'dot', mouth: 'line' },
  outfit: { top: 'kurta', topColor: '#7C5CFF', bottom: 'salwar', bottomColor: '#3A2E7A' },
  accessories: { bindi: true },
}

const POOJA: CharacterConfig = {
  ...base,
  name: 'Pooja',
  gender: 'female',
  art: 'line',
  skinTone: 'medium',
  hair: { style: 'braid', color: 'darkBrown' },
  face: { jaw: 'round', brows: 'medium', eyes: 'dot', mouth: 'line' },
  outfit: { top: 'kurta', topColor: '#12B5A8', bottom: 'salwar', bottomColor: '#0E5F59' },
  accessories: { earrings: true },
}

const VAMSI: CharacterConfig = {
  ...base,
  name: 'Vamsi',
  gender: 'male',
  skinTone: 'wheatish',
  hair: { style: 'quiff', color: 'darkBrown' },
  face: { jaw: 'oval', brows: 'medium', eyes: 'oval', mouth: 'full' },
  outfit: { top: 'hoodie', topColor: '#475569', bottom: 'jeans', bottomColor: '#1B2238' },
  accessories: { glasses: 'rect' },
}

/** Each person, by the name Python holds (a small-letter `ravi` is still Ravi's face: one person, two strings). */
const CAST: Record<string, CharacterConfig> = { teja: TEJA, ravi: RAVI, anu: ANU, kiran: KIRAN, sneha: SNEHA, pooja: POOJA, vamsi: VAMSI }

export function isPerson(name: string) {
  return name.toLowerCase() in CAST
}

/**
 * A round face, `size` across, cut from the lab character and held still in
 * a happy expression. The svg itself is cut to the face (its viewBox and
 * size), as session 25's `Idling` does, so every layout check measures the
 * circle the room sees, not the rig's 400 x 600 canvas.
 */
export const Face = memo(function Face({ name, size = 30, ring }: { name: string; size?: number; ring?: string }) {
  const cfg = CAST[name.toLowerCase()]
  return (
    <span className="relative block shrink-0 overflow-hidden rounded-full" style={{ width: size, height: size, background: '#E8EEF8', boxShadow: ring ? `0 0 0 2px ${ring}` : undefined }}>
      {cfg && <Still cfg={cfg} size={size} seed={name.length} />}
    </span>
  )
})

function Still({ cfg, size, seed }: { cfg: CharacterConfig; size: number; seed: number }) {
  const skin = useMemo(() => buildSkin(cfg), [cfg])
  const c = useCharacter({ clock: 'manual', seed })
  const { seek, setExpression } = c
  useEffect(() => {
    setExpression('happy')
    seek(0.45)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  /* the crop: a square round the whole head, hair to chin, centred on the
     head (the lab's head centre is x 200, y 120; user 2026-10-08: faces were
     cut in half by the old, tighter window) */
  const side = 150
  const x0 = 200 - side / 2
  const y0 = 116 - side / 2
  const box = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    const svg = box.current?.querySelector('svg')
    if (!svg) return
    svg.setAttribute('viewBox', `${x0} ${y0} ${side} ${side}`)
    svg.setAttribute('width', String(size))
    svg.setAttribute('height', String(size))
  })
  return (
    <span ref={box} className="absolute inset-0 block">
      <Character pose={c.pose} skin={skin} width={size} />
    </span>
  )
}
