// The preview: a three.js scene around the character, with a slider for every joint.
import * as THREE from '../vendor/three/three.module.js';
import { OrbitControls } from '../vendor/three/OrbitControls.js';
import { createCharacter } from './character.js';
import { Face } from './face.js';
import { Rig } from './rig.js';
import { rigData } from './rigdef.js';
import { PALETTE } from './model.js';
import { studioEnvironment } from './textures.js';
import { CAST, setCast, castName } from './cast.js';

const $ = id => document.getElementById(id);
const stage = $('stage');

(async function () {
  /* ----- which character: ?c=sporty in the address, or window.CHAR3D_CAST set before this script ----- */
  const want = new URLSearchParams(location.search).get('c') || window.CHAR3D_CAST || 'mustard';
  setCast(CAST[want] ? want : 'mustard');
  const pick = $('cast');
  if (pick) {
    pick.innerHTML = Object.entries(CAST).map(([k, c]) => `<option value="${k}">${c.label}</option>`).join('');
    pick.value = castName();
    pick.onchange = () => { const u = new URL(location.href); u.searchParams.set('c', pick.value); location.href = u.href; };
  }
  /* ----- rig data: rig.json when served, the bundled copy when opened from disk ----- */
  let data, source = 'rig.json';
  try { const r = await fetch('rig.json'); if (!r.ok) throw 0; data = await r.json(); } catch (e) { data = rigData(); source = 'the bundled copy (opened from disk)'; }

  /* ----- scene ----- */
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.NoToneMapping;          // the palette is the reference's own lit colours: no curve on top
  stage.prepend(renderer.domElement);
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#F6F6FA');
  const camera = new THREE.PerspectiveCamera(26, 1, 10, 4000);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.12; controls.minDistance = 40; controls.maxDistance = 1400; controls.maxPolarAngle = Math.PI * 0.52;

  // Light as in the reference: a strong key from high on the right front, its shadows soft and only partial; a low,
  // warm fill from the front left; a rim from behind; and little light from below, so undersides fall away.
  scene.add(new THREE.HemisphereLight(0xffffff, 0x9a8068, 1.35));
  const key = new THREE.DirectionalLight(0xfffaf2, 3.8); key.position.set(60, 285, 170); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -130, right: 130, top: 100, bottom: -110, near: 20, far: 700 });
  key.shadow.bias = -0.0005; key.shadow.normalBias = 0.6; key.shadow.radius = 6; key.shadow.intensity = 0.55;      // a big soft light: its shadows take away about half
  scene.add(key, key.target); key.target.position.set(0, 85, 0);
  const rim = new THREE.DirectionalLight(0xf2f4ff, 1.6); rim.position.set(140, 150, -180); scene.add(rim);          // near white, a touch cool: a warm rim greys the navy of the jeans
  const fill = new THREE.DirectionalLight(0xfff1e2, 0.6); fill.position.set(-80, 110, 200); scene.add(fill);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), new THREE.ShadowMaterial({ opacity: 0.05, color: 0x6c7190 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  // contact shadows: a soft patch under each foot that fades as the foot lifts, and a wide faint one under the body
  const blobTex = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 128; const c = cv.getContext('2d'), g = c.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(104,100,116,1)'); g.addColorStop(0.45, 'rgba(104,100,116,0.45)'); g.addColorStop(1, 'rgba(104,100,116,0)'); c.fillStyle = g; c.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const blob = (w, d, o) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, opacity: o, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.userData.o = o; m.renderOrder = -1; scene.add(m); return m; };
  const shade = { feet: { r: blob(26, 46, 0.34), l: blob(26, 46, 0.34) }, body: blob(120, 90, 0.12) };

  /* ----- character ----- */
  const t0 = performance.now();
  const face = new Face();
  const char = createCharacter(face, { env: studioEnvironment(renderer) });
  scene.add(char.group);
  const rig = new Rig(char, data, face);
  const buildMs = performance.now() - t0;
  $('loading')?.remove();

  const VIEWS = { front: [[0, 92, 395], [0, 84, 0]], three: [[230, 112, 320], [0, 84, 0]], side: [[395, 92, 0], [0, 84, 0]], back: [[0, 92, -395], [0, 84, 0]], face: [[20, 150, 105], [0, 147.5, 2]], hand: [[-78, 94, 72], [-23, 80, 2]] };
  function view(name) { const v = VIEWS[name] || VIEWS.front; camera.position.set(...v[0]); controls.target.set(...v[1]); controls.update(); }
  function resize() { const w = stage.clientWidth, h = stage.clientHeight; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  addEventListener('resize', resize); resize(); view('front');

  /* ----- sliders, one per joint, grouped ----- */
  const rows = new Map(), chainOf = {};
  for (const [name, c] of Object.entries(data.ik)) for (const id of [c.joints.z, c.joints.x, c.joints.y, c.joints.hinge]) chainOf[id] = name;
  for (const gname of ['Head', 'Torso', 'Arms', 'Hands and fingers', 'Legs']) {
    const js = data.joints.filter(j => j.group === gname), det = document.createElement('details');
    det.open = gname === 'Arms';
    det.innerHTML = `<summary>${gname}<span>${js.length} joints</span></summary>`;
    for (const j of js) {
      const row = document.createElement('div'); row.className = 'row';
      const step = j.unit === 'px' ? 0.5 : 1;
      row.innerHTML = `<label title="${j.id}: ${j.min} to ${j.max} ${j.unit}">${j.label}</label><input type="range" min="${j.min}" max="${j.max}" step="${step}" aria-label="${j.label}"><input type="number" min="${j.min}" max="${j.max}" step="${step}" aria-label="${j.label} value">`;
      const [, range, num] = row.children;
      const write = v => { if (chainOf[j.id] && rig.ik[chainOf[j.id]].active) rig.setIK(chainOf[j.id], false); show(j.id, rig.set(j.id, v)); };
      range.addEventListener('input', () => write(range.value));
      num.addEventListener('change', () => write(num.value));
      range.addEventListener('dblclick', () => write(j.default));
      rows.set(j.id, { range, num, shown: null }); det.append(row);
    }
    $('groups').append(det);
  }
  function show(id, v) { const r = rows.get(id); v = Math.round(v * 10) / 10; if (r.shown === v) return; r.shown = v; r.range.value = v; if (document.activeElement !== r.num) r.num.value = v; }
  const syncSliders = () => { for (const [id, j] of rig.joints) show(id, j.value); };

  /* ----- buttons and switches ----- */
  const anim = name => { if (rig.busy) return; const on = rig.anim.name === name; on ? rig.stop() : rig.play(name); for (const n of ['wave', 'walk']) $(n).setAttribute('aria-pressed', String(!on && n === name)); };
  $('wave').onclick = () => anim('wave'); $('walk').onclick = () => anim('walk');
  // one-shot moves: one click plays the move once and returns to idle; clicks are ignored while one plays
  const once = name => { if (!rig.once(name)) return; for (const n of ['wave', 'walk']) $(n).setAttribute('aria-pressed', 'false'); };
  $('parkour').onclick = () => once('parkour'); $('rap').onclick = () => once('rap');
  const clipButtons = () => { const n = rig.clipName; for (const id of ['parkour', 'rap']) { const b = $(id), on = String(n === id); if (b.getAttribute('aria-pressed') !== on) b.setAttribute('aria-pressed', on); } };
  $('reset').onclick = () => { rig.reset(); for (const n of ['wave', 'walk']) $(n).setAttribute('aria-pressed', 'false'); syncSliders(); };
  $('physics').onchange = e => { rig.physics = e.target.checked; $('breathing').disabled = !rig.physics; rig.settle(); };
  $('breathing').onchange = e => { rig.breathing = e.target.checked; };
  for (const b of document.querySelectorAll('[data-hand]')) b.onclick = () => { rig.hand(b.dataset.hand, $('hand-side').value.split('')); syncSliders(); };
  for (const b of document.querySelectorAll('[data-view]')) b.onclick = () => view(b.dataset.view);

  /* ----- IK handles: drag a hand or a foot in 3D; the handle stays on what the limb can reach ----- */
  const handles = {}, hGeo = new THREE.SphereGeometry(2.6, 20, 14);
  for (const name of Object.keys(data.ik)) {
    const m = new THREE.Mesh(hGeo, new THREE.MeshBasicMaterial({ color: 0x2e6ba6, transparent: true, opacity: 0.55, depthTest: false }));
    m.renderOrder = 10; m.userData.ik = name; m.visible = false; scene.add(m); handles[name] = m;
  }
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(), plane = new THREE.Plane(), hit = new THREE.Vector3();
  let drag = null;
  const setPtr = ev => { const r = renderer.domElement.getBoundingClientRect(); ptr.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ptr, camera); };
  renderer.domElement.addEventListener('pointerdown', ev => {
    if (!$('ik').checked) return;
    setPtr(ev);
    const h = ray.intersectObjects(Object.values(handles))[0];
    if (!h) return;
    drag = { name: h.object.userData.ik, want: h.object.position.clone() };
    plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(new THREE.Vector3()).negate(), h.object.position);
    rig.setIK(drag.name, true); controls.enabled = false; renderer.domElement.setPointerCapture(ev.pointerId); ev.stopPropagation();
  }, true);
  renderer.domElement.addEventListener('pointermove', ev => { if (!drag) return; setPtr(ev); if (ray.ray.intersectPlane(plane, hit)) drag.want.copy(hit); });
  const endDrag = () => { if (drag) { drag = null; controls.enabled = true; } };
  renderer.domElement.addEventListener('pointerup', endDrag); renderer.domElement.addEventListener('pointercancel', endDrag);

  /* ----- joint pivots ----- */
  const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(char.list.length * 3), 3));
  const pivots = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xd73d2e, size: 6, sizeAttenuation: false, depthTest: false }));
  pivots.renderOrder = 9; pivots.frustumCulled = false; pivots.visible = false; scene.add(pivots);

  /* ----- frame loop ----- */
  let last = performance.now(), frames = 0, acc = 0, worst = 0;
  const v3 = new THREE.Vector3();
  function tick(now) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (drag) rig.moveIK(drag.name, drag.want.x, drag.want.y, drag.want.z);
    if (!window.app.paused) rig.step(dt);            // tests freeze time and step the rig themselves
    const ikOn = $('ik').checked;
    for (const [name, m] of Object.entries(handles)) { m.visible = ikOn; if (!ikOn) continue; const c = rig.ik[name]; m.position.copy(c.effector); m.material.color.set(drag && drag.name === name && !c.reached ? 0xd73d2e : 0x2e6ba6); }
    for (const sd of ['r', 'l']) {                                              // the contact shadows follow the feet
      const b = char.bones[`foot-${sd}`], m = shade.feet[sd]; v3.setFromMatrixPosition(b.matrixWorld);
      const lift = Math.max(0, v3.y - rig.feet[0].ankle.y), fw = v3.clone().set(0, 0, 1).transformDirection(b.matrixWorld);
      m.position.set(v3.x + fw.x * 0, 0.05, v3.z + 4.5); m.material.opacity = m.userData.o / (1 + lift * 0.25); m.scale.setScalar(1 + lift * 0.04);
    }
    v3.setFromMatrixPosition(char.bones.pelvis.matrixWorld); shade.body.position.set(v3.x, 0.04, v3.z + 2);
    pivots.visible = $('pivots').checked;
    if (pivots.visible) { const a = pGeo.attributes.position; char.list.forEach((b, i) => { v3.setFromMatrixPosition(b.matrixWorld); a.setXYZ(i, v3.x, v3.y, v3.z); }); a.needsUpdate = true; }
    if (rig.frame % 4 === 0) syncSliders();
    clipButtons();
    controls.update(); renderer.render(scene, camera);
    frames++; acc += dt; worst = Math.max(worst, dt);
    if (acc >= 0.5) { window.__fps = frames / acc; $('hud').innerHTML = `<b>${window.__fps.toFixed(0)}</b> fps &nbsp; slowest frame ${(worst * 1000).toFixed(0)} ms &nbsp; built in ${(buildMs / 1000).toFixed(1)} s &nbsp; limits from ${source}`; frames = 0; acc = 0; worst = 0; }
    requestAnimationFrame(tick);
  }
  syncSliders();
  window.app = { cast: castName(), THREE, scene, camera, controls, renderer, char, rig, face, view, buildMs, handles, palette: PALETTE, lights: { key, rim, fill } };
  window.rig = rig;
  requestAnimationFrame(tick);
  window.__ready = true;
})();
