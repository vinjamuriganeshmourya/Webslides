import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import type { SectionBreakerProps } from '@/slides/types'
import { BrandSlide, NextSessionSlide, SectionBreakerSlide, ThankYouSlide, WelcomeSlide } from '@/slides'
import { colors } from '@/design/tokens'
import { installSpecKeys } from '@/ui/foundations/keys'
import { revealEveryStep } from '@/motion/Stepper'
import { AgendaColumns, QuizCard } from '@/decks/figures/variants'
import { Takeaways } from '@/decks/figures/closing'
import { installEntrances } from '@/decks/figures/entrance'
import { MOTION_CSS } from '@/decks/figures/motion'
import { BOX_W, Card, SCENE_CSS, STILL, Stage, useBuild } from '@/decks/figures/scene'
import { ART_CSS, mountClayDefs } from '@/decks/figures/art'
import { NET_CSS, NoteBox, StepLabel } from '@/decks/figures/net/frames'
import { BulletLine, FX_CSS, FX_CSS_2, FX_CSS_3, LitFigure } from '@/decks/figures/net/fx'
import { VisualTable } from '@/decks/figures/net/vtable'
import { IsoAnalogy } from '@/decks/figures/iso/frames'
import { css as CUSTOM_CSS, slides as customSlides } from '@custom'
import deckData, { dims } from 'virtual:deck'
import { Icon, Rich, cellNode, cellTone } from './icon'
import { FigureView, figureSteps } from './figures'
import { DIAGRAM_CSS } from './Diagram'
import type { DeckData, Figure, Point, Slide } from './types'

/**
 * THE ENGINE: `deck.json` → the deck. Every layout is a frame the cloud sessions
 * already shipped (Card, LitFigure, VisualTable, IsoAnalogy, the standard frames),
 * so a rule fixed in a frame is fixed for every deck built from data.
 *
 * Motion: each content slide owns ONE build track (`useBuild`) that its figure and
 * its lit point both follow, so with auto animation off one press is one step and
 * with it on the slide plays itself (course R1, session 4's player).
 */

const D = deckData as DeckData
const M = D.meta
export const SESSION = M.title

/* a lead holding two TR sentences is written with "\n" between them and takes one line each (rule 36); the kit's lead
   <p> collapsed it, so Session 6 patched it per slide in custom CSS (engine fix 2026-11-06, Session 7) */
const LEAD_CSS = `p.text-body-lg { white-space: pre-line; }`

/* ── the deck's CSS and the global installers, once (as every cloud deck did) ── */
if (typeof document !== 'undefined' && !document.getElementById('cc-css')) {
  const el = document.createElement('style')
  el.id = 'cc-css'
  el.textContent = ART_CSS + SCENE_CSS + MOTION_CSS + NET_CSS + FX_CSS + FX_CSS_2 + FX_CSS_3 + (CUSTOM_CSS ?? '') + `[data-spec] .grid.items-end > .uppercase.tracking-wider { text-transform: none; letter-spacing: 0.01em }` + DIAGRAM_CSS + LEAD_CSS
  document.head.appendChild(el)
  if (STILL) document.documentElement.classList.add('cc-still')
  if (document.body) mountClayDefs()
  else document.addEventListener('DOMContentLoaded', mountClayDefs)
}
installSpecKeys()
revealEveryStep()
installEntrances()

export const meta: DeckMeta = {
  title: SESSION,
  course: M.course,
  lesson: SESSION,
  presenter: M.presenter ?? 'NxtWave Instructor',
  /* cloud R1: every move a transition, thumbnails, the step/slide switch hidden */
  player: { autoHideControls: true, smooth: true, thumbnails: true, hideModeSwitch: true },
}

const AGENDA = (M.agenda ?? []).map((title) => ({ title }))

/* ── helpers ── */
/* a point holding "\n" breaks there (Session 15 TR 23, 2026-11-18: the key ID on its own line instead of split at a
   hyphen); points without "\n" render exactly as before */
const pts = (points: Point[]) =>
  points.map((p) => ({ icon: p.icon ? <Icon name={p.icon} size={18} /> : undefined, text: p.text.includes('\n') ? <span style={{ whiteSpace: 'pre-line' }}><Rich text={p.text} /></span> : <Rich text={p.text} /> }))
/** every point whose step is the current press (a TR point split at a clause boundary shares one `at` and lights as one) */
const litOf = (points: Point[], step: number) => points.flatMap((p, i) => ((p.at ?? i + 1) === step ? [i] : []))

/* ── the content layouts ── */

function Points({ s }: { s: Extract<Slide, { layout: 'points' }> }) {
  const n = s.figure ? figureSteps(s.figure) : s.points.length
  const step = useBuild(n + 1)
  return (
    <LitFigure
      id={s.id}
      kicker={s.kicker}
      title={s.title}
      lead={s.lead}
      lesson={SESSION}
      points={pts(s.points) as { icon: ReactNode; text: ReactNode }[]}
      lit={STILL ? -1 : litOf(s.points, step)}
      pointsW={s.pointsW ?? 452}
      figH={s.figH ?? 380}
      figure={s.figure ? <Fit w={BOX_W - (s.pointsW ?? 452) - 24} h={s.figH ?? 380}><FigureView fig={s.figure} step={step} /></Fit> : null}
      note={s.note ? <NoteBox tone={s.note.tone === 'warn' ? colors.accent : colors.brand}><Rich text={s.note.text} /></NoteBox> : undefined}
    />
  )
}

/**
 * A figure wider or taller than the points layout's stage is scaled down to fit and centred, never clipped
 * (Session 6, 2026-11-06: five custom figures drawn wider than the space `pointsW` left them). A figure that
 * fits is untouched (scale 1). The inner box keeps the stage's size, so `w-full` figures still fill it.
 */
function Fit({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState({ k: 1, sw: w, sh: h })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const sw = Math.max(w, el.scrollWidth)
    const sh = Math.max(h, el.scrollHeight)
    const k = Math.min(1, w / sw, h / sh)
    if (Math.abs(k - fit.k) > 0.004 || sw !== fit.sw || sh !== fit.sh) setFit({ k, sw, sh })
  })
  const { k, sw, sh } = fit
  return (
    <div ref={ref} style={{ width: w, height: h, transformOrigin: '0 0', transform: k < 1 ? `translate(${(w - sw * k) / 2}px, ${(h - sh * k) / 2}px) scale(${k})` : undefined }}>
      {children}
    </div>
  )
}

function Lead({ s }: { s: Extract<Slide, { layout: 'lead' }> }) {
  const n = figureSteps(s.figure)
  const step = useBuild(n + 1)
  const w = s.figW ?? 760
  const h = s.figH ?? 360
  return (
    <Card id={s.id} kicker={s.kicker} title={s.title} lesson={SESSION}>
      <div className="flex flex-col items-center gap-5" style={{ width: BOX_W }}>
        {s.lead && (
          <p className="whitespace-pre-line text-center text-[20px] leading-snug" style={{ color: colors.ink, maxWidth: 900 }}>
            <Rich text={s.lead} />
          </p>
        )}
        <Stage w={w} h={h}>
          <FigureView fig={s.figure} step={step} w={w} h={h} />
        </Stage>
      </div>
    </Card>
  )
}

function Table({ s }: { s: Extract<Slide, { layout: 'table' }> }) {
  const t = s.table
  return (
    <Card id={s.id} kicker={s.kicker} title={s.title} lead={s.lead ? <Rich text={s.lead} /> : undefined} lesson={SESSION}>
      <div style={{ width: BOX_W }}>
        <VisualTable
          size={t.size ?? 16}
          highlight={t.highlight ?? []}
          ringCol={t.ringCol ?? []}
          logo={!!t.logo}
          bigIcons={t.bigIcons}
          columns={t.columns.map((c) => ({ label: c.label, weight: c.weight, bare: t.logo === 'bare' && !!c.icon?.startsWith('img:'), icon: c.icon ? <Icon name={c.icon} size={16} /> : undefined }))}
          rows={t.rows.map((r) => ({ icon: r.icon ? <Icon name={r.icon} size={18} /> : undefined, cells: r.cells.map((c, i) => cellNode(c, i)), tones: r.cells.map(cellTone) }))}
        />
        {s.note && (
          <div className="mt-4">
            <NoteBox tone={s.note.tone === 'warn' ? colors.accent : colors.brand}>
              <Rich text={s.note.text} />
            </NoteBox>
          </div>
        )}
      </div>
    </Card>
  )
}

/** R7.9: ONE capture, enlarged and centred, with its orange rings; one ring per press. */
function Screenshot({ s }: { s: Extract<Slide, { layout: 'screenshot' }> }) {
  const rings = s.rings ?? []
  const shown = useBuild(rings.length + 1)
  const [nw, nh] = dims[s.image] ?? [1600, 900]
  /* the content column starts under the title (~170) and must end above the player bar (~630) */
  const top = 172 + (s.lead ? 58 : 0) + (s.step ? 54 : 0)
  const estH = 628 - top - (s.note ? 72 : 0)
  /* MEASURED, not guessed (Session 14, 2026-11-17): the column really starts near 222 under the title, lower again
     when the lead or the step caption wraps, so the estimate let three captures run under the player bar (slides
     43/45/47; controls-clear looks at text, not images). Once, at mount, the capture's real top is read in slide
     units and its height capped so it (and any note under it) ends at 628. Runs before Card's centring effect, so
     Card measures the corrected block on the re-render it never sees: the capture only ever gets smaller. */
  const shotBox = useRef<HTMLDivElement>(null)
  const noteBox = useRef<HTMLDivElement>(null)
  const [fitH, setFitH] = useState<number | null>(null)
  useLayoutEffect(() => {
    const el = shotBox.current
    const sec = el?.closest('section')
    if (!el || !sec) return
    const sr = sec.getBoundingClientRect()
    const scale = sr.height / 720 || 1
    const t = (el.getBoundingClientRect().top - sr.top) / scale
    const noteH = noteBox.current ? noteBox.current.getBoundingClientRect().height / scale + 12 : 0
    const room = Math.floor(628 - t - noteH)
    if (room > 120 && room < estH) setFitH(room)
  }, [])
  const maxH = fitH ?? estH
  const k = Math.min(BOX_W / nw, maxH / nh)
  const w = Math.round(nw * k)
  const h = Math.round(nh * k)
  return (
    <Card id={s.id} kicker={s.kicker} title={s.title} lead={s.lead ? <Rich text={s.lead} /> : undefined} lesson={SESSION}>
      <div className="flex flex-col gap-3" style={{ width: BOX_W }}>
        {s.step && (
          <StepLabel>
            <span className="inline-flex items-center gap-2">
              <Icon name={s.step.icon} size={18} />
              <Rich text={s.step.text} />
            </span>
          </StepLabel>
        )}
        <div ref={shotBox} className="relative self-center overflow-hidden rounded-[10px] border border-line bg-white" style={{ width: w, height: h, boxShadow: '0 12px 30px -18px rgba(16,32,58,0.45)' }}>
          <img src={s.image} alt="" draggable={false} className="block select-none" style={{ width: w, height: h }} />
          {rings.map(([x, y, rw, rh, kind], i) =>
            kind === 'band' ? (
              /* a highlight band laid exactly on the rect, multiplied under the text so the glyphs stay dark and
                 crisp; nothing is drawn outside the rect, and nothing sits on a glyph */
              <span
                key={i}
                aria-hidden
                className="pointer-events-none absolute rounded-[4px]"
                style={{ left: x * k, top: y * k, width: rw * k, height: rh * k, background: `${colors.accent}52`, mixBlendMode: 'multiply', opacity: i < shown ? 1 : 0, transition: 'opacity 320ms cubic-bezier(0.22,1,0.36,1)' }}
              />
            ) : (
              <span
                key={i}
                aria-hidden
                className="pointer-events-none absolute rounded-[6px]"
                style={{ left: x * k - 4, top: y * k - 4, width: rw * k + 8, height: rh * k + 8, boxShadow: `0 0 0 3px ${colors.accent}`, opacity: i < shown ? 1 : 0, transition: 'opacity 320ms cubic-bezier(0.22,1,0.36,1)' }}
              />
            ),
          )}
        </div>
        {s.note && (
          <div ref={noteBox}>
            <NoteBox tone={s.note.tone === 'info' ? colors.brand : colors.accent}>
              <Rich text={s.note.text} />
            </NoteBox>
          </div>
        )}
      </div>
    </Card>
  )
}

function Analogy({ s }: { s: Extract<Slide, { layout: 'analogy' }> }) {
  const n = Math.max(figureSteps(s.everyday), figureSteps(s.concept))
  const step = useBuild(n + 1)
  return (
    <IsoAnalogy
      id={s.id}
      kicker={s.kicker}
      title={s.title}
      lesson={SESSION}
      bare
      h={s.h}
      everyday={{ label: s.title, scene: <FigureView fig={s.everyday} step={step} w={470} h={s.h ?? 380} /> }}
      cloud={{ label: s.title, scene: <FigureView fig={s.concept} step={step} w={470} h={s.h ?? 380} /> }}
    />
  )
}

function Steps({ s }: { s: Extract<Slide, { layout: 'steps' }> }) {
  const n = s.figure ? figureSteps(s.figure) : 0
  const step = useBuild(n + 1)
  const list = (
    <div className="flex flex-col gap-3" style={{ width: s.figure ? 520 : BOX_W }}>
      {s.steps.map((p, i) => (
        <div key={i} className="rounded-[14px] border border-line bg-white px-4 py-3" style={{ boxShadow: '0 6px 18px -14px rgba(16,32,58,0.35)' }}>
          <BulletLine kind={p.kind ?? (p.icon ? 'icon' : 'tick')} icon={p.icon ? <Icon name={p.icon} size={18} /> : undefined} size={17}>
            <Rich text={p.text} />
          </BulletLine>
        </div>
      ))}
    </div>
  )
  return (
    <Card id={s.id} kicker={s.kicker} title={s.title} lead={s.lead ? <Rich text={s.lead} /> : undefined} lesson={SESSION}>
      <div className="flex flex-col gap-4" style={{ width: BOX_W }}>
        <div className="flex items-center justify-between gap-6">
          {list}
          {s.figure && (
            <Stage w={560} h={340}>
              <FigureView fig={s.figure} step={step} w={560} h={340} />
            </Stage>
          )}
        </div>
        {s.note && (
          <NoteBox tone={s.note.tone === 'info' ? colors.brand : colors.accent}>
            <Rich text={s.note.text} />
          </NoteBox>
        )}
      </div>
    </Card>
  )
}

const LabBreaker = (p: SectionBreakerProps) => <SectionBreakerSlide {...p} />

function element(s: Slide): ReactNode {
  switch (s.layout) {
    case 'brand':
      return <BrandSlide greeting={s.greeting ?? 'Welcome!'} lesson={SESSION} />
    case 'title':
      return <WelcomeSlide minimal title={SESSION} lesson={SESSION} />
    case 'recap':
      return <Takeaways id={s.id} kicker="Recap" title={M.previous?.title ?? 'Recap'} lesson={SESSION} items={(M.previous?.items ?? []).map((title) => ({ title }))} art="/assets/takeaways/presenter.png" />
    case 'agenda':
      return <AgendaColumns kicker={SESSION} lesson={SESSION} items={AGENDA} />
    case 'breaker':
      return s.lab ? <LabBreaker kicker={s.kicker} title={s.title ?? ''} lesson={SESSION} /> : <SectionBreakerSlide index={s.index} title={s.title ?? M.agenda[s.index - 1]} lesson={SESSION} />
    case 'points':
      return <Points s={s} />
    case 'lead':
      return <Lead s={s} />
    case 'table':
      return <Table s={s} />
    case 'screenshot':
      return <Screenshot s={s} />
    case 'analogy':
      return <Analogy s={s} />
    case 'steps':
      return <Steps s={s} />
    case 'quiz':
      return <QuizCard lesson={SESSION} title={s.title ?? 'Quiz Time!'} />
    case 'takeaways':
      return <Takeaways id={s.id} lesson={SESSION} items={AGENDA} />
    case 'next':
      return <NextSessionSlide title={s.title} lesson={SESSION} titleSize={s.size} />
    case 'thanks':
      return <ThankYouSlide title={s.title} lesson={SESSION} />
    case 'custom': {
      const C = (customSlides as Record<string, (p: Record<string, unknown>) => ReactNode>)[s.component]
      if (!C) throw new Error(`[deck] slide ${s.id}: no custom slide "${s.component}" in custom/index.tsx`)
      return <C lesson={SESSION} {...(s.props ?? {})} />
    }
  }
}

const LABEL: Record<string, string> = { brand: 'Welcome', title: 'Session name', recap: 'Recap', agenda: 'Agenda', quiz: 'Quiz Time', takeaways: 'Key Takeaways', next: 'Next session', thanks: 'Thank You' }

/** The deck, with each slide's section: Opening until the first breaker, a breaker's title after it, Closing from the quiz on. */
function build(): SlideDef[] {
  let section = 'Opening'
  return D.slides.map((s) => {
    if (s.layout === 'breaker' && !s.lab) section = s.title ?? M.agenda[s.index - 1]
    if (s.layout === 'quiz') section = 'Closing'
    const title = 'title' in s && typeof s.title === 'string' ? s.title : undefined
    return {
      id: s.id,
      section: s.section ?? section,
      label: s.label ?? (s.layout === 'breaker' ? (s.lab ? 'Practical divider' : 'Section divider') : LABEL[s.layout] ?? title ?? s.id),
      transition: s.transition ?? (['brand'].includes(s.layout) ? 'fade' : ['title', 'breaker', 'quiz', 'next', 'thanks'].includes(s.layout) ? 'zoom' : undefined),
      notes: s.notes,
      element: element(s),
    } as SlideDef
  })
}

export const deck: SlideDef[] = build()
export type { Figure }
