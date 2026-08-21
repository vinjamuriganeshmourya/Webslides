import type { SlideDef, DeckMeta } from '@/deck/types'
import { CodeBlock, Callout } from '@/ui'
import { AnalogyMap } from '@/ui/AnalogyMap'
import { TwoAppsScene } from '@/ui/characters/session1'
import { Step } from '@/motion/Stepper'
import {
  BrandSlide,
  WelcomeSlide,
  AgendaSlide,
  SectionBreakerImageSlide,
  ContentSlide,
  ContentNoteSlide,
  OnlyImageSlide,
  KeyTakeawaysSlide,
  PracticeSlide,
  FeedbackSlide,
  QuizSlide,
  ThankYouSlide,
} from '@/slides'

/**
 * Session 1 — Client–Server & CORS.
 *
 * Generated from the SIGNED-OFF plan Rev 7
 * (session_plans/session-1-client-server-cors/plan.md, signed off 2026-07-24)
 * against the rewritten TR doc (2026-07-24, Parts A/B, §10 crack patch).
 * Structure: 6 dividers, one per concept (user decision ①), 40 slides.
 * Style pass (user-directed): headers pinned top-left, BulletList points
 * over prose, no em-dash separators, mono reserved for code, uniform fonts
 * via house components only.
 */
export const session1Meta: DeckMeta = {
  title: 'Client–Server & CORS',
  course: 'React + Django Integration',
  lesson: 'Client–Server & CORS',
  presenter: 'NxtWave Instructor',
}

/** Common input: the session NAME rides the footer of every slide. */
const FOOTER = 'Client–Server & CORS'

/* ------------------------------------------------------------------ */
/* Code snippets — verbatim from the TR doc                            */
/* ------------------------------------------------------------------ */

const verifyNode = `node -v     # e.g. v20.x.x
npm -v      # e.g. 10.x.x   (npm ships with Node)`

const starterTree = `Integration Project/
├─ Backend Project/    ← Django  (our API)
└─ Frontend Project/   ← React   (the NxtTrendz UI)`

const installBoth = `# Backend Project/
pip install -r requirements.txt

# Frontend Project/
npm install`

const runBackend = `python manage.py runserver 8000`

const runFrontend = `npm run dev        # Vite serves on 3000`

const portError = `Error: That port is already in use.`

const consoleFetch = "fetch('http://localhost:8000/api/products/')"

const corsError = `Access to fetch at 'http://localhost:8000/api/products/' from origin
'http://localhost:3000' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.`

const djangoTerminal = `"GET /api/products/ HTTP/1.1" 200`

const installCors = `pip install django-cors-headers`

const corsCode = `INSTALLED_APPS = [
    "corsheaders",          # 1) register the app
    # ...existing apps...
]
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",   # 2) as high as possible
    # ...rest unchanged...
]
CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]   # 3) the name left at the gate`

const allowHeader = `Access-Control-Allow-Origin: http://localhost:3000`

const envFile = `VITE_API_BASE_URL=http://localhost:8000`

const helperCode = `// src/api.js — the single place the address is read
export const BASE_URL = import.meta.env.VITE_API_BASE_URL
export const apiUrl = (path) => \`\${BASE_URL}\${path}\``

const convertCode = `// before — someone else's server, hardcoded
const apiUrl = \`https://apis.ccbp.in/products?sort_by=\${activeOptionId}...\`

// after — your server, through the helper
import { apiUrl } from '../../api'
const response = await fetch(apiUrl('/api/products/'))`

/* ------------------------------------------------------------------ */
/* Session-specific inline visuals                                     */
/* ------------------------------------------------------------------ */

/** Slide 5 — a tool card carrying the official mark (Devicon, MIT). */
function ToolLogoCard({ logo, name, sub }: { logo: string; name: string; sub: string }) {
  return (
    <div className="flex w-72 flex-col items-center gap-3 rounded-card border-2 border-line bg-surface-card px-6 py-6 shadow-card">
      <img src={logo} alt="" className="h-16 w-16" />
      <span className="font-heading text-body-lg font-bold text-ink">{name}</span>
      <span className="text-center text-body-sm text-body">{sub}</span>
    </div>
  )
}

/** Slide 11 — the TR's address anatomy: scheme · host · PORT · path. */
function UrlAnatomy() {
  const parts = [
    { text: 'http', label: 'scheme', cls: 'text-brand-600' },
    { text: '://', label: '', cls: 'text-body' },
    { text: 'localhost', label: 'host', cls: 'text-teal-700' },
    { text: ':', label: '', cls: 'text-body' },
    { text: '8000', label: 'PORT', cls: 'text-white', highlight: true },
    { text: '/api/products/', label: 'path', cls: 'text-ink' },
  ]
  return (
    <div className="flex items-end justify-center gap-1">
      {parts.map((p, i) => (
        <Step key={i} dir="up">
          <div className="flex flex-col items-center gap-2">
            <span
              className={`rounded-card px-3 py-2 font-mono text-slide-body-lg font-bold ${p.cls} ${
                p.highlight ? 'bg-accent-500' : 'bg-surface-card border-2 border-line'
              }`}
            >
              {p.text}
            </span>
            <span className={`font-heading text-body-sm font-bold ${p.highlight ? 'text-accent-600' : 'text-body'}`}>
              {p.label}
            </span>
          </div>
        </Step>
      ))}
    </div>
  )
}

/** Small labelled pill row — verdicts, verbs. One click reveals the whole row. */
function ChipRow({ chips }: { chips: Array<{ code: string; label: string }> }) {
  return (
    <Step dir="up">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {chips.map((c) => (
          <span key={c.code} className="inline-flex items-center gap-2 rounded-pill border-2 border-line bg-surface-card px-4 py-2">
            <span className="font-mono text-body-sm font-bold text-brand-600">{c.code}</span>
            <span className="font-heading text-body-sm font-semibold text-ink">{c.label}</span>
          </span>
        ))}
      </div>
    </Step>
  )
}

/** Slide 17 — the TR's §6 table: each Network-row cell → its restaurant meaning. */
function NetworkRows() {
  const rows = [
    ['Method  GET', '“read something” · the order placed'],
    ['URL  …/products?sort_by=…', 'which kitchen, which dish'],
    ['Status  200', 'the waiter’s verdict · “here you go”'],
    ['Response  JSON list', 'the dish itself'],
  ]
  return (
    <div className="flex flex-col gap-3">
      {rows.map(([cell, meaning], i) => (
        <Step key={i} dir="up">
          <div className="grid grid-cols-[19rem_1fr] items-center gap-4">
            <span className="rounded-card border-2 border-line bg-night-2 px-4 py-2.5 font-mono text-body-sm text-white/90">
              {cell}
            </span>
            <span className="text-body-lg text-ink">{meaning}</span>
          </div>
        </Step>
      ))}
    </div>
  )
}

/** Slide 21 — the doc's detective device: three phrases, three questions. */
function ErrorMap() {
  const phrases = [
    ["… from origin 'http://localhost:3000'", 'what is an “origin”?'],
    ['has been blocked by CORS policy', 'what policy? who blocks?'],
    ["No 'Access-Control-Allow-Origin' header is present on the requested resource.", 'what header? present where?'],
  ]
  return (
    <div className="overflow-hidden rounded-card bg-night-2 p-6 shadow-card">
      <div className="flex flex-col gap-5">
        {phrases.map(([phrase, question], i) => (
          <div key={i} className="grid grid-cols-[1fr_auto] items-center gap-5">
            <span className="font-mono text-body-sm leading-relaxed text-white/90">{phrase}</span>
            <Step dir="right">
              <span className="whitespace-nowrap rounded-pill bg-accent-500 px-4 py-1.5 font-heading text-body-sm font-bold text-white">
                ← {question}
              </span>
            </Step>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Slide 23 — the TR's same-origin table, revealed row by row. */
function SameOriginRows() {
  const rows = [
    { page: 'http://localhost:3000', calls: 'http://localhost:8000/api', verdict: 'No · port differs · our case', ours: true },
    { page: 'http://localhost:3000', calls: 'https://localhost:3000/api', verdict: 'No · scheme differs', ours: false },
    { page: 'https://nxttrendz.com', calls: 'https://api.nxttrendz.com', verdict: 'No · host differs', ours: false },
  ]
  return (
    <div className="flex flex-col gap-3">
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-[1fr_auto] items-center gap-4">
          <div className="flex items-center gap-3 rounded-card border-2 border-line bg-surface-card px-4 py-3">
            <span className="font-mono text-body-sm text-ink">{r.page}</span>
            <span className="text-body">→</span>
            <span className="font-mono text-body-sm text-ink">{r.calls}</span>
          </div>
          <Step dir="right">
            <span
              className={`whitespace-nowrap rounded-pill px-4 py-2 font-heading text-body-sm font-bold text-white ${
                r.ours ? 'bg-accent-500' : 'bg-night-2'
              }`}
            >
              {r.verdict}
            </span>
          </Step>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* The deck — 40 slides per signed-off plan Rev 7                      */
/* ------------------------------------------------------------------ */

export const session1Deck: SlideDef[] = [
  /* ---- Open ---- */
  {
    id: 'brand',
    label: 'NxtWave',
    transition: 'fade',
    element: <BrandSlide lesson={FOOTER} />,
  },
  {
    id: 'welcome',
    label: 'Welcome',
    transition: 'zoom',
    element: <WelcomeSlide minimal title="Client–Server & CORS" lesson={FOOTER} />,
  },
  {
    id: 'agenda',
    label: "Today's Agenda",
    section: 'Open',
    element: (
      <AgendaSlide
        lesson={FOOTER}
        kicker="Today's Agenda"
        title="What we’ll cover today"
        lead="By the end: the products page renders from OUR Django backend, not the external API."
        items={[
          { title: 'Local Setup', sub: 'VS Code · Python · Node' },
          { title: 'Ports', sub: 'numbered doors on one building' },
          { title: 'Client–Server', sub: 'a restaurant: order, kitchen, dish, verdict' },
          { title: 'Origin', sub: 'flats in one building' },
          { title: 'CORS', sub: 'the security guard at the gate' },
          { title: 'Base URL & .env', sub: 'one saved phone contact' },
        ]}
      />
    ),
  },

  /* ---- D1 · Local Setup (§1–§3) ---- */
  {
    id: 'd1',
    label: 'D1 · Local Setup',
    section: 'Local Setup',
    transition: 'cover',
    element: (
      <SectionBreakerImageSlide
        index={1}
        kicker="Local Setup"
        title="Local Setup"
        subtitle="VS Code and Python are ready. One piece is missing."
        media={{ illustration: 'toolchain' }}
      />
    ),
  },
  {
    id: 'have',
    label: 'What we already have',
    section: 'Local Setup',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Local Setup"
        title="What We Already Have"
        lead="Enough to run the whole backend · Postman proves it today"
      >
        <div className="flex flex-col items-center gap-7">
          <div className="flex gap-8">
            <ToolLogoCard logo="/assets/tech/vscode.svg" name="VS Code" sub="the editor · write and run everything" />
            <ToolLogoCard logo="/assets/tech/python.svg" name="Python" sub="runs Django · python manage.py runserver" />
          </div>
          <Step dir="up">
            <p className="font-heading text-body-lg font-bold text-accent-600">
              So why can’t we start the frontend the same way?
            </p>
          </Step>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'need-node',
    label: 'The frontend needs Node',
    section: 'Local Setup',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Local Setup"
        title="The Frontend Needs Node"
        lead="Python runs our backend. Nothing on this machine can run our frontend yet."
        points={[
          { text: 'React code → written in JavaScript', icon: 'code', tone: 'brand' },
          { text: 'Vite, npm, the packages → run on Node.js', sub: 'the tools that build and serve the frontend', icon: 'bolt', tone: 'teal' },
          { text: 'Node = the JavaScript runtime', sub: 'like the Python interpreter, for Django', icon: 'bulb', tone: 'info' },
          { text: 'No Node → no npm install, no npm run dev', icon: 'warning', tone: 'accent' },
        ]}
      >
        <div className="flex items-center justify-center gap-8">
          <img src="/assets/tech/python.svg" alt="Python" className="h-24 w-24" />
          <span className="font-heading text-slide-title font-bold text-line">·</span>
          <img src="/assets/tech/nodejs.svg" alt="Node.js" className="h-24 w-24" />
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'install-node',
    label: 'Installing Node',
    section: 'Local Setup',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Local Setup"
        title="Installing Node"
        lead="nodejs.org → LTS (stable, not “Current”) → installer, accept defaults"
      >
        <div className="grid grid-cols-[1.2fr_1fr] items-center gap-6">
          <img
            src="/shots/nodejs-lts.png"
            alt="nodejs.org download page with the LTS version selected"
            className="max-h-[320px] w-full rounded-card border-2 border-line object-contain shadow-card"
          />
          <div className="flex flex-col gap-3">
            <CodeBlock code={verifyNode} filename="fresh VS Code terminal" language="bash" showLineNumbers={false} />
            <Callout kind="success" title="Two version numbers print" asStep className="!p-3 text-body-sm">
              VS Code + Python + Node · the full set
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'starter',
    label: 'The starter code',
    section: 'Local Setup',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Local Setup"
        title="The Starter Code"
        lead="Both projects pre-configured · ready to run"
      >
        <div className="flex flex-col gap-3">
          <CodeBlock code={starterTree} filename="starter.zip" language="text" showLineNumbers={false} />
          <CodeBlock code={installBoth} filename="one-time installs" language="bash" showLineNumbers={false} />
        </div>
      </ContentSlide>
    ),
  },

  /* ---- D2 · Ports (§4 · 📌 C0) ---- */
  {
    id: 'd2',
    label: 'D2 · Ports',
    section: 'Ports',
    transition: 'cover',
    element: (
      <SectionBreakerImageSlide
        index={2}
        kicker="numbered doors on one building"
        title="Ports"
        subtitle="Two servers, one laptop. How do they not collide?"
        media={{ illustration: 'ports-doors' }}
        tone="teal"
      />
    ),
  },
  {
    id: 'run-both',
    label: 'Two terminals',
    section: 'Ports',
    element: (
      <ContentSlide lesson={FOOTER} kicker="Ports" title="Two Terminals">
        <div className="flex flex-col gap-3">
          <CodeBlock code={runBackend} filename="terminal 1 · Backend Project/" language="bash" showLineNumbers={false} />
          <CodeBlock
            code={runFrontend}
            filename="terminal 2 · the + in VS Code’s terminal panel"
            language="bash"
            showLineNumbers={false}
          />
          <Callout kind="info" title="Think about it" asStep className="!p-3 text-body-sm">
            Two servers, same laptop, same time → how do they not collide?
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'doors',
    label: 'Numbered doors',
    section: 'Ports',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Ports · 📌 concept"
        title="Numbered Doors"
        points={[
          { text: 'localhost = this machine', icon: 'globe', tone: 'teal' },
          { text: 'A port = a numbered door on it', sub: 'one machine, thousands of doors', icon: 'plug', tone: 'brand' },
          { text: 'One program per door', sub: 'a running program binds one port', icon: 'lock', tone: 'accent' },
        ]}
      >
        <UrlAnatomy />
      </ContentSlide>
    ),
  },
  {
    id: 'collision',
    label: 'One door, one program',
    section: 'Ports',
    element: (
      <ContentSlide lesson={FOOTER} kicker="Ports" title="One Door, One Program">
        <div className="flex flex-col gap-3">
          <CodeBlock code={portError} filename="second server, same port" language="text" showLineNumbers={false} />
          <Callout kind="warning" title="Rule for the whole track" asStep className="!p-4 text-body-sm">
            Backend on 8000 · frontend on 3000 · always: python manage.py runserver 8000
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'both-up',
    label: 'Both servers up',
    section: 'Ports',
    element: (
      <ContentNoteSlide
        lesson={FOOTER}
        kicker="Ports"
        title="Both Servers Up"
        points={[
          { text: 'React opens at http://localhost:3000', sub: 'the products page renders', icon: 'devices', tone: 'brand' },
          { text: 'Django answers at http://localhost:8000', sub: 'no collision · each at its own door', icon: 'server', tone: 'teal' },
        ]}
        note={{
          kind: 'info',
          title: 'Part A done',
          body: '…but whose products are those on the screen?',
        }}
      />
    ),
  },

  /* ---- D3 · Client–Server (§5–§6a · 📌 C1) ---- */
  {
    id: 'd3',
    label: 'D3 · Client–Server',
    section: 'Client–Server',
    transition: 'cover',
    element: (
      <SectionBreakerImageSlide
        index={3}
        kicker="a restaurant: order, kitchen, dish, verdict"
        title="Client–Server"
        subtitle="The products page already has a conversation running. Whose?"
        media={{ illustration: 'concept-api' }}
      />
    ),
  },
  {
    id: 'whose-products',
    label: 'Whose products?',
    section: 'Client–Server',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Client–Server"
        title="Whose Products?"
        lead="DevTools → Network → reload · one request tells the story: apis.ccbp.in"
      >
        <div className="flex flex-col items-center gap-4">
          <TwoAppsScene className="max-w-2xl" />
          <div className="flex items-center justify-center gap-4">
            <Step dir="up">
              <span className="rounded-pill bg-night-2 px-5 py-2 font-heading text-body-sm font-bold text-white">
                not our data · can’t change or secure it
              </span>
            </Step>
            <Step dir="up">
              <span className="rounded-pill bg-night-2 px-5 py-2 font-heading text-body-sm font-bold text-white">
                not real-time / not ours to own · a fixed dataset
              </span>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'the-plan',
    label: 'The plan',
    section: 'Client–Server',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Client–Server"
        title="The Plan"
        lead="Right next door: our own Django backend serves the same data. Postman proves it."
      >
        <div className="grid grid-cols-[1.25fr_1fr] items-center gap-6">
          <img
            src="/shots/django-json-200.png"
            alt="GET /api/products/ answers HTTP 200 with product JSON"
            className="max-h-[310px] w-full rounded-card border-2 border-line object-contain shadow-card"
          />
          <Callout kind="tip" title="The plan writes itself" asStep className="!p-4 text-body-sm">
            “Replace the external API with our own. Find that URL, point it at our server. One line. Five minutes.” ·
            we test exactly that plan
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'restaurant',
    label: 'The restaurant',
    section: 'Client–Server',
    transition: 'fade',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Client–Server · 📌 concept"
        title="The Restaurant"
        lead="You order → the kitchen cooks → the dish arrives, with a verdict"
      >
        <div className="flex flex-col gap-5">
          <NetworkRows />
          <ChipRow
            chips={[
              { code: '404', label: 'we don’t serve that' },
              { code: '401', label: 'who’s asking?' },
              { code: '500', label: 'fire in the kitchen' },
            ]}
          />
          <ChipRow
            chips={[
              { code: 'GET', label: 'read' },
              { code: 'POST', label: 'create · login, add to cart' },
              { code: 'PUT/PATCH', label: 'update' },
              { code: 'DELETE', label: 'remove' },
            ]}
          />
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'test-the-plan',
    label: 'Test the plan',
    section: 'Client–Server',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Client–Server"
        title="Test the Plan"
        lead="No code edits · just the browser console on :3000"
      >
        <div className="flex flex-col gap-4">
          <CodeBlock code={consoleFetch} filename="browser console on :3000" language="js" showLineNumbers={false} />
          <Callout kind="info" title="Predict" asStep className="!p-4 text-body-sm">
            Postman returned products for this exact URL. What will the browser do?
          </Callout>
        </div>
      </ContentSlide>
    ),
  },

  /* ---- D4 · Origin (§6b–§7 phrase 1 · 📌 C2) ---- */
  {
    id: 'd4',
    label: 'D4 · Origin',
    section: 'Origin',
    transition: 'cover',
    element: (
      <SectionBreakerImageSlide
        index={4}
        kicker="flats in one building"
        title="Origin"
        subtitle="The browser answers. And it’s not products."
        media={{ illustration: 'origin-flats' }}
        tone="accent"
      />
    ),
  },
  {
    id: 'the-wall',
    label: 'The wall',
    section: 'Origin',
    element: (
      <ContentSlide lesson={FOOTER} kicker="Origin" title="Not Products. Not a 404.">
        <div className="flex flex-col gap-3">
          <CodeBlock code={corsError} filename="browser console" language="text" showLineNumbers={false} />
          <CodeBlock code={djangoTerminal} filename="django terminal · the twist" language="text" showLineNumbers={false} />
          <Callout kind="warning" title="The server answered. The page got nothing." asStep className="!p-3 text-body-sm">
            The only thing standing between them is the browser itself.
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'word-by-word',
    label: 'Word by word',
    section: 'Origin',
    element: (
      <ContentSlide lesson={FOOTER} kicker="Origin" title="Word by Word" lead="Three phrases → three questions">
        <ErrorMap />
      </ContentSlide>
    ),
  },
  {
    id: 'origin',
    label: 'Origin',
    section: 'Origin',
    element: (
      <ContentNoteSlide
        lesson={FOOTER}
        kicker="Origin · phrase 1 · 📌 concept"
        title="Origin = Scheme + Host + Port"
        points={[
          { text: 'http · the scheme', icon: 'link', tone: 'brand' },
          { text: 'localhost · the host', icon: 'globe', tone: 'teal' },
          { text: '3000 · the port', sub: 'Concept 0, seen from the browser’s side', icon: 'plug', tone: 'accent' },
        ]}
        note={{
          kind: 'note',
          title: 'One building, many flats',
          body: 'Mail for flat 3000 isn’t for flat 8000. “Same machine” means nothing to the browser.',
        }}
      />
    ),
  },
  {
    id: 'origin-rules',
    label: 'Origin rules',
    section: 'Origin',
    element: (
      <ContentSlide lesson={FOOTER} kicker="Origin · call each one" title="Origin Rules">
        <div className="flex flex-col gap-5">
          <SameOriginRows />
          <Step dir="up">
            <p className="text-center text-body-sm text-body">
              <span className="font-mono">localhost</span> ≠ <span className="font-mono">127.0.0.1</span> · different
              hosts → different origins · if Vite prints one and you open the other, expect surprises
            </p>
          </Step>
        </div>
      </ContentSlide>
    ),
  },

  /* ---- D5 · CORS (§7 phrases 2–3 + §8 · 📌 C3) ---- */
  {
    id: 'd5',
    label: 'D5 · CORS',
    section: 'CORS',
    transition: 'cover',
    element: (
      <SectionBreakerImageSlide
        index={5}
        kicker="the security guard at the gate"
        title="CORS"
        subtitle="The server answered. The browser holds the delivery."
        media={{ illustration: 'cors-gate' }}
        tone="accent"
      />
    ),
  },
  {
    id: 'guard',
    label: 'The guard',
    section: 'CORS',
    transition: 'fade',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="CORS · phrase 2 · 📌 concept"
        title="The Guard"
        lead="Same-origin policy: a page from one origin may not read a response from another"
      >
        <div className="flex flex-col items-center gap-5">
          <AnalogyMap
            leftLabel="At the gate"
            rightLabel="In the browser"
            tone="accent"
            rows={[
              { from: 'The delivery arrives', to: 'Django’s 200 lands' },
              { from: 'Guard: “name left at the gate?”', to: 'Browser: “is the header present?”' },
              { from: 'No name → turned away', to: 'No header → the page never sees the data' },
            ]}
          />
          <Callout kind="note" title="The guard is the browser, not the server" asStep className="!p-3 text-body-sm">
            The static API always left the right name · that’s why this never bit before
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'paperwork',
    label: 'The missing paperwork',
    section: 'CORS',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="CORS · phrase 3"
        title="The Missing Paperwork"
        points={[
          { text: 'A header, “present on the requested resource”', sub: 'meaning: on the response', icon: 'json', tone: 'brand' },
          { text: 'Responses come from servers', icon: 'server', tone: 'teal' },
          { text: 'The resident leaves the name, not the visitor', sub: 'the fix belongs to the server', icon: 'shield-check', tone: 'success' },
        ]}
      >
        <Callout kind="tip" title="CORS · Cross-Origin Resource Sharing" asStep className="!p-4 text-body-sm">
          Response headers by which a server declares: “pages from this origin may read my responses.” Django never
          said that. Nobody taught it to.
        </Callout>
      </ContentSlide>
    ),
  },
  {
    id: 'the-fix',
    label: 'The fix',
    section: 'CORS',
    element: (
      <ContentSlide lesson={FOOTER} kicker="CORS" title="The Fix">
        <div className="flex flex-col gap-3">
          <CodeBlock code={installCors} filename="backend terminal" language="bash" showLineNumbers={false} />
          <CodeBlock
            code={corsCode}
            filename="nxttrendz_backend/settings.py · three edits"
            language="python"
            highlight={[2, 6, 9]}
            maxHeight={320}
          />
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'test-it',
    label: 'Test it',
    section: 'CORS',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="CORS"
        title="Test It"
        lead="Restart the backend → run the same console fetch → products"
      >
        <div className="flex flex-col gap-3">
          <CodeBlock code={allowHeader} filename="response headers · the paperwork, now present" language="text" showLineNumbers={false} />
          <Callout kind="success" title="The wall is down" asStep className="!p-4 text-body-sm">
            The frontend and backend can finally talk. But we got through with a URL typed by hand. The products page
            must do this permanently, and well.
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'quiz-1',
    label: 'Quiz Time!',
    section: 'CORS',
    transition: 'flip',
    element: (
      <QuizSlide
        lesson={FOOTER}
        kicker="Quiz Time!"
        question="Can a page at http://localhost:5500 read this API now?"
        options={[
          { label: 'Yes · CORS is switched on now' },
          { label: 'No · the guard holds a list of names', correct: true },
          { label: 'Only with a JWT token' },
          { label: 'Only after another pip install' },
        ]}
        hint="CORS is an allow-list: exactly which origins may read responses."
      />
    ),
  },

  /* ---- D6 · Base URL & .env (§9–§10 · 📌 C4) ---- */
  {
    id: 'd6',
    label: 'D6 · Base URL & .env',
    section: 'Base URL & .env',
    transition: 'cover',
    element: (
      <SectionBreakerImageSlide
        index={6}
        kicker="one saved contact"
        title="Base URL & .env"
        subtitle="Never type that address into code again."
        media={{ illustration: 'env-config' }}
      />
    ),
  },
  {
    id: 'config-not-code',
    label: 'Configuration, not code',
    section: 'Base URL & .env',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Base URL & .env · 📌 concept"
        title="Configuration, Not Code"
        lead="Many components call the API. The address will change. Save the number once."
        points={[
          { text: 'Differs per environment', sub: 'your laptop · a teammate’s port · production’s domain', icon: 'devices', tone: 'brand' },
          { text: 'Code gets shared and committed', sub: 'git: addresses and, later, real secrets exposed', icon: 'lock', tone: 'accent' },
          { text: 'Hosted URLs change', sub: 'redeploys, rotations: config changes without re-shipping code', icon: 'route', tone: 'teal' },
        ]}
      >
        <Callout kind="tip" title="The API’s address is configuration, not code" asStep className="!p-3 text-body-sm">
          A phone contact: save the number once → every call dials whatever the contact holds
        </Callout>
      </ContentSlide>
    ),
  },
  {
    id: 'env-file',
    label: 'The .env file',
    section: 'Base URL & .env',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Base URL & .env"
        title="The .env File"
        lead="One saved contact · every request dials it"
      >
        <div className="flex flex-col gap-3">
          <CodeBlock code={envFile} filename=".env · frontend root" language="bash" showLineNumbers={false} />
          <Callout kind="warning" title="The rules" asStep className="!p-4 text-body-sm">
            Only VITE_-prefixed variables reach the app · .env is read once at startup → restart the dev server · add
            .env to .gitignore
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'the-swap',
    label: 'The swap',
    section: 'Base URL & .env',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Base URL & .env"
        title="The Swap"
        lead="One helper reads the address · components dial the contact, not the number"
      >
        <div className="flex flex-col gap-3">
          <CodeBlock code={helperCode} filename="src/api.js" language="js" showLineNumbers={false} />
          <CodeBlock code={convertCode} filename="AllProductsSection/index.jsx" language="js" highlight={[5, 6]} maxHeight={230} />
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'served-by-django',
    label: 'Served by Django',
    section: 'Base URL & .env',
    transition: 'rise',
    element: (
      <OnlyImageSlide
        lesson={FOOTER}
        title="Served by Django"
        media={{
          src: '/shots/products-from-django.png',
          alt: 'NxtTrendz products page rendering data from the Django backend',
          fit: 'contain',
        }}
        caption="One line re-points everything: localhost:8000 today, api.nxttrendz.com later. The “one-line swap” was true after all, just not the line we thought."
      />
    ),
  },
  {
    id: 'quiz-2',
    label: 'Quiz Time!',
    section: 'Base URL & .env',
    transition: 'flip',
    element: (
      <QuizSlide
        lesson={FOOTER}
        kicker="Quiz Time!"
        question="Does the request now work from Postman?"
        options={[
          { label: 'Yes · it always did: no browser, no guard', correct: true },
          { label: 'No · Postman needs the header too' },
          { label: 'Only from :3000' },
          { label: 'Only if the allow-list is set to *' },
        ]}
        hint="Who enforces CORS: the server, or the browser?"
      />
    ),
  },

  /* ---- Close (§10) ---- */
  {
    id: 'crack',
    label: 'A crack in the wall',
    section: 'Wrap-up',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="Before we close"
        title="A Crack in the Wall"
        lead="Look closely at that products page. Really look."
        points={[
          { text: 'Some images broken, some fields blank', icon: 'eye', tone: 'accent' },
          { text: 'Try logging in → it fails completely', icon: 'lock', tone: 'brand' },
          { text: 'Yet the Network tab swears: 200 OK', icon: 'json', tone: 'teal' },
        ]}
      >
        <Callout kind="note" title="The wire works. So why is the conversation failing?" asStep className="!p-3 text-body-sm">
          Session 2: field names, response shapes, login tokens · the API contract, and JWT auth
        </Callout>
      </ContentSlide>
    ),
  },
  {
    id: 'takeaways',
    label: 'Key Takeaways',
    section: 'Wrap-up',
    element: (
      <KeyTakeawaysSlide
        lesson={FOOTER}
        title="Key takeaways"
        lead="setup → ports → the swap → the guard → the fix → configuration"
        points={[
          'Setup · VS Code + Python + Node',
          'Ports · backend 8000, frontend 3000',
          'Client–Server · request in, verdict + JSON back',
          'Origin · scheme + host + port',
          'CORS · the server allow-lists origins',
          'Base URL · configuration, not code',
        ]}
      />
    ),
  },
  {
    id: 'practice',
    label: 'Practice',
    section: 'Wrap-up',
    element: (
      <PracticeSlide
        lesson={FOOTER}
        title="Your Turn"
        prompt="Set this up on your own machine. Every box must check."
        tasks={[
          'node -v and npm -v both print',
          'pip install -r requirements.txt · npm install',
          'Backend 8000, frontend 3000 · both at once',
          'corsheaders: app + middleware + CORS_ALLOWED_ORIGINS',
          'Console fetch :3000 → :8000 returns JSON',
          '.env + src/api.js · no hardcoded host left',
          'Products page renders from Django',
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
        title="Your Feedback"
        prompt="Two minutes of feedback makes the next session sharper."
        link="nxtwave.tech/feedback"
      />
    ),
  },
  {
    id: 'thank-you',
    label: 'All the best!',
    transition: 'zoom',
    element: (
      <ThankYouSlide
        title="All the best!"
        message="A request that finally lands · an address that lives in configuration"
        nextUp="Session 2 · API Contract & JWT Auth"
      />
    ),
  },
]
