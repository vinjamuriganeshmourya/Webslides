<!-- cSpell:ignore NxtWave behaviour colour colours devPort lucide Flipkart Rowling memberId borrowedBooks displayInfo unDraw -->
# OOPs Theory · Session 1: "Introduction to OOPS"

**STATUS: AWAITING SIGN-OFF**

No slide is generated until this plan is approved. Section 8 is the gate.

| | |
|---|---|
| `SESSION_NAME` | `Introduction to OOPS` (kicker on every content slide, never "Session 1") |
| `COURSE` | `OOPs Theory` (the course scaffolded for session 2) |
| Source | `Reference ppt's/session1oops.pptx` (54 slides, authoritative) and `session1oops.pdf` |
| Project | `oops_theory/introduction_to_oops/` |
| Deck file | `src/decks/introductionToOopsDeck.tsx` |
| Slide count | **52** (from 54 source slides) |
| `devPort` | `5241` |
| `htmlName` | `introduction-to-oops` |
| `NEXT_UP` | `State, Behaviour & Constructor` (source slide 52), which is the deck already built |
| Build rules | `oops_theory/workflow/skills/introduction-to-oops/SKILL.md`, written on sign-off |

**The text comes from the `.pptx`, not the `.pdf`.** Both were read. The PDF's
layout extraction garbles the applications table on source slide 46: it renders
the E-commerce and Social Media cells as "Describes what data and actions a thing
will have" and "A real instance created from the blueprint", which are the
Class/Object definitions from twenty slides earlier. The `.pptx` XML has the real
cells. Anything taken from the PDF alone would have shipped that error.

---

## 1. The five rules this deck is built under

These are yours, from 2026-09-11, and they differ from the session 2 deck on
purpose. Session 2 is **not** being re-cut; the two decks will differ, and §7
says where.

**R1 ONE VARIANT PER LAB, FOR THE WHOLE DECK.** Each lab offers several designs
behind one contract. This deck picks one from each and uses only that one, so a
reader never sees the same kind of content drawn two ways. §3 is the table, with
the reason each won.

**R2 NO ILLUSTRATIONS. INFOGRAPHICS AND ICONS ONLY.** No unDraw, no Nova in the
body, no scene art. Every figure is a diagram that carries data. The only
characters are the fixture frames the kit hardcodes (quiz, practice, feedback,
thank you), which are not content.

**R3 ICONS ARE CHECKED FOR RELEVANCE, ONE BY ONE.** `src/ui/icons.tsx` is the
house set, drawn in this repo, with `lucide-react` (ISC) behind it. An icon that
does not clarify what the label already says is dropped rather than chosen more
carefully. §5 lists every icon this deck uses and what it is doing there.

**R4 NO EMPTY SPACE.** Every slide either fills the content well or centres its
figure in it. The plan says which, per slide, and `align-check.mjs` measures the
result: it reports the dead band under the lowest element as `tail`, so this is
checkable rather than a matter of opinion.

**R5 EVERY WORD FROM THE SOURCE.** No source sentence is cut. What is merged is
duplicate ANIMATION FRAMES: source slides 10 and 11 carry the same paragraph
revealed in two steps, and 43 and 44 are byte-identical. Merging those loses no
word. The one place a word is moved rather than kept in place is the agenda, see
§2.

## 2. Concept map, and the agenda problem

The source's agenda (slide 3) and Key Takeaways (slide 49) both list **six**
items. Hard rule 20 caps the agenda at four and requires the takeaways to restate
it verbatim, and you chose to keep the cap.

| # | Agenda item | Divider | Source slides |
|---|---|---|---|
| 1 | Object-Oriented Programming | 01 | 4 to 14 |
| 2 | The Problem Without OOP | 02 | 15 to 25 |
| 3 | Class - The Blueprint | 03 | 26 to 29 |
| 4 | Object - The Real Thing | 04 | 31 to 44 |
| — | Real-world Applications of OOP | 05, no agenda line | 45 to 47 |

**The two words that come off the agenda list are not lost.** "Creating Multiple
Objects from One Class" is a sub-item under Object in the source's own takeaways,
so it becomes the `sub` line of agenda item 4, exactly where the source puts it.
"Real-world Applications of OOP" keeps its divider and its two content slides,
and it is the `sub` line on no item; it is named in full on its divider and in
the closing frame. This is the same shape session 2 uses for its library project.

## 3. One variant per lab, and why each won

R1. Six labs, six decisions, and one of them is "do not use this lab at all".

| Lab | Chosen | Used on | Why this one, over its siblings |
|---|---|---|---|
| `points-lab` | **`RuleStack`** | 12 slides | Full-width ordered rows: 802px of text column, a claim on its own line and its reason under it. It fills the well, which is R4, and it is the only points variant that does. Its named weakness is stating a sequence where none exists, and this deck's point sets are nearly all taught in order. `PeerCards` flattens a lead and leaves a half-empty row at two items; `LeadAndRest` promotes one point whether or not one leads |
| `definitions-lab` | **`BandSplit`** | 5 slides | Two grounds rather than two type sizes, which says the term is a LABEL and the definition is content. It carries `tone: 'contrast'`, written for a pair that exists to be told apart, and **Class versus Object is the spine of this entire session**. `TermLede` has no room for a glyph and leaves a ragged bottom edge; `TermGrid` is a recap form and this deck introduces every word it defines |
| `pseudocode-lab` | **`LineAnnotated`** | 9 slides | Every pseudocode frame here asks "what does this line mean", never "what are the values". `TraceTable` is the dry-run device and there is no dry run in session 1: nothing is executed, and the only outputs are `PRINT` statements inside a method body |
| `features-lab` | **`AlternatingRows`** | 4 slides | The what and the why side by side, sides swapping so each pair reads as a pair. That is the exact shape of the two industry-application frames and of Real World → Code. `BentoGrid` and `Spotlight` need a hero this content does not have; `EditorialList` drops `icon` and `logo`, which rules it out under hard rule 12 on the slides that name Amazon and Instagram |
| `flowchart-lab` | **`CircuitMap`** | 2 slides | `borrowBook()` has **two** decisions (`IF` / `ELSE IF` / `ELSE`), which rules out `GateFlow` and `TrackSwitch` by their own doc comments: both spend the whole stage on one gate. `CircuitMap` is the textbook notation every learner has already met, and it is the control the other five were measured against |
| `projectcode-lab` | **not used** | — | Its variants answer "where does this live across many real files". This session has no project on disk. Same finding as session 2 |

**Two consecutive slides never use the same figure**, per `STYLE_GUIDE.md` §8,
except where a repeated title signals one build sequence.

## 4. The infographics

R2. Nine figures, and not one of them is a picture of a person.

**From the kit, unchanged:**

| Figure | Used for |
|---|---|
| `DataTable` | the four genuine comparison tables: the Part/Meaning/Examples table (9), the Two Big Problems (21), Thing/OOP Name/Meaning (25), Class vs Object (39) |
| `ObjectState` | a book with its values: A Book on source 6, and the three books on 38. **Promoted to the kit from session 2 yesterday**, and this is the second deck to use it, which is the test of that promotion |
| `FanOut` | one origin, several live things: the floor plan and its two houses (35, 36), and the Book class and its three objects (38) |
| `AnalogyMap` | Floor Plan = Class, Real House = Object (28) |
| `SyntaxBreakdown` via `CodeSyntaxSlide` | the anatomy of `book1 = NEW Book(...)` on the Instantiation slide (40) |
| `Callout` | the five lines the source sets apart as a conclusion, "The information and the actions both belong to the same thing (Book)" and its four siblings |

**Two new figures, and both are adapted from established infographic patterns
rather than invented:**

### 4.1 `ClassBlueprint`

A class box: a name band, an ATTRIBUTES list, a METHODS list, and a rule between
them. **No values**, which is the entire difference from `ObjectState` sitting
next to it in the kit, and the difference this session exists to teach.

The pattern is the UML class box, which is the standard notation for exactly
this and which every reference on teaching OOP uses: three stacked compartments,
name on top, attributes, then operations. Adapted to this repo's rules: DOM
elements rather than `<svg>` (content rule 17), colour from `tokens.ts`, the
compartments entering on the explanatory stagger rather than at once.

Used on source slides 7, 23, 29, 32, 37, 38, 43. **Seven slides, and no kit
figure draws it:** `ObjectState` draws values, `LayerAnatomy` claims an
architecture, `FileTree` is a directory, `CardGrid` is n peers.

### 4.2 `LoosePieces`

The concept-2 argument, drawn: variables scattered on the left with no connector
reaching the functions on the right, a broken link between them, and the count
underneath. It takes an optional `solved` side that collapses the same content
into one `ClassBlueprint` box.

The pattern is the standard "before and after" coupling diagram. The source draws
it by hand three times (19, 20, 22) and then draws its resolution once (23), and
those four frames are the only reason a learner believes concept 2.

Used on source slides 19, 20, 22, 23.

**Both go to `src/ui/trial/` first**, session-owned, and are proposed for the kit
after you have seen them render. That is the same path `ObjectState` took.

## 5. Every icon, and what it is doing there

R3. The house set is fourteen hand-drawn icons plus about twenty lucide picks.
Each one below was checked against the label beside it; anything that only
repeated the label was dropped.

| Icon | On | Why it clarifies |
|---|---|---|
| `book` | the Book class and object frames | the deck's running example is a library book, and it is what tells a Book card apart from a Phone or Car card at a glance |
| `devices` | the Phone column of The Pattern | same job: three columns of identical text need three different silhouettes |
| `settings` | the Car column | an engine is not in the set; a gear is the nearest honest thing for a machine with controls |
| `star` | the Student column | dropped if it reads as a rating. **Flagged: this is the weakest of the three and I would rather leave all three columns iconless than ship one that lies.** Decision C in §8 |
| `cross` | "No connection between them", "Which variable belongs to which function?" | the source itself draws a red ✗ here, and `cross` is the kit's counterpart to `check` for exactly this |
| `warning` | "It breaks when the program grows" | the one line in concept 2 that is a warning rather than a fact |
| `check` | "One box = one book" and the three claims beside the solution box | the resolution of the ✗ two slides earlier, and the pair is the argument |
| `code` | every pseudocode panel's chip | it names the panel as code rather than prose, which matters because pseudocode is neither a file nor a terminal |

**No icon is coloured directly.** They inherit from context, which is the kit's
own rule.

**Logos, under hard rule 12.** Source slide 13 names JavaScript, Python and Java
in its own sentence, and slide 14 shows a wall of language marks. The library has
`java` `javascript` `python` `cplusplus` `csharp` `go` `kotlin` `ruby` `swift` as
PNG, which covers both frames. The applications frames name Amazon, Flipkart,
Instagram and Twitter; the library has `amazon` and `instagram` and **not**
Flipkart or Twitter. Those two would be fetched into `slide-kit/assets/companies/`
first, per hard rule 13, and I will ask before each download.

## 6. Slide-by-slide

`kicker` is the concept name on every content slide. Motion is the explanatory
tier: 520ms entrances, 130ms staggers, 860ms draws. **Fill** says how the slide
answers R4: `well` means the figure spans the content well, `split` means text
column plus figure, `centred` means one figure centred with balanced margins.

### Front (1 to 3)

| # | Type | Content | Figure | Fill |
|---|---|---|---|---|
| 1 | `BrandSlide` | `greeting="Welcome!"` | the mark | fixture |
| 2 | `WelcomeSlide` `minimal` | `Introduction to OOPS` | none | fixture |
| 3 | `AgendaSlide` | the four of §2, item 4's `sub` carrying "Creating Multiple Objects from One Class" | the agenda curve | well |

### Concept 1 · Object-Oriented Programming (4 to 14)

| # | Title | Words from source | Figure | Fill |
|---|---|---|---|---|
| 4 | divider 01 | `Object-Oriented Programming` | none, typographic | fixture |
| 5 | Before OOP | "Let us think about a Library", "A library has many things Books, Members, Shelves, Librarians etc.." | `RuleStack`, one row per thing the library has | well |
| 6 | Before OOP | "Let us pick one thing: A Book", "Every book in the library has some information:", Title/Author/Available with values | `ObjectState` "A Book" | split |
| 7 | Before OOP | "And every book has some actions that can happen to it:", Information and Actions lists, and the conclusion line | `ClassBlueprint` "A Book", plus a `Callout` carrying "The information and the actions both belong to the same thing (Book)" | split |
| 8 | The Pattern | Phone, Car, Student, each with its Information and Actions lists, every item verbatim | three `ClassBlueprint` boxes in a row | well |
| 9 | The Pattern | the Part / What it means / Examples table, and "Both parts belong together", "A car's speed belongs to that car and a phone's battery belongs to that phone", "They are not floating around separately" | `DataTable` plus a `Callout` | well |
| 10 | OOP | "OOP (Object-Oriented Programming) is a way of writing code that copies this real-world pattern", "In OOP, we organise our code around "things" - just like the real world", "Each thing in our code keeps: Its own information (data), Its own actions (behaviour), together in one box" | `RuleStack` | well |
| 11 | Real World → Code | the whole two-column mapping, both headers, all six list items, both `becomes` lines | `AlternatingRows` | well |
| 12 | OOP | "OOP is not JavaScript or Python or Java. It is a style of writing code, a way of thinking" | the three language marks beside the claim | centred |
| 13 | OOP | "Many languages support this style:", "…and more", "We will learn the idea in pseudocode first, then write it in JavaScript later" | a nine-mark language wall | well |

*(source slides 10 and 11 are one paragraph revealed in two steps and become
deck slide 10; no word is dropped)*

### Concept 2 · The Problem Without OOP (14 to 23)

| # | Title | Words from source | Figure | Fill |
|---|---|---|---|---|
| 14 | divider 02 | `The Problem Without OOP` | none | fixture |
| 15 | What Happens Without OOP? | the lead, and the six loose variable lines | `LineAnnotated` | well |
| 16 | What Happens Without OOP? | "Now let us write a function to borrow a book:" and the whole `borrowBook` function | `LineAnnotated` | well |
| 17 | What If We Add 100 Books? | the four variable lines, "300 variables", "100 IF-ELSE conditions!" | `RuleStack` | well |
| 18 | What If We Add 100 Books? | "Visual: Why This Breaks", the Variables and Functions columns, "No connection between them!", "Which variable belongs to which function?" | `LoosePieces` | well |
| 19 | The Two Big Problems | the Problem / What happens table, both rows in full | `DataTable` | well |
| 20 | The Two Big Problems | "This way of writing step-by-step instructions with loose variables and functions is called Procedural Programming", "It works for small programs. It breaks when the program grows" | `BandSplit`, defining Procedural Programming | centred |
| 21 | The Two Big Problems | "PROCEDURAL (Loose pieces)", the three variables, the three functions, "100 books = 300 variables", "Every function checks every variable" | `LoosePieces` | well |
| 22 | Solution | "OOP (One box per thing)", the Book box, "One box = one book", "Data + actions live together", "100 books = 100 boxes", "(no extra variables needed)" | `LoosePieces` with `solved` | well |
| 23 | Solution | "But to create this box, we need two things:" and both bullets; then "In OOP, we have specific names" and the Thing / OOP Name / Meaning table | `RuleStack` then `DataTable`, two slides | well |

### Concept 3 · Class - The Blueprint (25 to 29)

| # | Title | Words from source | Figure | Fill |
|---|---|---|---|---|
| 25 | divider 03 | `Class - The Blueprint` | none | fixture |
| 26 | Class | "A Class is a blueprint. It describes:" and both bullets, and "A class does not hold actual values, it only describes the structure" | `BandSplit` defining Class, plus a `Callout` | well |
| 27 | Class | "Real-life Analogy: Architect's Floor Plan", every line of the floor-plan panel, "Floor Plan = Class (the blueprint)", "Real House = Object (the real thing built from it)" | `AnalogyMap` | well |
| 28 | Writing Our First Class (Pseudocode) | the whole `CLASS Book` listing | `LineAnnotated` | well |
| 29 | `QuizTimeSlide` | the mid-deck quiz, at the concept boundary the rest of the session depends on | fixture | fixture |

### Concept 4 · Object - The Real Thing (30 to 43)

| # | Title | Words from source | Figure | Fill |
|---|---|---|---|---|
| 30 | divider 04 | `Object - The Real Thing` | none | fixture |
| 31 | Object | "This is our blueprint, it says:" and both bullets | `ClassBlueprint` | split |
| 32 | Object | "But right now, no actual book exists yet. We have only described the structure just like a floor plan on paper" | `ClassBlueprint`, drawn empty and dimmed | centred |
| 33 | Object | "An Object is a real thing created from a class", "When we create an object from a class, the object gets:" and both bullets | `BandSplit` defining Object against Class | well |
| 34 | Object | "Real-life Analogy (continued)", BLUEPRINT, ALI'S HOUSE and SAM'S HOUSE panels, every line | `FanOut` | well |
| 35 | Object | "Both houses were built from the same plan, but they are independent. Painting Ali's house blue does not make Sam's house blue" | `Callout` under the previous figure's echo | centred |
| 36 | Creating Objects | the class listing, the comment line, all three `NEW Book(...)` lines, "Now we have three real books, each with its own data" | `LineAnnotated` | well |
| 37 | Creating Objects from-Book Class | "Visual: One Class, Three Objects", the blueprint's six members, all three books' values, "Each object has its OWN copy of the data.", "Changing book1 does NOT affect book2 or book3." | `FanOut` into three `ObjectState` cards | well |
| 38 | Class vs Object - The Key Difference | the five-row table, every cell | `DataTable` | well |
| 39 | Instantiation | "Creating an object from a class is called Instantiation", "The object is called an Instance of the class", the annotated `NEW Book(...)` line, "Class name (the blueprint)", "This is INSTANTIATION", "book1 is an INSTANCE of Book" | `CodeSyntaxSlide` | well |
| 40 | Before OOP | the six procedural variable lines, "Before OOP (Procedural)" | `LineAnnotated` | well |
| 41 | Before OOP | the `borrowBook` function and the call | `CircuitMap`, the two decisions drawn | well |
| 42 | After OOP | the whole `CLASS Book` with `METHOD borrow()` | `LineAnnotated` | well |
| 43 | After OOP | the two `NEW Book(...)` lines and both `.borrow()` calls | `CircuitMap`, the same logic with one object | well |

### Real-world Applications of OOP (44 to 46)

| # | Title | Words from source | Figure | Fill |
|---|---|---|---|---|
| 44 | divider 05 | `Real-world Applications of OOP` | none | fixture |
| 45 | Where is OOP Used in Real Industry? | "OOP is not just for learning. It is used everywhere in the software industry", and the E-commerce, Social Media and Banking Apps rows in full | `AlternatingRows` with the Amazon and Instagram marks | well |
| 46 | Where is OOP Used in Real Industry? | the Games and Our Library project rows, and "When we go for a placement interview, interviewers expect us to think in objects, not in loose variables and functions" | `AlternatingRows` plus a `Callout` | well |

### Close (47 to 52)

| # | Type | Content |
|---|---|---|
| 47 | `QuizTimeSlide` | immediately before the takeaways, per hard rule 18 |
| 48 | `KeyTakeawaysSlide` | the four agenda items verbatim, item 4 carrying its "Creating Multiple Objects from One Class" sub-line, and Real-world Applications named in the lead |
| 49 | `PracticeSlide` | pick any everyday thing and write its class in pseudocode, attributes and methods |
| 50 | `SectionBreakerSlide` | `Next Session: State, Behaviour & Constructor` |
| 51 | `FeedbackSlide` | fixture |
| 52 | `ThankYouSlide` | fixture, carrying "ALL THE BEST" |

## 7. Where this deck and session 2 will differ, deliberately

You chose not to re-cut session 2, so the two decks are built under different
rules and a reader will see it. Recorded here so it is a decision and not drift.

| | Session 1 (this) | Session 2 (built) |
|---|---|---|
| definitions variant | `BandSplit` only | `TermGrid`, `TermLede` and `BandSplit` |
| points variant | `RuleStack` only | `RuleStack`, `PeerCards` and `LeadAndRest` |
| dividers | typographic | unDraw illustrations |
| source coverage | every word | some frames merged |

If that gap becomes a problem, re-cutting session 2 to these rules is about a
day's work and the plan for it already exists.

## 8. The sign-off gate

Three decisions.

**A. The two new figures.** `ClassBlueprint` (seven slides) and `LoosePieces`
(four slides) are built session-owned under `src/ui/trial/`, promoted to the kit
after you have seen them. **Recommended: as planned.**

**B. Two logos to fetch.** Flipkart and Twitter are named on source slide 46 and
are not in `slide-kit/assets/companies/`. Hard rule 12 wants a mark beside a named
brand. Fetch both (into the library first), or set those two names in text only.
**Recommended: fetch.**

**C. The Student icon.** `book` and `devices` are honest for the Book and Phone
columns; `settings` is defensible for Car. Nothing in the set honestly says
Student, and the guidance is that a weak icon should be dropped rather than chosen
more carefully. **Recommended: no icons on that slide at all**, since three
columns with two icons is the half-filled field the resolvers reject anyway.

## 9. Verification

Same sweep as session 2, plus one check this deck's rules add:

```bash
npx vite --port 5241 --strictPort
npx tsc --noEmit -p tsconfig.app.json
export CHROME_PATH=/usr/bin/brave-browser
{ node video-safe.mjs & node qa.mjs & node align-check.mjs & wait; }
node preview.mjs && node scripts/build-preview-page.mjs
```

**R4 is measured, not eyeballed.** `align-check.mjs` reports `tail`, the dead
band between the lowest element and the bottom of the content area, on every
slide. A slide with a large tail is a slide with empty space, and the contact
sheet is then read frame by frame against this plan's `Fill` column.

`npm run typecheck` and `npm run build:html` cannot pass in this repo, which is
pre-existing and recorded in session 2's notes; the deliverable is built with the
`tsc -b` step skipped.
