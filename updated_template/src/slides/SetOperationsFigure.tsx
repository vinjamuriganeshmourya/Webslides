import type { CSSProperties } from 'react'
import { colors, fonts } from '@/design/tokens'

/**
 * THE REFERENCE CONTENT, STATIC: the 28 Set Operations frame's body
 * (`Reference ppt's/image copy.png`), redrawn for `ContentSlide` so the new
 * header can be judged on a real slide. Two groups as a Venn, the four
 * operations as a list with the first lit, and the question under them.
 * Positions are measured off the reference's pixels (1920 frame); the
 * player's Next and play buttons are chrome, not content, and are left out.
 *
 * Faces: DM Sans for every label (the kit set Poppins/Inter); the two set
 * names are code and stay in JetBrains Mono, which `index.html` now loads.
 */

const MONO = "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace"
/** The kit's heading ink and paragraph grey, as the reference has them. */
const INK = '#0B1A2B'
const GREY = '#767F8B'
const TEAL = '#0E9285'

/* the Venn, measured: two circles of radius 226, centres (408,640) and (660,640) */
const PANEL = { left: 93, top: 329, width: 882, height: 642 }
const R = 226
const L_C = { x: 408, y: 640 }
const R_C = { x: 660, y: 640 }

type Chip = { name: string; x: number; y: number }
/** Centres of the name chips, in the reference's own rows. */
const CHIPS: Chip[] = [
  { name: 'Anu', x: 316, y: 588 },
  { name: 'Sneha', x: 257, y: 638 },
  { name: 'Pooja', x: 361, y: 638 },
  { name: 'Divya', x: 263, y: 688 },
  { name: 'Vamsi', x: 368, y: 688 },
  { name: 'Ravi', x: 533, y: 588 },
  { name: 'Kiran', x: 533, y: 638 },
  { name: 'Teja', x: 533, y: 688 },
  { name: 'Arjun', x: 699, y: 638 },
  { name: 'Harsha', x: 811, y: 638 },
  { name: 'Manoj', x: 699, y: 688 },
  { name: 'Rahul', x: 803, y: 688 },
]
const REGION_PILLS = [
  { text: 'Only CSE-A gang', x: 309 },
  { text: 'In both', x: 533 },
  { text: 'Only Hostel cricket', x: 758 },
]

/* the list, measured: card x 990..1839, y 320..989; rows 83 tall on a 100px pitch from y=350 */
const CARD = { left: 990, top: 320, width: 850, height: 670 }
const ROW = { left: 1027, width: 775, height: 83, firstTop: 350, pitch: 100 }
const OPS = ['Union', 'Intersection', 'Difference', 'Symmetric Difference']
const QUESTION = { left: 1027, top: 877, width: 775, height: 71 }

const centred = (x: number, y: number): CSSProperties => ({
  position: 'absolute',
  left: x,
  top: y,
  transform: 'translate(-50%, -50%)',
})

/** The two-people glyph in a coloured disc, 24px, beside each set's name. */
function People({ color }: { color: string }) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" aria-hidden style={{ display: 'block' }}>
      <circle cx={12} cy={12} r={12} fill={color} />
      <circle cx={9.5} cy={9} r={2.6} fill="#fff" />
      <circle cx={15} cy={9.6} r={2.1} fill="#fff" />
      <path d="M4.5 17.5c0-2.9 2.3-4.6 5-4.6s5 1.7 5 4.6z" fill="#fff" />
      <path d="M13.6 13.4c.5-.2 1-.3 1.4-.3 2.4 0 4.5 1.5 4.5 4.4h-4.2c0-1.7-.7-3.1-1.7-4.1z" fill="#fff" />
    </svg>
  )
}

/** The small Venn beside each operation: lit for the one in hand, grey otherwise. */
function MiniVenn({ lit }: { lit: boolean }) {
  const fill = lit ? '#4C7AFC' : '#E3E8EF'
  const stroke = lit ? colors.blue : '#B9C2CE'
  return (
    <svg width={76} height={46} viewBox="0 0 76 46" aria-hidden style={{ display: 'block' }}>
      <circle cx={27} cy={23} r={20} fill={fill} stroke={stroke} strokeWidth={2} />
      <circle cx={49} cy={23} r={20} fill={fill} stroke={stroke} strokeWidth={2} />
      {lit && <circle cx={27} cy={23} r={20} fill="none" stroke="#fff" strokeWidth={2} />}
      {lit && <circle cx={49} cy={23} r={20} fill="none" stroke="#fff" strokeWidth={2} />}
    </svg>
  )
}

export function SetOperationsFigure() {
  return (
    <>
      {/* the groups */}
      <div
        style={{
          position: 'absolute',
          ...PANEL,
          boxSizing: 'border-box',
          borderRadius: 24,
          border: `2px solid ${colors.blue}`,
          background: '#E9F0FF',
        }}
      />
      {/* both discs, then the lens where they overlap, then the strokes on top */}
      <svg
        aria-hidden
        style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
      >
        <circle cx={L_C.x} cy={L_C.y} r={R} fill="#A9C0FE" />
        <circle cx={R_C.x} cy={R_C.y} r={R} fill="#A9C0FE" />
        <clipPath id="set-ops-lens">
          <circle cx={L_C.x} cy={L_C.y} r={R} />
        </clipPath>
        <circle cx={R_C.x} cy={R_C.y} r={R} fill="#618BFC" clipPath="url(#set-ops-lens)" />
        <circle cx={L_C.x} cy={L_C.y} r={R} fill="none" stroke={colors.deep} strokeWidth={2} />
        <circle cx={R_C.x} cy={R_C.y} r={R} fill="none" stroke={TEAL} strokeWidth={2} />
      </svg>

      {/* the set names, code, over their discs */}
      <div style={{ position: 'absolute', left: 405, top: 374, display: 'flex', alignItems: 'center', gap: 14 }}>
        <People color={colors.deep} />
        <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 27, lineHeight: 1, color: colors.deep }}>cse</span>
      </div>
      <div style={{ position: 'absolute', left: 583, top: 374, display: 'flex', alignItems: 'center', gap: 14 }}>
        <People color={TEAL} />
        <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 27, lineHeight: 1, color: TEAL }}>cricket</span>
      </div>

      {/* the people, one chip each */}
      {CHIPS.map((c) => (
        <span
          key={c.name}
          style={{
            ...centred(c.x, c.y),
            height: 36,
            padding: '0 18px',
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: 999,
            background: colors.white,
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: 24,
            lineHeight: 1,
            color: INK,
            whiteSpace: 'nowrap',
          }}
        >
          {c.name}
        </span>
      ))}

      {/* the three regions, named */}
      {REGION_PILLS.map((p) => (
        <span
          key={p.text}
          style={{
            ...centred(p.x, 918),
            height: 44,
            padding: '0 20px',
            display: 'inline-flex',
            alignItems: 'center',
            boxSizing: 'border-box',
            borderRadius: 999,
            background: colors.white,
            border: '2px solid #DCE7FB',
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: 24,
            lineHeight: 1,
            color: colors.deep,
            whiteSpace: 'nowrap',
          }}
        >
          {p.text}
        </span>
      ))}

      {/* the operations */}
      <div
        style={{
          position: 'absolute',
          ...CARD,
          boxSizing: 'border-box',
          borderRadius: 24,
          border: '2px solid #EEF3FE',
          background: '#FAFCFF',
          boxShadow: '0 15px 51px -21px rgba(45,99,251,0.3)',
        }}
      />
      {OPS.map((op, i) => {
        const lit = i === 0
        return (
          <div
            key={op}
            style={{
              position: 'absolute',
              left: ROW.left,
              top: ROW.firstTop + i * ROW.pitch,
              width: ROW.width,
              height: ROW.height,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 28,
              padding: '0 22px',
              borderRadius: 14,
              border: lit ? `2px solid ${colors.blue}` : '2px solid #E8EFFA',
              background: lit ? colors.white : '#F9FAFF',
              boxShadow: lit ? '0 9px 24px -12px rgba(45,99,251,0.45)' : undefined,
            }}
          >
            <MiniVenn lit={lit} />
            <span
              style={{
                fontFamily: fonts.body,
                fontWeight: 600,
                fontSize: 34,
                lineHeight: 1,
                color: lit ? colors.deep : GREY,
              }}
            >
              {op}
            </span>
          </div>
        )
      })}

      {/* the question */}
      <div
        style={{
          position: 'absolute',
          ...QUESTION,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          borderRadius: 14,
          background: '#E8F0FF',
          boxShadow: `inset 5px 0 0 ${colors.deep}`,
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: 30,
          lineHeight: 1,
          color: INK,
        }}
      >
        Who is in the blue part?
      </div>
    </>
  )
}
