import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { ListBoxes, Show } from './pieces'
import { ROAD_TRIP } from './PlaylistHook'

/**
 * A LIST: ONE NAME, AN ORDERED ROW. Spec card C1, from deck slide 13's idea
 * on the hook's own row.
 *
 * The seven road_trip songs as joined boxes, in the hook's order, with the
 * position row empty. Press 2 drops the positions in one by one, 0 to 6, and
 * says why 0: Spotify said 1, Python says 0. The positions sit under the
 * boxes, smaller than the values (the spec's must line). Everything on the
 * frame is centred (content rule 38).
 */
export function ListRow() {
  const beat = useBeats(2)
  return (
    <>
      <div className="flex flex-col items-center gap-7 pt-4">
        <p className="text-center text-[24px] font-semibold leading-snug" style={{ color: colors.ink }}>
          Holds many items, in order, under one name
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between" style={{ width: 7 * 150 }}>
            <span className="rounded-lg px-3 py-1.5 font-mono text-[18px] font-bold text-white" style={{ background: colors.brandDark }}>
              road_trip
            </span>
            <span className="text-[18px] font-semibold" style={{ color: colors.body }}>
              7 songs
            </span>
          </div>
          <ListBoxes items={ROAD_TRIP} size="lg" width={150} joined posOn={beat >= 2} posStagger lane={false} />
        </div>
        <Show on={beat >= 2} className="flex flex-col items-center gap-1.5">
          <p className="text-center text-[24px] font-semibold leading-snug" style={{ color: colors.ink }}>
            Positions start at 0
          </p>
          <p className="text-center text-[17px] font-semibold" style={{ color: colors.muted }}>
            Spotify said 1, Python says 0
          </p>
        </Show>
      </div>
      <StepControls at={beat} total={2} />
    </>
  )
}
