# Cloud Computing · "Cloud Networking & VPC" (session 5)

The session deck for Cloud Networking & VPC. Read this before editing it. The kit rules are in `KIT.md` and
`../../../slide-kit/slide-template/CLAUDE.md`; the course's own rules in
`../workflow/skills/cloud-computing-course/SKILL.md`.

- **Plan:** `../session_plans/cloud_networking_and_vpc/plan.md` (signed off on the user's word, 2026-10-29: the
  request is the spec).
- **Source:** `../../cloud_computing/session_plans/session_5/` (note: `cloud_computing`, not this course folder):
  `spec.json` (60 cards, its viewer `spec.html`), `tr.docx` and `tr.json`. CONTENT ONLY, verbatim (no rewording,
  shortening, summarising, reordering, correcting, nothing added), in the TR's order. The spec's strings are the
  TR's apart from its documented edits (spaced dash to colon/comma, final full stop dropped, `Vpc` to `VPC`,
  three typos, one split sentence).
- **Deck file:** `src/decks/netDeck.tsx`, 61 slides: the spec's 60 cards plus the course's standard feedback
  slide. Slide ids are the spec card ids (`T01-1` …), stamped as `data-spec`. Port 5275
  (`npx vite --port 5275 --strictPort`).
- **Copied from `containers_vs_virtual_machines`** (course rule R2): the cloud player (no builds, smooth
  transitions, hidden step/slide switch, presenter and student views, comments, saves into its own file).
  `figures/closing.tsx` (`Takeaways`, `art`) and `iso/frames.tsx` (`PointsFigure`, `FigureOnly`, `TableCard`,
  `IsoAnalogy bare`) are reused. Earlier sessions' figure files (`cv/`, `vh/`, `aws/`, `iso/*.tsx` sections)
  came with the copy and are not imported; they stay on disk.

## Figures (`src/decks/figures/net/`)

- `frames.tsx`: `MARK`/`Logo` (AWS, Azure, Google Cloud, imported so the single file inlines them), `Mono`
  (every CIDR, address, zone and resource name), `Crop`/`ShotCard` (the six lab screenshots from `spec.json`
  in `shots/`, served sharp from `shots-hd/`, cropped in source pixels, never redrawn), `NoteBox` (the TR's
  Important Note), the network palette `NET`, the pieces (`Boundary`, `SubnetBox`, `Gateway`, `RouteChip`,
  `MiniRouteTable`, `LockBadge`, `Resource`, `InternetCloud`, `NoMark`) and `VpcScene` + `G`, THE ONE VPC
  DRAWING the spec's design note 1 asks every section to reuse, with its geometry exported so arrows are
  computed from the same numbers as the boxes.
- One file per section, built by parallel workers from one brief: `overview.tsx` (T01-1 to T02-3),
  `vpc.tsx` (T03-1 to T06-1), `subnets.tsx` (T07-1 to T11-1), `routing.tsx` (T13-1 to T18-2),
  `security.tsx` (T19-1 to T23-1), `lab.tsx` (T24-1 to T29-1).

## Decisions

1. **Recap, agenda, breakers and Key Takeaways carry the five titles only** (course rule R5): the words
   before the TR's colon. The sub lines stay in the source.
2. **Analogies (course rule R3; the user, 2026-10-29: "make sure analogies are represented exactly"):**
   `IsoAnalogy bare`, two pictures, the familiar scene left and the concept scene right, every clause of the
   TR's analogy a tag inside the picture it describes, in the TR's words, matched parts lined up.
3. **No speaker notes from the TR** (spec build contract).
4. **Motion is the course's, not the spec's press counts:** auto entrances in reading order, one loop per
   figure; the spec's press order is the entrance and loop order.
5. `S-WELCOME` is the brand frame (`BrandSlide "Welcome!"`): the spec forbids the topic on it.
6. **D-LAB**, the practical's divider, is the breaker frame rendered through `LabBreaker` (a wrapper) so the
   section bar keeps one segment per agenda point; the lab belongs to section 5.
7. **Standard closing frames only** (quiz `ClassroomQuiz`, Takeaways, Next Session, the kit `FeedbackSlide`,
   Thank You, All the Best). Session 4's second layouts (`figures/variants.tsx`) are on disk if wanted.
