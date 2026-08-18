# Asset manifest

Every visual asset used in a deck: where it came from, its license, which
slide(s) use it, and when it was last verified. Screenshots must be real
captures of the running session code.

## Session 1 — Client–Server & CORS (plan Rev 7, signed off 2026-07-24)

| Asset | Location | Source / license | Used by | Verified |
|---|---|---|---|---|
| NxtWave logo | `template/public/assets/logo-nxtwave.png` | brand asset (internal) | brand slide (1), footer | 2026-07-16 |
| **Devicon logo set** (vscode, python, nodejs, react, django, vitejs, npm — SVG) | `template/public/assets/tech/` | [Devicon](https://github.com/devicons/devicon), MIT; downloads user-approved 2026-07-24 | `Toolchain` (4), tool cards (5–7), Stage-5 content slides as needed | 2026-07-24, rendered in QA |
| `Toolchain` (animated; embeds vscode + python marks, pulsing Node gap) | `template/src/ui/characters/session1.tsx` | built in-house | D1 divider (4) | 2026-07-24, screenshot + frame-diff motion QA |
| `nodejs-lts.png` | `template/public/shots/` | real capture — headless Chrome on nodejs.org/en/download (v24.18.0 LTS badge, `node -v`/`npm -v` lines) | install-node (7) | 2026-07-24 |
| Starter folder tree · collision terminal · `UrlAnatomy` | deck inline (markup) | built in-house at generation (Stage 5) | starter (8) · collision (12) · doors (11) | pending Stage 5 |
| `PortsDoors` (animated: apps arrive at their doors, idle bob) | `template/src/ui/characters/session1.tsx` | built in-house | D2 divider (9) | 2026-07-24, screenshot + motion QA |
| Terminal-state styled cards | deck inline | approved fallback (decision ③ — VS Code terminal UI not headless-capturable) | run-both (10), both-up (13) | pending Stage 5 |
| `concept-api` | `template/src/ui/characters/concepts.tsx` | built in-house | D3 divider (14) — browser↔server conversation | 2026-07-16, rendered in deck |
| `TwoAppsScene` (Rev 7 tweak: `:8000` PortTag re-added; motion: dash-crawl + ✗ pulse) | `template/src/ui/characters/session1.tsx` | built in-house | whose-products (15) | 2026-07-24, screenshot + motion QA |
| `django-json-200.png` | `template/public/shots/` | real capture — headless Chrome on `session-1/final` backend (`GET /api/products/` → 200) | next-door (16) | 2026-07-16 |
| `NetworkRows` (TR §6 4-row table as styled rows) | deck inline | approved fallback (DevTools UI not capturable headless) | restaurant (17); network row on (15) | 2026-07-16, rendered |
| `OriginFlats` (animated: envelope arrives, delivery arrow, ✗ springs) | `template/src/ui/characters/session1.tsx` | built in-house | D4 divider (19) | 2026-07-24, screenshot + motion QA |
| CORS-error styled block + real Django-terminal `200` line | deck inline | approved fallback (decision ③) | the-wall (20) | 2026-07-16, rendered |
| `ErrorMap` (3 phrases → 3 click-revealed questions) | deck inline | built in-house | word-by-word (21) | 2026-07-16, screenshot QA |
| `CorsGate` (guard + allow-list `:3000 ✓ / :5500 ✗`) | `template/src/ui/characters/session1.tsx` | built in-house SVG | D5 divider (24) | 2026-07-16, screenshot QA |
| `AnalogyMap` | `template/src/ui/AnalogyMap.tsx` | built in-house — content-parameterized layout frame (fixture-class reuse) | guard (25) | 2026-07-16, alignment measured |
| `EnvConfig` (one `.env` card → every request → one server) | `template/src/ui/characters/session1.tsx` | built in-house SVG | D6 divider (30) | 2026-07-16, screenshot QA |
| `products-from-django.png` | `template/public/shots/` | real capture — headless Chrome on `session-1/final` frontend + backend, valid JWT | served-by-django (34) | 2026-07-16 |
| lucide icon bridge (`template/src/ui/icons.tsx`) | in-repo | lucide-react, ISC | origin parts (22), verbs row (17), reasons rows (31–32), misc | 2026-07-17 |
| Nova mascot poses (quiz/recap/practice/feedback) | `template/src/ui/characters/` | built in-house | fixtures only: quizzes (29, 35), takeaways (37), practice (38), feedback (39) | 2026-07-17 |
| `RequestFlow` | `template/src/ui/RequestFlow.tsx` | built in-house (animated) | **unused in Rev 7** (its 200-OK loop would spoil the slide-18 predict); kept in repo | 2026-07-16 |
| Canva AI divider candidates ×12 (jobs `6010fe55…`, `3a8c51b6…`, `1ec00772…`) | thumbnails archived in session scratchpad | Canva AI generate-design, user-requested 2026-07-24 | **not used in deck** — side-by-side review held; user chose in-house for all three dividers (semantic precision + real logos) | 2026-07-24 |
| `session-1-cover-generated.png` | `workflow/assets/canva/` | Canva AI (design DAHPntOF_Vs) | **not used in deck** — below the deck's professional bar; archived as reference | 2026-07-17 |

## External-source rule

Freepik / other free libraries are permitted only with: a free license,
attribution recorded here, and explicit user approval before download.
Used so far: **Devicon (MIT)** logo set, user-approved 2026-07-24. All other
visuals are in-house or real captures.

---

## Deployment · Session 1 (v1 and v2) · capture run 2026-08-12

Captured on the `Window` VirtualBox VM against the students' own running project
(`nxttrendz`: React 19 + Vite 6 on :3000, Django 6.1 + DRF on :8000). Plan and
per-capture notes: `workflow/plans/deployement_session_1_v1.captures.md` and the
`.txt` file beside each image in `workflow/captures/`.

All are real captures of running software. None is a mockup.

| Asset | Source | Verified | Used on | Notes |
|---|---|---|---|---|
| `t1-t2-terminals.png` | real capture, VS Code split terminals | 2026-08-12 | `c1-two-terminals` (as image) | Cropped from `T1-T2-two-terminals.png` to the panel, empty pane space trimmed. Shown as a screenshot, not a `Terminal` recreation, by decision 2026-08-12. **Three defects accepted knowingly:** the prompt shows the real long path `C:\Users\vboxuser\Desktop\Projects\nxttrendz\backend` rather than the approved `C:\nxttrendz\backend`; the right pane's `VITE v6.2.0 ready in 1268 ms` line is scrolled off; and `Network: http://10.0.2.15:3000/` is visible, which can invite a Problem 2 question (R4 says name it, never open it). Not retouched, because R11 forbids editing captured pixels. Fixing properly means relocating the project to `C:\nxttrendz` and re-capturing. |
| `T1-backend-vscode.png` | real capture, backend panel | 2026-08-12 | same | Carries the dev-server WARNING used by `c2-truths`. |
| `T2-frontend-scrollback.png` | real capture, frontend panel | 2026-08-12 | same | Recovers the `VITE v6.2.0 ready in 1268 ms` banner. |
| `s1-app-products.png` | real capture, Edge at localhost:3000/products | 2026-08-12 | `c1-it-works` | Cropped from `S1-app-working-products.png`. One highlight on `:3000`. |
| `s2-django-api.png` | real capture, DRF browsable API, HTTP 200 | 2026-08-12 | `c1-it-works` | Cropped from `S2-django-api-json.png`. One highlight on `:8000`. |
| `T4-docker-absent.png` | real capture, `docker --version` before install | 2026-08-12 | not yet placed | ONE-SHOT. The "before" state, unreproducible after install. |
| `T5-wsl-install.png` | real capture, elevated VS Code | 2026-08-12 | not yet placed | ONE-SHOT. WSL 2.7.11, `VirtualMachinePlatform` enabled. |
| `s4-installer-config.png` | real capture, Docker Desktop 4.86.0 installer | 2026-08-12 | `c8-installer` | Cropped to the dialog. Highlight on "Per-user installation". |
| `S4b-OPTIONAL-docker-installing.png` | real capture, "Unpacking files" | 2026-08-12 | optional | Evidence for "the install takes a few minutes". |
| `S4c-docker-install-succeeded.png` | real capture, "Installation succeeded" | 2026-08-12 | optional | Note it offers only Close, it does not force a restart. |
| `S4d-docker-subscription-agreement.png` | real capture, first-run agreement | 2026-08-12 | optional | ONE-SHOT. Not mentioned anywhere in the TR doc. |
| `S4e-docker-signin-skip.png` | real capture, sign-in wall with Skip | 2026-08-12 | optional | ONE-SHOT. Not in the TR doc, and skipping it is what unblocks the engine. |
| `T3a-OPTIONAL-npm-build-export-failure.png` | real capture, `npm run build` failing | 2026-08-12 | optional, `c3-breakages` | `export` is a bash builtin; npm runs scripts via cmd.exe on Windows. |
| `T6a-installed-not-running.txt` | real capture, transcript only | 2026-08-12 | `c8-steps-34` (notes + version string) | `docker --version` succeeds while `docker info` 500s on the named pipe. |

### ⚠️ Outstanding captures (deliberate gap, decided 2026-08-12)

**Docker Desktop cannot run in this VM.** WSL 2 must boot a Hyper-V VM inside the
guest via the Host Compute Service, and VirtualBox's nested AMD-V does not expose
what HCS requires. Docker's own log is unambiguous:

```
Wsl/Service/RegisterDistro/CreateVm/HCS/HCS_E_HYPERV_NOT_INSTALLED
WSL2 is unable to start since virtualization is not enabled on this machine.
```

This is a platform limitation, not a misconfiguration. `--nested-hw-virt on` is
set and `wsl --install` succeeded; only the VM boot fails.

Not captured, and therefore still quoted from the TR doc rather than verified:

| Missing | Slide | Currently shown |
|---|---|---|
| `docker run hello-world` first pull | `c8-steps-34` | canonical output quoted from the TR doc |
| `docker images` empty state | `c8-what-installed` | not shown |
| `docker ps -a` with `Exited (0)` | `c8-what-installed` | not shown |
| Docker Desktop status, starting then green | `c8-steps-34` | described in a callout, no screenshot |

Decision: ship without these and capture them on a physical Windows machine, or
under KVM/QEMU (the host has `kvm_amd` with nesting enabled, so a migrated VM
would work). Until then `c8-steps-34`'s hello-world block must be treated as
illustrative, and anyone presenting should say so if asked.

---

# Session 2 — "Docker File Creation" (`deployement_session_2`)

**No screenshots are used anywhere in this deck.** Every command and every
transcript renders through `src/ui/Terminal.tsx`, per slide-content-rules §3, and
the Dockerfile and `.dockerignore` render through `CodeBlock` because they are
files rather than commands.

## Outstanding captures

Every transcript in the deck is **quoted from the TR doc, not captured**, blocked
by the same VirtualBox/HCS limitation recorded for Session 1 above. Docker
Desktop cannot start in this VM, so no `docker build` has ever run here.

| ID | Slide id | Command to capture | Currently shown |
|---|---|---|---|
| C1 | `c3-build` | `docker build -t nxttrendz-app .`, first run | one `cmd` line, no output |
| C2 | `c3-build-output` | the same build's `[1/5]`…`[5/5]` transcript | TR transcript, 12.4s timings |
| C3 | `c3-pull` | `docker pull python:3.14-slim` | TR transcript |
| C4 | `c3-images` | `docker images`, showing both rows | TR table, image id `3f2a8b91c04d`, 156MB |
| C5 | `c3-run` | `docker run nxttrendz-app` | the three `app.py` print lines |
| C6 | `c3-ps` | `docker ps`, then `docker ps -a` | TR table, `Exited (0)`, `bold_hopper` |
| C7 | `c4-cached` | the no-change rebuild, `CACHED` on every step | TR transcript, 0.8s |
| C8 | `c5-mistake-1`, `c5-mistake-2` | the two deliberate errors | TR error text and old output |

Every prompt must read `PS C:\nxttrendz\docker-demo>`: the session's demo lives in
a folder of its own beside `nxttrendz\backend` and `nxttrendz\frontend`, so a
capture taken from the project root would contradict every slide.

Consequences, and they are stated on stage rather than hidden: the timings
(12.4s, 0.8s, 6.8s), the image id and the 156MB size are **illustrative**, and
every affected slide's speaker notes tell the presenter to say that the room's
own numbers will differ.

Replacing them needs no layout change: `Terminal` takes the same `lines` array
whether they were typed by hand or pasted from a real run. Capturing C1 to C8 in
one sitting on a machine that can run Docker retires this whole section.

**Capture rules that still apply when that happens:** VS Code's integrated
terminal only, `PS C:\nxttrendz>` prompt kept in frame, cropped to the panel, and
never retouched. See slide-content-rules §3 and §11.
