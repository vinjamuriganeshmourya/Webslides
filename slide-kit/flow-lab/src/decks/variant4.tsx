import type { SlideDef } from '@/deck/types'
import { ContentSlide } from '@/slides'
import { CargoTrack } from '@/ui/variants/CargoTrack'

/**
 * Variant 4 in the flow-figure lab: CargoTrack.
 *
 * Both slides pass the same shape of data, because the same figure has to carry
 * slide 20 and slide 38. Slide 20 names the places and the two commands. Slide
 * 38 keeps the identical three stops and changes only the altitude of the copy,
 * to the rhythm: once here, once across, any number of times over there.
 *
 * `build` is a station caption, not a leg. Nothing travels during a build: the
 * image is created where you already are, and CargoTrack's whole claim is that a
 * leg is a journey. Putting `docker build` on an arrow would be the same lie the
 * kit's `FlowChart` forced on the session-6 author.
 *
 * `issuedBy` replaces the old `direction` field, and it is not the same idea.
 * `direction: 'reverse'` used to turn the pull arrow around, which told the room
 * the image travels from the machine into Docker Hub. It does not. Both legs
 * carry the payload along the chain; `issuedBy: 'right'` says only that the
 * machine, not the laptop, is what types `docker pull`.
 *
 * Every slide carries a `lead`. A lead-less header lets a wide child ride up into
 * the reserved instructor-video rectangle (x 913..1280, y 0..220) and
 * `video-safe.mjs` fails the deck.
 */
export const variant4: SlideDef[] = [
  {
    id: 'v4-target-picture',
    section: 'Cargo',
    label: 'Target picture',
    element: (
      <ContentSlide
        kicker="Where we are heading"
        title="The Target Picture"
        lead="One image leaves your laptop, and the same image runs on machines you have never touched"
        lesson="Flow figure lab"
      >
        <CargoTrack
          stations={[
            {
              label: 'your laptop',
              caption: 'nxttrendz-backend',
              icon: 'devices',
              kind: 'source',
            },
            {
              label: 'Docker Hub',
              caption: 'ravi123/nxttrendz-backend',
              logo: 'docker',
              kind: 'hub',
            },
            {
              label: 'any machine',
              caption: 'docker run',
              icon: 'server',
              kind: 'target',
            },
          ]}
          legs={[
            { label: 'docker push', sub: 'you send it up', issuedBy: 'left' },
            { label: 'docker pull', sub: 'they ask for it', issuedBy: 'right' },
          ]}
          caption="The tile never changes on the way, which is the environment travelling inside the image"
        />
      </ContentSlide>
    ),
    notes:
      'The tile is the subject. Say the sentence while it is moving: the environment travelled inside the image. Then point at the last stop and note that nothing about the tile is different from the first stop.',
  },
  {
    id: 'v4-cycle',
    section: 'Cargo',
    label: 'The cycle',
    element: (
      <ContentSlide
        kicker="The whole rhythm"
        title="Build Once, Pull Anywhere"
        lead="Three commands, and only one of them ever runs more than once."
        lesson="Flow figure lab"
      >
        <CargoTrack
          stations={[
            {
              label: 'your machine',
              caption: 'docker build, once',
              icon: 'devices',
              kind: 'source',
            },
            {
              label: 'Docker Hub',
              caption: 'ravi123/nxttrendz-backend',
              logo: 'docker',
              kind: 'hub',
            },
            {
              label: 'every other machine',
              caption: 'docker run',
              icon: 'server',
              kind: 'target',
            },
          ]}
          legs={[
            { label: 'docker push', sub: 'once per release', issuedBy: 'left' },
            { label: 'docker pull', sub: 'as often as needed', issuedBy: 'right' },
          ]}
          caption="Build once, push once, and pull as many times as there are machines"
        />
      </ContentSlide>
    ),
    notes:
      'Same figure, same three stops. The only new information is how often each leg runs, which is why the counts sit under the commands and not in a bullet list.',
  },
]

export default variant4
