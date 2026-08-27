import type { SlideDef } from '@/deck/types'
import { ContentSlide } from '@/slides'
import { BoundaryBridge } from '@/ui/variants/BoundaryBridge'

/**
 * VARIANT 3 — BoundaryBridge.
 *
 * Two slides, the same two the kit's `FlowChart` fails on: session 6 slide 20
 * (the target picture) and slide 38 (the whole cycle). Both carry a `lead`, so
 * the figure keeps the visual floor that holds the instructor-video rectangle
 * at x 913..1280, y 0..220 clear.
 */

const SECTION = 'Boundary'
const LESSON = 'Flow Figure Lab'

/** The repo name is a detail of the hub, not its name, so it rides as a caption. */
const REPO = <span className="font-mono">ravi123/nxttrendz-backend</span>

export const variant3: SlideDef[] = [
  {
    id: 'v3-target-picture',
    section: SECTION,
    label: 'BoundaryBridge · target picture',
    notes:
      'The two dashed boxes are the whole argument: the image is on ONE computer. Point at the orange span leaving the first boundary as you say push, then the teal span dropping into the second as you say pull. The commands sit in the gaps because a command is what crosses, not a box in a row.',
    element: (
      <ContentSlide
        kicker="The Target Picture"
        title="One Image, Two Machines"
        lead="Your image is stuck on your laptop until a registry carries it across"
        lesson={LESSON}
        tone="brand"
      >
        <BoundaryBridge
          stations={[
            {
              label: 'nxttrendz-backend',
              caption: 'built on your laptop',
              logo: 'docker',
              kind: 'source',
            },
            {
              label: 'Docker Hub',
              caption: REPO,
              logo: 'docker',
              kind: 'hub',
              tone: 'accent',
            },
            {
              label: 'Any machine',
              caption: 'runs the same image',
              icon: 'server',
              kind: 'target',
              tone: 'teal',
            },
          ]}
          legs={[
            { label: 'docker push', sub: 'once per release', issuedBy: 'left' },
            { label: 'docker pull', sub: 'on every machine', issuedBy: 'right' },
          ]}
          caption="The image only moves when a command crosses a machine boundary"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'v3-cycle',
    section: SECTION,
    label: 'BoundaryBridge · the cycle',
    notes:
      'Four commands, two computers. build and run never leave a boundary, so they are drawn inside one, vertical and blue. push and pull are the only spans on the bridge. Ask the room which two commands they would run on a brand new server and let them read the right box.',
    element: (
      <ContentSlide
        kicker="The Full Cycle"
        title="Build Once, Pull Everywhere"
        lead="Two steps run on the machine you build on, two on every machine that serves it"
        lesson={LESSON}
        tone="brand"
      >
        <BoundaryBridge
          stations={[
            {
              label: 'Your code',
              caption: 'plus a Dockerfile',
              icon: 'code',
              kind: 'source',
            },
            {
              label: 'Image',
              caption: 'built once',
              logo: 'docker',
              kind: 'source',
            },
            {
              label: 'Docker Hub',
              caption: REPO,
              logo: 'docker',
              kind: 'hub',
              tone: 'accent',
            },
            {
              label: 'Image',
              caption: 'pulled down',
              logo: 'docker',
              kind: 'target',
              tone: 'teal',
            },
            {
              label: 'Container',
              caption: 'serving traffic',
              icon: 'server',
              kind: 'target',
              tone: 'teal',
            },
          ]}
          legs={[
            { label: 'docker build', issuedBy: 'left' },
            { label: 'docker push', sub: 'once per release', issuedBy: 'left' },
            { label: 'docker pull', sub: 'on every machine', issuedBy: 'right' },
            { label: 'docker run', issuedBy: 'left' },
          ]}
          caption="build and run stay on one computer, push and pull are the two steps that leave it"
        />
      </ContentSlide>
    ),
  },
]

export default variant3
