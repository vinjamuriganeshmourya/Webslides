# Capture plan — `deployement_session_1_v1`

**STATUS: PARTLY APPROVED 2026-08-12. Nothing has been executed.**

### Decisions recorded

| # | Question | Decision |
|---|----------|----------|
| 2 | Prompt path shown on terminal slides | **`C:\nxttrendz\backend`** and `C:\nxttrendz\frontend`. Short, matches the real project name, leaks no VM account name. |
| 3 | TR doc mismatches | **Patch `session-1.md` first, then match the deck to it.** Includes adding the execution-policy note. |
| — | venv activation command | **`.\env\Scripts\activate`** (folder is `env`, not `venv`). See note below. |
| 1 | Blockers A1 to A4 | **Approved, all four.** |

### Progress log

| When | Step | State |
|---|---|---|
| 2026-08-12 | A3 host disk reclaim | **Done.** 14 GB to 24 GB free. Removed the 7.9 GB Win11 ISO, cleaned the `uv` cache and the pip cache. Chrome's 10 GB cache and tracker3's 4.1 GB left untouched and still available if needed. |
| 2026-08-12 | Decision 3, TR doc patch | **Done.** 19 string replacements plus a new execution-policy note. Backup at `session-1.md.bak-pre-v1-patch` (951 to 969 lines). Verified: no `venv\Scripts`, no `source venv/bin`, no `5173` remain. Surviving "venv" hits are the tool name, which is correct, since the tool is venv and the folder is `env`. |
| 2026-08-12 | A1 nested virt, A2 RAM, A4 snapshot | **Done.** `nested-hw-virt=on`, `memory=8192`, snapshot `pre-docker-capture` (UUID 34220d94). Booted clean, Additions run level 3, project intact. **CORRECTION:** this row first claimed Windows confirmed nesting works, on the strength of `systeminfo` reporting "A hypervisor has been detected". That was a misread. The message only means Windows noticed it is running *under* a hypervisor (VirtualBox); it says nothing about whether the guest can run one itself. Nothing tested the real capability until Docker tried to create its WSL distro, and that failed. See the Phase 3 row. |
| 2026-08-12 | Phase 1 captures | **COMPLETE.** T4 (docker absent, one-shot, secured), T1 (backend), T2 (frontend), T1+T2 (two panels side by side), S1 (working product grid), S2 (DRF API, HTTP 200, count 48). T3 dropped by decision. Transcripts and crop guidance written. |

### Unplanned finding: the build script cannot run on Windows

`npm run build` fails in this project, before Vite is even reached:

```
> export NODE_OPTIONS="--max-old-space-size=4096" && vite build
'export' is not recognized as an internal or external command,
operable program or batch file.
```

`export` is a bash builtin. npm runs scripts through `cmd.exe` on Windows, and
`cmd` uses `set`. So the script is unrunnable on the machine the students have.

Captured as `T3a-OPTIONAL-npm-build-export-failure.png`. **Optional asset, not on
any slide yet.** It is strong evidence for the "Commands and shells" argument on
`c3-breakages`, and sharper than the TR doc's own example: `package.json` and
`requirements.txt` are both committed and both correct, and the breakage is in a
*script*, which is precisely the gap a lockfile cannot close. That is why
Attempt 1 (better instructions) and Attempt 2 (pin every version) both fail.

Not acted on. The students' `package.json` was left untouched.

### Known execution constraint

`VBoxManage` injects keystrokes but has **no mouse control**, and blind window
switching in the guest is unreliable: `Alt+Tab` cycles Microsoft Edge's tabs
(Windows 11 shows Edge tabs in Alt+Tab by default), Start search launches a second
VS Code window rather than focusing the existing one, and Edge's "Restore pages"
and DevTools consent bubbles swallow keystrokes and need a click.

Typing into an already-focused terminal works reliably. Switching between apps
does not.

**Fix for the remaining phases:** Guest Additions are now at run level 3, so
`VBoxManage guestcontrol "Window" run ...` can execute commands in the guest
directly, with no keystroke injection and no focus races. It needs the Windows
password for `vboxuser`. Until that is available, each phase needs the user to
put the right window in focus first.



Companion to [`deployement_session_1_v1.md`](./deployement_session_1_v1.md) (slide plan)
and governed by [`.claude/skills/slide-content-rules/SKILL.md`](../../.claude/skills/slide-content-rules/SKILL.md).

## Why this document exists before any command runs

Several states in this session happen **exactly once per machine**. Installing
Docker destroys the evidence that Docker was ever absent. Pulling `hello-world`
destroys the "Unable to find image locally" output that the TR doc quotes
verbatim and that Slide `c8-steps-34` is built on. If commands are run first and
captured afterwards, those slides can only be faked, and the workflow forbids
mockups (`SLIDE_WORKFLOW.md` Stage 3: *"Screenshots must be real captures of the
running session code, verified before they enter a slide."*).

So: plan the flow, agree the capture points, snapshot the machine, then execute
once, capturing as we go.

## Starting state (confirmed on the machine, 2026-08-12)

The student arrives having just finished frontend/backend integration. That is
exactly the state of the `Window` VM right now:

| | Value |
|---|---|
| Project | `nxttrendz`, at `C:\Users\vboxuser\Desktop\Projects\nxttrendz` |
| Backend | Django 6.1 + DRF, running, `python .\manage.py runserver 0.0.0.0:8000` |
| Frontend | React 19 + Vite 6, running, `port: 3000`, `host: '0.0.0.0'` |
| venv | folder is **`env`**, activated with `.\env\Scripts\Activate.ps1` |
| Editor | VS Code, integrated terminal (matches hard rule 3) |
| Docker | **not installed** (this is the capture opportunity) |
| WSL 2 | **not installed** |

---

## Section A — Blockers that must be cleared before capture

These are not optional. Two of them mean the hands-on half of the session
**cannot be captured at all** in the current VM.

### A1. Nested virtualization is OFF (hard blocker)

```
nested-hw-virt="off"
```

WSL 2 runs a real Linux kernel in a lightweight VM, so it needs hardware
virtualization *inside* the guest. With this off, `wsl --install` will fail and
Docker Desktop will never reach "Engine running". Captures T5, S4, S5, S6, T6,
T7, T8, T9 are all impossible until this changes.

Host is an **AMD Ryzen 7 PRO 8840HS (AMD-V)**, and VirtualBox has supported
nested AMD-V since 6.0, so this is a supported configuration.

Fix (requires the VM to be **powered off**):

```bash
VBoxManage modifyvm "Window" --nested-hw-virt on
```

### A2. RAM is 4096 MB (soft blocker)

Docker Desktop's WSL 2 backend wants ~4 GB for itself. With 4 GB total, Windows,
VS Code, Django, Vite and the Docker VM will thrash, and the capture session will
be slow and prone to timeouts. Host has 30 GB.

```bash
VBoxManage modifyvm "Window" --memory 8192
```

### A3. Host disk has 14 GB free (hard blocker)

Docker Desktop is several hundred MB to download and a few GB installed, the WSL 2
kernel and distro add more, `hello-world` is trivial but the snapshot in A4 grows
as the guest writes. 14 GB is not enough headroom, and a dynamic VDI that cannot
grow will pause or crash the VM mid-capture.

Reclaim candidates already identified, in order of ease:

| Path | Size | Note |
|---|---|---|
| `~/Downloads/Win11_25H2_English_x64_v2.iso` | ~7 GB | Windows is installed and WinRE is rebuilt. No longer needed. |
| `~/.cache` | 32 GB | Safe to prune; needs a look first. |
| `~/.var` | 35 GB | Flatpak data. Needs a look first. |

### A4. Take a snapshot, so no state is truly one-shot

```bash
VBoxManage snapshot "Window" take "pre-docker-capture" --description "Integrated project running, Docker and WSL2 absent"
```

This is the real answer to your concern. With this snapshot, any capture we fumble
can be replayed by restoring and re-running. Do A1 and A2 **before** the snapshot
so the restored state is already correct.

---

## Section B — The one-shot states

| State | Why it is one-shot | Recoverable without snapshot? |
|---|---|---|
| `docker --version` reporting "not recognized" | true only before install | **No** |
| `wsl --install` first-run output | later runs report already installed | **No** |
| Installer's "Use WSL 2 instead of Hyper-V" checkbox | shown only during install | **No** |
| Docker Desktop starting up, status not yet green | only on first launch | **No** |
| `docker images` / `docker ps -a` empty | any pull or run ends it | Yes (`docker system prune -a`) |
| `docker run hello-world` pull lines | image is cached afterwards | Yes (`docker rmi hello-world`) |

Everything in the "No" column is why we snapshot first.

---

## Section C — Capture manifest

Two kinds of capture, and the distinction matters for hard rule 3:

- **T = transcript.** Exact terminal **text**, copied as text, then rendered by
  the `Terminal` component (VS Code panel, `PS <path>>` prompt). *Not* an image.
  This is how every command on a slide must appear.
- **S = screenshot.** A real PNG, used **only** where the thing being taught is a
  GUI that cannot be reproduced as text.

Slide ids below refer to the v2 deck's ids, which v1 mirrors.

### Phase 1 — The student's current state (before installing anything)

| ID | Kind | What to capture | Slides | One-shot |
|---|---|---|---|---|
| T1 | transcript | Backend terminal: prompt path, `python manage.py runserver`, full output **including the development-server WARNING** | `c1-two-terminals`, `c2-truths` | no |
| T2 | transcript | Frontend terminal: prompt path, `npm run dev`, Vite ready line and `Local:` URL | `c1-two-terminals` | no |
| S1 | screenshot | Browser at the app, logged in, product list rendered. Proof the integration works. | `c1-two-terminals`, `c1-localhost` | no |
| S2 | screenshot | Browser address bar on the app, plus the API returning JSON. Shows both localhost ports. | `c1-localhost` | no |
| ~~T3~~ | ~~transcript~~ | **DROPPED 2026-08-12 by decision.** `npm run build` is not run. Truth 2 is taught from T2's dev-server transcript alone. | `c2-truths` (Truth 2) | n/a |
| T4 | transcript | `docker --version` failing with "not recognized" | `c8-steps-34` (the before state) | **yes** |

T1 and T2 are the two panels of `c1-two-terminals`. Per hard rule 3 they are two
separate `Terminal` components with two different paths, never merged.

### Phase 2 — WSL 2

| ID | Kind | What | Slides | One-shot |
|---|---|---|---|---|
| T5 | transcript | `wsl --install` in an Administrator terminal, full output | `c8-steps-12` | **yes** |
| S3 | screenshot | The reboot prompt (optional) | `c8-steps-12` | **yes** |

### Phase 3 — Docker Desktop

| ID | Kind | What | Slides | One-shot |
|---|---|---|---|---|
| S4 | screenshot | Installer page with **"Use WSL 2 instead of Hyper-V"** ticked | `c8-steps-12` | **yes** |
| S5 | screenshot | Docker Desktop just launched, bottom-left status **not yet green** | `c8-steps-34` | **yes** |
| S6 | screenshot | Bottom-left status green, reading **Engine running** | `c8-steps-34` | **yes** |

S5 and S6 are a pair, and they carry the TR doc's point that *"installed and
running are not the same thing"*. This is the step people skip, so the two-state
pair is worth the effort.

### Phase 4 — Verify

| ID | Kind | What | Slides | One-shot |
|---|---|---|---|---|
| T6 | transcript | `docker --version` succeeding | `c8-steps-34` | no |
| T7 | transcript | `docker images` with no images | `c8-what-installed` | recoverable |
| T8 | transcript | `docker run hello-world` **first run**, with `Unable to find image` / `Pulling from` / `Pull complete` / `Hello from Docker!` | `c8-steps-34`, `c8-what-installed` | recoverable |
| T9 | transcript | `docker ps -a` showing the container `Exited (0)` | `c8-what-installed` | recoverable |
| S7 | screenshot | Docker Desktop Images tab listing `hello-world` (optional) | `c8-what-installed` | no |

T8 is the single most important capture in the session. Its output is quoted
verbatim in the TR doc and decoded line by line on `c8-what-installed`.

### Phase 5 — Optional, on the Linux host rather than the VM

The deck claims some failures happen on Linux and not on Windows. We have a real
Linux host, so these can be genuine rather than described.

| ID | Kind | What | Slides |
|---|---|---|---|
| T10 | transcript | A hardcoded Windows path (`media\uploads\a.png`) resolving on Windows and failing on Linux | `c3-breakages`, `c3-quiz` |

Honest cross-OS evidence, and cheap now that both systems are in front of us.
Flagged optional because it widens scope beyond the VM.

---

## Section D — Exact execution order

Every command shown with the prompt path it must be run from, because the folder
is teaching content (hard rule 3). **STOP** marks a point where I hand back for
review before continuing.

```
PHASE 0  (host, VM powered off)
  VBoxManage modifyvm "Window" --nested-hw-virt on
  VBoxManage modifyvm "Window" --memory 8192
  <reclaim host disk per A3>
  VBoxManage snapshot "Window" take "pre-docker-capture"
  VBoxManage startvm "Window"
  STOP: confirm the project still runs after the RAM/nested change

PHASE 1  (guest, before installing anything)
  Terminal 1:  PS C:\nxttrendz\backend>  .\env\Scripts\activate
  Terminal 1:  PS C:\nxttrendz\backend>  python manage.py runserver            -> T1
  Terminal 2:  PS C:\nxttrendz\frontend> npm run dev                           -> T2
  Browser:     open the app, log in, load products                             -> S1, S2
  Terminal 3:  PS C:\nxttrendz\frontend> npm run build                         -> T3
  Terminal 3:  PS C:\nxttrendz\frontend> dir build
  Terminal 3:  PS C:\nxttrendz>          docker --version                      -> T4  (one-shot)
  STOP: review Phase 1 captures before anything is installed

PHASE 2  (guest, VS Code launched AS ADMINISTRATOR, integrated terminal)
  Close VS Code, relaunch it via "Run as administrator", open the same folder.
  PS C:\nxttrendz> wsl --install                                               -> T5  (one-shot)
  <reboot>                                                                     -> S3
  STOP

PHASE 3  (guest)
  Download Docker Desktop, run installer                                       -> S4  (one-shot)
  <log out / restart>
  Launch Docker Desktop, capture immediately                                   -> S5  (one-shot)
  Wait for green                                                               -> S6
  STOP

PHASE 4  (guest, VS Code integrated terminal, normal privileges)
  PS C:\nxttrendz> docker --version                                            -> T6
  PS C:\nxttrendz> docker images                                               -> T7
  PS C:\nxttrendz> docker run hello-world                                      -> T8  (the big one)
  PS C:\nxttrendz> docker ps -a                                                -> T9
  Docker Desktop -> Images tab                                                 -> S7
  STOP: full capture review, then update workflow/assets-manifest.md
```

---

## Section E — Where the TR doc disagrees with the real student setup

Found by reading the actual project rather than the doc. Each one would put a
wrong command on a slide, and hard rule 3 makes the prompt and command teaching
content, so these matter.

Decision 3: **patch the TR doc, then match the deck to it.**

| TR doc says | The real project | Action (approved) |
|---|---|---|
| `venv\Scripts\activate` | venv folder is **`env`** | Patch TR and deck to **`.\env\Scripts\activate`** |
| `Local: http://localhost:5173/` | `vite.config.js` sets `port: 3000` | Patch TR and deck to `3000` |
| Two PowerShell windows | Students work in the **VS Code integrated terminal** | Deck already correct via hard rule 3. Patch the TR wording. |
| `Starting development server at http://127.0.0.1:8000/` | Student ran `runserver 0.0.0.0:8000` | Deck shows the plain `runserver` form, which is what students should learn |
| Nothing about PowerShell execution policy | A fresh Windows blocks `Activate.ps1` with `UnauthorizedAccess` until `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` | **Add**, as a callout on the terminals slide plus a TR note. Every student on a fresh Windows hits this in minute one. |

### Note on the activation command

Approved form is `.\env\Scripts\activate`. The `.\` prefix is required in
PowerShell: without it PowerShell refuses to run an executable from the current
directory, which is a separate error from the execution-policy one and looks
confusingly similar to a "not found" mistake.

`activate` (no extension) resolves to `Activate.ps1` in PowerShell, so it is still
governed by the execution policy. That is why the execution-policy callout has to
sit on the same slide as this command, not later.

That last row is a real gap. It is not a deployment concept, so it does not
deserve a concept slide, but it belongs as a callout on the terminals slide or in
the pre-session setup notes.

---

## Section F — Decisions needed before I execute anything

1. **Clear the blockers?** A1 nested virt, A2 RAM to 8192, A3 reclaim host disk,
   A4 snapshot. A1 and A2 need the VM powered off, so this closes your current
   session in it.
2. **Which prompt path should slides show?** The real
   `C:\Users\vboxuser\Desktop\Projects\nxttrendz\backend` is long and leaks a VM
   username. v2 used `C:\ecommerce\backend`. A clean `C:\nxttrendz\backend` is a
   third option.
3. **Patch the TR doc** for the `env` vs `venv` and `3000` vs `5173` mismatches?
4. **Add the execution-policy note** to the deck and the TR doc?
5. **Do the optional Phase 5 Linux captures** (T10)?
6. **Screenshot scope:** the manifest has 7 screenshots and 10 transcripts. Trim
   the optional ones (S3, S7) or keep all?


---

## Phases 3 and 4: CLOSED WITH A DOCUMENTED GAP (decided 2026-08-12)

### What was achieved

Docker Desktop 4.86.0 **is installed** in the VM, per-user, at
`C:\Users\vboxuser\AppData\Local\Programs\DockerDesktop`, and is on PATH.
`docker --version` answers: `Docker version 29.7.2, build a7dcaa6`.

Captured along the way: S4 (installer Configuration page, one-shot), S4b
(unpacking), S4c (installation succeeded), S4d (subscription agreement,
one-shot, undocumented in the TR), S4e (sign-in wall with Skip, one-shot,
undocumented in the TR), and T6a (the CLI answering while the engine does not).

### Why the engine cannot start, definitively

VirtualBox **is** providing nested virtualisation. Its own log says so:

```
NestedHWVirt       <integer> = 0x0000000000000001 (1)
EnableNestedPaging <integer> = 0x0000000000000001 (1)
CPUM: AMD-V nested-guest init
HM: HMR3Init: AMD-V w/ nested paging
```

But WSL 2 must boot a Hyper-V VM through the Host Compute Service, and that
fails:

```
Wsl/Service/RegisterDistro/CreateVm/HCS/HCS_E_HYPERV_NOT_INSTALLED
WSL2 is unable to start since virtualization is not enabled on this machine.
```

Nested AMD-V lets a guest run *a* hypervisor. Hyper-V's HCS requires a specific
set of hardware features and enlightenments that VirtualBox does not expose, and
Oracle has never claimed Hyper-V-in-guest support. This is a platform
limitation, not a misconfiguration: `--nested-hw-virt on` is set, `wsl --install`
succeeded, `VirtualMachinePlatform` is enabled, and only the VM boot fails.

### Consequence beyond this deck

If a VirtualBox VM image is ever distributed as the student environment for this
module, **no student will be able to complete the Docker sessions**, and the same
applies to sessions 2 to 5, not just session 1. Choosing the lab environment is a
programme-level decision: real hardware, WSL 2 on the student's own Windows, or a
KVM-based image. The host here has `kvm_amd` with `nested=1` and `/dev/kvm`, so a
KVM image would work.

### Still outstanding

`docker run hello-world` (first pull), `docker images` empty, `docker ps -a` with
`Exited (0)`, and the Docker Desktop starting/green screenshots. Recorded in
`workflow/assets-manifest.md` with the reason. `c8-steps-34`'s hello-world block
is marked illustrative in its speaker notes so nobody presents it as verified.
