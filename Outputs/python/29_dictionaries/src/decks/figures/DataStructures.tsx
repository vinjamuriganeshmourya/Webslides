import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Lines } from './common'
import { Appear, sentences } from './pieces'
import { Face } from './people'
import { IG } from './Insta'
import { SPEC } from './spec'

/**
 * WHAT A DATA STRUCTURE IS: DS2 (Python's four data structures) and DS3
 * (what today's one is). Added 2026-10-09 from the change spec "27 Sets: add
 * what a data structure is" (`../session_plans/27_sets/change_ds.json`).
 *
 * The same two cards go into the Lists, Tuples and Dictionaries sessions, so
 * both are driven by the card's own data and nothing here names a set:
 *
 *   - `DataFamily` takes the four tiles, each `done`, `today` or `later`.
 *   - `DataGrid` takes the rows, the grid, the proofs and today's column; the
 *     columns before it are the ones already learnt. A later session passes
 *     one more column and the grid is one column wider.
 *
 * Copy this file with the scaffold into the next data structure session.
 */

const HOUSE = [0.22, 1, 0.36, 1] as const

/* ================================================================== DS2 */

type Tile = { name: string; picture: string; line: string; state: 'done' | 'today' | 'later' }

const TILE_W = 262
const TILE_H = 344
const MINI_W = 102
const MINI_H = 210 /* 1 : 2.06, the deck's phone proportion */

/** A small phone at the deck's proportion, no clock (too small to read), the screen's own colours. */
function MiniPhone({ children }: { children: ReactNode }) {
  return (
    <div className="relative shrink-0 rounded-[20px] p-[4px]" style={{ width: MINI_W, height: MINI_H, background: '#15191F', boxShadow: '0 10px 22px -12px rgba(11,26,43,0.55)' }}>
      <div className="relative flex h-full flex-col overflow-hidden rounded-[16px] bg-white">
        <span aria-hidden className="mx-auto mt-[5px] block h-[5px] w-[30px] rounded-full" style={{ background: '#15191F' }} />
        <div className="relative min-h-0 flex-1 px-[7px] pt-[6px]">{children}</div>
        <span aria-hidden className="absolute bottom-[4px] left-1/2 h-[3px] w-[36px] -translate-x-1/2 rounded-full" style={{ background: 'rgba(11,26,43,0.35)' }} />
      </div>
    </div>
  )
}

/** A screen title: a few letters' worth of bold text. */
function ScreenTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-[6px] text-[9.5px] font-bold leading-none" style={{ color: IG.ink }}>
      {children}
    </div>
  )
}

/* The four screens. The songs and the date are the grid's own proof values. */
const SONGS = ['Kesariya', 'Naatu Naatu', 'Jhoome', 'Kesariya']
const CONTACTS: [string, string][] = [
  ['Anu', '98480 21507'],
  ['Kiran', '90001 64223'],
  ['Ravi', '97012 33816'],
  ['Teja', '94402 75190'],
]

function PlaylistScreen() {
  return (
    <>
      <ScreenTitle>Playlist</ScreenTitle>
      <div className="flex flex-col gap-[5px]">
        {SONGS.map((s, i) => (
          <div key={i} className="flex items-center gap-[5px]">
            <span className="w-[7px] text-right font-mono text-[7.5px]" style={{ color: IG.soft }}>
              {i + 1}
            </span>
            <span className="h-[16px] w-[16px] shrink-0 rounded-[3px]" style={{ background: ['#F2C14E', '#E76F51', '#2A9D8F', '#F2C14E'][i] }} />
            <span className="whitespace-nowrap text-[8px] font-semibold" style={{ color: IG.ink }}>
              {s}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

function IdScreen() {
  return (
    <>
      <ScreenTitle>ID card</ScreenTitle>
      <div className="rounded-[7px] p-[6px]" style={{ background: 'linear-gradient(160deg, #EAF1FF, #D7E4FF)', boxShadow: 'inset 0 0 0 1px #C3D4F5' }}>
        <div className="flex items-center gap-[5px]">
          <Face name="Teja" size={26} />
          <div className="flex flex-col gap-[3px]">
            <span className="h-[4px] w-[34px] rounded-full" style={{ background: '#9DB3DA' }} />
            <span className="h-[4px] w-[24px] rounded-full" style={{ background: '#BFD0EE' }} />
          </div>
        </div>
        <div className="mt-[6px] text-[6.5px] font-semibold uppercase tracking-wide" style={{ color: IG.soft }}>
          Date of birth
        </div>
        <div className="mt-[1px] flex items-center gap-[4px]">
          <span className="whitespace-nowrap font-mono text-[10px] font-bold" style={{ color: IG.ink }}>
            12/03/2007
          </span>
          <svg width="8" height="9" viewBox="0 0 12 14" aria-hidden>
            <rect x="1" y="6" width="10" height="7.5" rx="1.6" fill={IG.soft} />
            <path d="M3.4 6V4.3a2.6 2.6 0 0 1 5.2 0V6" fill="none" stroke={IG.soft} strokeWidth="1.6" />
          </svg>
        </div>
      </div>
    </>
  )
}

/* PF 29: this session's hook has no Seen by list; the three names are the grid's own proof names */
const SEEN_BY = ['Ravi', 'Anu', 'Kiran']

function SeenByScreen() {
  const names: string[] = SPEC.H1?.data?.seen_by ?? SEEN_BY
  return (
    <>
      <div className="mb-[6px] flex items-center gap-[4px]">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={IG.ink} strokeWidth="2.2" aria-hidden>
          <path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" />
          <circle cx="12" cy="12" r="3.2" />
        </svg>
        <span className="text-[9.5px] font-bold" style={{ color: IG.ink }}>
          {names.length}
        </span>
      </div>
      <div className="flex flex-col gap-[6px]">
        {names.map((n) => (
          <div key={n} className="flex items-center gap-[5px]">
            <Face name={n} size={18} />
            <span className="text-[8px] font-semibold" style={{ color: IG.ink }}>
              {n.toLowerCase()}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

function ContactsScreen() {
  return (
    <>
      <ScreenTitle>Contacts</ScreenTitle>
      <div className="flex flex-col gap-[6px]">
        {CONTACTS.map(([n, num]) => (
          <div key={n} className="flex items-center gap-[5px]">
            <Face name={n} size={17} />
            <span className="flex flex-col leading-none">
              <span className="text-[8px] font-semibold" style={{ color: IG.ink }}>
                {n}
              </span>
              <span className="mt-[2px] whitespace-nowrap font-mono text-[6.5px]" style={{ color: IG.soft }}>
                {num}
              </span>
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

/** Which screen draws which structure. A name with no screen gets an empty phone. */
const SCREENS: Record<string, () => ReactNode> = {
  list: PlaylistScreen,
  tuple: IdScreen,
  set: SeenByScreen,
  dictionary: ContactsScreen,
}

/** The tile's mark: a tick for one already learnt, Today lit, Later dim. */
function Mark({ state }: { state: Tile['state'] }) {
  const look =
    state === 'done'
      ? { bg: '#E9F8EF', ink: colors.success, text: '✓ learnt' }
      : state === 'today'
        ? { bg: colors.brandDark, ink: colors.white, text: 'Today' }
        : { bg: colors.surface, ink: colors.muted, text: 'Later' }
  return (
    <span className="whitespace-nowrap rounded-full px-2.5 py-1 font-heading text-[14px] font-bold leading-none" style={{ background: look.bg, color: look.ink, boxShadow: state === 'later' ? `inset 0 0 0 1.5px ${colors.line}` : 'none' }}>
      {look.text}
    </span>
  )
}

/** One tile: face down until its press, then it turns over once. */
function FlipTile({ tile, n, open }: { tile: Tile; n: number; open: boolean }) {
  const instant = useInstant()
  const tween = useTween(520)
  const Screen = SCREENS[tile.name]
  const lit = open && tile.state === 'today'
  const dim = open && tile.state === 'later'
  const side = 'absolute inset-0 rounded-[20px]'
  return (
    <div className="relative shrink-0" style={{ width: TILE_W, height: TILE_H, perspective: 1100 }}>
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
        initial={false}
        animate={{ rotateY: open ? 0 : 180 }}
        transition={{ duration: instant ? 0 : 0.75, ease: HOUSE }}
      >
        {/* the face: the picture, the name, the line */}
        <div
          className={`${side} flex flex-col items-center px-4 pb-4 pt-4`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: lit ? 'rgba(232,240,255,0.96)' : colors.white,
            boxShadow: lit ? `0 0 0 3px ${colors.brand}, 0 18px 34px -16px ${colors.brand}aa` : `0 0 0 1px ${colors.line}, 0 12px 28px -20px rgba(16,32,58,0.3)`,
            opacity: dim ? 0.55 : 1,
            transition: tween,
          }}
        >
          <MiniPhone>{Screen ? <Screen /> : null}</MiniPhone>
          <span className="mt-2 text-center text-[15px] font-semibold leading-tight" style={{ color: colors.body }}>
            {tile.picture}
          </span>
          <span className="mt-1 flex items-center gap-2">
            <span className="font-mono text-[26px] font-bold leading-tight" style={{ color: tile.state === 'today' ? colors.brandDark : colors.ink }}>
              {tile.name}
            </span>
            <Mark state={tile.state} />
          </span>
          <span className="mt-1 text-center font-heading text-[16px] font-bold leading-snug" style={{ color: colors.ink }}>
            <Lines lines={sentences(tile.line)} />
          </span>
        </div>
        {/* the back: face down, numbered so the room can follow the order */}
        <div
          className={`${side} grid place-items-center`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: `repeating-linear-gradient(135deg, ${colors.surface2} 0 14px, ${colors.surface} 14px 28px)`,
            boxShadow: `0 0 0 1.5px ${colors.line}, 0 12px 28px -20px rgba(16,32,58,0.3)`,
          }}
        >
          <span className="grid h-[72px] w-[72px] place-items-center rounded-full font-heading text-[34px] font-bold" style={{ background: colors.white, color: colors.brandDark, boxShadow: `0 0 0 2px ${colors.line}` }}>
            {n}
          </span>
        </div>
      </motion.div>
    </div>
  )
}

/**
 * DS2, five presses: the line over four face-down tiles; then one tile turns
 * per press, in the data's order. All four are on the card from press 1, so
 * nothing moves when one turns. Only names and everyday pictures: no code,
 * no brackets (the card's must lines).
 */
export function DataFamily({ id = 'DS2' }: { id?: string }) {
  const card = SPEC[id]
  const tiles: Tile[] = card.data.tiles
  const total: number = card.press_count
  const beat = useBeats(total)
  return (
    <>
      <div className="flex flex-col items-center gap-3.5">
        <div className="rounded-card px-6 py-2.5" style={{ background: colors.surface2, boxShadow: `inset 4px 0 0 ${colors.brandDark}` }}>
          <span className="font-heading text-[24px] font-bold" style={{ color: colors.brandDark }}>
            <Lines lines={sentences(card.show[0])} />
          </span>
        </div>
        <div className="flex gap-5">
          {tiles.map((t, i) => (
            <FlipTile key={t.name} tile={t} n={i + 1} open={beat >= i + 2} />
          ))}
        </div>
      </div>
      <StepControls at={beat} total={total} />
    </>
  )
}

/* ================================================================== DS3 */

type Row = { key: string; label: string }
type Proof = { code: string; output: string }

/* the label and the earlier columns are narrow enough for the proof column to hold a 44-character line at the large size;
   PF 29 (four columns): narrower still, so the dictionary column's 42-character proof fits beside them */
const LABEL_W = 200
const COL_W = 140
const TODAY_W = 196
const NARROW = { label: 172, col: 112, today: 186 }
const CELL_GAP = 5
/**
 * The proof's type (the view fixes change spec, 2026-10-09: "Proof code is too
 * small to read"). The row the room is looking at, the one just filled, shows
 * its proof large, near the row labels' size; the rows filled earlier shrink
 * back, so the whole grid still fits the body box. Rows ease between the two.
 */
const PROOF = { big: { fs: 15, lh: 19 }, small: { fs: 12, lh: 14 } } as const

/** A row's height: tall enough for today's proof for it (the only one shown), at the size it shows now. PF 29: today's column only, so the four-column grid fits the body box. */
function rowHeight(proofs: Record<string, Record<string, Proof>>, key: string, big: boolean, today: string) {
  const p = proofs[today]?.[key]
  const lines = p ? p.code.split('\n').length + p.output.split('\n').length : 1
  return Math.max(48, lines * (big ? PROOF.big.lh : PROOF.small.lh) + 14)
}

/** An output line: Python's error text in the danger tone, a spoken aside muted. */
function outTone(t: string) {
  if (/^[A-Z]\w*Error/.test(t)) return colors.danger
  if (/^\(.*\)$/.test(t) && !/^\(\d/.test(t)) return colors.muted
  return colors.success
}

/** The proof beside a filled cell: the code, then what it printed. */
function ProofBox({ proof, big }: { proof: Proof; big: boolean }) {
  const tween = useTween(420)
  const t = big ? PROOF.big : PROOF.small
  return (
    <div className="flex h-full flex-col justify-center rounded-xl px-3 py-1.5" style={{ background: big ? colors.white : colors.surface, boxShadow: `inset 0 0 0 ${big ? 1.5 : 1}px ${big ? colors.brand : colors.line}`, transition: tween }}>
      {proof.code.split('\n').map((l, i) => (
        <div key={`c${i}`} className="w-max whitespace-pre font-mono" style={{ fontSize: t.fs, lineHeight: `${t.lh}px`, color: colors.ink, transition: tween }}>
          {l}
        </div>
      ))}
      {proof.output.split('\n').map((l, i) => (
        <div key={`o${i}`} className="w-max whitespace-pre font-mono font-semibold" style={{ fontSize: t.fs, lineHeight: `${t.lh}px`, color: outTone(l), transition: tween }}>
          {l}
        </div>
      ))}
    </div>
  )
}

/** One grid cell's value, rule 36 on a two-sentence value. */
function Value({ text, size = 19 }: { text: string; size?: number }) {
  return (
    <span className="text-center font-heading font-bold leading-tight" style={{ fontSize: size, color: colors.ink }}>
      <Lines lines={sentences(text)} />
    </span>
  )
}

/**
 * THE DATA STRUCTURE GRID, one component for every data structure session.
 * Rows are the five questions; the columns are the ones already learnt, then
 * today's, shaded. Today's cells start dashed and empty; `filled` of them are
 * filled, top down, each with its proof beside it. `asking` rings the next
 * empty cell, the one the room is voting on. Earlier columns never change.
 */
export function DataGrid({
  rows,
  grid,
  proofs,
  columns,
  today,
  filled,
}: {
  rows: Row[]
  grid: Record<string, Record<string, string>>
  proofs: Record<string, Record<string, Proof>>
  /** Every column, in teaching order; today's is one of them. */
  columns: string[]
  today: string
  filled: number
}) {
  const tween = useTween(420)
  const cols = columns.slice(0, columns.indexOf(today) + 1)
  const narrow = cols.length >= 4
  const [labelW, colW, todayW] = narrow ? [NARROW.label, NARROW.col, NARROW.today] : [LABEL_W, COL_W, TODAY_W]
  const template = `${labelW}px ${cols.map((c) => `${c === today ? todayW : colW}px`).join(' ')} minmax(0, 1fr)`
  /* the row just filled carries the large proof; the ones before it have shrunk back */
  const current = filled - 1
  const heights = rows.map((r, i) => rowHeight(proofs, r.key, i === current, today))
  return (
    <div className="grid w-full" style={{ gridTemplateColumns: template, gridTemplateRows: `34px ${heights.map((h) => `${h}px`).join(' ')}`, gap: CELL_GAP, transition: tween }}>
      {/* the header row */}
      <span />
      {cols.map((c) => (
        <span key={`h-${c}`} className="grid place-items-center rounded-t-xl font-mono text-[22px] font-bold" style={{ color: c === today ? colors.white : colors.brandDark, background: c === today ? colors.brandDark : 'transparent' }}>
          {c}
        </span>
      ))}
      <span />

      {rows.map((r, i) => {
        const done = i < filled
        const asking = i === filled
        return [
          <span key={`l-${r.key}`} className="flex items-center rounded-xl px-3 font-heading text-[18px] font-bold leading-tight" style={{ background: asking ? colors.surface2 : 'transparent', color: colors.ink, transition: tween }}>
            {r.label}
          </span>,
          ...cols.map((c) =>
            c === today ? (
              <span
                key={`${c}-${r.key}`}
                className="grid place-items-center rounded-xl px-2"
                style={{
                  background: done ? 'rgba(232,240,255,0.96)' : 'rgba(232,240,255,0.45)',
                  border: `2px ${done ? 'solid' : 'dashed'} ${done ? colors.brand : asking ? colors.brand : '#AFC4EE'}`,
                  boxShadow: asking ? `0 0 0 4px ${colors.brand}26` : `0 0 0 0 ${colors.brand}00`,
                  transition: tween,
                }}
              >
                {done && (
                  <Appear>
                    <Value text={grid[c][r.key]} />
                  </Appear>
                )}
              </span>
            ) : (
              <span key={`${c}-${r.key}`} className="grid place-items-center rounded-xl px-2" style={{ background: colors.white, boxShadow: `inset 0 0 0 1px ${colors.line}` }}>
                <Value text={grid[c][r.key]} size={narrow ? 15 : 17} />
              </span>
            ),
          ),
          <div key={`p-${r.key}`} className="min-w-0">
            {done && proofs[today]?.[r.key] && (
              <Appear className="h-full">
                <ProofBox proof={proofs[today][r.key]} big={i === current} />
              </Appear>
            )}
          </div>,
        ]
      })}
    </div>
  )
}

/** The teaching order of Python's four data structures: the grid's columns. */
export const DS_ORDER = ['list', 'tuple', 'set', 'dictionary']

/**
 * DS3, six presses: the whole grid on press 1, today's column empty and
 * dashed; one cell of it fills per press, top down, its proof beside it,
 * only after the room has voted (the must-not line).
 */
export function WhatItIs({ id = 'DS3' }: { id?: string }) {
  const card = SPEC[id]
  const total: number = card.press_count
  const beat = useBeats(total)
  return (
    <>
      <DataGrid rows={card.data.rows} grid={card.data.grid} proofs={card.data.proofs} columns={DS_ORDER} today={card.ds_today} filled={beat - 1} />
      <StepControls at={beat} total={total} />
    </>
  )
}
