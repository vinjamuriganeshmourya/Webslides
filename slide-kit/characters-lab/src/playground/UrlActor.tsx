/* One actor, no controls. shoot.mjs screenshots #actor; record.mjs steps the
 * clock through window.__actors.main. The viewBox is 400x600, so width is
 * two thirds of the height we want. */
import { useEffect, useMemo } from 'react'
import { useCharacter } from '@/rig/useCharacter'
import { Character } from '@/rig/Character'
import { buildSkin } from '@/skins'
import type { UrlSetup } from './url'

const REEL_HEIGHT = 1100
const SOLO_HEIGHT = 800

export function UrlActor({ setup }: { setup: UrlSetup }) {
  const manual = setup.t !== undefined
  const ctrl = useCharacter({ id: 'main', clock: manual ? 'manual' : 'auto', seed: setup.seed })
  const skin = useMemo(() => buildSkin(setup.config), [setup.config])

  /* Runs once on mount: the URL is the whole script for this page. The
     seek comes last so a gesture started at t=0 is sampled at ?t. */
  useEffect(() => {
    if (setup.expression) ctrl.setExpression(setup.expression, setup.intensity)
    if (setup.gesture) ctrl.play(setup.gesture, setup.play)
    if (setup.say) ctrl.say(setup.say)
    if (manual) ctrl.seek(setup.t!)
  }, [])

  /* The page edge must match the frame when a reel is cropped. */
  useEffect(() => {
    document.body.style.background = setup.bg
  }, [setup.bg])

  const height = setup.reel ? REEL_HEIGHT : SOLO_HEIGHT
  const actor = (
    <div id="actor" data-skin={setup.skinId} data-clock={manual ? 'manual' : 'auto'}>
      <Character pose={ctrl.pose} skin={skin} width={Math.round((height * 2) / 3)} />
    </div>
  )

  if (setup.reel) {
    return (
      <div className="reel" style={{ background: setup.bg }}>
        {actor}
      </div>
    )
  }
  return (
    <div className="single" style={{ background: setup.bg }}>
      {actor}
    </div>
  )
}
