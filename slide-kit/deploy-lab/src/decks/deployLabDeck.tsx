import type { DeckMeta, SlideDef } from '@/deck/types'
import { ContentSlide } from '@/slides'
import { CloudArchitecture, type ArchState } from './figures/aws/CloudArchitecture'

/**
 * The session 10 figure gallery.
 *
 * One slide per architecture state, at the size a real slide gives a figure,
 * so a collision shows up here and not in a signed-off deck. Hard rule 17: the
 * harnesses see an <svg> or a positioned div as one box and will happily pass a
 * figure whose labels sit on top of each other.
 */
const STATES: { state: ArchState; title: string; lead: string }[] = [
  { state: 'gap', title: 'The Gap', lead: 'The images exist, the server exists, and nothing connects them' },
  { state: 'ssh', title: 'Logging In', lead: 'The instance is running and you can reach it on port 22' },
  { state: 'containers', title: 'Running the Stack', lead: 'Two containers and a volume, pulled from Docker Hub' },
  { state: 'doors', title: 'Opening the Doors', lead: 'The security group lets users in on 3000 and 8000' },
  { state: 'elastic', title: 'A Permanent Address', lead: 'The address stops moving, because it is about to be written into an image' },
  { state: 'jenkins', title: 'Jenkins Joins', lead: 'A second instance in the same VPC, and ngrok is no longer needed' },
  { state: 'finished', title: 'The Finished System', lead: 'One push, four stages, and an app on an address that never moves' },
]

export const deployLabDeck: SlideDef[] = STATES.map(({ state, title, lead }) => ({
  id: `arch-${state}`,
  section: 'Architecture',
  label: title,
  element: (
    <ContentSlide kicker="Architecture" title={title} lead={lead} lesson="Figure lab">
      <CloudArchitecture state={state} scale={0.98} />
    </ContentSlide>
  ),
}))

export const deployLabMeta: DeckMeta = {
  title: 'Session 10 Figure Designs',
  lesson: 'Figure lab',
}
