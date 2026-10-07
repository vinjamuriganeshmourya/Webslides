import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Lines } from './common'
import { Show, sentences } from './pieces'
import { Back, Phone } from './Phone'
import { PieceRow, Tiles, usePhase, type TileState } from './tiles21'
import { SPEC } from './spec'

/**
 * HOOK 1: ONE NOTE, FOUR THINGS. Spec card H1, six presses.
 *
 * A phone with a notes app open on the note `Trip packing`, four typed lines
 * in the spec's order. Press 3: the note's menu opens, `Show checkboxes` is
 * tapped, and each line becomes its own row with an empty box (one movement
 * inside the press). Press 4: `ID card` is ticked and only that row changes,
 * struck through and grey, in its own place (the item order never changes,
 * its must line). Press 5: the tick clears, `Hide checkboxes` is tapped, and
 * the rows join back into one note body. Press 6, the turn, one movement: the
 * phone fades and leaves what it stands for: the note as one row of letter
 * tiles with a new-line mark between the items, cut at each mark into four
 * boxes, then glued back into one row. No code and no topic name on this card
 * (its must_not lines).
 *
 * The app is drawn in its own colours, the yellow note (plan decision 8), with
 * no mark. The menu words are the spec's; the ticked look is the app's with
 * "move ticked items to the bottom" off, so the order holds (plan, flags).
 */
const H1 = SPEC.H1
const ITEMS: string[] = H1.data.items
const TICKED: string = H1.data.ticked
const NOTE_TEXT: string = H1.data.note_text
const NOTE = '#FFF8B8' /* the app's yellow note: the drawn app's own colour */
const NOTE_INK = '#202124'
const NL = '↵' /* the new-line mark: a picture of Enter, not Python's escape */

if (typeof document !== 'undefined' && !document.querySelector('style[data-sm-sheet]')) {
  const el = document.createElement('style')
  el.dataset.smSheet = ''
  el.textContent = '.sm-sheet { animation: sm-sheet 420ms cubic-bezier(0.22,1,0.36,1) both; } @keyframes sm-sheet { from { transform: translateY(100%); } to { transform: none; } }'
  document.head.appendChild(el)
}

function Icon({ d }: { d: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={NOTE_INK} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  )
}

function Box({ on }: { on: boolean }) {
  return (
    <span className="grid h-[15px] w-[15px] shrink-0 place-items-center rounded-[3px]" style={{ border: `1.8px solid ${on ? '#5F6368' : '#5F6368'}`, background: 'transparent' }}>
      {on && (
        <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden>
          <path d="M2 6.4 4.7 9 10 3" stroke="#5F6368" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  )
}

const MENU = ['Delete', 'Make a copy', 'Send', 'Collaborator', 'Labels']

function KeepPhone({ boxes, ticked, menu, tapped, menuWord }: { boxes: boolean; ticked: boolean; menu: boolean; tapped: boolean; menuWord: string }) {
  const tween = useTween(420)
  const instant = useInstant()
  return (
    <Phone
      width={262}
      height={470}
      time="9:41"
      top={{
        bg: NOTE,
        light: false,
        header: (
          <div className="flex items-center justify-between px-3 pb-1.5 pt-1">
            <Back color={NOTE_INK} />
            <span className="flex items-center gap-3.5">
              <Icon d="M9 3h6l-1 5 3 3v2H7v-2l3-3-1-5zM12 13v8" />
              <Icon d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2h16l-2-2zM10 20a2 2 0 0 0 4 0" />
              <Icon d="M4 7h16v3H4zM5 10v10h14V10M10 14h4" />
            </span>
          </div>
        ),
      }}
    >
      <div className="relative flex h-full flex-col" style={{ background: NOTE }}>
        <div className="flex-1 px-4 pt-2">
          <p className="text-[19px] font-medium leading-tight" style={{ color: NOTE_INK }}>
            {H1.data.title}
          </p>
          <div className="mt-3 flex flex-col">
            {ITEMS.map((it) => {
              const done = ticked && it === TICKED
              return (
                <div key={it} className="flex h-[30px] items-center gap-2">
                  <span className="flex items-center gap-1.5 overflow-hidden" style={{ width: boxes ? 30 : 0, opacity: boxes ? 1 : 0, transition: instant ? 'none' : tween }}>
                    <span className="text-[13px] leading-none" style={{ color: '#9AA0A6' }}>
                      ⠿
                    </span>
                    <Box on={done} />
                  </span>
                  <span
                    className="text-[15px]"
                    style={{ color: done ? '#80868B' : NOTE_INK, textDecoration: done ? 'line-through' : 'none', transition: instant ? 'none' : tween }}
                  >
                    {it}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        {/* the app's bottom bar */}
        <div className="flex items-center justify-between px-3 pb-5 pt-1.5">
          <span className="flex items-center gap-3">
            <Icon d="M4 4h16v16H4zM12 8v8M8 12h8" />
            <Icon d="M12 3a9 9 0 1 0 0 18c1 0 1.6-.8 1.6-1.6 0-.5-.2-.8-.4-1.1-.3-.3-.4-.6-.4-1 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5c0-4.1-4-7.7-9-7.7zM7 11.5h.01M9.5 7.5h.01M14.5 7.5h.01" />
          </span>
          <span className="text-[11px]" style={{ color: '#5F6368' }}>
            Edited 9:41
          </span>
          <span className="grid h-[24px] w-[24px] place-items-center rounded-full" style={{ background: menu ? 'rgba(0,0,0,0.1)' : 'transparent', transition: tween }}>
            <svg width="4" height="16" viewBox="0 0 4 16" aria-hidden>
              <circle cx="2" cy="2" r="1.8" fill={NOTE_INK} />
              <circle cx="2" cy="8" r="1.8" fill={NOTE_INK} />
              <circle cx="2" cy="14" r="1.8" fill={NOTE_INK} />
            </svg>
          </span>
        </div>
        {/* the menu: a sheet from the bottom, mounted only while it is open */}
        {menu && (
          <div className="sm-sheet absolute inset-x-0 bottom-0 rounded-t-2xl bg-white px-1 pb-6 pt-2" style={{ boxShadow: '0 -6px 18px rgba(0,0,0,0.18)' }}>
            {[...MENU, menuWord].map((m) => {
              const hit = m === menuWord && tapped
              return (
                <div key={m} className="rounded-md px-4 py-[7px] text-[13.5px]" style={{ color: NOTE_INK, background: hit ? 'rgba(26,115,232,0.16)' : 'transparent', transition: tween }}>
                  {m}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Phone>
  )
}

/** The turn: one long text, cut into pieces, glued back. Three rows, one movement. */
function Turn({ phase }: { phase: number }) {
  const chars = [...NOTE_TEXT.replace(/\n/g, NL)]
  const cut: Record<number, TileState> = {}
  const glued: Record<number, TileState> = {}
  chars.forEach((c, i) => {
    if (c === NL) {
      cut[i] = phase >= 1 ? 'cut' : 'sep'
      glued[i] = 'glue'
    }
  })
  const lines = sentences(H1.show[5])
  const label = (t: string) => (
    <span className="font-heading text-[18px] font-bold" style={{ color: colors.brandDark }}>
      {t}
    </span>
  )
  return (
    <div className="flex flex-col gap-7 pt-3">
      <div className="flex flex-col gap-2">
        {label(lines[0])}
        <Tiles chars={chars} size="sm" states={cut} lane={false} drop />
      </div>
      <Show on={phase >= 1} className="flex flex-col gap-2">
        {label(lines[1])}
        {phase >= 1 && <PieceRow pieces={ITEMS} stagger={180} />}
      </Show>
      <Show on={phase >= 2} className="flex flex-col gap-2">
        {label(lines[2])}
        {phase >= 2 && <Tiles chars={chars} size="sm" states={glued} lane={false} drop />}
      </Show>
    </div>
  )
}

export function KeepHook() {
  const beat = useBeats(6)
  const tween = useTween(520)
  const show3 = usePhase(beat, 3, [900, 700])
  const hide5 = usePhase(beat, 5, [900, 700])
  const turn = usePhase(beat, 6, [1500, 1500])
  /* the note's state at each press */
  const menu = (beat === 3 && show3 < 2) || (beat === 5 && hide5 < 2)
  const tapped = (beat === 3 && show3 >= 1) || (beat === 5 && hide5 >= 1)
  const boxes = (beat === 3 && show3 >= 2) || beat === 4 || (beat === 5 && hide5 < 2)
  const ticked = beat === 4
  const menuWord = beat >= 5 ? 'Hide checkboxes' : 'Show checkboxes'
  const shown = H1.show.slice(0, Math.min(beat, 5)) as string[]
  return (
    <>
      <div className="relative">
        <div className="flex items-start gap-10" style={{ opacity: beat >= 6 ? 0 : 1, transition: tween, pointerEvents: beat >= 6 ? 'none' : undefined }}>
          <div className="shrink-0" style={{ marginTop: -48 }}>
            <KeepPhone boxes={boxes} ticked={ticked} menu={menu} tapped={tapped} menuWord={menuWord} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3 pt-2">
            {shown.map((c, i) => {
              const now = i === shown.length - 1
              return (
                <p key={i} className="sm-bump font-heading font-bold leading-snug" style={{ fontSize: now ? 26 : 20, color: now ? colors.brandDark : colors.muted, transition: tween }}>
                  <Lines lines={sentences(c)} />
                </p>
              )
            })}
          </div>
        </div>
        {beat >= 6 && (
          <div className="absolute inset-x-0 top-0">
            <Turn phase={turn} />
          </div>
        )}
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}
