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
   ├── Concept 1: divider → one framework, 4-5+ content slides
   ├── Concept 2: divider → one framework, 4-5+ slides  [+ mid-deck Quiz]
   ├── Concept 3: divider → one framework, 4-5+ content slides
   └── Concept 4: divider → one framework, 4-5+ content slides
   │
Quiz Time! → Recap → Practice → Feedback → Thank you (next-up teaser)
```

- **Each concept runs one narrative framework** (section 2), named in the plan:
  **STAR** for a mechanism (the default), **4MAT** for a definition, **SCQA**
  for a choice, **Merrill** for a skill the learner performs. Whichever it is,
  the concept opens on a felt need and closes on something observable. Four or
  five slides is the floor, not the target — a build sequence
  (section 3) expands the Action, and the measured decks run 6 to 16 slides
  per concept. The floor was `2 to 4` until sessions 2 and 5 both recorded in
  their own plans that they had exceeded it and were right to.
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

## 2. Narrative flow: the invariant, and the four frameworks

**Hard rule.** Never introduce anything cold. Every concept in every deck obeys
one invariant, and then picks a middle to suit what kind of concept it is.

### The invariant, which never varies

| | Every concept, without exception |
|---|---|
| **Opens on** | a felt need. The routine the learner already has, and the point it breaks or falls short |
| **Closes on** | something observable. A thing run, seen, chosen with a reason, or done by the learner |

Everything between the opening and the close is the **middle**, and the middle
is the only part that varies. This split is deliberate: the opening and the
close are what a reviewer checks in seconds, so they are fixed. If the choice of
framework could change them, the rule would have no teeth and every cold-opened
concept would be retro-labelled to whichever framework happened to excuse it.

### Choosing the middle

Four frameworks, chosen by what kind of concept it is. **STAR is the default and
covers most concepts in these decks.**

| The concept is | Use | Slides | The one-line review check |
|---|---|---|---|
| a mechanism, instruction, file, command or config | **STAR** | 5+ | Two Situation slides, and a Result that was run |
| a definition, a "what is X", with no mechanism yet | **4MAT** | 4+ | A *Why* slide sits before the *What* slide |
| a choice between two or more options | **SCQA** | 4+ | An explicit *Question* slide, then a stated verdict with its reason |
| a skill the learner must perform themselves | **Merrill** | 5+ | An *Application* slide where the learner does it, not watches it |

**When in doubt, STAR.** A concept that seems to need one of the other three
usually needs STAR and a clearer break in its Situation.

**The set is open.** A fifth framework may be added when a concept is genuinely
explained better by one, but admission has a price: see "The set is open, and
admission has a price" below. It is registered before it is used, never picked
mid-generation.

**One framework per concept.** Not per slide, and never two blended. The plan
names which one each concept uses, and that name is what the sign-off gate
checks against the table above.

### STAR, the default: a mechanism, a file, a command

Four movements, **five slides minimum**:

| Movement | Slides | The question it answers | What the slides show |
|---|---|---|---|
| **S** Situation | **2** | What works today, and what does it cost? | first the routine the learner already has, running; then the point where that routine breaks or falls short |
| **T** Task | 1 | What do we need? | the capability, named in plain words, before any syntax |
| **A** Action | 1 | How do we do it? | the instruction, the command or the file |
| **R** Result | 1 | Did it work? | the run, with its `→ expected` line |

The movements are slides, not bullets on one slide: one idea per slide still
holds, so **a STAR concept costs five slides and never fewer**. If it is not
worth five, it is not a new concept and belongs as a line on an existing slide.

#### Situation is two slides, and the second one is the whole rule

A Situation that shows only the working routine is a **preamble, not a
Situation**. The break is the load-bearing slide of the entire concept, and
because STAR gives the cost no letter of its own, it is the beat that silently
disappears. **A concept whose plan lists one Situation slide is wrong on its
face** — that is the single fastest way to review a plan against this rule.

Two tests, both applied at plan time:

- After the Situation, the learner can state the problem **in their own words**,
  without having heard the solution.
- Delete the Situation. If the Task still reads sensibly, there was no tension
  in it and the concept opens cold.

#### Task carries no syntax

Task is the movement that gets skipped. Naming the capability in the learner's
own words ("we need the container to read the same secrets our `.env` file
holds") is what makes Action land as an answer rather than as a fact to
memorise. A slide that opens with the syntax has already lost the sequence, and
a Task slide holding a command is an Action slide mislabelled.

#### Result closes the concept

Every STAR concept lands in something the room watched happen: a command run, a
page rendered, a log line, a status code, a container listed. Section 6 gives
the format and the mandatory `→ expected` line.

### 4MAT: a definition, where nothing runs yet

For a concept that is an idea before it is a mechanism: *what deployment is*,
*what CI and CD stand for*, *what a container is*. STAR fits these badly,
because forcing a Result onto a concept with nothing to run produces a fake one.

| Movement | Slides | Shows |
|---|---|---|
| **Why** | **2** | the invariant opening: the routine, then what it costs. Same two slides as STAR's Situation |
| **What** | 1 | the thing, named, with its plain-words gloss (section 2b) |
| **How** | 1 | how it works, in the learner's terms, still no syntax |
| **What if** | 1 | where the learner will meet it, and what changes because of it |

**The check: a *Why* slide sits before the *What* slide.** A definitional
concept opening on its definition is the exact failure this whole section
exists to stop, and it is the most tempting place to make it.

**What if is the close, and it is not optional.** It is what replaces STAR's
Result when nothing can be run: the concept still ends on something observable,
namely a named consequence in the learner's own work. "From here on, every one
of our sessions ends with the pipeline running this same check" is a close.
"That is what CI/CD means" is not.

### SCQA: a choice between options

For every comparison. Section 7 already requires a same-shape comparison closed
by an explicit verdict; SCQA is that requirement written as a sequence.

| Movement | Slides | Shows |
|---|---|---|
| **Situation** | 1 | what we now need to do |
| **Complication** | 1 | more than one way to do it, and no obvious pick |
| **Question** | 1 | the choice, stated as a question, on its own frame |
| **Answer** | 1+ | the same-shape comparison, then the verdict **with its reason** |

**The check: the Question is its own slide, and the verdict names a reason.**
Content rule 16 governs that frame. A comparison table with no verdict is the
failure section 7 records; a verdict with no reason is the same failure wearing
a conclusion.

### Merrill: a skill the learner must perform

For the concepts where the deliverable is the learner's own hands on the
keyboard: writing the compose file, building the pipeline, running the deploy.

| Movement | Slides | Shows |
|---|---|---|
| **Activation** | **2** | the invariant opening, told as what the learner already has and where it stops |
| **Demonstration** | 1+ | it done once, completely, in front of them. A build sequence lives here (section 3) |
| **Application** | 1 | the learner does it, on a symmetric case, with the shape given and the solution withheld |
| **Integration** | 1 | where this now fits in the work they keep |

**The check: an Application slide where the learner does it, not watches it.**
This is the repo's existing `Try it by yourself` frame (section 8), and Merrill
is the only one of the four frameworks that makes it structural rather than a
nicety. Give the shape, never the solution.

### The set is open, and admission has a price

**A fifth framework may be added.** If a concept is genuinely explained better by
something outside the four, use it — but it is admitted the way an approved slide
type is admitted (content rule 14), not invented in passing.

**The invariant is not negotiable.** A new framework replaces the middle. It
never touches the opening or the close. Anything that wants to open cold, drop
the close, or license re-explaining is not a new framework: it is a request to
repeal sections 2, 2b or 3, and that is a conversation with the user, not a
choice at plan time.

Five conditions, all of them:

| | Condition |
|---|---|
| 1 | It **satisfies the invariant**: opens on a felt need, closes on something observable |
| 2 | It makes **an argument none of the admitted frameworks makes**. Same test as a new component (`generate-slides` section 6) |
| 3 | It ships with **its own one-line review check**, of the kind in the table above. A framework nobody can check is a preference |
| 4 | It is **registered before it is used**: a row in the table above, a row in `RULES.md`, and a paragraph here saying what it is for. Added with the user's confirmation, per `RULES.md`, "How a rule gets added" |
| 5 | It is **chosen at plan time and named in the plan**. Never during generation |

**Condition 5 is the anti-abuse clause.** A framework named while slides are
being written is almost always a label applied after the fact to a concept that
already broke the rule. The admitted set exists so that a plan can be reviewed;
a set that grows during generation cannot be.

**The burden is on the new framework.** Most concepts that seem to need one need
**STAR and a clearer break in the Situation**. Before proposing one, write the
concept as STAR and show what it loses.

**Keep the set small.** Past five or six, the table stops selecting and starts
excusing: whatever a concept did, some row will fit. If a candidate's argument
is close to one already admitted, extend that one instead.

#### Two candidates, neither admitted yet

Recorded here as worked examples of what would pass conditions 1 to 3, and as
the two most likely to earn a row in these decks. **Neither is approved: using
either needs the user's confirmation and condition 4 first.**

| Candidate | The argument nothing admitted makes | Would suit | Its check |
|---|---|---|---|
| **Predict, Observe, Explain** ([White and Gunstone, 1992](https://arbs.nzcer.org.nz/predict-observe-explain-poe)) | The learner **commits to a prediction before seeing the outcome**. STAR tells them what breaks; POE makes them guess, then be wrong. A surprise they predicted teaches more than one they watched | a counter-intuitive behaviour, where the learner's existing model is wrong: what survives a container being deleted, what a rebuild does to a volume, what `latest` actually points at | a Predict slide the learner answers **before** the Observe slide exists, and an Explain slide that names the wrong model, not just the right one |
| **Productive failure** ([Kapur](https://www.cse.iitk.ac.in/users/se367/14/Readings/papers/kapur-14_productive-failure-in-learning-math.pdf); [Sinha and Kapur meta-analysis, 53 studies](https://journals.sagepub.com/doi/10.3102/00346543211019105)) | The learner **attempts it before any instruction**. Merrill demonstrates then applies; this applies then demonstrates. Equal on recall, better on transfer to a problem they have not seen | a skill where the struggle is the lesson, and only where failing is cheap and safe | an attempt slide before any instruction, and a comparison slide that puts the learner's likely attempt beside the expert one |

Both carry a real cost for this audience: they spend slides, and they ask a
beginner to be wrong on purpose. Productive failure in particular is **calibrated
struggle, not sink-or-swim**, and a deck that ships it carelessly teaches a slow
learner that they cannot do this. That is the argument to settle before either
gets a row, and it is why they are listed rather than admitted.

### The deck is one chain, whichever frameworks it uses

The frameworks vary; **the join does not.** Concept N's close is concept N+1's
opening, and the divider inherits it. A deck whose concepts each pass their own
framework individually can still read as four unrelated topics, which is exactly
the failure this join prevents.

The same chain runs at three scales, and they are the same rule:

| Scale | The close that becomes an opening |
|---|---|
| Concept | the Result, What if, Answer or Integration that closed concept N opens concept N+1 |
| Session | slide 3, `Where we Left Off`, ends by naming the gap today closes |
| Course | the closing teaser names the next session by title |

Bounded by hard content rule 4: a cost named inside a concept is **resolved
inside that concept**. Chaining forward is a handoff, never an opened problem
left hanging.

### Where the frameworks come from, and the two deviations

All four legislate tension before mechanism, which is why the invariant above
can be shared: Minto's **SCQA** puts a Complication before the Answer, Merrill's
**First Principles** are problem-centred and close on application rather than
explanation, McCarthy's **4MAT** asks *Why* before *What*, and **STAR** is
borrowed from behavioural interviewing, where the teller already knows the
ending.

Two deviations from textbook STAR are deliberate, and both are load-bearing:

1. **T is the learner's capability, not an assigned task.** There is no
   assignment in a session; there is a cost the learner is now feeling.
2. **The Complication has no letter, so it is legislated as Situation's second
   slide.** Every other framework here gives tension its own beat. STAR does
   not, and that is the one place this rule compensates by hand.

**Why this rule exists.** Session 4 of the Django deployment course
(`Running the Real App with Docker`) shipped with `ENV PYTHONUNBUFFERED=1`,
`.dockerignore`, published ports, and the database move all introduced as bare
instructions on slides 14, 26, 31, 44 and 57. Review comments on all five said
the same thing in different words: *give the problem first, then provide this
as the solution.* Each re-cut cost two extra slides that the original plan
should have carried.

### The corpus shape, unchanged

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

## 2b. Prerequisite discipline: nothing appears before it is introduced

**Hard rule.** Every session in this repo is taught to **absolute beginners**,
and the working assumption is a learner who does not grasp quickly. That
assumption does not license repetition. It licenses **order**.

### The rule, in four parts

1. **No term, tool, file or concept appears on a slide before the slide that
   introduces it.** Not in a lead, not in a bullet, not in a callout, not in a
   terminal comment, not in a table cell, not in a figure label.
2. **An introduction is never dropped in.** It says *why it is being introduced
   here*, which is exactly what STAR's Situation and Task already do. A term
   that arrives without a felt need is a term the learner memorises and forgets.
3. **A term used later names where it came from**, in the learner's terms, not
   by slide number (content rule 22): "the image we built in concept 2", not
   "the image from slide 19".
4. **Explained once, used often.** A second *explanation* of a term is a defect.
   A second *use* of it, in new surroundings, is the design.

### The placement test, which makes placement derivable

A concept is placed where the learner can connect it. The operational form:

> **A concept's Situation must be writable using only terms already introduced.**

If writing the Situation forces in a term the learner does not have, the concept
is in the wrong place, and there are exactly two fixes:

| Fix | When |
|---|---|
| Move the concept later, after the prerequisite | the prerequisite is a concept in its own right |
| Introduce the prerequisite first, inside this concept's Situation | it is one term, and it takes one slide |

There is no third option. "The instructor will explain it verbally" is not one:
a deck that only works when narrated is not the deck that gets handed to the
next instructor.

### The escape hatch, and how narrow it is

<!-- TODO(user): fill this clause in. See the note in the session where this
     section was written. The two fixes above cover a prerequisite that the
     course teaches somewhere. They do not cover a term the course NEVER
     teaches and the session cannot avoid — YAML in a compose session, HTTP
     status codes in an API session, a term from the learner's own OS.
     Write the ruling here: what qualifies as unavoidable, what the deck owes
     such a term (a gloss? a full STAR? a footnote?), and who decides. Left
     open deliberately, because a loosely written exception here dissolves
     the whole rule. -->

### The term ledger

Every plan carries one, and it is checked at the sign-off gate:

| Term | Introduced | Plain-words gloss given there |
|---|---|---|
| image | c2-s1 | a packaged copy of the app, ready to run |
| container | c2-s4 | one running copy of that image |
| volume | c3-s2 | a folder that survives the container being deleted |

Two things fall out of it for free. Any term on any slide is either already in
the ledger above that slide, or it is being introduced there and gets a row.
And a term carried in from an **earlier session** gets a row too, marked with
that session, so slide 3's `Where we Left Off` is the ledger's own opening.

### Register: how simply it has to be said

- **One new named term per slide.** Two new terms on one slide is the
  one-idea-per-slide rule being broken in vocabulary rather than in content.
- **The plain-words gloss comes before the formal name**, never after. "A
  packaged copy of your app, ready to run anywhere. That package is called an
  **image**." Not "An image is an immutable filesystem snapshot".
- **No word in a gloss may itself need a gloss.** If explaining the gloss needs
  another term, the gloss is not in the learner's vocabulary yet.
- **Every abstraction gets a concrete referent within the same slide**, from the
  products the learner already uses (section 9).
- **No unexpanded acronym, ever.** CI/CD, WSGI, ORM, DNS all get their words
  spelled out on first use. Session 5 shipped a section called
  `Makefile in CI/CD` without the deck ever saying what either letter stands
  for; six slides had to be added on review.

### Why this rule exists

Two failures, both already recorded in this repo's own review logs:

- **Session 5** named `CI/CD` in a section title and taught around it for six
  slides before anyone noticed the words had never been said. The review comment
  was *"CI/CD is new for students so we need to update flow and explanation"*,
  and the fix cost six new slides.
- Every review pass that has re-cut a deck for pacing has re-cut it in the same
  direction: a mechanism arrived before the vocabulary needed to state its
  problem, so the problem could not be stated, so the mechanism arrived cold.
  That is this rule and section 2 failing together, and they fail together
  because they are the same failure at two scales.

## 3. Break it down: nothing arrives assembled

**Hard rule, and the strictest one here for a beginner audience.** An artefact
with more than one part is **never shown complete on its first appearance**.
It is built one element per slide, and only then shown whole.

This is where STAR's **Action** movement expands, and Merrill's
**Demonstration** with it. Action is one slide only when
the instruction is one line. The moment the artefact has parts — a Dockerfile, a
command chain, a compose file, a pipeline, a diagram — Action becomes a build
sequence, and the concept grows from five slides to five plus however many parts
the artefact has. That growth is correct and is why five is a floor.

**The test:** a learner pausing on any slide of the sequence can say what
changed since the previous one, in one sentence. If they cannot, two things
landed at once.

**What "one element" means, per artefact type:**

| Artefact | One element is |
|---|---|
| a file | one line, or one directive |
| a command chain | one command |
| a diagram | one node, one arrow, or one label |
| a table | one row |
| a config | one key |

Never two, never "these two go together". If two lines genuinely cannot be
understood apart, the first slide shows both and the annotation explains why
they are inseparable — that is a stated exception, not a shortcut.

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

This is STAR's **R**, and section 2 makes it mandatory for every STAR concept.
The other three frameworks close on their own observable: 4MAT's *What if*,
SCQA's verdict, Merrill's *Application*. This section gives the format for a run.

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
- [ ] One divider per concept, at least five content slides each
- [ ] Recap of last session present, ending on the gap today closes
- [ ] Agenda and recap carry the same four items in different UI
- [ ] Each concept opens on motivation, not on a definition
- [ ] **Every concept names its framework**, and it matches the kind of concept:
      STAR for a mechanism, 4MAT for a definition, SCQA for a choice, Merrill for
      a skill the learner performs
- [ ] Any framework used outside those four was **registered first**, with the
      user's confirmation, and is named in the plan
- [ ] Every concept opens on a felt need: the routine, then the point it breaks
- [ ] Every concept closes on something observable: run, seen, chosen with a
      reason, or done by the learner
- [ ] **A STAR concept has TWO Situation slides.** One means the cost beat is
      missing, which is this rule's known failure mode
- [ ] A 4MAT concept has a *Why* slide before its *What* slide
- [ ] An SCQA concept states the choice as a question on its own frame, then
      gives a verdict with its reason
- [ ] A Merrill concept has an *Application* slide where the learner does it
- [ ] Concept N's close opens concept N+1, and its divider inherits it
- [ ] A term ledger is present, and every term on every slide is in it at or
      above that slide
- [ ] Each concept's Situation is writable from already-introduced terms only
- [ ] One new named term per slide, gloss before the formal name
- [ ] Every acronym spelled out on first use
- [ ] No term is explained twice
- [ ] Each multi-part artifact is built one element per slide, then shown whole
- [ ] Each abstraction opened once, showing the real mechanism
- [ ] Each build followed by a test slide with expected results
- [ ] Every comparison closed with a stated verdict and reason
- [ ] Quiz late, plus a mid-deck quiz at the load-bearing concept boundary
- [ ] Next session named on the closing slide
