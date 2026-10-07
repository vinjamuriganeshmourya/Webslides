# Session 11 — Nested Conditional Statements

The finished plan is **generated**, never hand-edited.

```
python build.py            # writes ../Plans/Programming Foundations/11-...-plan.html
python build.py -o out.html
```

| Path | Is |
|---|---|
| `shell.html` | Head, full CSS, presenter JS. Four placeholders: `{{NAV}}` `{{BLOCKS}}` `{{GUIDE}}` `{{HANDOUT}}` |
| `parts/nav.html` | Sidebar: one button per beat with `data-mins`, checkpoint bands between |
| `parts/blocks/*.html` | One file per beat, assembled in the order listed in `_order.txt` |
| `parts/guide.html` | Instructor guide (three sections, under 400 words) |
| `parts/handout.html` | Printable worksheet, three A4 sheets |
| `media/slN.webp` | Deck artwork. Referenced as `src="SLIDE:N"` and inlined as base64 at build time |
| `originals/` | Untouched copies of any artwork this build has corrected |

To change the plan, edit a part and rebuild. Durations must still total 75 —
`python ../verify_plan.py <out>` checks that and 25 other things.

**Deck artwork that was corrected here.** `media/sl5.webp` shipped with the last
four lines of greatest-of-three at column zero, which makes the program a
NameError for some inputs. They are now indented inside the `else`. The original
is in `originals/`, and **the deck itself still needs the same fix**. The faulty
version is still taught — the instructor breaks it live, and the note on that
beat says how.

**Deck slide 13** (a two-bullet Key Takeaways) is deliberately skipped in favour
of the full takeaways card, so `verify_plan.py` reports one expected warning:
`every deck slide appears — skipped: [13]`.
