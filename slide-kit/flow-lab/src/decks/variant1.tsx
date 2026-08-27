import type { SlideDef } from '@/deck/types'
import { ContentSlide } from '@/slides'
import { RailFlow } from '@/ui/variants/RailFlow'

/**
 * VARIANT 1 — RailFlow, on the two slides the figure exists for.
 *
 * Slide 20 carries the concrete names the session uses, so the room sees that
 * the thing on the laptop and the thing on Docker Hub are the same image under
 * two names. Slide 38 drops the names and keeps the shape, so the cycle reads
 * as the general rule the session just proved.
 *
 * `issuedBy` is WHO TYPES THE COMMAND and never which way the image moves:
 * `left` for build and push, `right` for pull, because a pull is typed on the
 * receiving machine while the image still travels hub -> machine. See the doc
 * comment on `FlowLeg` in `src/ui/variants/types.ts`.
 *
 * Leg glosses are kept to a few words: an on-rail pill's caption has to fit the
 * 150px clear gap between two cards, and a long one wraps to four lines.
 *
 * Both slides have a `lead`: without one the header stops 48px higher and a
 * 980px-wide figure reaches into the reserved instructor-video rectangle
 * (x 913..1280, y 0..220), which fails `video-safe.mjs`.
 */

const SECTION = 'Rail'
const mono = (s: string) => <span className="font-mono">{s}</span>

export const variant1: SlideDef[] = [
  {
    id: 'v1-target-picture',
    section: SECTION,
    label: 'Rail · target picture',
    element: (
      <ContentSlide
        kicker="THE TARGET PICTURE"
        title="One image, three machines"
        lead="Build it once on your laptop, hand it to Docker Hub, and any machine can run it"
        tone="brand"
        lesson="Flow figure variants"
      >
        <RailFlow
          stations={[
            {
              kind: 'source',
              logo: 'docker',
              label: mono('nxttrendz-backend'),
              caption: 'on your laptop',
            },
            {
              kind: 'hub',
              logo: 'docker',
              label: <span className="font-mono text-body-sm">ravi123/nxttrendz-backend</span>,
              caption: 'on Docker Hub',
            },
            {
              kind: 'target',
              icon: 'devices',
              label: 'Any machine',
              caption: 'runs the same image',
            },
          ]}
          legs={[
            {
              issuedBy: 'left',
              label: 'docker push',
              sub: 'once, from your laptop',
            },
            {
              issuedBy: 'right',
              label: 'docker pull',
              sub: 'the same image, byte for byte',
            },
          ]}
          caption="Nobody copies files: every machine gets the exact image you tested"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'v1-cycle',
    section: SECTION,
    label: 'Rail · the cycle',
    element: (
      <ContentSlide
        kicker="THE WHOLE CYCLE"
        title="Build once, push once, pull everywhere"
        lead="Three commands carry every release, whatever machine sits at the far end"
        tone="brand"
        lesson="Flow figure variants"
      >
        <RailFlow
          stations={[
            {
              kind: 'source',
              logo: 'docker',
              label: mono('docker build'),
              caption: 'once, on one machine',
            },
            {
              kind: 'hub',
              logo: 'docker',
              label: 'Docker Hub',
              caption: 'the one shared copy',
            },
            {
              kind: 'target',
              icon: 'server',
              label: mono('docker run'),
              caption: 'laptop, server, CI',
            },
          ]}
          legs={[
            {
              issuedBy: 'left',
              label: 'docker push',
              sub: 'once per release',
            },
            {
              issuedBy: 'right',
              label: 'docker pull',
              sub: 'on every other machine',
            },
          ]}
          caption="Build is work you do once, pull is work every other machine does for itself"
        />
      </ContentSlide>
    ),
  },
]

export default variant1
