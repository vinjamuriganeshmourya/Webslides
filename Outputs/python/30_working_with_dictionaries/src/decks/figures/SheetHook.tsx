import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Group } from './common'
import { Swap, sentences } from './pieces'
import { StepCaption } from './trace'
import { useStepPhase } from './phase'
import { CHAT, LiveClock, Phone, Back } from './Phone'
import { Laptop } from './Laptop'
import { Face } from './people'
import { Board, type Row, type RowTone } from './sheet'
import { SPEC } from './spec'

/**
 * HOOK H1: OOTY TRIP MONEY. Seven presses, no code, no topic name.
 *
 * The class group chat with Divya's sheet link; the sheet open on Divya's
 * laptop and, through the same link, on Ravi's phone. Ravi types 800 and
 * Divya's laptop follows one press later (one sheet, two people looking at
 * it). Kiran taps Make a copy and types 2000 in every row; Divya's sheet
 * never moves (two sheets). Divya deletes everything: Ravi's link shows an
 * empty sheet, Kiran's copy keeps every row. The last press puts what the
 * screens stand for beside them: three name tags, two sheets.
 *
 * THE SCREENS ARE DRAWN AS THE REAL THING (course rules R5, R5b): the chat
 * app's bar and wall, a link preview; the sheet's green glyph, Share button,
 * menu strip, column letters and row numbers, the overflow menu with Make a
 * copy. The apps' own colours stay inside the devices (content rule 37); no
 * product name, no logo (rule 12). Every person is a lab face. Phones at
 * 1 : 2.06 with the live clock (generate-slides 2b). Nothing on the frame
 * says the topic (spec rule 4); nothing moves until a press.
 */

/* the sheet app's own colours, inside the screens only (content rule 37) */
const GREEN = '#188038'
const GRID = '#DADCE0'
const HEADBG = '#F1F3F4'
const SELECT = 'rgba(26,115,232,0.18)'
const BLUE = '#1A73E8'
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */

const H1 = SPEC.H1
const START: Row[] = H1.data.sheet_start
const RAVI_TYPES = Number(H1.data.ravi_types)
const KIRAN_TYPES = Number(H1.data.kiran_types)
const TITLE = 'Ooty trip money'
const COPY_TITLE = `Copy of ${TITLE}`

const PW = 150
const PH = 309 /* 1 : 2.06 */
const EASE = [0.22, 1, 0.36, 1] as const

function Glyph({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
      <path d="M3 1h7l3 3v11H3z" fill={GREEN} />
      <path d="M5 7h6v1.4H5zM5 9.6h6V11H5zM5 12.2h6v1.4H5z" fill="#FFFFFF" />
    </svg>
  )
}

/** The sheet, as the app shows it: title bar, menu strip, letters, numbers, cells. */
function SheetScreen({
  title,
  rows,
  tones = {},
  selected = false,
  menu = false,
  mobile = false,
  lit = false,
}: {
  title: string
  rows: Row[]
  tones?: Record<string, RowTone>
  selected?: boolean
  menu?: boolean
  mobile?: boolean
  lit?: boolean
}) {
  const instant = useInstant()
  const rowH = mobile ? 22 : 19
  /* the rows the screen has room for: the phone's 309px minus bezel, status bar, title bar and the letters row; the laptop's 174px screen minus its bars */
  const total = mobile ? 9 : 6
  const fs = mobile ? 10.5 : 10
  const cells: (Row | null)[] = [...rows, ...Array.from({ length: Math.max(0, total - 1 - rows.length) }, () => null)]
  const tr = instant ? 'none' : 'background-color 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms'
  return (
    <div className="relative flex h-full w-full flex-col bg-white" style={{ boxShadow: lit ? `inset 0 0 0 3px ${colors.brand}` : 'inset 0 0 0 0 transparent', transition: tr }}>
      <div className="flex items-center gap-1.5 px-2" style={{ minHeight: mobile ? 34 : 30, borderBottom: `1px solid ${GRID}` }}>
        <Glyph />
        <span className="min-w-0 flex-1 font-semibold leading-tight" style={{ color: colors.ink, fontSize: mobile ? 10.5 : 11.5 }}>
          {title}
        </span>
        {mobile ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.body} strokeWidth="2" strokeLinecap="round" aria-hidden>
            <circle cx="9" cy="8" r="3.5" />
            <path d="M3 20c.8-4 3.4-6 6-6s5.2 2 6 6M18 8v6M15 11h6" />
          </svg>
        ) : (
          <span className="shrink-0 rounded-full px-2 py-[2px] text-[9.5px] font-bold" style={{ background: '#C2E7FF', color: '#001D35' }}>
            Share
          </span>
        )}
      </div>
      {!mobile && (
        <div className="flex items-center gap-2 px-2 text-[8.5px]" style={{ height: 15, color: colors.body, borderBottom: `1px solid ${GRID}` }}>
          {['File', 'Edit', 'View', 'Insert', 'Format', 'Data'].map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      )}
      <div className="flex" style={{ height: rowH - 4, background: HEADBG, borderBottom: `1px solid ${GRID}`, fontSize: fs - 1, color: colors.body }}>
        <span className="shrink-0" style={{ width: 16, borderRight: `1px solid ${GRID}` }} />
        <span className="grid place-items-center" style={{ flex: 1.2, borderRight: `1px solid ${GRID}` }}>
          A
        </span>
        <span className="grid place-items-center" style={{ flex: 1, borderRight: `1px solid ${GRID}` }}>
          B
        </span>
        <span style={{ flex: 0.5 }} />
      </div>
      {[['Name', 'Paid'] as Row, ...cells].map((r, i) => {
        const head = i === 0
        const name = r?.[0]
        const tone = name ? tones[name] : undefined
        const isSel = selected && !head && !!r
        return (
          <div key={`row-${i}`} className="flex" style={{ height: rowH, borderBottom: `1px solid ${GRID}`, fontSize: fs, background: isSel ? SELECT : head ? HEADBG : colors.white, transition: tr }}>
            <span className="grid shrink-0 place-items-center" style={{ width: 16, background: HEADBG, borderRight: `1px solid ${GRID}`, fontSize: fs - 1.5, color: colors.body }}>
              {i + 1}
            </span>
            <span className="flex items-center whitespace-nowrap px-1 font-semibold" style={{ flex: 1.2, borderRight: `1px solid ${GRID}`, color: head ? colors.body : colors.ink }}>
              {r?.[0] ?? ''}
            </span>
            <span className="flex items-center whitespace-nowrap px-1 font-semibold" style={{ flex: 1, borderRight: `1px solid ${GRID}`, color: head ? colors.body : tone === 'hot' ? colors.accentDark : colors.ink, background: tone === 'hot' ? '#FFF4EC' : 'transparent', boxShadow: tone === 'hot' ? `inset 0 0 0 1.5px ${colors.accent}` : 'none', transition: tr }}>
              {r ? String(r[1]) : ''}
            </span>
            <span style={{ flex: 0.5 }} />
          </div>
        )
      })}
      {menu && (
        <motion.div className="absolute inset-x-0 bottom-0 overflow-hidden rounded-t-xl bg-white pb-3" style={{ boxShadow: '0 -6px 18px rgba(16,32,58,0.22), 0 0 0 1px ' + GRID, fontSize: 10.5 }} initial={instant ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36, ease: EASE }}>
          {['Share and export', 'Make a copy', 'Details'].map((m) => (
            <div key={m} className="px-3 py-1.5 font-semibold" style={{ color: m === 'Make a copy' ? BLUE : colors.ink, background: m === 'Make a copy' ? '#E8F0FE' : 'transparent' }}>
              {m}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

/** The class group: Divya's message with the sheet's link preview. */
function ChatScreen() {
  return (
    <div className="flex h-full flex-col" style={{ background: CHAT.wall, backgroundImage: `radial-gradient(${CHAT.wallMark} 1px, transparent 1px)`, backgroundSize: '12px 12px' }}>
      <div className="mx-auto mt-2 rounded-md px-2 py-[2px] text-[9px] font-semibold" style={{ background: 'rgba(255,255,255,0.8)', color: colors.body }}>
        Today
      </div>
      <div className="mx-2 mt-2 max-w-[134px] rounded-xl rounded-tl-sm p-1.5" style={{ background: CHAT.theirs, boxShadow: '0 1px 1px rgba(0,0,0,0.08)' }}>
        <div className="mb-1 text-[10px] font-bold" style={{ color: CHAT.bar }}>
          Divya
        </div>
        <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: '#F0F2F5' }}>
          <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-md" style={{ background: GREEN }}>
            <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden>
              <path d="M3 1h7l3 3v11H3z" fill="#FFFFFF" />
              <path d="M5 7h6v1.4H5zM5 9.6h6V11H5zM5 12.2h6v1.4H5z" fill={GREEN} />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-bold leading-tight" style={{ color: colors.ink }}>
              {TITLE}
            </span>
            <span className="block text-[8.5px] leading-tight" style={{ color: colors.body }}>
              docs.google.com
            </span>
          </span>
        </div>
        <div className="mt-0.5 text-right text-[8px]" style={{ color: colors.muted }}>
          10:02
        </div>
      </div>
    </div>
  )
}

function ChatHeader() {
  return (
    <div className="flex items-center gap-2 px-2 pb-2">
      <Back color={colors.white} />
      <span className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full" style={{ background: 'rgba(255,255,255,0.25)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.white} strokeWidth="2" strokeLinecap="round" aria-hidden>
          <circle cx="9" cy="8" r="3.2" />
          <circle cx="17" cy="9" r="2.6" />
          <path d="M2.5 19c.7-3.6 3.2-5.5 6.5-5.5s5.8 1.9 6.5 5.5M15 13.5c2.6 0 4.9 1.5 5.5 4.5" />
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block whitespace-nowrap text-[11.5px] font-bold leading-tight" style={{ color: colors.white }}>
          CSE-A 2025
        </span>
        <span className="block whitespace-nowrap text-[8.5px] leading-tight" style={{ color: 'rgba(255,255,255,0.85)' }}>
          6 members
        </span>
      </span>
    </div>
  )
}

function SheetHeader({ light }: { light: boolean }) {
  return <div style={{ height: 2, background: light ? 'transparent' : colors.white }} />
}

/** A device with its owner's name over it. */
function Owned({ name, children, dim = false }: { name: string | null; children: ReactNode; dim?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5" style={{ opacity: dim ? 0.35 : 1, transition: 'opacity 480ms cubic-bezier(0.22,1,0.36,1)' }}>
      {name && (
        <span className="flex h-[22px] items-center gap-1.5 text-[13px] font-bold" style={{ color: colors.ink }}>
          <Face name={name} size={20} />
          {name}
        </span>
      )}
      {children}
    </div>
  )
}

export function SheetHook() {
  const beat = useBeats(7)
  /* press 4: the menu, then the copy; press 6: the rows selected, then gone */
  const phase = useStepPhase(beat, [1100])
  const after4 = beat > 4 || (beat === 4 && phase >= 1)
  const after6 = beat > 6 || (beat === 6 && phase >= 1)
  const withRavi = (from: number): Row[] => START.map(([n, a]) => [n, n === 'Ravi' && beat >= from ? RAVI_TYPES : a])
  const raviRows: Row[] = beat >= 7 ? [] : withRavi(2)
  const divyaRows: Row[] = after6 ? [] : withRavi(3)
  const kiranRows: Row[] = after4 ? START.map(([n]) => [n, KIRAN_TYPES]) : withRavi(2)
  const S = H1.show as string[]
  const caption = [S[0], S[1], S[2], `${S[3]} ${S[4]}`, S[5], `${S[6]} ${S[7]}`, S[8]][beat - 1]
  /* the two questions of press 6 stay on one line, so the caption holds three lines, never four */
  const lines = beat === 6 ? [...sentences(S[6]), S[7]] : undefined
  const linkLit = beat === 3
  const twoLit = beat === 5
  return (
    <>
      <div className="flex items-start gap-4">
        <Group pad={8} className="flex w-[430px] shrink-0 flex-col gap-2.5" style={{ height: 417 }} active={beat === 1 || beat === 7}>
          <StepCaption text={caption} lines={lines} size={15} minH={82} />
          <div className="relative flex h-[309px] items-end justify-center">
            <Swap k={beat >= 7 ? 'tags' : 'chat'}>
              {beat >= 7 ? (
                <div className="flex h-[309px] items-center">
                  <Board
                    size="sm"
                    gap={30}
                    minRows={3}
                    sheets={[
                      { id: 'S1', title: TITLE, rows: [] },
                      { id: 'S2', title: COPY_TITLE, rows: kiranRows },
                    ]}
                    tags={[
                      { name: 'Divya', to: 'S1', tone: 'person' },
                      { name: 'Ravi', to: 'S1', tone: 'person' },
                      { name: 'Kiran', to: 'S2', tone: 'person' },
                    ]}
                  />
                </div>
              ) : (
                <Owned name={null}>
                  <Phone width={PW} height={PH} island={{ w: 44, h: 15 }} time={<LiveClock />} top={{ bg: CHAT.bar, light: true, header: <ChatHeader /> }}>
                    <ChatScreen />
                  </Phone>
                </Owned>
              )}
            </Swap>
          </div>
        </Group>
        <Group pad={10} className="flex min-w-0 flex-1 items-end justify-center gap-4" style={{ height: 417 }} active={beat >= 2 && beat <= 6}>
          <Owned name="Divya">
            <Laptop width={290}>
              <SheetScreen title={TITLE} rows={divyaRows} tones={beat === 3 ? { Ravi: 'hot' } : {}} selected={beat === 6 && phase < 1} lit={linkLit || twoLit} />
            </Laptop>
          </Owned>
          <Owned name="Ravi">
            <Phone width={PW} height={PH} island={{ w: 44, h: 15 }} time={<LiveClock />} top={{ bg: colors.white, light: false, header: <SheetHeader light={false} /> }}>
              <SheetScreen title={TITLE} rows={raviRows} tones={beat === 2 ? { Ravi: 'hot' } : {}} mobile lit={linkLit} />
            </Phone>
          </Owned>
          <motion.div initial={false} animate={{ opacity: beat >= 4 ? 1 : 0, y: beat >= 4 ? 0 : 12 }} transition={{ duration: 0.52, ease: EASE }} style={{ pointerEvents: beat >= 4 ? undefined : 'none' }}>
            <Owned name="Kiran">
              <Phone width={PW} height={PH} island={{ w: 44, h: 15 }} time={<LiveClock />} top={{ bg: colors.white, light: false, header: <SheetHeader light={false} /> }}>
                {beat >= 4 ? (
                  <SheetScreen title={after4 ? COPY_TITLE : TITLE} rows={kiranRows} tones={beat === 4 && after4 ? { Teja: 'hot', Ravi: 'hot', Kiran: 'hot' } : {}} menu={beat === 4 && !after4} mobile lit={twoLit} />
                ) : (
                  <div className="h-full w-full bg-white" />
                )}
              </Phone>
            </Owned>
          </motion.div>
        </Group>
      </div>
      <StepControls at={beat} total={7} />
    </>
  )
}
