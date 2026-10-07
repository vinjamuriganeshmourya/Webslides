<!-- cSpell:ignore NxtWave behaviour Rowling devPort -->
# Introduction to OOPS: 20-slide cut, slide-wise plan

**STATUS: SIGNED OFF 2026-09-24.** A yes (zoned layout), B leave Applications out, C no Practice slide.

| | |
|---|---|
| Source | `Reference ppt's/session1oops.pptx` (54 slides; text read from the `.pptx` XML) |
| Deck project | `Rules_beta/introduction_to_oops/` (copied from `slide-kit/slide-template`) |
| Plan (this file) | `Rules_beta/session_plans/introduction_to_oops/plan.md` |
| Deck file | `src/decks/introductionToOopsDeck.tsx` |
| `name` / `htmlName` | `introduction-to-oops-beta` |
| `devPort` | **5242** (5211 to 5241 are taken) |
| Content slides | **20** |
| Compulsory frames | **12** (brand, welcome, agenda, 4 dividers, quiz, takeaways, next session, feedback, thank you) |
| `slideCount` | **32** |

The full 52-slide plan for this source sits at
`oops_theory/session_plans/introduction_to_oops/plan.md` (not signed off). This
one is a separate, shorter cut and does not replace it.

---

## 1. Layout: every content slide follows content rule 32

- **Header:** kicker (the concept) and title only. No lead in the header.
- **Space-1** (x 64..1159): the lead as the first block, then the body, centred
  on y=434 when it fits between y=221 and 647.
- **Heavy slides** may use the whole of Space-1 down to y=709, then Space-2,
  then Space-3, in that order. Nothing above y=162.
- **Speaker box** (x 913..1280, y 0..220): empty.

The kit's slide types still put the lead in the header, so the content slides are
built on a **session-owned `ZonedSlide`** (the slide-9 `ZonedNoteSlide`,
generalised to take any body). Bodies are composed from kit blocks only:
`CodeBlock`, `DataTable`, `CardGrid`, `Card`, `BulletList`, `Callout`,
`AnalogyMap`, `ObjectState`, `SyntaxBreakdown`, `StatTile`.

## 2. Concept map and agenda

Hard rule 20 caps the agenda at four. Real-world Applications is left out (see
decision B).

| # | Agenda item | Divider | Content slides |
|---|---|---|---|
| 1 | Object-Oriented Programming | 01 | 1 to 6 |
| 2 | The Problem Without OOP | 02 | 7 to 12 |
| 3 | Class - The Blueprint | 03 | 13 to 15 |
| 4 | Object - The Real Thing | 04 | 16 to 20 |

## 3. Slide by slide

C = content slide number (the 20). Kicker = the concept name.

### Front

| # | Type | Content |
|---|---|---|
| 1 | `BrandSlide` | `greeting="Welcome!"` |
| 2 | `WelcomeSlide` `minimal` | Introduction to OOPS |
| 3 | `AgendaSlide` | the four items of §2 |

### Concept 1: Object-Oriented Programming

| # | C | Title | Content (from source) | Body |
|---|---|---|---|---|
| 4 | | divider 01 | Object-Oriented Programming | fixture |
| 5 | 1 | Let us think about a Library | "A library has many things: Books, Members, Shelves, Librarians." Pick one: a Book. Information: Title Harry Potter, Author J.K. Rowling, Available Yes. Actions: Borrow, Return, Display details | `ObjectState` "A Book" beside an actions `Card`, `Callout`: "The information and the actions both belong to the same thing (Book)" |
| 6 | 2 | The Pattern | Car (Color, Speed, Fuel Level / Accelerate, Brake, Refuel), Student (Name, Roll Number, Marks / Attend class, Give exam, View result), Phone (Brand, Model, Battery % / Make a call, Send message, Take photo) | `CardGrid` of three cards |
| 7 | 3 | Every Real-world Thing Has Two Parts | Part / What it means / Examples table; "A car's speed belongs to that car and a phone's battery belongs to that phone. They are not floating around separately" | `DataTable` + `Callout` |
| 8 | 4 | What OOP Means | "OOP is a way of writing code that copies this real-world pattern." Each thing keeps its own information (data) and its own actions (behaviour), together in one box | `BulletList` + `Callout` |
| 9 | 5 | Real World to Code | Book: Information (Title, Author, Available) becomes Data/Attributes (title, author, available); Actions (Borrow, Return, Display) becomes Methods (borrow(), returnBook(), display()) | two `Card`s with a "becomes" arrow |
| 10 | 6 | OOP Is a Style, Not a Language | "OOP is not JavaScript or Python or Java. It is a style of writing code, a way of thinking." "We will learn the idea in pseudocode first, then write it in JavaScript later" | Java, JavaScript, Python logos + text |

### Concept 2: The Problem Without OOP

| # | C | Title | Content (from source) | Body |
|---|---|---|---|---|
| 11 | | divider 02 | The Problem Without OOP | fixture |
| 12 | 7 | Loose Variables for Every Book | "Let us write our Library program without the things-in-boxes approach", the six `bookTitle1 ...` lines | `CodeBlock` (pseudocode) |
| 13 | 8 | A Function to Borrow a Book | the whole `borrowBook(title)` with IF / ELSE IF / ELSE | `CodeBlock` |
| 14 | 9 | What If We Add 100 Books? | 300 variables; borrowBook() needs 100 IF-ELSE conditions; no connection between variables and functions | two `StatTile`s + `Callout` (error) |
| 15 | 10 | The Two Big Problems | "This is called Procedural Programming. It works for small programs. It breaks when the program grows." Data is scattered / Functions are disconnected table | `DataTable` + `Callout` (warning) |
| 16 | 11 | One Box per Thing | Procedural: 100 books = 300 variables, every function checks every variable. OOP: one box = one book, data + actions live together, 100 books = 100 boxes | before / after pair of `Card`s |
| 17 | 12 | Class and Object | "To create this box we need two things: a blueprint, and a way to create real books from it." Thing / OOP Name / Meaning table | `DataTable` |

### Concept 3: Class - The Blueprint

| # | C | Title | Content (from source) | Body |
|---|---|---|---|---|
| 18 | | divider 03 | Class - The Blueprint | fixture |
| 19 | 13 | What a Class Is | "A Class is a blueprint. It describes what data (attributes) the thing will hold and what actions (methods) the thing can do." "A class does not hold actual values, it only describes the structure" | `BulletList` + `Callout` |
| 20 | 14 | A Floor Plan Is a Class | Floor plan: 3 Bedrooms, 1 Kitchen, 2 Bathrooms, Balcony, Parking. "We cannot live in a floor plan, but we can build many houses from it." Floor Plan = Class, Real House = Object | `AnalogyMap` |
| 21 | 15 | Writing Our First Class | `CLASS Book` with ATTRIBUTES and METHODS | `CodeBlock` |

### Concept 4: Object - The Real Thing

| # | C | Title | Content (from source) | Body |
|---|---|---|---|---|
| 22 | | divider 04 | Object - The Real Thing | fixture |
| 23 | 16 | What an Object Is | "Right now no actual book exists yet." "An Object is a real thing created from a class." It gets its own copy of the data and access to the methods. Ali's house and Sam's house: same plan, independent | `BulletList` + `Callout` |
| 24 | 17 | One Class, Three Objects | `book1/2/3 = NEW Book(...)` (Harry Potter, Atomic Habits, Clean Code). "Each object has its own copy of the data. Changing book1 does not affect book2 or book3" | `CodeBlock` + three `ObjectState` cards |
| 25 | 18 | Class vs Object | the five-row comparison table, every cell | `DataTable` |
| 26 | 19 | Instantiation | `book1 = NEW Book("Harry Potter", "J.K. Rowling", true)`: class name, INSTANTIATION, book1 is an INSTANCE of Book | `SyntaxBreakdown` |
| 27 | 20 | After OOP | `CLASS Book` with `METHOD borrow()` using `this.available`, then `book1.borrow()`, `book2.borrow()`. No IF-ELSE per book | `CodeBlock` |

### Close

| # | Type | Content |
|---|---|---|
| 28 | `QuizTimeSlide` | before the takeaways (hard rule 18) |
| 29 | `KeyTakeawaysSlide` | the four agenda items, verbatim (hard rule 20) |
| 30 | `SectionBreakerSlide` | Next Session: State, Behaviour & Constructor |
| 31 | `FeedbackSlide` | fixture |
| 32 | `ThankYouSlide` | fixture |

## 4. Wording rules applied

- Source em dashes ("Books, Members — ...") are rewritten with a colon or comma
  (hard rule 1).
- Titles are rewritten where the source repeats one title across several frames
  ("Before OOP" x3, "Object" x6), so each slide names its own idea.
- Pseudocode is copied exactly from the source; no output is invented.

## 5. Verification

`typecheck`, `build:html`, then `video-safe`, `qa` and `align-check` in
parallel, `preview.mjs`, and a screenshot of every slide checked against rule 32
(header holds kicker and title only; body centred on y=434 or inside Space-1).

## 6. Decisions for sign-off

**A. Zoned layout.** Build the 20 content slides on a session-owned `ZonedSlide`
so they follow rule 32. **Recommended: yes** (the kit types would put the lead
back in the header).

**B. Real-world Applications.** The source's section 5 (Amazon, Instagram,
banking, games) does not fit in 20. **Recommended: leave it out.** Alternative:
swap it in for C3 (the Part / Meaning table).

**C. No Practice slide.** The close has quiz, takeaways, next session,
feedback, thank you. **Recommended: as listed.** Say if you want a Practice
frame added (33 slides).

## 7. Built 2026-09-24, and where the deck differs from this plan

Generated into `Rules_beta/introduction_to_oops/`, 32 slides. Deliverable:
`dist-single/introduction-to-oops-beta.html`.

- **Agenda item 1 is on two lines** ("Object-Oriented / Programming"). On one
  line the agenda curve put its end at x=977, 64px into the video rectangle.
  Same words as the divider and the takeaways.
- **Instantiation (C19) shows the shape**, `book1 = NEW Book(title, author,
  available)`, with the values as a placeholder. `SyntaxBreakdown` always
  captions its specimen "the shape, not one example", so a line with real values
  contradicted its own caption. "Harry Potter" is named in the values card.
- **Class vs Object, row 1.** The source's Object cell reads "Describes what
  data and actions a thing will have", which is the Class definition. It is
  written as "A real thing created from the class" (source slide 34's words).
- **Three slides are heavy**: C5 (Real World to Code), C17 (code and three
  objects) and C20 (two code panels). They pin to y=221 and run to y=655..664,
  inside Space-1's 709. C20 also takes Space-2 (body to x=1214). Every other
  content slide is centred on y=434.
