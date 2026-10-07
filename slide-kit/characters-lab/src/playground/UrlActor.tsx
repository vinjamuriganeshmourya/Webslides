/* One actor, no controls. shoot.mjs screenshots #actor; record.mjs steps the
 * clock through window.__actors.main. The viewBox is 400x600, so width is
 * two thirds of the height we want. */
import { useEffect, useMemo } from 'react'
import { useCharacter } from '@/rig/useCharacter'
import { Character } from '@/rig/Character'
import { buildSkin } from '@/skins'
import { HAND_POSES, handKeys, type Action } from '@/actions'
import type { Tracks } from '@/rig/track'
import type { UrlSetup } from './url'

const REEL_HEIGHT = 1100
const SOLO_HEIGHT = 800

/* The hand grid wants one hand held where the camera sees it whole: the
   stopHand hold, palm out at the chest, fingers up. Built for the side that
   was asked rather than mirrored, because mirror() swaps channels ending in
   L or R and the finger channels (fL1..fL4) end in a digit. */
function holdHand(name: string, side: 'L' | 'R'): Action | null {
  const pose = HAND_POSES[name as keyof typeof HAND_POSES]
  if (!pose) {
    console.warn(`unknown hand pose "${name}"`)
    return null
  }
  const tracks: Tracks = handKeys(side, pose, 0)
  tracks[`shoulder${side}`] = [[0, 14]]
  tracks[`elbow${side}`] = [[0, 128]]
  tracks[`wrist${side}`] = [[0, 60]]
  return { name: `hand-${name}-${side}`, duration: 1, loop: true, group: 'hands', tracks }
}

export function UrlActor({ setup }: { setup: UrlSetup }) {
  const manual = setup.t !== undefined
  const ctrl = useCharacter({ id: 'main', clock: manual ? 'manual' : 'auto', seed: setup.seed })
  const skin = useMemo(() => buildSkin(setup.config), [setup.config])

  /* Runs once on mount: the URL is the whole script for this page. The
     seek comes last so a gesture started at t=0 is sampled at ?t. */
  useEffect(() => {
    if (setup.expression) ctrl.setExpression(setup.expression, setup.intensity)
    if (setup.gesture) ctrl.play(setup.gesture, setup.play)
    if (setup.handPose) {
      const hold = holdHand(setup.handPose, setup.play.side ?? 'L')
      if (hold) ctrl.play(hold)
    }
    if (setup.say) ctrl.say(setup.say)
    if (manual) ctrl.seek(setup.t!)
  }, [])

  /* The page edge must match the frame when a reel is cropped. */
  useEffect(() => {
    document.body.style.background = setup.bg
  }, [setup.bg])

  const height = setup.height ?? (setup.reel ? REEL_HEIGHT : SOLO_HEIGHT)
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
