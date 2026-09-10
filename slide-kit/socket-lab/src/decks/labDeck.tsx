import type { DeckMeta, SlideDef } from '@/deck/types'
import { ContentSlide } from '@/slides'
import { MachineBoundary } from '@/ui'
import {
  SocketBridgeA, SOCKET_A_CAPTION,
  SocketBridgeB, SOCKET_B_CAPTION,
  TunnelPathA, TUNNEL_A_CAPTION,
  TunnelPathB, TUNNEL_B_CAPTION,
} from '@/ui/variants/socketFixture'

/**
 * SOCKET AND TUNNEL FIGURES — a lab, not a session.
 *
 * Deployment session 8 needs two pictures the kit does not have. Hard rule 17
 * is why they are judged here instead of in the deck: the three harnesses
 * measure DOM rectangles, an `<svg>` is one rectangle to all three, and a
 * figure whose internal labels sit on top of one another passes every sweep.
 * A six-slide lab is a much cheaper picture than a 58-slide deck.
 *
 * NOTHING BUT CANDIDATES IS IN HERE, following cicd-lab and flowchart-lab: no
 * brand frame, no welcome, no agenda. A gallery whose first slides are chrome
 * makes the reader page past furniture to reach the thing being judged.
 *
 * TWO DECISIONS ARE OPEN, one per pair:
 *
 *   1 vs 2   slide 9's socket, as the general client/daemon lesson or drawn
 *            inside the Jenkins container from the start
 *   4 vs 5   slide 33's tunnel, as a straight path or as two phases
 *
 * Slide 3 is not a candidate. It is `MachineBoundary`, which already exists and
 * is used unchanged on slide 32, and it is here because slide 33's tunnel has
 * to read as the ANSWER to it. Judge the pair together or the tunnel is just a
 * diagram.
 */

export const labMeta: DeckMeta = {
  title: 'Socket and Tunnel Figure Designs',
  course: 'slide-kit lab',
  lesson: 'Socket and Tunnel Figure Designs',
  presenter: 'NxtWave',
}

const LESSON = 'Socket and Tunnel Figure Designs'

export const labDeck: SlideDef[] = [
  {
    id: 'v1-socket-general',
    label: '1 · Socket, general',
    section: 'Slide 9',
    notes:
      'CANDIDATE A. The claim slide 9 makes is that docker is a thin client and the daemon does the work. This draws exactly that and nothing else, so it is honest about the general case and says nothing yet about containers. Cost: slide 10 then has to redraw the whole thing to add the container boundary, which is two pictures for one idea.',
    element: (
      <ContentSlide kicker="Slide 9" title="Candidate A, the general lesson" lead={SOCKET_A_CAPTION} lesson={LESSON}>
        <SocketBridgeA />
      </ContentSlide>
    ),
  },
  {
    id: 'v2-socket-container',
    label: '2 · Socket, in the container',
    section: 'Slide 9',
    notes:
      'CANDIDATE B. Same wire, but both boundaries are drawn from the start: the Jenkins container on the left, the host on the right, and the socket punching through. Cost: it front-loads the container idea onto slide 9, which the plan puts on slides 10 and 11. Benefit: one picture serves 9, 10 and 11, and the room never sees a drawing it has to unlearn.',
    element: (
      <ContentSlide kicker="Slide 9" title="Candidate B, drawn in the container" lead={SOCKET_B_CAPTION} lesson={LESSON}>
        <SocketBridgeB />
      </ContentSlide>
    ),
  },
  {
    id: 'v3-existing-boundary',
    label: '3 · MachineBoundary, existing',
    section: 'Slide 32',
    notes:
      'NOT A CANDIDATE. This already exists in the kit and slide 32 uses it unchanged: a request from outside dying at the localhost boundary. It is here so the tunnel candidates can be judged as the answer to this picture. If the tunnel does not visibly undo what this shows, it is the wrong tunnel.',
    element: (
      <ContentSlide kicker="Slide 32" title="The problem, drawn by a figure we already have" lead="Why GitHub cannot reach localhost:8080" lesson={LESSON}>
        <MachineBoundary />
      </ContentSlide>
    ),
  },
  {
    id: 'v4-tunnel-straight',
    label: '4 · Tunnel, straight path',
    section: 'Slide 33',
    notes:
      'CANDIDATE A. Three boxes and two arrows: GitHub posts to ngrok, ngrok forwards to the laptop. Simple and quick to read. Cost: it does not say WHY this is allowed when a direct request was not, so a learner can leave thinking ngrok is magic that gives their laptop a public address.',
    element: (
      <ContentSlide kicker="Slide 33" title="Candidate A, the straight path" lead={TUNNEL_A_CAPTION} lesson={LESSON}>
        <TunnelPathA />
      </ContentSlide>
    ),
  },
  {
    id: 'v5-tunnel-two-phase',
    label: '5 · Tunnel, two phases',
    section: 'Slide 33',
    notes:
      'CANDIDATE B. Phase 1 is the laptop dialling OUT and holding the pipe open. Phase 2 is the webhook arriving and riding back down it. This is the fact that makes the whole thing work without a public address, and it directly answers slide 32. Cost: two labelled phases and five arrows is more to read, and the outbound arrow points right to left, against the reading direction.',
    element: (
      <ContentSlide kicker="Slide 33" title="Candidate B, two phases" lead={TUNNEL_B_CAPTION} lesson={LESSON}>
        <TunnelPathB />
      </ContentSlide>
    ),
  },
  {
    id: 'v6-pair-check',
    label: '6 · The pair, 32 then 33',
    section: 'Slides 32 and 33',
    notes:
      'Not a new drawing. Page between slide 3 and slide 5 of this lab and ask one question: does the tunnel undo the boundary? If the answer needs explaining, the pair has failed and the tunnel candidate is wrong, not the caption.',
    element: (
      <ContentSlide kicker="Slides 32 and 33" title="Judge these two together" lead="The tunnel has to read as the answer to the boundary" lesson={LESSON}>
        <TunnelPathB />
      </ContentSlide>
    ),
  },
]
