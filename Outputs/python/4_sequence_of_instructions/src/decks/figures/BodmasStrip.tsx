import { Reveal, RevealGroup } from '@/motion/Reveal'
import { colors } from '@/design/tokens'
import { figureTiming as T, iconByName, type IconName } from '@/ui'

/**
 * B O D M A S, one tile per letter, with the word under each.
 *
 * The source drew this as an image with the six words baked in at about 10px.
 * Here every letter and word is a real label, and `lit` names the letters the
 * slide is about (the multiplication then the addition in `5 * 2 + 3 * 4`).
 *
 * SESSION-OWNED: one figure for one session. DOM, colours from tokens.
 */

const LETTERS: { letter: string; word: string; icon: IconName }[] = [
  { letter: 'B', word: 'Brackets', icon: 'code' },
  { letter: 'O', word: 'Orders', icon: 'star' },
  { letter: 'D', word: 'Division', icon: 'route' },
  { letter: 'M', word: 'Multiplication', icon: 'cross' },
  { letter: 'A', word: 'Addition', icon: 'plus' },
  { letter: 'S', word: 'Subtraction', icon: 'arrow' },
]

export function BodmasStrip({ lit = [], size = 'md', className = '' }: { lit?: string[]; size?: 'sm' | 'md'; className?: string }) {
  const tile = size === 'sm' ? 'h-[56px] w-[56px] text-[26px]' : 'h-[84px] w-[84px] text-[40px]'
  const word = size === 'sm' ? 'text-[12px]' : 'text-body-sm'
  return (
    <RevealGroup stagger={T.stagger} delayChildren={T.lead} className={`flex items-start justify-center gap-${size === 'sm' ? '3' : '5'} ${className}`}>
      {LETTERS.map((l) => {
        const on = lit.length === 0 || lit.includes(l.letter)
        const Icon = iconByName[l.icon]
        return (
          <Reveal key={l.letter} dir="up" className="flex flex-col items-center gap-2">
            <span
              className={`grid place-items-center rounded-card font-heading font-extrabold text-white shadow-card-soft ${tile}`}
              style={{ background: on ? colors.brand : colors.muted, opacity: on ? 1 : 0.45 }}
            >
              {l.letter}
            </span>
            <span className={`flex items-center gap-1 font-heading font-semibold ${word}`} style={{ color: on ? colors.ink : colors.muted }}>
              <Icon width={12} height={12} />
              {l.word}
            </span>
          </Reveal>
        )
      })}
    </RevealGroup>
  )
}
