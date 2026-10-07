import { colors } from '@/design/tokens'
import { CodeBlock, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Ask, Show } from './pieces'

/**
 * FIND THE MISTAKE. Spec card A1, from deck slide 42 (the daily challenge).
 *
 * The code and the output it should give; the room says what it really
 * prints; the real output lands under the wanted one with the two differences
 * marked (Tiger and Fox went in as two items). Then: change one line. Line 3
 * becomes `animals += [wild_animals]` and the output matches.
 */
const BAD = "animals = ['cat', 'dog']\nwild_animals = ['Tiger', 'Fox']\nanimals += wild_animals\nprint(animals)"
const GOOD = "animals = ['cat', 'dog']\nwild_animals = ['Tiger', 'Fox']\nanimals += [wild_animals]\nprint(animals)"

function Panel({ title, tone, children, muted = false }: { title: string; tone: string; children: React.ReactNode; muted?: boolean }) {
  const tween = useTween(420)
  return (
    <div className="overflow-hidden rounded-card border border-line bg-white" style={{ boxShadow: '0 1px 2px rgba(16,32,58,0.07), 0 6px 14px -6px rgba(16,32,58,0.13)', opacity: muted ? 0.55 : 1, transition: tween }}>
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-1.5" style={{ background: `${tone}14` }}>
        <span className="inline-block h-3 w-3 rounded-full" style={{ background: tone }} />
        <span className="font-heading text-[16px] font-bold uppercase tracking-wider" style={{ color: colors.body }}>
          {title}
        </span>
      </div>
      <div className="px-4 py-3 font-mono text-[20px]" style={{ color: colors.ink, whiteSpace: 'pre' }}>
        {children}
      </div>
    </div>
  )
}

const Mark = ({ children, tone }: { children: React.ReactNode; tone: 'good' | 'bad' }) => (
  <span className="rounded-[4px] px-[3px] font-bold" style={tone === 'good' ? { color: colors.accentDark, background: '#FFF4EC' } : { color: colors.danger, background: '#FDECEC' }}>
    {children}
  </span>
)

export function SpotError() {
  const beat = useBeats(4)
  const fixed = beat >= 4
  return (
    <>
      <div className="flex items-start gap-10">
        <div className="flex w-[520px] shrink-0 flex-col gap-4">
          <CodeBlock code={fixed ? GOOD : BAD} filename="Python" chip={false} fontSize={18} rows={4} lines={fixed ? { 3: 'mark' } : beat >= 2 ? { 3: 'error' } : {}} />
          <Ask size={20}>{beat >= 3 && !fixed ? 'Change one line so it prints the wanted output' : fixed ? 'Brackets around it: one item, a whole list' : 'What does it really print?'}</Ask>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Panel title="Expected output" tone={colors.accent}>
            ['cat', 'dog', <Mark tone="good">[</Mark>'Tiger', 'Fox'<Mark tone="good">]</Mark>]
          </Panel>
          <Show on={beat >= 2}>
            <Panel title="Output" tone={fixed ? colors.success : colors.danger}>
              {fixed ? (
                <>['cat', 'dog', ['Tiger', 'Fox']]</>
              ) : (
                <>
                  ['cat', 'dog', <Mark tone="bad">'Tiger'</Mark>, <Mark tone="bad">'Fox'</Mark>]
                </>
              )}
            </Panel>
          </Show>
          <Show on={beat >= 2}>
            <p className="text-[17px] font-semibold" style={{ color: colors.body }}>
              {fixed ? 'The output matches' : 'Tiger and Fox went in as two items'}
            </p>
          </Show>
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
