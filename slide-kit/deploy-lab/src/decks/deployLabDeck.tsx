import type { DeckMeta, SlideDef } from '@/deck/types'
import { ContentSlide } from '@/slides'
import { CloudArchitecture, type ArchState } from './figures/aws/CloudArchitecture'
import { Permissions } from './figures/Permissions'
import { TimeoutVsRefused } from './figures/TimeoutVsRefused'
import { WhoseLocalhost } from './figures/WhoseLocalhost'
import { LastMile } from './figures/LastMile'

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

/** The concept figures, each at the size a real slide gives it. */
const FIGURES: { id: string; title: string; lead: string; node: React.ReactNode }[] = [
  { id: 'perm-644', title: 'Permissions, as downloaded', lead: 'Three people can read the key, so SSH refuses to use it', node: <Permissions mode={644} /> },
  { id: 'perm-400', title: 'Permissions, after chmod 400', lead: 'Two of the three lines are cut, and only you are left', node: <Permissions mode={400} /> },
  { id: 'decoder', title: 'Timeout against refused', lead: 'They look similar and they mean opposite things', node: <TimeoutVsRefused /> },
  { id: 'localhost-bad', title: 'Whose localhost', lead: 'The frontend runs in the visitor browser, so localhost is their machine', node: <WhoseLocalhost /> },
  { id: 'localhost-good', title: 'Whose localhost, fixed', lead: 'Name the server, and the call reaches the machine the API is on', node: <WhoseLocalhost fixed /> },
  { id: 'lastmile', title: 'The last mile', lead: 'Three stages end at Docker Hub, and a person carries it the rest of the way', node: <LastMile /> },
  { id: 'lastmile-fixed', title: 'The last mile, bridged', lead: 'A fourth stage, and nobody logs in', node: <LastMile bridged /> },
]

deployLabDeck.push(
  ...FIGURES.map(({ id, title, lead, node }) => ({
    id: `fig-${id}`,
    section: 'Figures',
    label: title,
    element: (
      <ContentSlide kicker="Figure" title={title} lead={lead} lesson="Figure lab">
        {node}
      </ContentSlide>
    ),
  })),
)

export const deployLabMeta: DeckMeta = {
  title: 'Session 10 Figure Designs',
  lesson: 'Figure lab',
}
