import type { SlideDef, DeckMeta } from '@/deck/types'
import { BoundaryBridge, CodeBlock, FanOut, FileTree, SwapRows, Terminal, SpineFlow, LaneFlow, StepLedger, CircuitMap, GateFlow, ThreeLanes, TrackSwitch } from '@/ui'
import { TillRow } from '@/ui'
import type { FlowchartFigureProps } from '@/ui'
import { QueueBelt } from '@/ui/QueueBelt'
import { DashboardPanels } from '@/ui'
import { QUEUE_FIXTURE } from '@/ui/queueFigure'
import {
  WelcomeSlide,
  RecapSlide,
  AgendaSlide,
  SectionBreakerSlide,
  SectionBreakerImageSlide,
  ContentSlide,
  ContentLeftImageSlide,
  ContentRightImageSlide,
  ContentTopImageSlide,
  ContentBottomImageSlide,
  ContentNoteSlide,
  FlowChartSlide,
  OnlyImageSlide,
  ProceduralStepsSlide,
  ScenarioSlide,
  QuestionSlide,
  QuestionPointsSlide,
  CodeSyntaxSlide,
  CommandSyntaxSlide,
  CodeBuildSlide,
  StatusPointsSlide,
  ConversationSlide,
  ChatSlide,
  ChatCharacterSlide,
  QuizTimeSlide,
  BrandSlide,
  KeyTakeawaysSlide,
  PracticeSlide,
  FeedbackSlide,
  ThankYouSlide,
} from '@/slides'

export const sampleMeta: DeckMeta = {
  title: 'Introduction to REST APIs',
  course: 'Backend Development',
  lesson: 'REST APIs',
  presenter: 'NxtWave Instructor',
}

const FOOTER = 'REST APIs · Backend'

const serializerCode = `from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "price", "in_stock"]`

/**
 * The sample deck — a complete lesson that demonstrates every slide type in
 * the template. Duplicate this file and edit the array to build a new lesson.
 */
const viewCode = `from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer

@api_view(["GET"])
def product_list(request):
    products = Product.objects.all()
    data = ProductSerializer(products, many=True).data
    return Response(data)`


/*
  ONE PROCESS, RENDERED BY ALL SIX FLOW-CHART FIGURES.

  Deliberately a general process rather than a REST one: these figures go into
  every deck, and a fixture dressed in this lesson's content would be judged on
  how well it renders this lesson. It stresses every case the older `FlowChart`
  cannot draw: a decision written as a QUESTION with BOTH exits labelled, an
  exception branch, and a loop back to an earlier step.
*/
const reviewFlow: Pick<FlowchartFigureProps, 'nodes' | 'edges'> = {
  nodes: [
    { id: 'submit', kind: 'start', label: 'Work submitted', caption: 'the learner clicks send', icon: 'rocket', lane: 'Learner', detail: 'Nothing is checked yet. The work is queued and the learner gets an id they can quote.' },
    { id: 'checks', kind: 'step', label: 'Automated checks run', caption: 'format, tests, limits', icon: 'bolt', lane: 'Grading service', detail: 'Formatting, the test suite, and the size limit. Minutes, not hours, and it runs unattended.' },
    { id: 'gate', kind: 'decision', label: 'All checks pass?', icon: 'target', lane: 'Grading service', detail: 'The only automatic decision in the process. Everything after it is a person.' },
    { id: 'review', kind: 'step', label: 'A reviewer reads it', caption: 'judgement, not rules', icon: 'eye', lane: 'Reviewer', detail: 'A human reads for judgement: is the approach sound, not merely does it run.' },
    { id: 'fix', kind: 'step', label: 'Fix and resubmit', caption: 'as many times as needed', icon: 'pencil', lane: 'Learner', detail: 'The loop with no counter. A submission can come back through here any number of times.' },
    { id: 'done', kind: 'end', label: 'Marked complete', caption: 'feedback published', icon: 'check', lane: 'Reviewer', detail: 'Feedback is published and the attempt is closed. The loop cannot be re-entered.' },
  ],
  edges: [
    { from: 'submit', to: 'checks', kind: 'main' },
    { from: 'checks', to: 'gate', kind: 'main' },
    { from: 'gate', to: 'review', label: 'Yes', kind: 'main' },
    { from: 'gate', to: 'fix', label: 'No', kind: 'alt' },
    { from: 'fix', to: 'checks', label: 'run again', kind: 'loop' },
    { from: 'review', to: 'done', kind: 'main' },
  ],
}

const FLOW = { ...reviewFlow, caption: 'The straight run is four steps. Everything else is the loop.' }

/*
  HOW JENKINS WORKS, AS A PROCESS WITH BRANCHES.

  Lanes are the three OWNERS, in the order the work moves through them: the
  developer presses the button, Jenkins' queue holds the run, Jenkins' executor
  carries it out. Two of the three lanes are Jenkins, which is the point: the
  developer does one thing and the rest happens inside Jenkins, in two different
  places that are easy to mistake for one.

  The branch is the whole reason a queue exists. `Is an executor free?` has both
  exits labelled, and the `No` exit loops back to the same question rather than
  going anywhere, because waiting is not a step in the process: it is the same
  check being made again.

  Three lanes at LANE_H 118 plus 44 is 398px, which fits the well. A fourth lane
  would be 516 and would not.
*/
const JENKINS_LANES: Pick<FlowchartFigureProps, 'nodes' | 'edges' | 'caption'> = {
  nodes: [
    {
      id: 'trigger',
      kind: 'start',
      label: 'Click Build Now',
      caption: 'you trigger the saved job',
      lane: 'Developer',
      icon: 'play',
    },
    {
      id: 'queued',
      label: 'Run #4 is created',
      caption: 'joins the back of the line',
      lane: 'Jenkins queue',
      logo: 'jenkins',
    },
    {
      id: 'free',
      kind: 'decision',
      label: 'Is an executor free?',
      caption: 'this install has two slots',
      lane: 'Jenkins queue',
    },
    {
      id: 'running',
      label: 'Executor 1 takes #4',
      caption: 'one run per slot',
      lane: 'Jenkins executor',
      logo: 'jenkins',
    },
    {
      id: 'verdict',
      kind: 'end',
      label: 'You see the verdict',
      caption: 'passed or failed',
      lane: 'Developer',
      icon: 'check',
    },
    {
      id: 'waiting',
      label: 'Run #4 keeps waiting',
      caption: 'both slots are busy',
      lane: 'Jenkins queue',
      icon: 'info',
    },
  ],
  edges: [
    { from: 'trigger', to: 'queued', kind: 'main' },
    { from: 'queued', to: 'free', kind: 'main' },
    { from: 'free', to: 'running', label: 'Yes', kind: 'main' },
    { from: 'running', to: 'verdict', kind: 'main' },
    { from: 'free', to: 'waiting', label: 'No', kind: 'alt' },
    { from: 'waiting', to: 'free', label: 'asked again', kind: 'loop' },
  ],
  caption: 'A developer presses one button, and everything after it happens in two different places inside Jenkins',
}

export const sampleDeck: SlideDef[] = [
  {
    id: 'cand-queue-belt',
    section: 'Queue candidates',
    label: 'QueueBelt',
    notes:
      'CANDIDATE. QueueBelt draws the four words as one left-to-right belt, and its argument is that each of the four is a DIFFERENT KIND OF OBJECT rather than a fourth box in a row: the job is a dashed card that never moves, the trigger is an arrow carrying its own words, the build queue is a bounded well holding numbered tickets with the front of the line nearest the executors, and the executors are framed slots stacked ACROSS the belt end so the capacity is a count you can see. A free slot is an empty frame at full strength, never a dimmed busy one, so free reads as a state rather than a shade. It also matches what Jenkins puts on its own dashboard, two panels named Build Queue and Build Executor Status with a busy fraction. WORST AT: time. The belt is a spatial axis a reader will also read as a clock, and nothing in the geometry draws the dependency between the free slot and the front ticket, so the notes on the tickets are words doing a job the drawing does not do. Second weakest is the finished column, which reads as the belt continuing past the executors.',
    element: (
      <ContentSlide
        kicker="Candidate"
        title="QueueBelt"
        lead="One belt, left to right: the job, the trigger, the line that waits, and the slots that take from it"
        lesson="Queue Lab"
      >
        <QueueBelt {...QUEUE_FIXTURE} />
      </ContentSlide>
    ),
  },
  {
    id: 'cand-dashboard-panels-job',
    section: 'Queue candidates',
    label: 'What a job is',
    notes:
      "SETS UP THE FIGURE THAT FOLLOWS, and it exists because the flow slide uses four words the room has not met. This one defines only the FIRST of them. A job is saved instructions with a name, it sits on the dashboard, and it never moves: what moves is a run of it. Say the numbering out loud here, because the next slide draws #1, #2, #3 and #4 and expects the room to already know where those numbers come from. Do not describe the queue or the executors on this slide: one idea per slide, and the next one is where the panels arrive.",
    element: (
      <ContentSlide
        kicker="Jenkins"
        title="What a job is"
        lead="Before anything runs, you save the steps once and give them a name"
        points={[
          'A job is a saved set of steps you want Jenkins to carry out for you',
          'You create it once, name it, and it stays on the dashboard',
          'A job never moves and never runs by itself: something has to trigger it',
          'Each trigger creates a run of that job, numbered #1, then #2, then #3',
        ]}
        lesson={FOOTER}
      />
    ),
  },
  {
    id: 'cand-how-jenkins-works',
    section: 'Queue candidates',
    label: 'How Jenkins works',
    notes:
      "THE FLOW, BEFORE ANY PANEL IS DRAWN. LaneFlow is the right figure here because the question the room actually has is whose job each step is: the developer presses one button, and the two steps after it happen in two different places INSIDE Jenkins. Two of the three lanes are Jenkins on purpose. Walk the Yes exit first and only then the No exit, which loops back to the same question rather than moving on, because waiting is not a step: it is the same check made again. Say the words queue and executor here, since the next slide draws the two panels that carry those exact names on the dashboard.",
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="A process with branches"
        title="How Jenkins works"
        lead="One button from a developer, then two steps that happen inside Jenkins"
      >
        <LaneFlow {...JENKINS_LANES} />
      </ContentSlide>
    ),
  },
  {
    id: 'cand-dashboard-panels',
    section: 'Queue candidates',
    label: 'DashboardPanels',
    notes:
      "WHAT IT ARGUES: draw the thing the room already has on screen. Jenkins' own dashboard carries a Build Queue panel and a Build Executor Status panel with a busy-over-total count, so a developer who reads this figure can turn to their own screen and find the same two boxes with the same words on them. The count is derived from the executors array on every render, and a free slot is an empty dashed frame carrying the word free, never a dimmed busy one. WORST AT: the handoff. The moment a slot frees and the front of the line moves into it is the mechanism of the whole concept, and here it is one sentence in the queue panel's footer instead of geometry, because two side-by-side lists cannot show a run crossing between them. It also fits only two rows per panel, which is what Jenkins ships with: a third queued run or a third executor pushes the stage past the well.",
    element: (
      <ContentSlide
        kicker="Candidate"
        title="DashboardPanels"
        lead="Jenkins draws these two panels on its own dashboard, and this is the deck's drawing of them"
        lesson={FOOTER}
      >
        <DashboardPanels {...QUEUE_FIXTURE} />
      </ContentSlide>
    ),
  },
  {
    id: 'cand-till-row',
    section: 'Queue candidates',
    label: 'TillRow',
    notes:
      "WHAT IT ARGUES: draw it the way a supermarket is drawn, because that is the shape the room already owns from life. One vertical waiting line with the FRONT AT THE BOTTOM nearest the desks, two executor slots side by side as framed desks, and one connector that leaves the front of the line, runs along a counter rail and rises into BOTH desks with an arrowhead each, so the next ticket is visibly promised to neither: whichever frees up first takes it. Arrival is a real arrival, the job card sitting above the line with its trigger arrow landing on the TOP of the panel, which is the back of the line. Capacity is a count of frames rather than a number in a caption, and a free desk is an empty dashed frame carrying the word free at full strength, never a dimmed copy of the busy one. WORST AT: width, and therefore the size of a desk's note. The line is a column, so 268px of stage goes on two tickets that would fit in a 90px row, and the two desks plus the finished column share what is left, which leaves one short line per desk. It is also the weakest candidate on time: this is a snapshot, all four numbers true at one instant, and nothing in it moves, so the handoff of #3 into a freed slot is a sentence the instructor says rather than something the drawing shows. The vertical line costs a beat of orientation too, which is why the front ticket has to say front of the line in words.",
    element: (
      <ContentSlide
        kicker="Candidate"
        title="TillRow"
        lead="One waiting line, two desks, and a connector that reaches both because the next ticket is promised to neither"
        lesson={FOOTER}
      >
        <TillRow {...QUEUE_FIXTURE} />
      </ContentSlide>
    ),
  },
  {
    id: 'brand',
    label: 'Brand',
    transition: 'fade',
    notes:
      'THE OPENING FRAME. The mark and a greeting, nothing else: no session name, no course, no presenter. It carries no footer logo because the hero already is the logo, and two marks on one frame is the duplication rule 7 exists to stop. Keep the greeting SHORT and do not make it "Welcome to today\'s session": WelcomeSlide hardcodes that exact line as its kicker two slides later.',
    element: <BrandSlide greeting="Welcome!" lesson={FOOTER} />,
  },
  {
    id: 'sample-question',
    section: 'Slide types',
    label: 'Question',
    element: (
      <QuestionSlide
        question="If this image is rebuilt next month, does it install the same version?"
        qualifier="Assume nothing else about the project changed"
        lesson="Component Gallery"
      />
    ),
    notes:
      'THE PAUSE BEAT. One question, hero scale, optically centred, and nothing else on the slide. No bullets, no figure, no answer: the room answers out loud and the NEXT slide responds. A compound question gets split into two of these.',
  },
  {
    id: 'sample-question-choices',
    section: 'Slide types',
    label: 'Question · choices',
    element: (
      <QuestionSlide
        question="A container writes a file. The container is deleted and recreated. Is the file still there?"
        qualifier="Nothing else about the setup changes"
        choices={['Yes', 'No']}
        lesson="Component Gallery"
      />
    ),
    notes:
      'THE SAME PAUSE BEAT, WITH THE ANSWERS THE ROOM IS CHOOSING BETWEEN. `choices` takes two or three short strings and draws them as identical boxes under the question. It is FOR replacing the stage direction decks used to print as a bullet ("say yes or no before the next slide"), which told the room how to behave rather than showing it what it was picking. It must NOT carry a hint: the boxes are deliberately drawn the same, so never tint, tick, enlarge or order one of them to signal the answer, and never use it for more than three options. The answer is still the NEXT slide. Confusable with QuestionPointsSlide, which puts the ANSWER on the same frame as click-revealed points and is therefore the wrong type whenever the room is meant to commit first.',
  },
  {
    id: 'welcome',
    label: 'Welcome',
    transition: 'zoom',
    notes:
      'THE SESSION-NAME FRAME. `minimal` is the shipping form and the one the workflow specifies: the kicker "Welcome to today\'s session" plus the session name, centred, and NOTHING else in the body. No course chip, no presenter, no meta, no mascot, and no body logo, because the footer already carries the one mark. The full-bodied variant (course, subtitle, presenter, meta) still exists on the props type but no shipping deck uses it.',
    element: (
      <WelcomeSlide
        minimal
        title="Introduction to REST APIs"
        lesson={FOOTER}
      />
    ),
  },
  {
    id: 'recap',
    label: 'Recap',
    section: 'Warm-up',
    transition: 'slide',
    notes: 'Quick check that the ORM foundation is solid before layering APIs on top.',
    element: (
      <RecapSlide
        lesson={FOOTER}
        points={[
          { text: 'Models map Python classes to database tables', sub: 'via Django’s ORM' },
          { text: 'QuerySets let us read & filter rows lazily' },
          { text: 'Migrations version our schema over time' },
          { text: 'The admin site gave us CRUD for free' },
        ]}
      />
    ),
  },
  {
    id: 'agenda',
    label: 'Agenda',
    section: 'Warm-up',
    element: (
      <AgendaSlide
        lesson={FOOTER}
        items={[
          { title: 'What is a REST API?', sub: 'The vocabulary of the web' },
          { title: 'The request and response lifecycle', sub: 'What happens on every call' },
          { title: 'Django REST Framework', sub: 'Serializers, views and routing' },
          { title: 'Build an endpoint, step by step', sub: 'From model to JSON' },
        ]}
      />
    ),
  },
  {
    id: 'sec-1',
    label: 'Section · Concepts',
    section: 'Concepts',
    transition: 'cover',
    element: (
      <SectionBreakerSlide
        index={1}
        kicker="Section 1"
        title="What is a REST API?"
        subtitle="A shared language that lets a client ask a server for exactly what it needs."
      />
    ),
  },
  {
    id: 'what-is-api',
    label: 'What is an API',
    section: 'Concepts',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Core idea"
        title="An API is a contract between programs"
        lead="REST is the most common style for web APIs, built directly on top of HTTP."
        points={[
          { text: 'Resources are identified by URLs', sub: 'e.g. /api/products/42/', icon: 'target' },
          { text: 'Actions are expressed with HTTP verbs', sub: 'GET, POST, PUT, DELETE', icon: 'bolt' },
          { text: 'Communication is stateless', sub: 'each request stands alone', icon: 'arrow' },
          { text: 'Data usually travels as JSON', sub: 'lightweight & language-agnostic', icon: 'code' },
        ]}
      />
    ),
  },
  {
    id: 'content-split-default',
    label: 'Content · points beside a figure (default split)',
    section: 'Concepts',
    notes:
      'THE TWO-COLUMN MODE OF ContentSlide: pass BOTH `points` and children and the bullets and the figure sit side by side. This slide passes neither `split` nor `columnAlign`, so it is the historical rendering — the prose gets 1.4fr against the figure\'s 1fr (649px against 463px) and each column centres itself independently. Worst at: a figure that needs width. 463px is narrower than a `Terminal` line of any length, and `Terminal` wraps `break-words`, so it breaks an image name MID-TOKEN. Reach for `split="even"` there.',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Two columns"
        title="Points beside a figure"
        lead="The bullets and the figure are one idea, so they arrive together."
        points={[
          { text: 'The list keeps the wider column', icon: 'target' },
          { text: 'The figure takes what is left', icon: 'bolt' },
          { text: 'Both animate on slide entry', icon: 'arrow' },
        ]}
      >
        <Terminal
          path="C:\ecommerce"
          lines={[
            { text: 'docker ps', kind: 'cmd' },
            { text: 'CONTAINER ID   STATUS', kind: 'out' },
            { text: 'a41f9c2b       Up 2 minutes', kind: 'out' },
          ]}
          caption="Short lines fit the narrow column"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'client-server',
    label: 'Client–Server (right image)',
    section: 'Concepts',
    element: (
      <ContentRightImageSlide
        lesson={FOOTER}
        kicker="Mental model"
        title="Client asks, server answers"
        lead="Your mobile app or browser is the client; Django is the server."
        media={{ illustration: 'concept-api' }}
        caption="A single request/response round-trip"
        points={[
          { text: 'The client sends a request to a URL' },
          { text: 'The server does the work and responds' },
          { text: 'Every response carries a status code' },
        ]}
      />
    ),
  },
  {
    id: 'lifecycle',
    label: 'Request lifecycle (flow)',
    section: 'Concepts',
    transition: 'rise',
    notes:
      'A PROCESS WITH AN ORDER. Note what the colour does and does not do: the first and last nodes are FILLED because they are the two ends of the journey, and every station between them is a neutral white card on one accent because they are all the same kind of thing. Passing a per-node tone is still possible and marks one station out as different. It used to auto-assign a tone per position, which produced a five-colour rainbow encoding nothing. One continuous rail runs behind the row, and the arrows sit on it: that is what makes five cards read as one request travelling.',
    element: (
      <FlowChartSlide
        lesson={FOOTER}
        kicker="Under the hood"
        title="The request and response lifecycle"
        lead="What Django does with every API call."
        nodes={[
          { label: 'Client', caption: 'sends GET', icon: 'chat' },
          { label: 'URL Router', caption: 'urls.py', icon: 'route' },
          { label: 'View', caption: 'api_view', icon: 'code' },
          { label: 'Serializer', caption: 'builds JSON', icon: 'bolt' },
          { label: 'Response', caption: '200 OK', icon: 'check' },
        ]}
      />
    ),
  },
  {
    id: 'http-methods',
    label: 'HTTP methods (note)',
    section: 'Concepts',
    element: (
      <ContentNoteSlide
        lesson={FOOTER}
        kicker="Verbs"
        title="Four verbs cover most of REST"
        points={[
          { text: 'GET: read a resource', icon: 'arrow', tone: 'brand' },
          { text: 'POST: create a new resource', icon: 'arrow', tone: 'teal' },
          { text: 'PUT / PATCH: update a resource', icon: 'arrow', tone: 'accent' },
          { text: 'DELETE: remove a resource', icon: 'arrow', tone: 'info' },
        ]}
        note={{
          kind: 'tip',
          title: 'Keep GET safe',
          body: 'A GET request should never change server state. It is “safe”, so it can be retried or cached freely.',
        }}
      />
    ),
  },
  {
    id: 'question-points',
    label: 'Question + points',
    section: 'Concepts',
    notes:
      'THE PAUSE BEAT THAT ANSWERS ITSELF. At step 0 this is a QuestionSlide: the question and nothing else, so there is nothing to read instead of think. The points are BUILD STEPS and land only after the room has answered out loud, which is how it keeps content rule 16. Use QuestionSlide instead whenever the answer needs its own slide, a figure or a terminal. That is still the default.',
    element: (
      <QuestionPointsSlide
        lesson={FOOTER}
        question="Three apps need the same product list. How many times do you write the database query?"
        qualifier="Assume all three are built by different teams"
        points={[
          { text: 'Once, behind an API', sub: 'Every client asks the same URL' },
          { text: 'No client ever touches the database directly' },
          { text: 'Change the query in one place and all three follow' },
        ]}
      />
    ),
  },
  {
    id: 'conversation',
    label: 'Conversation (transcript)',
    section: 'Concepts',
    notes:
      'A TWO-VOICE EXCHANGE, SET AS A TRANSCRIPT. The dense form: speaker in the gutter, line beside it, full width for the words. Reach for it past four turns or past a dozen words a turn, where bubbles would run off the bottom of the frame. Exactly two voices, and the right-hand one is the voice the deck wants the room to leave in. Note that the name prints only when the speaker changes.',
    element: (
      <ConversationSlide
        lesson={FOOTER}
        kicker="Why an API"
        title="Why not just share the database?"
        speakers={{ left: 'Mobile dev', right: 'Backend dev' }}
        turns={[
          { side: 'left', text: 'Could you give the app the database password?' },
          { side: 'left', text: 'It would be one less network call.' },
          { side: 'right', text: 'Then every app carries a copy of your schema.' },
          { side: 'right', text: 'Rename one column and three apps break at once.' },
          { side: 'left', text: 'So the API is the contract?' },
          { side: 'right', text: 'Yes. The URL stays put, and the schema underneath stays free to change.' },
        ]}
      />
    ),
  },
  {
    id: 'chat',
    label: 'Chat (bubbles)',
    section: 'Concepts',
    notes:
      'THE SAME CONTENT AS A CONVERSATION SLIDE, DRAWN AS MESSAGES. Instantly legible as two people talking, at the cost of the empty column beside each bubble: five one-line turns, no more. Use it where the lesson IS a misconception being voiced and corrected, and the room needs to recognise itself in the first line. Two speakers who agree with each other are a BulletList in a costume.',
    element: (
      <ChatSlide
        lesson={FOOTER}
        kicker="Reading a response"
        title="A 404 is not a bug"
        speakers={{ left: 'Learner', right: 'Mentor' }}
        turns={[
          { side: 'left', speaker: 'Learner', text: 'GET /api/products/9 came back 404. Is the server broken?' },
          { side: 'right', speaker: 'Mentor', text: 'No. It understood you perfectly, and there is no product 9.' },
          { side: 'left', speaker: 'Learner', text: 'How do I tell that apart from a real failure?' },
          { side: 'right', speaker: 'Mentor', text: '4xx is you asking wrong. 5xx is the server falling over.' },
        ]}
      />
    ),
  },
  {
    id: 'chat-character',
    label: 'Chat with a character',
    section: 'Concepts',
    notes:
      'THE SAME THREAD, WITH NOVA BESIDE IT. The character gives the answering voice a face, which earns its place on the ONE slide in a concept where the exchange is the argument. On three chat slides in a row it is wallpaper, and rule 8 applies to characters too. Nova stands on the LEFT and faces right: the top right is held for the instructor video, and a character on that side would be gesturing off the edge of the slide. The column costs the thread 240px, so four short turns, not five.',
    element: (
      <ChatCharacterSlide
        lesson={FOOTER}
        kicker="Who does what"
        title="Where does the JSON come from?"
        speakers={{ left: 'Learner', right: 'Nova' }}
        turns={[
          { side: 'left', speaker: 'Learner', text: 'Who turns the model into JSON?' },
          { side: 'right', speaker: 'Nova', text: 'The serializer. It is the translator.' },
          { side: 'left', speaker: 'Learner', text: 'And who picks the status code?' },
          { side: 'right', speaker: 'Nova', text: 'Your view does, when it builds the Response.' },
        ]}
      />
    ),
  },
  {
    id: 'sec-2',
    label: 'Section · DRF (image)',
    section: 'DRF',
    transition: 'cover',
    element: (
      <SectionBreakerImageSlide
        index={2}
        kicker="Section 2"
        title="Django REST Framework"
        subtitle="The toolkit that makes building Web APIs fast, clean, and secure."
        media={{ illustration: 'concept-database' }}
      />
    ),
  },
  {
    id: 'serializers',
    label: 'Serializers (left image)',
    section: 'DRF',
    element: (
      <ContentLeftImageSlide
        lesson={FOOTER}
        kicker="The bridge"
        title="Serializers translate models ↔ JSON"
        lead="They’re the heart of DRF."
        media={{ illustration: 'concept-database' }}
        points={[
          { text: 'Convert querysets & instances → JSON' },
          { text: 'Validate incoming request data' },
          { text: 'ModelSerializer auto-builds the fields' },
        ]}
      />
    ),
  },
  {
    id: 'serializer-code',
    label: 'Serializer code',
    section: 'DRF',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Code"
        title="A ModelSerializer in practice"
        lead="Declare the model and the fields, and DRF handles the rest."
      >
        <CodeBlock
          code={serializerCode}
          filename="products/serializers.py"
          language="python"
          highlight={[4, 6]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'build-steps',
    label: 'Build steps (procedure)',
    section: 'DRF',
    element: (
      <ProceduralStepsSlide
        lesson={FOOTER}
        kicker="Step by step"
        title="Build a read-only endpoint"
        lead="From a model to live JSON in five moves."
        steps={[
          { title: 'Define the model', detail: 'A Product with name, price, in_stock', icon: 'book' },
          { title: 'Create a serializer', detail: 'Subclass ModelSerializer', icon: 'bolt' },
          { title: 'Write the view', detail: 'Decorate with @api_view(["GET"])', icon: 'code' },
          { title: 'Register the URL', detail: 'Map /api/products/ to the view', icon: 'target' },
          { title: 'Test in the browsable API', detail: 'DRF gives you a UI for free', icon: 'play' },
        ]}
      />
    ),
  },
  {
    id: 'view-code',
    label: 'View code (top image)',
    section: 'DRF',
    element: (
      <ContentTopImageSlide
        lesson={FOOTER}
        kicker="Putting it together"
        title="The view returns a Response"
        media={{ illustration: 'concept-api' }}
        points={[
          { text: '@api_view wires the function into DRF' },
          { text: 'Response serializes data & sets the status' },
        ]}
      />
    ),
  },
  {
    id: 'scenario',
    label: 'Scenario',
    section: 'DRF',
    element: (
      <ScenarioSlide
        lesson={FOOTER}
        kicker="Scenario"
        title="Why this matters"
        persona="E-commerce team"
        situation="The new mobile app needs to show a live product catalogue to shoppers."
        beats={[
          { label: 'Situation', detail: 'The app has no direct database access.', icon: 'info', tone: 'brand' },
          { label: 'Action', detail: 'Expose GET /api/products/ with a DRF view + serializer.', icon: 'code', tone: 'teal' },
          { label: 'Result', detail: 'The app fetches JSON and renders the catalogue anywhere.', icon: 'check', tone: 'success' },
        ]}
      />
    ),
  },
  {
    id: 'status-codes',
    label: 'Status codes (bottom image)',
    section: 'DRF',
    element: (
      <ContentBottomImageSlide
        lesson={FOOTER}
        kicker="Communicate outcomes"
        title="Status codes tell the client what happened"
        media={{ illustration: 'concept-api' }}
        points={[
          { text: '2xx: success (200 OK, 201 Created)', tone: 'success' },
          { text: '4xx: client error (404 Not Found)', tone: 'accent' },
          { text: '5xx: server error (500)', tone: 'info' },
        ]}
      />
    ),
  },
  {
    id: 'code-syntax',
    label: 'Code syntax',
    section: 'DRF',
    notes:
      'THE SHAPE OF A LANGUAGE CONSTRUCT, NOT ONE EXAMPLE OF IT. The specimen line is BUILT from the parts array, so the diagram and the legend under it cannot drift apart. Dashed underline plus the "you replace this" chip answers the first question every learner asks of a syntax line. Four parts is the height budget: a fifth leaves the bottom of the frame. This is not CodeBlock (a file) and not Terminal (a real run); see the quadrant table in SyntaxSlides.tsx.',
    element: (
      <CodeSyntaxSlide
        lesson={FOOTER}
        kicker="Routing"
        title="Anatomy of a URL pattern"
        language="python"
        parts={[
          { token: 'path', label: 'The URL helper', body: 'Imported from django.urls. One call per route.', after: '(' },
          { token: '"api/products/"', label: 'The pattern', fill: 'placeholder', body: 'What the client asks for. No leading slash, and keep the trailing one.', after: ', ' },
          { token: 'product_list', label: 'The view', fill: 'placeholder', body: 'The function that answers this URL. Passed, never called.', after: ', ' },
          { token: 'name="products"', label: 'The reverse name', body: 'Lets templates and tests name the URL instead of hardcoding it.', after: ')' },
        ]}
      />
    ),
  },
  {
    id: 'command-syntax',
    label: 'Command syntax',
    section: 'DRF',
    notes:
      'THE SHAPE OF A COMMAND. Same figure as the code variant, with a $ prompt instead of a language chip. It deliberately takes no folder path: rule 3 governs Terminal, which shows a command being RUN, and a prompt path here would claim a working directory this slide never demonstrates. Show the actual run in a Terminal on the next slide. Three parts plus a note is the budget.',
    element: (
      <CommandSyntaxSlide
        lesson={FOOTER}
        kicker="Project setup"
        title="Creating an app"
        parts={[
          { token: 'python manage.py', label: 'The task runner', body: 'Every project-level command goes through this file.' },
          { token: 'startapp', label: 'The task', body: 'One of about forty. runserver and migrate are the two you will type most.' },
          { token: 'products', label: 'Your app name', fill: 'placeholder', body: 'Lowercase, plural, no hyphens. It becomes a Python package.', after: '' },
        ]}
        note={{
          kind: 'warning',
          title: 'It is not wired up yet',
          body: 'Creating the app does not install it. Add it to INSTALLED_APPS or Django will never load its models.',
        }}
      />
    ),
  },
  {
    id: 'code-build',
    label: 'Code build',
    section: 'DRF',
    notes:
      'A REAL FILE, ASSEMBLED ONE KEY AT A TIME. Pass the WHOLE file as it stands on this slide, not just the new lines, and list the new ones in highlight: those are the lit ones. The annotation says what the new key does. Across a build sequence give CodeBlock a minHeight equal to its maxHeight, or the panel grows slide by slide and six steps of one file look like six different slides.',
    element: (
      <CodeBuildSlide
        lesson={FOOTER}
        kicker="The view"
        title="Answering GET"
        lead="One decorator, one queryset, one Response."
        code={viewCode}
        filename="products/views.py"
        highlight={[6]}
        annotation={{
          key: '@api_view(["GET"])',
          body: 'Turns a plain Python function into a DRF view, and rejects every verb except GET before your code runs.',
        }}
      />
    ),
  },
  {
    id: 'status-points',
    label: 'Status points (verdicts)',
    section: 'DRF',
    notes:
      'A LIST WHERE EVERY ROW CARRIES A VERDICT. Four kinds: success, info, warning, error. The verdict IS the content, so if every row would come out success this is a ContentSlide and the colour is decoration. Each row states its verdict in a word as well as a colour, so it survives a projector and greyscale. Rows are build steps by default; pass a figure as children and they switch to a staggered entrance, because rule 6 requires text and its visual to arrive together.',
    element: (
      <StatusPointsSlide
        lesson={FOOTER}
        kicker="Reading the outcome"
        title="Four ways a request can end"
        items={[
          { status: 'success', text: '200 OK', code: true, detail: 'The product list is in the body.' },
          { status: 'info', text: '201 Created', code: true, detail: 'A new product exists, and its URL is in the Location header.' },
          { status: 'warning', text: '404 Not Found', code: true, detail: 'The URL is fine, the product is not. This one is not a bug.' },
          { status: 'error', text: '500 Server Error', code: true, detail: 'Your view raised an exception. This one is a bug.' },
        ]}
      />
    ),
  },
  {
    id: 'flow-spine',
    label: 'Flow · SpineFlow',
    section: 'DRF',
    notes:
      'THE DEFAULT FLOW CHART when a process branches. The happy path is an unbroken horizontal line at full weight; the failure drops vertically out of the gate in amber and the loop returns underneath, so it can never be confused with progress. All six of these take the IDENTICAL props, so swapping one for another is a rename. They build one click at a time (Ctrl+arrow), assembling along the path, and the exception only starts once the happy path is complete. Worst at: more than one decision, because there is one row of "below" to drop into.',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="A process with branches"
        title="SpineFlow"
        lead="The happy path is a straight line, and everything else hangs off it."
      >
        <SpineFlow {...FLOW} />
      </ContentSlide>
    ),
  },
  {
    id: 'flow-lane',
    label: 'Flow · LaneFlow',
    section: 'DRF',
    notes:
      'THE SWIMLANE. The only one of the six that answers "whose job is that": a step sits in its owner\'s lane, so handoffs become visible as vertical moves and every crossing is a place the work can stall. It is the only figure that reads the `lane` field. Worst at: a process where every step has the same owner, which is a SpineFlow that has thrown away a third of its height. Needs three lanes to earn its keep.',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="A process with branches"
        title="LaneFlow"
        lead="The same process, but the vertical axis is who owns each step."
      >
        <LaneFlow {...FLOW} />
      </ContentSlide>
    ),
  },
  {
    id: 'flow-ledger',
    label: 'Flow · StepLedger',
    section: 'DRF',
    notes:
      'THE FLOW CHART WITH NO BOXES. STYLE_GUIDE section 8 applied to a process: boxes and arrows draw "discrete units connected by transitions", so if every transition is just "and then", the boxes are decoration. A number in the gutter, a rule per row, the words at full width. Wins on long labels, which every other figure here wraps inside a fixed slot. Worst at: shape. A loop back to step two is a line of text saying so, not a line you can point at.',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="A process with branches"
        title="StepLedger"
        lead="The same process with no boxes, no arrows and no diagram at all."
      >
        <StepLedger {...FLOW} />
      </ContentSlide>
    ),
  },
  {
    id: 'flow-circuit',
    label: 'Flow · CircuitMap',
    section: 'DRF',
    notes:
      'THE TEXTBOOK NOTATION: stadium terminals, rectangles, a real diamond, orthogonal connectors, every exit labelled. Reach for it when the room has met flow charts elsewhere and a house dialect would cost them more than it buys. Worst at: the diamond constrains the copy. Only its middle third is usable, so "All checks pass?" fits and anything longer does not, and the copy is the teaching.',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="A process with branches"
        title="CircuitMap"
        lead="The textbook notation, drawn properly."
      >
        <CircuitMap {...FLOW} />
      </ContentSlide>
    ),
  },
  {
    id: 'flow-gate',
    label: 'Flow · GateFlow',
    section: 'DRF',
    notes:
      'THE DECISION AS A BARRIER WITH PHYSICAL EXTENT. Steps are a card row; the decision is a tall bar standing across the line, with the happy path drawn UNDER it so the line passes through and emerges on the far side. Use it when the check is the point of the slide rather than one step among several. Worst at: a second decision, which has no third vertical level to occupy, and a question past about six words, which starts reading as a title for the whole figure.',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="A process with branches"
        title="GateFlow"
        lead="The decision is not a step. It is a barrier the work has to get past."
      >
        <GateFlow {...FLOW} />
      </ContentSlide>
    ),
  },
  {
    id: 'flow-track',
    label: 'Flow · TrackSwitch',
    section: 'DRF',
    notes:
      'THE ONE WHERE THE LOOP IS THE HERO. A railway: the happy path is one continuous straight rail with stations on it, and at the decision the track switches, peeling away on a curve to a lower return track that merges back on a mirrored curve. Straight line against curved detour is the whole design, and it makes rework feel like a detour that rejoins the journey rather than an arrow pointing backwards. Worst at: it buys one idea with the entire stage, and assumes exactly one loop with room to the right of the gate.',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="A process with branches"
        title="TrackSwitch"
        lead="A railway. The main line runs straight and rework peels off, then merges back."
      >
        <TrackSwitch {...FLOW} />
      </ContentSlide>
    ),
  },
  {
    id: 'boundary-bridge',
    label: 'Boundary bridge (figure)',
    section: 'DRF',
    notes:
      'FOR TWO MACHINES WITH A SHARED THING BETWEEN THEM. Read the constraint before reusing it: the dashed boundaries are labelled "One computer" and "A different computer" IN THE COMPONENT, and the hub carries "On neither machine". Those strings are hardcoded, so this figure ASSERTS a two-machine story with a registry in the middle. It is not a general three-step flow, and pointing it at one makes the slide claim something untrue (rule 8). For a plain process, use FlowChart. Two further rules: every payload arrow runs ALONG the chain, stations[i] to stations[i+1], so nothing points back up it, and `issuedBy` says who TYPED the command, drawn as a subordinate hairline and never as a second arrow. Here push is issued by the laptop (left) and pull by the server (right), and the data still travels left to right in both. Chosen from four candidate designs in slide-kit/flow-lab and promoted to the kit for session 6.',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Shipping it"
        title="Getting the API onto a server"
        lead="The image is built once, and the server pulls the same one."
      >
        <BoundaryBridge
          stations={[
            { label: 'Your laptop', caption: 'where you built the API', icon: 'code', kind: 'source' },
            { label: 'Docker Hub', caption: 'one copy, addressable by name', icon: 'server', kind: 'hub' },
            { label: 'The server', caption: 'runs what it pulled', icon: 'devices', kind: 'target' },
          ]}
          legs={[
            { label: 'docker push', sub: 'once per release', issuedBy: 'left' },
            { label: 'docker pull', sub: 'on every deploy', issuedBy: 'right' },
          ]}
          caption="The image never travels laptop to server directly. Neither machine has to trust the other."
        />
      </ContentSlide>
    ),
  },
  {
    id: 'fan-out',
    label: 'Fan out (figure)',
    section: 'DRF',
    notes:
      'FOR ONE ARTEFACT AND MANY LIVE COPIES OF IT. The source keeps its single box at full size while every connector leaves it at once, so the room reads MULTIPLICITY rather than sequence, and the source is drawn quiet on purpose (dashed, tinted, no live dot) because the mistake the figure prevents is reading the source as one of the running things. `live` is per copy, so "three containers, one of them stopped" is sayable. It must NOT carry any relationship BETWEEN the copies: they are peers with no connectors between them, so balanced traffic, a shared volume, or copy 2 made from copy 1 are all claims this figure does not make. Confusable with BoundaryBridge, which is two machines and a shared hub between them, and with FlowChart, which is a sequence: reach for FanOut only when one thing becomes several at once. Promoted out of session 1 v2, where it was a deck-local ImageFanout hardcoded to one image and three containers; the contract has no Docker in it.',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="One image, many containers"
        title="Fan out"
        lead="The image is built once. Every container is started from that one copy."
      >
        <FanOut
          source={{ label: 'Image', caption: 'built once, read only', icon: 'folder' }}
          copies={[
            { id: 'c1', label: 'Container 1', note: 'serving traffic', live: true },
            { id: 'c2', label: 'Container 2', note: 'serving traffic', live: true },
            { id: 'c3', label: 'Container 3', note: 'stopped, same image', live: false },
          ]}
          caption="Starting a container never changes the image, which is why the third one is identical to the first."
        />
      </ContentSlide>
    ),
  },
  {
    id: 'three-lanes',
    label: 'Three lanes (figure)',
    section: 'DRF',
    notes:
      'FOR THREE NAMED PRACTICES THAT DIFFER ONLY IN HOW FAR THEY REACH ALONG ONE CHAIN. Built for CI, Continuous Delivery and Continuous Deployment, and the contract carries no CI/CD in it: any set of terms whose relationship is CONTAINMENT along a shared sequence fits, and any set whose relationship is not containment does not. `terms` is INNERMOST FIRST and the array order IS the containment claim, so shuffling it is a content error rather than a layout one. `reaches` is the 1-based stage the automation reaches THROUGH, inclusive, and every span, dim boundary and marker in the figure derives from that one number, so no two parts of the figure can disagree about where a term stops. `approval` draws the human decision at a term\'s own boundary, which is the ONLY thing separating the two CDs in every published definition: span length alone states the difference and hides the why. Tones are ROLES (inner, middle, outer), not hexes, so a caller cannot reach a verdict hue: green, amber and red stay reserved for pass, warn and fail, and the ramp doubles as a luminance ramp so the three survive a greyscale projector. It reveals one lane per click, four beats on one frame, which is what lets one slide replace four definition slides without breaking content rule 25. Chosen from four candidates in slide-kit/cicd-reach-lab because it is the shape Atlassian, Red Hat, AWS, CircleCI, IBM and Bitrise all publish, so the room meets it again in any article they read, and because it is the only candidate that asks no lookup of the viewer. It costs height: 394px against the 425px ceiling, so it takes a slide with no points and a one-line lead. ReachBands is the same convention in 276px and stays in the lab.',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="How far the robot goes"
        title="Three lanes"
        lead="Same chain of stages. The three terms differ only in where the automation stops"
      >
        <ThreeLanes
          stages={[
            { n: 1, label: 'FETCH', caption: 'get the code' },
            { n: 2, label: 'TEST', caption: 'run the tests' },
            { n: 3, label: 'BUILD', caption: 'build the image' },
            { n: 4, label: 'PUSH', caption: 'image to the registry' },
            { n: 5, label: 'DEPLOY', caption: 'run on the server' },
          ]}
          terms={[
            { name: 'Continuous Integration', reaches: 2, then: 'You are told at once if it broke', tone: 'inner' },
            { name: 'Continuous Delivery', reaches: 4, then: 'Ready to go live, and it waits', approval: true, tone: 'middle' },
            { name: 'Continuous Deployment', reaches: 5, then: 'It goes live on its own', tone: 'outer' },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'file-tree',
    label: 'File tree (figure)',
    section: 'DRF',
    notes:
      'FOR "WHERE DOES THIS FILE GO". A slide that shows a file\'s CONTENTS never says which folder it belongs in, and "create a file called Dockerfile" is not an instruction until it does. `state` is what makes it teach: `new` is the file this slide asks them to create (brand, tagged once, on the top-level entry only), `existing` is already there from an earlier slide, `later` is named but not created yet (dashed, italic). `open` names the folder that STARTS open, and its children are drawn INSIDE a recessed well that belongs to it rather than as siblings indented by 22px. It is an accordion: every folder row with children is a real button, clicking one shuts whatever was open, there is no all-shut state, and the well reserves the tallest folder\'s height so nothing on the slide moves when the open folder changes. Use it whenever the tree runs past about six rows: session 4 shipped nine flat rows and the review read them as one list rather than as three folders. OMIT `open` and every folder renders expanded with no chevrons, which is what sessions 2 and 3 ship, so the prop is additive. It must NOT be used as a general nested list: the glyphs are a folder and a file, and the header row is a filesystem path, so pointing it at a taxonomy or a menu makes the slide claim something untrue (rule 8).',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="The starting point"
        title="Where the new file goes"
        lead="One folder open at a time, so the room reads three folders rather than one list."
      >
        <FileTree
          root="C:\project"
          open="backend"
          entries={[
            { name: 'backend', folder: true, state: 'existing' },
            { name: 'manage.py', depth: 1, state: 'existing' },
            { name: 'requirements.txt', depth: 1, state: 'existing', note: 'about to change' },
            { name: 'Dockerfile', depth: 1, state: 'new' },
            { name: '.dockerignore', depth: 1, state: 'later' },
            { name: 'frontend', folder: true, state: 'existing' },
            { name: 'package.json', depth: 1, state: 'existing' },
            { name: 'vite.config.js', depth: 1, state: 'existing' },
            { name: 'docker-compose.yml', state: 'later', note: 'the next section' },
          ]}
          caption="backend is open because this slide points at requirements.txt. Shut folders carry a count, not their contents."
        />
      </ContentSlide>
    ),
  },
  {
    id: 'swap-rows',
    label: 'Swap rows (figure)',
    section: 'DRF',
    notes:
      'FOR A COMPARISON WHERE ONE SIDE STANDS IN FOR THE OTHER. A phone\'s speed dial and a Makefile\'s targets; a Python function and a Makefile; a manual ritual and an automated one. Every row is ONE object divided internally, not two boxes with an arrow between them: the familiar side is recessed into it and the new side is raised out of it, so the pairing reads as the sentence "this stands in for that" with no glyph needed. That recessed-to-raised inversion is the argument, and therefore the constraint. It asserts a DIRECTION, so it must NOT be used for two alternatives being weighed against each other, which have none: a DataTable with identical row labels is the figure for that, and drawing peers this way claims something untrue (rule 8). `code` sets both cells of a pairing in monospace, because `make "up"` is a thing you type and reads as the name of an idea when set as prose. There is deliberately no emphasis flag; compareFigure.ts records why it was removed rather than kept and ignored. Chosen in slide-kit/comparison-lab over LedgerCompare, MirrorCards and CallerView, and that lab\'s CLAUDE.md says what each was worse at. Worst at: more than four pairings, because each row is a drawn object rather than a line of text.',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="One stands in for the other"
        title="Swap rows"
        lead="A Makefile does for your commands exactly what a function does for your code."
      >
        <SwapRows
          leftLabel="A Python function"
          rightLabel="A Makefile"
          pairs={[
            { from: 'make_coffee()', to: 'make "up"', code: true },
            { from: 'Body of the function', to: 'docker compose command under the target' },
            { from: 'Caller writes one line', to: 'Anyone running the project types one short word' },
            { from: 'Caller never reads the body', to: 'Nobody needs to know the Docker flags' },
          ]}
          caption="The long thing still exists. It has stopped being anybody's problem."
        />
      </ContentSlide>
    ),
  },
  {
    id: 'architecture',
    label: 'Architecture (only image)',
    section: 'DRF',
    transition: 'fade',
    element: (
      <OnlyImageSlide
        lesson={FOOTER}
        title="The full picture"
        media={{ illustration: 'concept-api' }}
        caption="Client → DRF View → Serializer → Database, and back again"
      />
    ),
  },
  {
    id: 'quiz-time',
    label: 'Quiz time',
    section: 'Wrap-up',
    transition: 'zoom',
    notes:
      'THE ANNOUNCEMENT FRAME, AND THE ONLY QUIZ FRAME A DECK HAS. It carries no question by design: questions are delivered by an external quiz component, so this hands over to it. QuizSlide was retired for exactly this reason and sync-kit.mjs deletes it from any session that still has it. Rule 18: every deck carries a quiz frame, and a lone one sits immediately before the takeaways. Content rule 28: the frame says "Quiz Time!" and nothing else, so no subtitle is passed here. Because the questions live in the external tool and not on the slide, any subtitle naming what the quiz covers previews the questions and answers some of them. It is also the one frame in the deck with nothing to read, which is what moves the room off the screen and onto the tool. QuizTimeSlideProps still declares an optional subtitle so every delivered session keeps compiling; do not use it.',
    element: <QuizTimeSlide lesson={FOOTER} />,
  },
  {
    id: 'takeaways',
    label: 'Key Takeaways',
    section: 'Wrap-up',
    notes:
      'THE AGENDA CONCEPTS, VERBATIM. Not reworded outcomes, not a fifth item, not a summary written fresh. The room was promised exactly these four things at the start and this frame is the receipt, so the strings must match the agenda character for character. What changes between the two slides is the UI, not the words. Session 5 shipped reworded outcomes here and they were replaced with the agenda strings.',
    element: (
      <KeyTakeawaysSlide
        lesson={FOOTER}
        points={[
          'What is a REST API?',
          'The request and response lifecycle',
          'Django REST Framework',
          'Build an endpoint, step by step',
        ]}
      />
    ),
  },
  {
    id: 'practice',
    label: 'Practice',
    section: 'Wrap-up',
    transition: 'rise',
    element: (
      <PracticeSlide
        lesson={FOOTER}
        title="Your turn to build"
        prompt="Create a read-only endpoint for the Product model."
        tasks={[
          'Write ProductSerializer (ModelSerializer)',
          'Add a product_list view with @api_view(["GET"])',
          'Wire /api/products/ in urls.py',
          'Return all products as JSON with Response',
        ]}
      />
    ),
  },
  {
    id: 'feedback',
    label: 'Feedback',
    section: 'Wrap-up',
    element: (
      <FeedbackSlide
        lesson={FOOTER}
        title="How did this session land?"
        prompt="Two minutes of feedback helps us make the next session sharper."
        link="nxtwave.tech/feedback"
      />
    ),
  },
  {
    id: 'thank-you',
    label: 'Thank you',
    transition: 'zoom',
    notes:
      'THE LAST FRAME, AND IT CARRIES TWO WORDS. No sign-off sentence, no recap of what the room can now do, and no "see you next session": the Next session frame sits immediately before this one and already names what is coming, and a summary here gives the deck two endings. `message` still exists on the props type for a deck that genuinely needs one line, but the default is nothing.',
    element: (
      <ThankYouSlide title="Thank you!" />
    ),
  },
]
