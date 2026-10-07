/* The lab: Arjun left, Riya right, each on its own clock and config, with
 * the shared panels on the right driving whichever the top bar says. */
import { useCallback, useRef, useState } from 'react'
import { useCharacter, type Controls, type IdleOptions } from '@/rig/useCharacter'
import { PRESETS } from '@/skins'
import { ActorColumn } from './ActorColumn'
import { ExpressionPanel } from './ExpressionPanel'
import { GesturePanel } from './GesturePanel'
import { SayPanel } from './SayPanel'
import { TopBar, type ClockMode, type Drive } from './TopBar'

const IDLE_DEFAULT: IdleOptions = { breath: true, blink: true, saccades: true, sway: true, liveliness: 1 }

export function Playground() {
  /* Different seeds so the two never blink or shift weight in step; two
     people standing together do not. */
  const left = useCharacter({ id: 'left', seed: 11, idle: IDLE_DEFAULT })
  const right = useCharacter({ id: 'right', seed: 23, idle: IDLE_DEFAULT })
  const [leftConfig, setLeftConfig] = useState(PRESETS.arjun)
  const [rightConfig, setRightConfig] = useState(PRESETS.riya)

  const [drive, setDrive] = useState<Drive>('both')
  const [clock, setClock] = useState<ClockMode>('auto')
  const [scrub, setScrub] = useState(0)
  const [idle, setIdle] = useState<IdleOptions>(IDLE_DEFAULT)

  /* The panels are memoised and get one stable `apply`; the ref keeps it
     pointing at this render's targets without rebuilding the callback
     every frame. In manual clock the hook redraws only on seek, so a click
     re-seeks the scrub time or the button would look dead. */
  const live = useRef({ targets: [] as Controls[], clock, scrub })
  live.current = { targets: drive === 'both' ? [left, right] : drive === 'left' ? [left] : [right], clock, scrub }
  const apply = useCallback((fn: (c: Controls) => void) => {
    const { targets, clock, scrub } = live.current
    for (const c of targets) {
      fn(c)
      if (clock === 'manual') c.seek(scrub)
    }
  }, [])

  /* Clock and idle are stage-wide: one time axis, one room. */
  const both = [left, right]
  const onClock = (mode: ClockMode) => {
    setClock(mode)
    for (const c of both) {
      c.setClock(mode)
      if (mode === 'manual') c.seek(scrub)
    }
  }
  const onScrub = (t: number) => {
    setScrub(t)
    for (const c of both) c.seek(t)
  }
  const onIdle = (next: IdleOptions) => {
    setIdle(next)
    for (const c of both) c.setIdle(next)
  }

  /* The panels report the state of one actor; with both driven, the left. */
  const lead = drive === 'right' ? right : left

  return (
    <div className="lab">
      <TopBar
        names={{ left: leftConfig.name, right: rightConfig.name }}
        drive={drive}
        onDrive={setDrive}
        clock={clock}
        onClock={onClock}
        scrub={scrub}
        onScrub={onScrub}
        idle={idle}
        onIdle={onIdle}
      />
      <div className="lab-main">
        <div className="stage">
          <ActorColumn side="left" ctrl={left} config={leftConfig} onConfig={setLeftConfig} selected={drive !== 'right'} onSelect={() => setDrive('left')} />
          <ActorColumn side="right" ctrl={right} config={rightConfig} onConfig={setRightConfig} selected={drive !== 'left'} onSelect={() => setDrive('right')} />
        </div>
        <aside className="dock">
          <ExpressionPanel apply={apply} current={lead.current.expression} />
          <GesturePanel apply={apply} current={lead.current.gesture} />
          <SayPanel apply={apply} talking={lead.current.talking} />
        </aside>
      </div>
    </div>
  )
}
