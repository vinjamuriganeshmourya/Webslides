/* A character is a config; the Skin the renderer draws is BUILT from it and
 * never written by hand. That is what keeps Arjun and Riya on one rig: the
 * same config shape produces either of them, or a third person, and every
 * action works unchanged because the rig underneath does not know who it is.
 *
 * This file owns the config type, the two presets, the colour derivations
 * (skin tone, hair) and buildSkin. The drawings live in hair.tsx (sibling)
 * and outfits.tsx. */
import type { Palette, Skin } from './types'
import { hairBack, hairFront } from '@/skins/hair'
import { faceExtras, fitToShoulders, legs, neckExtras, top } from './outfits'

export type SkinTone = 'fair' | 'wheatish' | 'medium' | 'dusky' | 'deep' | `#${string}`
export type HairColor = 'black' | 'darkBrown' | 'brown' | 'auburn' | 'grey' | `#${string}`
export type HairStyle =
  | 'short' | 'sidePart' | 'quiff' | 'curly' | 'buzz' // read as male by default
  | 'braid' | 'ponytail' | 'bob' | 'long' | 'bun' | 'wavy' // read as female by default
export type TopStyle = 'shirt' | 'tshirt' | 'kurta' | 'hoodie' | 'blouse' | 'polo'
export type BottomStyle = 'trousers' | 'jeans' | 'skirt' | 'salwar' | 'shorts'

export type CharacterConfig = {
  name: string
  gender: 'male' | 'female' // base proportions: shoulder width, neck, jaw default
  skinTone: SkinTone
  hair: { style: HairStyle; color: HairColor }
  face: { jaw: 'round' | 'oval' | 'square'; brows: 'thin' | 'medium' | 'thick'; lip?: `#${string}`; blush?: number }
  outfit: { top: TopStyle; topColor: `#${string}`; bottom: BottomStyle; bottomColor: `#${string}`; shoeColor?: `#${string}` }
  accessories: {
    glasses?: 'none' | 'round' | 'rect'
    earrings?: boolean
    bindi?: boolean
    beard?: 'none' | 'stubble' | 'short'
    watch?: boolean
    flower?: boolean
    necklace?: boolean
  }
  build: { height: number; shoulders: number } // multipliers, 0.9..1.1
}

export const PRESETS: Record<'arjun' | 'riya', CharacterConfig> = {
  arjun: {
    name: 'Arjun',
    gender: 'male',
    skinTone: 'medium',
    hair: { style: 'sidePart', color: 'black' },
    face: { jaw: 'square', brows: 'medium' },
    outfit: { top: 'shirt', topColor: '#3B82F6', bottom: 'trousers', bottomColor: '#D6C4A8', shoeColor: '#4A3326' },
    accessories: { beard: 'stubble', watch: true },
    build: { height: 1, shoulders: 1 },
  },
  riya: {
    name: 'Riya',
    gender: 'female',
    skinTone: 'wheatish',
    hair: { style: 'braid', color: 'darkBrown' },
    face: { jaw: 'oval', brows: 'medium' },
    outfit: { top: 'kurta', topColor: '#3FB5E5', bottom: 'salwar', bottomColor: '#F4F7FA', shoeColor: '#8A5A3C' },
    accessories: { flower: true, earrings: true, bindi: true },
    build: { height: 1, shoulders: 1 },
  },
}

/* ---------- colour maths, HSL so a shade keeps its hue ---------- */

type Hsl = [number, number, number] // h 0..360, s 0..1, l 0..1

function hexToHsl(hex: string): Hsl {
  const n = parseInt(hex.slice(1), 16)
  const r = ((n >> 16) & 255) / 255
  const g = ((n >> 8) & 255) / 255
  const b = (n & 255) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  const h =
    max === r ? ((g - b) / d + (g < b ? 6 : 0)) * 60 : max === g ? ((b - r) / d + 2) * 60 : ((r - g) / d + 4) * 60
  return [h, s, l]
}

function hslToHex([h, s, l]: Hsl): string {
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const c = l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1))
    return Math.round(c * 255)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** Move a colour along lightness (and a little along saturation) without
    touching its hue. A shadow on blue cloth is a deeper blue, not a grey. */
function shift(hex: string, dl: number, ds = 0): string {
  const [h, s, l] = hexToHsl(hex)
  return hslToHex([h, clamp01(s + ds), clamp01(l + dl)])
}

/* ---------- skin and hair ---------- */

type Tone = ReturnType<typeof resolveTone>

/* Five Indian skin tones. Wheatish is Riya's, read straight from the for-loop
   deck so she stays the same person. The others sit on the same ramp: the
   shade is the colour where the form turns away, the light where it faces
   the lamp, blush is the cheek warmed, lip the natural lip. */
const TONES: Record<Exclude<SkinTone, `#${string}`>, Tone> = {
  fair: { skin: '#F6D5B8', skinShade: '#D9AE8A', skinLight: '#FFE9D6', blush: '#F4A6A6', lip: '#A4493E' },
  wheatish: { skin: '#F0C29B', skinShade: '#D09A6E', skinLight: '#FFDCBC', blush: '#F29B9B', lip: '#8A3B2E' },
  medium: { skin: '#D9A072', skinShade: '#B57A4D', skinLight: '#EFBF95', blush: '#D98C7A', lip: '#7E3528' },
  dusky: { skin: '#B87A4F', skinShade: '#91582F', skinLight: '#D4996E', blush: '#C27C6A', lip: '#6A2C22' },
  deep: { skin: '#8D5633', skinShade: '#68391C', skinLight: '#A96F4C', blush: '#A3634F', lip: '#4F2219' },
}

export function resolveTone(t: SkinTone): { skin: string; skinShade: string; skinLight: string; blush: string; lip: string } {
  if (!t.startsWith('#')) return TONES[t as keyof typeof TONES]
  /* A custom hex: the shade is darker and a touch more saturated (shadow on
     skin goes warm, not grey), the light is paler. Blush and lip are the
     skin's lightness pulled toward red so they belong to the same face. */
  const [, , l] = hexToHsl(t)
  return {
    skin: t,
    skinShade: shift(t, -0.13, 0.05),
    skinLight: shift(t, 0.1),
    blush: hslToHex([5, 0.55, Math.min(0.76, Math.max(0.5, l + 0.08))]),
    lip: hslToHex([8, 0.52, Math.min(0.42, Math.max(0.2, l * 0.5))]),
  }
}

const HAIRS: Record<Exclude<HairColor, `#${string}`>, ReturnType<typeof resolveHair>> = {
  black: { hair: '#1C1A1C', hairShade: '#0E0C0E', hairLight: '#3F3A42' },
  darkBrown: { hair: '#2E1E1A', hairShade: '#1A100D', hairLight: '#4A3A33' },
  brown: { hair: '#5A3A26', hairShade: '#3A2316', hairLight: '#7E5A42' },
  auburn: { hair: '#7A3B22', hairShade: '#4E2314', hairLight: '#A65A3A' },
  grey: { hair: '#9A9A9C', hairShade: '#6E6E72', hairLight: '#C9C9CC' },
}

export function resolveHair(c: HairColor): { hair: string; hairShade: string; hairLight: string } {
  if (!c.startsWith('#')) return HAIRS[c as keyof typeof HAIRS]
  return { hair: c, hairShade: shift(c, -0.1), hairLight: shift(c, 0.12) }
}

/* ---------- the skin ---------- */

/* Long sleeves cover the forearm in cloth; short leave it skin. A kurta here
   is the short-sleeved summer cut. */
const SLEEVE: Record<TopStyle, 'long' | 'short'> = {
  shirt: 'long',
  hoodie: 'long',
  polo: 'long',
  tshirt: 'short',
  kurta: 'short',
  blouse: 'short',
}

/* Head outlines, head-local, origin at the skull centre: crown y=-66, sides
   x=+-60 level with the ears, chin y=66. The top half is shared; the jaw is
   what differs, and the jaw is most of what makes a face recognisable at
   120 px. */
const CROWN = 'M0 -66 C34 -66 60 -40 60 -6'
const CROWN_BACK = 'C-60 -40 -34 -66 0 -66 Z'
const HEADS = {
  /* full cheeks, the chin a continuation of the curve */
  round: `${CROWN} C60 32 38 66 0 66 C-38 66 -60 32 -60 -6 ${CROWN_BACK}`,
  /* cheekbone, then a taper into a narrower chin */
  oval: `${CROWN} C60 22 44 54 14 65 Q0 68 -14 65 C-44 54 -60 22 -60 -6 ${CROWN_BACK}`,
  /* the same taper on a skull three px narrower each side: the female default */
  ovalNarrow: `M0 -66 C32 -66 57 -40 57 -6 C57 22 42 54 13 65 Q0 68 -13 65 C-42 54 -57 22 -57 -6 C-57 -40 -32 -66 0 -66 Z`,
  /* the jaw runs down almost vertical and turns a corner before the chin */
  square: `${CROWN} C60 18 60 44 48 57 C36 65 18 66 0 66 C-18 66 -36 65 -48 57 C-60 44 -60 18 -60 -6 ${CROWN_BACK}`,
}

/* Male shoulders are wider than female at the same height: the one
   proportion that reads as gender from across a room. */
const SHOULDER_HALF = { male: 68, female: 60 }

/* The renderer's Skin.id is the two presets; a custom config borrows the id
   of the preset it is nearest to by gender, which is all the renderer uses
   it for. */
function skinId(c: CharacterConfig): Skin['id'] {
  const n = c.name.toLowerCase()
  if (n === 'arjun' || n === 'riya') return n
  return c.gender === 'female' ? 'riya' : 'arjun'
}

function paletteFor(c: CharacterConfig): Palette {
  const tone = resolveTone(c.skinTone)
  const hair = resolveHair(c.hair.color)
  const lip = c.face.lip ?? tone.lip
  const topColor = c.outfit.topColor
  return {
    ...tone,
    ...hair,
    lip,
    /* the inside of an open mouth is the lip colour in shadow */
    mouth: shift(lip, -0.14),
    /* almost every Indian iris is a dark brown; it stays the same across
       tones so the eyes do not drift colour when the skin does */
    iris: '#3B2416',
    brow: hair.hair,
    top: topColor,
    topShade: shift(topColor, -0.16, 0.06),
    topLight: shift(topColor, 0.14),
    /* the sleeve is the top in a slightly deeper tint, so an arm hanging in
       front of the torso separates from it without an outline */
    sleeve: shift(topColor, -0.05),
    bottom: c.outfit.bottomColor,
    bottomShade: shift(c.outfit.bottomColor, -0.14, 0.04),
    shoe: c.outfit.shoeColor ?? '#2B2521',
  }
}

export function buildSkin(config: CharacterConfig): Skin {
  const palette = paletteFor(config)
  const female = config.gender === 'female'
  const shoulderHalf = SHOULDER_HALF[config.gender] * config.build.shoulders
  const jaw = config.face.jaw === 'oval' && female ? 'ovalNarrow' : config.face.jaw
  return {
    id: skinId(config),
    label: config.name,
    palette,
    head: HEADS[jaw],
    sleeve: SLEEVE[config.outfit.top],
    shoulderHalf,
    headScale: { x: female ? 0.96 : 1, y: 1 },
    buildScale: config.build.height,
    watch: Boolean(config.accessories.watch),
    hairBack: hairBack(config.hair.style, palette) ?? undefined,
    hairFront: hairFront(config.hair.style, palette) ?? undefined,
    faceExtras: faceExtras(config, palette) ?? undefined,
    /* tops are drawn at the male shoulder width and squeezed to this body */
    top: fitToShoulders(top(config.outfit.top, palette), shoulderHalf),
    legs: legs(config.outfit.bottom, palette),
    neckExtras: neckExtras(config, palette) ?? undefined,
  }
}
