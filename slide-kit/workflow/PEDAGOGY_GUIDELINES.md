# Pedagogy guidelines for NIAT / NxtWave session decks

How a session is sequenced, how an idea is unfolded, and how understanding is
checked. Derived from the same corpus as `TEXT_GUIDELINES.md`: the 23 decks in
`pptx_template/sample_ppts`, 1,274 slides, 208 measured build sequences.

`TEXT_GUIDELINES.md` governs the words on a slide. This document governs which
slides exist and in what order. `SLIDE_WORKFLOW.md` governs the process that
produces them.

> **Precedence.** `.claude/skills/slide-content-rules/SKILL.md` overrides this
> document wherever they disagree. Most relevant here: **one idea per slide**,
> a numbered series the learner weighs individually gets **one item per slide**
> even past four; **a later problem is named, never opened**; text and its
> supporting visual **reveal together**, never text then picture.

---

## 1. Deck shape

A session deck is **55 to 70 slides** (corpus median 59) built on a fixed frame:

```
Brand → Welcome → Recap of last session → Agenda → Initial Setup
   │
   ├── Concept 1: divider → 2-4 content slides
   ├── Concept 2: divider → 2-4 content slides   [+ mid-deck Quiz Time!]
   ├── Concept 3: divider → 2-4 content slides
   └── Concept 4: divider → 2-4 content slides
   │
Quiz Time! → Recap → Practice → Feedback → Thank you (next-up teaser)
```

- **At most four concepts per session.** Every section of the TR doc maps under
  one of them. The agenda shows exactly these four; the deck carries exactly one
  divider per concept; the recap restates exactly these four as outcomes.
- **The agenda and the recap are the same four items in different UI.** The
  agenda states them as topics, the recap as things the learner can now do.
- **Slide 3 is the previous session's recap** (`Where we Left Off`, 16
  occurrences). It ends by naming the gap that today closes: "But the token
  doesn't do anything yet. Right now, anyone can still add, edit or delete
  products even without logging in. Today we put locks on the doors."
- **Slide 5 is `Initial Setup`**, the venv and requirements commands, so every
  learner starts the session from the same running state.
- The deck ends by naming the **next** session by title, as a teaser slide.

## 2. Motivation before mechanism

### The four beats of a new concept

**This is a hard rule, not a pattern to aim for.** Never introduce a mechanism
cold. Every new concept, every new instruction, every new file, moves through
four beats, in this order:

| Beat | The question it answers | What the slide shows |
|---|---|---|
| 1 | **What works today?** | the routine the learner already has, running |
| 2 | **What does it cost?** | the point where that routine breaks or falls short |
| 3 | **What do we need?** | the capability, named in plain words, before any syntax |
| 4 | **How do we do it?** | the instruction or command, then the run that proves it |

Beat 3 is the one that gets skipped. Naming the capability in the learner's
own words ("we need the container to read the same secrets our `.env` file
holds") is what makes beat 4 land as an answer rather than as a fact to
memorise. A slide that opens with the syntax has already lost the sequence.

The beats are slides, not bullets on one slide: one idea per slide still holds,
so a concept costs three to five slides. If a concept is not worth four beats,
it is not a new concept and belongs as a line on an existing slide.

**Why this rule exists.** Session 4 of the Django deployment course
(`Running the Real App with Docker`) shipped with `ENV PYTHONUNBUFFERED=1`,
`.dockerignore`, published ports, and the database move all introduced as bare
instructions on slides 14, 26, 31, 44 and 57. Review comments on all five said
the same thing in different words: *give the problem first, then provide this
as the solution.* Each re-cut cost two extra slides that the original plan
should have carried.

No concept is introduced by its definition. The corpus opens every concept with
a felt need, then names the thing that satisfies it:

1. **Everyday reality:** "Web Applications allow us to perform everyday tasks
   like checking bank balances, ordering food, and chatting"
2. **A question the learner cannot yet answer:** "When you log into Gmail, who
   checks your password? When you book a Movie Ticket on BookMyShow, who stores
   your booking?"
3. **The answer, named:** "It's all the backend"
4. **The absence argument:** "Without a Backend, a Web Application is Limited:
   shows UI, but cannot securely handle login, data, real user actions"
5. **Only now, the definition or the tool.**

The same shape governs tool introductions. Frameworks arrive only after the slide
that lists what every backend needs and concludes "Building these from scratch is
time-consuming and error-prone. This is where frameworks come in".

## 3. Progressive disclosure is the default teaching move

208 measured build sequences, median length 2 slides, longest 14. A build
sequence is a run of consecutive slides that share the same title and the same
artifact, each adding exactly one element. The canonical example is the DRF
mixin build, slides 25 to 30:

| Slide | Added | Annotation |
|---|---|---|
| 25 | `from rest_framework.mixins import ListModelMixin` | "Brings the list() method" |
| 26 | `from rest_framework.generics import GenericAPIView` | "Provides queryset + serializer_class that the Mixin reads" |
| 27 | the model and serializer imports | |
| 28 | `class ProductListView(ListModelMixin, GenericAPIView):` | |
| 29 | `queryset` and `serializer_class` | one annotation each |
| 30 | `def get(self, request): return self.list(request)` | "the Mixin does the rest" |

Rules for a build sequence:
- **One new line, one new annotation, per slide.** Never two.
- Previously shown code stays visible, unchanged, in the same position. Elide
  earlier blocks with `...` once the sequence gets long, never re-flow them.
- The annotation format is fixed: `token` on one line, `→ what it does` on the
  next.
- The sequence closes with a slide showing the **whole artifact assembled**,
  plus its payoff line: "~10 lines of code, 5 complete CRUD endpoints".

Where the artifact is a diagram rather than code, the same rule applies: one
node, one arrow, or one label per step.

## 4. Show the mechanism, then the shortcut

The corpus never teaches the abstraction first. It teaches the long way, proves
it works, then earns the short way:

- Manual HTML form → `forms.Form` → `forms.ModelForm`, with a
  `Final Comparison` slide.
- `serializers.Serializer` written field by field ("Long way (manual)") →
  `ModelSerializer` ("Short way") → "ModelSerializer generates this behind the
  scenes, you never have to write it".
- Mixins stacked by hand → `ListCreateAPIView`, closed by the measured slide
  "Same Endpoint, Less Code at Each Step: Plain Django ~15+ lines, Mixins ~8
  lines, Generic Views ~4 lines".

The transition slide between the two is always a friction statement in the
learner's voice: "But notice, we still write the same get()/post() wiring every
time. Isn't there a shortcut? That's exactly what Generic Views are."

## 5. Anti-magic: open the box once per abstraction

Every time the framework does something for the learner, one slide shows the
real code that does it, with numbered callouts:

> `self.list()` is not magic. Here is the real code that lives inside
> ListModelMixin.
> `01 get_queryset()` returns your queryset ·
> `02 get_serializer()` uses your serializer_class with many=True ·
> `03 Response(...)` wraps serializer.data as JSON with a 200 status

Use `01/02/03` numbered callouts (25 occurrences) rather than bullets when the
callouts map to lines of code, so the eye can pair them.

## 6. Every concept lands in something runnable

A concept is not finished until the learner has run it and seen output. The
corpus pairs each build with a `Test it` / `Testing` slide (39 occurrences) that
gives, per endpoint or per action:

```
POST   <domain_url>/api/products/
Body (raw JSON): {"title":"Laptop","brand":"Dell","price":"999"}
→ 201, created product with id
```

The expected result is always stated. A test slide with no `→ expected` line is
incomplete. Terminal transcripts come from the TR doc or a real capture, never
from imagination.

## 7. Comparison before choice

When the session asks the learner to pick something, the choice is preceded by a
same-shape comparison and followed by an explicit verdict with a reason. Flask
vs FastAPI vs Django uses four identical row labels for all three columns
(`Setup effort`, `What's Included`, `Best for`, `Learning curve`), then commits:
"Flask leaves too much for you to figure out. FastAPI is powerful but assumes
you already know your way around. Django strikes a strong balance between
simplicity and production readiness."

Never present a comparison and leave the learner to choose. State which one the
session uses and why.

## 8. Checks for understanding

- **One `Quiz Time!` late in the deck** (in 21 of 23 decks it sits at 90% of the
  deck length, just before the recap), and **a second one mid-deck** in 9 of 23
  decks, at the 50 to 60% mark, always at a concept boundary.
- Place the mid-deck quiz **after** the concept that the rest of the session
  depends on, so a misunderstanding is caught before it compounds.
- Quiz slides reveal the answer only after all options have been shown.
- **`Try it by yourself`** slides hand the learner a symmetric extension of what
  was just built ("You can add RetrieveModelMixin, UpdateModelMixin,
  DestroyModelMixin the same way for the other operations"). Give the shape, not
  the solution.
- **Pause-beat questions inside the flow** are a lighter check, one or two per
  deck: "But who fills it in?", "When is create_user() called?",
  "What language should we use to build our backend?" They are asked on their
  own slide and answered on the next.

## 9. Cognitive-load rules

- **One idea per slide.** If a slide carries two, split it. A numbered series
  the learner must weigh individually gets one item per slide even past four.
- **Text and its supporting visual reveal together.** Never text first, picture
  after.
- **Recurrent scaffolding beats novelty.** The same fixtures (`Initial Setup`,
  `Test it`, `Quiz Time!`, `Recap`) in the same positions in every deck let the
  learner spend attention on content, not on navigation.
- **Anchor abstractions in named real products** the learner already uses:
  Gmail, BookMyShow, YouTube, Google, Instagram, Spotify, Pinterest. Abstract
  claims get a concrete referent within one slide.
- **Continuity across sessions is explicit.** Each deck opens on the previous
  deck's agenda items and closes by naming the next session, so a 23-deck course
  reads as one build, not 23 topics.

## 10. Review checklist for a slide plan

- [ ] Four concepts or fewer, every TR section mapped under one
- [ ] One divider per concept, 2 to 4 content slides each
- [ ] Recap of last session present, ending on the gap today closes
- [ ] Agenda and recap carry the same four items in different UI
- [ ] Each concept opens on motivation, not on a definition
- [ ] Every new mechanism carries all four beats, in order: what works today,
      what it costs, what we need, how we do it
- [ ] Each multi-part artifact is built one element per slide, then shown whole
- [ ] Each abstraction opened once, showing the real mechanism
- [ ] Each build followed by a test slide with expected results
- [ ] Every comparison closed with a stated verdict and reason
- [ ] Quiz late, plus a mid-deck quiz at the load-bearing concept boundary
- [ ] Next session named on the closing slide
