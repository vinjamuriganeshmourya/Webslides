import type { IdleOptions } from '@/rig/useCharacter'
import { Check, Segmented, Slider } from './controls'

export type Drive = 'left' | 'right' | 'both'
export type ClockMode = 'auto' | 'manual'

type Props = {
  names: { left: string; right: string }
  drive: Drive
  onDrive: (d: Drive) => void
  clock: ClockMode
  onClock: (m: ClockMode) => void
  scrub: number
  onScrub: (t: number) => void
  idle: IdleOptions
  onIdle: (i: IdleOptions) => void
}

const SCRUB_MAX = 10

export function TopBar({ names, drive, onDrive, clock, onClock, scrub, onScrub, idle, onIdle }: Props) {
  const idleFlag = (key: 'breath' | 'blink' | 'saccades' | 'sway') => (
    <Check key={key} label={key} checked={idle[key] !== false} onChange={(on) => onIdle({ ...idle, [key]: on })} />
  )

  return (
    <header className="topbar">
      <h1>Characters lab</h1>

      <div className="topbar-group">
        <span className="label">drive</span>
        <Segmented
          value={drive}
          options={[
            { value: 'left', label: names.left },
            { value: 'right', label: names.right },
            { value: 'both', label: 'Both' },
          ]}
          onChange={onDrive}
        />
      </div>

      <div className="topbar-group">
        <span className="label">clock</span>
        <Segmented
          value={clock}
          options={[
            { value: 'auto', label: 'Auto' },
            { value: 'manual', label: 'Manual' },
          ]}
          onChange={onClock}
        />
        {clock === 'manual' && (
          <div className="scrub">
            <Slider label="" value={scrub} min={0} max={SCRUB_MAX} step={0.01} unit=" s" onChange={onScrub} />
          </div>
        )}
      </div>

      <div className="topbar-group">
        <span className="label">idle</span>
        {(['breath', 'blink', 'saccades', 'sway'] as const).map(idleFlag)}
        <div className="liveliness">
          <Slider label="liveliness" value={idle.liveliness ?? 1} min={0} max={1} step={0.05} onChange={(liveliness) => onIdle({ ...idle, liveliness })} />
        </div>
      </div>
    </header>
  )
}
