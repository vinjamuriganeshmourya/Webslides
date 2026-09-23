<!-- cSpell:ignore NxtWave devPort sfgawqhk -->
# Python · Session 3: "Variables and Data Types"

**STATUS: SIGNED OFF 2026-09-22** (approved on the defaults in the sign-off section)

No slide is generated until this plan is approved. Section 6 is the gate.

| | |
|---|---|
| `SESSION_NAME` | `Variables and Data Types` |
| `COURSE` | `Python` |
| Source | `Python_PPT_slide/3_Variables and Data Types.pptx`, 38 slides, read in full |
| Project | `python/3_variables_and_data_types/` |
| Deck file | `src/decks/variablesAndDataTypesDeck.tsx` |
| Slide count | **39** |
| `devPort` | `5230` |
| `htmlName` | `python-session-3-variables-and-data-types` |
| `NEXT_UP` | `Sequence of Instructions` (the source's Next Session slide, 36) |

## 0. The conversion approach

> **Revised at first render, 2026-09-22.** Illustration-first is retired for the
> whole course: *"no need to use existing illustration, build new and our own
> only if required for the content."* Every slide this plan gave a PPT picture
> shipped as a plain typographic slide, and the dividers carry no image. The
> source sentences, the analogies, the quiz positions and the labels stand.
> The rule is `python/workflow/skills/python-course/` R1.

As sessions 1 and 2. This deck's illustrations are few (five) and its real
visual is a **single application form** that returns on nine slides, each time
with a new label on it. That form is the figure this session builds.

The **analogy is preserved exactly**: a sports club announcement, an
application form, the four answers on it, and then "Variables are like
containers for storing values" told with the source's own glass of water that
becomes a glass of orange juice.

## 1. What changes from the source, and why

| Source | Becomes | Why |
|---|---|---|
| One divider (5, "Variables and Data Types") for the whole deck | three dividers: Variables · Data Types · Assignment Operator, the three agenda items | One divider per concept. The source's agenda already names exactly these three |
| Labels drawn as green arrows pointing at form fields and at specimen characters | real labels on the figure (`ApplicationForm` field tags, `SyntaxBreakdown` slots) | Asked for. The source arrow image is kept at `illustrations/arrow-green-source.png` for reference only |
| Boolean Syntax (28): `True` ✔ `False` ✔ `true` ✗ `false` ✗ | `StatusPointsSlide`, verdict per row | The verdict is the content |
| Key Takeaways (34): Variables / Data types / Integer / Float / String / Boolean / Assigning Value to Variable / Assignment Operator | the three agenda strings, source lines as `sub`s | Rule 20 |
| Two Quiz Time frames (19, 33) | unchanged positions: after String, and before Key Takeaways | Asked for |

Everything else maps one to one.

## 2. Concept map

| # | Concept (agenda wording, with the source's sub-line) | Source slides |
|---|---|---|
| 1 | Variables (Containers) | 6 to 12 |
| 2 | Data Types (int, float, string, boolean) | 13 to 30, quiz 19 |
| 3 | Assignment Operator | 31 to 32 |

## 3. Slide-by-slide plan

`R` = `ContentRightImageSlide`, `C` = `ContentSlide`, `Div` =
`SectionBreakerImageSlide`. `Form` = the `ApplicationForm` figure (§4).

### Front frame

| # | Type | Content |
|---|---|---|
| 1 | `BrandSlide` | `greeting="Welcome!"` |
| 2 | `WelcomeSlide` `minimal` | Variables and Data Types |
| 3 | `RecapSlide` | kicker `Recap` · title Leveraging Gen AI for Accelerated learning · AI-powered Learning · Maximize your learning with AI · Code Explanation · Generation · Generating Code · Quiz Generation · Coding Problem Generation (the source's own recap list) |
| 4 | `AgendaSlide` | Variables (sub: Containers) · Data Types (sub: int, float, string, boolean) · Assignment Operator |

### Concept 1: Variables (source 5 to 12)

| # | Type | Title · lead / points | Visual |
|---|---|---|---|
| 5 | `Div` | Variables | `variables-divider.png` |
| 6 | `R` | kicker **Scenario** · **Announcement from Sports Club** · 'We are conducting a sports meet on the eve of New Year's day. Those who want to participate, please fill in the application form provided' | `sports-club-announcement.png` |
| 7 | `C` | kicker **Announcement** · **Application Form** | `Form`, empty: Sport : · Age (in yrs): · Height (in ft) : · Did you participate anywhere before? Yes / No |
| 8 | `C` | **Application Form** | `Form`, filled: Cricket · 10 · 4.2 · ✔ Yes |
| 9 | `C` | **Names and Values** | `Form` as name : value rows, the left column tagged **Variable Names** |
| 10 | `C` | **Names and Values** | same, the right column tagged **Values stored in variables** |
| 11 | `R` | kicker **Variables and Data types** · **Variable** · Variables are like containers for storing values | `glass-water.png` |
| 12 | `C` | **Variable** · Values in the variables can be changed | `glass-water.png` → house arrow icon → `glass-orange.png`, the three in a row as the source drew them |

### Concept 2: Data Types (source 13 to 30)

| # | Type | Title · lead / points | Visual |
|---|---|---|---|
| 13 | `Div` | Data Types | `data-types-collage.png` |
| 14 | `R` | **Value - Data** · Every value is a type of data | `data-types-collage.png` |
| 15 | `C` | **Data Types** · Some commonly used data types · String · Integer · Float · Boolean | four points, house icons |
| 16 | `C` | **Data Types** | `Form` filled, `Cricket` tagged **String** |
| 17 | `CodeSyntaxSlide` | **String Syntax** · Stream of characters enclosed within quotes | `SyntaxBreakdown`: `"` (opening quote) · `Cricket` (the characters, placeholder fill) · `"` (closing quote) |
| 18 | `CodeSyntaxSlide` | **String** · Stream of characters · Capital Letters ( A – Z ) · Small Letters ( a – z ) · Digits ( 0 – 9 ) · Special Characters (~ ! @ # $ % ^ . ?,) · Space | `SyntaxBreakdown` on `"Hello World!"`: `"Hello` · ` ` tagged **Space** · `World` · `!` tagged **Special Character** · `"`; the five character classes as the legend |
| 19 | `C` | **String Examples** · "Hello World!" · "Book" · "1234" · "some@example.com" · "sfgawqhk#$542" · "Bread, Jam and Milk" | six `Chip`s in a two-column list, monospace |
| 20 | `QuizTimeSlide` | subtitle: `Variables, containers, and what makes a value a string` | source position |
| 21 | `C` | **Data Type** | `Form`, `10` tagged **Integer** |
| 22 | `C` | **Integer** · All numbers (positive and negative) without any fractional part · `...-3, -2, -1, 0, 1, 2, 3,...` | the number line as the specimen |
| 23 | `C` | **2 vs "2"** · Mathematical Value vs Character | `ValueTypeMap` (§4): `2` → **Integer** · `"2"` → **String** |
| 24 | `C` | **Data Type** | `Form`, `4.2` tagged **Float** |
| 25 | `CodeSyntaxSlide` | **Float** · Any number with a decimal point · `24.3, 345.210, -321.86` | `SyntaxBreakdown` on `4.2`: `4` · `.` tagged **Decimal Point** · `2` tagged **Fractional Part** |
| 26 | `C` | **2 vs 2.0 vs "2.0"** · Mathematical Value vs Character | `ValueTypeMap`: `2` → Integer · `2.0` → Float · `"2.0"` → String |
| 27 | `C` | **Data Type** | `Form`, `✔ Yes` tagged **Boolean** |
| 28 | `C` | **Boolean** · Data that has one of two possible values. Values that are either · True or False · Yes or No · 0 or 1 · On or Off, etc. | four points |
| 29 | `StatusPointsSlide` | **Boolean Syntax** · `True` works · `False` works · `true` fails · `false` fails | `StatusList`; the source's ✔ and ✗ become verdicts |
| 30 | `C` | **True Vs "True"** | `ValueTypeMap`: `True` → Boolean · `"True"` → String |
| 31 | `C` | **Data Type** | `Form` with all four tags: String · Integer · Float · Boolean |

### Concept 3: Assignment Operator (source 31 to 32)

| # | Type | Title · lead | Visual |
|---|---|---|---|
| 32 | `SectionBreakerSlide` | Assignment Operator | none in the source |
| 33 | `CodeSyntaxSlide` | kicker **Python Syntax** · **Assigning Value to a Variable** · Assigning an integer value 10 to a variable age | `SyntaxBreakdown` on `age = 10`: `age` tagged **Variable Name** · `=` tagged **Assignment Operator** · `10` tagged **Value** |
| 34 | `C` | **Summary** | `DataTable`, the source table verbatim: Data type · Definition · Additional Examples, four rows (String · Integer · Float · Boolean) |

### Closing frame (source 33 to 38)

| # | Type | Content |
|---|---|---|
| 35 | `QuizTimeSlide` | subtitle: `Four data types, one form, and the operator that puts a value in a name` |
| 36 | `KeyTakeawaysSlide` | Variables (sub: Containers) · Data Types (sub: Integer, Float, String, Boolean) · Assignment Operator (sub: Assigning Value to Variable) |
| 37 | `PracticeSlide` | `Practice` · prompt: Fill the application form for yourself and name the data type of each answer |
| 38 | `SectionBreakerSlide` | kicker `Next Session` · Sequence of Instructions |
| 39 | `ThankYouSlide` | `Thank you!` · `All the best` |


## 4. What has to be built

| Component | Slides | Draws | Where it lives |
|---|---|---|---|
| `ApplicationForm` | 7 to 10, 16, 21, 24, 27, 31 | the sports club form as a DOM card: four field rows, each with a name, a value slot, and an optional **tag** (String, Integer, …) rendered as a chip at the row's end. Props: `values`, `tags`, `columnLabels`. Registered in `continuity.ts` so it does not jump between consecutive slides | **session**. The form is this session's analogy; a second deck would want a different form. Stays in `src/decks/` alongside the deck |
| `ValueTypeMap` | 23, 26, 30 | rows of `value` → arrow → `type`, monospace value, type as a chip | **kit**, `src/ui/`. Session 4's recap wants it, and every typed-language session will |

Both DOM, never SVG (rule 17), colours from `tokens.ts`, entrance at the
explanatory tier.

**Assets**: seven illustrations staged in `public/assets/illustrations/`, plus
`assets/tech/python.png`.

## 5. Where this compresses

- Slides 9 and 10 (Variable Names, then Values) could be one slide with both
  column labels arriving as two build steps. The source has two; either is fine.
- Slides 16, 21, 24, 27 (the form with one tag each) are the source's pacing
  and I would keep them: the form returning is the teaching device.

## 6. Sign-off

1. **Three dividers** for the three agenda items, or the source's single one.
   *Default: three.*
2. **`ValueTypeMap` to the kit** on a PR; `ApplicationForm` stays in the
   session. *Default: as stated.*
