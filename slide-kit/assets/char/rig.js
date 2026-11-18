/* Character rig runtime. No dependencies.
 *
 *   const rig = new CharRig.Rig(svgElement, rigJson);
 *   rig.set('elbow-r', 90);          // clamped to the joint's limits, returns the stored value
 *   rig.start();                     // or call rig.step(dt) from your own loop
 *
 * Pipeline per frame: animation -> IK -> procedural layers (breathing, blink, balance)
 * -> joint limits -> forward kinematics -> ground contact -> spring bones -> DOM.
 */
(function (global) {
  'use strict';
  const RAD = Math.PI / 180;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const wrap = a => { a = (a + 180) % 360; if (a < 0) a += 360; return a - 180; };
  const mul = (m, n) => [
    m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5],
  ];
  const at = (m, p) => [m[0] * p[0] + m[2] * p[1] + m[4], m[1] * p[0] + m[3] * p[1] + m[5]];
  const rotOf = m => Math.atan2(m[1], m[0]) / RAD;
  const IDENT = [1, 0, 0, 1, 0, 0];
  const CH = ['r', 'x', 'y', 'sx', 'sy'];
  const rnd = (a, b) => a + Math.random() * (b - a);

  class Rig {
    constructor(svg, data) {
      this.svg = svg; this.data = data;
      this.ground = data.meta.ground;
      this.physics = true; this.breathing = true;
      this.time = 0;

      /* bones, parents first (document order guarantees it) */
      this.bones = new Map(); this.order = [];
      for (const b of data.bones) {
        const bone = {
          id: b.id, parent: b.parent ? this.bones.get(b.parent) : null, pivot: b.pivot,
          el: svg.querySelector('#' + b.id), ch: { r: 0, x: 0, y: 0, sx: 0, sy: 0 }, ex: { r: 0, x: 0, y: 0, sx: 0, sy: 0 },
          world: IDENT, hidden: false, spring: null, follow: null, applied: null, shown: true,
        };
        this.bones.set(b.id, bone); this.order.push(bone);
      }

      /* joints */
      this.joints = new Map();
      for (const j of data.joints) {
        this.joints.set(j.id, {
          ...j, value: j.default, add: 0, final: j.default, anim: null,
          targets: j.targets.map(t => ({ bone: this.bones.get(t.bone), ch: t.ch, k: t.k })),
        });
      }

      /* springs */
      this.springs = [];
      for (const [id, s] of Object.entries(data.physics.springs)) {
        const bone = this.bones.get(id), joint = this.joints.get(s.joint);
        const k = joint.targets.find(t => t.bone === bone && t.ch === 'r').k;
        const sp = { ...s, bone, joint, k, tail: [bone.pivot[0] + s.dir[0] * s.length, bone.pivot[1] + s.dir[1] * s.length], p: null, v: [0, 0], off: 0 };
        bone.spring = sp; this.springs.push(sp);
        for (const t of joint.targets) if (t.bone !== bone && t.ch === 'r') t.bone.follow = { sp, k: t.k };
      }

      /* IK chains */
      this.ik = {};
      for (const [name, c] of Object.entries(data.ik)) {
        const up = this.bones.get(c.upper), lo = this.bones.get(c.lower), end = this.bones.get(c.end);
        const v1 = [lo.pivot[0] - up.pivot[0], lo.pivot[1] - up.pivot[1]], v2 = [end.pivot[0] - lo.pivot[0], end.pivot[1] - lo.pivot[1]];
        this.ik[name] = {
          name, up, lo, end, isLeg: !!c.joints.level,
          jUp: this.joints.get(c.joints.upper), jLo: this.joints.get(c.joints.lower),
          jTwist: c.joints.twist ? this.joints.get(c.joints.twist) : null, jLevel: c.joints.level ? this.joints.get(c.joints.level) : null,
          l1: Math.hypot(v1[0], v1[1]), l2: Math.hypot(v2[0], v2[1]),
          a1: Math.atan2(v1[1], v1[0]) / RAD, a2: Math.atan2(v2[1], v2[0]) / RAD,
          active: false, target: end.pivot.slice(), effector: end.pivot.slice(), reached: true, anim: null, pre: 0,
        };
        const fold = c.joints.twist && data.folds.find(f => f.flex === c.joints.lower);
        this.ik[name].kU = this.ik[name].jUp.targets[0].k; this.ik[name].kL = fold ? fold.k : this.ik[name].jLo.targets[0].k;
      }
      this.folds = data.folds.map(f => ({ bone: this.bones.get(f.bone), flex: this.joints.get(f.flex), twist: this.joints.get(f.twist), k: f.k }));
      this.scapula = data.scapula.map(s => ({ ...s, jShoulder: this.joints.get(s.shoulder), jClav: this.joints.get(s.clavicle), bClav: this.bones.get(s.clavicle), bArm: this.bones.get(s.upperArm), chain: Object.values(this.ik).find(c => c.up.id === s.upperArm) }));
      this.yaw = { ...data.yaw, joint: this.joints.get(data.yaw.joint), features: data.yaw.features.map(f => ({ ...f, bone: this.bones.get(f.bone) })) };
      this.masses = data.masses.map(m => ({ ...m, bone: this.bones.get(m.bone) }));
      this.feet = Object.entries(data.feet).map(([side, f]) => ({
        side, ...f, bone: this.bones.get(f.bone), chain: this.ik[f.chain], jHip: this.joints.get(f.hip), jKnee: this.joints.get(f.knee),
        shadowEl: svg.querySelector('#' + f.shadow), height: 0, weight: 1, mode: 'planted',
      }));
      this.root = this.bones.get('root');
      this.bal = { x: 0, v: 0, lean: 0, y: 0 };
      this.blink = { next: rnd(1, 3), t: -1, v: 0 };
      this.sacc = { next: rnd(0.5, 2), x: 0, y: 0, tx: 0, ty: 0 };
      this.anim = { name: null, t: 0, w: 0, rootY: 0 };
      this.frame = 0;
      this.step(0);
    }

    /* ---------- joint API ---------- */
    limits(id) { const j = this.joints.get(id); return [j.min, j.max]; }
    set(id, v) { const j = this.joints.get(id); if (!j) throw new Error('unknown joint ' + id); j.value = clamp(+v || 0, j.min, j.max); return j.value; }
    get(id) { return this.joints.get(id).value; }
    final(id) { return this.joints.get(id).final; }
    pose(values) { for (const [id, v] of Object.entries(values)) this.set(id, v); }
    reset() {
      for (const j of this.joints.values()) j.value = j.default;
      for (const c of Object.values(this.ik)) { c.active = false; c.target = c.end.pivot.slice(); }
      this.stop(); this.settle();
    }
    // hand presets: fist | open | relaxed, for 'r', 'l' or both
    hand(preset, sides = ['r', 'l']) {
      const p = this.data.presets[preset]; if (!p) throw new Error('unknown preset ' + preset);
      for (const s of sides) for (const [id, v] of Object.entries(p)) this.set(`${id}-${s}`, v);
    }
    // drop all spring and balance motion so the next frame starts at rest
    settle() { for (const s of this.springs) { s.p = null; s.v = [0, 0]; s.off = 0; } this.bal.v = 0; }

    /* ---------- IK API ---------- */
    setIK(name, on) {
      const c = this.ik[name]; c.active = !!on;
      if (on) c.target = at(c.end.parent.world, c.end.pivot);
      return c;
    }
    moveIK(name, x, y) { const c = this.ik[name]; c.target = [x, y]; return c; }

    /* ---------- animation ---------- */
    play(name) { this.anim.name = name; this.anim.t = 0; }
    stop() { this.anim.name = null; }

    _animate(dt) {
      const A = this.anim, on = !!A.name;
      A.w = clamp(A.w + (on ? dt : -dt) / 0.35, 0, 1);
      if (on) A.t += dt;
      for (const j of this.joints.values()) j.anim = null;
      for (const c of Object.values(this.ik)) c.anim = null;
      A.rootY = 0;
      if (A.w <= 0) { A.last = null; return; }
      if (on) A.last = A.name;
      const t = A.t, TAU = Math.PI * 2, set = (id, v) => { this.joints.get(id).anim = v; };
      if (A.last === 'wave') {
        const s = Math.sin(TAU * 1.7 * t), s2 = Math.sin(TAU * 1.7 * t - 1.1);
        set('shoulder-r', -128); set('arm-rotation-r', 180); set('elbow-r', 52 + 22 * s); set('wrist-r', -6 + 16 * s2);
        for (const f of ['index', 'middle', 'ring', 'pinky']) { set(`finger-${f}-prox-r`, 4); set(`finger-${f}-mid-r`, 6); set(`finger-${f}-dist-r`, 4); }
        set('thumb-meta-r', -8); set('thumb-prox-r', 2); set('thumb-dist-r', 2);
        set('head', 5 + 1.5 * s); set('spine-3', -2.5); set('spine-2', -1.5); set('lip-corner-r', 14); set('lip-corner-l', 14); set('cheek-r', 3); set('cheek-l', 3);
      } else if (A.last === 'walk') {
        const T = 1.05, ph = TAU * t / T;
        const lift = p => Math.pow(Math.max(0, Math.sin(p)), 0.85);
        const lr = lift(ph), ll = lift(ph + Math.PI);
        this.ik['foot-r'].anim = [-4 * lr, -50 * lr]; this.ik['foot-l'].anim = [4 * ll, -50 * ll];
        const sw = Math.sin(ph);
        set('shoulder-r', 4 + 9 * sw); set('shoulder-l', 4 - 9 * sw);
        set('elbow-r', 16 - 10 * sw); set('elbow-l', 16 + 10 * sw);
        set('pelvis', 2.2 * sw); set('spine-1', -1.6 * sw); set('spine-3', -1.2 * sw); set('head', 0.8 * sw);
        A.rootY = -5 * Math.abs(Math.cos(ph));
      }
    }

    /* ---------- solving ---------- */
    // base value of a joint this frame: slider value blended with any animation track
    _base(j) { return j.anim == null ? j.value : j.value + (j.anim - j.value) * this.anim.w; }

    _resolve() {
      for (const b of this.order) { const c = b.ch; c.r = c.x = c.y = c.sx = c.sy = 0; b.hidden = false; }
      for (const j of this.joints.values()) {
        j.final = clamp(this._base(j) + j.add, j.min, j.max);
        for (const t of j.targets) t.bone.ch[t.ch] += j.final * t.k;
      }
      for (const f of this.folds) f.bone.ch.r += f.k * f.flex.final * Math.cos(f.twist.final * RAD);
      for (const s of this.scapula) {
        const lift = clamp((-s.jShoulder.final - s.start) * s.ratio, 0, s.max);
        const e = clamp(s.jClav.final + lift, s.jClav.min, s.jClav.max) - s.jClav.final;
        s.bClav.ch.r += s.k * e; s.bArm.ch.r -= s.k * e; s.chain.pre = -s.k * e;
      }
      this._yaw();
      for (const b of this.order) for (const k of CH) b.ch[k] += b.ex[k];
    }

    // pseudo-3D head turn. Each feature has a rest offset x and a depth z in front of the turning
    // axis; it slides to x cos + z sin and narrows as it turns away. The joint runs to its full
    // range, the picture turns by `gain` of that, because a front drawing has no profile to show.
    _yaw() {
      const Y = this.yaw, psi = Y.joint.final * Y.gain;
      if (Math.abs(psi) < 0.01) return;
      const s = Math.sin(psi * RAD), c = Math.cos(psi * RAD), as = Math.abs(s);
      for (const f of Y.features) {
        const ch = f.bone.ch, far = f.x * s > 0;
        if (f.wrap) { if (!far) ch.x += -Math.sign(f.x) * f.wrap * as; continue; }
        if (f.ear && far) { const k = Math.abs(psi) / Y.earHide; if (k >= 1) f.bone.hidden = true; else ch.sx -= k; continue; }
        ch.x += f.x * c + f.z * s - f.x;
        ch.sx += (f.ear ? 1 + 0.5 * as : c * (far ? 1 - 0.2 * as : 1 + 0.08 * as)) - 1;
      }
    }

    _local(b, extraR = 0) {
      const c = b.ch, a = (c.r + extraR) * RAD, co = Math.cos(a), si = Math.sin(a), sx = 1 + c.sx, sy = 1 + c.sy;
      const m0 = co * sx, m1 = si * sx, m2 = -si * sy, m3 = co * sy, px = b.pivot[0], py = b.pivot[1];
      return [m0, m1, m2, m3, px + c.x - (m0 * px + m2 * py), py + c.y - (m1 * px + m3 * py)];
    }

    _fk(springs, dt) {
      for (const b of this.order) {
        const pw = b.parent ? b.parent.world : IDENT;
        const sp = b.spring;
        if (sp && springs) this._spring(sp, pw, dt);
        b.world = mul(pw, this._local(b, sp ? sp.off * sp.k : b.follow ? b.follow.sp.off * b.follow.k : 0));
      }
    }

    // a mass on the end of the bone, pulled towards where the bone would be if it were rigid
    _spring(sp, pw, dt) {
      const b = sp.bone, rigid = mul(pw, this._local(b)), piv = at(rigid, b.pivot), goal = at(rigid, sp.tail);
      if (!sp.p) { sp.p = goal.slice(); sp.v = [0, 0]; sp.off = 0; return; }
      const steps = Math.max(1, Math.min(6, Math.ceil(dt / (1 / 120)))), h = dt / steps, w = sp.stiffness / sp.mass, d = sp.damping;
      for (let i = 0; i < steps; i++) {
        sp.v[0] += (w * (goal[0] - sp.p[0]) - d * sp.v[0]) * h;
        sp.v[1] += (w * (goal[1] - sp.p[1]) - d * sp.v[1] + sp.gravity) * h;
        sp.p[0] += sp.v[0] * h; sp.p[1] += sp.v[1] * h;
        const dx = sp.p[0] - piv[0], dy = sp.p[1] - piv[1], len = Math.hypot(dx, dy) || 1;
        sp.p[0] = piv[0] + dx / len * sp.length; sp.p[1] = piv[1] + dy / len * sp.length;
      }
      // screen angle between the swinging mass and the rigid pose, as a joint offset
      const j = sp.joint, raw = wrap((Math.atan2(sp.p[1] - piv[1], sp.p[0] - piv[0]) - Math.atan2(goal[1] - piv[1], goal[0] - piv[0])) / RAD) / sp.k;
      // stay inside the spring's own limit and inside the joint's limits
      const off = clamp(raw, Math.max(-sp.limit, j.min - j.final), Math.min(sp.limit, j.max - j.final));
      if (off !== raw) {
        const g = Math.atan2(goal[1] - piv[1], goal[0] - piv[0]) + off * sp.k * RAD;
        sp.p = [piv[0] + Math.cos(g) * sp.length, piv[1] + Math.sin(g) * sp.length]; sp.v[0] *= 0.5; sp.v[1] *= 0.5;
      }
      sp.off = off;
    }

    // two-bone IK in the plane. Returns [upper, lower] screen rotations (degrees) for a target.
    _twoBone(c, target, cur1, cur2) {
      const pw = c.up.parent.world, j1 = at(pw, c.up.pivot), base = rotOf(pw);
      const dx = target[0] - j1[0], dy = target[1] - j1[1];
      const d = clamp(Math.hypot(dx, dy), Math.abs(c.l1 - c.l2) + 0.01, c.l1 + c.l2 - 0.01);
      const g = Math.atan2(dy, dx) / RAD;
      const alpha = Math.acos(clamp((c.l1 * c.l1 + d * d - c.l2 * c.l2) / (2 * c.l1 * d), -1, 1)) / RAD;
      const beta = Math.acos(clamp((c.l1 * c.l1 + c.l2 * c.l2 - d * d) / (2 * c.l1 * c.l2), -1, 1)) / RAD;
      const sols = [1, -1].map(s => {
        const r1 = wrap(g + s * alpha - base - c.a1);
        const r2 = wrap(-s * (180 - beta) - (c.a2 - c.a1));
        return [r1, r2];
      });
      // prefer the solution inside the limits, then the one nearest the current pose
      const cost = ([r1, r2]) => {
        const [u, l] = this._ikToJoint(c, r1, r2, true);
        return (Math.abs(u - clamp(u, c.jUp.min, c.jUp.max)) + Math.abs(l - clamp(l, c.jLo.min, c.jLo.max))) * 50 + Math.abs(wrap(r1 - cur1)) + Math.abs(wrap(r2 - cur2));
      };
      return cost(sols[0]) <= cost(sols[1]) ? sols[0] : sols[1];
    }
    // screen rotations -> joint values (unclamped when raw). The upper joint value is chosen
    // inside the limits when the same direction can be written two ways (for example -170 or +190).
    _ikToJoint(c, r1, r2, raw) {
      const mid = (c.jUp.min + c.jUp.max) / 2, u = mid + wrap((r1 - c.pre) / c.kU - mid);
      const l = c.jTwist ? Math.abs(r2) : r2 / c.kL;
      return raw ? [u, l] : [clamp(u, c.jUp.min, c.jUp.max), clamp(l, c.jLo.min, c.jLo.max), c.jTwist ? (r2 * c.kL >= 0 ? 0 : 180) : 0];
    }
    // world position of the chain's end for given joint values
    _ikEnd(c, u, l, tw) {
      const save1 = c.up.ch.r, save2 = c.lo.ch.r;
      c.up.ch.r = u * c.kU + c.pre; c.lo.ch.r = l * c.kL * (c.jTwist ? Math.cos(tw * RAD) : 1);
      const w1 = mul(c.up.parent.world, this._local(c.up)), w2 = mul(w1, this._local(c.lo));
      c.up.ch.r = save1; c.lo.ch.r = save2;
      return at(w2, c.end.pivot);
    }
    // solve a chain and return joint values that respect the limits, as close to the target as they allow
    _solve(c, target) {
      const [r1, r2] = this._twoBone(c, target, c.jUp.final * c.kU + c.pre, c.jLo.final * c.kL * (c.jTwist ? Math.cos(c.jTwist.final * RAD) : 1));
      let [u, l, tw] = this._ikToJoint(c, r1, r2, false);
      // limits moved it off target: walk each joint in turn towards the best reachable point (CCD)
      let best = this._ikEnd(c, u, l, tw), err = Math.hypot(best[0] - target[0], best[1] - target[1]);
      if (err > 0.5) {
        let step = 8;
        for (let it = 0; it < 28 && err > 0.3; it++) {
          let moved = false;
          for (const [du, dl] of [[step, 0], [-step, 0], [0, step], [0, -step]]) {
            const nu = clamp(u + du, c.jUp.min, c.jUp.max), nl = clamp(l + dl, c.jLo.min, c.jLo.max);
            const e = this._ikEnd(c, nu, nl, tw), ne = Math.hypot(e[0] - target[0], e[1] - target[1]);
            if (ne < err - 1e-4) { u = nu; l = nl; err = ne; best = e; moved = true; }
          }
          if (!moved) step /= 2;
        }
      }
      return { u, l, tw, end: best, err };
    }

    _groundAndBalance(dt) {
      const B = this.data.physics.balance, G = this.ground;
      // where each foot is before any correction
      for (const f of this.feet) {
        const lowest = Math.max(...f.sole.map(p => at(f.bone.world, p)[1]));
        f.height = G - lowest;
        const c = f.chain;
        f.mode = c.active || c.anim ? 'ik' : (Math.abs(this._base(f.jHip) - f.jHip.default) > 0.01 || Math.abs(this._base(f.jKnee) - f.jKnee.default) > 0.01 ? 'free' : 'planted');
        f.goal = f.mode === 'planted' ? f.ankle : f.mode === 'ik' ? (c.anim ? [f.ankle[0] + c.anim[0] * this.anim.w, f.ankle[1] + c.anim[1] * this.anim.w] : c.target) : null;
      }
      const anyHeld = this.feet.some(f => f.goal), lowestFree = Math.min(...this.feet.map(f => f.height));
      for (const f of this.feet) {
        const lift = f.goal ? f.ankle[1] - f.goal[1] : f.height - (anyHeld ? 0 : lowestFree);
        f.weight = clamp(1 - Math.max(0, lift) / 90, 0, 1);
      }
      // centre of mass against the centre of support
      let mx = 0, m = 0; for (const p of this.masses) { mx += at(p.bone.world, p.at)[0] * p.mass; m += p.mass; }
      const com = mx / m;
      let sw = 0, sx = 0;
      for (const f of this.feet) { const x = f.goal ? f.goal[0] : at(f.bone.world, f.ankle)[0]; sw += f.weight; sx += x * f.weight; }
      const support = sw > 0.05 ? sx / sw : com;
      const e = com - support, want = clamp(-B.gain * e, -B.max, B.max);
      this.bal.v += (B.stiffness * (want - this.bal.x) - B.damping * this.bal.v) * dt;
      this.bal.x += this.bal.v * dt;
      this.bal.lean = clamp(-B.lean * e, -4, 4);

      // height: held feet must be reachable, free feet must not hover or sink
      let y = this.anim.rootY * this.anim.w;
      const held = this.feet.filter(f => f.goal);
      this.root.ch.x = this.bal.x; this.root.ch.y = y; this._fk(false);
      if (held.length) {
        for (let it = 0; it < 3; it++) {
          let down = 0;
          for (const f of held) {
            const hip = at(f.chain.up.parent.world, f.chain.up.pivot), dx = f.goal[0] - hip[0], dy = f.goal[1] - hip[1], d = Math.hypot(dx, dy), max = f.chain.l1 + f.chain.l2 - 0.05;
            if (d > max && dy > 1) down = Math.max(down, (d - max) * d / dy);
          }
          if (down <= 0.01) break;
          y += down; this.root.ch.y = y; this._fk(false);
        }
      } else {
        const lowest = Math.max(...this.feet.flatMap(f => f.sole.map(p => at(f.bone.world, p)[1])));
        y += G - lowest; this.root.ch.y = y; this._fk(false);
      }
      this.bal.y = y;
      // legs that are held: solve them against the corrected pelvis and keep the sole level
      for (const f of held) {
        const c = f.chain, s = this._solve(c, f.goal);
        c.up.ch.r = s.u * c.kU; c.lo.ch.r = s.l * c.kL;
        c.jUp.final = s.u; c.jLo.final = s.l;
        c.effector = s.end; c.reached = s.err < 1;
        if (c.active && !c.reached) c.target = s.end.slice();
        const kA = c.jLevel.targets[0].k, shin = rotOf(c.up.parent.world) + c.up.ch.r + c.lo.ch.r;
        c.end.ch.r = clamp(-shin / kA, c.jLevel.min, c.jLevel.max) * kA;
      }
    }

    /* ---------- one frame ---------- */
    step(dt) {
      dt = Math.min(Math.max(dt, 0), 0.05);
      this.time += dt; this.frame++;
      const P = this.physics, phys = this.data.physics;
      this._animate(dt);
      for (const j of this.joints.values()) j.add = 0;
      for (const b of this.order) { const e = b.ex; e.r = e.x = e.y = e.sx = e.sy = 0; }

      // IK chains driven by a target write their joints (arms always; legs here only when physics is off)
      for (const c of Object.values(this.ik)) {
        const goal = c.anim ? [c.end.pivot[0] + c.anim[0] * this.anim.w, c.end.pivot[1] + c.anim[1] * this.anim.w] : c.active ? c.target : null;
        if (!goal || (c.isLeg && P)) continue;
        const s = this._solve(c, goal);
        if (c.active) { c.jUp.value = s.u; c.jLo.value = s.l; if (c.jTwist) c.jTwist.value = s.tw; }
        else { c.jUp.anim = s.u; c.jLo.anim = s.l; }
        c.effector = s.end; c.reached = s.err < 1;
        if (c.active && !c.reached) c.target = s.end.slice();
      }

      if (P) {
        if (this.breathing) {
          const br = phys.breathing, b = 0.5 - 0.5 * Math.cos(2 * Math.PI * this.time / br.period);
          const chest = this.bones.get('spine-3');
          chest.ex.y -= br.chestLift * b;
          this.joints.get('clavicle-r').add += br.shoulder * b; this.joints.get('clavicle-l').add += br.shoulder * b;
          this.bones.get('head').ex.y += br.head * b;
        }
        this._blink(dt);
        this.joints.get('spine-1').add += this.bal.lean;
      } else { this.bal.x = this.bal.v = this.bal.lean = 0; }

      this._resolve();
      this._fk(false);
      if (P) this._groundAndBalance(dt);
      else for (const s of this.springs) { s.p = null; s.off = 0; }
      // legs solved by the ground step also report their joint values
      if (P) for (const f of this.feet) if (f.goal && f.chain.active) { const c = f.chain; c.jUp.value = clamp(c.up.ch.r / c.kU, c.jUp.min, c.jUp.max); c.jLo.value = clamp(c.lo.ch.r / c.kL, c.jLo.min, c.jLo.max); }
      this._fk(P, dt);
      for (const c of Object.values(this.ik)) if (!c.active && !c.anim) c.effector = at(c.end.parent.world, c.end.pivot);
      this._flush();
    }

    _blink(dt) {
      const bl = this.data.physics.blink, B = this.blink, sc = this.data.physics.saccade, S = this.sacc;
      B.next -= dt;
      if (B.t < 0 && B.next <= 0) { B.t = 0; B.next = rnd(bl.every[0], bl.every[1]); }
      if (B.t >= 0) {
        B.t += dt;
        const t = B.t;
        B.v = t < bl.close ? t / bl.close : t < bl.close + bl.hold ? 1 : Math.max(0, 1 - (t - bl.close - bl.hold) / bl.open);
        if (t > bl.close + bl.hold + bl.open) { B.t = -1; B.v = 0; }
      }
      for (const s of ['r', 'l']) { this.joints.get(`eyelid-upper-${s}`).add += 100 * B.v; this.joints.get(`eyelid-lower-${s}`).add += 35 * B.v; }
      S.next -= dt;
      if (S.next <= 0) { S.next = rnd(sc.every[0], sc.every[1]); S.tx = rnd(-sc.x, sc.x); S.ty = rnd(-sc.y, sc.y); }
      const k = Math.min(1, dt / sc.time);
      S.x += (S.tx - S.x) * k; S.y += (S.ty - S.y) * k;
      for (const s of ['r', 'l']) { this.joints.get(`gaze-x-${s}`).add += S.x; this.joints.get(`gaze-y-${s}`).add += S.y; }
    }

    _flush() {
      const f = v => Math.round(v * 100) / 100;
      for (const b of this.order) {
        const c = b.ch, r = c.r + (b.spring ? b.spring.off * b.spring.k : b.follow ? b.follow.sp.off * b.follow.k : 0);
        let s = '';
        if (Math.abs(c.x) > 0.004 || Math.abs(c.y) > 0.004) s += `translate(${f(c.x)}px,${f(c.y)}px)`;
        if (Math.abs(r) > 0.004) s += `rotate(${f(r)}deg)`;
        if (Math.abs(c.sx) > 0.0004 || Math.abs(c.sy) > 0.0004) s += `scale(${Math.round((1 + c.sx) * 1e4) / 1e4},${Math.round((1 + c.sy) * 1e4) / 1e4})`;
        if (s !== b.applied) { b.el.style.transform = s; b.applied = s; }
        if (b.hidden === b.shown) { b.el.style.visibility = b.hidden ? 'hidden' : ''; b.shown = !b.hidden; }
      }
      for (const ft of this.feet) {
        if (!ft.shadowEl) continue;
        const pts = ft.sole.map(p => at(ft.bone.world, p)), cx = (pts[0][0] + pts[1][0]) / 2, h = Math.max(0, this.ground - Math.max(pts[0][1], pts[1][1]));
        const rest = (ft.sole[0][0] + ft.sole[1][0]) / 2, k = clamp(1 - h / 150, 0.35, 1);
        const s = `translate(${f(cx - rest)}px,0) scale(${f(k)})`;
        if (s !== ft.shadowApplied) { ft.shadowEl.style.transform = s; ft.shadowEl.style.opacity = f(clamp(1 - h / 80, 0.2, 1)); ft.shadowApplied = s; }
      }
    }

    /* ---------- helpers for hosts ---------- */
    // world position of a bone's pivot (canvas units), after the current pose
    pivot(id) { const b = this.bones.get(id); return at(b.parent ? b.parent.world : IDENT, [b.pivot[0] + b.ch.x, b.pivot[1] + b.ch.y]); }
    point(id, p) { return at(this.bones.get(id).world, p); }
    start() {
      let last = performance.now();
      const tick = now => { this.step((now - last) / 1000); last = now; if (this.onframe) this.onframe(this); this._raf = requestAnimationFrame(tick); };
      this._raf = requestAnimationFrame(tick);
    }
    halt() { cancelAnimationFrame(this._raf); }
  }

  global.CharRig = { Rig };
})(typeof window !== 'undefined' ? window : globalThis);
