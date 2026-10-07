"""The recap title card: one word the size of the room, last session under it.

It is step 1 of the recap panel, and the stage header stands down while it is up
(see the `.stage-poll[data-at="0"] .sl-head` rule in styles.py). Scoped by class,
never by id, because a cloner that strips ids leaves an id-scoped rule dead.
"""


def titlecard(word, topic=""):
    sub = ('<text x="800" y="556" text-anchor="middle" style="font:400 60px var(--sans)"'
           f' fill="#5A6A75">{topic}</text>') if topic else ""
    return (
        '<div class="tc-wrap"><svg class="fig titlecard" viewBox="0 0 1600 900"'
        ' xmlns="http://www.w3.org/2000/svg" role="img"'
        f' aria-label="Title card reading {word}">'
        '<defs><clipPath id="tc-clip">'
        '<rect x="0" y="0" width="1600" height="900" rx="16"/></clipPath>'
        '<linearGradient id="tc-rule" x1="0" y1="0" x2="1" y2="0">'
        '<stop offset="0" stop-color="#0B5FA5"/><stop offset="1" stop-color="#5CC6EA"/>'
        '</linearGradient></defs><g clip-path="url(#tc-clip)">'
        '<rect x="0" y="0" width="1600" height="900" fill="#FFFFFF"/>'
        '<text x="800" y="452" text-anchor="middle"'
        ' style="font:700 196px var(--sans);letter-spacing:-4px" fill="#0B7CB5">'
        f'{word}</text>'
        f'{sub}'
        '<rect x="0" y="884" width="1600" height="16" fill="url(#tc-rule)"/>'
        '</g></svg></div>'
    )
