import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { REDUCED, STILL } from '@/decks/figures/scene'
import { useInstant } from '@/motion/instant'
import { renderToStaticMarkup } from 'react-dom/server'
import { Character } from '@/decks/figures/cast/rig/Character'
import { poseAt, type Timeline } from '@/decks/figures/cast/rig/compose'
import { buildSkin, PRESETS, type CharacterConfig } from '@/decks/figures/cast/skins/config'
import { ACTIONS, EXPRESSIONS } from '@/decks/figures/cast/actions'
import type { Pose } from '@/decks/figures/cast/rig/channels'
import type { Skin } from '@/decks/figures/cast/skins/types'

/**
 * ONE SHARED WEBGL RENDERER FOR EVERY 3D ANALOGY SCENE OF THIS DECK (Session 9 review, 2026-11-10: real-time 3D
 * analogies, standing correction 13 / cloud course R10).
 *
 * Sixteen scenes, two per analogy slide, plus the picker's thumbnails would open more WebGL contexts than a browser
 * keeps alive (older ones are lost and go black). So there is ONE offscreen `WebGLRenderer`; each scene owns a plain
 * 2D canvas in the DOM and, every frame, the shared renderer draws the scene and the pixels are copied onto that
 * canvas. A scene only renders while its canvas is on screen.
 *
 * Usage, in a figure component:
 *   <ThreeStage w={470} h={390} step={step} setup={(s) => { ...add meshes to s.scene, set s.camera...; return (t, step) => { ...animate by time t (s)... } }} />
 *
 * `setup` runs once per mount with a fresh `THREE.Scene` and a perspective camera; it returns the per-frame update.
 * Loops run on wall-clock time `t` and never pause (R8.1). Held frames (`?still`, prefers-reduced-motion, an instant
 * render, a `.deck-thumb` picker thumbnail) draw ONE frame at `holdT` seconds and stop: nothing moving.
 */

/*
 * RESOLUTION FOLLOWS THE SCREEN (user, 2026-11-10: "it need to be dynamic, not fixed on one resolution, it need to
 * adapt to the screen size"). The slide is authored at 1280 x 720 and the deck zooms it to the screen (x1 in a small
 * window, x1.5 on 1080p, x3 on 4K), and the display adds its own devicePixelRatio. So nothing here is a fixed size:
 *  - each stage canvas is sized to its REAL device pixels (on-screen CSS size x devicePixelRatio), re-measured on
 *    resize, fullscreen and monitor (DPR) changes and every 0.5 s while it plays; capped at a 4K-class pixel count;
 *  - each Character Lab person (castSprite) is pre-rendered at the size it is actually DRAWN at on this screen
 *    (projected height x device pixels), and re-rendered when that grows or shrinks a lot (entering fullscreen,
 *    moving to a 4K monitor). A small background figure keeps small textures; a foreground one gets large ones.
 */
const MAX_PX = 3840 * 2160
function measureDensity(cv: HTMLCanvasElement, w: number, h: number): number {
  const r = cv.getBoundingClientRect()
  const zoom = r.width > 0 ? r.width / w : 1
  let k = Math.max(0.5, Math.min(4, zoom * (window.devicePixelRatio || 1)))
  if (w * h * k * k > MAX_PX) k = Math.sqrt(MAX_PX / (w * h))
  return Math.round(k * 20) / 20
}
/** the stage being built or drawn right now (set synchronously around setup() and update()) */
let CUR: { density: number; h: number; redraw: () => void } = { density: 1, h: 390, redraw: () => {} }

let shared: THREE.WebGLRenderer | null = null
function renderer(): THREE.WebGLRenderer {
  if (!shared) {
    shared = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: false, powerPreference: 'high-performance' })
    shared.setPixelRatio(1)
    shared.shadowMap.enabled = true
    shared.shadowMap.type = THREE.PCFShadowMap
    shared.outputColorSpace = THREE.SRGBColorSpace
    shared.toneMapping = THREE.ACESFilmicToneMapping
    shared.toneMappingExposure = 1.05
  }
  return shared
}

export type StageKit = { scene: THREE.Scene; camera: THREE.PerspectiveCamera; w: number; h: number; /** draw again (a held frame re-renders once late textures arrive) */ redraw: () => void }
export type Update = (t: number, step: number) => void

/** dispose every geometry, material and texture under a scene */
function disposeAll(o: THREE.Object3D) {
  o.traverse((n) => {
    /* pre-rendered frame textures a sprite keeps off-screen (castSprite): free them all, not only the one shown */
    for (const t of (n.userData?.textures as (THREE.Texture | null)[] | undefined) ?? []) t?.dispose()
    ;(n.userData?.dispose as (() => void) | undefined)?.()
    const m = n as THREE.Mesh
    m.geometry?.dispose?.()
    const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : []
    for (const mat of mats) {
      for (const v of Object.values(mat)) if (v instanceof THREE.Texture) v.dispose()
      mat.dispose()
    }
  })
}

export function ThreeStage({ w, h, step, setup, holdT = 6, className, style }: { w: number; h: number; step: number; setup: (s: StageKit) => Update; holdT?: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const stepRef = useRef(step)
  stepRef.current = step
  const instant = useInstant()

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    let dens = measureDensity(cv, w, h)
    const fit = () => {
      cv.width = Math.round(w * dens)
      cv.height = Math.round(h * dens)
    }
    fit()
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 200)
    let redrawHeld = () => {}
    const here = () => ({ density: dens, h, redraw: () => redrawHeld() })
    CUR = here()
    const update = setup({ scene, camera, w, h, redraw: () => redrawHeld() })
    const held = STILL || REDUCED || instant || !!cv.closest('.deck-thumb')

    /* the screen changed (window, fullscreen, monitor): re-measure, re-size the bitmap, redraw a held frame */
    const remeasure = () => {
      const k = measureDensity(cv, w, h)
      if (Math.abs(k - dens) / dens > 0.04) {
        dens = k
        fit()
        if (held) redrawHeld()
      }
    }
    const dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`)
    window.addEventListener('resize', remeasure)
    document.addEventListener('fullscreenchange', remeasure)
    dprQuery.addEventListener?.('change', remeasure)

    const draw = (t: number) => {
      CUR = here()
      camera.updateMatrixWorld()
      update(t, stepRef.current)
      const r = renderer()
      const pw = cv.width
      const ph = cv.height
      const size = r.getSize(new THREE.Vector2())
      if (size.x !== pw || size.y !== ph) r.setSize(pw, ph, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      r.render(scene, camera)
      ctx.clearRect(0, 0, pw, ph)
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(r.domElement, 0, 0, pw, ph)
    }

    let raf = 0
    let stopped = false
    if (held) {
      /* one frame, after layout settles; drawn again whenever a late texture (a Character Lab frame) arrives */
      raf = requestAnimationFrame(() => draw(holdT))
      redrawHeld = () => {
        if (!stopped) requestAnimationFrame(() => !stopped && draw(holdT))
      }
    } else {
      const t0 = performance.now()
      let lastCheck = 0
      const loop = (now: number) => {
        if (stopped) return
        if (now - lastCheck > 500) {
          lastCheck = now
          remeasure()
        }
        /* only while visible: on screen and in a shown slide */
        const rect = cv.getBoundingClientRect()
        const visible = !document.hidden && rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight
        if (visible) draw((now - t0) / 1000)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }
    return () => {
      stopped = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', remeasure)
      document.removeEventListener('fullscreenchange', remeasure)
      dprQuery.removeEventListener?.('change', remeasure)
      disposeAll(scene)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w, h, instant])

  return <canvas ref={ref} aria-hidden className={className} style={{ width: w, height: h, display: 'block', ...style }} />
}

/* ------------------------------------------------------------------ small shared modelling helpers */

export const mat = (color: THREE.ColorRepresentation, o: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.05, ...o })

/** a mesh that casts and receives shadows */
export function mesh(geo: THREE.BufferGeometry, m: THREE.Material, pos: [number, number, number] = [0, 0, 0]) {
  const o = new THREE.Mesh(geo, m)
  o.position.set(...pos)
  o.castShadow = true
  o.receiveShadow = true
  return o
}

/** the standard three-light rig: warm key with soft shadows, sky/ground fill, cool rim */
export function lightRig(scene: THREE.Scene, target: [number, number, number] = [0, 0, 0]) {
  scene.add(new THREE.HemisphereLight(0xeaf1ff, 0xd9cbb5, 0.9))
  const key = new THREE.DirectionalLight(0xfff3e2, 2.2)
  key.position.set(target[0] + 6, target[1] + 10, target[2] + 7)
  key.target.position.set(...target)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  key.shadow.camera.left = -10
  key.shadow.camera.right = 10
  key.shadow.camera.top = 10
  key.shadow.camera.bottom = -10
  key.shadow.bias = -0.0005
  key.shadow.radius = 4
  scene.add(key, key.target)
  const rim = new THREE.DirectionalLight(0xbcd2ff, 0.6)
  rim.position.set(target[0] - 8, target[1] + 5, target[2] - 6)
  scene.add(rim)
}

/**
 * A modelled 3D person (the user's choice, 2026-11-10: "3D figures"): rounded body, head with eyes, hair, arms and
 * legs as separate groups so a scene can animate them (`p.armL.rotation.x`, `p.legR.rotation.x`, `p.root.position`).
 * Colours follow the Character Lab presets: skin, hair, top, bottom. Height ~1.7 units, feet at y 0.
 */
export type Person = { root: THREE.Group; body: THREE.Group; head: THREE.Group; armL: THREE.Group; armR: THREE.Group; legL: THREE.Group; legR: THREE.Group }
export function person(o: { skin?: string; hair?: string; top?: string; bottom?: string; shoes?: string; long?: boolean; scale?: number } = {}): Person {
  const skin = mat(o.skin ?? '#E9B48F', { roughness: 0.7 })
  const hair = mat(o.hair ?? '#2B2230', { roughness: 0.8 })
  const top = mat(o.top ?? '#2D63FB')
  const bottom = mat(o.bottom ?? '#22346E')
  const shoes = mat(o.shoes ?? '#1B1F2E')
  const root = new THREE.Group()
  const body = new THREE.Group()
  root.add(body)
  const limb = (r: number, len: number, m: THREE.Material) => {
    const g = new THREE.Group()
    const c = mesh(new THREE.CapsuleGeometry(r, len, 6, 12), m, [0, -len / 2 - r, 0])
    g.add(c)
    return g
  }
  const legL = limb(0.085, 0.62, bottom)
  const legR = limb(0.085, 0.62, bottom)
  legL.position.set(-0.11, 0.86, 0)
  legR.position.set(0.11, 0.86, 0)
  for (const lg of [legL, legR]) lg.add(mesh(new THREE.BoxGeometry(0.16, 0.08, 0.26), shoes, [0, -0.83, 0.05]))
  const torso = mesh(new THREE.CapsuleGeometry(0.22, 0.42, 8, 16), top, [0, 1.14, 0])
  torso.scale.set(1, 1, 0.72)
  const armL = limb(0.065, 0.5, top)
  const armR = limb(0.065, 0.5, top)
  armL.position.set(-0.29, 1.4, 0)
  armR.position.set(0.29, 1.4, 0)
  for (const a of [armL, armR]) a.add(mesh(new THREE.SphereGeometry(0.07, 12, 12), skin, [0, -0.66, 0]))
  const head = new THREE.Group()
  head.position.set(0, 1.62, 0)
  head.add(mesh(new THREE.SphereGeometry(0.17, 24, 24), skin))
  const hairCap = mesh(new THREE.SphereGeometry(0.18, 24, 24, 0, Math.PI * 2, 0, Math.PI * (o.long ? 0.62 : 0.5)), hair, [0, 0.02, -0.01])
  head.add(hairCap)
  if (o.long) head.add(mesh(new THREE.CapsuleGeometry(0.13, 0.22, 6, 12), hair, [0, -0.12, -0.1]))
  const eye = mat('#1B1F2E', { roughness: 0.3 })
  head.add(mesh(new THREE.SphereGeometry(0.022, 10, 10), eye, [-0.06, 0.01, 0.155]), mesh(new THREE.SphereGeometry(0.022, 10, 10), eye, [0.06, 0.01, 0.155]))
  body.add(legL, legR, torso, armL, armR, head)
  if (o.scale) root.scale.setScalar(o.scale)
  return { root, body, head, armL, armR, legL, legR }
}

/* ------------------------------------------------------------------ Character Lab people inside a 3D scene */

/**
 * CHARACTER LAB PEOPLE IN 3D (user, 2026-11-10, Session 9 round 3: "replace the abstract human illustration with
 * Character Lab characters ... with detailed facial expressions").
 *
 * The Character Lab rig is an SVG (viewBox 400 x 600, feet at the bottom). A DOM overlay cannot sit BEHIND a desk or
 * a counter, so each character is a camera-facing plane INSIDE the scene (depth-tested, so furniture in front hides
 * it), textured from the rig: its loop is pre-rendered once, at mount, into `frames` images (`poseAt` sampled over
 * `loop` seconds) and the plane cycles them, the rig's own face and body motion played back. A held frame shows the
 * frame at `holdT`.
 *
 *   const c = castSprite({ config: PRESETS.meera, timeline: (t) => ({ seed: 3, idle: CAST_IDLE, expression: castClip('happy', 0, false) }),
 *                          loop: 4, frames: 16, height: 1.7, onReady: kit.redraw })
 *   c.object.position.set(x, 0, z); scene.add(c.object)      // feet at the object's origin
 *   ... in update(t): c.update(t, camera)
 *
 * `timeline(t)` returns the rig Timeline for loop time t (0..loop): gesture / expression clips from `ACTIONS` /
 * `EXPRESSIONS` via `castClip`; `pose` (optional) edits the sampled pose (a walk, a lean). Use `flip` to face left.
 * Keep `frames x characters` modest (a crowd: 8-12 frames each; identical configs share nothing, so vary seeds).
 */
export const CAST_IDLE = { breath: true, blink: true, saccades: true, sway: false, liveliness: 0.6 }
export function castClip(name: string, start: number, gesture = true) {
  const action = gesture ? ACTIONS[name] : EXPRESSIONS[name]
  return action ? { action, start } : undefined
}
export { PRESETS as CAST_PRESETS, type CharacterConfig, type Timeline, type Pose }

export type CastSprite = { object: THREE.Object3D; update: (t: number, camera: THREE.Camera) => void; ready: Promise<void> }

/** texture width for a person whose plane box is `boxPx` device pixels tall on screen: a little headroom, 32 px steps */
const spritePx = (boxPx: number) => Math.max(96, Math.min(1024, Math.ceil((boxPx / 1.5) * 1.15 / 32) * 32))

export function castSprite(o: {
  config: CharacterConfig
  /** role props the Character Lab does not have (apron, cap, hard hat), drawn in the rig's own frames */
  dress?: (s: Skin) => Skin
  timeline: (t: number) => Timeline
  pose?: (p: Pose, t: number) => void
  loop: number
  frames: number
  /** the character's height in scene units (feet to crown) */
  height: number
  flip?: boolean
  /** ignored since the adaptive build: the texture width follows the person's on-screen size (kept for callers) */
  px?: number
  /** turn to face the camera every frame (default true); false keeps the plane's own rotation */
  billboard?: boolean
  onReady?: () => void
}): CastSprite {
  const base = buildSkin(o.config)
  const skin = o.dress ? o.dress(base) : base
  let frameTex: (THREE.Texture | null)[] = []
  const blank = new THREE.Texture()
  const m = new THREE.MeshBasicMaterial({ map: blank, transparent: true, alphaTest: 0.35, side: THREE.DoubleSide, toneMapped: false })
  /* the rig's 400 x 600 box, scaled so the figure's height is `height` (the drawn body fills ~0.93 of the box) */
  const H = o.height / 0.93
  const geo = new THREE.PlaneGeometry(H / 1.5, H)
  geo.translate(0, H / 2, 0)
  const plane = new THREE.Mesh(geo, m)
  plane.visible = false
  plane.userData.textures = frameTex
  const root = new THREE.Group()
  root.add(plane)
  if (o.flip) plane.scale.x = -1
  /* a soft contact shadow on the floor */
  const sh = new THREE.Mesh(new THREE.CircleGeometry(o.height * 0.16, 24), new THREE.MeshBasicMaterial({ color: 0x0b1530, transparent: true, opacity: 0.18, depthWrite: false }))
  sh.rotation.x = -Math.PI / 2
  sh.position.y = 0.004
  sh.scale.set(1.25, 0.7, 1)
  root.add(sh)

  /* the stage this person lives on: its redraw (a held frame draws again once frames arrive) */
  const stageRedraw = CUR.redraw
  let dead = false
  plane.userData.dispose = () => {
    dead = true
  }
  let builtPx = 0
  let building = 0
  let resolveReady: () => void = () => {}
  const ready = new Promise<void>((res) => (resolveReady = res))

  const render = (k: number, px: number) =>
    new Promise<THREE.Texture | null>((res) => {
      const t = (k / o.frames) * o.loop
      const pose = poseAt(o.timeline(t), t)
      o.pose?.(pose, t)
      let svg = renderToStaticMarkup(<Character pose={pose} skin={skin} width={px} />)
      if (!svg.includes('xmlns=')) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
      const img = new Image()
      img.onload = () => {
        if (dead) return res(null)
        const c = document.createElement('canvas')
        c.width = px
        c.height = Math.round(px * 1.5)
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
        const tex = new THREE.CanvasTexture(c)
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 8
        res(tex)
      }
      img.onerror = () => res(null)
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
    })

  /* (re)build every frame at `px`, then swap the whole set in at once and free the old one */
  const build = (px: number) => {
    const id = ++building
    void Promise.all(Array.from({ length: o.frames }, (_, k) => render(k, px))).then((next) => {
      if (dead || id !== building) {
        for (const t of next) t?.dispose()
        return
      }
      const old = frameTex
      frameTex = next
      plane.userData.textures = frameTex
      builtPx = px
      building = 0
      m.map = frameTex.find(Boolean) ?? blank
      m.needsUpdate = true
      for (const t of old) t?.dispose()
      if (!plane.visible) {
        plane.visible = true
        resolveReady()
        o.onReady?.()
      }
      stageRedraw()
    })
  }

  /* the person's on-screen box height in device pixels: project feet and box top through the camera */
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  let lastMeasure = -1
  const measure = (camera: THREE.Camera) => {
    root.updateWorldMatrix(true, false)
    a.set(0, 0, 0)
    b.set(0, H, 0)
    root.localToWorld(a).project(camera)
    root.localToWorld(b).project(camera)
    return (Math.abs(b.y - a.y) / 2) * CUR.h * CUR.density
  }

  const camPos = new THREE.Vector3()
  return {
    object: root,
    ready,
    update(t, camera) {
      const now = performance.now()
      if (!building && (builtPx === 0 || now - lastMeasure > 500)) {
        lastMeasure = now
        const need = spritePx(measure(camera))
        /* first build, or the person got much bigger (fullscreen, 4K) or much smaller on screen */
        if (builtPx === 0 || need > builtPx * 1.2 || need < builtPx * 0.55) build(need)
      }
      if (frameTex.length) {
        const k = Math.floor((((t % o.loop) + o.loop) % o.loop) / o.loop * o.frames) % o.frames
        const tex = frameTex[k] ?? frameTex.find(Boolean) ?? null
        if (tex && m.map !== tex) {
          m.map = tex
          m.needsUpdate = true
        }
      }
      if (o.billboard !== false) {
        camera.getWorldPosition(camPos)
        root.worldToLocal(camPos)
        plane.rotation.y = Math.atan2(camPos.x, camPos.z)
      }
    },
  }
}
