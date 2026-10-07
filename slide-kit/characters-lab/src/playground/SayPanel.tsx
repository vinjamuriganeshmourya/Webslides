import { memo, useState } from 'react'
import { sayDuration } from '@/actions/talk'
import { Check, Panel, Slider } from './controls'
import type { Apply } from './ExpressionPanel'

export const SayPanel = memo(function SayPanel({ apply, talking }: { apply: Apply; talking: boolean }) {
  const [text, setText] = useState('Hello! Shall we start the session?')
  const [wpm, setWpm] = useState(150)
  const [emphasis, setEmphasis] = useState(true)

  const seconds = text.trim() ? sayDuration(text, wpm) : 0

  return (
    <Panel
      title="Say"
      aside={
        <span className={'dot' + (talking ? ' on' : '')} title={talking ? 'talking' : 'quiet'}>
          {talking ? 'talking' : 'quiet'}
        </span>
      }
    >
      <textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} />
      <Slider label="wpm" value={wpm} min={100} max={220} step={5} digits={0} onChange={setWpm} />
      <div className="row">
        <Check label="emphasis" checked={emphasis} onChange={setEmphasis} />
        <span className="muted">{seconds.toFixed(2)} s</span>
        <span className="spacer" />
        <button type="button" className="btn primary" disabled={!text.trim()} onClick={() => apply((c) => c.say(text, { wpm, emphasis }))}>
          Say
        </button>
      </div>
    </Panel>
  )
})
