import type { DeckMeta, SlideDef } from '@/deck/types'
import { ContentSlide } from '@/slides'
import { Shot, type ShotHighlight } from '@/ui'

/**
 * FULL-SCREEN CAPTURE ANNOTATION, a lab, not a session.
 *
 * Deployment session 9 walks a beginner through the AWS console, and the new
 * instruction for its captures is: do not crop, keep the whole screen, and
 * highlight the part. With a crop the learner cannot tell where the thing
 * they must click lives on the real screen. A 1568 px console lands on the
 * slide at about half size, so the current single dashed box is not enough
 * on its own. Each slide here shows one Shot option on a real capture from
 * `django_deployement_course/workflow/captures/session-9/`; the last combines
 * the three that are meant to travel together.
 *
 * Nothing but candidates, following socket-lab: no brand frame, no agenda.
 */

export const labMeta: DeckMeta = {
  title: 'Full-screen Capture Annotation Designs',
  course: 'slide-kit lab',
  lesson: 'Full-screen Capture Annotation Designs',
  presenter: 'NxtWave',
}

const LESSON = 'Full-screen Capture Annotation Designs'
const AWS = { src: '/assets/tech/aws.png', alt: 'AWS' }

/* Regions measured on the 1568x741 captures, as percentages of the image. */
const HOME_SEARCH: ShotHighlight = { left: 12.4, top: 1.9, width: 40.8, height: 5.1 }
const HOME_EC2_LINK: ShotHighlight = { left: 17.6, top: 67.6, width: 2.4, height: 3.8 }
const HOME_ACCOUNT: ShotHighlight = { left: 87.3, top: 0.5, width: 11.6, height: 3.6 }
const HOME_REGION: ShotHighlight = { left: 75.3, top: 2.4, width: 10.8, height: 4.2 }
const SEARCH_BOX: ShotHighlight = { left: 12.4, top: 1.9, width: 40.8, height: 5.1 }
const SEARCH_SERVICES_TAB: ShotHighlight = { left: 22.4, top: 19.4, width: 4.9, height: 3.6 }
const SEARCH_EC2_ROW: ShotHighlight = { left: 38.1, top: 17.5, width: 49.4, height: 11.9 }

export const labDeck: SlideDef[] = [
  {
    id: 'a-spotlight',
    label: 'a · spotlight',
    section: 'Options',
    notes:
      'OPTION A. The whole screen stays, everything outside the box dims to ink at 58 percent, the box keeps full brightness with a 3px amber border and a glow. The dim fades in over 520ms after the capture has landed, so the room sees the screen first and then sees it narrow to the one thing.',
    element: (
      <ContentSlide kicker="Option a" title="Spotlight" lead="The screen stays whole and everything that is not the target goes dark" lesson={LESSON}>
        <Shot
          src="/shots/01-console-home.png"
          alt="The whole AWS Console home page: the search box in the top bar, Recently visited with quick links to EC2, S3, CloudWatch and IAM, Welcome to AWS, and AWS Health"
          highlight={{ ...HOME_SEARCH, label: 'Search box, or press Alt+S' }}
          spotlight
          frameWidth={840}
          mark={AWS}
          caption="Console home. Every service starts from this search box"
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'b-step',
    label: 'b · step badge',
    section: 'Options',
    notes:
      'OPTION B. A circled number on the box corner, amber with ink text and a white ring so it separates from whatever the capture has underneath. The caption then says "1" and the learner can match it. On its own it adds little over a plain box; it earns its place once there are two or more.',
    element: (
      <ContentSlide kicker="Option b" title="Numbered Step Badge" lead="The box carries a number, so the caption and the instructor can say 1, 2, 3" lesson={LESSON}>
        <Shot
          src="/shots/01-console-home.png"
          alt="The whole AWS Console home page with the region selector, Asia Pacific (Mumbai), in the top bar"
          highlight={{ ...HOME_REGION, label: 'Region', labelAt: 'below' }}
          step={1}
          frameWidth={840}
          mark={AWS}
          caption="1 is the region selector. Every EC2 instance lives in the region shown here"
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c-inset',
    label: 'c · inset magnifier',
    section: 'Options',
    notes:
      'OPTION C. The EC2 quick link is 2.4 percent of the image width, about 21px on the slide. The inset is the same PNG shown again through a window at 2x, positioned with background-size and background-position, with the box drawn again inside it. A dashed line ties the two. The region is widened to a legible minimum so the zoom shows the link in its row, not a 40px sliver.',
    element: (
      <ContentSlide kicker="Option c" title="Inset Magnifier" lead="A target too small to read is shown again at 2x beside the screen" lesson={LESSON}>
        <Shot
          src="/shots/01-console-home.png"
          alt="The whole AWS Console home page, with the EC2 quick link under Recently visited"
          highlight={{ ...HOME_EC2_LINK, label: 'EC2 quick link', labelAt: 'below' }}
          inset="auto"
          frameWidth={820}
          mark={AWS}
          caption="Recently visited offers EC2 directly. It is the small blue link, magnified on the right"
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'd-multiple',
    label: 'd · multiple highlights',
    section: 'Options',
    notes:
      'OPTION D. Three boxes revealed in array order with a 130ms stagger, each with its own label and step. The order on screen is the order of clicks: type in the search box, confirm Services is the selected tab, click the EC2 row. Kept without a spotlight here so the option can be judged alone.',
    element: (
      <ContentSlide kicker="Option d" title="Several Highlights" lead="One box per click, revealed in the order the clicks happen" lesson={LESSON}>
        <Shot
          src="/shots/02-search-ec2.png"
          alt="The AWS Console with EC2 typed in the search box and the results panel open: Services selected in the left list, and EC2, Virtual Servers in the Cloud, as the first result"
          highlights={[
            { ...SEARCH_BOX, step: 1, label: 'Type EC2' },
            { ...SEARCH_SERVICES_TAB, step: 2, label: 'Services', labelAt: 'left' },
            { ...SEARCH_EC2_ROW, step: 3, label: 'Click EC2' },
          ]}
          frameWidth={840}
          mark={AWS}
          caption="1 type EC2, 2 results are grouped and Services is first, 3 the EC2 service row"
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'e-pointer',
    label: 'e · pointer',
    section: 'Options',
    notes:
      'OPTION E. The account menu sits in the top-right corner of the capture, so a label below it would cover the toolbar and a label to its right would leave the frame. The label is pushed 46px out to the left with an arrow back to the box. The arrow is drawn in the box\'s own coordinate space, so it needs no measurement.',
    element: (
      <ContentSlide kicker="Option e" title="Pointer" lead="When the label cannot sit under the box, it moves away and an arrow leads back" lesson={LESSON}>
        <Shot
          src="/shots/01-console-home.png"
          alt="The whole AWS Console home page, with the account menu AWS2 and the account ID in the top-right corner"
          highlight={{ ...HOME_ACCOUNT, label: 'Account menu', labelAt: 'left' }}
          pointer
          spotlight
          frameWidth={840}
          mark={AWS}
          caption="The account menu shows the account ID. Billing and sign out live here"
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'f-combined',
    label: 'f · spotlight + steps + inset',
    section: 'Recommended default',
    notes:
      'THE RECOMMENDED DEFAULT for a full-screen console capture. Spotlight to win the eye, numbered boxes in click order, and a magnifier only where a box is under 8 percent wide (the Services tab). The search box and the EC2 row are large enough to read at half size, so they get no inset, which keeps the right column to one window.',
    element: (
      <ContentSlide kicker="Recommended" title="Spotlight, Steps and Inset Together" lead="Dim the rest, number the clicks, magnify only what is too small to read" lesson={LESSON}>
        <Shot
          src="/shots/02-search-ec2.png"
          alt="The AWS Console with EC2 typed in the search box and the results panel open: Services selected in the left list, and EC2, Virtual Servers in the Cloud, as the first result"
          highlights={[
            { ...SEARCH_BOX, step: 1, label: 'Type EC2' },
            { ...SEARCH_SERVICES_TAB, step: 2, label: 'Services', labelAt: 'left' },
            { ...SEARCH_EC2_ROW, step: 3, label: 'Click EC2', labelAt: 'below' },
          ]}
          spotlight
          inset="auto"
          frameWidth={820}
          mark={AWS}
          caption="1 type EC2, 2 Services is the selected group, 3 click the EC2 row"
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
  },
]
