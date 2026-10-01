/* One lamp for every character, upper left and in front, carried over from
 * python/14_for_loop/src/decks/figures/lighting.tsx where Riya, the bank and
 * the coins first shared it.
 *
 * WHY FILTERS AND NOT ONLY GRADIENTS. A gradient is a colour ramp; it says
 * nothing about the surface. `feSpecularLighting` runs a real lighting model
 * over the blurred alpha of the form, so the highlight follows the form's own
 * silhouette: a turned head and a lifted chest each catch the light on their
 * own curve, not along a straight line painted across them. Two numbers set
 * the material: `surfaceScale` is how far the surface rises, `specularExponent`
 * is how tight the highlight is (high is glazed, low is matte).
 *
 * The lamp sits at the same place for everything so two actors on one slide
 * read as one scene. The coordinates are in the user space of the element the
 * filter is applied to, so on the head group the lamp is upper left of the
 * head, on the torso it is upper left of the torso. */

/** Upper left, in front. */
export const LAMP = { x: -60, y: -90, z: 180 }

/**
 * Matte skin and cloth: the surface turns, but the highlight is broad and low,
 * so nothing gleams. `blur` sets how wide the shaded rim is; a skull of
 * radius 60 wants the default, a torso twice as wide wants about 12. `light`
 * restates the lamp when the filtered element lives in a translated space
 * (the head group), so that it is still the same lamp and not one parked next
 * to the forehead.
 */
export function SoftLight({ id, blur = 7, light = LAMP }: { id: string; blur?: number; light?: { x: number; y: number; z: number } }) {
  return (
    <filter id={id} x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur in="SourceAlpha" stdDeviation={blur} result="blur" />
      <feSpecularLighting
        in="blur"
        surfaceScale="3"
        specularConstant="0.42"
        specularExponent="7"
        lightingColor="#FFF6EC"
        result="spec"
      >
        <fePointLight x={light.x} y={light.y} z={light.z} />
      </feSpecularLighting>
      <feComposite in="spec" in2="SourceAlpha" operator="in" result="specClip" />
      <feComposite in="SourceGraphic" in2="specClip" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
    </filter>
  )
}

/**
 * A form dropping a shadow onto the form behind it: the fringe onto the
 * forehead, an arm onto the torso. This is what separates layers, and no
 * gradient substitutes for it. Apply it OUTSIDE any rotate or mirror so the
 * shadow keeps falling down and to the right whatever the limb is doing.
 */
export function CastShadow({ id, dy = 3, blur = 3, opacity = 0.35 }: { id: string; dy?: number; blur?: number; opacity?: number }) {
  return (
    <filter id={id} x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="1.5" dy={dy} stdDeviation={blur} floodColor="#3A1B0B" floodOpacity={opacity} />
    </filter>
  )
}
