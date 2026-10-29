# Cloud Computing · "Containers vs Virtual Machines" (session 4)

The session deck for Containers vs Virtual Machines. Read this before editing it. The kit rules are in
`KIT.md` and `../../../slide-kit/slide-template/CLAUDE.md`; the course's own rules in
`../workflow/skills/cloud-computing-course/SKILL.md`.

- **Plan:** `../session_plans/containers_vs_virtual_machines/plan.md` (signed off on the user's word,
  2026-10-28: the request is the spec).
- **Source:** `../../cloud_computing/session_plans/session_4/` (note: `cloud_computing`, not this course
  folder): `spec.json` (68 cards, its viewer `spec.html`), `tr.docx` and `tr.json`. CONTENT ONLY, verbatim (the
  user: no rewording, shortening, summarising, reordering, correcting, nothing added). The spec's strings are the
  TR's apart from its two documented edits (spaced dash to colon/comma, final full stop dropped).
- **Deck file:** `src/decks/cvDeck.tsx`, 72 slides: the spec's 68 cards plus agenda1, quiz1, feedback0 and
  feedback1 (the review pairs). Slide ids are the spec card ids (`T01-1` …), stamped as `data-spec`. Port 5274
  (`npx vite --port 5274 --strictPort`).
- **Copied from `virtualization_and_hypervisors`** (course rule R2): the cloud player (no builds, smooth
  transitions, hidden step/slide switch, presenter and student views, comments, saves into its own file).
  Session 2's `figures/variants.tsx`, `iso/frames.tsx` (`IsoAnalogy` with the TR sentence as lead) and
  `closing.tsx` (`art`) were taken over. Earlier sessions' figure files came with the copy and are not
  imported; they stay on disk.

## Figures (`src/decks/figures/cv/`)

- `frames.tsx`: `MARK`/`Logo` (logos imported so the single file inlines them; Podman, containerd and Ubuntu
  fetched into `slide-kit/assets/tech/` first), `Mono`, `Crop`/`ShotCard` (the TR screenshots from `spec.json`
  in `shots/`, cropped in source pixels, never redrawn), and the ONE container picture (`ContainerHost`,
  `VmHost`) and ONE layer stack (`LayerStack`) the spec's design notes ask every section to reuse.
- One file per section, built by parallel workers from one brief: `fundamentals.tsx` (6-10), `install.tsx`
  (12-21), `docker.tsx` (22-31), `build.tsx` (32-39), `compare.tsx` (41-47), `choose.tsx` (49-53),
  `tooling.tsx` (55-64).

## Decisions

1. **Review pairs (user, 2026-10-28):** agenda0 `AgendaSlide` (3) + agenda1 `AgendaColumns` (4); quiz0
   `ClassroomQuiz` (65) + quiz1 `QuizCard "Quiz Time!"` (66); feedback0 `FeedbackSlide` (69) + feedback1
   `FeedbackCard` (70). Delete one of each. `feedback-check.mjs` fails while both feedback frames stand.
2. **Agenda, recap and Key Takeaways carry the TR's full lines** (the user asked for no shortening), title bold
   and the rest after the TR's colon (`Takeaways full`); agenda0's sub lines are set at 15px in a 560px column
   so the kit arc holds five. This departs from course lesson 4 (titles only) for this deck.
3. **No speaker notes from the TR** (spec build contract); notes carry only the review-pair instructions.
4. **Motion is the course's, not the spec's press counts:** auto entrances in reading order, one loop per
   figure; the spec's press order is the entrance and loop order.
5. `S-WELCOME` is the brand frame (`BrandSlide "Welcome!"`): the spec forbids the topic on it.
