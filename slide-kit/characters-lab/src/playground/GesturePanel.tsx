import { memo, useState } from 'react'
import { ACTION_GROUPS } from '@/actions'
import type { PlayOptions } from '@/rig/useCharacter'
import { Check, Choice, Panel, Slider } from './controls'
import type { Apply } from './ExpressionPanel'

/* Grouped by the file each action came from; the order is the rig's, top down. */
const GROUPS = (['face', 'head', 'hands', 'body'] as const).map((name) => ({ name, names: ACTION_GROUPS[name] }))

/* A mirrored gesture plays under its name plus R (see track.ts mirror), so
   the wave button stays lit while waveR runs. */
const isCurrent = (name: string, current?: string) => current === name || current === name + 'R'

export const GesturePanel = memo(function GesturePanel({ apply, current }: { apply: Apply; current?: string }) {
  const [speed, setSpeed] = useState(1)
  const [amplitude, setAmplitude] = useState(1)
  const [side, setSide] = useState<'L' | 'R'>('L')
  const [loop, setLoop] = useState(false)

  const play = (name: string) => {
    const opts: PlayOptions = { speed, amplitude, side }
    if (loop) opts.loop = true
    apply((c) => c.play(name, opts))
  }

  return (
    <Panel
      title="Gestures"
      aside={
        <button type="button" className="btn small" onClick={() => apply((c) => c.stop())}>
          Stop
        </button>
      }
    >
      <Slider label="speed" value={speed} min={0.5} max={2} step={0.05} unit="x" onChange={setSpeed} />
      <Slider label="amplitude" value={amplitude} min={0.5} max={1.5} step={0.05} onChange={setAmplitude} />
      <div className="row">
        <span className="label">side</span>
        <Choice value={side} options={['L', 'R']} onChange={setSide} />
        <Check label="loop" checked={loop} onChange={setLoop} />
      </div>
      {GROUPS.map((g) => (
        <div key={g.name}>
          <div className="group-label">{g.name}</div>
          <div className="grid">
            {g.names.map((name) => (
              <button key={name} type="button" className={'btn small' + (isCurrent(name, current) ? ' active' : '')} onClick={() => play(name)}>
                {name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </Panel>
  )
})
