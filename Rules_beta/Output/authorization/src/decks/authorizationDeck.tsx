import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  ContentSlide,
  FeedbackSlide,
  KeyTakeawaysSlide,
  QuizTimeSlide,
  SectionBreakerSlide,
  StatusPointsSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import {
  AnalogyMap,
  BulletList,
  Callout,
  Card,
  Chip,
  CodeBlock,
  SpineFlow,
  ObjectState,
  StatusList,
  type FlowchartFigureProps,
  type StatusItem,
} from '@/ui'
import { ArrowRight, Check, Cross } from '@/ui/icons'

/**
 * AUTHORIZATION, THE 30-SLIDE CUT.
 *
 * Plan: `Rules_beta/session_plans/authorization/plan.md` (signed off
 * 2026-09-25). Source: `Rules_beta/Trdocs/17. Authorization.pdf`.
 *
 * Five code slides only (C9, C14, C19, C26, C27). Every other idea the source
 * showed as code is drawn from kit blocks: request and response pairs as a
 * request card and a verdict row, the repeated check as three cards, the method
 * groups as chips. The facts are the source's own.
 *
 * Every content slide goes through a kit slide type, and every kit light type
 * lays out through `ZonedFrame` (content rule 22). Headings stay on one line
 * (content rule 25): a title that wraps gets shorter words.
 */

export const authorizationMeta: DeckMeta = {
  title: 'Authorization',
  course: 'Django REST Framework',
  lesson: 'Authorization',
  presenter: 'NxtWave Instructor',
}

const SESSION = 'Authorization'

const CONCEPTS = [
  'Why Permissions?',
  'IsAuthenticated',
  'Read vs Write',
  'Role-based Authorization',
] as const

/* ------------------------------------------------------------------ */
/* Small compositions of kit blocks                                    */
/* ------------------------------------------------------------------ */

/** A request as it is sent: method and URL, then any header lines. */
function RequestCard({ title = 'Request', lines }: { title?: string; lines: string[] }) {
  return (
    <Card title={title} icon="globe" className="h-full">
      <div className="mt-3 flex flex-col gap-2">
        {lines.map((l) => (
          <p key={l} className="break-all font-mono text-lg text-ink">
            {l}
          </p>
        ))}
      </div>
    </Card>
  )
}

/** A request on the left, what came back on the right, one arrow between. */
function Exchange({ request, response }: { request: string[]; response: StatusItem }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
      <RequestCard lines={request} />
      <span className="text-brand">
        <ArrowRight width={36} height={36} />
      </span>
      <div>
        <p className="mb-2 font-heading text-body-sm font-bold uppercase tracking-wider text-muted">
          Response
        </p>
        <StatusList immediate items={[response]} />
      </div>
    </div>
  )
}

/** HTTP method chips, one group. */
function MethodGroup({
  label,
  methods,
  tone,
  note,
}: {
  label: string
  methods: string[]
  tone: 'success' | 'accent'
  note: ReactNode
}) {
  return (
    <Card title={label} className="h-full">
      <div className="mt-3 flex flex-wrap gap-2.5">
        {methods.map((m) => (
          <Chip key={m} tone={tone} solid className="font-mono">
            {m}
          </Chip>
        ))}
      </div>
      <p className="mt-4 text-lg text-ink">{note}</p>
    </Card>
  )
}

/** A short "Label: text" line inside a card. */
function Line({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p className="text-lg text-ink">
      <span className="font-semibold">{label}: </span>
      {children}
    </p>
  )
}

/* The access matrix: read and write, per kind of user, under one rule. */

type Access = readonly [read: boolean, write: boolean]

const USERS = ['Anonymous', 'Customer', 'Seller'] as const
const USER_SUB = ['no token', 'logged in', "user_type='seller'"] as const

function Mark({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-success-100 text-success-600">
      <Check width={18} height={18} />
    </span>
  ) : (
    <span className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-danger-100 text-danger-600">
      <Cross width={18} height={18} />
    </span>
  )
}

function AccessCard({ rule, sub, access }: { rule: string; sub: ReactNode; access: Access[] }) {
  return (
    <div className="h-full rounded-card border border-line bg-white p-5 shadow-card-soft">
      <p className="font-mono text-lg font-bold text-brand-700">{rule}</p>
      <p className="mt-1 text-body-sm text-body">{sub}</p>
      <div className="mt-4 grid grid-cols-[1.6fr_1fr_1fr] items-center gap-y-3 text-center">
        <span />
        <span className="text-body-sm font-semibold text-muted">Read</span>
        <span className="text-body-sm font-semibold text-muted">Write</span>
        {USERS.map((u, i) => (
          <div key={u} className="contents">
            <span className="text-left">
              <span className="block text-lg font-semibold text-ink">{u}</span>
              <span className="block font-mono text-sm text-muted">{USER_SUB[i]}</span>
            </span>
            <Mark ok={access[i][0]} />
            <Mark ok={access[i][1]} />
          </div>
        ))}
      </div>
    </div>
  )
}

const IS_AUTH: Access[] = [
  [false, false],
  [true, true],
  [true, true],
]
const IS_AUTH_OR_RO: Access[] = [
  [true, false],
  [true, true],
  [true, true],
]
const IS_SELLER: Access[] = [
  [true, false],
  [true, false],
  [true, true],
]

/* ------------------------------------------------------------------ */
/* Flow charts                                                         */
/* ------------------------------------------------------------------ */

const CHECKPOINT: Pick<FlowchartFigureProps, 'nodes' | 'edges'> = {
  nodes: [
    { id: 'req', kind: 'start', label: 'Request arrives', caption: 'from any client', icon: 'globe' },
    { id: 'gate', kind: 'decision', label: 'Rule says yes?', icon: 'shield' },
    { id: 'view', kind: 'step', label: 'Your view runs', caption: 'the real work', icon: 'code' },
    { id: 'resp', kind: 'end', label: 'Response sent', caption: 'data or a change', icon: 'check' },
    { id: 'block', kind: 'step', label: 'Blocked', caption: 'the view never runs', icon: 'lock' },
  ],
  edges: [
    { from: 'req', to: 'gate', kind: 'main' },
    { from: 'gate', to: 'view', label: 'Yes', kind: 'main' },
    { from: 'gate', to: 'block', label: 'No', kind: 'alt' },
    { from: 'view', to: 'resp', kind: 'main' },
  ],
}

const TOKEN_USED: Pick<FlowchartFigureProps, 'nodes' | 'edges'> = {
  nodes: [
    { id: 'req', kind: 'start', label: 'Request', caption: 'with a Bearer token', icon: 'key' },
    { id: 'jwt', kind: 'step', label: 'JWT reads it', caption: 'finds the user', icon: 'eye' },
    { id: 'gate', kind: 'decision', label: 'Is there a user?', icon: 'shield' },
    { id: 'ok', kind: 'end', label: 'Allowed', caption: 'the view runs', icon: 'check' },
    { id: 'no', kind: 'step', label: 'Blocked', caption: '401 Unauthorized', icon: 'lock' },
  ],
  edges: [
    { from: 'req', to: 'jwt', kind: 'main' },
    { from: 'jwt', to: 'gate', kind: 'main' },
    { from: 'gate', to: 'ok', label: 'Yes', kind: 'main' },
    { from: 'gate', to: 'no', label: 'No', kind: 'alt' },
  ],
}

/* ------------------------------------------------------------------ */
/* The five code slides, copied from the source                        */
/* ------------------------------------------------------------------ */

const PROFILE_VIEW = `from rest_framework.views import APIView
from rest_framework.response import Response

class MyProfileView(APIView):
    def get(self, request):
        # 1) the check
        if not request.user.is_authenticated:
            return Response({"detail": "Not authenticated"}, status=401)
        # 2) return who you are
        return Response({
            "username": request.user.username,
            "email": request.user.email,
        })`

const IS_AUTH_VIEW = `from rest_framework.permissions import IsAuthenticated

class ProductListView(ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]  # the lock`

const READ_ONLY_VIEW = `from rest_framework.permissions import IsAuthenticatedOrReadOnly

class ProductListView(ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]`

const SELLER_RULE = `from rest_framework.permissions import BasePermission
from rest_framework.permissions import SAFE_METHODS

class IsSellerOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        # rule 1: safe methods always pass
        if request.method in SAFE_METHODS:
            return True
        # rule 2: must be a logged-in seller
        return (
            request.user.is_authenticated
            and request.user.user_type == 'seller'
        )`

const SELLER_VIEWS = `from .permissions import IsSellerOrReadOnly

class ProductListView(ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsSellerOrReadOnly]

class ProductDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsSellerOrReadOnly]`

/* ------------------------------------------------------------------ */
/* The deck                                                            */
/* ------------------------------------------------------------------ */

export const authorizationDeck: SlideDef[] = [
  /* ── FRONT ───────────────────────────────────────────────────────── */
  {
    id: 'brand',
    section: 'Opening',
    label: 'Welcome',
    element: <BrandSlide greeting="Welcome!" lesson={SESSION} />,
  },
  {
    id: 'session-name',
    section: 'Opening',
    label: 'Session name',
    element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} />,
  },
  {
    id: 'agenda',
    section: 'Opening',
    label: 'Agenda',
    element: (
      <AgendaSlide
        kicker="Today's session"
        title="Agenda"
        lesson={SESSION}
        items={[
          { title: CONCEPTS[0], sub: 'A token means nothing until something checks it' },
          { title: CONCEPTS[1], sub: 'Lock a view to logged-in users' },
          { title: CONCEPTS[2], sub: 'Open to look, locked to touch' },
          { title: CONCEPTS[3], sub: 'Only sellers can change products' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 1: WHY PERMISSIONS? ─────────────────────────────────── */
  {
    id: 'c1-divider',
    section: CONCEPTS[0],
    label: 'Divider',
    element: <SectionBreakerSlide index={1} title={CONCEPTS[0]} lesson={SESSION} />,
  },
  {
    id: 'c1-left-off',
    section: CONCEPTS[0],
    label: 'Where we left off',
    element: (
      <ContentSlide
        kicker={CONCEPTS[0]}
        title="Where We Left Off"
        lead="Last session, users could log in and get a token that proves who they are"
        lesson={SESSION}
      >
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-5">
            <Card icon="pencil" title="Register">Create an account</Card>
            <Card icon="lock" title="Log in">With username and password</Card>
            <Card icon="key" title="Get a token">An access token that proves who you are</Card>
          </div>
          <Callout kind="warning" title="But the token does not do anything yet" asStep={false} className="max-w-none">
            Nothing in our API checks it
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c1-open-door',
    section: CONCEPTS[0],
    label: 'The door is wide open',
    element: (
      <ContentSlide kicker={CONCEPTS[0]} title="The Door Is Wide Open" lesson={SESSION}>
        <div className="flex flex-col gap-6">
          <BulletList
            immediate
            marker="cross"
            tone="accent"
            items={[
              { text: 'Anyone can still add, edit or delete products', sub: 'Even without logging in' },
              { text: 'Having a token means nothing', sub: 'If nothing ever checks it' },
            ]}
          />
          <Callout kind="success" title="Today" asStep={false} className="max-w-none">
            We put locks on the doors
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c1-two-words',
    section: CONCEPTS[0],
    label: 'Authentication vs authorization',
    element: (
      <ContentSlide
        kicker={CONCEPTS[0]}
        title="Two Words, Two Questions"
        lead="We met both last time. Today is all about the second one"
        lesson={SESSION}
      >
        <div className="grid grid-cols-2 gap-6">
          <Card icon="key" title="Authentication">
            <p className="mt-1 font-heading text-xl font-bold text-brand">&ldquo;Who are you?&rdquo;</p>
            <p className="mt-3 text-lg text-ink">You log in once to prove your identity</p>
          </Card>
          <Card icon="shield-check" title="Authorization" tone="success">
            <p className="mt-1 font-heading text-xl font-bold text-success-600">
              &ldquo;What are you allowed to do?&rdquo;
            </p>
            <p className="mt-3 text-lg text-ink">On every action, the app checks if you are allowed</p>
          </Card>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c1-no-permissions',
    section: CONCEPTS[0],
    label: 'What no permissions means',
    element: (
      <ContentSlide
        kicker={CONCEPTS[0]}
        title="What No Permissions Means"
        lead="Our product endpoints have no protection. Right now, anyone can:"
        lesson={SESSION}
      >
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
            <Card icon="plus" title="Add fake products" tone="accent">
              Anyone can POST new products to your shop
            </Card>
            <Card icon="pencil" title="Change any price" tone="accent">
              Someone could edit a ₹50,000 laptop to ₹1
            </Card>
          </div>
          <Callout kind="note" title="No real app can work like this" asStep={false} className="max-w-none">
            We need rules about who is allowed to do what. Those rules are called permissions
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c1-checkpoint',
    section: CONCEPTS[0],
    label: 'A permission is a checkpoint',
    element: (
      <ContentSlide
        kicker={CONCEPTS[0]}
        title="A Permission Is a Checkpoint"
        lead="A small rule DRF runs before your view. If it says no, the request is blocked and the view never runs"
        lesson={SESSION}
      >
        <SpineFlow {...CHECKPOINT} />
      </ContentSlide>
    ),
  },
  {
    id: 'c1-guard',
    section: CONCEPTS[0],
    label: 'A guard at every door',
    element: (
      <ContentSlide
        kicker={CONCEPTS[0]}
        title="A Guard at Every Door"
        lead="Think of an office building: a security guard stands at each door and checks everyone before they enter"
        lesson={SESSION}
      >
        <div className="flex flex-col gap-6">
          <AnalogyMap
            leftLabel="Office building"
            rightLabel="Our API"
            rows={[
              { from: 'The security guard', to: 'The permission' },
              { from: 'A room behind a door', to: 'A view' },
              { from: 'A visitor', to: 'A request' },
              { from: 'Turned away at the door', to: 'Blocked with an error' },
            ]}
          />
        </div>
      </ContentSlide>
    ),
  },

  /* ── CONCEPT 2: ISAUTHENTICATED ──────────────────────────────────── */
  {
    id: 'c2-divider',
    section: CONCEPTS[1],
    label: 'Divider',
    element: <SectionBreakerSlide index={2} title={CONCEPTS[1]} lesson={SESSION} />,
  },
  {
    id: 'c2-by-hand',
    section: CONCEPTS[1],
    label: 'What the check must do',
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="What the Check Must Do"
        lead="Before we use DRF's ready-made rule, let us see what the check has to do"
        lesson={SESSION}
      >
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-5">
            <Card icon="eye" title="1. Who is it?">Find out who is making the request</Card>
            <Card icon="lock" title="2. Not logged in" tone="accent">Block them with 401</Card>
            <Card icon="check" title="3. Logged in" tone="success">Let the view run as usual</Card>
          </div>
          <Callout kind="tip" title="Why by hand first" asStep={false} className="max-w-none">
            Once we have written it ourselves, DRF&apos;s shortcut will click instantly
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c2-request-user',
    section: CONCEPTS[1],
    label: 'request.user',
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="Who Is request.user?"
        lead="When a request arrives, DRF reads the token, if any, and puts a user object onto the request"
        lesson={SESSION}
      >
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
            <ObjectState
              name="With a valid token"
              rows={[
                { name: 'request.user', value: '<User: priya>' },
                { name: 'is_authenticated', value: 'True' },
              ]}
            />
            <ObjectState
              name="No token, or an invalid one"
              delay={2}
              rows={[
                { name: 'request.user', value: '<AnonymousUser>' },
                { name: 'is_authenticated', value: 'False' },
              ]}
            />
          </div>
          <Callout kind="note" title="One field is all we need" asStep={false} className="max-w-none">
            request.user.is_authenticated is either True or False
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c2-code-profile',
    section: CONCEPTS[1],
    label: 'Code: the check by hand',
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="The Check, Written by Hand"
        lead="APIView is a view where we write get() ourselves, so the check fits at the top"
        lesson={SESSION}
      >
        <div className="grid grid-cols-[1.55fr_1fr] items-center gap-6">
          <CodeBlock code={PROFILE_VIEW} filename="users/views.py" language="Python" highlight={[7, 8]} fontSize={14} />
          <BulletList
            immediate
            items={[
              { text: 'The check comes first', sub: 'Not logged in: return 401', icon: 'lock' },
              { text: 'Then the real work', sub: "Return the user's username and email", icon: 'code' },
              { text: 'Wired at profile/', sub: 'In users/urls.py', icon: 'link' },
            ]}
          />
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c2-test-no-token',
    section: CONCEPTS[1],
    label: 'Test: no token',
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="Test It: No Token"
        lead="First, call the profile URL without logging in"
        lesson={SESSION}
      >
        <Exchange
          request={['GET <domain_url>/users/profile/']}
          response={{
            status: 'error',
            text: '401 Unauthorized',
            code: true,
            label: 'Blocked',
            detail: '{ "detail": "Not authenticated" }',
          }}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c2-test-token',
    section: CONCEPTS[1],
    label: 'Test: with a token',
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="Test It: With a Token"
        lead="Now log in, copy the access token, and send it in the header"
        lesson={SESSION}
      >
        <div className="flex flex-col gap-6">
          <Exchange
            request={['GET <domain_url>/users/profile/', 'Authorization: Bearer eyJhbGci…']}
            response={{
              status: 'success',
              text: '200 OK',
              code: true,
              label: 'Allowed',
              detail: '{ "username": "priya", "email": "priya@example.com" }',
            }}
          />
          <Callout kind="success" title="The check passes" asStep={false} className="max-w-none">
            A token gives a real request.user, so the profile is returned
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c2-same-check',
    section: CONCEPTS[1],
    label: 'The same check everywhere',
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="The Same Check Everywhere"
        lead="Many views need a login, and each one needs the same check at the top"
        lesson={SESSION}
      >
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-5">
            {['MyProfileView', 'ChangePasswordView', 'AddToCartView'].map((v) => (
              <Card key={v}>
                <p className="font-mono text-lg font-bold text-ink">{v}</p>
                <Chip tone="accent" className="mt-3">
                  the same 4-line check
                </Chip>
                <p className="mt-3 text-body-sm text-body">then the rest of the view</p>
              </Card>
            ))}
          </div>
          <Callout kind="error" title="Forget it once" asStep={false} className="max-w-none">
            Copy-pasted everywhere. Forget the check on one view, and that view is wide open
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c2-declare-once',
    section: CONCEPTS[1],
    label: 'Declare it once',
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="Declare It Once"
        lead="DRF's built-in rule does the exact same check, declared once instead of written in every method"
        lesson={SESSION}
      >
        <div className="grid grid-cols-2 gap-6">
          <Card title="The manual way" className="h-full">
            <BulletList
              immediate
              marker="cross"
              tone="accent"
              className="mt-4"
              items={['A check inside every method', 'Copied into every view']}
            />
          </Card>
          <Card title="The DRF way" className="h-full">
            <BulletList
              immediate
              marker="check"
              tone="success"
              className="mt-4"
              items={[
                'Declare the rule once, on the class',
                { text: 'Works on any view', sub: 'Custom APIViews and generic views like ProductListView' },
              ]}
            />
          </Card>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c2-code-is-auth',
    section: CONCEPTS[1],
    label: 'Code: IsAuthenticated',
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="Add the IsAuthenticated Rule"
        lead="Two lines on ProductListView: import the rule, then list it in permission_classes"
        lesson={SESSION}
      >
        <div className="flex flex-col gap-6">
          <CodeBlock code={IS_AUTH_VIEW} filename="products/views.py" language="Python" highlight={[1, 6]} fontSize={16} />
          <Callout kind="success" title="Same protection, far less code" asStep={false} className="max-w-none">
            permission_classes is the list of rules for this view. IsAuthenticated means you must be logged in
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c2-token-used',
    section: CONCEPTS[1],
    label: 'How the token is used',
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="How the Token Is Used"
        lead="The Bearer token from last session fills request.user. No token, no user, so IsAuthenticated says no"
        lesson={SESSION}
      >
        <SpineFlow {...TOKEN_USED} />
      </ContentSlide>
    ),
  },
  {
    id: 'c2-two-outcomes',
    section: CONCEPTS[1],
    label: 'Two outcomes',
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="Two Outcomes"
        lead="Call GET /products/ on the locked ProductListView, without and with a token"
        lesson={SESSION}
      >
        <div className="flex flex-col gap-6">
          <StatusList
            immediate
            items={[
              {
                status: 'error',
                text: 'No token: 401 Unauthorized',
                label: 'Blocked',
                detail: '"Authentication credentials were not provided."',
              },
              {
                status: 'success',
                text: 'Valid token: 200 OK',
                label: 'Allowed',
                detail: 'The products come back: "count": 47, "results": [ ... ]',
              },
            ]}
          />
          <Callout kind="note" title="What 401 means" asStep={false} className="max-w-none">
            We don&apos;t know who you are, log in first. The view runs only with a valid token
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'quiz-1',
    section: CONCEPTS[1],
    label: 'Quiz time',
    element: (
      <QuizTimeSlide subtitle="request.user, 401, and the one line that locks a view" lesson={SESSION} />
    ),
  },

  /* ── CONCEPT 3: READ VS WRITE ────────────────────────────────────── */
  {
    id: 'c3-divider',
    section: CONCEPTS[2],
    label: 'Divider',
    element: <SectionBreakerSlide index={3} title={CONCEPTS[2]} lesson={SESSION} />,
  },
  {
    id: 'c3-locked-out',
    section: CONCEPTS[2],
    label: 'Locked out everyone',
    element: (
      <ContentSlide
        kicker={CONCEPTS[2]}
        title="Locked Out Everyone"
        lead="IsAuthenticated locked the whole view. A shop needs browsing open to all"
        lesson={SESSION}
      >
        <div className="grid grid-cols-2 gap-6">
          <Card title="Too strict" className="h-full">
            <BulletList
              immediate
              marker="cross"
              tone="accent"
              className="mt-4"
              items={[
                "A new visitor can't even see the products",
                { text: 'That would kill an online shop', sub: 'People browse before they sign up' },
              ]}
            />
          </Card>
          <Card title="What we actually want" className="h-full">
            <BulletList
              immediate
              marker="check"
              tone="success"
              className="mt-4"
              items={[
                'Anyone can view products',
                'Only logged-in users can add, edit or delete',
                'Open to look, locked to touch',
              ]}
            />
          </Card>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c3-safe-methods',
    section: CONCEPTS[2],
    label: 'Safe vs unsafe methods',
    element: (
      <ContentSlide
        kicker={CONCEPTS[2]}
        title="Reading vs Changing"
        lead="DRF splits requests into two groups, based on the HTTP method"
        lesson={SESSION}
      >
        <div className="grid grid-cols-2 gap-6">
          <MethodGroup
            label="Unsafe: changing"
            methods={['POST', 'PUT', 'DELETE']}
            tone="accent"
            note="Creates, edits or removes data. These need a login"
          />
          <MethodGroup
            label="Safe: just reading"
            methods={['GET']}
            tone="success"
            note="Only looks at data and changes nothing. This needs no login"
          />
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c3-code-read-only',
    section: CONCEPTS[2],
    label: 'Code: IsAuthenticatedOrReadOnly',
    element: (
      <ContentSlide
        kicker={CONCEPTS[2]}
        title="Swap In a Softer Rule"
        lead="DRF has a ready-made rule for exactly this. Swap it in: one word changes"
        lesson={SESSION}
      >
        <div className="flex flex-col gap-6">
          <CodeBlock code={READ_ONLY_VIEW} filename="products/views.py" language="Python" highlight={[1, 6]} fontSize={16} />
          <Callout kind="success" title="IsAuthenticatedOrReadOnly" asStep={false} className="max-w-none">
            GET is now open to everyone. POST, PUT and DELETE need a valid token
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c3-decides',
    section: CONCEPTS[2],
    label: 'How it decides',
    element: (
      <StatusPointsSlide
        kicker={CONCEPTS[2]}
        title="How It Decides"
        lead="The rule looks at the method first, then decides"
        lesson={SESSION}
        items={[
          { status: 'success', text: 'GET, with or without a token', label: 'Allowed', detail: 'Always allowed. Browse freely' },
          { status: 'success', text: 'POST, PUT or DELETE, with a token', label: 'Allowed', detail: 'Logged-in users can change data' },
          { status: 'error', text: 'POST, PUT or DELETE, no token', label: '401', detail: 'Must be logged in first' },
        ]}
      />
    ),
  },
  {
    id: 'c3-any-user',
    section: CONCEPTS[2],
    label: 'Any user can write',
    element: (
      <ContentSlide
        kicker={CONCEPTS[2]}
        title="Any Logged-in User Can Write"
        lead="It lets ALL logged-in users write, customer or seller. Try POST /products/ as three users:"
        lesson={SESSION}
      >
        <StatusList
          immediate
          items={[
            { status: 'success', text: 'Anonymous, no token: 401', label: 'Correct', detail: 'Blocked, as it should be' },
            { status: 'error', text: 'Customer token: 201 Created', label: 'Wrong', detail: 'A customer just added a product' },
            { status: 'success', text: 'Seller token: 201 Created', label: 'Correct', detail: 'Sellers are meant to add products' },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c3-so-far',
    section: CONCEPTS[2],
    label: 'What we have so far',
    element: (
      <ContentSlide kicker={CONCEPTS[2]} title="What We Have So Far" lesson={SESSION}>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
            <AccessCard rule="IsAuthenticated" sub="Lock everything: must be logged in" access={IS_AUTH} />
            <AccessCard
              rule="IsAuthenticatedOrReadOnly"
              sub="Anyone reads, only logged-in users change"
              access={IS_AUTH_OR_RO}
            />
          </div>
          <Callout kind="warning" title="Logged in isn't enough" asStep={false} className="max-w-none">
            A customer should browse and buy, not add products. We need to check the role
          </Callout>
        </div>
      </ContentSlide>
    ),
  },

  /* ── CONCEPT 4: ROLE-BASED AUTHORIZATION ─────────────────────────── */
  {
    id: 'c4-divider',
    section: CONCEPTS[3],
    label: 'Divider',
    element: <SectionBreakerSlide index={4} title={CONCEPTS[3]} lesson={SESSION} />,
  },
  {
    id: 'c4-role',
    section: CONCEPTS[3],
    label: 'Logged in is not enough',
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="Logged In Is Not Enough"
        lead="A customer shouldn't be able to add products. Only sellers should"
        lesson={SESSION}
      >
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
            <Card icon="eye" title="Customer, logged in" tone="accent" className="h-full">
              <BulletList
                immediate
                marker="cross"
                tone="accent"
                className="mt-3"
                items={[{ text: 'Cannot add products', sub: 'Only browses and buys' }]}
              />
            </Card>
            <Card icon="star" title="Seller, logged in" tone="success" className="h-full">
              <BulletList
                immediate
                marker="check"
                tone="success"
                className="mt-3"
                items={[{ text: 'Can add products', sub: 'Lists items for sale' }]}
              />
            </Card>
          </div>
          <Callout kind="tip" title="Remember user_type?" asStep={false} className="max-w-none">
            The user_type field we built is where this finally pays off
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c4-rule',
    section: CONCEPTS[3],
    label: 'The rule by role',
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="The Rule, by Role"
        lead="Two simple rules, based on what kind of request comes in"
        lesson={SESSION}
      >
        <div className="grid grid-cols-2 gap-6">
          <Card title="Write: POST, PUT, DELETE" tone="accent" className="h-full">
            <div className="mt-3 flex flex-col gap-2.5">
              <Line label="Who">A logged-in seller only</Line>
              <Line label="Check">is_authenticated AND user_type == &apos;seller&apos;</Line>
              <Line label="Fails either">403 Forbidden</Line>
              <p className="font-mono text-body-sm text-muted">POST /products/ · PUT /products/42/</p>
            </div>
          </Card>
          <Card title="Read: GET" tone="success" className="h-full">
            <div className="mt-3 flex flex-col gap-2.5">
              <Line label="Who">Anyone, even logged-out visitors</Line>
              <Line label="Check">None, no login needed</Line>
              <Line label="Result">The data, 200 OK</Line>
              <p className="font-mono text-body-sm text-muted">GET /products/ · GET /products/42/</p>
            </div>
          </Card>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c4-safe-methods',
    section: CONCEPTS[3],
    label: 'SAFE_METHODS',
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="Meet SAFE_METHODS"
        lead="A DRF helper that holds the HTTP methods which only read data"
        lesson={SESSION}
      >
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
            <MethodGroup
              label="In SAFE_METHODS"
              methods={['GET', 'HEAD', 'OPTIONS']}
              tone="success"
              note="Read only. Changes nothing on the server"
            />
            <MethodGroup
              label="Not in it"
              methods={['POST', 'PUT', 'PATCH', 'DELETE']}
              tone="accent"
              note="Write. Changes data"
            />
          </div>
          <Callout kind="note" title="request.method in SAFE_METHODS" asStep={false} className="max-w-none">
            True for GET, False for POST, PUT and DELETE
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c4-code-rule',
    section: CONCEPTS[3],
    label: 'Code: IsSellerOrReadOnly',
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="Our Own Rule"
        lead="has_permission() returns True to allow a request, False to block it"
        lesson={SESSION}
      >
        <div className="grid grid-cols-[1.45fr_1fr] items-center gap-6">
          <CodeBlock code={SELLER_RULE} filename="products/permissions.py" language="Python" highlight={[6, 7, 10, 11]} fontSize={14} />
          <div className="flex flex-col gap-4">
            <Card title="Rule 1: reads pass">
              <p className="text-body-sm text-body">GET /products/, anonymous: a safe method, so True</p>
            </Card>
            <Card title="Rule 2: writes need a seller">
              <p className="text-body-sm text-body">POST /products/, customer: not safe and not a seller, so False</p>
            </Card>
            <p className="text-body-sm text-body">BasePermission is the parent class for your own rules</p>
          </div>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c4-code-views',
    section: CONCEPTS[3],
    label: 'Code: plug it into both views',
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="Plug It Into Both Views"
        lead="Our own rule plugs in exactly like DRF's built-in ones"
        lesson={SESSION}
      >
        <div className="grid grid-cols-[1.55fr_1fr] items-center gap-6">
          <CodeBlock code={SELLER_VIEWS} filename="products/views.py" language="Python" highlight={[1, 6, 11]} fontSize={14} />
          <BulletList
            immediate
            items={[
              { text: 'ProductListView', sub: 'Anyone lists, only sellers create', icon: 'file' },
              { text: 'ProductDetailView', sub: 'Anyone reads, only sellers update or delete', icon: 'file' },
            ]}
          />
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c4-401-403',
    section: CONCEPTS[3],
    label: '401 vs 403',
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="401 vs 403"
        lead="Two different no answers, and they mean different things"
        lesson={SESSION}
      >
        <div className="grid grid-cols-2 gap-6">
          <Card icon="key" title="401 Unauthorized" tone="accent" className="h-full">
            <div className="mt-3 flex flex-col gap-2.5">
              <Line label="Means">&ldquo;I don&apos;t know who you are&rdquo;</Line>
              <Line label="When">No token, or an invalid one</Line>
              <Line label="Fix">Log in first</Line>
            </div>
          </Card>
          <Card icon="lock" title="403 Forbidden" tone="accent" className="h-full">
            <div className="mt-3 flex flex-col gap-2.5">
              <Line label="Means">&ldquo;I know who you are, you&apos;re just not allowed&rdquo;</Line>
              <Line label="When">Logged in, without the right role</Line>
              <Line label="Fix">None, it is not permitted</Line>
            </div>
          </Card>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c4-three-results',
    section: CONCEPTS[3],
    label: 'Same request, three results',
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="Same Request, Three Results"
        lead="Same POST /products/, three users. That's authorization working"
        lesson={SESSION}
      >
        <div className="flex flex-col gap-6">
          <StatusList
            immediate
            items={[
              { status: 'success', text: 'Not logged in: 401', label: 'Correct', detail: 'Log in first' },
              { status: 'success', text: 'Customer: 403', label: 'Correct', detail: 'Logged in, but not allowed' },
              { status: 'success', text: 'Seller: 201 Created', label: 'Correct', detail: "The seller's role got them through" },
            ]}
          />
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c4-three-levels',
    section: CONCEPTS[3],
    label: 'Three levels of protection',
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="Three Levels of Protection"
        lead="Same permission_classes pattern, three different rules. Pick the one that matches who should do what"
        lesson={SESSION}
      >
        <div className="grid grid-cols-3 gap-5">
          <AccessCard rule="IsAuthenticated" sub="Lock everything" access={IS_AUTH} />
          <AccessCard rule="IsAuthenticatedOrReadOnly" sub="Role doesn't matter" access={IS_AUTH_OR_RO} />
          <AccessCard rule="IsSellerOrReadOnly" sub="Only sellers write" access={IS_SELLER} />
        </div>
      </ContentSlide>
    ),
  },

  /* ── CLOSE ───────────────────────────────────────────────────────── */
  {
    id: 'quiz-2',
    section: 'Closing',
    label: 'Quiz time',
    element: (
      <QuizTimeSlide subtitle="Safe methods, a custom rule, and 401 against 403" lesson={SESSION} />
    ),
  },
  {
    id: 'takeaways',
    section: 'Closing',
    label: 'Key takeaways',
    element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={[...CONCEPTS]} />,
  },
  {
    id: 'next-session',
    section: 'Closing',
    label: 'Next session',
    element: (
      <SectionBreakerSlide kicker="Next session" title="Prime Products & Seller Ownership" lesson={SESSION} />
    ),
  },
  {
    id: 'feedback',
    section: 'Closing',
    label: 'Feedback',
    element: <FeedbackSlide title="Your feedback" lesson={SESSION} />,
  },
  {
    id: 'thank-you',
    section: 'Closing',
    label: 'Thank you',
    element: <ThankYouSlide lesson={SESSION} />,
  },
]
