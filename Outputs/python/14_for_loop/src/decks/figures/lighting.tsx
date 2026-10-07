/* Shared SVG lighting, so every figure in this deck is lit by the same lamp.
 *
 * WHY FILTERS AND NOT MORE GRADIENTS. A gradient describes a colour ramp; it
 * does not describe a surface. Two objects with the same gradient read as the
 * same material however different they are, which is why the first 3D pass
 * still looked flat: the ceramic bank, the cotton kurta and the metal coin all
 * had one soft ramp and therefore one substance.
 *
 * `feSpecularLighting` runs an actual lighting model over a blurred alpha
 * channel, so the highlight follows the form's own silhouette instead of a
 * straight line through it. Changing two numbers changes the MATERIAL:
 *
 *   surfaceScale      how far the surface appears to rise
 *   specularExponent  how tight the highlight is -- high is glazed and hard,
 *                     low is matte and diffuse
 *
 * THE LAMP IS AT THE SAME PLACE FOR EVERYTHING: upper left, in front. Riya, the
 * bank and the coins share a scene, and a scene with two light sources reads as
 * two pictures pasted together.
 */

/** Upper left, in front. Every figure on these frames uses this. */
export const LAMP = { x: -60, y: -90, z: 180 }

/**
 * Glazed ceramic: a tight, bright highlight that stays a small patch. The
 * piggy bank.
 */
export function CeramicLight({ id }: { id: string }) {
  return (
    <filter id={id} x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur" />
      <feSpecularLighting
        in="blur"
        surfaceScale="5"
        specularConstant="0.9"
        specularExponent="28"
        lightingColor="#FFFFFF"
        result="spec"
      >
        <fePointLight x={LAMP.x} y={LAMP.y} z={LAMP.z} />
      </feSpecularLighting>
      <feComposite in="spec" in2="SourceAlpha" operator="in" result="specClip" />
      <feComposite in="SourceGraphic" in2="specClip" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
    </filter>
  )
}

/**
 * Cloth and skin: the surface still turns, but the highlight is broad and low,
 * so it reads as matte. Riya.
 */
export function SoftLight({ id }: { id: string }) {
  return (
    <filter id={id} x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="7" result="blur" />
      <feSpecularLighting
        in="blur"
        surfaceScale="3"
        specularConstant="0.42"
        specularExponent="7"
        lightingColor="#FFF6EC"
        result="spec"
      >
        <fePointLight x={LAMP.x} y={LAMP.y} z={LAMP.z} />
      </feSpecularLighting>
      <feComposite in="spec" in2="SourceAlpha" operator="in" result="specClip" />
      <feComposite in="SourceGraphic" in2="specClip" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
    </filter>
  )
}

/**
 * A form dropping a shadow onto the form behind it -- the fringe onto the
 * forehead, an arm onto the torso, the snout onto the cheek. This is the thing
 * that separates layers, and no amount of gradient substitutes for it.
 */
export function CastShadow({ id, dy = 3, blur = 3, opacity = 0.35 }: { id: string; dy?: number; blur?: number; opacity?: number }) {
  return (
    <filter id={id} x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="1.5" dy={dy} stdDeviation={blur} floodColor="#3A1B0B" floodOpacity={opacity} />
    </filter>
  )
}
