// The eyes' depth. Behind each opening in the face lie two thin surfaces that follow the face:
//   the eye layer    4 mm behind the skin: the white and the iris, with a bowl 5 mm deep under the
//                    iris, so the pupil sits a centimetre behind the lids and shifts against them as the view turns
//   the glint layer  1 mm behind the skin: the two highlights, which therefore float over the iris
// Both are rigid and ride on the head bone. They are unlit: an eye keeps its colour in any light.
import * as THREE from '../vendor/three/three.module.js';
import { frontZ } from './headmodel.js';
import { faceFrame } from './face.js';

export const EYE_DEPTH = { layer: 0.42, bowl: 0.5, glint: 0.1 };

// a sheet that follows the face, `gap` behind it, over a rectangle of the face on each side
function sheet(prims, x0, x1, y0, y1, step, gap) {
  const { EYE_UV, FACE_DY } = faceFrame();
  const pos = [], uv = [], idx = [];
  for (const s of [-1, 1]) {
    const nx = Math.round((x1 - x0) / step), ny = Math.round((y1 - y0) / step), id = new Int32Array((nx + 1) * (ny + 1)).fill(-1);
    for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
      const x = s * (x0 + (x1 - x0) * i / nx), y = y0 + (y1 - y0) * j / ny + FACE_DY, z = frontZ(prims, x, y, 12, 1.5);
      if (z <= 1.6) continue;                                   // the head has turned away here
      id[j * (nx + 1) + i] = pos.length / 3; pos.push(x, y, z - gap); uv.push((x - EYE_UV.x0) / EYE_UV.w, (y - FACE_DY - EYE_UV.y0) / EYE_UV.h);
    }
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const a = id[j * (nx + 1) + i], b = id[j * (nx + 1) + i + 1], c = id[(j + 1) * (nx + 1) + i + 1], d = id[(j + 1) * (nx + 1) + i];
      if (a < 0 || b < 0 || c < 0 || d < 0) continue;
      if (s > 0) idx.push(a, b, c, a, c, d); else idx.push(a, c, b, a, d, c);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
  return g;
}

export function createEyes(face, headPrims, headBone) {
  const { IRIS, FACE_DY } = faceFrame(), ey = IRIS.y - 146.5;       // the first character's sheets, moved to where this character's eyes are
  const bind = headBone.matrixWorld.clone().invert(), U = { uIrisR: { value: new THREE.Vector4(-IRIS.x, IRIS.y + FACE_DY, IRIS.r, EYE_DEPTH.bowl) }, uIrisL: { value: new THREE.Vector4(IRIS.x, IRIS.y + FACE_DY, IRIS.r, EYE_DEPTH.bowl) } };
  const eyeMat = new THREE.MeshBasicMaterial({ map: face.eyeTexture });
  eyeMat.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform vec4 uIrisR; uniform vec4 uIrisL;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
  vec2 cdR = ( position.xy - uIrisR.xy ) / uIrisR.z, cdL = ( position.xy - uIrisL.xy ) / uIrisL.z;
  float cdBr = max( 0.0, 1.0 - dot( cdR, cdR ) ), cdBl = max( 0.0, 1.0 - dot( cdL, cdL ) );
  transformed.z -= uIrisR.w * cdBr * cdBr + uIrisL.w * cdBl * cdBl;          // the bowl under each iris`);
  };
  const layer = new THREE.Mesh(sheet(headPrims, 1.3, 8.9, 143.3 + ey, 150.5 + ey, 0.15, EYE_DEPTH.layer), eyeMat);
  const glint = new THREE.Mesh(sheet(headPrims, 1.6, 7.8, 144.4 + ey, 149.4 + ey, 0.3, EYE_DEPTH.glint), new THREE.MeshBasicMaterial({ map: face.glintTexture, transparent: true, depthWrite: false }));
  layer.name = 'eye-layer'; glint.name = 'eye-glint'; glint.renderOrder = 2;
  for (const m of [layer, glint]) { m.matrixAutoUpdate = false; m.matrix.copy(bind); m.frustumCulled = false; headBone.add(m); }
  // the bowls follow the irises
  const sync = () => { U.uIrisR.value.x = face.iris.r[0]; U.uIrisR.value.y = face.iris.r[1] + FACE_DY; U.uIrisL.value.x = face.iris.l[0]; U.uIrisL.value.y = face.iris.l[1] + FACE_DY; };
  layer.onBeforeRender = sync;
  return { layer, glint, uniforms: U };
}
