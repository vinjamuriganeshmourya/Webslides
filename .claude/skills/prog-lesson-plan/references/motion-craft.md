# Motion craft — the borrowed bar

Four skills by Emil Kowalski are installed and are part of this build: `animate`,
`emil-design-eng`, `review-animations`, `animation-vocabulary`. They settle the motion questions
this skill used to leave to per-session argument — which properties may move, which curve, how
long, what happens when it is interrupted, what reduced motion does.

**They constrain how a motion is built. They never decide that one exists.** That decision is
made in SKILL.md, by the three tests — subtraction, prediction, wrongness. A borrowed rule that
says "this should not animate" has not overruled §5; read *Where the bar and this skill
disagree* below before you cut anything.

---

## Which skill, when

| Skill | Use at | For |
|---|---|---|
| `animate` | §5, before a line of animation CSS exists | Building the hook and the animated explainer. Invoke it **with the specific question** — a bare invocation returns only a canned greeting and nothing else |
| `emil-design-eng` | §5, when a panel or a control feels wrong and you cannot say why | Press feedback, origin-awareness, blur-masked crossfades, `@starting-style`, stagger, the next-day rule |
| `review-animations` | §6 | The audit. **It is marked `disable-model-invocation`, so you cannot call it with the Skill tool.** Read `~/.claude/skills/review-animations/STANDARDS.md` yourself and apply the Ten Non-Negotiable Standards, then tell the user in the delivery that `/review-animations "out/<slug>_student_view.html"` is theirs to run |
| `animation-vocabulary` | Writing the guide, or the delivery | Naming an effect — "pop in", "rubber-banding" — so you, the instructor and the deck owner mean the same thing |

## The settled values

Do not invent a curve or a duration. These are `animate`'s, and they are the only ones this build
uses. They belong in the template's token block, declared once, referenced by every animated card.

```css
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1);   /* entering, exiting, every reveal */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* something travelling across a card */
```

| What | Duration | Curve |
|---|---|---|
| A reveal landing, a step advancing, a button press | 100–200ms | `--ease-out` |
| A card-level transition | 200–300ms | `--ease-out` |
| The hook's single turn | ~900ms | `--ease-in-out` on the one moving group |
| The explainer, one step | at reading pace, instructor-driven | `--ease-in-out` on the dot, `--ease-out` on what greys |

**`ease-in` is a block.** It starts slow, delaying the exact frame the room is watching.
**Built-in `ease-out` is too weak** for anything deliberate — use the token.

## Where the bar and this skill disagree

Three borrowed rules were written for product UI and do not survive contact with a classroom.
These overrides are deliberate. Do not re-argue them per session, and do not quietly follow the
borrowed rule instead.

| Borrowed rule | Here | Why |
|---|---|---|
| "UI animations stay under 300ms" | The hook runs ~900ms, and the explainer steps at reading pace under the instructor's thumb | `animate`'s duration table exempts **marketing / explanatory** motion, and its purpose list names **Explanation** — motion whose whole job is demonstrating how something works. It parenthesises that as marketing/onboarding; a classroom is the same thing and the third case. The 300ms ceiling still binds every **control** — reveals, presses, step landings |
| The "should this animate at all?" frequency gate | Both animations are mandatory — every plan has them | The gate asks how often a *user* sees an element, and puts the delight budget at the rare/first-time tier. The room sees this once, in one session — the rarest tier there is. The gate exists to cut decoration, which the subtraction test already does, earlier and harder |
| "Delete the animation" is the first remedial move | Here it is the last | Deleting the explainer deletes the session's one idea. Reduce it, re-curve it, or fix its origin first. Delete only when it fails the subtraction test — and then the beat is redesigned, not just stripped |

Everything else in the borrowed bar applies unchanged.

## The blocks, applied to this build

Each is an automatic finding in `review-animations`, and each can bite a plan here.

- **`transform` and `opacity` only.** Not `width`, `height`, `top`, `left`, `margin`, `padding`.
  A greying step is `opacity` or `color` on a small element, which is allowed; the same property
  on a whole panel is not.
- **`transition: all` is never correct.** Name the properties. A card carrying `all` re-animates
  on every token change you make later, and you find out on the projector.
- **Never `scale(0)`.** Anything entering starts at `scale(0.95)` with `opacity: 0`. Nothing in
  the room appears from nothing.
- **Transitions, not keyframes, for anything the instructor can fire twice in a second** — the
  step button, replay, a reveal. Keyframes restart from zero; transitions retarget from where the
  element actually is. An instructor double-tapping the arrow key is the normal case, not the edge.
- **`transform-origin` at the thing it comes from**, written as arithmetic, never `center`.
- **One engine.** `data-anim` already exists. A second animation system is a block twice over —
  under this skill's own rule, and under `animate`'s "extend the codebase's tokens, don't fork them".
- **`prefers-reduced-motion` ships with the animation, not after it** — gentler, not zero. Keep the
  opacity and colour changes that carry the finding, drop the travel. The end state must stay
  reachable, because the finding lives in the end state.
- **No hover-dependent motion anywhere.** The instructor drives from a keyboard at a lectern; the
  room never touches the screen. Anything that only reveals itself on hover is invisible here.
- **Stagger 30–80ms** when several things enter together. Never everything at once.
- **`will-change` only while animating**, never parked on an element.

## Feel checks before you call it done

`animate` closes every build with these. All three are cheap and each catches a class of defect
that reading the CSS cannot.

- **Play it at 2–5× duration**, or step it in the DevTools animation inspector. A wrong
  `transform-origin` and a curve that stops abruptly are invisible at speed and obvious slowed down.
- **Look at it again the next day.** `emil-design-eng` makes this a rule rather than advice, and it
  is the cheapest defect-finder on the list.
- **Look at it from three metres**, which is near enough to the back of the room. A greyed-out
  state that reads at arm's length can disappear on a projector.

## Say it in the delivery

One line: which checks ran, and any borrowed rule you broke on purpose, with the reason. Not a
section about it.


---

## Settled on screenshots, not on principle

These came out of seven rounds of review on one plan. The user decided each of them by
looking at a card. They are not open, and re-deciding them per session is what makes a
plan take days.

- **A reveal is one operation per press, never a table.** The answer walks: one line, one
  step, one change to the state, then it waits. The room checks that one line on their own
  page before the next press. Five seconds a press, and the guide says so. A table of the
  whole answer is a table nobody reads and a beat nobody can be wrong in.
- **What is removed, vanishes.** A value that came out is gone, not greyed out in place. A
  grey ghost is the misconception the beat exists to fix. The exception is a hook whose
  subject is history itself; say so in the guide entry if you take it.
- **Every concept card is stepped**, one point or one stop per press, and the figure comes
  after the points it belongs to. A card that shows everything at once was called dull
  twice. This includes the agenda.
- **An animation inside a stepped card waits for its step.** Hold it with
  `animation-play-state:paused` until its `.an-k` arrives, or it has already played by the
  time the instructor presses. Invisible in every screenshot and every static check.
- **A panel with its own controls owns the arrow keys.** Stop propagation on that node, or
  one press steps the panel and advances the deck behind it.
- **A card with its own controls does not also get the stage's Back and Next.** Two control
  rows on one card collide. Build that stage by hand without them.
- **The hook is a realistic mock interface, not a diagram.** Status bar, clock, real labels,
  real names, a ripple on the exact element tapped. Grey placeholder bars were rejected.
  Real brand names are fine.
- **The example cards each carry a small motion**, about two seconds, once, as the card is
  revealed. Minimal, in the spirit of the hook, nowhere near its weight.
- **The impossible case is shown, not stated.** A sentence of text explaining why something
  cannot happen was rejected; cards landing one at a time, the impossible one last and full
  width with the stuck pair drawn, was accepted.

`assets/panel-chrome-reference.txt` has the CSS for the last four.
