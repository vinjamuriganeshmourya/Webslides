import type { SlideDef, DeckMeta } from '@/deck/types'
import { CodeBlock } from '@/ui'
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
export const sampleDeck: SlideDef[] = [
  {
    id: 'welcome',
    label: 'Welcome',
    transition: 'zoom',
    notes: 'Set the tone. Confirm everyone can see the screen before starting.',
    element: (
      <WelcomeSlide
        course="Backend Development"
        title="Introduction to REST APIs"
        subtitle="How modern apps talk to servers — and how you’ll build that bridge with Django."
        presenter="NxtWave Instructor"
        meta="Module 4 · Session 12"
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
          { title: 'The request → response lifecycle', sub: 'What happens on every call' },
          { title: 'Django REST Framework', sub: 'Serializers, views & routing' },
          { title: 'Build an endpoint, step by step', sub: 'From model to JSON' },
          { title: 'Practice & wrap-up' },
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
        lead="REST is the most common style for web APIs — built directly on top of HTTP."
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
    element: (
      <FlowChartSlide
        lesson={FOOTER}
        kicker="Under the hood"
        title="The request → response lifecycle"
        lead="What Django does with every API call."
        nodes={[
          { label: 'Client', caption: 'sends GET', icon: 'chat', tone: 'brand', shape: 'pill' },
          { label: 'URL Router', caption: 'urls.py', icon: 'arrow', tone: 'teal' },
          { label: 'View', caption: 'api_view', icon: 'code', tone: 'accent' },
          { label: 'Serializer', caption: '→ JSON', icon: 'bolt', tone: 'brand' },
          { label: 'Response', caption: '200 OK', icon: 'check', tone: 'success', shape: 'pill' },
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
          { text: 'GET — read a resource', icon: 'arrow', tone: 'brand' },
          { text: 'POST — create a new resource', icon: 'arrow', tone: 'teal' },
          { text: 'PUT / PATCH — update a resource', icon: 'arrow', tone: 'accent' },
          { text: 'DELETE — remove a resource', icon: 'arrow', tone: 'info' },
        ]}
        note={{
          kind: 'tip',
          title: 'Keep GET safe',
          body: 'A GET request should never change server state — it’s “safe” and can be retried or cached freely.',
        }}
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
        lead="Declare the model and the fields — DRF handles the rest."
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
          { text: '2xx — success (200 OK, 201 Created)', tone: 'success' },
          { text: '4xx — client error (404 Not Found)', tone: 'accent' },
          { text: '5xx — server error (500)', tone: 'info' },
        ]}
      />
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
    id: 'takeaways',
    label: 'Key Takeaways',
    section: 'Wrap-up',
    element: (
      <KeyTakeawaysSlide
        lesson={FOOTER}
        points={[
          'REST uses URLs for resources and HTTP verbs for actions',
          'DRF serializers convert models ↔ JSON (and validate input)',
          '@api_view + Response build endpoints quickly',
          'Status codes communicate the outcome of every request',
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
    element: (
      <ThankYouSlide
        title="Thank you!"
        message="You can now turn a Django model into a live JSON API. See you next session."
      />
    ),
  },
]
