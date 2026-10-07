/**
 * THE STYLE GUIDE'S SECTION 9 RECIPE, AS ONE FUNCTION.
 *
 * `slide-kit/workflow/STYLE_GUIDE.md` §9 says every panel, tile and boundary in
 * a figure carries the same light source, top-left, and spells out four parts
 * that always compose in the same order:
 *
 *   1. a soft white radial parked at the top-left corner, which is what makes a
 *      surface read as LIT rather than as a two-tone fill,
 *   2. a 135deg ramp that has to TRAVEL far enough to see from ten metres,
 *   3. a drop shadow tinted with the surface's OWN colour, never black,
 *   4. two hairlines: white along the top edge, the accent along the bottom.
 *
 * WHY THIS FILE EXISTS. The recipe was written out four times in this session's
 * figures, twice fully and twice with a part missing, which is exactly how
 * `LayerStack`'s first pass shipped looking flat: dropping one part is what
 * makes a surface look *almost* right. A figure now asks for a surface by name
 * and cannot get three of the four.
 *
 * SESSION-OWNED, FOR NOW. It sits in this session rather than in the kit because
 * the kit is shared with signed-off decks and a change there is a PR that
 * `sync-kit.mjs --apply` pushes into every session. It is written to be promoted
 * unchanged: no session 6 content, no Docker, nothing but tokens.
 *
 * NOT FOR: an `<svg>` figure. `src/ui/svgDepth.tsx` is the SVG half of the same
 * recipe, with fixed gradient ids because the single-file build inlines
 * everything. This half is for real DOM elements, which is what content rule 17
 * requires of any figure that is mostly labels.
 */
import { colors } from '@/design/tokens'

/**
 * How loud the lighting is.
 *
 * `solid` carries white text on a saturated fill and takes the full ramp.
 * `tint` carries DARK text on a pale wash of the same hue: it gets a gentler
 * ramp, because §9's own note is that a tint ramped as hard as a solid reads as
 * stained rather than as lit.
 * `recessed` is a surface cut INTO the slide rather than sitting on it, so its
 * hairlines invert and it takes no drop shadow.
 * `quiet` keeps every part but drops the shadow, which is §9's "flatter means
 * less light, never no light" — the state that should recede, not vanish.
 */
export type Lit = 'solid' | 'tint' | 'recessed' | 'quiet'

/** Two hex digits of alpha, so a tint is always written as the token plus alpha. */
const a = (hex: string, alpha: string) => `${hex}${alpha}`

/**
 * A lit surface in one accent colour.
 *
 * @param accent the surface's own hue, from `tokens.ts`. Both the ramp and the
 *   shadow are derived from it, which is what lets three differently-coloured
 *   tiles tell each other apart at the back of a room.
 * @param kind   how loud, see `Lit`.
 *
 * Returns `background` and `boxShadow` only. Radius, padding, border and text
 * colour stay with the caller, because those are the figure's decisions and this
 * is only the lighting.
 */
export function lit(accent: string, kind: Lit = 'tint') {
  if (kind === 'solid') {
    return {
      background: [
        'radial-gradient(120% 100% at 14% 0%, #FFFFFF66 0%, #FFFFFF00 62%)',
        /* Starts ABOVE the accent and lands below it, so the box travels a real
           distance corner to corner. §9: a ramp that moves too few pixels still
           reads as a flat slab at 3x zoom. */
        `linear-gradient(135deg, ${a(accent, 'ff')} 0%, ${a(accent, 'e8')} 52%, ${colors.brandDeep} 100%)`,
      ].join(', '),
      boxShadow: [
        `0 10px 26px -14px ${a(accent, '8c')}`,
        'inset 0 1px 0 0 #FFFFFFb3',
        `inset 0 -1px 0 0 ${colors.brandDeep}59`,
      ].join(', '),
    }
  }

  if (kind === 'recessed') {
    return {
      background: `linear-gradient(180deg, ${colors.surface2} 0%, ${colors.surface} 100%)`,
      /* Dark hairline on the TOP edge and white on the bottom is the inversion
         that reads as "cut into" rather than "sitting on". `SwapRows` in the kit
         draws its familiar side exactly this way. */
      boxShadow: [
        `inset 0 2px 5px -2px ${colors.brandDeep}1f`,
        'inset 0 -1px 0 0 #FFFFFF',
      ].join(', '),
    }
  }

  const ramp = [
    'radial-gradient(120% 100% at 14% 0%, #FFFFFFcc 0%, #FFFFFF00 64%)',
    `linear-gradient(135deg, #FFFFFF 0%, ${a(accent, '14')} 58%, ${a(accent, '24')} 100%)`,
  ].join(', ')
  const hairlines = [
    'inset 0 1px 0 0 #FFFFFFe6',
    `inset 0 -1px 0 0 ${a(accent, '3d')}`,
  ]
  return {
    background: ramp,
    boxShadow: (kind === 'quiet'
      ? hairlines
      : [`0 3px 10px -4px ${a(accent, '59')}`, `0 14px 30px -22px ${a(accent, '73')}`, ...hairlines]
    ).join(', '),
  }
}
