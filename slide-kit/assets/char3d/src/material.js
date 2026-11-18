// The surface material: three.js' physically based material, extended in four places.
//
//  1. Texture sets (albedo, normal, roughness, occlusion: textures.js) are laid on by triplanar
//     projection in the BIND pose, along the cloth's grain, so the weave stays glued to the cloth
//     when the character moves and no UV seam is needed on a mesh that has none.
//  2. Detail the mesh is too coarse to carry is drawn per pixel from data stored on the vertices:
//     ribbing on cuffs and hem, seams with their grooves, rows of stitching, the line round the sole.
//  3. Occlusion baked from the shapes (inside the hood, under the arm, between fingers) darkens the
//     ambient light towards a deeper tone of the SAME hue, the way cloth shades itself, never grey.
//  4. The face and the hair are cartoon surfaces: an even colour in two soft tones (lit and shade), no
//     weave, pores, gloss or strand texture; the hair adds one gentle band of light.
import * as THREE from '../vendor/three/three.module.js';
import { textureSet } from './textures.js';

const VERT_PARS = /* glsl */`
attribute vec3 aAxis; attribute vec4 aRib; attribute vec4 aFx;
varying vec3 vTexPos; varying vec3 vTexNrm; varying mat3 vTexToView; varying vec4 vRib; varying vec4 vFx;
`;
// The other characters only (cast.js). Each piece below is added to a shader only when its material asks
// for it, so the first character's shaders are, character for character, the ones he was approved with.
//  colour blocks: a second colour per vertex and the signed distance to the edge between the two, so the
//                 edge is drawn per pixel, straight and crisp, whatever the mesh's size
//  bounce:        dark cloth lit by its own bounce, so its deepest shade keeps its hue and never sinks to grey
const VERT_BLOCKS = /* glsl */`
attribute vec3 aCol2; attribute float aBlk; varying vec3 vCol2; varying float vBlk;
`;
const VERT_BLOCKS_MAIN = /* glsl */`
  vCol2 = aCol2; vBlk = aBlk;
`;
const FRAG_BLOCKS_PARS = /* glsl */`
varying vec3 vCol2; varying float vBlk;
`;
const FRAG_BLOCKS = /* glsl */`
  { float w = fwidth( vBlk ) * 0.75 + 1e-4; diffuseColor.rgb = mix( vCol2, diffuseColor.rgb, smoothstep( - w, w, vBlk ) ); }
`;
const FRAG_BOUNCE_PARS = /* glsl */`
uniform float uBounce;
`;
const FRAG_BOUNCE = /* glsl */`
  #ifndef FAB_TOON
  { float lumA = dot( diffuseColor.rgb, vec3( 0.2126, 0.7152, 0.0722 ) );        // dark cloth only: a light colour never sinks that far
    reflectedLight.indirectDiffuse = max( reflectedLight.indirectDiffuse, diffuseColor.rgb * uBounce * ( 1.0 - smoothstep( 0.06, 0.35, lumA ) ) ); }
  #endif
`;
const VERT_MAIN = /* glsl */`
#ifdef USE_SKINNING
  mat3 cdSkin = mat3( skinMatrix );
#else
  mat3 cdSkin = mat3( 1.0 );
#endif
#ifdef FAB_HAIR
  mat3 cdR = mat3( 1.0 );                                  // hair: no grain to follow
#else
  vec3 cdY = normalize( aAxis );
  vec3 cdX = normalize( cross( cdY, vec3( 0.0, 0.0, 1.0 ) ) );
  mat3 cdR = mat3( cdX, cdY, cross( cdX, cdY ) );          // the cloth's own frame: y runs along the grain
#endif
  vTexPos = position * cdR;
  vTexNrm = cdBindNormal * cdR;
  vTexToView = normalMatrix * cdSkin * cdR;
  vRib = aRib; vFx = aFx;
`;
const FRAG_PARS = /* glsl */`
uniform sampler2D tAlbedo; uniform sampler2D tNormal; uniform sampler2D tOrm;
uniform float uTile; uniform float uNormalK; uniform float uGain; uniform float uSlow; uniform float uRibDepth; uniform float uSeamK; uniform float uThread;
uniform vec3 uAoTint; uniform vec3 uAmbTint; uniform vec3 uStitch; uniform vec3 uHairHi; uniform vec3 uStripe; uniform vec3 uHairBand;
uniform vec4 uToon; uniform vec3 uToonLit; uniform vec3 uToonShade; uniform vec3 uToonHi; uniform vec2 uToonHiAt;
varying vec3 vTexPos; varying vec3 vTexNrm; varying mat3 vTexToView; varying vec4 vRib; varying vec4 vFx;
// tilt a normal by a height given in centimetres (derivatives taken on screen)
vec3 cdBump( vec3 n, vec3 p, float h ) {
  vec3 dpx = dFdx( p ), dpy = dFdy( p );
  float hx = dFdx( h ), hy = dFdy( h );
  vec3 r1 = cross( dpy, n ), r2 = cross( n, dpx );
  float det = dot( dpx, r1 );
  return normalize( abs( det ) * n - sign( det ) * ( hx * r1 + hy * r2 ) );
}
`;
// colour: the texture set, then ribs, seams and stitches
const FRAG_COLOR = /* glsl */`
  vec3 cdN = normalize( vTexNrm );
  vec3 cdW = pow( abs( cdN ), vec3( 6.0 ) ); cdW /= ( cdW.x + cdW.y + cdW.z );
  vec2 cdUx = vTexPos.zy * uTile, cdUy = vTexPos.xz * uTile, cdUz = vTexPos.xy * uTile;
  vec3 cdAlb = texture2D( tAlbedo, cdUx ).rgb * cdW.x + texture2D( tAlbedo, cdUy ).rgb * cdW.y + texture2D( tAlbedo, cdUz ).rgb * cdW.z;
  vec4 cdOrm = texture2D( tOrm, cdUx ) * cdW.x + texture2D( tOrm, cdUy ) * cdW.y + texture2D( tOrm, cdUz ) * cdW.z;
  float cdSlow = texture2D( tOrm, cdUx * 0.083 ).b * cdW.x + texture2D( tOrm, cdUy * 0.083 ).b * cdW.y + texture2D( tOrm, cdUz * 0.083 ).b * cdW.z;
  #ifdef FAB_TOON
    cdAlb = vec3( 1.0 ); cdOrm = vec4( 1.0, 0.5, 0.5, 0.5 ); cdSlow = 0.5;      // a cartoon surface: one even colour, nothing woven or porous
  #endif
  float cdAo = clamp( vFx.y, 0.0, 1.0 );
  float cdH = 0.0, cdFlat = 0.0, cdRoughK = 1.0;
  #ifdef FAB_SHOE
    float cdRubber = smoothstep( 0.3, 0.55, vColor.g );                       // white rubber and laces: no weave, smoother
    cdAlb = mix( cdAlb, vec3( 1.0 ), cdRubber ); cdFlat = cdRubber; cdRoughK = mix( 1.0, 0.5, cdRubber );
  #endif
  #ifdef FAB_RIBS
    vec2 cdQ = vRib.xy;
    float cdRate = vRib.z * length( vec2( cdQ.x * dFdx( cdQ.y ) - cdQ.y * dFdx( cdQ.x ), cdQ.x * dFdy( cdQ.y ) - cdQ.y * dFdy( cdQ.x ) ) ) / max( dot( cdQ, cdQ ), 1e-5 );
    float cdRibM = clamp( vRib.w, 0.0, 1.0 ) * ( 1.0 - smoothstep( 0.9, 2.4, cdRate ) );      // fades out before the ribs get thinner than pixels
    float cdRib = pow( 0.5 + 0.5 * cos( atan( cdQ.y, cdQ.x ) * floor( vRib.z + 0.5 ) ), 0.7 );
    cdH += uRibDepth * cdRibM * cdRib;
    cdAlb *= mix( 1.0, 0.78 + 0.22 * cdRib, cdRibM );
    cdAo *= mix( 1.0, 0.72 + 0.28 * cdRib, cdRibM );
  #endif
  diffuseColor.rgb *= cdAlb * uGain * ( 1.0 + uSlow * ( cdSlow - 0.5 ) );
  #ifdef FAB_SEAMS
    float cdSd = vFx.x, cdSw = fwidth( cdSd ) + 1e-4, cdKind = vFx.z;
    float cdDash = mix( 1.0, smoothstep( 0.2, 0.3, fract( ( vTexPos.x + vTexPos.y * 1.37 + vTexPos.z * 0.61 ) * 3.1 ) ), clamp( 0.05 / cdSw, 0.0, 1.0 ) );
    float cdLine = clamp( 1.5 * uThread / cdSw, 0.0, 1.0 );
    if ( cdKind < 0.5 ) {                                                    // a joined seam: a groove, a ridge beside it, one row of stitching
      float g = exp( - cdSd * cdSd / 0.025 ) * clamp( 0.2 / cdSw, 0.0, 1.0 );
      float st = ( 1.0 - smoothstep( uThread, uThread + cdSw, abs( cdSd - 0.38 ) ) ) * cdDash * cdLine * clamp( vFx.w, 0.0, 1.0 );
      cdH += uSeamK * ( - 0.045 * g + 0.02 * exp( - ( cdSd - 0.2 ) * ( cdSd - 0.2 ) / 0.02 ) + 0.012 * st );
      diffuseColor.rgb = mix( diffuseColor.rgb * ( 1.0 - 0.16 * g * uSeamK ), uStitch, st * 0.8 * uSeamK );
      cdAo *= 1.0 - 0.3 * g * uSeamK;
    } else if ( cdKind < 1.5 ) {                                             // topstitching: two rows
      float st = max( 1.0 - smoothstep( uThread, uThread + cdSw, abs( cdSd ) ), 1.0 - smoothstep( uThread, uThread + cdSw, abs( cdSd + 0.3 ) ) ) * cdDash * cdLine;
      cdH += uSeamK * ( 0.012 * st - 0.012 * exp( - ( cdSd + 0.15 ) * ( cdSd + 0.15 ) / 0.03 ) );
      diffuseColor.rgb = mix( diffuseColor.rgb, uStitch, st * 0.8 * uSeamK );
    } else if ( cdKind > 2.5 ) {                                             // the edge of a sewn-on patch (3) or of an opening in it (4): a step, a crease outside it, stitching inside
      float open = clamp( cdKind - 3.0, 0.0, 1.0 ), aa = clamp( 0.1 / cdSw, 0.0, 1.0 );
      float crease = exp( - ( cdSd - 0.05 ) * ( cdSd - 0.05 ) / mix( 0.006, 0.03, open ) ) * aa;
      float st = max( 1.0 - smoothstep( uThread, uThread + cdSw, abs( cdSd + 0.42 ) ), open * ( 1.0 - smoothstep( uThread, uThread + cdSw, abs( cdSd + 1.15 ) ) ) ) * cdDash * cdLine;
      cdH += uSeamK * ( 0.11 * ( 1.0 - smoothstep( - 0.14, 0.14, cdSd ) ) * aa + 0.012 * st - 0.03 * crease );
      diffuseColor.rgb = mix( diffuseColor.rgb * ( 1.0 - mix( 0.22, 0.42, open ) * crease ), uStitch, st * 0.75 );
      cdAo *= 1.0 - mix( 0.3, 0.55, open ) * crease;
    } else {                                                                 // a painted line
      #ifdef FAB_SHOE
      float ln = ( 1.0 - smoothstep( 0.1, 0.1 + cdSw, abs( cdSd ) ) ) * cdRubber;
      diffuseColor.rgb = mix( diffuseColor.rgb, uStripe, ln );
      #endif
    }
  #endif
  #ifdef FAB_HAIR
    float cdBand = exp( - pow( ( vRib.y - uHairBand.x ) / uHairBand.y, 2.0 ) );          // the band of light, set at a distance from the crown
  #endif
`;
const FRAG_ROUGH = /* glsl */`
  float roughnessFactor = clamp( roughness * ( 0.55 + 0.9 * cdOrm.g ) * cdRoughK, 0.05, 1.0 );
`;
const FRAG_NORMAL = /* glsl */`
  {
    vec3 tx = texture2D( tNormal, cdUx ).xyz * 2.0 - 1.0, ty = texture2D( tNormal, cdUy ).xyz * 2.0 - 1.0, tz = texture2D( tNormal, cdUz ).xyz * 2.0 - 1.0;
    float k = uNormalK * ( 1.0 - cdFlat );
    tx.xy *= k; ty.xy *= k; tz.xy *= k;
    tx = vec3( tx.xy + cdN.zy, abs( tx.z ) * cdN.x ); ty = vec3( ty.xy + cdN.xz, abs( ty.z ) * cdN.y ); tz = vec3( tz.xy + cdN.xy, abs( tz.z ) * cdN.z );
    normal = normalize( vTexToView * normalize( tx.zyx * cdW.x + ty.xzy * cdW.y + tz.xyz * cdW.z ) );
    normal = cdBump( normal, - vViewPosition, cdH );
  }
`;
const FRAG_LIGHT = /* glsl */`
  #ifdef FAB_TOON
  {
    // how much light arrives here, shadows included, before the surface colour: read back from the lighting just computed
    float e = dot( reflectedLight.directDiffuse, vec3( 0.3333 ) ) / max( dot( diffuseColor.rgb, vec3( 0.3333 ) ) * RECIPROCAL_PI, 1e-5 );
    float lit = smoothstep( uToon.x, uToon.y, e ) * smoothstep( uToon.z, uToon.w, cdAo );        // lit or shade, with a soft edge; baked shade (under the fringe, under the chin, between locks) counts too
    vec3 col = diffuseColor.rgb * mix( mix( uToonShade, uToonLit, lit ), uToonHi, lit * smoothstep( uToonHiAt.x, uToonHiAt.y, e ) );        // a third, brightest tone where the light is strongest
    #ifdef FAB_HAIR
      col = mix( col, uHairHi, cdBand * uHairBand.z * smoothstep( 0.5, 1.2, e ) );
    #endif
    reflectedLight.directDiffuse = col; reflectedLight.indirectDiffuse = vec3( 0.0 ); reflectedLight.directSpecular = vec3( 0.0 ); reflectedLight.indirectSpecular = vec3( 0.0 );
  }
  #else
  {
    float ao = cdAo * mix( 1.0, cdOrm.r, 0.85 * ( 1.0 - cdFlat ) );
    vec3 occ = mix( uAoTint, vec3( 1.0 ), ao );
    reflectedLight.indirectDiffuse *= occ * uAmbTint;
    reflectedLight.directDiffuse *= mix( vec3( 1.0 ), occ, 0.55 );
    reflectedLight.directSpecular *= ao; reflectedLight.indirectSpecular *= ao;
    #ifdef USE_SHEEN
      sheenSpecularDirect *= ao; sheenSpecularIndirect *= ao;
    #endif
  }
  #endif
`;

const hex = h => new THREE.Color(h);
/* what each kind of surface is: texture set, how many centimetres one tile covers is in the set */
export const SURFACES = {
  fleece: { set: 'fleece', rough: 0.9, normal: 0.9, gain: 1.07, slow: 0.07, sheen: 0.4, sheenRough: 0.7, ribs: true, seams: true },
  cord: { set: 'fleece', rough: 0.9, normal: 1.2, gain: 1.05, slow: 0, tile: 2.4 },
  denim: { set: 'denim', rough: 0.9, normal: 1.0, gain: 1.16, slow: 0.1, sheen: 0.4, sheenRough: 0.6, seams: true, thread: 0.07 },
  shoe: { set: 'canvas', rough: 0.88, normal: 1.0, gain: 1.1, slow: 0.05, seams: true, shoe: true },
  skin: { set: 'skin', rough: 0.66, normal: 0.6, gain: 1.02, slow: 0.02 },                         // the hands
  face: { set: 'skin', rough: 0.7, normal: 0, gain: 1, slow: 0, toon: true },                       // head and neck: cartoon skin
  hair: { set: 'smooth', rough: 0.7, normal: 0, gain: 1, slow: 0, hair: true, toon: true },
  steel: { set: 'smooth', rough: 0.3, normal: 0.4, gain: 1.03, slow: 0.04, metal: 1 },
  // the other characters' surfaces (cast.js)
  puffer: { set: 'nylon', rough: 0.6, normal: 0.6, gain: 1.04, slow: 0.05, sheen: 0.45, sheenRough: 0.45, ribs: true, seams: true },
  wool: { set: 'wool', rough: 0.92, normal: 0.8, gain: 1.05, slow: 0.08, sheen: 0.18, sheenRough: 0.7, ribs: true, seams: true },
  knit: { set: 'fleece', rough: 0.9, normal: 0.9, gain: 1.03, slow: 0.06, sheen: 0.35, sheenRough: 0.7, ribs: true, seams: true },
  twill: { set: 'twill', rough: 0.9, normal: 1.0, gain: 1.08, slow: 0.1, sheen: 0.3, sheenRough: 0.7, ribs: true, seams: true, thread: 0.05 },
  sneaker: { set: 'smooth', rough: 0.55, normal: 0.3, gain: 1.03, slow: 0.03, seams: true, shoe: true },
  strap: { set: 'smooth', rough: 0.45, normal: 0.3, gain: 1.0, slow: 0.02 },
};

export function surfaceMaterial(kind, o = {}) {
  const S = SURFACES[kind], T = textureSet(S.set);
  const mat = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: S.rough, metalness: S.metal || 0 });
  if (S.sheen) { mat.sheen = S.sheen; mat.sheenRoughness = S.sheenRough; mat.sheenColor = hex(o.sheenColor || '#ffffff'); }
  if (o.envMap) { mat.envMap = o.envMap; mat.envMapIntensity = o.envIntensity ?? 1; }
  mat.defines = { ...mat.defines };
  if (S.ribs) mat.defines.FAB_RIBS = ''; if (S.seams) mat.defines.FAB_SEAMS = ''; if (S.hair) mat.defines.FAB_HAIR = ''; if (S.shoe) mat.defines.FAB_SHOE = ''; if (S.toon) mat.defines.FAB_TOON = '';
  const T2 = o.toon || { ramp: [0.45, 1, 0.4, 0.75], lit: [1, 1, 1], shade: [0.9, 0.8, 0.75], band: [6.6, 1.5, 0] };
  const U = mat.userData.uniforms = {
    tAlbedo: { value: T.albedo }, tNormal: { value: T.normal }, tOrm: { value: T.orm },
    uTile: { value: 1 / (S.tile || T.cm) }, uNormalK: { value: S.normal }, uGain: { value: S.gain }, uSlow: { value: S.slow }, uRibDepth: { value: 0.085 }, uSeamK: { value: 1 }, uThread: { value: S.thread || 0.03 },
    uAoTint: { value: new THREE.Vector3(...(o.aoTint || [0.6, 0.6, 0.6])) }, uAmbTint: { value: new THREE.Vector3(...(o.ambTint || [1, 1, 1])) },
    uStitch: { value: hex(o.stitch || '#888888') }, uHairHi: { value: hex(o.hairHi || '#8C97CC') }, uStripe: { value: hex(o.stripe || '#39405F') }, uHairBand: { value: new THREE.Vector3(...(T2.band || [6.6, 1.5, 0])) },      // the soft band of light: centimetres from the crown, half width, strength
    uToon: { value: new THREE.Vector4(...T2.ramp) }, uToonLit: { value: new THREE.Vector3(...T2.lit) }, uToonShade: { value: new THREE.Vector3(...T2.shade) }, uToonHi: { value: new THREE.Vector3(...(T2.hi || T2.lit)) }, uToonHiAt: { value: new THREE.Vector2(...(T2.hiAt || [1e6, 2e6])) },   // light level where shade turns to lit (from, to), baked shade likewise; the two tones as multipliers
  };
  if (o.bounce) U.uBounce = { value: o.bounce };
  mat.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\n' + VERT_PARS + (o.blocks ? VERT_BLOCKS : ''))
      .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\n  vec3 cdBindNormal = objectNormal;')
      .replace('#include <skinnormal_vertex>', '#include <skinnormal_vertex>\n' + VERT_MAIN + (o.blocks ? VERT_BLOCKS_MAIN : ''));
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\n' + FRAG_PARS + (o.blocks ? FRAG_BLOCKS_PARS : '') + (o.bounce ? FRAG_BOUNCE_PARS : ''))
      .replace('#include <color_fragment>', '#include <color_fragment>\n' + (o.blocks ? FRAG_BLOCKS : '') + FRAG_COLOR)
      .replace('#include <roughnessmap_fragment>', FRAG_ROUGH)
      .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n' + FRAG_NORMAL)
      .replace('#include <aomap_fragment>', FRAG_LIGHT + (o.bounce ? FRAG_BOUNCE : ''));
  };
  mat.customProgramCacheKey = () => 'cd-' + kind + (o.blocks ? '-b' : '') + (o.bounce ? '-r' : '');
  return mat;
}
