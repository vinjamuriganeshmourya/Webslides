import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { REDUCED, STILL } from '@/decks/figures/scene'
import { useInstant } from '@/motion/instant'
import { renderToStaticMarkup } from 'react-dom/server'
import { Character } from '@/decks/figures/cast/rig/Character'
import { poseAtPure, type Timeline } from '@/decks/figures/cast/rig/compose'
import { dropLifeLane } from '@/decks/figures/cast/rig/life'
import { buildSkin, PRESETS, type CharacterConfig } from '@/decks/figures/cast/skins/config'
import type { Skin } from '@/decks/figures/cast/skins/types'
import { ACTIONS, EXPRESSIONS } from '@/decks/figures/cast/actions'
import type { Pose } from '@/decks/figures/cast/rig/channels'

/**
 * ENGINE COPY (promoted 2026-11-10 from Session 9 `custom/three-stage.tsx`, on the user's word: "save all the inputs
 * ... for the future slides, these need to be implemented too"). Every new deck imports it as `@/engine/three-stage`;
 * do not copy it into a session. Session 9 keeps its own frozen copy.
 *
 * REAL-TIME 3D ANALOGY SCENES (Session 9 review, 2026-11-10: standing corrections 13-14 / cloud course R10-R11).
 *
 * People in a scene are Character Lab characters via `castSprite` (rig pre-rendered into frame textures on a
 * depth-tested plane), never modelled primitives; `person()` below is kept only for Session 9's frozen scenes.
 *
 * Usage, in a figure component:
 *   <ThreeStage w={470} h={390} step={step} setup={(s) => { ...add meshes to s.scene, set s.camera...; return (t, step) => { ...animate by time t (s)... } }} />
 *
 * `setup` runs once per mount with a fresh `THREE.Scene` and a perspective camera; it returns the per-frame update.
 * Loops run on wall-clock time `t` and never pause (R8.1). Held frames (`?still`, prefers-reduced-motion, an instant
 * render, a `.deck-thumb` picker thumbnail) draw ONE frame at `holdT` seconds and stop: nothing moving.
 *
 * ============================================================================================================
 * HOW A FRAME REACHES THE SCREEN (low-end pass, user 2026-11-13: "lags and has rendering issues on low-end PCs";
 * nothing here changes a pixel, a size or a timing)
 * ============================================================================================================
 *
 * It used to be ONE offscreen renderer for the whole deck: every frame it drew a scene, and the pixels were copied
 * onto that scene's own 2D canvas with `drawImage`. That copy is a readback. To hand a WebGL canvas to a 2D canvas the
 * browser has to finish the GPU work first, so the main thread stopped and waited for it, twice a frame on an analogy
 * slide. Measured on a 3D slide with no GPU behind the browser (the case a blocklisted or absent driver gives): 4.8 s
 * of every 8 s was the main thread parked in that wait and 1.6 s more was the copy itself, and nothing else in the
 * deck could run meanwhile, so a key press took most of a second to register.
 *
 * A scene that is LIVE now owns its WebGL context, on its own canvas, and is drawn straight into it: no copy, no
 * wait, and the browser presents the frame when the GPU has it. There are never more than a few live scenes (two on
 * an analogy slide, four while one slide leaves and the next arrives), so the context limit that ruled this out for
 * the whole deck does not apply to them; `MAX_OWN` holds the line and anything past it falls back.
 *
 * A scene that is HELD (a `?still` URL, reduced motion, an instant render, a picker thumbnail) is drawn ONCE, and the
 * picker can ask for dozens at once, so held frames still go through the one shared renderer and the copy. That is
 * also the path the checks and the review screenshots have always used, pixel for pixel.
 *
 * `?gl=own | bitmap | copy` forces one path for every scene, held or live, so the three can be compared in one
 * browser on one machine without a rebuild (`bitmap` hands the shared renderer's frame over as an ImageBitmap; it is
 * the fallback when a scene cannot have a context of its own, and `copy` is the fallback when it cannot have that).
 *
 * A machine with no WebGL at all gets an empty card, one line in the console and a deck that still runs: each path
 * is tried in turn and none of them throws.
 */

type Present = 'own' | 'bitmap' | 'copy'

const FORCED: Present | null = (() => {
  if (typeof window === 'undefined') return null
  const v = new URLSearchParams(window.location.search).get('gl')
  return v === 'own' || v === 'bitmap' || v === 'copy' ? v : null
})()

const GL = { antialias: true, alpha: true, preserveDrawingBuffer: false, powerPreference: 'high-performance' as const }

/** every renderer is set up the same way, so a scene looks the same whichever one draws it */
function configure(r: THREE.WebGLRenderer): THREE.WebGLRenderer {
  r.setPixelRatio(1)
  r.shadowMap.enabled = true
  r.shadowMap.type = THREE.PCFShadowMap
  r.outputColorSpace = THREE.SRGBColorSpace
  r.toneMapping = THREE.ACESFilmicToneMapping
  r.toneMappingExposure = 1.05
  return r
}

/*
  A restored context comes back empty and three.js uploads everything again from what it still holds. A sprite frees
  each frame's canvas once it is on the GPU (see `castSprite`), so it has nothing to upload from: it watches this
  counter and builds its frames again.
*/
let contextEpoch = 0
const onRestored = () => {
  contextEpoch++
}
const watch = (c: { addEventListener?: (t: string, f: () => void) => void }) => c.addEventListener?.('webglcontextrestored', onRestored)

/* ── the shared renderer for held frames (and the `copy` fallback): draws, then the pixels are copied ── */
let shared: THREE.WebGLRenderer | null = null
function renderer(): THREE.WebGLRenderer {
  if (!shared) {
    shared = configure(new THREE.WebGLRenderer(GL))
    watch(shared.domElement)
  }
  return shared
}

/* ── the same, on an OffscreenCanvas, for the `bitmap` path: draws, then the frame is handed over whole ── */
let sharedOff: THREE.WebGLRenderer | null = null
const canBitmap = typeof OffscreenCanvas !== 'undefined' && typeof OffscreenCanvas.prototype.transferToImageBitmap === 'function'
function offRenderer(): THREE.WebGLRenderer {
  if (!sharedOff) {
    const c = new OffscreenCanvas(2, 2)
    sharedOff = configure(new THREE.WebGLRenderer({ ...GL, canvas: c as unknown as HTMLCanvasElement }))
    watch(c as unknown as HTMLCanvasElement)
  }
  return sharedOff
}

/* ── a context of its own per live canvas ── */
const MAX_OWN = 6
const own = new WeakMap<HTMLCanvasElement, THREE.WebGLRenderer>()
let ownCount = 0

/** what a canvas was first opened as: a canvas keeps one kind of context for its whole life */
const opened = new WeakMap<HTMLCanvasElement, Present>()

const sizeScratch = new THREE.Vector2()
function sizeTo(r: THREE.WebGLRenderer, pw: number, ph: number) {
  r.getSize(sizeScratch)
  if (sizeScratch.x !== pw || sizeScratch.y !== ph) r.setSize(pw, ph, false)
}

type Surface = {
  kind: Present
  /** the renderer that draws this scene: a sprite uploads its frames through it */
  gl: THREE.WebGLRenderer
  resize: (pw: number, ph: number) => void
  present: (scene: THREE.Scene, camera: THREE.Camera) => void
  /** `gone` when the canvas has left the document for good */
  close: (gone: boolean) => void
}

function openOwn(cv: HTMLCanvasElement): Surface | null {
  let r = own.get(cv)
  if (!r) {
    if (ownCount >= MAX_OWN) return null
    try {
      r = configure(new THREE.WebGLRenderer({ ...GL, canvas: cv }))
    } catch {
      return null
    }
    own.set(cv, r)
    ownCount++
    watch(cv)
  }
  const gl = r
  return {
    kind: 'own',
    gl,
    resize: (pw, ph) => sizeTo(gl, pw, ph),
    present: (scene, camera) => gl.render(scene, camera),
    close(gone) {
      /*
        The context goes when the CANVAS has gone. An effect that only runs again on the same canvas (a prop
        changed) finds its renderer where it left it; and since a cleanup can run before the node is detached,
        a canvas that still looks attached is looked at once more when this task is over.
      */
      const retire = () => {
        if (cv.isConnected || own.get(cv) !== gl) return
        own.delete(cv)
        ownCount--
        gl.dispose()
        gl.forceContextLoss()
      }
      if (gone) retire()
      else setTimeout(retire, 0)
    },
  }
}

function openBitmap(cv: HTMLCanvasElement): Surface | null {
  if (!canBitmap) return null
  const out = cv.getContext('bitmaprenderer')
  if (!out) return null
  let gl: THREE.WebGLRenderer
  try {
    gl = offRenderer()
  } catch {
    return null
  }
  let pw = 2
  let ph = 2
  return {
    kind: 'bitmap',
    gl,
    resize(w, h) {
      pw = w
      ph = h
      cv.width = w
      cv.height = h
    },
    present(scene, camera) {
      sizeTo(gl, pw, ph)
      gl.render(scene, camera)
      out.transferFromImageBitmap((gl.domElement as unknown as OffscreenCanvas).transferToImageBitmap())
    },
    close() {},
  }
}

function openCopy(cv: HTMLCanvasElement): Surface | null {
  const ctx = cv.getContext('2d')
  if (!ctx) return null
  let gl: THREE.WebGLRenderer
  try {
    gl = renderer()
  } catch {
    return null
  }
  let pw = 2
  let ph = 2
  return {
    kind: 'copy',
    gl,
    resize(w, h) {
      pw = w
      ph = h
      cv.width = w
      cv.height = h
    },
    present(scene, camera) {
      sizeTo(gl, pw, ph)
      gl.render(scene, camera)
      ctx.clearRect(0, 0, pw, ph)
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(gl.domElement, 0, 0, pw, ph)
    },
    close() {},
  }
}

const OPEN: Record<Present, (cv: HTMLCanvasElement) => Surface | null> = { own: openOwn, bitmap: openBitmap, copy: openCopy }

/** The way this canvas reaches the screen: the forced path, else its own context when live and the shared copy when held. */
function openSurface(cv: HTMLCanvasElement, held: boolean): Surface | null {
  const was = opened.get(cv)
  const order: Present[] = was ? [was] : FORCED ? [FORCED, 'bitmap', 'copy'] : held ? ['copy'] : ['own', 'bitmap', 'copy']
  for (const kind of order) {
    const s = OPEN[kind](cv)
    if (s) {
      opened.set(cv, kind)
      return s
    }
  }
  return null
}

export type StageKit = { scene: THREE.Scene; camera: THREE.PerspectiveCamera; w: number; h: number; /** draw again (a held frame re-renders once late textures arrive) */ redraw: () => void }
export type Update = (t: number, step: number) => void

/** dispose every geometry, material and texture under a scene */
function disposeAll(o: THREE.Object3D) {
  o.traverse((n) => {
    /* a part that owns more than three.js can see (a sprite: its pending frames, its place in the build queue) */
    ;(n.userData?.dispose as (() => void) | undefined)?.()
    /* pre-rendered frame textures a sprite keeps off-screen (a session's own sprite): free them all, not only the one shown */
    for (const t of (n.userData?.textures as (THREE.Texture | null)[] | undefined) ?? []) t?.dispose()
    const m = n as THREE.Mesh
    m.geometry?.dispose?.()
    const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : []
    for (const mat of mats) {
      for (const v of Object.values(mat)) if (v instanceof THREE.Texture) v.dispose()
      mat.dispose()
    }
  })
}

/** the renderer of the scene whose `update` is running: a sprite updated inside it learns where its frames upload */
let drawing: THREE.WebGLRenderer | null = null
/** the stage whose `setup` or `update` is running: its device pixels per slide px, and its height in slide px
    (a screen-sized sprite measures itself against these, see `castSprite` `adaptive`) */
let stageNow: { density: number; h: number; redraw: () => void; /** the camera's matrices are current (the scene has been drawn, or the stage sets them before `update`) */ cameraReady: boolean } = { density: 1, h: 390, redraw: () => {}, cameraReady: false }

/*
  A SCENE IS BUILT AFTER ITS SLIDE HAS APPEARED, ONE SCENE PER ANIMATION FRAME (low-end pass, 2026-11-13).

  Building a scene is the session's `setup`: its geometry, its drawn textures, and then the first render compiles
  its shaders. An analogy slide has two, and all of it used to run inside the effect of the commit that mounts the
  slide: 200 ms on a fast desktop, most of a second on a classroom PC, during which the slide being LEFT stayed on
  screen and the press looked ignored. The slide's own frame is cheap. So the effect only queues the scene; the
  slide mounts and its transition starts at once, and the scenes are built in the frames after it, one each, while
  their cards are still fading in. A picker full of thumbnails opens the same way: at once, filling in.
*/
const setups: (() => void)[] = []
let setupRaf = 0
function nextFrame(run: () => void) {
  setups.push(run)
  if (!setupRaf) setupRaf = requestAnimationFrame(runSetup)
}
function runSetup() {
  setupRaf = 0
  const run = setups.shift()
  try {
    run?.()
  } finally {
    if (setups.length) setupRaf = requestAnimationFrame(runSetup)
  }
}

/*
  A SLIDE THAT IS LEAVING BUILDS NO MORE PEOPLE. The deck announces every move (`deck:navigate`), and the scenes
  mounted at that moment are the ones on the slide going out: for the 0.6 s it takes to fade they go on playing
  with the frames they have, and the queue is the incoming slide's from the first frame.

  It is a time, not a flag. A presenter who steps forward and straight back gets the SAME slide instance back (its
  exit is cancelled, it is never unmounted), and a flag would leave its people unfinished for good. A scene still
  mounted `LEAVING_MS` after the move was not leaving after all, and builds on.
*/
const LEAVING_MS = 1500
const live = new Set<THREE.WebGLRenderer>()
const leftAt = new WeakMap<THREE.WebGLRenderer, number>()
const isLeaving = (gl: THREE.WebGLRenderer | null, now: number) => {
  const at = gl ? leftAt.get(gl) : undefined
  return at !== undefined && now - at < LEAVING_MS
}
if (typeof window !== 'undefined')
  window.addEventListener('deck:navigate', (e) => {
    const kind = (e as CustomEvent<{ kind?: string }>).detail?.kind
    if (kind !== 'slide' && kind !== 'replay') return
    const now = performance.now()
    for (const gl of live) leftAt.set(gl, now)
  })

/**
 * `sizing` is how the canvas's bitmap follows the screen. Both are sharp; they are two decisions, and a deck keeps the
 * one it was reviewed with.
 *   'supersample' (default; Session 10 correction 15): real device pixels, never below 2x, so a small screen
 *                 supersamples.
 *   'screen'      (Session 9, user 2026-11-10 "it need to adapt to the screen size"): real device pixels and no
 *                 more, down to 0.5x, in 0.05 steps, re-measured on resize, fullscreen and a monitor change.
 */
export type StageSizing = 'supersample' | 'screen'

/** a 4K-class pixel count: no canvas bitmap is made larger */
const STAGE_MAX_PX = 3840 * 2160
/** `sizing="screen"`: the canvas's real device pixels per slide px, as Session 9's stage measured them */
function screenDensity(cv: HTMLCanvasElement, w: number, h: number): number {
  const r = cv.getBoundingClientRect()
  const zoom = r.width > 0 ? r.width / w : 1
  let k = Math.max(0.5, Math.min(4, zoom * (window.devicePixelRatio || 1)))
  if (w * h * k * k > STAGE_MAX_PX) k = Math.sqrt(STAGE_MAX_PX / (w * h))
  return Math.round(k * 20) / 20
}

export function ThreeStage({ w, h, step, setup, holdT = 6, className, style, sizing = 'supersample' }: { w: number; h: number; step: number; setup: (s: StageKit) => Update; holdT?: number; className?: string; style?: React.CSSProperties; sizing?: StageSizing }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const stepRef = useRef(step)
  stepRef.current = step
  const instant = useInstant()

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    /* the loop's clock starts when the slide opens, not when its scene has finished being built */
    const t0 = performance.now()
    /*
      A SCREEN-SIZED STAGE IS MEASURED HERE, in the effect, where Session 9's stage measured it, and not a frame or
      two later when the scene is built. It matters in one case: a page opened directly on a slide with a held frame
      (`?still`, reduced motion). The deck applies its zoom after this effect, a held stage does not look again until
      the window changes, and so that stage draws at the size it had BEFORE the zoom. Measured a frame later the
      second scene of the slide saw the zoom and the first did not: one picture of the pair at 705 x 585 and the
      other at 470 x 390 on a 1080p screen, where the copy drew both at 470 x 390. A live scene measures again on
      its first frame either way, and a slide reached by a press is already zoomed when this runs.
    */
    const dens0 = sizing === 'screen' ? screenDensity(cv, w, h) : null
    let gone = false
    let close: (() => void) | null = null
    nextFrame(() => {
      if (!gone) close = start(cv, t0, dens0)
    })
    return () => {
      gone = true
      close?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w, h, instant, sizing])

  /** Open the canvas, build the scene, start drawing. Returns the cleanup, or null when nothing was opened. */
  const start = (cv: HTMLCanvasElement, t0: number, dens0: number | null): (() => void) | null => {
    const held = STILL || REDUCED || instant || !!cv.closest('.deck-thumb')
    const surface = openSurface(cv, held)
    if (!surface) {
      console.warn('[deck] 3D scene not drawn: this browser gave no WebGL context')
      return null
    }
    /*
      SHARP AT ANY SCREEN, UP TO 4K (Session 10 correction 15, FIG-35). The slide is authored at 1280x720 and the stage
      ZOOMS it to the screen (x1.5 on 1080p, x3 on 4K), so a canvas sized w*dpr was being stretched 1.5-3x and read soft.
      The bitmap is sized to the canvas's real device pixels (zoom x devicePixelRatio), never below 2x (supersampling
      on small screens), capped at 4K-class pixel counts, and re-sized when the window or fullscreen changes it.
    */
    const MAX_PX = STAGE_MAX_PX
    const screen = sizing === 'screen'
    const density = screen
      ? () => screenDensity(cv, w, h)
      : () => {
          const r = cv.getBoundingClientRect()
          const zoom = Math.max(r.width / w || 0, (cv as unknown as { currentCSSZoom?: number }).currentCSSZoom ?? 0, 1)
          let k = Math.max(2, Math.min(4, zoom * (window.devicePixelRatio || 1)))
          if (w * h * k * k > MAX_PX) k = Math.sqrt(MAX_PX / (w * h))
          return k
        }
    let dens = dens0 ?? density()
    const fit = () => surface.resize(Math.round(w * dens), Math.round(h * dens))
    fit()
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 200)
    let redrawHeld = () => {}
    let update: Update
    stageNow = { density: dens, h, redraw: () => redrawHeld(), cameraReady: false }
    try {
      update = setup({ scene, camera, w, h, redraw: () => redrawHeld() })
    } catch (e) {
      surface.close(false)
      throw e
    }
    if (surface.kind === 'own') live.add(surface.gl)

    /* the screen changed (window, fullscreen, monitor): re-measure and re-size the bitmap */
    const remeasure = () => {
      const k = density()
      if (Math.abs(k - dens) / dens > (screen ? 0.04 : 0.05)) {
        dens = k
        fit()
        if (screen && held) redrawHeld()
      }
    }
    let lastCheck = 0
    let drawn = false
    const draw = (t: number) => {
      if (!screen) {
        const now = performance.now()
        if (now - lastCheck > 500) {
          lastCheck = now
          remeasure()
        }
      }
      drawing = surface.gl
      stageNow = { density: dens, h, redraw: () => redrawHeld(), cameraReady: screen || drawn }
      /* a screen-sized sprite projects itself through the camera inside `update`: the camera's matrices are current */
      if (screen) camera.updateMatrixWorld()
      try {
        update(t, stepRef.current)
      } finally {
        drawing = null
      }
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      surface.present(scene, camera)
      drawn = true
    }
    const dprQuery = screen && typeof window.matchMedia === 'function' ? window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`) : null
    if (screen) {
      window.addEventListener('resize', remeasure)
      document.addEventListener('fullscreenchange', remeasure)
      dprQuery?.addEventListener?.('change', remeasure)
    }

    let raf = 0
    let stopped = false
    let io: IntersectionObserver | null = null
    /*
      THE SHADERS COMPILE WHILE THE SLIDE GOES ON. Left to the first render, three.js links every program of the scene
      and waits for each one, with the main thread, and the slide's transition, stopped until the last is done. Asked
      for ahead, the browser compiles them on its own threads and the scene draws its first frame when they are ready.
    */
    let compiled = false
    const whenCompiled = (then: () => void) => {
      const go = () => {
        if (compiled) return
        compiled = true
        if (!stopped) then()
      }
      /*
        Only where the browser can report a compile without waiting for it (KHR_parallel_shader_compile: Chrome and
        Edge on Windows have it). Anywhere else the first render links the programs as it always did, and nothing is
        asked of three.js that it would only log a warning about. And never for ever: a driver that does not report
        back gets the scene drawn the old way after a second and a half.
      */
      if (!surface.gl.extensions.has('KHR_parallel_shader_compile')) return go()
      setTimeout(go, 1500)
      try {
        void surface.gl.compileAsync(scene, camera).then(go, go)
      } catch {
        go()
      }
    }
    if (held) {
      /* one frame, when the scene can draw; drawn again whenever a late texture (a Character Lab frame) arrives */
      whenCompiled(() => {
        raf = requestAnimationFrame(() => !stopped && draw(holdT))
      })
      redrawHeld = () => {
        if (!stopped && compiled) requestAnimationFrame(() => !stopped && draw(holdT))
      }
    } else {
      /*
        ONLY WHILE VISIBLE: on screen and in a shown slide. The browser reports that when it changes; the loop used
        to ask for the canvas's rectangle on every frame, which makes the browser bring layout up to date in the
        middle of a frame whenever anything on the slide had moved.
      */
      let visible = true
      if (typeof IntersectionObserver !== 'undefined') {
        io = new IntersectionObserver((entries) => {
          visible = entries[entries.length - 1].isIntersecting
        })
        io.observe(cv)
      }
      const loop = (now: number) => {
        if (stopped) return
        if (screen && now - lastCheck > 500) {
          lastCheck = now
          remeasure()
        }
        if (visible && !document.hidden) draw((now - t0) / 1000)
        raf = requestAnimationFrame(loop)
      }
      whenCompiled(() => {
        raf = requestAnimationFrame(loop)
      })
    }
    return () => {
      stopped = true
      cancelAnimationFrame(raf)
      io?.disconnect()
      if (screen) {
        window.removeEventListener('resize', remeasure)
        document.removeEventListener('fullscreenchange', remeasure)
        dprQuery?.removeEventListener?.('change', remeasure)
      }
      live.delete(surface.gl)
      disposeAll(scene)
      surface.close(!cv.isConnected)
    }
  }

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
 * it), textured from the rig: its loop is rendered into `frames` images (`poseAt` sampled over `loop` seconds) and
 * the plane cycles them, the rig's own face and body motion played back. A held frame shows the frame at `holdT`.
 *
 *   const c = castSprite({ config: PRESETS.meera, timeline: (t) => ({ seed: 3, idle: CAST_IDLE, expression: castClip('happy', 0, false) }),
 *                          loop: 4, frames: 16, height: 1.7, onReady: kit.redraw })
 *   c.object.position.set(x, 0, z); scene.add(c.object)      // feet at the object's origin
 *   ... in update(t): c.update(t, camera)
 *
 * `timeline(t)` returns the rig Timeline for loop time t (0..loop): gesture / expression clips from `ACTIONS` /
 * `EXPRESSIONS` via `castClip`; `pose` (optional) edits the sampled pose (a walk, a lean). Use `flip` to face left.
 * `dress` edits the built skin (a white coat, a lanyard, an apron) so role clothing is drawn in the rig's own frames
 * and moves with it; `wide` widens the frame by that many rig units on each side, for an arm or a prop that reaches
 * past the 400-unit box. Keep `frames x characters` modest (a crowd: 8-12 frames each).
 *
 * USE THIS ONE. Sessions 9 to 12 each carried their own copy of it (`rigSprite`) for the `dress` hook; both hooks are
 * here now, and the copies do not have what follows.
 *
 * ============================================================================================================
 * WHAT A FRAME COSTS, AND WHO PAYS (low-end pass, 2026-11-13; the frames themselves are the same pixels)
 * ============================================================================================================
 *
 * One frame is a pose, an SVG string, an SVG document the browser parses and lays out, a raster with five clay
 * filters, and a texture. Measured at 14.6 ms each on a fast desktop; an analogy slide asks for four to five
 * hundred of them, and a classroom PC is four to six times slower. The session copies built every frame back to
 * back the moment the slide opened and kept building after it closed, so the slide ran at three frames a second and
 * the three slides after it stuttered for as long as the queue lasted (up to 34 s, measured). What changed:
 *
 *  - THE POSE. Each frame builds a fresh timeline, so the rig's springs were stepped again from t=0 for every
 *    frame. `poseAtPure` continues from the frame before; the numbers are the same (cast/rig/life.ts).
 *  - THE QUEUE. Frames are built by one scheduler for the whole deck, the frame that will be SHOWN soonest first, a
 *    little per animation frame and after that frame has painted, so the scene keeps drawing while its people fill
 *    in. A character shows its nearest earlier frame until the one it wants exists.
 *  - LEAVING. A scene that is disposed takes its sprites out of the queue. Nothing is built for a slide that has gone.
 *  - HELD FRAMES. A `?still` render or a picker thumbnail asks for the one frame it shows and no other.
 *  - MEMORY. A frame was a 2D canvas kept for the life of the slide beside the GPU texture made from it, and an SVG
 *    image the collector got round to eventually: 300 to 650 MB for one slide. Each frame is now uploaded as soon as
 *    it is drawn and its canvas and image are released at once.
 *  - THE SWAP. Changing `material.map` to another texture of the same kind needs no `needsUpdate`; setting it made
 *    three.js work out the material's program again on every frame change of every character.
 */
export const CAST_IDLE = { breath: true, blink: true, saccades: true, sway: false, liveliness: 0.6 }
export function castClip(name: string, start: number, gesture = true) {
  const action = gesture ? ACTIONS[name] : EXPRESSIONS[name]
  return action ? { action, start } : undefined
}
export { PRESETS as CAST_PRESETS, type CharacterConfig, type Timeline, type Pose, type Skin }

export type CastSprite = { object: THREE.Object3D; plane: THREE.Mesh; update: (t: number, camera: THREE.Camera) => void; /** resolved when the first frame is on the plane */ ready: Promise<void> }

/* ── the frame queue: one for the deck ── */

type Work = {
  /** the frame this sprite most needs built and how soon it will be shown (seconds), or null when it needs none */
  next: (now: number) => { k: number; due: number } | null
  /** build frame k; call `done` when it is on the GPU (or has failed), with the ms its image handler took */
  build: (k: number, done: (handlerMs: number) => void) => void
}

const works = new Set<Work>()
/* sprite frames whose image is loading (a frame's build is split by an image load, so it spans tasks) */
let inflight = 0
let pumpRaf = 0
/* how long an animation frame is taking on this machine, smoothed (ms), and when the last one began */
let interval = 1000 / 60
let lastFrame = 0
/* sprite frames started in the current animation frame */
let started = 0
/* what one sprite frame costs the main thread, smoothed (ms): the script on either side of the image load is
   measured, and the browser's own work on the image in between is taken as that much again and a half */
let costMs = 6
/*
  HOW MUCH OF AN ANIMATION FRAME THE QUEUE MAY TAKE: this share of it, in sprite frames at what one costs, and never
  fewer than one, so the queue always moves. On a fast machine that is one sprite frame in the slack of each
  16.7 ms and the scene never misses a beat; on a slow one it is still one, and the scene draws between every two.
  Where the scene itself is what is slow (software GL: a quarter of a second a frame whatever the queue does) the
  share is of that quarter second, three or four sprite frames started together, so the people do not take two
  minutes to fill in.
*/
const SHARE = 0.3
const MOST = 8

const after = typeof MessageChannel !== 'undefined' ? new MessageChannel() : null
if (after) after.port1.onmessage = () => pump()

/* for `perf-check.mjs`: how many sprites still have frames to build (a 3D slide has settled when this is 0) */
if (typeof window !== 'undefined') (window as unknown as { __DECK_SPRITES__?: () => number }).__DECK_SPRITES__ = () => works.size + inflight

function wake() {
  if (pumpRaf || !works.size || typeof requestAnimationFrame === 'undefined') return
  pumpRaf = requestAnimationFrame((now) => {
    pumpRaf = 0
    if (lastFrame) interval += (Math.min(1000, Math.max(16, now - lastFrame)) - interval) * 0.25
    lastFrame = now
    started = 0
    /* AFTER this frame has painted: the frame the room is about to see never waits for a sprite */
    if (after) after.port2.postMessage(0)
    else setTimeout(pump, 0)
  })
}

function pump() {
  for (;;) {
    const allowed = Math.max(1, Math.min(MOST, Math.floor((SHARE * interval) / costMs)))
    /* this animation frame has had its share: the rest waits for the next one */
    if (started >= allowed || inflight >= allowed) return wake()
    const now = performance.now()
    let best: Work | null = null
    let bestK = 0
    let bestDue = Infinity
    for (const w of works) {
      const n = w.next(now)
      if (n && n.due < bestDue) {
        best = w
        bestK = n.k
        bestDue = n.due
      }
    }
    /* nothing to build: the queue sleeps until a sprite asks (`wake` from its `update`), and forgets its pace */
    if (!best) {
      if (!inflight) lastFrame = 0
      return
    }
    started++
    inflight++
    let finished = false
    let sync = 0
    best.build(bestK, (handlerMs) => {
      if (finished) return
      finished = true
      inflight--
      costMs += (Math.max(1, 2.5 * (sync + handlerMs)) - costMs) * 0.2
      pump()
    })
    sync = performance.now() - now
  }
}

let lanes = 0

/** A picture's markup as a short key: two independent 32-bit hashes and its length (a chance collision is 1 in 2^64). */
function pictureKey(svg: string): string {
  let a = 0x811c9dc5
  let b = 0x9e3779b9
  for (let i = 0; i < svg.length; i++) {
    const c = svg.charCodeAt(i)
    a = Math.imul(a ^ c, 0x01000193)
    b = Math.imul(b + c, 0x85ebca6b) ^ (b >>> 15)
  }
  return `${a >>> 0}.${b >>> 0}.${svg.length}`
}

/** texture width for a person whose plane box is `boxPx` device pixels tall on screen: a little headroom, 32 px steps */
const adaptivePx = (boxPx: number, floor: number) => Math.max(floor, Math.min(1024, Math.ceil(((boxPx / 1.5) * 1.15) / 32) * 32))

/** One set of a sprite's frames at one texture size. */
type FrameSet = {
  px: number
  ph: number
  /* per frame: 0 not built, 1 being built, 2 built, 3 failed (never asked for again) */
  state: Uint8Array
  tex: (THREE.Texture | null)[]
  /* two frames with the same picture (a pose that holds, with the life layer off) share one texture; keyed by
     `pictureKey`, not by the 26 KB of markup itself, or a slide would hold 12 MB of strings to save a rare texture */
  pics: Map<string, THREE.Texture>
  /** frames neither built nor failed yet */
  left: number
}

export function castSprite(o: {
  config: CharacterConfig
  /** role clothing: edits the built skin, so the rig draws it in every frame */
  dress?: (s: Skin) => Skin
  timeline: (t: number) => Timeline
  pose?: (p: Pose, t: number) => void
  loop: number
  frames: number
  /** the character's height in scene units (feet to crown) */
  height: number
  flip?: boolean
  /** texture width in px for the rig's 400-unit box (height is 1.5x); default 480 so a person stays sharp on a 4K screen (FIG-35). Not used with `adaptive`. */
  px?: number
  /** extra rig units on each side of the 400-unit box */
  wide?: number
  /** turn to face the camera every frame (default true); false keeps the plane's own rotation */
  billboard?: boolean
  /** the soft contact shadow on the floor: its opacity (default 0.18), or false for none */
  shadow?: false | number
  /**
   * The frames are built at the size the person is DRAWN at on this screen (its box projected through the camera, in
   * device pixels), and built again when that changes a lot (fullscreen, a 4K projector): Session 9, "it need to adapt
   * to the screen size". `true` reads the stage it is on; a scene that measures its own stage passes `density` (device
   * px per slide px) and `stageH` (slide px). `floor` is the smallest texture width (96).
   */
  adaptive?: boolean | { density?: () => number; stageH?: number; floor?: number }
  /** called each time a frame arrives (a held stage is redrawn by itself; this is for anything else) */
  onReady?: () => void
}): CastSprite {
  const F = o.frames
  const wide = o.wide ?? 0
  const aspect = (400 + 2 * wide) / 600
  const base = buildSkin(o.config)
  const skin = o.dress ? o.dress(base) : base
  const lane = `sprite${++lanes}`
  const adaptive = o.adaptive ? (o.adaptive === true ? {} : o.adaptive) : null
  const stageRedraw = stageNow.redraw

  const frameSet = (basePx: number): FrameSet => {
    const px = Math.round((basePx * (400 + 2 * wide)) / 400)
    return { px, ph: Math.round(px / aspect), state: new Uint8Array(F), tex: new Array(F).fill(null), pics: new Map(), left: F }
  }
  /* the set the plane shows (and, until it is complete, the one being built); `next` is a set at a new size being
     built while a complete `cur` goes on showing. A screen-sized sprite has no set until it has measured itself. */
  let cur: FrameSet | null = adaptive ? null : frameSet(o.px ?? 480)
  let next: FrameSet | null = null
  /* the size of the last set that was COMPLETED (0 until one is): what "changed a lot" is measured against */
  let builtPx = 0

  const blank = new THREE.Texture()
  const m = new THREE.MeshBasicMaterial({ map: blank, transparent: true, alphaTest: 0.35, side: THREE.DoubleSide, toneMapped: false })
  /* the rig's 400 x 600 box, scaled so the figure's height is `height` (the drawn body fills ~0.93 of the box) */
  const H = o.height / 0.93
  const geo = new THREE.PlaneGeometry(H * aspect, H)
  geo.translate(0, H / 2, 0)
  const plane = new THREE.Mesh(geo, m)
  plane.visible = false
  const root = new THREE.Group()
  root.add(plane)
  if (o.flip) plane.scale.x = -1
  if (o.shadow !== false) {
    /* a soft contact shadow on the floor */
    const sh = new THREE.Mesh(new THREE.CircleGeometry(o.height * 0.16, 24), new THREE.MeshBasicMaterial({ color: 0x0b1530, transparent: true, opacity: typeof o.shadow === 'number' ? o.shadow : 0.18, depthWrite: false }))
    sh.rotation.x = -Math.PI / 2
    sh.position.y = 0.004
    sh.scale.set(1.25, 0.7, 1)
    root.add(sh)
  }

  let dead = false
  let epoch = contextEpoch
  let gl: THREE.WebGLRenderer | null = null
  /* the frame last asked for, and when: what "soonest" is measured from */
  let wantK = -1
  let seenAt = 0
  let firstT: number | null = null
  let live = false
  /* the frames whose images are loading, each with the queue's `done` for it */
  const loading = new Map<HTMLImageElement, (handlerMs: number) => void>()
  let resolveReady = () => {}
  const ready = new Promise<void>((res) => (resolveReady = res))

  const drop = (img: HTMLImageElement) => {
    img.onload = null
    img.onerror = null
    img.removeAttribute('src')
  }
  const release = (g: FrameSet) => {
    for (const t of new Set(g.pics.values())) {
      t.onUpdate = null
      const c = t.image as HTMLCanvasElement | undefined
      if (c && 'width' in c) c.width = c.height = 0
      t.dispose()
    }
    g.pics.clear()
  }
  const unfinished = (g: FrameSet | null) => !!g && g.left > 0
  /** the frame wanted, or until it exists the nearest one before it */
  const pick = (g: FrameSet, k: number) => {
    let tx = g.tex[k]
    if (!tx) for (let d = 1; d < F && !tx; d++) tx = g.tex[(k - d + F) % F] ?? null
    return tx
  }

  const settle = (g: FrameSet, k: number, t: THREE.Texture | null) => {
    g.tex[k] = t
    g.state[k] = t ? 2 : 3
    g.left--
    if (g === cur) {
      if (t && !plane.visible) {
        plane.visible = true
        resolveReady()
      }
      if (g.left === 0) builtPx = g.px
    } else if (g === next && (live ? g.left === 0 : k === wantK)) {
      /* the new size is ready (all of it, or for a held frame the one it shows): swap the whole set in at once */
      const old = cur
      cur = g
      next = null
      builtPx = g.px
      if (old) release(old)
      m.map = pick(g, Math.max(0, wantK)) ?? blank
    }
    if (t) {
      stageRedraw()
      o.onReady?.()
    }
    /* every frame built: the queue and the spring states have nothing more to do for this sprite */
    if (!unfinished(cur) && !unfinished(next)) {
      works.delete(work)
      dropLifeLane(lane)
    }
  }

  const work: Work = {
    next(now) {
      const g = next ?? cur
      if (dead || !g || wantK < 0) return null
      if (isLeaving(gl, now)) return null
      /* a scene that has stopped drawing (off screen) waits behind every scene that has not */
      const stale = now - seenAt > 400 ? 1000 : 0
      if (g.state[wantK] === 0) return { k: wantK, due: stale }
      /* held: the one frame shown, and no other */
      if (!live) return null
      const gap = o.loop / F
      for (let d = 1; d < F; d++) {
        const k = (wantK + d) % F
        if (g.state[k] === 0) return { k, due: stale + d * gap }
      }
      return null
    },
    build(k, done) {
      const g = (next ?? cur)!
      g.state[k] = 1
      let svg: string
      try {
        const t = (k / F) * o.loop
        const pose = poseAtPure(o.timeline(t), t, lane)
        o.pose?.(pose, t)
        svg = renderToStaticMarkup(<Character pose={pose} skin={skin} width={g.px} />)
      } catch (e) {
        /* a session's `timeline` or `pose` threw: this frame is skipped, the queue goes on */
        console.error('[deck] sprite frame failed', e)
        settle(g, k, null)
        return done(0)
      }
      if (!svg.includes('xmlns=')) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
      if (wide) svg = svg.replace(/<svg([^>]*?)viewBox="0 0 400 600"([^>]*?)width="[^"]*"([^>]*?)height="[^"]*"/, `<svg$1viewBox="${-wide} 0 ${400 + 2 * wide} 600"$2width="${g.px}"$3height="${g.ph}"`)
      const picture = pictureKey(svg)
      const same = g.pics.get(picture)
      if (same) {
        settle(g, k, same)
        return done(0)
      }
      const img = new Image()
      loading.set(img, done)
      const began = () => performance.now()
      const over = (t0: number) => {
        loading.delete(img)
        done(performance.now() - t0)
      }
      /* the set this frame was for may have been dropped while its image loaded (a new size, a restored context) */
      const wanted = () => !dead && (g === cur || g === next) && g.state[k] === 1
      img.onerror = () => {
        const t0 = began()
        drop(img)
        if (wanted()) settle(g, k, null)
        over(t0)
      }
      img.onload = () => {
        const t0 = began()
        if (!wanted()) {
          drop(img)
          return over(t0)
        }
        const c = document.createElement('canvas')
        c.width = g.px
        c.height = g.ph
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
        const tx = new THREE.CanvasTexture(c)
        tx.colorSpace = THREE.SRGBColorSpace
        tx.anisotropy = 8
        /*
          ON THE GPU NOW, AND THE COPIES RELEASED. Left to three.js the upload happens inside the draw of the first
          frame that shows it, so that draw pays for it; and the canvas and the SVG image stayed in memory beside
          the texture for as long as the slide was open. `onUpdate` runs when the upload is done.
        */
        tx.onUpdate = () => {
          tx.onUpdate = null
          c.width = 0
          c.height = 0
          drop(img)
        }
        g.pics.set(picture, tx)
        try {
          gl?.initTexture(tx)
        } catch {
          /* left for the draw to upload */
        }
        settle(g, k, tx)
        over(t0)
      }
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
    },
  }

  /* a restored context holds none of the frames, and their canvases are gone: start again */
  const rebuild = () => {
    epoch = contextEpoch
    const size = (next ?? cur)?.px
    if (cur) release(cur)
    if (next) release(next)
    next = null
    builtPx = 0
    cur = size ? { ...frameSet(0), px: size, ph: Math.round(size / aspect) } : null
    m.map = blank
    plane.visible = false
    if (!dead) works.add(work)
  }

  /*
    THE SCREEN-SIZED SPRITE'S RULE, as Session 9 wrote it: measure the person's box on screen; build at that size;
    and once a set is complete, look again every half second and build a new one when the need has grown past 1.2x
    or shrunk below 0.55x of what was built, the old set showing until the new one is whole.

    One thing differs from that copy, and it does not change the size a person ends up with. The copy built a whole
    first set before it looked again, and that first look can be wrong in two ways: on a stage that does not set the
    camera's matrices before `update` (every stage but Session 9's) it comes before the scene has ever been drawn,
    through a camera that is not yet where it will be; and in a HELD frame it comes before the scene's own first
    update has placed things (a camera move, a walk), which the copy corrected only when its first set happened to
    take more than half a second to build (it did for 34 and 48 frames, measured: Session 9 slides 36 and 39 rebuilt
    at 160 px after 128). In both cases the second look is taken here on the very next update, by the same
    1.2x / 0.55x rule against the size being built; and a first set started again is simply started again, there
    being nothing complete to keep on screen meanwhile. A LIVE scene on Session 9's stage looks again only once its
    first set is complete, exactly as the copy did.
  */
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  let lastMeasure = -1
  let looks = 0
  let provisional = false
  const measure = (camera: THREE.Camera) => {
    root.updateWorldMatrix(true, false)
    a.set(0, 0, 0)
    b.set(0, H, 0)
    root.localToWorld(a).project(camera)
    root.localToWorld(b).project(camera)
    const density = adaptive?.density ? adaptive.density() : stageNow.density
    return (Math.abs(b.y - a.y) / 2) * (adaptive?.stageH ?? stageNow.h) * density
  }
  const adapt = (camera: THREE.Camera) => {
    looks++
    if (next) return
    const first = cur === null
    const filling = builtPx === 0
    const now = performance.now()
    if (!first && (filling ? !(looks === 2 && (provisional || !live)) : now - lastMeasure <= 500)) return
    lastMeasure = now
    const need = adaptivePx(measure(camera), adaptive?.floor ?? 96)
    if (first) {
      provisional = !stageNow.cameraReady
      cur = frameSet(need)
      return
    }
    const built = filling ? cur!.px : builtPx
    if (!(need > built * 1.2 || need < built * 0.55)) return
    if (filling) {
      release(cur!)
      cur = frameSet(need)
      m.map = blank
      plane.visible = false
    } else {
      next = frameSet(need)
    }
    works.add(work)
  }

  plane.userData.dispose = () => {
    dead = true
    works.delete(work)
    dropLifeLane(lane)
    /* whatever is still loading is dropped, and the queue told, or it would wait on these for ever */
    const waiting = [...loading]
    loading.clear()
    for (const [img, done] of waiting) {
      drop(img)
      done(0)
    }
    m.map = null
    if (cur) release(cur)
    if (next) release(next)
    blank.dispose()
  }

  works.add(work)

  const camPos = new THREE.Vector3()
  return {
    object: root,
    plane,
    ready,
    update(t, camera) {
      if (dead) return
      if (drawing) gl = drawing
      if (epoch !== contextEpoch) rebuild()
      const k = Math.floor((((t % o.loop) + o.loop) % o.loop) / o.loop * F) % F
      wantK = k
      seenAt = performance.now()
      if (firstT === null) firstT = t
      else if (!live && t !== firstT) live = true
      if (adaptive) adapt(camera)
      if (works.has(work)) wake()
      const tx = cur ? pick(cur, k) : null
      if (tx && m.map !== tx) m.map = tx
      if (o.billboard !== false) {
        camera.getWorldPosition(camPos)
        root.worldToLocal(camPos)
        plane.rotation.y = Math.atan2(camPos.x, camPos.z)
      }
    },
  }
}
