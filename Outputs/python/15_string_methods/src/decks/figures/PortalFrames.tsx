import { colors } from '@/design/tokens'
import { CodeBlock } from '@/ui'
import { OutputPanel } from '@/ui/CodeOutput'
import { Reveal, RevealGroup } from '@/motion/Reveal'
import { Boxes, Tag } from './common'

/**
 * The four STRIP and REPLACE portal frames the reference redraws inside its
 * cards (portal slides 30, 35, 36 and 38). Static: they arrive with the slide,
 * text and figure together (content rule 6). Every output is a real run.
 */

export function NotEqual() {
  return (
    <RevealGroup className="mx-auto flex w-fit items-center gap-10" stagger={0.2}>
      <Reveal dir="up">
        <div className="w-[640px]">
          <CodeBlock
            code={'mobile_1 = " 9876543210 "\nmobile_2 = "9876543210"\nis_same = (mobile_1 == mobile_2)\nprint(is_same)'}
            filename="Python"
            chip={false}
            fontSize={24}
          />
        </div>
      </Reveal>
      <Reveal dir="up">
        <div className="w-[260px]">
          <OutputPanel output="False" fontSize={30} />
        </div>
      </Reveal>
    </RevealGroup>
  )
}

export function DotStays() {
  return (
    <RevealGroup className="mx-auto flex w-fit items-center gap-12" stagger={0.2}>
      <Reveal dir="up">
        <div className="flex w-[500px] flex-col gap-4">
          <CodeBlock code={'name = "M.Ravi."\nname = name.strip(".")\nprint(name)'} filename="Python" chip={false} fontSize={24} />
          <OutputPanel output="M.Ravi" fontSize={30} />
        </div>
      </Reveal>
      <Reveal dir="up">
        <Boxes
          chars={[...'M.Ravi.']}
          size="lg"
          states={{ 1: 'stop', 6: 'gone' }}
          tags={{ 1: <Tag>stays</Tag>, 6: <Tag tone="muted">removed</Tag> }}
        />
      </Reveal>
    </RevealGroup>
  )
}

export function StripSet() {
  const parts = [
    { ch: '" "', name: 'a space' },
    { ch: '","', name: 'a comma' },
    { ch: '"."', name: 'a full stop' },
  ]
  return (
    <RevealGroup className="mx-auto flex w-fit items-center gap-12" stagger={0.2}>
      <Reveal dir="up">
        <div className="w-[640px]">
          <CodeBlock code={'name = ", ..  ,, ravi ,, .. ."\nname = name.strip(" ,.")\nprint(name)'} filename="Python" chip={false} fontSize={24} lines={{ 2: 'mark' }} />
        </div>
      </Reveal>
      <Reveal dir="up">
        <div className="flex flex-col gap-3">
          <p className="text-[24px]" style={{ color: colors.body }}>
            <span className="font-mono font-bold" style={{ color: colors.brandDark }}>" ,."</span> is three characters:
          </p>
          {parts.map((p) => (
            <span key={p.name} className="flex items-center gap-4 self-start rounded-xl px-4 py-2" style={{ background: colors.surface2, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
              <span className="w-[44px] font-mono text-[24px] font-bold" style={{ color: colors.brandDark, whiteSpace: 'pre' }}>{p.ch}</span>
              <span className="text-[21px]" style={{ color: colors.body }}>{p.name}</span>
            </span>
          ))}
          <p className="text-[21px]" style={{ color: colors.body }}>Any order, as many as there are.</p>
        </div>
      </Reveal>
    </RevealGroup>
  )
}

export function SpellingScenario() {
  const bar = (w: string) => <span className="block h-3.5 rounded-full" style={{ width: w, background: colors.surface2 }} />
  const teh = (
    <span style={{ color: colors.danger, textDecoration: `underline wavy ${colors.danger}`, textUnderlineOffset: 8 }}>teh</span>
  )
  return (
    <RevealGroup className="mx-auto flex w-fit items-center gap-12" stagger={0.2}>
      <Reveal dir="up">
        <div className="w-[640px] overflow-hidden rounded-card bg-white shadow-card-soft ring-1 ring-line">
          {/* a document, not code: its file name is what the scenario is about */}
          <div className="flex items-center gap-2 border-b border-line px-5 py-3" style={{ background: colors.surface }}>
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-3 w-3 rounded-full" style={{ background: colors.line }} />
            ))}
            <span className="ml-3 text-[17px] font-semibold" style={{ color: colors.body }}>notes.txt</span>
          </div>
          <div className="flex flex-col gap-4 px-8 py-7">
            {bar('84%')}
            {bar('66%')}
            <p className="py-2 font-mono text-[32px] font-medium" style={{ color: colors.ink }}>
              "{teh} cat and {teh} dog"
            </p>
            {bar('78%')}
            {bar('54%')}
          </div>
        </div>
      </Reveal>
      <Reveal dir="up">
        <div className="flex flex-col items-center gap-3">
          <span className="rounded-xl px-5 py-2 font-mono text-[32px] font-semibold" style={{ background: '#FDECEC', color: colors.danger, boxShadow: `inset 0 0 0 2px ${colors.danger}` }}>
            teh
          </span>
          <svg width="20" height="56" viewBox="0 0 20 56" aria-hidden>
            <path d="M10 2v44" stroke={colors.success} strokeWidth="3" strokeLinecap="round" />
            <path d="M3 40l7 12 7-12" fill="none" stroke={colors.success} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <span className="rounded-xl px-5 py-2 font-mono text-[32px] font-semibold" style={{ background: '#E9F8EF', color: '#137A3A', boxShadow: `inset 0 0 0 2px ${colors.success}` }}>
            the
          </span>
        </div>
      </Reveal>
    </RevealGroup>
  )
}
