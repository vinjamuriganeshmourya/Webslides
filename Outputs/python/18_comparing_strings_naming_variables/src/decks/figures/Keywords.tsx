import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Speaker } from './Characters'

/**
 * KEYWORDS. PF 18 slide 20: the 35 words Python keeps for itself (the real
 * `keyword.kwlist` of CPython 3.12), each behind a small lock. The second
 * press lights the ones the room already knows; the third shows the one line
 * that prints the list in the playground.
 */
const KW = ['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield']
const KNOWN = new Set(['if', 'for', 'while', 'in', 'break'])

const ANU: Record<number, ReactNode> = { 2: <>I know some! <b>if</b>, <b>for</b>, <b>while</b>, <b>in</b>, <b>break</b>...</> }
const PC: Record<number, ReactNode> = {
  1: <>These <b>35</b> words are mine<br />Python keeps them</>,
  2: <>So none of them can be a variable name</>,
  3: <>Type this in the playground to see them</>,
}

function Lock({ color }: { color: string }) {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden className="shrink-0">
      <rect x="1" y="6" width="10" height="7.5" rx="1.6" fill={color} />
      <path d="M3.2 6V4.2a2.8 2.8 0 0 1 5.6 0V6" fill="none" stroke={color} strokeWidth="1.6" />
    </svg>
  )
}

export function Keywords() {
  const beat = useBeats(3)
  const tween = useTween(360)
  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <div className="grid grid-cols-9 gap-2" style={{ width: 1010 }}>
          {KW.map((w) => {
            const lit = beat >= 2 && KNOWN.has(w)
            return (
              <span
                key={w}
                className="flex h-[40px] items-center justify-center gap-1.5 rounded-lg px-2 font-mono text-[16px] font-bold"
                style={{
                  background: lit ? colors.surface2 : colors.surface,
                  color: lit ? colors.brandDark : colors.ink,
                  border: `1.5px solid ${lit ? colors.brand : colors.line}`,
                  boxShadow: lit ? `0 0 0 3px ${colors.brand}22` : 'none',
                  transition: tween,
                }}
              >
                <Lock color={lit ? colors.brandDark : colors.muted} />
                {w}
              </span>
            )
          })}
        </div>
        <div className="flex w-full items-end justify-between pt-1">
          <Speaker who="anu" say={ANU[beat]} beatKey={beat} height={124} bubbleWidth={280} size={17} />
          <div className="w-[300px] self-center" style={{ opacity: beat >= 3 ? 1 : 0, transform: beat >= 3 ? 'none' : 'translateY(8px)', transition: tween }}>
            <CodeBlock code={'help("keywords")'} filename="Python" chip={false} fontSize={18} rows={1} />
          </div>
          <Speaker who="computer" look="3d" say={PC[beat]} beatKey={beat} height={114} bubbleWidth={250} size={17} />
        </div>
      </div>
      <StepControls at={beat} total={3} />
    </>
  )
}
