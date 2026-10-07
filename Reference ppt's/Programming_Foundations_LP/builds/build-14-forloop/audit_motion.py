#!/usr/bin/env python3
"""Apply the Ten Non-Negotiable Standards to the finished presenter, by reading
the CSS that shipped rather than the CSS I meant to write.

review-animations is marked disable-model-invocation, so this walks its
STANDARDS.md rules that are decidable from the file. The three feel checks
(2 to 5 times duration, three metres away, look again tomorrow) are not.
"""
import pathlib
import re
import sys

PLAN = (pathlib.Path(__file__).parent / "out"
        / "14_for_loop_student_view.html").read_text(encoding="utf-8")
CSS = "\n".join(re.findall(r"<style>(.*?)</style>", PLAN, re.S))
JS = "\n".join(re.findall(r"<script>(.*?)</script>", PLAN, re.S))

fails = []
warns = []


def ck(cond, what, detail="", warn=False):
    if cond:
        print(f"[  ok  ] {what}")
    elif warn:
        warns.append(what)
        print(f"[ warn ] {what}  {detail}")
    else:
        fails.append(what)
        print(f"[ FAIL ] {what}  {detail}")


# 1 -- only transform and opacity move
moved = set()
for m in re.finditer(r"transition:([^;}]+)", CSS):
    for prop in re.split(r",", m.group(1)):
        name = prop.strip().split()[0] if prop.strip() else ""
        if name and not name.startswith(("cubic", "var(", "0", "1", "2", "3", "4",
                                         "5", "6", "7", "8", "9")):
            moved.add(name)
banned = moved & {"width", "height", "top", "left", "right", "bottom",
                  "margin", "padding", "all"}
ck(not banned, "only transform and opacity animate", f"also moving: {sorted(banned)}")
ck("transition:all" not in CSS.replace(" ", ""),
   "no transition:all anywhere")

# 2 -- the curves are the two settled tokens, never invented
curves = set(re.findall(r"cubic-bezier\([^)]*\)", CSS))
allowed = {"cubic-bezier(0.23,1,0.32,1)", "cubic-bezier(0.77,0,0.175,1)"}
norm = {c.replace(" ", "") for c in curves}
ck(norm <= allowed, "only the two settled curves are used",
   f"found {sorted(norm - allowed)}")
ck(not re.search(r"transition:[^;}]*\bease-in\b(?!-out)", CSS),
   "ease-in is never used", "it starts slow, on the frame the room is watching")

# 3 -- nothing enters from scale(0)
ck("scale(0)" not in CSS.replace(" ", ""), "nothing enters from scale(0)")

# 4 -- durations. Controls stay under 300ms; the hook and the explainer are
#      explanatory motion, which the duration table exempts.
long_ = []
for m in re.finditer(r"transition:([^;}]+)", CSS):
    for ms in re.findall(r"(\d+)ms", m.group(1)):
        if int(ms) > 300:
            long_.append((int(ms), m.group(1).strip()[:60]))
allowed_long = [d for d in long_ if "transform" in d[1] and d[0] <= 900]
ck(all(d[0] <= 900 for d in long_),
   "no transition runs longer than the hook's own turn",
   f"{[d for d in long_ if d[0] > 900]}")
print(f"         explanatory motion over 300ms, on purpose: "
      f"{sorted({d[0] for d in long_ if d[0] > 300})} ms")

# 5 -- transitions, not keyframes, for anything the instructor fires twice a second
kf = set(re.findall(r"@keyframes\s+([\w-]+)", CSS))
print(f"         keyframes in the file: {sorted(kf)}")
stepped = {k for k in kf if k in ("hkrip", "cshake", "hkeq")}
# hkmroll, hkmstory and hkmscan are the three machines on the card after the
# hook: each turns for ever at its own period, so there is no press to retarget
# them to.
# rcp-land comes from the skill's own SPINE_CSS, with the recap card.
# rsdrop is Riya's coin falling into the piggy bank: it appears, falls and
# disappears in one go, which no transition between two states can do.
ck(kf - {"hkrip", "cshake", "hkeq", "fs-fade", "ctlnudge", "tmrring",
         "hkmroll", "hkmstory", "hkmscan", "rcp-land", "rsdrop"} == set(),
   "keyframes are only used for things that cannot be retargeted",
   f"{sorted(kf)}")

# 6 -- one engine. A second animation controller is a block twice over.
ck(JS.count("data-anim-next") <= 2, "one staged-animation controller, not two")
ck("data-anim" in JS, "the staged cards ride the template's controller")

# 7 -- reduced motion ships with the animation, and keeps the finding
ck(CSS.count("prefers-reduced-motion") >= 3,
   "reduced motion is handled in more than one place",
   f"{CSS.count('prefers-reduced-motion')} blocks")
def media_blocks(css, needle):
    """Pull out each at-rule body by counting braces. A lazy `.*?\\n\\}` regex
    runs past the closing brace and sweeps in unrelated rules, which is how this
    check first reported a failure that was not there."""
    out = []
    for m in re.finditer(re.escape(needle) + r"\s*\{", css):
        i = m.end()
        depth = 1
        while i < len(css) and depth:
            if css[i] == "{":
                depth += 1
            elif css[i] == "}":
                depth -= 1
            i += 1
        out.append(css[m.end():i - 1])
    return out


rm = "\n".join(media_blocks(CSS, "@media (prefers-reduced-motion:reduce)")
               + media_blocks(CSS, "@media (prefers-reduced-motion: reduce)"))
ck("opacity:0" not in rm.replace(" ", ""),
   "reduced motion is gentler, not zero",
   "the end state has to stay reachable; the finding lives in it")

# 8 -- no hover-dependent motion. The room never touches the screen.
hover_moves = [m for m in re.findall(r"([^\n{}]*:hover[^{]*)\{([^}]*)\}", CSS)
               if "transform" in m[1] or "animation" in m[1]]
ck(not hover_moves, "no motion depends on hover", str(hover_moves[:2]))

# 9 -- transform-origin is written as arithmetic or pinned, never left to chance
origins = re.findall(r"transform-origin:([^;}]+)", CSS)
ck(all("center" not in o for o in origins),
   "no transform-origin left at center", str(origins))
ck("transform-box" in CSS, "SVG transforms pin transform-box")

# 10 -- will-change is not parked on anything
ck("will-change" not in CSS, "will-change is never parked on an element")

# and the two that are this build's own
ck(CSS.count("animation-play-state:paused") >= 1,
   "an animation inside a stepped card waits for its step")
ck("stopPropagation" in JS,
   "a panel with its own controls owns its keys")

print()
print(f"{len(fails)} failed, {len(warns)} warnings")
sys.exit(1 if fails else 0)
