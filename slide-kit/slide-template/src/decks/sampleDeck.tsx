import type { SlideDef, DeckMeta } from '@/deck/types'
import { BoundaryBridge, CodeBlock } from '@/ui'
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

export const sampleDeck: SlideDef[] = [
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
      'THE ANNOUNCEMENT FRAME, AND THE ONLY QUIZ FRAME A DECK HAS. It carries no question by design: questions are delivered by an external quiz component, so this hands over to it. QuizSlide was retired for exactly this reason and sync-kit.mjs deletes it from any session that still has it. Rule 18: every deck carries a quiz frame, and a lone one sits immediately before the takeaways.',
    element: (
      <QuizTimeSlide
        lesson={FOOTER}
        subtitle="Four questions on serializers, views and status codes."
      />
    ),
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
