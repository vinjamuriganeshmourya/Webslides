import type { CharacterConfig } from './cast/skins/config'
import { PRESETS } from './cast/skins/config'

/**
 * THE CAST OF "CLOUD COMPUTING FUNDAMENTALS" (plan decision 3). Every person
 * is a character-lab character (generate-slides 2b, item 12): a config for
 * the lab's rig in `./cast` (vendored unchanged from Python 31), never a
 * drawing. The clothes' colours are each character's own (the lab's art), so
 * they are written here as the lab writes them; the slide around them stays
 * on tokens (content rule 37). No beard except the operator's short one
 * (round or oval, or none).
 *
 *   MEERA     a founder who needs servers: the cloud side of every scene
 *   RAVI      the on-premise admin beside his racks: the owned side
 *   ARJUN     the lab's own preset: the provider's engineer at the counter
 *   ANITA     finance, who reads the bill
 *   OPERATOR  the mainframe era's operator
 *   TENANTS   four faces for tenants, readers and senders
 */
const base = { shading: 'flat', build: { height: 1, shoulders: 1 } } as const

export const MEERA: CharacterConfig = {
  ...base,
  name: 'Meera',
  gender: 'female',
  art: 'line',
  skinTone: 'wheatish',
  hair: { style: 'ponytail', color: 'darkBrown' },
  face: { jaw: 'oval', brows: 'thin', eyes: 'dot', mouth: 'line' },
  outfit: { top: 'blouse', topColor: '#12B5A8', bottom: 'jeans', bottomColor: '#1B2238' },
  accessories: { earrings: true },
}

export const RAVI: CharacterConfig = {
  ...base,
  name: 'Ravi',
  gender: 'male',
  art: 'soft',
  skinTone: 'medium',
  hair: { style: 'short', color: 'black' },
  face: { jaw: 'square', brows: 'medium', eyes: 'oval', mouth: 'full' },
  outfit: { top: 'polo', topColor: '#2D63FB', bottom: 'trousers', bottomColor: '#1B2238' },
  accessories: { glasses: 'rect', watch: true },
}

export const ARJUN: CharacterConfig = PRESETS.arjun

export const ANITA: CharacterConfig = {
  ...base,
  name: 'Anita',
  gender: 'female',
  art: 'line',
  skinTone: 'medium',
  hair: { style: 'bun', color: 'black' },
  face: { jaw: 'round', brows: 'medium', eyes: 'dot', mouth: 'line' },
  outfit: { top: 'kurta', topColor: '#FF8A3D', bottom: 'salwar', bottomColor: '#FFF2E8' },
  accessories: { glasses: 'round', bindi: true },
}

export const OPERATOR: CharacterConfig = {
  ...base,
  name: 'Operator',
  gender: 'male',
  art: 'soft',
  skinTone: 'fair',
  hair: { style: 'sidePart', color: 'grey' },
  face: { jaw: 'oval', brows: 'thick', eyes: 'oval', mouth: 'full' },
  outfit: { top: 'shirtTie', topColor: '#E8F0FF', bottom: 'trousers', bottomColor: '#1B2238' },
  accessories: { glasses: 'round', beard: 'short' },
}

const KIRAN: CharacterConfig = {
  ...base,
  name: 'Kiran',
  gender: 'male',
  art: 'soft',
  skinTone: 'dusky',
  hair: { style: 'curly', color: 'black' },
  face: { jaw: 'round', brows: 'medium', eyes: 'oval', mouth: 'full' },
  outfit: { top: 'tshirt', topColor: '#FF8A3D', bottom: 'jeans', bottomColor: '#1B2238' },
  accessories: {},
}

const SNEHA: CharacterConfig = {
  ...base,
  name: 'Sneha',
  gender: 'female',
  art: 'line',
  skinTone: 'fair',
  hair: { style: 'bob', color: 'brown' },
  face: { jaw: 'oval', brows: 'thin', eyes: 'dot', mouth: 'line' },
  outfit: { top: 'blouse', topColor: '#0146C7', bottom: 'skirt', bottomColor: '#171A3B' },
  accessories: {},
}

const FARHAN: CharacterConfig = {
  ...base,
  name: 'Farhan',
  gender: 'male',
  art: 'soft',
  skinTone: 'wheatish',
  hair: { style: 'quiff', color: 'darkBrown' },
  face: { jaw: 'square', brows: 'thick', eyes: 'oval', mouth: 'full' },
  outfit: { top: 'hoodie', topColor: '#16A34A', bottom: 'jeans', bottomColor: '#1B2238' },
  accessories: {},
}

const DIVYA: CharacterConfig = {
  ...base,
  name: 'Divya',
  gender: 'female',
  art: 'line',
  skinTone: 'deep',
  hair: { style: 'braid', color: 'black' },
  face: { jaw: 'round', brows: 'medium', eyes: 'dot', mouth: 'line' },
  outfit: { top: 'kurta', topColor: '#B24A7A', bottom: 'salwar', bottomColor: '#F4F7FA' },
  accessories: { earrings: true },
}

/** Four faces, in a fixed order: tenants A, B, C and a fourth reader or sender. */
export const TENANTS: CharacterConfig[] = [KIRAN, SNEHA, FARHAN, DIVYA]
