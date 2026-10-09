import { useRef, type RefObject } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Ask, Show, sentences } from './pieces'
import { StepCaption } from './trace'
import { CallCode, IoBox, TokenRing, usePhase } from './call'
import { GATE, HOME, MapsPhone, useTyped, type MapsState } from './Maps'
import { PHONE_LIFT } from './Phone'
import { fromEl, useFly } from './slots'
import { SPEC } from './spec'

/**
 * THE TWO HOOKS OF PF 23, both on Teja's phone (spec note 2).
 *
 *   H1  The swap button. No code and no code words anywhere on the card (its
 *       must_not); the last press draws the shape of today's idea: two slots
 *       in a row, filled in order, 1st and 2nd.
 *   H2  Your location, every time? The same phone, the start already filled
 *       by the app; then the long program, the short one with defaults.
 */

/* ================================================================== H1 */

const H1 = SPEC.H1

/** One place slot of H1's last press: the box, the place in it (flown out of the phone), its number under it. */
function PlaceSlot({ value, n, from, delay }: { value: string; n: string; from: RefObject<HTMLElement | null>; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useFly(ref, fromEl(from), delay)
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="grid h-[84px] w-[230px] place-items-center rounded-2xl" style={{ background: colors.surface, border: `2.5px solid ${colors.brand}` }}>
        <span ref={ref} className="inline-block whitespace-nowrap rounded-lg bg-white px-3 py-1 text-[26px] font-bold" style={{ color: colors.ink, boxShadow: `inset 0 0 0 2px ${colors.line}` }}>
          {value}
        </span>
      </div>
      <span className="rounded-md px-3 py-0.5 font-mono text-[22px] font-bold" style={{ background: colors.brand, color: colors.white }}>
        {n}
      </span>
    </div>
  )
}

/**
 * THE SWAP BUTTON. Spec card H1, six presses. 1: the phone, the route from the
 * gate to Ameerpet. 2: the typing replayed, the bottom box first; the route is
 * the same. 3: a finger over the swap button, which pulses once. 4: the turn,
 * one movement: the names trade boxes and the route redraws the other way, no
 * warning. 5: the question. 6: the phone swapped back (Teja taps it again),
 * then the two boxes slide out into one row as two slots, 1st and 2nd.
 */
export function SwapHook() {
  const beat = useBeats(6)
  const p2 = usePhase(beat, 2, [250, 900, 900])
  const p6 = usePhase(beat, 6, [150, 1000])
  const endTyped = useTyped(HOME, beat === 2 && p2 >= 1)
  const startTyped = useTyped(GATE, beat === 2 && p2 >= 2)
  const startRef = useRef<HTMLSpanElement>(null)
  const endRef = useRef<HTMLSpanElement>(null)
  const swapped = beat === 4 || beat === 5 || (beat === 6 && p6 < 1)
  const s: MapsState = beat === 2 && p2 < 3
    ? { start: null, end: null, typing: { start: p2 >= 2 ? startTyped : '', end: p2 >= 1 ? endTyped : '', caret: p2 >= 2 ? 'start' : p2 >= 1 ? 'end' : null } }
    : swapped
      ? { start: HOME, end: GATE }
      : { start: GATE, end: HOME, finger: beat === 3 }
  const ask = beat === 1 ? H1.show[1] : beat === 2 ? H1.show[2] : beat === 3 ? H1.show[3] : beat === 4 ? H1.show[4] : beat === 5 ? H1.show[5] : null
  return (
    <>
      <div className="flex items-start gap-12">
        <div className="shrink-0" style={{ marginTop: -PHONE_LIFT }}>
          <MapsPhone s={s} startRef={startRef} endRef={endRef} time="5:30" dim={beat === 6 && p6 >= 2} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-5 pt-1">
          {/* the heading already says "5:30 PM. Class is over."; the line under it says the rest */}
          <p className="text-[26px] font-semibold leading-snug" style={{ color: colors.body }}>
            <Lines lines={sentences(H1.show[0].replace(H1.heading, '').trim())} />
          </p>
          {ask && (
            <div key={beat} className="sm-bump">
              <Ask size={30}>{ask}</Ask>
            </div>
          )}
          {beat === 6 && p6 >= 2 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-8">
                <PlaceSlot value={GATE} n={H1.show[6]} from={startRef} delay={0} />
                <PlaceSlot value={HOME} n={H1.show[7]} from={endRef} delay={260} />
              </div>
              <div className="sm-bump" style={{ animationDelay: '900ms' }}>
                <StepCaption text={H1.show[8]} tone="rule" size={22} minH={60} />
              </div>
            </div>
          )}
          {beat === 6 && p6 < 2 && <div style={{ height: 1 }} />}
        </div>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}

/* ================================================================== H2 */

const H2 = SPEC.H2
const [LONG, SHORT] = H2.code as { src: string; output: string }[]

/**
 * YOUR LOCATION, EVERY TIME? Spec card H2, four presses. 1: the phone with
 * `Your location` already in the top box, Teja types only Ameerpet. 2: the
 * long way, each "Main Gate" lit in turn, and the counter. 3: the question.
 * 4: the short way, the two defaults in the header ringed, the three lines it
 * prints, the line that names it.
 */
export function LocationHook() {
  const beat = useBeats(4)
  const tween = useTween(480)
  const typed = useTyped(HOME, true)
  const p2 = usePhase(beat, 2, [500, 900, 900, 700])
  const host = useRef<HTMLDivElement>(null)
  const short = beat >= 4
  const lit = beat === 2 ? p2 : beat >= 2 ? 4 : 0
  const s: MapsState = { start: null, end: typed || null, here: true, typing: typed.length < HOME.length ? { start: 'Your location', end: typed, caret: 'end' } : undefined }
  const counter = H2.show[1]
  return (
    <>
      <div className="flex items-start gap-10">
        <div className="shrink-0" style={{ marginTop: -PHONE_LIFT }}>
          <MapsPhone s={s} time="5:30" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3 pt-1">
          {/* the heading asks the first question; the card asks only the new one */}
          <div style={{ minHeight: 36 }}>{beat === 3 && <Ask size={26}>{H2.show[2]}</Ask>}</div>
          <Show on={beat >= 2} className="flex items-start gap-4">
            <div ref={host} className="relative shrink-0">
              <CallCode key={short ? 'short' : 'long'} code={short ? SHORT.src : LONG.src} fs={short ? 15 : 16} rows={6} width={short ? 560 : 470} />
              {!short &&
                [4, 5, 6].map((l, i) => <TokenRing key={l} host={host} line={l} token={'"Main Gate"'} on={beat >= 2 && lit >= i + 1} color={colors.accent} />)}
              {short && <TokenRing host={host} line={1} token={'start="Your location"'} on color={colors.accent} />}
              {short && <TokenRing host={host} line={1} token={'end="Home"'} on color={colors.accent} />}
            </div>
            <div className="min-w-0 flex-1">
              <IoBox key={short ? 's' : 'l'} title="Output" lines={beat >= 2 ? (short ? H2.data.short_output : H2.data.long_output) : []} rows={3} fs={15} />
            </div>
          </Show>
          <div style={{ opacity: beat === 2 && lit >= 4 ? 1 : beat === 3 ? 1 : 0, transition: tween }} className={beat >= 4 ? 'hidden' : ''}>
            <span className="inline-block rounded-xl px-4 py-2 text-[20px] font-bold" style={{ background: '#FFF4EC', color: colors.accentDark, boxShadow: `inset 0 0 0 2px ${colors.accent}` }}>
              {sentences(counter)[0]}
            </span>
          </div>
          {short && <StepCaption text={H2.show[3]} tone="rule" size={21} minH={56} />}
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
