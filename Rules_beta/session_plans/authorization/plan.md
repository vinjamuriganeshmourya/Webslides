<!-- cSpell:ignore NxtWave devPort priya APIView DRF -->
# Authorization: 30-slide cut, slide-wise plan

**STATUS: SIGNED OFF 2026-09-25.** A cards (no Postman captures), B setup terminal left out, C no Practice slide.

| | |
|---|---|
| Source | `Rules_beta/Trdocs/17. Authorization.pdf` (64 pages; text read with `pdftotext`) |
| Deck project | `Rules_beta/Output/authorization/` (copied from `slide-kit/slide-template`) |
| Deliverable | `Rules_beta/Output/authorization.html` (the single-file build, copied up) |
| Plan (this file) | `Rules_beta/session_plans/authorization/plan.md` |
| Deck file | `src/decks/authorizationDeck.tsx` |
| `name` / `htmlName` | `authorization` |
| `devPort` | **5251** (5250 is the highest taken) |
| Content slides | **30**, of which **5 are code slides** |
| Compulsory frames | **13** (brand, welcome, agenda, 4 dividers, 2 quiz, takeaways, next session, feedback, thank you) |
| `slideCount` | **43** |

---

## 1. How the cut keeps the context

The source has 64 pages and 22 of them are code or Postman captures. The cut
keeps **every idea in the source, in its order**, and changes how some ideas are
shown:

- **Code stays only where the code is the lesson.** That's five slides: the check
  written by hand, `IsAuthenticated`, `IsAuthenticatedOrReadOnly`, the custom
  `IsSellerOrReadOnly` class, and plugging it into both views.
- **Everything else that was code becomes a visual.** Request and response
  pairs become outcome cards (method, status, message). "The same four lines in
  every view" becomes three cards carrying one repeated check. `SAFE_METHODS`
  becomes two groups of method chips. The facts shown are the source's own.
- **Pages that repeat a slide are merged.** The source builds
  `IsSellerOrReadOnly` over four pages (start, rule 1, rule 2, the summary).
  Here it's one `CodeBuildSlide` that reveals rule 1, then rule 2, so the build
  order survives on one slide.
- **Titles are rewritten where the source reuses one title.** The source has
  "Think of an Office Building" on two code pages and "Use It On The View" on
  three pages. Each slide here names its own idea.

## 2. Layout: every content slide follows content rule 32

- **Header:** the kicker (concept) and the title only. No lead in the header.
- **Space-1** (x 64..1159): the lead is the first block, then the body, centred
  on y=434.
- **Speaker box** (x 913..1280, y 0..220) stays empty.
- Content slides are built on the session-owned `ZonedSlide` used by
  `Rules_beta/introduction_to_oops`. Bodies are made from kit blocks only.
- **Headings stay on one line (rule 35).** Any title that wraps in Poppins gets
  shortened.

## 3. Concept map and agenda

The source's own agenda, which already has four items (hard rule 20):

| # | Agenda item | Divider | Content slides | Source pages |
|---|---|---|---|---|
| 1 | Why Permissions? | 01 | C1 to C6 | 3, 6 to 10 |
| 2 | IsAuthenticated | 02 | C7 to C16 | 11 to 28 |
| 3 | Read vs Write | 03 | C17 to C22 | 30 to 40 |
| 4 | Role-based Authorization | 04 | C23 to C30 | 41 to 58 |

## 4. Slide by slide

C = content slide number (the 30). **CODE** marks the five code slides.

### Front

| # | Type | Content |
|---|---|---|
| 1 | `BrandSlide` | `greeting="Welcome!"` |
| 2 | `WelcomeSlide` `minimal` | Authorization |
| 3 | `AgendaSlide` | the four items of §3 |

### Concept 1: Why Permissions?

| # | C | Title | Content (from source) | Body |
|---|---|---|---|---|
| 4 | | divider 01 | Why Permissions? | fixture |
| 5 | C1 | Where We Left Off | Last session: Register (create an account), Log in (username and password), Get a token (proves who you are). Recap of tokens, access vs refresh, the Login API with SimpleJWT | three-step `StepList` (row) + `Callout`: "But the token does not do anything yet" |
| 6 | C2 | The Door Is Wide Open | Anyone can still add, edit or delete products without logging in. A token means nothing if nothing ever checks it | `BulletList` + `Callout` (warning): "Today we put locks on the doors" |
| 7 | C3 | Authentication vs Authorization | "Who are you?": you log in once to prove your identity. "What are you allowed to do?": on every action, the app checks if you are allowed | two `Card`s side by side |
| 8 | C4 | What No Permissions Means | Anyone can POST fake products to the shop. Anyone can edit a ₹50,000 laptop to ₹1. "No real app can work like this" | two `Card`s + `Callout`: "Rules about who can do what are called permissions" |
| 9 | C5 | A Permission Is a Checkpoint | A small rule DRF runs before your view: allow or not? 01 Request arrives, 02 Permission checks the rule, 03 Allowed? Run the view. If NO, the request is blocked and the view never runs | `FlowChart` (3 steps, a "No: blocked" branch) |
| 10 | C6 | A Guard at Every Door | "A security guard standing in front of each view, who checks everyone before they enter" | `AnalogyMap`: guard = permission, door = view, visitor = request, turned away = error |

### Concept 2: IsAuthenticated

| # | C | Title | Content (from source) | Body |
|---|---|---|---|---|
| 11 | | divider 02 | IsAuthenticated | fixture |
| 12 | C7 | What the Check Must Do | Before DRF's ready-made rule, see what the check has to do: 1 find out WHO is making the request, 2 not logged in: block with 401, 3 logged in: run the view | `StepList` (3) + `Callout`: "Write it by hand once, and DRF's shortcut clicks" |
| 13 | C8 | Who Is request.user? | DRF reads the token and puts a user on the request. Valid token: `<User: priya>`, `is_authenticated` True. No token: `<AnonymousUser>`, False. "One field is all we need" | two `ObjectState` cards |
| 14 | C9 | **CODE 1** The Check by Hand | `users/views.py`: imports, `MyProfileView(APIView)` with `get()`, the `is_authenticated` check returning 401, then username and email. Lead: "APIView lets us write get() ourselves". Caption: wired at `profile/` in `users/urls.py` | `CodeBlock` |
| 15 | C10 | Test: No Token | `GET /users/profile/` without logging in. `401 Unauthorized`, `{"detail": "Not authenticated"}` | request card → response card (status in red) |
| 16 | C11 | Test: With a Token | Log in, copy the access token, send `Authorization: Bearer <token>`. `200 OK`, username priya and her email. "Token, real user, check passes, profile returned" | request card → response card (status in green) |
| 17 | C12 | The Same Check Everywhere | MyProfileView, ChangePasswordView, AddToCartView all start with the same four lines. Forget it on one view and that view is wide open | three `Card`s, each showing the same check chip + `Callout` (error) |
| 18 | C13 | Declare It Once | Manual way: check inside every method. DRF way: declare the rule once on the class. Works on custom APIViews and on generic views like ProductListView | before / after pair of `Card`s |
| 19 | C14 | **CODE 2** Add IsAuthenticated | `products/views.py`: import, `ProductListView(ListCreateAPIView)` with `permission_classes = [IsAuthenticated]`. "All that manual logic, now one declared line" | `CodeBlock`, the line highlighted |
| 20 | C15 | How the Token Is Used | Request with a token, JWT reads it and finds the user, IsAuthenticated asks "is there a user?", yes allowed, no blocked. "No token, no user, IsAuthenticated says no" | `FlowChart` (4 nodes) |
| 21 | C16 | Two Outcomes | No token: `401`, "Authentication credentials were not provided." Valid token: `200`, 47 products returned. "401 means we don't know who you are" | `StatusPoints` style pair (fail / pass) |
| 22 | | `QuizTimeSlide` | subtitle: "request.user, 401, and the one line that locks a view" | quiz frame 1, after the concept the rest depends on |

### Concept 3: Read vs Write

| # | C | Title | Content (from source) | Body |
|---|---|---|---|---|
| 23 | | divider 03 | Read vs Write | fixture |
| 24 | C17 | Locked Out Everyone | Too strict: a new visitor can't even SEE products, which kills a shop, since people browse before they sign up. What we want: anyone can view, only logged-in users can add, edit or delete. "Open to look, locked to touch" | two `Card`s (error / success) |
| 25 | C18 | Safe vs Unsafe Methods | Unsafe, changing: POST, PUT, DELETE create, edit or remove data and need a login. Safe, reading: GET changes nothing and needs no login | two groups of method chips |
| 26 | C19 | **CODE 3** IsAuthenticatedOrReadOnly | Same view, one rule swapped: `permission_classes = [IsAuthenticatedOrReadOnly]`. "GET is open to everyone; POST, PUT and DELETE need a valid token" | `CodeBlock`, the changed line highlighted |
| 27 | C20 | How It Decides | The rule looks at the method first. GET: always allowed, even with no token. POST, PUT, DELETE: token required, no token gives 401. "A public shop with private editing" | `FlowChart` (one split) |
| 28 | C21 | Any User Can Write | `POST /products/` as three users. Anonymous: 401, blocked, correct. Customer: 201, created, WRONG. Seller: 201, created, correct | `StatusList` (3 rows with verdicts) |
| 29 | C22 | What We Have So Far | Read and write, per user (anonymous, customer, seller), under IsAuthenticated and under IsAuthenticatedOrReadOnly. "Logged in isn't enough. We need to check the ROLE" | `DataTable` (✓ / ✗ grid, from source page 39) + `Callout` |

### Concept 4: Role-based Authorization

| # | C | Title | Content (from source) | Body |
|---|---|---|---|---|
| 30 | | divider 04 | Role-based Authorization | fixture |
| 31 | C23 | Logged In Is Not Enough | Customer, logged in: only browses and buys, cannot add products. Seller, logged in: lists items for sale, can add products. "The user_type field we built finally pays off" | two `Card`s |
| 32 | C24 | The Rule by Role | WRITE (POST, PUT, DELETE): must be logged in AND `user_type == 'seller'`, fails either: 403. READ (GET): anyone, even logged out: 200 | two `Card`s with examples (`POST /products/`, `GET /products/42/`) |
| 33 | C25 | Meet SAFE_METHODS | A DRF tuple of the methods that only read: GET, HEAD, OPTIONS. `request.method in SAFE_METHODS` is True for GET, False for POST, PUT, PATCH, DELETE | two groups of method chips + one inline expression |
| 34 | C26 | **CODE 4** IsSellerOrReadOnly | `products/permissions.py`: import `BasePermission` (the parent for your own rules) and `SAFE_METHODS`. `has_permission()` returns True (allow) or False (block). Step 1 reveals rule 1: safe methods pass. Step 2 reveals rule 2: authenticated and a seller | `CodeBuildSlide`, two build steps |
| 35 | C27 | **CODE 5** Plug It Into Both Views | `products/views.py`: `ProductListView` and `ProductDetailView` both get `permission_classes = [IsSellerOrReadOnly]`. "Our own rule plugs in exactly like DRF's built-in ones" | `CodeBlock`, both lines highlighted |
| 36 | C28 | 401 vs 403 | 401 Unauthorized: "I don't know who you are". No token or an invalid one. Fix: log in. 403 Forbidden: "I know who you are, you're just not allowed". Logged in, wrong role. Fix: none, not permitted | two `Card`s |
| 37 | C29 | Same Request, Three Results | `POST /products/` again. Not logged in: 401, log in first. Customer: 403, not allowed. Seller: 201, product created. "That's authorization working" | `StatusList` (3 rows), same shape as C21 so the change reads |
| 38 | C30 | Three Levels of Protection | IsAuthenticated, IsAuthenticatedOrReadOnly, IsSellerOrReadOnly: read and write per user, from source page 58. "Same plug-in pattern, only the rule changes" | three-column ✓ / ✗ `DataTable` |

### Close

| # | Type | Content |
|---|---|---|
| 39 | `QuizTimeSlide` | subtitle: "Safe methods, a custom rule, and 401 against 403" (hard rule 18) |
| 40 | `KeyTakeawaysSlide` | the four agenda items, verbatim (hard rule 20) |
| 41 | `SectionBreakerSlide` | Next Session: Prime Products & Seller Ownership |
| 42 | `FeedbackSlide` | fixture |
| 43 | `ThankYouSlide` | fixture |

## 5. Wording and accuracy fixes to the source

- **"A random stranger can POST"** (page 9) becomes "Anyone can POST" (hard rule 2).
- **Em dashes** in the source are rewritten with a colon, comma or full stop
  (hard rule 1).
- **Page 7's right column** repeats the left's "Logging in to prove your
  identity". The slide uses only its second bullet ("on every action, the app
  checks if you're allowed").
- **Page 18's URL** has a stray `>` (`/users/profile/>`), which is dropped.
- **Page 16's filename** says `users/views.py` above the `urlpatterns` code,
  which lives in `users/urls.py`. C9's caption names `users/urls.py`.
- **C27 imports the class under its own name.** The source aliases it
  (`IsSellerOrReadOnly as IsSeller`) and leaves an import marked "Not required
  now". Both are dropped so the code shows only what's used.

## 6. Verification

`typecheck`, `build:html`, then `video-safe`, `qa` and `align-check` in
parallel, `preview.mjs`, and a look at every slide's screenshot for rule 32
(zones) and rule 35 (no heading wraps).

## 7. Decisions for sign-off

**A. No Postman screenshots.** The source has nine Postman captures. They're
shown here as request and response cards, with the same method, URL, status
and body, because the full-window captures would need cropping (rule 11) and
C10 and C11 already carry their exact content. **Recommended: cards.**
Alternative: extract the captures from the PDF, crop them, and put them beside
C10, C11 and C16.

**B. The "Initial Setup" terminal (page 5) is left out.** It's three setup
commands, not part of the lesson, and a terminal would be a sixth code slide.
**Recommended: leave it out.**

**C. No Practice slide.** The source's Practice page (61) has no content.
**Recommended: as listed.** Say if you want a Practice frame (44 slides).

## 8. Built 2026-09-25, and where the deck differs from this plan

Generated into `Rules_beta/Output/authorization/`, 43 slides. Deliverable:
`Rules_beta/Output/authorization.html` (copied from `dist-single/`).

- **C26 is a `ContentSlide` with a `CodeBlock`, not a `CodeBuildSlide`.** The
  kit's `CodeBuildSlide` hardcodes `language="YAML"`, so a Python file would be
  labelled and highlighted as YAML. The build order survives as two cards beside
  the code, "Rule 1: reads pass" and "Rule 2: writes need a seller".
- **C5 and C15 use `SpineFlow`, not `FlowChart`.** Both flows branch (Yes / No).
  `GateFlow` was tried first and draws a stray arrow stub when the No branch has
  no loop back.
- **C6 and C29 lost their callouts.** Their last line sat under the deck's
  controls (`align-check`). The callout text moved into the lead.
- **The agenda circle reads "Today's session / Agenda"**, and the feedback
  frame "Your feedback". Both kit defaults wrapped onto two lines (rule 35).
- **Titles renamed on the slide:** C3 "Two Words, Two Questions", C9 "The
  Check, Written by Hand", C18 "Reading vs Changing", C19 "Swap In a Softer
  Rule", C21 "Any Logged-in User Can Write", C26 "Our Own Rule".
- **No Django logo on C5.** DRF has no mark in the asset library.
- **Two kit gaps, fixed in the kit the same day:** nothing generated
  `src/export/deckCss.ts`, so `tsc -b` failed on a fresh copy (now
  `workflow/export/build-deck-css.mjs`, run by `npm run gen` before `typecheck`,
  `build` and `build:html`), and the template's `public/assets/tech/` lacked five
  logos the flow figures reference (copied in from `slide-kit/assets/tech/`).

Verification: `typecheck` clean, `video-safe` CLEAN, `qa` only slides 1 and 43
(the benign baseline), `align-check` 0 of 43, `preview.mjs` no errors, every
`font-heading` element measured on one line.
