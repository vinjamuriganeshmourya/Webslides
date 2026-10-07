import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'

/**
 * VALID OR NOT, AND WHY. PF 18 slide 21, worksheet task 3.
 *
 * Eight names along the top. One press lands one name in `Python accepts` or
 * `Python refuses` with the rule it met, in the reference's order; the latest
 * landing is ringed. The verdicts are `str.isidentifier()` and not a keyword,
 * checked on CPython 3.12 (plan outputs table).
 */
const NAMES = [
  { name: 'User_name', ok: true, why: 'Letters and an underscore. It begins with a letter' },
  { name: 'in', ok: false, why: 'Rule 4: in is a keyword. Python keeps it for itself' },
  { name: '(yes no)?', ok: false, why: 'Rule 2: a space, brackets and ? are not allowed' },
  { name: '1_age', ok: false, why: 'Rule 3: it begins with a digit' },
  { name: '_player_age', ok: true, why: 'It may begin with an underscore' },
  { name: 'total.bill', ok: false, why: 'Rule 2: a dot is a special character. Instagram allows it, Python does not' },
  { name: 'While', ok: true, why: 'Capital W. Python keywords are small, so While is not one' },
  { name: 'ravi_kumar2', ok: true, why: 'Digits are fine after the first letter' },
]

export function ValidOrNot() {
  const beat = useBeats(9)
  const tween = useTween(480)
  const landed = beat - 1 // how many names have landed
  const bins = (ok: boolean) => NAMES.map((n, i) => ({ ...n, i })).filter((n) => n.ok === ok)
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex h-[46px] items-center justify-center gap-3">
          {NAMES.map((n, i) => {
            const gone = i < landed
            return (
              <span
                key={n.name}
                className="overflow-hidden whitespace-nowrap"
                style={{ maxWidth: gone ? 0 : 220, opacity: gone ? 0 : 1, transition: tween }}
              >
                <span className="inline-block rounded-xl bg-white px-4 py-2 font-mono text-[18px] font-bold" style={{ color: colors.ink, border: `1.5px solid ${colors.line}`, boxShadow: '0 6px 24px -10px rgba(0,37,75,0.16)' }}>
                  {n.name}
                </span>
              </span>
            )
          })}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[true, false].map((ok) => (
            <div key={String(ok)} className="rounded-2xl px-2.5 pb-2.5 pt-2" style={{ background: ok ? '#E9F8EF' : '#FDECEC', border: `1.5px solid ${ok ? colors.success : colors.danger}55` }}>
              <p className="mb-2 px-1 font-heading text-[17px] font-bold" style={{ color: ok ? '#137A3A' : colors.danger }}>
                {ok ? 'Python accepts' : 'Python refuses'}
              </p>
              <div className="flex flex-col gap-2">
                {bins(ok).map((n) => {
                  const on = n.i < landed
                  const latest = n.i === landed - 1
                  return (
                    <div
                      key={n.name}
                      className="flex h-[64px] items-center gap-3 rounded-xl px-3.5"
                      style={{
                        background: on ? colors.white : 'rgba(255,255,255,0.45)',
                        border: `2px ${on ? 'solid' : 'dashed'} ${latest ? colors.brand : on ? colors.line : `${colors.line}`}`,
                        boxShadow: latest ? `0 0 0 3px ${colors.brand}22` : 'none',
                        transition: tween,
                      }}
                    >
                      <span className="w-[140px] shrink-0 font-mono text-[19px] font-bold" style={{ color: colors.ink, opacity: on ? 1 : 0, transition: tween }}>
                        {n.name}
                      </span>
                      <span className="text-[16px] leading-snug" style={{ color: colors.body, opacity: on ? 1 : 0, transition: tween }}>
                        <Lines lines={n.why.split('. ')} />
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <StepControls at={beat} total={9} />
    </>
  )
}
