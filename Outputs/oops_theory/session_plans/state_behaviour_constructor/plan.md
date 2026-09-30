<!-- cSpell:ignore NxtWave behaviour colour colours devPort lucide unDraw Storyset Havells memberId borrowedBooks displayInfo returnBook borrowBook -->
# OOPs Theory · Session 2: "State, Behaviour & Constructor"

**STATUS: SIGNED OFF 2026-09-11 · GENERATED**

Approved on the three decisions in §9: **A as planned** (four agenda items, the
library project keeps its divider and gets no agenda line), **B changed**
(unDraw art on the dividers, fetched into `slide-kit/assets/illustrations/`
first), **C as planned** (the new components built, session-owned, promoted after
review).

**The deck as built is 57 slides, not the 55 this plan estimated.** The two extra
frames are `LineAnnotated`'s eight-line ceiling forcing `returnBook()` and
`display()` onto their own slides. §8 below is the plan as approved; the built
deck is the authority, and the session's `CLAUDE.md` §2 and §7 record every
divergence from here.

| | |
|---|---|
| `SESSION_NAME` | `State, Behaviour & Constructor` (kicker on every content slide, never "Session 2") |
| `COURSE` | `OOPs Theory` (new course, scaffolded at `oops_theory/`) |
| Source | `Reference ppt's/session2.pptx` and `Reference ppt's/2. State, Behaviour & Constructor.pdf`, 59 slides, read in full |
| Project | `oops_theory/state_behaviour_constructor/` (to be scaffolded from `slide-kit/slide-template`) |
| Deck file | `src/decks/stateBehaviourConstructorDeck.tsx` |
| Slide count | planned **55**, built **57** (from 59 source slides). See the status note above |
| `devPort` | `5240` (5211 to 5228, 5230 and 5235 are taken) |
| `htmlName` | `state-behaviour-constructor` |
| `NEXT_UP` | `Encapsulation` (named on source slide 57) |
| Build rules | `oops_theory/workflow/skills/state-behaviour-constructor/SKILL.md`, written on sign-off |

---

## 1. What the source contains, and the four places this diverges

All 59 source slides were read. The mapping is not one to one. The divergences
below are the ones worth your attention; everything else is a faithful transfer.

| Source | Becomes | Why |
|---|---|---|
| Recap over **three** slides (2, 3, 5): two bulleted halves and then a six-cell grid of the same six concepts | **one** recap slide, six terms | The three slides say the same six words. `TermGrid` from `definitions-lab` exists for exactly this: a recap of words the room has already met, in the short form they were reduced to |
| Agenda lists **five** items: State, Behaviour, Constructor, this Keyword, Building a Library Project | **four** agenda items; the library project keeps its divider but is not an agenda item | Hard rule 20 caps the agenda at four and requires Key Takeaways to restate it verbatim. The library project is the four concepts applied, not a fifth concept. **This is decision A in §9** |
| "Real-world Example" fan slides (6 to 9) sit before any divider | fan's information opens **concept 1**, fan's actions open **concept 2**, the before/after table closes **concept 2** | The fan is the concrete-before-abstract opener for each of the first two concepts. Sitting loose before the first divider it belongs to no concept, and rule 19 then has no kicker to pin to the slide |
| "Running It Step by Step" over **four** slides (42 to 45), each redrawing both object cards | **three** slides: a question beat, one `TraceTable` carrying all four steps as clicks, one payoff frame | A dry run is one idea delivered over four clicks, which is what `TraceTable` is. Four near-identical slides make the room re-read two unchanged cards three times |
| `this` explained over **six** slides (32, 33, 34, 35, 36, 37), two of which repeat the previous slide verbatim | **five** slides | Source slides 36 and 37 restate slide 35 with no new content |

**Nothing else is dropped.** Two source frames are added that the source does
not have: a `QuestionSlide` before the `this` solution and a `QuestionSlide`
before the dry run, both pause beats where the source already asks the question
in body text ("How does the code know which one we mean?").

**Three typos in the source are corrected silently:** `charegeBattery()` to
`chargeBattery()`, `makecall()` to `makeCall()`, and `"clear"` to `"Clear"` on
source slide 37. Source slide 3's kicker reads "EER Modeling Concepts", which
belongs to a database course and not to this one; the recap slide drops it.

---

## 2. Concept map

Four concepts. One divider each. The library project gets a fifth divider and no
agenda line (decision A).

| # | Concept (agenda wording, verbatim in the takeaways) | Source slides | Ends on the question that opens the next |
|---|---|---|---|
| 1 | State | 6, 7, 11 to 14 | An object holds information. What makes that information change? |
| 2 | Behaviour | 8, 9, 16 to 23 | A method changes an object's values. But who sets the first ones? |
| 3 | Constructor | 25 to 29 | The constructor writes `this.title = title`. Which `title` is which? |
| 4 | this Keyword | 32 to 47 | (closes the teaching) |
| — | Building a Library Project (applied) | 49 to 53 | (closes the session) |

## 3. The narrative spine

1. The room met **class** and **object** last session. A class is a blueprint and
   an object is the real thing. Nothing yet says what an object actually *holds*.
2. So start with a fan in the room. At this moment it has a brand, a speed, and
   a switch that is on. That is **state**: the current information an object
   holds right now.
3. State lives in **attributes**. Every object built from one class carries its
   own copy, so `book1` and `book2` are independent.
4. The fan can also *do* things: switch on, switch off, speed up, slow down. That
   is **behaviour**, and in code it is written as **methods**.
5. The connection is the whole point: **when a behaviour runs, the state
   changes.** `borrow()` flips `available` from true to false, and nothing else
   about the book moves.
6. State changes, methods do not. That rule needs one more thing: somebody has to
   set the *first* values. That is the **constructor**, and it runs on its own.
7. Inside the constructor there are two things called `title`: the parameter
   coming in, and the attribute that belongs to the object. **`this`** is how the
   code tells them apart, and it means "the object I belong to".
8. Run it for real: two books, one `borrow()`, one `display()`. `this` points at a
   different object each time, which is why only `book1` changed.
9. Then apply all four to a second class, `Member`, and the library has two
   classes that work together.

## 4. New vocabulary, and where it is defined

Every term is defined on or before the first slide that uses it (TEXT_GUIDELINES §3b).

| Term | First defined on | In one line |
|---|---|---|
| state | 8 | The current information an object holds right now |
| attribute | 9 | Where an object's state is stored. Also called data or a field |
| behaviour | 15 | What an object can do, the actions it can perform |
| method | 16 | A function that lives inside a class |
| constructor | 23 | A special method that runs automatically and sets the starting state |
| parameter | 32 | A value passed in from outside when the method is called |
| `this` | 33 | The object I belong to |
| instance | 12 | One object built from a class. Used only where the source uses "object" |

## 5. Which lab, and which variation, per content type

This is the mapping the deck is generated from. Every figure below comes from a
`slide-kit` lab or from the kit itself; the two exceptions are named in §6.

| Content type on the slide | Lab | Variation | Why this one and not its siblings |
|---|---|---|---|
| A recap of words already met | `definitions-lab` | `TermGrid` | The only variant that survives six terms; its own doc says it is right for a recap and wrong for introducing anything |
| One term being introduced, alone on the frame | `definitions-lab` | `TermLede` | No card at all, so the definition gets the widest measure in the lab and the term gets display size. There is no example to place, which is what rules out `WorkedExample` |
| Two terms that exist to be told apart | `definitions-lab` | `BandSplit`, both at `tone: 'contrast'` | `contrast` is the tone written for exactly this: a pair read as two things rather than two weights of one thing. The parameter/attribute slide is the case the tone was made for |
| Three claims with a reason each, in an order | `points-lab` | `RuleStack` | Full-width ordered rows. Used only where a sequence genuinely exists, which is its named weakness |
| Two or three things of one kind, no leader | `points-lab` | `PeerCards` | Boxes of one size are the honest claim when the items are peers |
| A set with one claim that leads | `points-lab` | `LeadAndRest` | Reads the lead off `tone: 'lead'` rather than promoting index 0 by accident |
| Pseudocode with a note per line | `pseudocode-lab` | `LineAnnotated` | The per-line note is the thing `CodeBlock` structurally cannot hold, and eight slides here are pseudocode plus a margin note |
| A dry run with values changing | `pseudocode-lab` | `TraceTable` | The canonical trace, one row per click, with the pseudocode line lighting at the same instant |
| A set of actions whose names are the content | `features-lab` | `EditorialList`, `numbered` off | STYLE_GUIDE §8: when the names are the content, a card around each costs the name its size. Four fan actions have no order, so no numbers |
| One thing with parts | `features-lab` | `LayerAnatomy` | A class is one thing with three parts (state, constructor, behaviour). A grid would draw them as unrelated peers |
| A method with one decision in it | `flowchart-lab` | `GateFlow` | `borrow()` has a single IF/ELSE, and `GateFlow` gives the decision physical extent with the failure ejected underneath. Its named weakness is a *second* decision, which this does not have |
| The shape of a call or an assignment, slot by slot | kit | `CodeSyntaxSlide` + `SyntaxBreakdown` | `NEW Book("Harry Potter", "Rowling", true)` is a grammar, not a file and not a console |
| Two or three columns with identical row labels | kit | `DataTable` | The State/Behaviour comparison is genuinely tabular: same three row labels, fragment cells |

**`projectcode-lab` is not used, and that is a finding rather than an
oversight.** Its three variants (`TourStops`, `CallFlow`, `LayerMap`) answer
"where does this live and what calls what" across many real files. This session
has no project on disk: every exhibit is language-agnostic pseudocode of one
class. Reaching for `LayerMap` here would invent an architecture the content
does not have, which STYLE_GUIDE §8 names as the worse lie.

**No figure is used on two consecutive slides.** STYLE_GUIDE §8: the second one
then reads as the first with different words. The one intentional repeat is
`LineAnnotated` on slides 47 and 48, which are one build sequence under a
repeated title, so the repetition is the signal.

## 6. Two new components, and why the kit cannot already draw them

Everything else on this deck composes existing parts. These two do not exist
anywhere in the kit or in any lab, and between them they carry **eleven** slides.

### 6.1 `ObjectState`

A named object with its attribute rows, each row a name and a value, and a
per-row `changed` flag.

```
┌─ book1 ──────────────────┐
│ title      "Harry Potter"│
│ author     "Rowling"     │
│ available  false    ◂ changed
└──────────────────────────┘
```

Nothing in the kit draws this. `DataTable` says "these rows are data" and has no
owner to attach them to. `definitions/*` define words, and `title` here is not
being defined, it is holding a value. `points/PeerCards` states claims. A
`Card` with a title has no row structure. The figure the slide needs is an object
*identity* with values inside it, and the `changed` mark is the entire argument of
five slides: `borrow()` moved one row and left the other two alone.

Used on slides 6, 8, 10, 24, 40. Reused as the unit inside `StateChange`.

### 6.2 `StateChange`

Two `ObjectState` cards with a labelled action between them, the changed rows lit
on the right-hand card only.

```
   before            borrow()            after
  [book1]     ───────────────────▸      [book1]
```

`flowchart/SpineFlow` draws a labelled edge between two nodes, which is the
closest thing, and its nodes are label-plus-caption text. Putting a three-row
object card inside an `FcNode` label fights the variant's own height arithmetic,
and `flowchart-lab`'s doc comment records what happens when a node is handed more
than it sizes for.

Used on slides 16 and 17.

### 6.3 Where they go afterwards

Both live at `src/ui/trial/` in the session, session-owned, following the
precedent set by `deployement_session_2_v2` for the points-lab variants:
`sync-kit.mjs` never touches that folder, and nothing there is claimed as
approved. On your approval they follow section 6 of the generate-slides skill
into `slide-kit/slide-template/src/ui/`, the gallery, the registry and a PR on a
`kit/object-state` branch. Any OOP session after this one wants both.

## 7. Icons, illustrations and assets

Your constraint is open-source only, and the deck meets it without fetching
anything.

- **Icons come from `src/ui/icons.tsx`**, the house set: fourteen line icons on a
  24-grid, drawn in this repo, dependency-free, no third-party licence involved.
  `lucide-react` (ISC licence) is already installed and is the fallback for a
  genuine gap. `Book`, `Bolt`, `Check`, `Cross`, `ArrowRight`, `Bulb` and `Info`
  cover every icon this deck asks for, so the expectation is that lucide is not
  needed at all.
- **No illustration is placed on any divider.** Hard rule 8: an illustration must
  depict the slide's own concept. The kit's illustration set is Nova plus scenes
  built for the Django deployment course (`cors-gate`, `ports-doors`,
  `two-apps`), and not one of them draws state, behaviour or a constructor.
  Putting `toolchain` on the Constructor divider would be filling space. The five
  dividers are typographic `SectionBreakerSlide`s, which is the honest form, and
  the missing asset is recorded as outstanding work.
  **If you would rather have art on the dividers, that is decision B in §9**:
  unDraw (CC0, no attribution required) has usable frames, and they would be
  fetched into `slide-kit/assets/` first per hard rule 13.
- **Nova appears on the fixture frames only**: quiz, practice, feedback, thank
  you. That is the "same-type fixture" reuse `SLIDE_WORKFLOW.md` stage 2 allows.
- **No technology logo is needed.** Hard rule 12 attaches a logo to a named
  technology, and this session names none: every exhibit is language-agnostic
  pseudocode. There is no Python, no Java, no tool.
- **No screenshots.** Nothing is run, so there is nothing to capture, and hard
  rule 11 has no work to do here. No terminal appears in the deck either, so rule
  3 does not apply.

## 8. Slide-by-slide plan

`kicker` is the concept name on every content slide (hard rule 19). Motion is the
explanatory tier throughout: 520ms entrances, 130ms staggers, 860ms line draws.
Where a row says "on entry", text and its figure arrive together (hard rule 6).

### Front frame (1 to 4)

| # | Type | Content | Figure | Motion |
|---|---|---|---|---|
| 1 | `BrandSlide` | `greeting="Welcome!"` | the mark | crossfade |
| 2 | `WelcomeSlide` `minimal` | `State, Behaviour & Constructor` | none | crossfade |
| 3 | `ContentSlide` | title `Where we Left Off`. Six terms from session 1: Object-Oriented Programming, The Problem Without OOP, Class, Object, Creating Multiple Objects, Real-world Applications | `definitions/TermGrid`, six terms, `tone: 'neutral'` | rows stagger on entry, 130ms |
| 4 | `AgendaSlide` | State · Behaviour · Constructor · this Keyword | the agenda curve | kit default |

### Concept 1 · State (5 to 11)

| # | Type | Content | Figure | Motion |
|---|---|---|---|---|
| 5 | `SectionBreakerSlide` | `index={1}` `title="State"` | none, typographic | crossfade |
| 6 | `ContentSlide` | title `Real-world Example`. lead "Think about a fan in a room. At any moment it has some current information" | `ObjectState` "Fan Right Now": Brand `Havells`, Speed `3`, Switched On `Yes` | card on entry, rows stagger 130ms |
| 7 | `QuestionSlide` | "Everything the fan is right now, in three lines. What do we call that?" | none | crossfade |
| 8 | `ContentSlide` | title `State`. The answer. "The current information an object holds right now", "It can change over time as actions happen" | `definitions/TermLede`, one term, `tone: 'new'` | term then definition, 130ms apart |
| 9 | `ContentNoteSlide` | title `Real-world Examples of State`. Book, Phone, Bank Account with their values. note: "In OOP, state is stored in **attributes**, also called data or fields" | three `ObjectState` cards in a row | three cards stagger on entry; note lands with them (`asStep={false}`) |
| 10 | `ContentSlide` | title `Pseudocode`. `CLASS Book` with `ATTRIBUTES: title, author, available` | `pseudocode/LineAnnotated`, note on the ATTRIBUTES block: "This is the STATE" | lines draw, then the note at 860ms |
| 11 | `ContentSlide` | title `Pseudocode` (repeated: build sequence). "Each object created from this class has its own state". caption "The state of book1 is different from book2. Each object is independent" | two `ObjectState` cards, `book1` and `book2` | both on entry, 130ms apart |

### Concept 2 · Behaviour (12 to 20)

| # | Type | Content | Figure | Motion |
|---|---|---|---|---|
| 12 | `SectionBreakerSlide` | `index={2}` `title="Behaviour"` | none | crossfade |
| 13 | `ContentSlide` | title `Real-world Example`. "The same fan also has actions it can do" | `features/EditorialList`, `numbered` off: Switch On, Switch Off, Increase Speed, Decrease Speed | rows stagger on entry |
| 14 | `ContentSlide` | title `Behaviour`. "What an object can do, the actions it can perform". Second line: "When a behaviour runs, it usually reads or changes the object's state" | `definitions/TermLede`, `tone: 'new'` | term then definition |
| 15 | `ContentNoteSlide` | title `Real-world Examples of Behaviour`. Book: `borrow()`, `returnBook()`, `display()`. Phone: `makeCall()`, `takePhoto()`, `chargeBattery()`. Bank Account: `deposit()`, `withdraw()`, `checkBalance()`. note: "In OOP, behaviour is written as **methods**: functions that live inside a class" | `points/PeerCards`, three peers | cards stagger on entry; note with them |
| 16 | `ContentSlide` | title `Pseudocode`. `CLASS Book` now with `METHODS` | `pseudocode/LineAnnotated`, note on the METHODS block: "This is the BEHAVIOUR" | lines draw, note at 860ms |
| 17 | `ContentSlide` | title `State Changes As Behaviour Happens`. lead "Example: borrowing a book". caption "Only `available` changed. The rest stayed the same" | `StateChange`: `book1` before, `borrow()`, `book1` after, `available` lit | before card, then the edge draws 860ms, then the after card |
| 18 | `ContentSlide` | same title (build sequence). lead "Example: a bank account" | `StateChange`: `account1` before, `deposit(5000)`, after, `balance` lit | same timing |
| 19 | `ContentSlide` | title `The Rule`. Rows: What it is / Does it change? / Example. Columns: State (Attributes), Behaviour (Methods) | kit `DataTable` | staggers on entry already |
| 20 | `ContentSlide` | title `Setting Up the Starting State`. Three ordered claims: a new book needs a title, an author and `available` set to true → there is a special method that runs automatically when an object is created → it is called a **Constructor** | `points/RuleStack`, three rows | rows stagger on entry, the third at `tone: 'lead'` |

### Concept 3 · Constructor (21 to 27)

| # | Type | Content | Figure | Motion |
|---|---|---|---|---|
| 21 | `SectionBreakerSlide` | `index={3}` `title="Constructor"` | none | crossfade |
| 22 | `ContentSlide` | title `Constructor`. Runs automatically when we create a new object · Sets the object's starting state · We never call it ourselves | `points/RuleStack`, three rows | stagger on entry |
| 23 | `CodeSyntaxSlide` | title `How the Constructor Works`. Specimen `book1 = NEW Book("Harry Potter", "Rowling", true)`, slots: `book1` the new object · `NEW` triggers the constructor · `Book` which class · the three values. note: "NEW triggers the constructor automatically. We never call it by name" | `SyntaxBreakdown`, `stepped` | specimen immediate, legend rows click-gated |
| 24 | `ContentSlide` | same title. The constructor body receiving those values: `CONSTRUCTOR(title, author, available)` with `set this.title = title // "Harry Potter"` and the other two | `pseudocode/LineAnnotated`, a note per line carrying the value | lines draw, notes follow |
| 25 | `ContentSlide` | same title. "Result: book1 is ready to use" | `ObjectState` `book1` | card on entry |
| 26 | `ContentSlide` | title `Writing the Constructor`. The whole `CLASS Book` with `CONSTRUCTOR(title, author)` and `METHODS`. note on `this.available = true`: "We do not pass `available` from outside. Every new book starts available, so the constructor sets it" | `pseudocode/LineAnnotated`, twelve lines | lines draw, the one note at 860ms |
| 27 | `QuizTimeSlide` | subtitle "What an object holds, what it can do, and the method that sets its first values" | quiz fixture | kit default |

### Concept 4 · the `this` Keyword (28 to 43)

| # | Type | Content | Figure | Motion |
|---|---|---|---|---|
| 28 | `SectionBreakerSlide` | `index={4}` `title="this Keyword"` | none | crossfade |
| 29 | `ContentSlide` | title `The Problem`. The constructor written without `this`: `title = title`, `author = author` | `pseudocode/LineAnnotated`, notes "Which `title` is which?" and "Same problem" | lines draw, notes follow |
| 30 | `QuestionSlide` | "How does the code know which `title` we mean?" `qualifier`: "The value coming in and the value being stored have the same name" | none | crossfade |
| 31 | `ContentSlide` | title `Two Things, One Name`. **parameter**: the value passed in from outside. **attribute**: the data that belongs to the object | `definitions/BandSplit`, two terms, both `tone: 'contrast'` | bands on entry, 130ms apart |
| 32 | `CodeSyntaxSlide` | title `The Solution`. lead "`this` means: the object I belong to". Specimen `this.title = title`, slots: `this.title` the attribute of THIS object · `title` the parameter coming from outside | `SyntaxBreakdown`, `stepped` | specimen immediate, two legend rows gated |
| 33 | `ContentSlide` | title `this`. `book1 = NEW Book("Harry Potter", "Rowling")`. Here `this` is `book1` | `pseudocode/TraceTable`: the two constructor lines, vars `book1.title` and `book1.author` | one row per click, the pseudocode line lighting with it |
| 34 | `ContentSlide` | same title. `book2 = NEW Book("Atomic Habits", "Clear")`. Here `this` is `book2` | `pseudocode/TraceTable`, same lines, `book2` values | same |
| 35 | `ContentSlide` | title `The Rule`. lead "`this` always points to the object being used right now". When we create `book1`, `this` means `book1` · When we create `book2`, `this` means `book2` · `this` works inside any method, not only the constructor | `points/LeadAndRest`, lead plus two | lead on entry, the two rows stagger |
| 36 | `ContentSlide` | title `The borrow() Method`. Constructor plus `borrow()` with the IF/ELSE | `pseudocode/LineAnnotated`, notes "Read THIS object's state" and "Change THIS object's state" | lines draw, notes follow |
| 37 | `ContentSlide` | title `Inside borrow()`. The decision drawn: is `available` true? Yes → set it false, print "borrowed". No → print "is not available" | `flowchart/GateFlow`, one gate, the No branch ejected underneath | nodes stagger, edges draw 860ms, whole figure about 2.4s |
| 38 | `ContentSlide` | same title as 36 (build sequence). `returnBook()` and `display()` | `pseudocode/LineAnnotated`, notes "Change THIS object's state" and "Read THIS object's state" | lines draw, notes follow |
| 39 | `QuestionSlide` | "`book1.borrow()` runs. What happens to `book2`?" | none | crossfade |
| 40 | `ContentSlide` | title `Running It Step by Step`. Four steps: constructor for `book1`, constructor for `book2`, `book1.borrow()`, `book2.display()`, with the output on the last two | `pseudocode/TraceTable`, four trace steps, vars `book1.available` and `book2.available`, output column | one row per click |
| 41 | `ContentSlide` | same title. caption "Only `book1` changed. `book2` is still available, and `display()` read `book2`'s data, not `book1`'s" | two `ObjectState` cards, `book1.available` lit as changed, `book2` untouched | both on entry, the changed row lights at 860ms |
| 42 | `ContentSlide` | title `All Together`. The `Book` class as one thing with three parts: STATE (title, author, available), CONSTRUCTOR (sets all three), BEHAVIOUR (borrow, returnBook, display) | `features/LayerAnatomy` | parts stagger on entry |
| 43 | `ContentSlide` | same title. Constructor sets up the starting state · Methods read or change the state · `this` connects a method to the right object | `points/RuleStack`, three rows | stagger on entry |

### Applied · Building a Library Project (44 to 49)

| # | Type | Content | Figure | Motion |
|---|---|---|---|---|
| 44 | `SectionBreakerSlide` | `index={5}` `title="Building a Library Project"` | none | crossfade |
| 45 | `ContentSlide` | title `The Member Class`. lead "A library also has members who borrow books". Let us grow the project with one more class, and identify its state and behaviour first | `points/LeadAndRest` | lead then rows |
| 46 | `ContentSlide` | title `Library Member`. State: `name`, `memberId`, `borrowedBooks` (starts empty). Behaviour: `borrowBook(book)`, `returnBook(book)`, `displayInfo()` | `points/PeerCards`, two peers: "What we know" and "What they can do" | two cards on entry |
| 47 | `ContentSlide` | title `Writing the Member Class`. Attributes, constructor, `borrowBook()` | `pseudocode/LineAnnotated`, note on `this.borrowedBooks = []`: "Starts with no books" | lines draw, note follows |
| 48 | `ContentSlide` | same title (build sequence). `returnBook()` and `displayInfo()` | `pseudocode/LineAnnotated` | same |
| 49 | `ContentSlide` | title `Creating Member Objects`. `member1 = NEW Member("Ali", "M001")`, two `borrowBook` calls, one `displayInfo()`, and what it prints | `pseudocode/TraceTable` with the output column carrying the five printed lines | one row per click |

### Close (50 to 55)

| # | Type | Content |
|---|---|---|
| 50 | `QuizTimeSlide` | subtitle "One class, two objects, and the keyword that keeps them apart" |
| 51 | `KeyTakeawaysSlide` | **State · Behaviour · Constructor · this Keyword**, verbatim from slide 4 (hard rule 20), in a different UI than the agenda |
| 52 | `PracticeSlide` | Write a `Student` class: state `name`, `rollNo`, `marks`; behaviour `updateMarks()`, `display()`; a constructor that sets the first two and starts `marks` at 0 |
| 53 | `SectionBreakerSlide` | `Next Session: Encapsulation` |
| 54 | `FeedbackSlide` | fixture |
| 55 | `ThankYouSlide` | fixture |

**Count: 55.** `deck.config.json` `slideCount` is set to 55 before any harness runs.

## 9. The sign-off gate

Three decisions, then generation starts.

**A. The fifth section.** The source agenda has five items. Hard rule 20 caps the
agenda at four and makes Key Takeaways restate it verbatim, so the plan above has
four agenda items and gives "Building a Library Project" a divider without an
agenda line, on the reading that the library project is the four concepts applied
rather than a fifth concept. The alternatives are to drop its divider and run
slides 45 to 49 under the `this Keyword` kicker, or to keep five agenda items and
break rule 20. **Recommended: as planned.**

**B. Divider art.** Five typographic dividers, because no illustration in the kit
depicts state, behaviour or a constructor and hard rule 8 forbids filling the
space with one that does not. Say the word and unDraw frames (CC0) get fetched
into `slide-kit/assets/` first, then into the session. **Recommended: as
planned**, and record the missing assets as outstanding.

**C. The two new components.** `ObjectState` and `StateChange` (§6) are
session-owned at `src/ui/trial/` for this deck, and go to the kit through a PR
once you have seen them render. **Recommended: build them, promote after you have
looked at them.**

## 10. Verification, and one thing that will not run

On generation, before handover:

```bash
npx tsc --noEmit -p tsconfig.app.json
npx vite --port 5240 --strictPort            # the harnesses need it already up
export CHROME_PATH=/opt/google/chrome/chrome
node video-safe.mjs & node qa.mjs & node align-check.mjs & wait
node preview.mjs && node scripts/build-preview-page.mjs
```

Then the part the harnesses cannot do: **every slide carrying `ObjectState`,
`StateChange`, `GateFlow`, `LayerAnatomy` or a `TraceTable` is screenshotted and
looked at** (hard rule 17). Eleven slides plus the figure slides is most of this
deck, so the contact sheet from `build-preview-page.mjs` is the route, read
frame by frame.

Your zero-overlap constraint is exactly what `align-check.mjs` plus that visual
pass are for: the three harnesses measure DOM rectangles and an `<svg>` is one
rectangle to all of them, which is why `ObjectState` and `StateChange` are
specified as DOM elements with real text nodes rather than as SVG with `<text>`.
That is a build constraint, not a preference, and it is written into §6.

**`npm run typecheck` and `npm run build:html` cannot pass in this repo as it
stands**, and that is pre-existing rather than something this session
introduces. `tsc -b` fails on `src/export/slideModule.tsx`, which imports the two
generated files `./deckCss` and `./revealSteps`; both are gitignored, neither is
in the repo, and `deckCss`'s generator is missing. `definitions-lab/CLAUDE.md`
records the same thing. The single-file deliverable is therefore built with the
`tsc -b` step skipped:

```bash
npx vite build -c vite.singlefile.config.ts \
  && node scripts/inline-assets.mjs && node scripts/inline-fonts.mjs
```

which produces `dist-single/state-behaviour-constructor.html`, the one file an
instructor opens by double-click. That is the deliverable this plan ends at.
