// The rig runtime: joint limits, forward kinematics, two-bone IK, spring bones, breathing,
// blinking, balance and ground contact, all in 3D. three.js does the skinning.
//
//   const rig = new Rig(character, rigJson, face);
//   rig.set('elbow-r', 90);          // clamped to the joint's limits; returns the stored value
//   rig.step(seconds);               // once per frame
import * as THREE from '../vendor/three/three.module.js';
import { HELPERS } from './skeleton.js';
import { CLIPS } from './clips.js';

const RAD = Math.PI / 180;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const rnd = (a, b) => a + Math.random() * (b - a);
const V3 = () => new THREE.Vector3(), Q = () => new THREE.Quaternion();
const _e = new THREE.Euler(), _q = Q(), _q2 = Q(), _q3 = Q(), _m = new THREE.Matrix4(), _m2 = new THREE.Matrix4();
const _a = V3(), _b = V3(), _c = V3(), _d = V3(), _s = V3(), _Y = new THREE.Vector3(0, 1, 0), _Z = new THREE.Vector3();

export class Rig {
  constructor(char, data, face) {
    this.char = char; this.data = data; this.face = face;
    this.physics = true; this.breathing = true; this.time = 0; this.frame = 0;
    char.group.updateMatrixWorld(true);

    this.bones = new Map(); this.order = [];
    for (const b of char.list) {
      const st = { id: b.name, bone: b, parent: b.parent.isBone ? this.bones.get(b.parent.name) : null, rest: b.userData.rest.clone(), restPos: b.userData.restPos.clone(),
        ch: { x: 0, y: 0, z: 0 }, off: V3(), pre: null, spring: null, helper: null, dofs: { x: [], y: [], z: [] }, bindInv: b.matrixWorld.clone().invert(), bindPos: V3().setFromMatrixPosition(b.matrixWorld), bindQ: Q().setFromRotationMatrix(b.matrixWorld) };
      this.bones.set(b.name, st); this.order.push(st);
    }
    this.joints = new Map(); this.faceJoints = [];
    for (const j of data.joints) {
      const J = { ...j, value: j.default, add: 0, clip: 0, final: j.default, anim: null, st: j.bone ? this.bones.get(j.bone) : null };
      this.joints.set(j.id, J);
      if (J.st) J.st.dofs[j.axis].push(J); else this.faceJoints.push(J);
    }
    for (const h of HELPERS) this.bones.get(h.bone).helper = { of: this.bones.get(h.of), swing: h.swing, twist: h.twist };
    this.springs = [];
    for (const [id, s] of Object.entries(data.physics.springs)) {
      const st = this.bones.get(id);
      st.spring = { ...s, st, p: null, v: V3(), rx: 0, rz: 0, jx: st.dofs.x[0] || null, jz: st.dofs.z[0] || null };
      this.springs.push(st.spring);
    }
    this.scapula = data.scapula.map(s => ({ ...s, clav: this.bones.get(s.clavicle), arm: this.bones.get(s.upperArm), jLift: this.joints.get(s.lift), side: s.clavicle.slice(-1) }));
    this.ik = {};
    for (const [name, c] of Object.entries(data.ik)) {
      const up = this.bones.get(c.upper), lo = this.bones.get(c.lower), end = this.bones.get(c.end);
      this.ik[name] = {
        name, up, lo, end, foot: !!c.foot, pole: V3().fromArray(c.pole).normalize(), poleBone: this.bones.get(c.poleBone),
        jz: this.joints.get(c.joints.z), jx: this.joints.get(c.joints.x), jy: this.joints.get(c.joints.y), jh: this.joints.get(c.joints.hinge),
        level: c.joints.level ? c.joints.level.map(id => this.joints.get(id)) : null,
        l1: lo.restPos.length(), l2: end.restPos.length(), active: false, target: end.bindPos.clone(), effector: end.bindPos.clone(), reached: true, anim: null, sol: null,
      };
    }
    this.masses = data.masses.map(m => ({ st: this.bones.get(m.bone), local: V3().fromArray(m.at).applyMatrix4(this.bones.get(m.bone).bindInv), mass: m.mass }));
    this.feet = Object.entries(data.feet).map(([side, f]) => {
      const foot = this.bones.get(f.foot), toes = this.bones.get(f.toes);
      return { side, foot, toes, chain: this.ik[f.chain], joints: f.joints.map(id => this.joints.get(id)),
        pts: [[foot, V3().fromArray(f.heel).applyMatrix4(foot.bindInv)], [foot, V3().fromArray(f.ball).applyMatrix4(foot.bindInv)], [toes, V3().fromArray(f.tip).applyMatrix4(toes.bindInv)]],
        ankle: foot.bindPos.clone(), flat: foot.bindQ.clone(), height: 0, weight: 1, mode: 'planted', goal: null };
    });
    this.root = this.bones.get('root');
    this.bal = { x: 0, z: 0, vx: 0, vz: 0, y: 0 };
    this.blink = { next: rnd(1, 3), t: -1, v: 0 };
    this.sacc = { next: rnd(0.5, 2), x: 0, y: 0, tx: 0, ty: 0 };
    this.anim = { name: null, last: null, t: 0, w: 0, rootY: 0 };
    this.clip = null; this.clipQueued = null; this.clipRoot = V3();          // one-shot clips (clips.js)
    this.step(0);
    for (const c of Object.values(this.ik)) c.target.copy(c.effector);
  }

  /* ---------- joints ---------- */
  limits(id) { const j = this.joints.get(id); return [j.min, j.max]; }
  set(id, v) { const j = this.joints.get(id); if (!j) throw new Error('unknown joint ' + id); j.value = clamp(+v || 0, j.min, j.max); return j.value; }
  get(id) { return this.joints.get(id).value; }
  final(id) { return this.joints.get(id).final; }
  pose(values) { for (const [id, v] of Object.entries(values)) this.set(id, v); }
  reset() {
    for (const j of this.joints.values()) j.value = j.default;
    for (const c of Object.values(this.ik)) c.active = false;
    this.stop(); this.settle();
  }
  hand(preset, sides = ['r', 'l']) {
    const p = this.data.presets[preset]; if (!p) throw new Error('unknown preset ' + preset);
    for (const s of sides) for (const [id, v] of Object.entries(p)) this.set(`${id}-${s}`, v);
  }
  settle() { for (const s of this.springs) { s.p = null; s.v.set(0, 0, 0); s.rx = s.rz = 0; } this.bal.vx = this.bal.vz = 0; }

  /* ---------- IK ---------- */
  setIK(name, on) { const c = this.ik[name]; c.active = !!on; if (on) c.target.copy(c.effector); return c; }
  moveIK(name, x, y, z) { const c = this.ik[name]; c.target.set(x, y, z); return c; }

  /* ---------- animation ---------- */
  play(name) { this.anim.name = name; this.anim.t = 0; }
  stop() { this.anim.name = null; }
  /* A one-shot clip (clips.js): plays once from the idle pose and back. Refused (returns false)
     while a clip is playing, so two never overlap. A looping wave or walk blends out first. */
  once(name) {
    if (this.busy || !CLIPS[name]) return false;
    if (this.anim.name) { this.stop(); this.clipQueued = name; } else this.clip = { name, t: 0 };
    return true;
  }
  get busy() { return !!(this.clip || this.clipQueued); }
  get clipName() { return this.clip ? this.clip.name : this.clipQueued; }
  _clip(dt) {
    for (const j of this.joints.values()) j.clip = 0;
    for (const c of Object.values(this.ik)) c.clip = null;
    this.clipRoot.set(0, 0, 0);
    if (this.clipQueued && this.anim.w <= 0) { this.clip = { name: this.clipQueued, t: 0 }; this.clipQueued = null; }
    const C = this.clip; if (!C) return;
    C.t += dt;
    const def = CLIPS[C.name], t = Math.min(C.t, def.duration);
    def.at(t, {
      joint: (id, v) => { const j = this.joints.get(id); if (j) j.clip += v; },
      foot: (side, x, y, z) => { const c = this.ik[`foot-${side}`]; (c.clip ??= V3()).set(x, Math.max(0, y), z); },
      root: (x, y, z) => this.clipRoot.set(x, y, z),
    });
    if (C.t >= def.duration) this.clip = null;
  }
  _animate(dt) {
    this._clip(dt);
    const A = this.anim, on = !!A.name;
    A.w = clamp(A.w + (on ? dt : -dt) / 0.4, 0, 1);
    if (on) { A.t += dt; A.last = A.name; }
    for (const j of this.joints.values()) j.anim = null;
    for (const c of Object.values(this.ik)) c.anim = null;
    A.rootY = 0;
    if (A.w <= 0) return;
    const t = A.t, TAU = Math.PI * 2, set = (id, v) => { this.joints.get(id).anim = v; };
    if (A.last === 'wave') {
      const s = Math.sin(TAU * 1.6 * t), s2 = Math.sin(TAU * 1.6 * t - 1.0);
      set('shoulder-raise-r', 96); set('shoulder-forward-r', 14); set('shoulder-twist-r', 82 + 10 * s); set('elbow-r', 78 + 20 * s);
      set('forearm-twist-r', -20); set('wrist-side-r', 12 * s2); set('wrist-r', -8);
      for (const f of ['index', 'middle', 'ring', 'pinky']) { set(`finger-${f}-prox-r`, 4); set(`finger-${f}-mid-r`, 6); set(`finger-${f}-dist-r`, 4); }
      set('finger-index-spread-r', 6); set('finger-pinky-spread-r', -9); set('thumb-meta-r', -6); set('thumb-spread-r', 16); set('thumb-prox-r', 2); set('thumb-dist-r', 2);
      set('head-tilt', -5 - 1.5 * s); set('head-turn', -8); set('spine-3-side', -3); set('spine-2-side', -2);
      set('lip-corner-r', 14); set('lip-corner-l', 14); set('cheek-r', 3); set('cheek-l', 3);
    } else if (A.last === 'walk') {
      const T = 1.0, ph = TAU * t / T, lift = p => Math.pow(Math.max(0, Math.sin(p)), 0.8);
      const lr = lift(ph), ll = lift(ph + Math.PI), sw = Math.sin(ph);
      this.ik['foot-r'].anim = _a.set(0, 13 * lr, 5 * lr).clone(); this.ik['foot-l'].anim = _a.set(0, 13 * ll, 5 * ll).clone();
      set('shoulder-forward-r', -16 * sw); set('shoulder-forward-l', 16 * sw); set('elbow-r', 22 - 12 * sw); set('elbow-l', 22 + 12 * sw);
      set('spine-2-turn', -4 * sw); set('spine-3-turn', -4 * sw); set('pelvis-turn', 4 * sw); set('pelvis-side', -1.6 * sw); set('head-turn', 4 * sw);
      A.rootY = 0.9 * Math.abs(Math.cos(ph));
    }
  }
  _base(j) { return (j.anim == null ? j.value : j.value + (j.anim - j.value) * this.anim.w) + j.clip; }

  /* ---------- pose from joint values ---------- */
  _boneQ(st) {
    _e.set(st.ch.x, st.ch.y, st.ch.z, 'ZXY');
    st.bone.quaternion.copy(st.rest).multiply(_q.setFromEuler(_e));
    if (st.pre) st.bone.quaternion.premultiply(st.pre);
  }
  _resolve() {
    for (const st of this.order) { st.ch.x = st.ch.y = st.ch.z = 0; st.pre = null; }
    for (const j of this.joints.values()) {
      j.final = clamp(this._base(j) + j.add, j.min, j.max);
      if (j.st) j.st.ch[j.axis] += j.k * (j.final - j.bind) * RAD;
    }
    // the clavicle lifts as the arm rises (scapula), and the arm keeps the direction it was asked for
    for (const s of this.scapula) {
      const elev = Math.max(this.joints.get(`shoulder-raise-${s.side}`).final, this.joints.get(`shoulder-forward-${s.side}`).final);
      const extra = clamp(s.jLift.final + clamp((elev - s.start) * s.ratio, 0, s.max), s.jLift.min, s.jLift.max) - s.jLift.final;
      if (extra < 1e-4) continue;
      this._boneQ(s.clav); _q2.copy(s.clav.bone.quaternion);
      s.clav.ch.z += s.jLift.k * extra * RAD; this._boneQ(s.clav);
      s.arm.pre = (s.preQ ??= Q()).copy(s.clav.bone.quaternion).invert().multiply(_q2);
    }
    for (const st of this.order) { if (!st.helper) this._boneQ(st); st.bone.position.copy(st.restPos).add(st.off); }
  }
  // helper bones: a share of the bend (without its twist) around a joint, a share of the twist along a limb
  _helpers() {
    for (const st of this.order) {
      const h = st.helper; if (!h) continue;
      const of = h.of;
      if (h.twist != null) { st.bone.quaternion.setFromAxisAngle(_Y, -(1 - h.twist) * of.ch.y); continue; }      // child of the limb: undo the twist it has not earned yet
      _q.copy(of.rest).invert().multiply(of.bone.quaternion).multiply(_q3.setFromAxisAngle(_Y, -of.ch.y));    // the limb's turn from rest, twist taken out
      st.bone.quaternion.copy(st.rest).multiply(_q2.identity().slerp(_q, h.swing));
    }
  }
  _fk(springs, dt) {
    for (const st of this.order) {
      const b = st.bone;
      if (springs && st.spring) this._spring(st, dt);
      b.updateMatrix(); b.matrixWorld.multiplyMatrices(b.parent.matrixWorld, b.matrix);
    }
  }

  // a mass on the end of the bone, pulled towards where the bone would be if it were rigid
  _spring(st, dt) {
    const sp = st.spring, b = st.bone;
    b.updateMatrix(); _m.multiplyMatrices(b.parent.matrixWorld, b.matrix);
    const piv = _a.setFromMatrixPosition(_m), goal = _b.set(0, sp.length, 0).applyMatrix4(_m);
    if (!sp.p) { sp.p = goal.clone(); sp.v.set(0, 0, 0); sp.rx = sp.rz = 0; return; }
    const steps = Math.max(1, Math.min(6, Math.ceil(dt / (1 / 120)))), h = dt / steps, w = sp.stiffness / sp.mass;
    for (let i = 0; i < steps; i++) {
      sp.v.x += (w * (goal.x - sp.p.x) - sp.damping * sp.v.x) * h;
      sp.v.y += (w * (goal.y - sp.p.y) - sp.damping * sp.v.y - sp.gravity) * h;
      sp.v.z += (w * (goal.z - sp.p.z) - sp.damping * sp.v.z) * h;
      sp.p.addScaledVector(sp.v, h);
      _c.subVectors(sp.p, piv).setLength(sp.length); sp.p.addVectors(piv, _c);
    }
    // swing from the bone's own axis to the mass, as a rotation about local x and z
    const c = _c.copy(sp.p).applyMatrix4(_m2.copy(_m).invert()).normalize();
    const ang = Math.acos(clamp(c.y, -1, 1)), l = Math.hypot(c.z, c.x);
    let rx = l < 1e-6 ? 0 : c.z / l * ang, rz = l < 1e-6 ? 0 : -c.x / l * ang;
    // limits: the spring's own, and whatever the joint has left
    const lim = sp.limit * RAD, mag = Math.hypot(rx, rz), room = (j, r) => {
      if (!j) return r;
      const a = j.k * (j.min - j.final) * RAD, bb = j.k * (j.max - j.final) * RAD;
      return clamp(r, Math.min(a, bb), Math.max(a, bb));
    };
    let x2 = rx, z2 = rz;
    if (mag > lim) { x2 *= lim / mag; z2 *= lim / mag; }
    x2 = room(sp.jx, x2); z2 = room(sp.jz, z2);
    if (x2 !== rx || z2 !== rz) {
      const a2 = Math.hypot(x2, z2), ax = a2 ? x2 / a2 : 0, az = a2 ? z2 / a2 : 0;
      sp.p.set(-az * Math.sin(a2), Math.cos(a2), ax * Math.sin(a2)).multiplyScalar(sp.length).applyMatrix4(_m);
      sp.v.multiplyScalar(0.5); rx = x2; rz = z2;
    }
    sp.rx = rx; sp.rz = rz;
    const a3 = Math.hypot(rx, rz);
    if (a3 > 1e-6) b.quaternion.multiply(_q.setFromAxisAngle(_d.set(rx / a3, 0, rz / a3), a3));
  }

  /* ---------- two-bone IK ---------- */
  // end of the chain for given joint values [z, x, y, hinge] in degrees
  _chainEnd(c, v, out) {
    const up = c.up, lo = c.lo;
    _e.set(c.jx.k * (v[1] - c.jx.bind) * RAD, c.jy.k * (v[2] - c.jy.bind) * RAD, c.jz.k * (v[0] - c.jz.bind) * RAD, 'ZXY');
    const qu = _q.copy(up.rest).multiply(_q2.setFromEuler(_e)); if (up.pre) qu.premultiply(up.pre);
    const qw = _q3.copy(c.pq).multiply(qu);
    out.copy(lo.restPos).applyQuaternion(qw).add(c.A);
    _e.set(c.jh.k * (v[3] - c.jh.bind) * RAD, lo.ch.y, 0, 'ZXY');
    qw.multiply(_q2.copy(lo.rest).multiply(_q.setFromEuler(_e)));
    return out.add(_s.copy(c.end.restPos).applyQuaternion(qw));
  }
  _solve(c, goal) {
    const up = c.up, J = [c.jz, c.jx, c.jy, c.jh], target = (c.T ??= V3()).copy(goal);
    c.pq = (c.pq || Q()).setFromRotationMatrix(up.bone.parent.matrixWorld);
    c.A = (c.A || V3()).copy(up.restPos).add(up.off).applyMatrix4(up.bone.parent.matrixWorld);
    const to = _a.subVectors(target, c.A), dist = to.length(), d = clamp(dist, Math.abs(c.l1 - c.l2) + 0.01, c.l1 + c.l2 - 0.01), dir = to.normalize();
    // the elbow (knee) goes towards the pole
    const pole = _b.copy(c.pole).applyQuaternion(_q.setFromRotationMatrix(c.poleBone.bone.matrixWorld));
    pole.addScaledVector(dir, -pole.dot(dir)); if (pole.lengthSq() < 1e-6) pole.set(dir.y, -dir.x, 0); pole.normalize();
    const ca = clamp((c.l1 * c.l1 + d * d - c.l2 * c.l2) / (2 * c.l1 * d), -1, 1), sa = Math.sqrt(1 - ca * ca);
    const yu = _c.copy(dir).multiplyScalar(ca).addScaledVector(pole, sa).normalize();
    const zu = _d.copy(pole).multiplyScalar(-1).addScaledVector(yu, pole.dot(yu)).normalize();
    const xu = _s.crossVectors(yu, zu);
    _q.setFromRotationMatrix(_m.makeBasis(xu, yu, zu));
    _q2.copy(c.pq).invert().multiply(_q); if (up.pre) _q2.premultiply(_q3.copy(up.pre).invert());
    _e.setFromQuaternion(_q3.copy(up.rest).invert().multiply(_q2), 'ZXY');
    const beta = Math.acos(clamp((c.l1 * c.l1 + c.l2 * c.l2 - d * d) / (2 * c.l1 * c.l2), -1, 1));
    const near = (j, v) => { const mid = (j.min + j.max) / 2; let r = v - mid; r = ((r + 180) % 360 + 360) % 360 - 180; return mid + r; };   // same angle, written inside the range when it can be
    const want = [near(c.jz, c.jz.bind + _e.z / (c.jz.k * RAD)), near(c.jx, c.jx.bind + _e.x / (c.jx.k * RAD)), near(c.jy, c.jy.bind + _e.y / (c.jy.k * RAD)), (Math.PI - beta) / RAD / c.jh.k + c.jh.bind];
    const cl = v => v.map((x, i) => clamp(x, J[i].min, J[i].max));
    // candidates: the exact answer clamped, and the current pose; whichever lands nearer, then a search inside the limits
    const end = V3(), err = v => this._chainEnd(c, v, end).distanceTo(target);
    let best = cl(want), be = err(best);
    const cur = cl(J.map(j => j.final)), ce = err(cur);
    if (ce < be - 1e-6) { best = cur; be = ce; }
    if (be > 0.05) {
      let step = 12;
      for (let it = 0; it < 40 && be > 0.03 && step > 0.02; it++) {
        let moved = false;
        for (let i = 0; i < 4; i++) for (const s of [step, -step]) {
          const v = best.slice(); v[i] = clamp(v[i] + s, J[i].min, J[i].max);
          const e2 = err(v); if (e2 < be - 1e-5) { best = v; be = e2; moved = true; }
        }
        if (!moved) step /= 2;
      }
    }
    this._chainEnd(c, best, end);
    return { v: best, end, err: be };
  }
  _applyIK(c, s, writeValues) {
    const J = [c.jz, c.jx, c.jy, c.jh];
    J.forEach((j, i) => { j.final = s.v[i]; if (writeValues) j.value = s.v[i]; });
    for (const st of [c.up, c.lo]) { st.ch.x = st.ch.y = st.ch.z = 0; for (const ax of ['x', 'y', 'z']) for (const j of st.dofs[ax]) st.ch[ax] += j.k * (j.final - j.bind) * RAD; this._boneQ(st); }
    c.effector.copy(s.end); c.reached = s.err < 0.15;
    if (c.active && !c.reached) c.target.copy(s.end);
  }
  // keep the sole flat and pointing where the foot was built to point, as far as the ankle allows
  _level(c) {
    const f = c.end;
    c.lo.bone.updateMatrix(); c.up.bone.updateMatrix();
    _m.multiplyMatrices(c.up.bone.parent.matrixWorld, c.up.bone.matrix).multiply(c.lo.bone.matrix);
    _q2.setFromRotationMatrix(_m).invert().multiply(f.bindQ);
    _e.setFromQuaternion(_q3.copy(f.rest).invert().multiply(_q2), 'ZXY');
    const [jf, jr, jt] = c.level;
    jf.final = clamp(_e.x / (jf.k * RAD), jf.min, jf.max); jr.final = clamp(_e.y / (jr.k * RAD), jr.min, jr.max); jt.final = clamp(_e.z / (jt.k * RAD), jt.min, jt.max);
    f.ch.x = jf.k * jf.final * RAD; f.ch.y = jr.k * jr.final * RAD; f.ch.z = jt.k * jt.final * RAD; this._boneQ(f);
  }

  /* ---------- ground contact and balance ---------- */
  _ground(dt) {
    const B = this.data.physics.balance, A = this.anim;
    for (const f of this.feet) {
      f.height = Math.min(...f.pts.map(([st, p]) => _a.copy(p).applyMatrix4(st.bone.matrixWorld).y));
      const c = f.chain;
      f.mode = c.active || c.anim || c.clip ? 'ik' : f.joints.some(j => Math.abs(this._base(j) - j.default) > 0.01) ? 'free' : 'planted';
      f.goal = f.mode === 'planted' ? f.ankle : f.mode === 'ik' ? (c.anim ? (f.tmp ??= V3()).copy(f.ankle).addScaledVector(c.anim, A.w) : c.clip ? (f.tmp ??= V3()).copy(f.ankle) : c.target) : null;
      if (c.clip && f.goal) { if (f.goal !== f.tmp) f.goal = (f.tmp ??= V3()).copy(f.goal); f.goal.add(c.clip); }       // a clip places the foot from where it stands
    }
    const anyHeld = this.feet.some(f => f.goal), lowFree = Math.min(...this.feet.map(f => f.height));
    for (const f of this.feet) f.weight = clamp(1 - Math.max(0, f.goal ? f.goal.y - f.ankle.y : f.height - (anyHeld ? 0 : lowFree)) / 24, 0, 1);
    // centre of mass against the centre of the feet that carry weight
    let mx = 0, mz = 0, m = 0;
    for (const p of this.masses) { _a.copy(p.local).applyMatrix4(p.st.bone.matrixWorld); mx += _a.x * p.mass; mz += _a.z * p.mass; m += p.mass; }
    let sw = 0, sx = 0, sz = 0;
    for (const f of this.feet) { const p = f.goal || _a.setFromMatrixPosition(f.foot.bone.matrixWorld); sw += f.weight; sx += p.x * f.weight; sz += p.z * f.weight; }
    const ex = sw > 0.05 ? mx / m - sx / sw : 0, ez = sw > 0.05 ? mz / m - sz / sw - this.comZ : 0;
    let wx = -B.gain * ex, wz = -B.gain * ez; const wl = Math.hypot(wx, wz); if (wl > B.max) { wx *= B.max / wl; wz *= B.max / wl; }
    this.bal.vx += (B.stiffness * (wx - this.bal.x) - B.damping * this.bal.vx) * dt; this.bal.x += this.bal.vx * dt;
    this.bal.vz += (B.stiffness * (wz - this.bal.z) - B.damping * this.bal.vz) * dt; this.bal.z += this.bal.vz * dt;

    let y = A.rootY * A.w + this.clipRoot.y;
    const held = this.feet.filter(f => f.goal), R = this.root, cr = this.clipRoot;
    const place = () => { R.bone.position.set(R.restPos.x + this.bal.x + cr.x, R.restPos.y + y, R.restPos.z + this.bal.z + cr.z); this._fk(false); };
    place();
    if (held.length) {
      for (let it = 0; it < 3; it++) {
        let down = 0;
        for (const f of held) {
          const c = f.chain, hip = _a.copy(c.up.restPos).applyMatrix4(c.up.bone.parent.matrixWorld), dy = hip.y - f.goal.y, dd = hip.distanceTo(f.goal), max = c.l1 + c.l2 - 0.02;
          if (dd > max && dy > 0.1) down = Math.max(down, (dd - max) * dd / dy);
        }
        if (down < 0.001) break;
        y -= down; place();
      }
    } else { y -= Math.min(...this.feet.map(f => Math.min(...f.pts.map(([st, p]) => _a.copy(p).applyMatrix4(st.bone.matrixWorld).y)))); place(); }
    this.bal.y = y;
    for (const f of held) { const c = f.chain; this._applyIK(c, this._solve(c, f.goal), c.active); this._level(c); }
  }

  /* ---------- one frame ---------- */
  step(dt) {
    dt = clamp(dt, 0, 0.05); this.time += dt; this.frame++;
    const P = this.physics, phys = this.data.physics;
    this._animate(dt);
    for (const j of this.joints.values()) j.add = 0;
    for (const st of this.order) st.off.set(0, 0, 0);
    if (P) {
      if (this.breathing) {
        const br = phys.breathing, b = 0.5 - 0.5 * Math.cos(2 * Math.PI * this.time / br.period);
        this.bones.get('spine-3').off.set(0, br.chestLift * b, br.chestForward * b);
        this.joints.get('clavicle-lift-r').add += br.shoulder * b; this.joints.get('clavicle-lift-l').add += br.shoulder * b;
      }
      this._blink(dt);
    } else { this.bal.x = this.bal.z = this.bal.vx = this.bal.vz = 0; for (const s of this.springs) { s.p = null; s.rx = s.rz = 0; } }

    this._resolve();
    this.root.bone.position.copy(this.root.restPos);
    this._fk(false);
    if (this.comZ === undefined) { let mz = 0, m = 0; for (const p of this.masses) { mz += _a.copy(p.local).applyMatrix4(p.st.bone.matrixWorld).z * p.mass; m += p.mass; } this.comZ = mz / m - (this.feet[0].ankle.z + this.feet[1].ankle.z) / 2; }
    if (P) this._ground(dt);
    else {
      if (this.clip) { this.root.bone.position.add(this.clipRoot); this._fk(false); }        // a clip moves the hips with physics off too
      for (const c of Object.values(this.ik)) if (c.foot && (c.active || c.anim || c.clip)) this._applyIK(c, this._solve(c, c.anim || c.clip ? _b.copy(c.end.bindPos).addScaledVector(c.anim || _Z, c.anim ? this.anim.w : 0).add(c.clip || _Z) : c.target), c.active);
    }
    this._fk(false);
    for (const c of Object.values(this.ik)) if (!c.foot && c.active) this._applyIK(c, this._solve(c, c.target), true);
    this._helpers();
    this._fk(P, dt);
    for (const c of Object.values(this.ik)) if (!c.active && !(c.foot && (c.anim || c.clip))) c.effector.setFromMatrixPosition(c.end.bone.matrixWorld);
    if (this.face) this.face.update(this.faceJoints, this.joints.get('jaw').final);
  }

  _blink(dt) {
    const bl = this.data.physics.blink, B = this.blink, sc = this.data.physics.saccade, S = this.sacc;
    B.next -= dt;
    if (B.t < 0 && B.next <= 0) { B.t = 0; B.next = rnd(bl.every[0], bl.every[1]); }
    if (B.t >= 0) {
      B.t += dt; const t = B.t;
      B.v = t < bl.close ? t / bl.close : t < bl.close + bl.hold ? 1 : Math.max(0, 1 - (t - bl.close - bl.hold) / bl.open);
      if (t > bl.close + bl.hold + bl.open) { B.t = -1; B.v = 0; }
    }
    S.next -= dt;
    if (S.next <= 0) { S.next = rnd(sc.every[0], sc.every[1]); S.tx = rnd(-sc.x, sc.x); S.ty = rnd(-sc.y, sc.y); }
    const k = Math.min(1, dt / sc.time); S.x += (S.tx - S.x) * k; S.y += (S.ty - S.y) * k;
    for (const s of ['r', 'l']) {
      this.joints.get(`eyelid-upper-${s}`).add += 100 * B.v; this.joints.get(`eyelid-lower-${s}`).add += 35 * B.v;
      this.joints.get(`gaze-x-${s}`).add += S.x; this.joints.get(`gaze-y-${s}`).add += S.y;
    }
  }

  // world position of a bone's pivot
  pivot(id, out = V3()) { return out.setFromMatrixPosition(this.bones.get(id).bone.matrixWorld); }
}
