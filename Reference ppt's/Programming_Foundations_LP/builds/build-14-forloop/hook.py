"""The hook, and the card that follows it.

`hook_body()` is a Spotify playlist on a phone. The room has all held this
screen. Nothing on it says how many songs there are, and the player still stops
in the right place. That is a for loop.

One moving group: `.hk-hl`, the row highlight, translated down the list. The
long travel from song three to the last song is the turn; everything else is
small. Six instructor-paced beats, five of them the song story told all the way
through, and the sixth the room's own turn. No quiz inside the hook, no
controls the room touches.

`examples_body()` is the card after it. The three everyday machines the room's
answers land beside, drawn at a size worth looking at, each running its own
loop, and then the shape all three share. It is a separate card because three
machines shrunk into a third of a column beside a phone are three grey smudges.
"""

# --------------------------------------------------------------- the palette
# Spotify's own, because the room recognises the screen before it reads a word
# of it, and a near miss reads as a fake.
SP_BG = "#121212"
SP_CARD = "#181818"
SP_GREEN = "#1DB954"
SP_TEXT = "#FFFFFF"
SP_DIM = "#A7A7A7"

# ----------------------------------------------------------------- the phone
ROW_H = 70
ROW_TOP = 190

SONGS = [
    ("Morning Raag", "Ananya Rao", "3:58", "#8E5A9E"),
    ("City Lights", "The Verandah", "4:12", "#2E6FA8"),
    ("Old Road", "Kabir Sen", "3:21", "#B4703C"),
    ("Paper Boats", "Meera", "5:04", "#3C8A72"),
    ("Last Bus Home", "Nikhil D", "3:47", "#A34A55"),
]
NEW_SONG = ("One More Song", "Ananya Rao", "4:30", "#5B62B0")


def _note(x, y, s, fill, op=1.0):
    """A beamed pair of eighth notes: the glyph every music app uses. Drawn in a
    20 unit box and scaled, so one definition serves the tiles and the cover."""
    return (
        f'<g transform="translate({x},{y}) scale({s})" fill="{fill}" '
        f'opacity="{op}">'
        '<path d="M7.2 15 V3.4 h1.7 V15 z"/>'
        '<path d="M18.2 13 V1.2 h1.7 V13 z"/>'
        '<path d="M7.2 2.2 L19.9 0 V3.9 L7.2 6.1 z"/>'
        '<ellipse cx="4.4" cy="15.2" rx="3.9" ry="2.9" '
        'transform="rotate(-20 4.4 15.2)"/>'
        '<ellipse cx="15.4" cy="13.2" rx="3.9" ry="2.9" '
        'transform="rotate(-20 15.4 13.2)"/>'
        '</g>'
    )


def _spotify_mark(x, y, r=11):
    """The wordmark's circle and its three arcs. The room reads it in a glance
    and stops asking what app this is supposed to be."""
    return (
        f'<g transform="translate({x},{y})">'
        f'<circle cx="0" cy="0" r="{r}" fill="{SP_GREEN}"/>'
        '<g fill="none" stroke="#121212" stroke-linecap="round">'
        '<path d="M-6.6,-2.9 C-2.7,-5.0 3.4,-4.4 6.6,-2.2" stroke-width="2.1"/>'
        '<path d="M-5.3,0.7 C-2.0,-1.1 2.9,-0.7 5.5,1.0" stroke-width="1.9"/>'
        '<path d="M-4.1,3.9 C-1.6,2.6 2.0,2.9 4.2,4.2" stroke-width="1.6"/>'
        '</g></g>'
    )


def _tile(x, y, size, colour, seed):
    """A song's album art: a flat colour, a darker corner and the note glyph.
    Six of them in six colours is what makes the list read as a real playlist
    rather than six grey boxes."""
    return (
        f'<g><rect x="{x}" y="{y}" width="{size}" height="{size}" rx="4" '
        f'fill="{colour}"/>'
        f'<path d="M{x} {y + size} L{x + size} {y} v{size} z" fill="#000000" '
        'opacity=".18"/>'
        + _note(x + size * 0.28, y + size * 0.22, size / 36, "#FFFFFF", 0.92)
        + '</g>'
    )


def _row(i, title, artist, length, colour, cls=""):
    y = ROW_TOP + ROW_H * i
    g = f'<g class="{cls}">' if cls else "<g>"
    return (
        f'{g}'
        f'{_tile(20, y + 11, 48, colour, i)}'
        f'<text x="82" y="{y + 32}" style="font:600 18px var(--sans)" '
        f'fill="{SP_TEXT}" class="hk-t{i}">{title}</text>'
        f'<text x="82" y="{y + 54}" style="font:14px var(--sans)" '
        f'fill="{SP_DIM}">{artist}</text>'
        # the time stops well short of x=310, where the playing row's equaliser lands
        f'<text x="300" y="{y + 45}" text-anchor="end" style="font:13px var(--mono)" '
        f'fill="#6F6F6F">{length}</text>'
        f'</g>'
    )


def phone_svg():
    rows = "".join(_row(i, t, a, d, c) for i, (t, a, d, c) in enumerate(SONGS))
    rows += _row(len(SONGS), *NEW_SONG, cls="hk-new")

    # The highlight: ONE group, one transform. It is drawn AFTER the rows, so its
    # tint has to be translucent or it paints over the song titles. Drawn before
    # them it is simply invisible behind each row, which is what happened first
    # and what only a screenshot showed.
    hl = (
        '<g class="hk-hl">'
        f'<rect x="10" y="{ROW_TOP}" width="360" height="{ROW_H}" rx="8" '
        f'fill="{SP_GREEN}" opacity=".13"/>'
        f'<rect x="10" y="{ROW_TOP}" width="4" height="{ROW_H}" rx="2" '
        f'fill="{SP_GREEN}"/>'
        f'<g class="hk-eq" transform="translate(316,{ROW_TOP + 28})">'
        f'<rect x="0" y="0" width="5" height="18" rx="2.5" fill="{SP_GREEN}"/>'
        f'<rect x="9" y="0" width="5" height="18" rx="2.5" fill="{SP_GREEN}"/>'
        f'<rect x="18" y="0" width="5" height="18" rx="2.5" fill="{SP_GREEN}"/>'
        '</g>'
        '</g>'
    )

    return f"""<svg class="hksvg" viewBox="0 0 380 700" xmlns="http://www.w3.org/2000/svg"
 role="img" aria-label="A Spotify playlist on a phone, with a green Play button">
<defs>
  <clipPath id="hkclip"><rect x="0" y="0" width="380" height="700" rx="30"/></clipPath>
  <linearGradient id="hkcover" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#1ED760"/><stop offset="1" stop-color="#0B6E33"/>
  </linearGradient>
  <linearGradient id="hktop" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2B4A3A"/><stop offset="1" stop-color="{SP_BG}"/>
  </linearGradient>
</defs>
<g clip-path="url(#hkclip)">
  <rect x="0" y="0" width="380" height="700" fill="{SP_BG}"/>
  <rect x="0" y="0" width="380" height="240" fill="url(#hktop)"/>

  <!-- status bar -->
  <text x="22" y="26" style="font:600 14px var(--sans)" fill="{SP_TEXT}">9:41</text>
  <g fill="{SP_TEXT}" transform="translate(300,12)">
    <rect x="0" y="4" width="3" height="6" rx="1"/>
    <rect x="5" y="2" width="3" height="8" rx="1"/>
    <rect x="10" y="0" width="3" height="10" rx="1"/>
    <path d="M24 10 q4 -6 9 0 l-4.5 4.5 z"/>
    <rect x="44" y="1" width="20" height="10" rx="2.5" fill="none" stroke="{SP_TEXT}" stroke-width="1.4"/>
    <rect x="46" y="3" width="13" height="6" rx="1.4"/>
  </g>

  <!-- the brand, said once -->
  {_spotify_mark(32, 54)}
  <text x="50" y="59" style="font:700 16px var(--sans)" fill="{SP_TEXT}">Spotify</text>

  <!-- the playlist header -->
  <g>
    <rect x="22" y="78" width="80" height="80" rx="6" fill="url(#hkcover)"/>
    {_note(46, 100, 1.9, "#0B3B1E", 0.85)}
    <text x="116" y="96" style="font:600 11px var(--sans);letter-spacing:.14em"
          fill="{SP_DIM}">PLAYLIST</text>
    <text x="116" y="124" style="font:700 24px var(--sans)" fill="{SP_TEXT}">Today's Mix</text>
    <text x="116" y="148" style="font:13px var(--sans)" fill="{SP_DIM}">Nxt Studio</text>
  </g>

  <!-- Play all -->
  <g>
    <circle class="hk-rip" cx="330" cy="172" r="40" fill="{SP_GREEN}"/>
    <circle cx="330" cy="172" r="24" fill="{SP_GREEN}"/>
    <path d="M323 161 l17 11 -17 11 z" fill="#121212"/>
    <text x="296" y="178" text-anchor="end" style="font:600 14px var(--sans)"
          fill="{SP_DIM}">Play all</text>
  </g>

  {rows}
  {hl}

  <!-- now playing -->
  <g class="hk-np">
    <rect x="0" y="626" width="380" height="74" fill="{SP_CARD}"/>
    <rect x="0" y="626" width="380" height="3" fill="#2A2A2A"/>
    <rect x="0" y="626" width="248" height="3" fill="{SP_GREEN}"/>
    {_tile(16, 640, 44, "#5B62B0", 9)}
    <text x="70" y="660" style="font:600 14px var(--sans)" fill="{SP_TEXT}">Playing</text>
    <text x="70" y="680" style="font:12px var(--sans)" fill="{SP_DIM}">Today's Mix</text>
    <path d="M338 652 l14 9 -14 9 z" fill="{SP_TEXT}"/>
  </g>
  <g class="hk-stop">
    <rect x="0" y="626" width="380" height="74" fill="{SP_CARD}"/>
    <rect x="0" y="626" width="380" height="3" fill="#2A2A2A"/>
    {_tile(16, 640, 44, "#4A4A4A", 9)}
    <text x="70" y="660" style="font:600 14px var(--sans)" fill="{SP_TEXT}">Stopped</text>
    <text x="70" y="680" style="font:12px var(--sans)" fill="{SP_DIM}">The list ended</text>
    <rect x="338" y="652" width="5" height="18" rx="2" fill="{SP_TEXT}"/>
    <rect x="347" y="652" width="5" height="18" rx="2" fill="{SP_TEXT}"/>
  </g>
</g>
</svg>"""


LINES = [
    ("The list",
     "A Spotify playlist you made. Five songs."),
    ("One tap",
     "You tap play once. Song one starts."),
    ("It moves on its own",
     "Song one ends. Song two starts. You did not touch the phone."),
    ("Right to the end, then it stops",
     "The last song ends and it stops. Nothing says five. So what told it to stop?"),
    ("Add one song",
     "Now there are six. It plays six. You never typed a number."),
    ("Your turn",
     "Where else does one tap keep going till a list runs out?"),
]

STEPS = 6
LABELS = ("the list|one tap|it moves on|to the end, and it stops|"
          "one more song|your turn")


def hook_body():
    """Six headlines, all of them on the card from press 1, the ones still to
    come ghosted. Only the beat on now shows its sentence, so the column never
    holds more than one sentence at a time."""
    lines = "".join(
        f'<p class="hkline"><b>{a}</b><span class="hks">{b}</span></p>' for a, b in LINES
    )
    return (
        '<div class="hkwrap">'
        f'<div class="phone">{phone_svg()}</div>'
        f'<div class="story">{lines}</div>'
        '</div>'
    )


# ===================================================== the card after the hook
# Three machines, each one moving part, each at its own period so three loops in
# a row never beat in unison. Every one of them is a screen or a counter the
# room stood in front of this week: a slideshow of holiday photos is not.
def ex_roll():
    names = ["Aarav", "Diya", "Ishan", "Riya", "Zoya"]
    rows = "".join(
        f'<rect x="16" y="{16 + i * 30}" width="150" height="24" rx="6" '
        'fill="#FFFFFF" stroke="#D3E3EE" stroke-width="2"/>'
        f'<text x="28" y="{33 + i * 30}" style="font:13px var(--sans)" '
        f'fill="#4A5661">{n}</text>'
        for i, n in enumerate(names))
    return (
        '<svg class="hkm hkm-roll" viewBox="0 0 260 200" '
        'xmlns="http://www.w3.org/2000/svg" role="img" '
        'aria-label="A register of names, ticked one at a time">'
        '<rect x="4" y="4" width="252" height="168" rx="12" fill="#F7FBFD" '
        'stroke="#DCE9F2" stroke-width="2"/>'
        f'{rows}'
        '<g class="hkm-go">'
        '<rect x="12" y="13" width="158" height="30" rx="8" fill="#006DAF" '
        'opacity=".12"/>'
        '<circle cx="196" cy="28" r="13" fill="#E6F6EC"/>'
        '<path d="M190 28 l5 6 9 -11" stroke="#1F9D62" stroke-width="3.2" '
        'fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
        '</g>'
        '</svg>')


def ex_story():
    """Instagram stories: the bar at the top fills one segment at a time, and
    when the last one ends the app takes you out. Nobody ever typed how many.
    One moving part, like every other machine here: a single white bar that
    steps across the five segments."""
    segs = "".join(
        f'<rect x="{84 + i * 20}" y="18" width="16" height="4" rx="2" '
        'fill="#FFFFFF" opacity=".34"/>' for i in range(5))
    return (
        '<svg class="hkm hkm-story" viewBox="0 0 260 200" '
        'xmlns="http://www.w3.org/2000/svg" role="img" '
        'aria-label="A phone playing stories, one after another, to the last one">'
        '<defs><linearGradient id="hkst" x1="0" y1="0" x2="1" y2="1">'
        '<stop offset="0" stop-color="#F9A03C"/>'
        '<stop offset=".5" stop-color="#D6336C"/>'
        '<stop offset="1" stop-color="#6A3DBE"/></linearGradient>'
        '<clipPath id="hkm-seg"><rect x="80" y="14" width="104" height="12"/>'
        '</clipPath></defs>'
        '<rect x="76" y="4" width="112" height="164" rx="16" fill="#1B1B1F"/>'
        '<rect x="82" y="10" width="100" height="152" rx="11" fill="url(#hkst)"/>'
        f'{segs}'
        '<g clip-path="url(#hkm-seg)"><g class="hkm-go">'
        '<rect x="84" y="18" width="16" height="4" rx="2" fill="#FFFFFF"/>'
        '</g></g>'
        '<circle cx="96" cy="40" r="8" fill="#FFFFFF" opacity=".92"/>'
        '<rect x="110" y="36" width="42" height="6" rx="3" fill="#FFFFFF" opacity=".8"/>'
        '<rect x="94" y="132" width="76" height="20" rx="10" fill="#FFFFFF" opacity=".3"/>'
        '<text x="132" y="146" text-anchor="middle" '
        'style="font:600 11px var(--sans)" fill="#FFFFFF">Send message</text>'
        '</svg>')


def ex_scan():
    items = "".join(
        f'<rect x="{26 + i * 56}" y="36" width="42" height="42" rx="6" '
        f'fill="{c}" stroke="#FFFFFF" stroke-width="2"/>'
        for i, c in enumerate(["#E8A13A", "#4FA3D1", "#7FB069", "#D96B6B",
                               "#9B6FC4"]))
    return (
        '<svg class="hkm hkm-scan" viewBox="0 0 260 200" '
        'xmlns="http://www.w3.org/2000/svg" role="img" '
        'aria-label="Items on a billing belt, scanned one at a time">'
        '<defs><clipPath id="hkm-belt">'
        '<rect x="10" y="14" width="240" height="76"/></clipPath></defs>'
        '<rect x="4" y="4" width="252" height="168" rx="12" fill="#F7FBFD" '
        'stroke="#DCE9F2" stroke-width="2"/>'
        '<rect x="10" y="90" width="240" height="12" rx="6" fill="#DDE7EE"/>'
        f'<g clip-path="url(#hkm-belt)"><g class="hkm-go">{items}</g></g>'
        '<path d="M130 20 V88" stroke="#C7454E" stroke-width="3" '
        'stroke-linecap="round"/>'
        '<rect x="102" y="116" width="56" height="32" rx="6" fill="#22303B"/>'
        '<text x="130" y="138" text-anchor="middle" '
        'style="font:700 14px var(--mono)" fill="#7FE0A8">beep</text>'
        '</svg>')


EXAMPLES = [
    (ex_roll, "The attendance register",
     "One name, one tick. It stops when the names run out."),
    (ex_story, "Instagram stories",
     "One story, then the next. Nobody types how many there are."),
    (ex_scan, "The billing counter",
     "One item over the scanner, one beep, until the basket is empty."),
]


def shape_svg():
    """Beat 3. Everything stripped away: a list, one job, and the arrow back.
    This is the for loop, drawn, before anyone has said the words. Without it
    the hook is a nice story about a music app and the room never sees what it
    was for."""
    chips = "".join(
        f'<g><rect x="{54 + i * 78}" y="92" width="62" height="62" rx="12" '
        'fill="#FFFFFF" stroke="#3FB5E5" stroke-width="2.5"/>'
        + _note(70 + i * 78, 108, 1.55, "#3FB5E5")
        + '</g>'
        for i in range(6)
    )
    return f"""<svg class="hkshapesvg" viewBox="0 0 560 420"
 xmlns="http://www.w3.org/2000/svg" role="img"
 aria-label="A list of six items, one job, and an arrow going back for the next item">
  <rect x="26" y="40" width="508" height="132" rx="16" fill="#F7FBFD"
        stroke="#CFE6F5" stroke-width="2.5"/>
  <text x="46" y="74" style="font:700 20px var(--sans)" fill="#0B5FA5">the list</text>
  {chips}
  <path d="M280 172 v46" stroke="#006DAF" stroke-width="3" fill="none"/>
  <path d="M280 228 l-9 -14 h18 z" fill="#006DAF"/>
  <text x="296" y="204" style="font:16px var(--sans)" fill="#5A6A75">take the next one</text>
  <rect x="140" y="236" width="280" height="86" rx="14" fill="#EAF6FC"
        stroke="#006DAF" stroke-width="3"/>
  <text x="280" y="288" text-anchor="middle" style="font:700 24px var(--sans)"
        fill="#0B5FA5">do one job</text>
  <!-- the loop back: out of the job, left, up, and into the list again -->
  <path d="M140 279 H54 a14 14 0 0 1 -14 -14 V190" stroke="#3FB5E5" stroke-width="3"
        fill="none" stroke-dasharray="7 6"/>
  <path d="M40 176 l-9 15 h18 z" fill="#3FB5E5"/>
  <text x="150" y="352" style="font:16px var(--sans)" fill="#5A6A75">
    when it ends, go back for the next one</text>
  <text x="280" y="396" text-anchor="middle" style="font:700 19px var(--sans)"
        fill="#C7454E" class="hk-never">Nowhere does it say six.</text>
</svg>"""


EX_STEPS = 4
EX_LABELS = "your turn|our three|the shape|nowhere does it say six"


def examples_body():
    slots = "".join(
        f'<div class="hkex-box">{svg()}'
        '<div class="hkex-foot">'
        f'<p class="hkex-lbl"><b>{name}</b><span>{why}</span></p>'
        '<p class="hkex-yours">yours</p></div></div>'
        for svg, name, why in EXAMPLES
    )
    ask = ('<p class="hkask"><b>Where else have you seen this?</b> '
           'One action, and it keeps going by itself until a list runs out.</p>')
    examples = f'<div class="hkex">{ask}<div class="hkex-row">{slots}</div></div>'
    shape = (
        '<div class="hkshape">'
        f'{shape_svg()}'
        '<p class="cap"><b>Same shape all three times.</b> Take a list. Do one '
        'job. Once for each item in it. You never say how many.</p>'
        '</div>'
    )
    return f'<div class="hkexwrap">{examples}{shape}</div>'
