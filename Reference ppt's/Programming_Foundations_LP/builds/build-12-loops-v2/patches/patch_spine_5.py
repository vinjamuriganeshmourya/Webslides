# -*- coding: utf-8 -*-
"""Part 5: the session CSS - the hook's new step numbers, the examples, the agenda."""
import io

p = 'parts/extra.css'
s = io.open(p, encoding='utf-8').read()


def sub(old, new, n=1):
    global s
    assert old in s, 'anchor not found: %r' % old[:70]
    s = s.replace(old, new, n)


# The collapse used to be press 3. It is press 7 now: the room gives its own
# examples in between, and the construct stays the last thing the card draws.
sub('.an-3 .hmorph .hgroup{', '.an-7 .hmorph .hgroup{')
sub('.an-3 .hmorph .houter{', '.an-7 .hmorph .houter{')
sub('.an-3 .hmorph .hcode,.an-3 .hmorph .hcap{', '.an-7 .hmorph .hcode,.an-7 .hmorph .hcap{')

sub("""@media (prefers-reduced-motion:reduce){
  .hmorph *{transition:none !important}""",
    """/* presses 3 to 6 are the room's own examples. The machine stands down rather
   than being stacked under, so the card never grows past its own height. */
.hkyt{display:none}
:is(.an-3,.an-4,.an-5,.an-6) .hkfig{display:none}
:is(.an-3,.an-4,.an-5,.an-6) .hkyt{display:block}

/* the worked examples, revealed one per press AFTER the room has offered theirs.
   Its own class, not .exgrid: the shared one is wired to presses 2 to 5. */
.exg2{display:flex;flex-wrap:wrap;margin:18px -9px 0}
.exg2 .ex{flex:1 1 240px;min-width:0;margin:0 9px 18px;padding:16px 18px 18px;
  border:2px solid #D6E6F0;border-left:6px solid var(--dk-cyan);border-radius:10px;
  background:#F7FBFD;opacity:0;transform:translateY(10px);
  transition:opacity 380ms var(--ease-out),transform 380ms var(--ease-out)}
.exg2 .ex b{display:block;font-size:1.06em;color:var(--dk-blue);margin:0 0 6px}
.exg2 .ex span{display:block;color:var(--dk-text)}
.exg2 .ex em{font-style:normal;font-weight:650;color:var(--dk-red)}
.an-4 .exg2 .ex:nth-child(-n+1),.an-5 .exg2 .ex:nth-child(-n+2),
.an-6 .exg2 .ex:nth-child(-n+3){opacity:1;transform:none}
body.present .exg2{margin-top:34px}
body.present .exg2 .ex{padding:22px 24px 24px;font-size:clamp(14px,1.2vw,20px)}

/* ============ the agenda: four stops, one per press ============
   A list of four bullets is what this replaces. Each press lays one more length
   of rail and lands the next stop, so the room sees the session go somewhere. */
.agroute > g{opacity:0;transform:translateY(10px);transform-box:fill-box;
  transform-origin:50% 50%;
  transition:opacity 380ms var(--ease-out),transform 380ms var(--ease-out)}
.an-1 .agroute > g:nth-child(-n+1),.an-2 .agroute > g:nth-child(-n+2),
.an-3 .agroute > g:nth-child(-n+3),.an-4 .agroute > g:nth-child(-n+4){
  opacity:1;transform:none}
.agroute .rail{stroke:#CFE3EF;stroke-width:6;fill:none;stroke-linecap:round}
.agroute .dot{fill:var(--dk-blue)}
.agroute .n{font:700 22px var(--sans);fill:#fff}
.agroute .t{font:600 24px var(--sans);fill:var(--dk-blue)}
.agroute .d{font:400 18px var(--sans);fill:var(--dk-line)}

@media (prefers-reduced-motion:reduce){
  .exg2 .ex,.agroute > g{transition-duration:1ms;transform:none}
  .hmorph *{transition:none !important}""")

sub("""@media print{
  .hmorph .hgroup{""",
    """@media print{
  .exg2 .ex,.agroute > g{opacity:1;transform:none}
  .hkfig,.hkyt{display:block}
  .hmorph .hgroup{""")

io.open(p, 'w', encoding='utf-8').write(s)
print('part 5 applied')
