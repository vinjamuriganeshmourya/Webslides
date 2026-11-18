// Turns the generated data into three.js objects: a bone hierarchy and one skinned mesh per material.
import * as THREE from '../vendor/three/three.module.js';
import { buildCharacterData, PALETTE } from './model.js';
import { surfaceMaterial } from './material.js';
import { faceFrame } from './face.js';
import { cast, castName } from './cast.js';
import { createEyes } from './eyes.js';

// how each surface shades itself: [colour at full occlusion, tint of the ambient light], both as multipliers
const SHADE = {
  fleece: { aoTint: [0.45, 0.24, 0.04], ambTint: [1, 0.78, 0.15], stitch: '#D98A22', sheenColor: '#FFD27A' },
  cord: { aoTint: [0.45, 0.24, 0.04], ambTint: [1, 0.78, 0.15] },
  denim: { aoTint: [0.34, 0.38, 0.52], ambTint: [0.8, 0.84, 0.95], stitch: '#141A30', sheenColor: '#8A9AD0' },
  shoe: { aoTint: [0.55, 0.42, 0.4], ambTint: [1, 1, 1], stitch: '#F6E9E0', stripe: PALETTE.stripe },
  skin: { aoTint: [0.88, 0.58, 0.47], ambTint: [1, 0.84, 0.74] },
  // cartoon surfaces: two soft tones as multipliers of the palette colour, and where one turns into the other
  // (the tones are the reference's, measured: face in the light #F7BC95, at its brightest #FDCDA9, in shade #D38C6C; hair in shade #20233F)
  face: { toon: { ramp: [0.05, 0.55, 0.25, 0.6], lit: [0.95, 0.82, 0.755], shade: [0.66, 0.43, 0.38], hi: [1, 1, 1], hiAt: [2.2, 3.2] } },
  hair: { toon: { ramp: [0.5, 1.15, 0.3, 0.8], lit: [1.62, 1.62, 1.62], shade: [0.74, 0.67, 0.52], band: [6.4, 1.7, 0.55] }, hairHi: PALETTE['hair-light'] },
  steel: { aoTint: [0.5, 0.5, 0.56], ambTint: [1, 1, 1] },
};

// the other characters' surfaces: their own cloth, and their skin and hair tones (cast.js)
function shadeFor(material) {
  if (castName() === 'mustard') return SHADE[material];
  const S = { ...CAST_SHADE, ...SHADE }, base = { ...(CAST_SHADE[material] || SHADE[material]) }, own = cast().shade || {};
  if (material === 'hair') return { ...base, toon: { ...base.toon, ...own.hair }, hairHi: PALETTE['hair-light'] };
  if (material === 'face') return { ...base, toon: { ...base.toon, ...own.face } };
  return S[material] && base;
}
const CAST_SHADE = {
  puffer: { aoTint: [0.4, 0.44, 0.82], ambTint: [0.9, 0.94, 1.16], stitch: '#1C1D3C', sheenColor: '#E8E4FF' },
  wool: { aoTint: [0.42, 0.12, 0.18], ambTint: [1, 0.8, 0.84], stitch: '#6A0A24', sheenColor: '#C83A58' },
  knit: { aoTint: [0.74, 0.66, 0.6], ambTint: [1, 0.97, 0.94], stitch: '#D8C6B4', sheenColor: '#FFF3E6' },
  twill: { aoTint: [0.4, 0.36, 0.24], ambTint: [0.95, 0.92, 0.8], stitch: '#4C4024', sheenColor: '#D8CC9A' },
  denim: { aoTint: [0.34, 0.4, 0.58], ambTint: [0.82, 0.86, 0.98], stitch: '#C7A46A', sheenColor: '#9AB0E0' },
  sneaker: { aoTint: [0.62, 0.55, 0.55], ambTint: [1, 0.98, 0.98], stitch: '#E8DCD4', stripe: '#B9AFAA' },
  strap: { aoTint: [0.5, 0.5, 0.56], ambTint: [1, 1, 1] },
  cord: { aoTint: [0.7, 0.62, 0.55], ambTint: [1, 0.96, 0.92] },
};

export function createCharacter(face, opt = {}) {
  const data = buildCharacterData();
  const { FACE_UV, FACE_DY } = faceFrame();
  const bones = [], byName = {}, worlds = [];
  data.specs.forEach(s => {
    const b = new THREE.Bone(); b.name = s.name;
    const m = new THREE.Matrix4().makeBasis(new THREE.Vector3(...s.x), new THREE.Vector3(...s.dir), new THREE.Vector3(...s.z)).setPosition(...s.pos);
    worlds.push(m);
    if (s.parent) {
      const pi = data.specs.findIndex(q => q.name === s.parent);
      worlds[pi].clone().invert().multiply(m).decompose(b.position, b.quaternion, b.scale);
      bones[pi].add(b);
    } else m.decompose(b.position, b.quaternion, b.scale);
    b.scale.set(1, 1, 1);
    b.userData.rest = b.quaternion.clone(); b.userData.restPos = b.position.clone(); b.userData.spec = s;
    bones.push(b); byName[s.name] = b;
  });
  const group = new THREE.Group(); group.name = 'character'; group.add(bones[0]);
  group.updateMatrixWorld(true);
  const skeleton = new THREE.Skeleton(bones);
  const meshes = {};
  for (const [name, m] of Object.entries(data.meshes)) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(m.positions, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(m.normals, 3));
    g.setAttribute('color', new THREE.BufferAttribute(m.colors, 3));
    g.setAttribute('skinIndex', new THREE.BufferAttribute(m.skinIndices, 4));
    g.setAttribute('skinWeight', new THREE.BufferAttribute(m.skinWeights, 4));
    g.setAttribute('aAxis', new THREE.BufferAttribute(m.axis, 3));          // grain of the cloth (hair: the strand's direction)
    g.setAttribute('aRib', new THREE.BufferAttribute(m.rib, 4));            // ribbing: cos, sin of the way round, rib count, amount (hair: across, along)
    g.setAttribute('aFx', new THREE.BufferAttribute(m.fx, 4));              // seam distance, occlusion, seam kind
    g.setIndex(new THREE.BufferAttribute(m.indices, 1));
    if (m.col2) { g.setAttribute('aCol2', new THREE.BufferAttribute(m.col2, 3)); g.setAttribute('aBlk', new THREE.BufferAttribute(m.blk, 1)); }   // crisp colour blocks
    const mat = surfaceMaterial(m.material, { ...shadeFor(m.material), envMap: m.material === 'steel' ? opt.env : null, envIntensity: 0.6, blocks: !!m.col2, bounce: castName() === 'mustard' ? 0 : 0.75 });
    if (name === 'head') {
      // The face drawing is projected straight onto the front of the head. Its borders are plain skin, so
      // everything outside it (neck, crown) and the back of the head read the nearest border: no visible edge.
      const n = m.positions.length / 3, uv = new Float32Array(n * 2), cl = v => Math.max(0.004, Math.min(0.996, v));
      for (let i = 0; i < n; i++) {
        const x = m.positions[i * 3], front = m.normals[i * 3 + 2] > 0;
        uv[i * 2] = front ? cl((x - FACE_UV.x0) / FACE_UV.size) : x < 0 ? 0.004 : 0.996;
        uv[i * 2 + 1] = cl((m.positions[i * 3 + 1] - FACE_DY - FACE_UV.y0) / FACE_UV.size);
      }
      g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      // the eye openings are cut by the drawing's alpha. A low threshold: seen small, the opening must not eat into the lash line
      if (face) { mat.map = face.texture; if (face.holes) { mat.alphaTest = 0.32; mat.alphaToCoverage = true; } }
    }
    const mesh = new THREE.SkinnedMesh(g, mat);
    mesh.name = name; mesh.castShadow = name !== 'hair'; mesh.receiveShadow = true; mesh.frustumCulled = false;      // the fringe shades the face softly (baked), not with a hard cast shadow
    mesh.bind(skeleton, new THREE.Matrix4());
    group.add(mesh); meshes[name] = mesh;
  }
  const eyes = face && face.holes ? createEyes(face, data.parts.head.prims, byName.head) : null;
  return { group, bones: byName, list: bones, skeleton, meshes, eyes, data };
}
