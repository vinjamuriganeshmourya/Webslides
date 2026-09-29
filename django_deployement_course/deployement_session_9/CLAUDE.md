# Deployment Session 9 — "Introduction to AWS"

**This is a SESSION, not the base template.** The kit's own `CLAUDE.md` rules
still apply and live at `slide-kit/slide-template/CLAUDE.md`.

| | |
|---|---|
| Slides | **97**, kept in step with `deck.config.json` (the 63 of rev2, plus the launch walk-through: concept 3 is rebuilt as the launch form, one field per slide; concept 2 loses three slides that moved to the field that uses them and gains the Six Decisions overview; concept 4 loses Free Plan Credits and gains a question slide; a question slide opens concept 3; the budget alert moves into the account block; a Stop Your Instance frame sits before Key Takeaways; and concept 3 became the real walk-through on eighteen captures, with Connect, the SSH session, the refused browser Connect and the address change after a restart) |
| `devPort` | 5220 |
| `htmlName` | `deployment-session-9` |
| Deck file | `src/decks/awsIntroDeck.tsx`, plus `src/decks/deckShared.tsx` |
| Plan | `../session_plans/deployement_session_9/plan.md`, **rev2 signed off 2026-09-15, revision 3 recorded 2026-09-16, remarks pass §16 recorded 2026-09-28** |
| Review | `../workflow/reviews/deployement_session_9.review.md`, the remarks doc transcribed with its slide-number mapping |
| Illustration plan | `../session_plans/deployement_session_9/illustrations.md` |
| Figure lab | `slide-kit/cloud-lab/`, devPort 5236 |
| TR | `/home/nxtwave/docker_jenkins_aws/10_deploying_docker_on_aws_ec2.md` §1 to §2, `11_aws_ec2_security_and_networking.md` §4 |

## Decisions that shape this deck

- **An EC2 instance is launched, and stopped before the session ends.**
  Reverses rev2's D1, "nothing is launched", on the user's instruction of
  2026-09-16: *"Also include hands-on on creation of EC2 in the process.
  Explain each concept instead of explaining randomly."* The room also creates
  a zero-spend budget, as before.
- **Concept 3 is `Launching an Instance`**, renamed from `Regions and
  Networks`. Its spine is the launch form, one field per slide, and each
  field's concept is taught at the field that uses it: the AMI at Application
  and OS Images, the sizes at Instance type, the key pair at Key pair (login),
  the VPC, subnet, public IP and Security Group inside Network settings, the
  disk at Configure storage. Region and Availability Zone come first, because
  the Region is set before the form is opened. Concept 2 ends by naming the six
  sections and opening none of them (hard rule 4), on the `LaunchForm` panel.
- **No quiz frames**, on instruction, for this session (as for session 8). A
  per-deck exception to hard rule 18, not a course rule.
- **No length cap.** "Elaborate wherever it helps the room." One new word per
  slide, every acronym expanded once, question then answer, a recap per concept,
  every idea anchored to something the room owns (plan §2, five beginner rules).
- **Illustration first.** One growing picture, `CloudPicture`, across the deck;
  `RegionMap`, `ShareBar` and the figures in `illustrations.md`. All prototyped
  in `slide-kit/cloud-lab` and looked at before a slide is written (hard rule 17).
- **Captures** come from the user's own AWS console through the Chrome
  extension, page zoomed 1.5x to 2x, account ID and email cropped out.
- **The Agenda slide carries the session name as its kicker** (`kicker={SESSION}`,
  `title="Agenda"`), as sessions 2 and 3 did. User, 2026-09-16, on seeing the
  agenda without it. Proposed as a course rule; not yet recorded in
  TEXT_GUIDELINES.
- **No "Everyone ..." or "All must ..." phrasing on a slide** (user, 2026-09-16).
  The instructor says it aloud; the slide states the fact: "The console shows
  USD 100 of credit. Check it before the session goes on", not "Everyone
  confirms USD 100". Instructor `notes` may keep the address to the room.
- **Wording is plain and professional** (user, 2026-09-16): "a data centre", never
  "someone else's building". Applies to leads and to labels inside figures.
- Money in USD as the console shows it, with the rupee figure printed beside
  the Free plan credit.
- **Session-owned figures live in `src/decks/figures/`**: the cloud-lab
  prototypes (`CloudPicture`, `RegionMap` with `regionMapGeo.ts`, `ShareBar`,
  `Meter`, `PlaceLadder`, `ServiceField`, `SizeChart`, `LockAndKey`,
  `OwnVsRented`, `TwoDoors`, `MachineCard`, `figureMotion`), the shot-lab
  `AnnotatedShot` with its inlined `tokenHelpers.ts` and `annotationPreset.ts`,
  and four built for this deck: `DataCentreView` (the data-centre block), `AnalogyPairs` (Pay for Use), `IllustratedRecap`
  with `recapFigures.tsx` (the four concept recaps), `Scaled`, and
  `LaunchForm` (the six sections of the launch form as a labelled panel). None of it is in
  the kit yet; promotion is a separate approval. Delete the two inlined helper
  files when the shot-lab work lands in `src/design` and `src/motion`.
- **Full-screen console captures are never cropped.** They go through
  `AnnotatedShot` at 760 to 840 px with a spotlight, numbered boxes in click
  order and `inset="auto"`. 840 only fits under a one-line lead.
- **Pending captures** render `PendingShot` from `deckShared.tsx` and are listed
  as CAPTURE in that slide's `notes`. **Eighteen of them**, fifteen in the launch flow
  (the Stop capture is used twice). Sign In is a real capture as of 2026-09-16 (`public/shots/aws-signin-root.png`). The account is still not activated: checked again in the browser on
  2026-09-16, `ec2/home` redirects to `signup.aws.amazon.com/billing/signup/incomplete`,
  so no screen of the launch flow can be captured yet.
- **A source printed on a slide carries its link** (user, 2026-09-16), so the
  exported HTML is clickable and the projector still shows where the number
  came from. The label is the anchor; the raw URL is never printed. Two today:
  the Amazon Q4 2025 results release on Not the App, and the Synergy Research
  Group release through `ShareBar`'s `sourceHref`.
- **One canonical block of values** in `src/decks/deckShared.tsx` (Region,
  zone, instance name, AMI, instance type, key pair, Security Group, VPC CIDR,
  ports 22, 8000 and the closed 5432, and the two example addresses). Every
  slide and every session figure reads from it, so the deck and the hands-on
  screenshots cannot drift (user, 2026-09-16). The capture checklist in plan
  §13 lists the same values for whoever takes the screenshots. The two IP
  addresses are examples assigned by AWS, and every slide that prints one says
  so.
- **Billing → Credits is not used.** On a Free plan account it lists redeemable
  credits and reads USD 0.00, so the Free plan credit is shown on the Free plan
  status panel and the Cost and usage widget instead (user, 2026-09-16). The
  Free Plan Credits slide was dropped.
- **amazon.in is the e-commerce app, never "the shop"** (user, 2026-09-16). The
  slide is `Not the App`, and `TwoDoors` draws a phone with the shopping app on
  the left step (`step: 'app'`).
- **Two shells, two panels.** The kit's `Terminal` is VS Code plus a PowerShell
  prompt, which is wrong for AWS's own `chmod`/`ssh` lines and for the Ubuntu
  prompt inside the instance, so `src/decks/figures/ShellPanel.tsx` draws a
  plain terminal whose title bar names the machine. The transcript on Inside
  the Instance is the real session, not an invention.
- `align-check` reports WRAPPED tokens on every slide with a ticking `Meter`:
  that is the digit roll (two spans exist mid-tick), not a layout fault. It
  also reports one WRAPPED token on each `PendingShot` slide: the `at` path is
  one long mono string and wraps to two or three lines, which reads correctly
  and goes away when the real capture replaces the frame. The one CHROME
  finding, on `Create the Account`, is a 3 px graze of a StepList detail under
  the footer mark and predates the launch walk-through.

## Commands

```bash
npm install
npx vite --port 5220 --strictPort
npx tsc -b --noEmit
npm run build:html                  # -> dist-single/deployment-session-9.html
export CHROME_PATH=/opt/google/chrome/chrome
node video-safe.mjs & node qa.mjs & node align-check.mjs & wait
```

Expected clean state: `video-safe` CLEAN except known kit defects, `align-check`
0, `qa` flagging exactly the Brand and Thank you slides as `NO LOGO`.
