import type { SlideDef } from '@/deck/types'
import { ContentSlide } from '@/slides'
import { HubOrbit } from '@/ui/variants/HubOrbit'

/**
 * VARIANT 2 — HubOrbit.
 *
 * Two slides, both from session 6: slide 20 "The Target Picture" and slide 38
 * "the whole cycle". Same figure, same contract, nothing but the props change.
 *
 * Both slides carry a `lead`. A lead-less header lets the body well rise to
 * y=168, and a 972px-wide figure would then reach into the instructor-video
 * rectangle (x 913..1280, y 0..220) and fail `video-safe.mjs`.
 *
 * A note on slide 38. The cycle has four stages and only two of them travel:
 * `docker push` and `docker pull` join two places, while `docker build` and
 * `docker run` happen ON one place. So build rides in the source station's
 * caption and run rides in the target station's caption. That keeps all four
 * stages on the slide without repeating the mistake this whole contract exists
 * to fix, which was promoting a command into a box of its own. It is still the
 * weaker of the two slides for this variant, because HubOrbit gives the middle
 * the loudest voice and the cycle's loudest stage is arguably `build`.
 *
 * On the legs: `issuedBy` says WHO TYPES the command and never which way the
 * image travels. The laptop runs `docker push`, so that leg is `left`; the
 * machine runs `docker pull`, so that leg is `right`. Both payload arrows still
 * point along the chain, laptop -> Hub -> machine, because that is where the
 * image actually goes. The old `direction: 'reverse'` on the pull leg is what
 * made three of the four variants draw the pull's arrowhead back at the Hub,
 * which told the room the image travels out of the machine and into Docker Hub.
 */

const SESSION = 'Flow figure lab'

export const variant2: SlideDef[] = [
  {
    id: 'v2-target-picture',
    section: 'Hub',
    label: 'Target picture',
    element: (
      <ContentSlide
        kicker="Where this is going"
        title="The target picture"
        lead="One image, one shared place, and any machine can run it"
        lesson={SESSION}
      >
        <HubOrbit
          stations={[
            {
              kind: 'source',
              tone: 'brand',
              logo: 'docker',
              label: 'Your laptop',
              caption: <span className="font-mono">nxttrendz-backend</span>,
            },
            {
              kind: 'hub',
              tone: 'brand',
              logo: 'docker',
              label: 'Docker Hub',
              caption: 'ravi123/nxttrendz-backend',
            },
            {
              kind: 'target',
              tone: 'accent',
              icon: 'server',
              label: 'Any machine',
              caption: 'runs the same image',
            },
          ]}
          legs={[
            { label: 'docker push', sub: 'once per release', issuedBy: 'left' },
            { label: 'docker pull', sub: 'on every machine', issuedBy: 'right' },
          ]}
          caption="Pushed once, pulled by as many machines as you like"
        />
      </ContentSlide>
    ),
    notes:
      'HubOrbit. The registry is the biggest card and it is in the middle, so the shared place reads before any label does. Push lifts off the laptop, pull falls out of the Hub: two different movements, not one arrow drawn twice. Both solid arrows point the way the image travels, left to right; the dashed hairline marked asks is who typed the command, and on the pull it runs the other way because the machine is the one asking. The stacked edges behind the machine on the right say many machines without inventing a second one.',
  },
  {
    id: 'v2-cycle',
    section: 'Hub',
    label: 'The cycle',
    element: (
      <ContentSlide
        kicker="The whole loop"
        title="Build once, run everywhere"
        lead="Two of these four commands travel, and two of them stay put"
        lesson={SESSION}
      >
        <HubOrbit
          stations={[
            {
              kind: 'source',
              tone: 'brand',
              logo: 'docker',
              label: 'One machine',
              caption: <span className="font-mono">docker build</span>,
            },
            {
              kind: 'hub',
              tone: 'brand',
              logo: 'docker',
              label: 'Docker Hub',
              caption: 'the one shared copy',
            },
            {
              kind: 'target',
              tone: 'accent',
              icon: 'server',
              label: 'Every machine',
              caption: <span className="font-mono">docker run</span>,
            },
          ]}
          legs={[
            { label: 'docker push', sub: 'once per release', issuedBy: 'left' },
            { label: 'docker pull', sub: 'on every machine', issuedBy: 'right' },
          ]}
          caption="Build is a one-machine job, run is an every-machine job, and the Hub is what joins them"
        />
      </ContentSlide>
    ),
    notes:
      'The same figure, no code change, only different props. Build and run sit in the captions of the machines they happen on, because neither of them travels: only push and pull cross the gap. If the room needs build and run given equal billing as stages, this is the variant to leave behind and a track figure is the right pick.',
  },
]

export default variant2
