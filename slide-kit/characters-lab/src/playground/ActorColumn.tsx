/* One actor on the stage: name, the figure, a status line and its own
 * Character panel. Clicking the figure makes it the one the panels drive. */
import { useMemo } from 'react'
import { Character } from '@/rig/Character'
import { buildSkin, type CharacterConfig } from '@/skins'
import type { Controls } from '@/rig/useCharacter'
import { CharacterPanel } from './CharacterPanel'

export const ACTOR_WIDTH = 420

type Props = {
  side: 'left' | 'right'
  ctrl: Controls
  config: CharacterConfig
  onConfig: (c: CharacterConfig) => void
  selected: boolean
  onSelect: () => void
}

export function ActorColumn({ side, ctrl, config, onConfig, selected, onSelect }: Props) {
  const skin = useMemo(() => buildSkin(config), [config])
  const { expression, gesture, talking } = ctrl.current

  return (
    <div className="actor-col">
      <h2>
        {config.name}
        <span className="muted">{ctrl.time.toFixed(2)} s</span>
      </h2>
      <div id={`actor-${side}`} data-skin={skin.id} className={'actor-box' + (selected ? ' selected' : '')} onClick={onSelect} title="Click to drive this actor">
        <Character pose={ctrl.pose} skin={skin} width={ACTOR_WIDTH} />
      </div>
      <div className="status">
        <span>{expression}</span>
        <span>{gesture ?? 'no gesture'}</span>
        <span className={'dot' + (talking ? ' on' : '')}>{talking ? 'talking' : 'quiet'}</span>
      </div>
      <CharacterPanel config={config} onChange={onConfig} />
    </div>
  )
}
