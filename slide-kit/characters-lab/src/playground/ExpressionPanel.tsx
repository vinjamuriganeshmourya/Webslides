import { memo, useState } from 'react'
import { EXPRESSIONS } from '@/actions'
import type { Controls } from '@/rig/useCharacter'
import { Panel, Slider } from './controls'

const NAMES = Object.keys(EXPRESSIONS)

export type Apply = (fn: (c: Controls) => void) => void

/* Memoised because the stage rerenders every frame in auto clock; this
   panel only needs to redraw when the current expression changes. */
export const ExpressionPanel = memo(function ExpressionPanel({ apply, current }: { apply: Apply; current: string }) {
  const [intensity, setIntensity] = useState(1)

  const setIntensityLive = (v: number) => {
    setIntensity(v)
    apply((c) => c.setExpression(c.current.expression, v))
  }

  return (
    <Panel title="Expressions">
      <Slider label="intensity" value={intensity} min={0} max={1.5} step={0.05} onChange={setIntensityLive} />
      <div className="grid">
        {NAMES.map((name) => (
          <button key={name} type="button" className={'btn small' + (name === current ? ' active' : '')} onClick={() => apply((c) => c.setExpression(name, intensity))}>
            {name}
          </button>
        ))}
      </div>
    </Panel>
  )
})
