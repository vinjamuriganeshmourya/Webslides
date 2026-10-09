import type { CSSProperties, ReactNode } from 'react'
import { SlideBase } from '@/ui/SlideBase'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'

/**
 * THE STANDARD QUIZ SLIDE OF THIS DECK (user, 2026-10-07).
 *
 * Rebuilt from the pedagogy team's lesson plan, card 17 of
 * `prog_foundations_LP/17 - Loop Control Statements/…_student_view_new_design.html`
 * ("Classroom quiz on the portal"): its words and its layout only, nothing
 * kept from the kit's `QuizTimeSlide` that stood here before. Every quiz slide
 * in this deck uses this component.
 *
 * Layout, from the reference's own measurements on its 1280 x 720 frame: the
 * deep blue ground (a radial gradient from the top left), two soft glows and a
 * 6 x 5 dot grid; on the left the kicker with its short bar, the title, the
 * line under it and three numbered steps in translucent rows (x 64..567); on
 * the right a white quiz card tilted 3 degrees (x 732, y 150, 404 x 478) with
 * its pill, progress dashes, timer, two question lines, options A to D with B
 * chosen and ticked, and Submit; the mascot with the bulb at its lower right.
 *
 * Colours are the template's tokens; the reference's own values are those same
 * brand blues. The mascot is the reference's own drawing, copied as artwork.
 * The heading is Poppins (content rule 34) where the reference used Sora.
 *
 * Motion: one entrance, soft fades with an 12px rise, in reading order (left
 * block top to bottom, then the card, then the mascot). Nothing loops, nothing
 * bounces; during an instant jump everything is simply there.
 */
const KICKER = 'Quiz time'
const TITLE = 'Classroom Quiz'
const LINE = 'Time to check what you have learned so far'
const STEPS = ['Open the quiz on your portal', 'Answer every question on your own', 'We go through the answers together']

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

function In({ order, children, className = '', style }: { order: number; children: ReactNode; className?: string; style?: CSSProperties }) {
  const instant = useInstant()
  return (
    <div
      className={`sm-quiz-in ${className}`}
      style={{ ...style, animationDelay: instant ? '0ms' : `${200 + order * 160}ms`, animationDuration: instant ? '0ms' : '700ms' }}
    >
      {children}
    </div>
  )
}

if (typeof document !== 'undefined' && !document.querySelector('style[data-sm-quiz]')) {
  const el = document.createElement('style')
  el.dataset.smQuiz = ''
  el.textContent = `.sm-quiz-in { animation-name: sm-quiz-in; animation-timing-function: ${EASE}; animation-fill-mode: both; }
@keyframes sm-quiz-in { from { opacity: 0; transform: translate3d(0, 12px, 0); } to { opacity: 1; transform: none; } }`
  document.head.appendChild(el)
}

const MASCOT = "<defs><linearGradient id=\"body-ndtqz\" x1=\"0.18\" y1=\"0\" x2=\"0.7\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#5A93FF\"></stop><stop offset=\"46%\" stop-color=\"#0B5FFF\"></stop><stop offset=\"100%\" stop-color=\"#0C8E82\"></stop></linearGradient><radialGradient id=\"form-ndtqz\" cx=\"0.4\" cy=\"0.36\" r=\"0.68\"><stop offset=\"52%\" stop-color=\"#06215A\" stop-opacity=\"0\"></stop><stop offset=\"100%\" stop-color=\"#06215A\" stop-opacity=\"0.4\"></stop></radialGradient><radialGradient id=\"gloss-ndtqz\" cx=\"0.34\" cy=\"0.24\" r=\"0.55\"><stop offset=\"0%\" stop-color=\"#FFFFFF\" stop-opacity=\"0.7\"></stop><stop offset=\"60%\" stop-color=\"#FFFFFF\" stop-opacity=\"0\"></stop></radialGradient><linearGradient id=\"rim-ndtqz\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#EAF3FF\" stop-opacity=\"0.9\"></stop><stop offset=\"16%\" stop-color=\"#EAF3FF\" stop-opacity=\"0\"></stop></linearGradient><linearGradient id=\"orange-ndtqz\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#FFC46A\"></stop><stop offset=\"100%\" stop-color=\"#FF7A29\"></stop></linearGradient><filter id=\"soft-ndtqz\" x=\"-40%\" y=\"-30%\" width=\"180%\" height=\"180%\"><feDropShadow dx=\"0\" dy=\"12\" stdDeviation=\"13\" flood-color=\"#05204F\" flood-opacity=\"0.32\"></feDropShadow></filter></defs><ellipse cx=\"120\" cy=\"270\" rx=\"70\" ry=\"12\" fill=\"#05204F\" opacity=\"0.15\"></ellipse><g transform=\"matrix(-1,0,0,1,240,0)\"><path d=\"M80 176 C 72 190 68 202 70 214\" stroke=\"url(#body-ndtqz)\" stroke-width=\"17\" stroke-linecap=\"round\" fill=\"none\"></path><circle cx=\"69\" cy=\"216\" r=\"11\" fill=\"#33C6B7\"></circle><path d=\"M120 44 Q158 102 216 140 Q158 178 120 236 Q82 178 24 140 Q82 102 120 44 Z\" fill=\"url(#body-ndtqz)\" filter=\"url(#soft-ndtqz)\"></path><path d=\"M120 44 Q158 102 216 140 Q158 178 120 236 Q82 178 24 140 Q82 102 120 44 Z\" fill=\"url(#form-ndtqz)\"></path><path d=\"M120 44 Q158 102 216 140 Q158 178 120 236 Q82 178 24 140 Q82 102 120 44 Z\" fill=\"url(#gloss-ndtqz)\"></path><path d=\"M120 44 Q158 102 216 140 Q158 178 120 236 Q82 178 24 140 Q82 102 120 44 Z\" fill=\"url(#rim-ndtqz)\"></path><ellipse cx=\"96\" cy=\"98\" rx=\"15\" ry=\"9\" fill=\"#fff\" opacity=\"0.55\" transform=\"rotate(-22 96 98)\"></ellipse><g><path d=\"M92 118 q10 -5 20 -1\" stroke=\"#0A2A6B\" stroke-width=\"4\" stroke-linecap=\"round\" fill=\"none\" opacity=\"0.55\"></path><path d=\"M128 117 q10 -4 20 1\" stroke=\"#0A2A6B\" stroke-width=\"4\" stroke-linecap=\"round\" fill=\"none\" opacity=\"0.55\"></path><circle cx=\"104\" cy=\"134\" r=\"13\" fill=\"#fff\"></circle><circle cx=\"136\" cy=\"134\" r=\"13\" fill=\"#fff\"></circle><g style=\"transform: none; transform-origin: 123px 136px;\"><circle cx=\"107\" cy=\"136\" r=\"6.5\" fill=\"#0B1A2B\"></circle><circle cx=\"139\" cy=\"136\" r=\"6.5\" fill=\"#0B1A2B\"></circle><circle cx=\"109.5\" cy=\"133.5\" r=\"2.3\" fill=\"#fff\"></circle><circle cx=\"141.5\" cy=\"133.5\" r=\"2.3\" fill=\"#fff\"></circle></g><circle cx=\"88\" cy=\"150\" r=\"8\" fill=\"#FF8A3D\" opacity=\"0.22\"></circle><circle cx=\"152\" cy=\"150\" r=\"8\" fill=\"#FF8A3D\" opacity=\"0.22\"></circle><path d=\"M106 154 Q120 168 134 154\" stroke=\"#0B1A2B\" stroke-width=\"4.5\" stroke-linecap=\"round\" fill=\"none\"></path></g><g style=\"transform-origin: 160px 176px;\"><path d=\"M160 176 C 182 160 192 144 192 128\" stroke=\"url(#body-ndtqz)\" stroke-width=\"17\" stroke-linecap=\"round\" fill=\"none\"></path><circle cx=\"192\" cy=\"124\" r=\"11\" fill=\"#33C6B7\"></circle><g style=\"transform-origin: 192px 104px;\"><circle cx=\"192\" cy=\"102\" r=\"15\" fill=\"url(#orange-ndtqz)\"></circle><circle cx=\"188\" cy=\"98\" r=\"3.5\" fill=\"#fff\" fill-opacity=\"0.7\"></circle><rect x=\"185\" y=\"116\" width=\"14\" height=\"6\" rx=\"3\" fill=\"#0E9285\"></rect><line x1=\"211\" y1=\"102\" x2=\"218\" y2=\"102\" stroke=\"#FF8A3D\" stroke-width=\"3\" stroke-linecap=\"round\"></line><line x1=\"201.5\" y1=\"118.45448267190433\" x2=\"205\" y2=\"124.5166604983954\" stroke=\"#FF8A3D\" stroke-width=\"3\" stroke-linecap=\"round\"></line><line x1=\"182.5\" y1=\"118.45448267190434\" x2=\"179\" y2=\"124.51666049839541\" stroke=\"#FF8A3D\" stroke-width=\"3\" stroke-linecap=\"round\"></line><line x1=\"173\" y1=\"102\" x2=\"166\" y2=\"102\" stroke=\"#FF8A3D\" stroke-width=\"3\" stroke-linecap=\"round\"></line><line x1=\"182.5\" y1=\"85.54551732809567\" x2=\"179\" y2=\"79.4833395016046\" stroke=\"#FF8A3D\" stroke-width=\"3\" stroke-linecap=\"round\"></line><line x1=\"201.5\" y1=\"85.54551732809567\" x2=\"205\" y2=\"79.4833395016046\" stroke=\"#FF8A3D\" stroke-width=\"3\" stroke-linecap=\"round\"></line></g></g><path d=\"M38 59 Q38 70 49 70 Q38 70 38 81 Q38 70 27 70 Q38 70 38 59 Z\" fill=\"url(#orange-ndtqz)\" opacity=\"0.6224737606098643\" style=\"transform-origin: 38px 70px;\"></path><path d=\"M206 55 Q206 64 215 64 Q206 64 206 73 Q206 64 197 64 Q206 64 206 55 Z\" fill=\"url(#orange-ndtqz)\" opacity=\"0.5\" style=\"transform-origin: 206px 64px;\"></path><path d=\"M214 180 Q214 188 222 188 Q214 188 214 196 Q214 188 206 188 Q214 188 214 180 Z\" fill=\"url(#orange-ndtqz)\" opacity=\"0.5\" style=\"transform-origin: 214px 188px;\"></path></g>"

function QuizCard() {
  const bars = [150, 190, 120, 170]
  return (
    <div
      className="absolute rounded-[24px] bg-white px-[26px] pb-6 pt-[26px]"
      style={{ left: 732, top: 150, width: 404, transform: 'rotate(-3deg)', boxShadow: '0 30px 60px rgba(0,20,60,0.35)', color: colors.ink }}
    >
      <div className="flex h-[44px] items-center gap-3">
        <span className="rounded-full px-3 py-1 font-mono text-[13px] font-bold uppercase tracking-[0.12em]" style={{ background: colors.surface2, color: colors.brandDark }}>
          Quiz
        </span>
        <span className="flex items-center gap-[5px]">
          {[1, 1, 0, 0, 0].map((on, i) => (
            <i key={i} className="block h-[7px] w-[18px] rounded-full" style={{ background: on ? colors.brand : colors.line }} />
          ))}
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[14px] font-semibold" style={{ color: colors.muted }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2.5 2M9 2h6" />
          </svg>
          Timer
        </span>
      </div>
      <span className="mt-3 block h-[14px] w-[300px] rounded-full" style={{ background: colors.line }} />
      <span className="mt-2.5 block h-[14px] w-[210px] rounded-full" style={{ background: colors.line }} />
      <ol className="mt-5 flex flex-col gap-[10px]">
        {bars.map((w, i) => {
          const on = i === 1
          return (
            <li
              key={i}
              className="relative flex h-[59px] items-center gap-3 rounded-[14px] px-3.5"
              style={{
                background: on ? colors.surface2 : colors.surface,
                border: `1px solid ${on ? colors.brand : colors.line}`,
                boxShadow: on ? `0 0 0 3px ${colors.brand}24` : 'none',
              }}
            >
              <span
                className="grid h-[28px] w-[28px] place-items-center rounded-lg text-[14px] font-bold"
                style={on ? { background: colors.brand, color: colors.white } : { background: colors.white, color: colors.body, boxShadow: `inset 0 0 0 1px ${colors.line}` }}
              >
                {'ABCD'[i]}
              </span>
              <span className="block h-[10px] rounded-full" style={{ width: w, background: on ? `${colors.brand}55` : colors.line }} />
              {on && (
                <span className="absolute right-3.5 grid h-[26px] w-[26px] place-items-center rounded-full" style={{ background: colors.success }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
              )}
            </li>
          )
        })}
      </ol>
      <span className="mt-5 grid h-[46px] place-items-center rounded-full text-[16px] font-bold text-white" style={{ background: colors.brand, boxShadow: `0 10px 22px -10px ${colors.brand}` }}>
        Submit
      </span>
    </div>
  )
}

export function ClassroomQuiz({ lesson }: { lesson: string }): ReactNode {
  return (
    <SlideBase variant="brand" lesson={lesson} padded={false}>
      <div className="absolute inset-0 overflow-hidden text-white" style={{ background: `radial-gradient(120% 120% at 18% 0%, ${colors.brandDark}, #013A86 42%, ${colors.brandDeep})` }}>
        {/* the two soft glows and the dot grid */}
        <span aria-hidden className="absolute rounded-full" style={{ left: -120, top: -160, width: 520, height: 520, background: `radial-gradient(closest-side, ${colors.brand}55, transparent)` }} />
        <span aria-hidden className="absolute rounded-full" style={{ right: -140, bottom: -180, width: 560, height: 560, background: `radial-gradient(closest-side, ${colors.brand}40, transparent)` }} />
        <svg aria-hidden className="absolute" style={{ left: 1130, top: 360, opacity: 0.22 }} width="86" height="70">
          {Array.from({ length: 30 }, (_, k) => (
            <circle key={k} cx={2.6 + (k % 6) * 16} cy={2.6 + Math.floor(k / 6) * 16} r="2.6" fill="#fff" />
          ))}
        </svg>

        {/* the announcement, left */}
        <div className="absolute" style={{ left: 64, top: 161, width: 503 }}>
          <In order={0}>
            <p className="flex items-center gap-2.5 text-[15px] font-bold uppercase tracking-[0.14em]">
              <i className="block h-[3px] w-[24px] rounded-full bg-white" />
              {KICKER}
            </p>
          </In>
          <In order={1}>
            <h2 className="mt-4 font-heading text-[46px] font-extrabold leading-[1.15]">{TITLE}</h2>
          </In>
          <In order={2}>
            <p className="mt-5 text-[24px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {LINE}
            </p>
          </In>
          <ol className="mt-[34px] flex flex-col gap-[14px]">
            {STEPS.map((s, i) => (
              <In key={s} order={3 + i}>
                <li className="flex h-[64px] items-center gap-4 rounded-[16px] px-5 text-[21px]" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)' }}>
                  <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-white text-[17px] font-bold" style={{ color: colors.brandDark }}>
                    {i + 1}
                  </span>
                  {s}
                </li>
              </In>
            ))}
          </ol>
        </div>

        {/* the quiz card and the mascot, right */}
        <In order={6}>
          <QuizCard />
        </In>
        <In order={7}>
          <svg viewBox="0 0 240 300" className="absolute" style={{ left: 1064, top: 402, width: 190, height: 238 }} aria-hidden dangerouslySetInnerHTML={{ __html: MASCOT }} />
        </In>
      </div>
    </SlideBase>
  )
}
