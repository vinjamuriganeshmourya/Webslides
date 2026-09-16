<!-- cSpell:ignore nxttrendz deployement NxtWave colour CIDR sshagent ngrok -->
# Session 10 illustrations

Instruction, 2026-09-16: *"I want illustration explanation, all must be
conveyed represented in illustration"*, and *"I want to show the diagram first,
what we require"*.

So: **every concept is carried by a picture, and no hands-on step happens
before the picture that explains it.** This file specifies each one. Build and
look at all of them in the lab before a slide is written, hard rule 17.

## 1. The lab

`slide-kit/deploy-lab/`, `devPort` 5238. Fourteen session figures plus the
eight architecture states is too much to prototype inside the deck file, and
session 9 proved the lab pays for itself.

Set it up the way `cloud-lab` is: copy `slide-kit/slide-template`, symlink
`node_modules`, point `activeDeck.ts` at a gallery that renders every figure at
several sizes and in its `useInstant()` state.

## 2. Two kinds of picture, and they do different jobs

| | Architecture states | Concept figures |
|---|---|---|
| What they are | eight SVG diagrams of the real system, growing | fourteen React figures that explain one idea each |
| Where they come from | `workflow/captures/session-10/diagrams/` | `src/decks/figures/`, built in the lab |
| When they appear | before every step that creates or changes a resource | wherever an idea needs a picture rather than a sentence |
| What they must never do | show a resource that does not exist yet as solid | decorate. A figure that adds nothing is worse than none |

## 3. The architecture states

**Built as a React component, not as eight exported images.** User instruction,
2026-09-16: *"instead lets directly build interactive components using official
icons"*.

`CloudArchitecture` in `src/decks/figures/aws/` takes a `state` and grows. It
uses the **official AWS Architecture Icons**, release 07312026, and AWS's own
group-border conventions, both installed in `slide-kit/assets/aws/` with the
conventions written up in the README beside them.

Why a component and not eight files: eight static images drift, so a port
changes and seven of them still show the old one. Here every value comes from
one place, the reveal is tied to the deck's stepper so the picture grows while
the instructor talks, and `useInstant()` is honoured so a Ctrl+arrow jump lands
on the finished frame rather than replaying an animation nobody is watching.

Three pieces, all session-owned for now:

| File | What it is |
|---|---|
| `awsTokens.ts` | AWS's group colours and which are dashed, plus the category colours. Read out of the official SVGs, not copied from a blog |
| `AwsIcon.tsx` | One official icon at the size AWS intended. Guards the commonest mistake: a **service** square where a **resource** icon belongs |
| `GroupBox.tsx` | A group border in AWS's colour and line style, with three states: `pending`, `adding`, `built` |
| `CloudArchitecture.tsx` | The whole picture, with the seven states below and the labelled connectors |

The eight rendered SVGs stay in `workflow/captures/session-10/diagrams/` as a
reference for what the component should look like, and for the reading
material, which is Markdown and cannot run React.

### The states the component takes

`gap` · `ssh` · `containers` · `doors` · `elastic` · `jenkins` · `finished`

The requirement sheet stays a separate figure, because it is a table rather
than a picture and shares nothing with the growing drawing.

### The old mapping, still true for the reading material

| File | Shown before | Adds |
|---|---|---|
| `arch-01-what-we-require` | **beat 3, before anything is created** | The specification sheet. Both servers, instance type, vCPU and RAM, image, disk, Region, Zone, VPC, subnet, and every inbound rule as port / source / why |
| `arch-02-the-gap` | beat 2 | Laptop, GitHub, Docker Hub solid. AWS dashed. **No arrow reaches AWS** |
| `arch-03-ssh-in` | beat 10 | The instance solid, one blue arrow, SSH on 22 with the key on the line |
| `arch-04-containers` | beat 23 | Two containers and the volume inside the instance. Docker Hub to instance. 3000 and 8000 still shut |
| `arch-05-doors-open` | beat 50 | 22, 3000, 8000 open. 5432 drawn as a door that does not exist. Users arrive |
| `arch-06-elastic-ip` | beat 61 | The pinned address, with the three it replaced crossed out |
| `arch-07-jenkins-joins` | beat 87 | Both instances in the VPC. GitHub straight to Jenkins. The private SSH hop. **ngrok gone** |
| `arch-08-finished` | beat 107 | The whole system, with the only manual step marked |

## 4. The concept figures

Fourteen. Each owns one idea, and the beat that uses it is named.

### Concept 1 · Logging In

**`KeyAndDoor`** · beat 9
: A door with one keyhole, and one key. Two states: the key held up, and the
  key turned. Says in a picture that there is exactly one way in and you are
  holding it. No lock-picking imagery, no padlock cliché.

**`Permissions`** · beat 13
: Three figures labelled **you**, **your group**, **everyone else**, and a file.
  State 1 (`0644`): lines from all three reach the file. State 2 (`0400`): two
  lines are cut, one remains. That is what `chmod 400` means, without a
  permissions table.

### Concept 2 · Docker on the Server

**`GroupOnLogin`** · beat 21
: A badge being checked at a door. State 1: the badge is issued but the person
  is already inside, so the guard never sees it. State 2: they step out and
  back in, the guard checks, they pass. Why `usermod` needs a new session.

**`RegistryHandoff`** · beat 24
: Three panels: your machine builds, the registry holds, the server runs. The
  arrow from your machine to the server is **absent**, and that absence is the
  point. The server never sees source.

### Concept 3 · Running the Stack

**`BuildVsImage`** · beat 28
: Two paths from one Dockerfile. The upper path goes through the pipeline and
  its tests to a tagged image, then to the server. The lower path goes straight
  to the server and is labelled **"something no pipeline tested"**. The lower
  path is drawn in the error colour and stops at a wall.

### Concept 4 · Security Groups

**`DoorList`** · beats 38, 52
: The instance as a building edge with numbered doors: 22, 3000, 8000, 5432.
  Four states. State 1 all shut, state 2 only 22 open, state 3 22, 3000 and
  8000 open, state 4 the same with 5432 shown as **bricked over** rather than
  locked. Reused across the concept so the room tracks one picture.

**`CidrRuler`** · beat 43
: A horizontal bar representing every address on the internet. `/0` fills the
  whole bar. `/32` is a single hairline at one end, called out with a leader
  line. Two labels only. No binary, no subnet arithmetic.

**`NoDoorAtAll`** · beat 53
: The database drawn **inside** the backend container, as a file on a shelf,
  with the instance wall around both and no door in that wall. Contrasted with
  a second panel where a `db` container sits beside the backend and does have a
  door, marked with the warning.

**`TimeoutVsRefused`** · beat 54
: Two lanes. Upper: packets vanish at the wall, a long clock, the word
  **timeout**, the fix is the security group. Lower: packets arrive at a closed
  shutter and bounce back instantly, the word **refused**, the fix is the app.
  The asymmetry of the clocks is the whole lesson.

### Concept 5 · A Permanent Address

**`AddressTag`** · beats 57, 61
: State 1: a luggage tag tied on with string, showing the four addresses in
  order with three crossed out. State 2: the same machine with a metal plate
  bolted on reading `13.202.184.214`. The private address `172.31.7.32` is
  engraved on the machine itself in both states, unchanged.

**`ThreePlaces`** · beat 59
: The address written in three places, drawn as three cards: a compose file on
  the server, a Python file **inside a sealed image**, and a Jenkinsfile. The
  middle card has a lock on it and a small callout: "changing this is a commit,
  a build, a push and a redeploy".

### Concept 6 · Shipping a Fix

**`WhoseLocalhost`** · beat 70
: Two laptops and a server. The browser on the visitor's laptop is running the
  frontend, and an arrow labelled `localhost:8000` loops back into **that same
  laptop** rather than reaching the server. The loop is the joke and the lesson.

**`InsideTheImage`** · beat 71
: An image drawn as a sealed box with `settings.py` visible through a window.
  A hand with a pencil is stopped at the surface. Beside it, the only route in:
  edit source, commit, build, push, pull.

**`LastMile`** · beat 76
: The pipeline as a conveyor running from GitHub to Docker Hub, ending at a
  cliff edge. A person carries the last crate across the gap by hand. State 2
  replaces the person with a bridge labelled `Deploy`.

**`TagAsVariable`** · beat 78
: The compose file with `:6` hardcoded, being replaced by `${IMAGE_TAG}`, and
  `.env` beside it holding the number. One `sed` arrow touches only the `.env`
  line. Shows why the deploy command is short.

**`IdIsTheName`** · beat 82
: Two credential cards. One has a handwritten name tag reading
  `dockerhub-credentials`, the other has a machine-printed UUID. A pipeline
  hand reaches for the name it was told and finds nothing on the second.

### Concept 7 · Jenkins on AWS

**`NgrokDetour`** · beat 86
: GitHub at one side, a laptop at the other, and the webhook taking a long
  curved detour through a third-party tunnel to get there. State 2 deletes the
  curve and draws a short straight line to an instance inside AWS.

**`MemoryBar`** · beat 92
: A single stacked bar, 908 MiB wide. 436 MiB shaded as Jenkins at idle, 133
  MiB of free space called out as alarmingly thin, and a second bar beneath
  showing 4 GiB of swap with 486 MiB already used. **Real measurements, printed
  on the figure.** Hard rule: no invented numbers in a figure.

**`GroupAsSource`** · beat 97
: Two rule cards side by side. The left names an address and has a small
  warning that it must be re-pinned whenever the machine changes. The right
  names a **group**, drawn as a ring around the Jenkins instance, and a second
  instance is shown joining the ring and inheriting the permission with no
  edit.

**`TwoServers`** · concept 7 divider
: The VPC as one enclosure holding both machines, each labelled with its type
  and disk, the private addresses on the wire between them, and the public
  edges drawn only where they exist.

## 5. Rules for whoever builds these

1. **Every number on a figure is measured.** `MemoryBar` in particular. If a
   value is not in the plan's §8 or §9, it does not go on a figure.
2. **Text and the part of the figure it describes reveal together**, hard rule 6.
3. **`useInstant()` is honoured**, or the figure is the only thing moving during
   a Ctrl+arrow jump.
4. **Explanatory tier timings**: entrances 520 ms, staggers 130 ms, line draws
   860 ms, a figure assembled by about 2.4 s. Not UI speed.
5. **Look at every render before it reaches a slide.** The harnesses see an
   `<svg>` as one box and will pass a figure whose labels sit on top of each
   other.
6. **No invented logos.** Labelled rectangles and the house icon set only.
