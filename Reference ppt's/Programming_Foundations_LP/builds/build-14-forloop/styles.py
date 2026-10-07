"""Every per-session style override, in one string.

Rules that are load-bearing here, each of which cost a round somewhere:
  * every staged-reveal selector is scoped by CLASS, never by id -- the guide's
    cloner strips ids, and an id-scoped rule leaves a card frozen on step one;
  * `an-N` is exclusive, so a cumulative reveal names every step it survives into;
  * transform and opacity only, never width/height/top/left;
  * the two curves come from the template's token block, never invented here;
  * nothing enters from scale(0); 0.95 and opacity 0 is the floor;
  * reduced motion keeps the colour changes and drops the travel, because the
    finding lives in the end state.
"""

EXTRA_CSS = r"""
/* the shipped template sets white-space:normal and then nowrap in the same
   rule, so a checkpoint band carrying its cut is clipped at the sidebar width */
.sp-cp span{white-space:normal}

/* the option letter is absolutely placed and the template's `font:` shorthand
   resets its line-height, so in a line box twice its size it sits at the top and
   reads as a superscript. A unitless line-height inherits as a NUMBER, so
   `line-height:inherit` alone still gives a shorter line box on a smaller
   element: matching the font size is what actually lines the baselines up. */
.vopts li::before{top:0;font-size:inherit;line-height:inherit;
  font-weight:700;font-family:var(--mono);color:#9AA1B0}
body.present .vopts li::before{font-size:inherit;line-height:inherit}

/* a numbered line inside the deck's code slab. Without this the number runs
   straight into the code: 1seats = int(input()) */
pre.slabcode .no{display:inline-block;width:1.9em;color:#9AA1B0}

/* ============================== shared panel chrome ============================== */
.pcard .stage{position:relative}
.p2{display:flex;flex:1;min-height:0;margin:0}
/* a 16:9 card is taller than most panel bodies, so each column centres in the
   space it has instead of hugging the header and leaving a hole underneath */
.p2>div{min-width:0;min-height:0;display:flex;flex-direction:column;
  justify-content:safe center}
.p2>div:first-child{flex:1 1 52%;padding-right:22px}
.p2>div:last-child{flex:1 1 48%}
body.present .p2>div:first-child{padding-right:clamp(16px,2vw,40px)}

.lede{margin:0 0 12px;font-size:17px;line-height:1.5;color:var(--dk-text)}
.lede b{font-weight:700;color:var(--dk-blue)}
body.present .lede{font-size:clamp(15px,1.6vw,24px);margin-bottom:clamp(8px,1.4vh,20px)}

.hint{margin:10px 0 0;font-size:14px;color:var(--dk-line)}
body.present .hint{font-size:clamp(12px,1.3vw,19px)}

/* a small pill that names what a press is about to do */
.pill{display:inline-block;align-self:flex-start;flex:none;margin:0 0 10px;padding:3px 11px;
  border-radius:999px;background:#EAF6FC;color:#0B5FA5;font:700 12px/1.6 var(--sans);
  letter-spacing:.04em;text-transform:uppercase}
body.present .pill{font-size:clamp(11px,1.15vw,17px);padding:clamp(3px,.5vh,7px) clamp(10px,1.1vw,18px)}

/* the deck's own code slab, with a per-line highlight language shared by the
   reveal walker and the explainer */
.cx{margin:0;padding:14px 16px;background:var(--dk-card);border-radius:10px;
  font:14.5px/1.85 var(--mono);color:var(--dk-text);white-space:pre;overflow:hidden}
.cx .ln{display:block;padding:0 8px;margin:0 -8px;border-radius:5px;
  transition:background-color 200ms var(--ease-out),opacity 200ms var(--ease-out)}
.cx .no{display:inline-block;width:1.7em;color:#9AA1B0}
.cx b{color:var(--dk-red);font-weight:400}
.cx i{color:var(--dk-blue);font-style:normal}
.cx em{color:#22863A;font-style:normal}
.cx .ln.ran{background:#EAF6FC}
.cx .ln.now{background:#CFE9F8;box-shadow:inset 3px 0 0 var(--dk-blue)}
.cx .ln.dead{opacity:.26}
body.present .cx{font-size:clamp(12.5px,1.45vw,23px);line-height:1.85;
  padding:clamp(11px,1.5vh,22px) clamp(13px,1.4vw,24px)}

/* the sequence, drawn as boxes. A box that the loop has taken is GONE, not
   greyed: a grey ghost is the misconception this whole panel exists to fix. */
.seqbar{display:flex;flex-wrap:wrap;margin:0 0 12px;min-height:54px;align-items:center}
.seqbar .bx{flex:none;width:44px;height:48px;margin:0 8px 8px 0;border-radius:9px;
  border:2px solid var(--dk-cyan);background:#F3FBFE;color:var(--dk-text);
  display:flex;align-items:center;justify-content:center;
  font:700 21px/1 var(--mono);
  transition:opacity 220ms var(--ease-out),transform 220ms var(--ease-out)}
.seqbar .bx.gone{opacity:0;transform:scale(.72);pointer-events:none}
.seqbar .bx.at{border-color:var(--dk-blue);background:#DCF0FB;
  box-shadow:0 0 0 4px rgba(0,109,175,.14)}
.seqbar .empty{font:15px/1.4 var(--sans);color:var(--dk-red);font-weight:700;opacity:0;
  transition:opacity 220ms var(--ease-out)}
.seqbar.drained .empty{opacity:1}
body.present .seqbar .bx{width:clamp(38px,3.6vw,64px);height:clamp(42px,4vw,70px);
  font-size:clamp(18px,1.9vw,32px);margin-right:clamp(6px,.8vw,14px)}
body.present .seqbar{min-height:clamp(48px,5.5vh,84px)}
body.present .seqbar .empty{font-size:clamp(13px,1.35vw,20px)}

/* The variable box keeps its history. A value that is replaced is struck
   through and stays on screen beside its replacement, because "n went from 0 to
   1" is the thing being taught and a box that simply swaps its contents hides
   exactly that. The current value is the only one in full colour. */
.varbox{display:flex;align-items:flex-start;margin:0 0 12px}
.varbox .nm{flex:none;margin-right:10px;padding-top:7px;
  font:600 15px var(--sans);color:var(--dk-line)}
.varbox .vl{flex:1;min-width:0;display:flex;flex-wrap:wrap;align-items:center}
.varbox .vl .cv,.varbox .vl .ov{flex:none;margin:0 8px 4px 0;padding:6px 12px;
  border-radius:9px;font:700 20px/1.2 var(--mono);text-align:center;min-width:44px;
  transition:transform 200ms var(--ease-out),opacity 200ms var(--ease-out)}
.varbox .vl .cv{border:2px solid #C9B3EA;background:#F3EDFC;color:#5B3AA6}
.varbox .vl .ov{border:2px solid #E4E8EC;background:#F6F8F9;color:#98A2AC;
  text-decoration:line-through;text-decoration-thickness:2px}
.varbox .vl .ar{flex:none;margin:0 8px 4px 0;align-self:center;
  font:700 17px/1 var(--mono);color:#B6C0C8}
.varbox .vl.pop .cv:last-child{transform:scale(1.1)}
.varbox .vl.none{color:#9AA1B0;font:15px var(--sans);padding-top:9px}
body.present .varbox .nm{font-size:clamp(13px,1.4vw,21px)}
body.present .varbox .vl .cv,body.present .varbox .vl .ov{
  font-size:clamp(16px,1.7vw,28px);min-width:clamp(40px,4vw,68px);
  padding:clamp(5px,.8vh,11px) clamp(9px,1vw,18px)}
body.present .varbox .vl .ar{font-size:clamp(14px,1.45vw,24px)}
body.present .varbox .vl.none{font-size:clamp(13px,1.35vw,20px)}

/* a terminal that starts empty and fills only as the program prints */
.term{flex:1;min-height:92px;margin:0;padding:11px 14px;border-radius:10px;
  background:#101216;color:#EDEFF3;font:14.5px/1.7 var(--mono);white-space:pre;overflow:hidden}
.term:empty::before{content:'output';color:#5B6270}
body.present .term{font-size:clamp(13px,1.5vw,24px);min-height:clamp(84px,14vh,190px);
  padding:clamp(9px,1.3vh,18px) clamp(11px,1.2vw,22px)}

/* a caption that says, in one line, what the press just proved */
.cap{flex:none;margin:12px 0 0;padding:11px 14px;border-radius:10px;background:#F7FBFD;
  border-left:4px solid var(--dk-cyan);font:15px/1.5 var(--sans);color:var(--dk-text)}
.cap b{color:var(--dk-blue)}
.cap.warn{background:#FDF2E6;border-left-color:#E8A13A}
body.present .cap{font-size:clamp(13px,1.45vw,22px);padding:clamp(9px,1.3vh,18px) clamp(11px,1.2vw,22px)}

/* ===================== the hook: a Spotify playlist ===================== */
/* The phone is the app they already have. One moving group: `.hk-hl`, the row
   highlight, translated down the list. Every line of the story is on the card
   from press 1, ghosted until its turn, so the column is the same height on
   every press and the first line never rides up under the card heading. */
.hkwrap{display:flex;flex:1;min-height:0;align-items:stretch}
.hkwrap .phone{flex:none;display:flex;align-items:center;justify-content:center;
  width:31%;min-width:0}
.hkwrap .story{flex:1;min-width:0;display:flex;flex-direction:column;
  justify-content:center;padding-left:26px}
.hksvg{width:100%;height:auto;max-height:100%;display:block;
  filter:drop-shadow(0 12px 28px rgba(10,16,22,.26))}
body.present .hkwrap .story{padding-left:clamp(18px,2.6vw,52px)}

/* the row highlight: five songs at 70 user units each, and the long travel from
   song three to the last song is the single turn the hook is for */
.hk-hl{opacity:0;transition:transform 900ms var(--ease-in-out),opacity 260ms var(--ease-out)}
.an-2 .hk-hl,.an-3 .hk-hl,.an-4 .hk-hl,.an-5 .hk-hl,.an-6 .hk-hl{opacity:1}
.an-2 .hk-hl{transform:translateY(0)}
.an-3 .hk-hl{transform:translateY(140px)}
.an-4 .hk-hl{transform:translateY(280px)}
.an-5 .hk-hl,.an-6 .hk-hl{transform:translateY(350px)}

/* the tap ripple on the exact control that was pressed */
.hk-rip{opacity:0;transform-box:fill-box;transform-origin:50% 50%}
.an-2 .hk-rip{animation:hkrip 620ms var(--ease-out) 1}
@keyframes hkrip{0%{opacity:.5;transform:scale(.34)}100%{opacity:0;transform:scale(1)}}

/* the row that was added on beat 5 */
.hk-new{opacity:0;transform:translateY(14px);
  transition:opacity 320ms var(--ease-out),transform 320ms var(--ease-out)}
.an-5 .hk-new,.an-6 .hk-new{opacity:1;transform:none}

/* the now playing bar, and the stopped bar that replaces it */
.hk-np{opacity:0;transition:opacity 260ms var(--ease-out)}
.an-2 .hk-np,.an-3 .hk-np,.an-5 .hk-np,.an-6 .hk-np{opacity:1}
.hk-stop{opacity:0;transition:opacity 260ms var(--ease-out)}
.an-4 .hk-stop{opacity:1}

/* the equaliser inside the playing row. A stopped player does not show one:
   beat 4 is the beat where the list ran out, and the bars stayed up saying it
   was still playing. */
.hk-eq{transition:opacity 260ms var(--ease-out)}
.an-4 .hk-eq{opacity:0}
.hk-eq rect{transform-box:fill-box;transform-origin:50% 100%;
  animation:hkeq 900ms ease-in-out infinite;animation-play-state:paused}
.hk-eq rect:nth-child(2){animation-delay:-300ms}
.hk-eq rect:nth-child(3){animation-delay:-600ms}
.an-2 .hk-eq rect,.an-3 .hk-eq rect,.an-5 .hk-eq rect,
.an-6 .hk-eq rect{animation-play-state:running}
@keyframes hkeq{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1)}}

/* the caption column: every line present from press 1, the ones still to come
   ghosted, the ones already said stepped back */
.hkline{opacity:.13;transform:translateY(6px);margin:0 0 13px;
  font:16px/1.5 var(--sans);color:var(--dk-text);
  transition:opacity 320ms var(--ease-out),transform 320ms var(--ease-out)}
.hkline b{display:block;font-size:1.1em;font-weight:700;color:var(--dk-blue);
  margin-bottom:2px}
.an-1 .hkline:nth-child(-n+1),.an-2 .hkline:nth-child(-n+2),
.an-3 .hkline:nth-child(-n+3),.an-4 .hkline:nth-child(-n+4),
.an-5 .hkline:nth-child(-n+5),.an-6 .hkline:nth-child(-n+6){opacity:1;transform:none}
.an-3 .hkline:nth-child(-n+1),.an-4 .hkline:nth-child(-n+2),
.an-5 .hkline:nth-child(-n+3),.an-6 .hkline:nth-child(-n+4){opacity:.4}
.hkline:last-child b{color:#0B5FA5}
/* only the beat on now carries its sentence; the ones before it shrink to a
   headline, so the column never holds more than one sentence at a time */
.hkline .hks{display:none}
.an-1 .hkline:nth-child(1) .hks,.an-2 .hkline:nth-child(2) .hks,
.an-3 .hkline:nth-child(3) .hks,.an-4 .hkline:nth-child(4) .hks,
.an-5 .hkline:nth-child(5) .hks,.an-6 .hkline:nth-child(6) .hks{display:block}
.hkwrap .story{justify-content:safe center}

.an-6 .hkline:last-child{box-shadow:inset 4px 0 0 var(--dk-cyan);padding-left:14px;
  margin-left:-18px}
body.present .hkline{font-size:clamp(14px,1.5vw,23px);
  margin-bottom:clamp(10px,1.8vh,24px)}

/* ============== the card after it: their examples, then ours ============== */
.hkexwrap{display:flex;flex:1;min-height:0;flex-direction:column}
.hkex{display:flex;flex:1;min-height:0;flex-direction:column;justify-content:center}
.an-3 .hkex,.an-4 .hkex{display:none}
.hkask{flex:none;margin:0 0 14px;padding:12px 16px;border-radius:12px;
  background:#EAF6FC;border-left:5px solid var(--dk-cyan);
  font:17px/1.5 var(--sans);color:var(--dk-text)}
.hkask b{display:block;font-weight:700;color:var(--dk-blue);font-size:1.1em;
  margin-bottom:2px}
body.present .hkask{font-size:clamp(15px,1.6vw,25px);
  padding:clamp(10px,1.4vh,20px) clamp(13px,1.4vw,26px)}
.hkex-row{display:flex;flex:1;min-height:0;align-items:stretch;margin:0 -9px}
.hkex-box{flex:1;min-width:0;margin:0 9px;padding:12px 10px;border-radius:16px;
  border:2px dashed #C4D8E6;background:#FBFDFE;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  transition:opacity 320ms var(--ease-out),border-color 320ms var(--ease-out),
             background-color 320ms var(--ease-out)}
.an-2 .hkex-box{border-style:solid;border-color:#CFE6F5;background:#FFFFFF}
.hkm{display:block;width:100%;height:auto;max-height:78%;opacity:.2;
  transition:opacity 320ms var(--ease-out)}
.an-2 .hkm{opacity:1}
.hkex-foot{display:grid;align-items:center;justify-items:center;
  margin-top:10px;min-height:60px;width:100%}
.hkex-lbl,.hkex-yours{grid-column:1;grid-row:1;margin:0;text-align:center;
  transition:opacity 260ms var(--ease-out)}
.hkex-lbl{opacity:0;font:14px/1.45 var(--sans);color:var(--dk-text)}
.hkex-lbl b{display:block;font-weight:700;color:var(--dk-blue);font-size:1.12em;
  margin-bottom:3px}
.an-2 .hkex-lbl{opacity:1}
.hkex-yours{opacity:1;font:600 13px var(--sans);color:#9AA7B2;letter-spacing:.09em;
  text-transform:uppercase}
.an-2 .hkex-yours{opacity:0}
body.present .hkex-lbl{font-size:clamp(12px,1.25vw,20px)}
body.present .hkex-yours{font-size:clamp(11px,1.15vw,17px)}

/* each machine runs at its own period, so three loops never beat in unison */
.hkm-go{animation-play-state:paused}
.an-2 .hkm-go{animation-play-state:running}
.hkm-roll .hkm-go{animation:hkmroll 2600ms steps(1,end) infinite}
.hkm-story .hkm-go{animation:hkmstory 3000ms steps(1,end) infinite}
.hkm-scan .hkm-go{animation:hkmscan 3400ms steps(1,end) infinite}
@keyframes hkmroll{0%{transform:translateY(0)}20%{transform:translateY(34px)}
  40%{transform:translateY(68px)}60%{transform:translateY(102px)}
  80%{transform:translateY(136px)}100%{transform:translateY(0)}}
@keyframes hkmstory{0%{transform:translateX(0)}20%{transform:translateX(20px)}
  40%{transform:translateX(40px)}60%{transform:translateX(60px)}
  80%{transform:translateX(80px)}100%{transform:translateX(0)}}
@keyframes hkmscan{0%{transform:translateX(104px)}20%{transform:translateX(48px)}
  40%{transform:translateX(-8px)}60%{transform:translateX(-64px)}
  80%{transform:translateX(-120px)}100%{transform:translateX(104px)}}

/* presses 3 and 4: the three machines stand down and the shape takes the card */
.hkshape{display:none;flex:1;min-height:0;flex-direction:column;justify-content:center}
.an-3 .hkshape,.an-4 .hkshape{display:flex}
.hkshapesvg{display:block;width:100%;height:auto;max-height:88%;margin:0 auto}
.hkshape .cap{margin-top:12px}
.hk-never{opacity:0;transition:opacity 340ms var(--ease-out)}
.an-4 .hk-never{opacity:1}

@media (prefers-reduced-motion:reduce){
  .hk-hl,.hk-new,.hk-np,.hk-stop,.hkline,.hkm,.hkex-lbl,.hkex-yours,
  .hk-never{transition-duration:1ms}
  .hk-new,.hkline{transform:none}
  .hk-eq rect{animation:none}
  .hk-rip{animation:none}
  /* the three machines keep turning, slower. A still drawing of a machine is
     not the same finding as a machine doing one item at a time. */
  .hkm-roll .hkm-go{animation-duration:5200ms}
  .hkm-story .hkm-go{animation-duration:6000ms}
  .hkm-scan .hkm-go{animation-duration:6800ms}
}
@media print{
  .hkline,.hk-hl,.hk-new,.hk-np,.hk-never{opacity:1;transform:none}
}

/* ============================== the agenda ============================== */
/* The deck's own chevron ribbon, redrawn so it arrives one stop at a time. The
   dashed outline of all three is there from press 1: the room can see how far
   the session goes before it has been told what is in it. */
.agwrap{display:flex;flex:1;min-height:0;align-items:center;justify-content:center}
.agmap{display:block;width:100%;height:auto;max-height:100%}
.ag-s{opacity:0;transform:translateY(16px);transform-box:fill-box;
  transform-origin:50% 50%;
  transition:opacity 380ms var(--ease-out),transform 380ms var(--ease-out)}
.an-1 .ag-s1,.an-2 .ag-s1,.an-3 .ag-s1,.an-4 .ag-s1,
.an-2 .ag-s2,.an-3 .ag-s2,.an-4 .ag-s2,
.an-3 .ag-s3,.an-4 .ag-s3{opacity:1;transform:none}
.ag-last{opacity:0;transform:translateY(14px);transform-box:fill-box;
  transform-origin:50% 50%;
  transition:opacity 380ms var(--ease-out),transform 380ms var(--ease-out)}
.an-4 .ag-last{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){
  .ag-s,.ag-last{transition-duration:1ms;transform:none}
}
@media print{ .ag-s,.ag-last{opacity:1;transform:none} }

/* ============================== the reveal walker ============================== */
/* Nine presses, one operation each. It runs the worksheet task's own program and
   nothing else: no picker, no second example, no try-your-own box. */
.rw .seqbar .bx{transition:opacity 220ms var(--ease-out),transform 220ms var(--ease-out)}
.rvstep{opacity:0;transition:opacity 220ms var(--ease-out)}
.an-1 .rvstep-1,.an-2 .rvstep-2,.an-3 .rvstep-3,.an-4 .rvstep-4,.an-5 .rvstep-5,
.an-6 .rvstep-6,.an-7 .rvstep-7,.an-8 .rvstep-8,.an-9 .rvstep-9{opacity:1}
@media (prefers-reduced-motion:reduce){ .rvstep{transition-duration:1ms} }

/* ============================== the explainer ============================== */
.wpick{display:flex;flex-wrap:wrap;align-items:center;margin:0 0 10px}
.wpick .lb{flex:none;margin-right:10px;font:600 14px var(--sans);color:var(--dk-line)}
.wpick button{flex:none;margin:0 8px 6px 0;padding:7px 15px;border-radius:999px;
  border:2px solid #CFE6F5;background:#fff;color:var(--dk-text);
  font:600 15px/1.2 var(--mono);cursor:pointer;
  transition:transform 140ms var(--ease-out),background-color 160ms var(--ease-out),
             border-color 160ms var(--ease-out)}
.wpick button:active{transform:scale(.96)}
.wpick button[aria-pressed="true"]{background:var(--dk-blue);border-color:var(--dk-blue);color:#fff}
body.present .wpick .lb{font-size:clamp(12px,1.3vw,19px)}
body.present .wpick button{font-size:clamp(13px,1.45vw,21px);
  padding:clamp(6px,1vh,12px) clamp(12px,1.4vw,24px)}

.wctl{display:flex;flex-wrap:wrap;align-items:center;flex:none;margin:10px 0 0}
.wctl button{margin:0 9px 0 0;background:var(--ink);color:#fff;border:0;border-radius:9px;
  padding:9px 16px;font:650 14px var(--sans);cursor:pointer;
  transition:transform 140ms var(--ease-out)}
.wctl button.ghost{background:none;color:var(--ink);border:1px solid var(--rule)}
.wctl button:active{transform:scale(.97)}
.wctl button[disabled]{opacity:.38;cursor:default}
.wctl .st{margin-left:auto;font:13px var(--sans);color:var(--muted)}
body.present .wctl button{font-size:clamp(12px,1.4vw,21px);
  padding:clamp(7px,1.1vh,14px) clamp(13px,1.5vw,26px);margin-right:clamp(7px,1vw,16px)}
body.present .wctl .st{font-size:clamp(12px,1.3vw,19px)}

/* the explainer's terminal sizes to its own text. Left to flex:1 it swallowed
   the column and the panel opened as a wall of black. */
.xw .term,.rw .term{flex:none}

/* the key under the explainer's program: three states, and the third is the point */
.wkey{display:flex;flex-wrap:wrap;align-items:center;margin:8px 0 0;
  font:13px var(--sans);color:var(--dk-line)}
.wkey .sw{flex:none;width:16px;height:16px;margin:0 7px 0 14px;border-radius:4px;
  border:1px solid #D6E2EA}
.wkey .sw:first-child{margin-left:0}
.wkey .sw.ran{background:#EAF6FC}
.wkey .sw.now{background:#CFE9F8;box-shadow:inset 3px 0 0 var(--dk-blue)}
.wkey .sw.dead{background:#EDEFF2;opacity:.4}
body.present .wkey{font-size:clamp(11px,1.2vw,18px)}
body.present .wkey .sw{width:clamp(14px,1.4vw,22px);height:clamp(14px,1.4vw,22px)}

/* ============================== the range dial ==============================
   One control, one number line, and the excluded stop value drawn at its own
   tick with a cross through it. Every change hides the numbers again, so the
   room predicts before every reveal rather than only the first one. */
.rd{display:flex;flex-direction:column;flex:1;min-height:0;justify-content:safe center}
.rdtop{display:flex;flex-wrap:wrap;align-items:center;flex:none;margin:0 0 16px}
.rdexpr{flex:none;margin-right:26px;font:700 30px var(--mono);color:var(--dk-text)}
.rdexpr .k{color:var(--dk-blue)}
.rdexpr .v{display:inline-block;min-width:1.6em;text-align:center;border-radius:8px;
  background:#F3EDFC;color:#5B3AA6;padding:0 6px;
  transition:transform 180ms var(--ease-out)}
.rdexpr .v.bump{transform:scale(1.14)}
.rdsteps{flex:1;display:flex;flex-wrap:wrap;align-items:center}
.rdsteps .lb{flex:none;margin:0 8px 0 18px;font:650 14px var(--sans);color:var(--dk-line)}
.rdsteps .lb:first-child{margin-left:0}
.rdsteps button{flex:none;width:34px;height:34px;margin-right:6px;border-radius:9px;
  border:2px solid #DCE6EC;background:#fff;color:var(--dk-blue);
  font:700 19px/1 var(--sans);cursor:pointer;
  transition:transform 140ms var(--ease-out),background-color 160ms var(--ease-out)}
.rdsteps button:active{transform:scale(.93)}
.rdsteps button[disabled]{opacity:.35;cursor:default}
body.present .rdexpr{font-size:clamp(24px,2.7vw,46px)}
body.present .rdsteps .lb{font-size:clamp(12px,1.3vw,19px)}
body.present .rdsteps button{width:clamp(30px,3vw,50px);height:clamp(30px,3vw,50px);
  font-size:clamp(16px,1.7vw,28px)}

.rdline{display:flex;flex:none;align-items:flex-end;margin:0 0 14px}
.rdcell{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;
  margin-right:6px}
.rdcell:last-child{margin-right:0}
.rdcell .chip{width:100%;max-width:62px;aspect-ratio:1;border-radius:10px;
  display:flex;align-items:center;justify-content:center;
  border:2px solid #E4E8EC;background:#FAFBFC;color:#B6C0C8;
  font:700 20px/1 var(--mono);position:relative;
  opacity:.4;transform:scale(.95);
  transition:opacity 200ms var(--ease-out),transform 200ms var(--ease-out),
             background-color 200ms var(--ease-out),border-color 200ms var(--ease-out),
             color 200ms var(--ease-out)}
.rdcell.in .chip{opacity:1;transform:none;border-color:#C9B3EA;background:#F3EDFC;color:#5B3AA6}
.rdcell.stop .chip{opacity:1;transform:none;border-color:var(--dk-red);background:#FCEDEC;
  color:var(--dk-red)}
/* the cross is thin and half transparent so the number still reads through it.
   A solid cross hides the very value the room is being told is excluded. */
.rdcell.stop .chip::before,.rdcell.stop .chip::after{content:'';position:absolute;
  left:10%;right:10%;top:calc(50% - 1px);height:2px;border-radius:2px;
  background:var(--dk-red);opacity:.5}
.rdcell.stop .chip::before{transform:rotate(45deg)}
.rdcell.stop .chip::after{transform:rotate(-45deg)}
.rdcell .tag{margin-top:6px;font:650 11px var(--sans);color:transparent;white-space:nowrap}
/* an untagged cell's tag is EMPTY, not invisible, so it collapsed to zero and
   the two cells that do carry a tag sat 21px higher than the rest of the line */
.rdcell .tag:empty::before{content:"x";visibility:hidden}
.rdcell.stop .tag{color:var(--dk-red)}
.rdcell.first .tag{color:var(--dk-blue)}
body.present .rdcell .chip{font-size:clamp(20px,2.3vw,40px);max-width:clamp(52px,5.4vw,104px)}
/* the dial is three bands with a lot of air between them in a 16:9 card, so the
   air is shared out rather than pooled above and below the middle band */
body.present .rd{justify-content:space-evenly}
body.present .rdline{margin-bottom:0}
body.present .rdcell .tag{font-size:clamp(10px,1.1vw,16px)}

.rdsum{flex:none;margin:0;font:17px var(--sans);color:var(--dk-text);
  opacity:0;transition:opacity 220ms var(--ease-out)}
.rdsum.out{opacity:1}
.rdsum b{font-family:var(--mono);color:var(--dk-blue)}
body.present .rdsum{font-size:clamp(14px,1.55vw,24px)}

/* ============================== the missing row ==============================
   Two programs that differ by one character, running side by side on the same
   n. The row the left one never prints is drawn as a dashed empty outline, so
   the mistake is a hole the room can point at rather than a sentence. */
.mr2{display:flex;flex:1;min-height:0;margin:0}
.mr2>div{flex:1 1 50%;min-width:0;min-height:0;display:flex;flex-direction:column;
  padding-right:20px}
.mr2>div:last-child{padding-right:0}
body.present .mr2>div{padding-right:clamp(14px,1.8vw,34px)}
.mrh{flex:none;margin:0 0 8px;font:700 15px var(--sans);color:var(--dk-blue)}
.mrh.bad{color:var(--dk-red)}
body.present .mrh{font-size:clamp(13px,1.45vw,22px)}
.mrout{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:flex-start;
  margin:10px 0 0;padding:12px 14px;border-radius:10px;background:#101216}
.mrrow{flex:none;margin:0 0 6px;font:700 19px/1.25 var(--mono);color:#EDEFF3;
  opacity:0;transform:translateY(-6px);
  transition:opacity 220ms var(--ease-out),transform 220ms var(--ease-out)}
.mrrow.out{opacity:1;transform:none}
.mrrow.ghost{color:#8A5A5A;border:2px dashed #C7454E;border-radius:7px;
  padding:1px 8px;margin-left:-8px;opacity:0}
.mrrow.ghost.out{opacity:1}
.mrrow.ghost span{color:#C7454E;font:650 13px var(--sans);margin-left:10px}
.mrcount{flex:none;margin:10px 0 0;font:700 17px var(--sans);color:var(--dk-text);
  opacity:0;transition:opacity 220ms var(--ease-out)}
.mrcount.out{opacity:1}
.mrcount.bad{color:var(--dk-red)}
body.present .mrrow{font-size:clamp(16px,1.75vw,30px)}
body.present .mrcount{font-size:clamp(14px,1.55vw,24px)}
body.present .mrrow.ghost span{font-size:clamp(11px,1.2vw,18px)}
@media (prefers-reduced-motion:reduce){
  .mrrow,.rdcell .chip,.rdsum,.mrcount{transition-duration:1ms}
  .mrrow{transform:none}
}

/* ============================== the scored quiz ============================== */
.qz{display:flex;flex:1;min-height:0}
.qz>div{min-width:0;min-height:0;display:flex;flex-direction:column}
.qz>.qc{flex:1 1 50%;padding-right:22px}
.qz>.qa{flex:1 1 50%}
body.present .qz>.qc{padding-right:clamp(16px,2vw,40px)}

/* ============================== the picture card ============================== */
.bigpic{display:flex;flex:1;min-height:0;align-items:center;justify-content:center}
.bigpic img{display:block;width:100%;height:auto;max-height:100%;object-fit:contain;
  border-radius:12px}

/* ============================== takeaways map ============================== */
/* Every row carries a chip with the concept's own name on it, in its own
   colour. A student looking for range finds it in a second instead of reading
   five sentences to work out which one is about range. */
.tkmap .bx>rect:not(.tkchip){fill:#fff;stroke:#CFE6F5;stroke-width:2}
.tkmap .tk1>rect:not(.tkchip){fill:#EAF6FC;stroke:var(--dk-blue);stroke-width:3}
.tkmap .tkchip{stroke:none}
.tkmap .tkchiptx{font:700 17px var(--mono);fill:#FFFFFF}
.tkmap .tktx{font:600 21px var(--sans);fill:var(--dk-text)}
.tkmap .tk1 .tktx{font:700 22px var(--sans);fill:var(--dk-blue)}
.tkmap .tkline{fill:none;stroke:var(--dk-cyan);stroke-width:2.5}

/* worksheet task 1's instructions are read off a projector like everything
   else on the card, so they scale with it */
body.present .t1ask .gdo li{font-size:clamp(13px,1.45vw,22px);line-height:1.7}
body.present .t1ask .hint{font-size:clamp(12px,1.3vw,19px)}

/* ===================== the string, before it is a sequence =====================
   "Python" is one thing on the screen until a press turns it into the six
   characters the loop will walk. Both rows keep their height whichever is
   showing, so nothing below them jumps when the split happens. */
.strrow{display:flex;flex:none;align-items:center;margin:0 0 10px;min-height:56px;
  transition:opacity 300ms var(--ease-out),transform 300ms var(--ease-out)}
.strrow.gone{opacity:0;transform:scale(.94);pointer-events:none}
.strchip{flex:none;padding:7px 18px;border-radius:12px;border:2px solid #1F9D62;
  background:#EAF7EF;color:#12633F;font:700 26px/1.2 var(--mono)}
.strrow button{margin-left:14px;background:var(--ink);color:#fff;border:0;
  border-radius:9px;padding:9px 16px;font:650 14px var(--sans);cursor:pointer;
  transition:transform 140ms var(--ease-out)}
.strrow button:active{transform:scale(.97)}
body.present .strrow{min-height:clamp(52px,6.5vh,96px)}
body.present .strchip{font-size:clamp(20px,2.2vw,38px);
  padding:clamp(5px,.9vh,12px) clamp(14px,1.6vw,28px)}
body.present .strrow button{font-size:clamp(12px,1.4vw,21px);
  padding:clamp(7px,1.1vh,14px) clamp(13px,1.5vw,26px)}
/* the characters land one after another, left to right. The delay is set per
   box by the panel's own script, so a longer word still lands in order. */
.xw .seqbar .bx{opacity:0;transform:translateY(-10px) scale(.94)}
.xw .seqbar.split .bx{opacity:1;transform:none}
.xw .seqbar.split .bx.gone{opacity:0;transform:scale(.72)}
@media (prefers-reduced-motion:reduce){
  .strrow{transition-duration:1ms}
  .xw .seqbar .bx{transition-duration:1ms;transform:none}
}

/* ===================== the poll: A or B, and only then Run ===================== */
.mrab{flex:none;margin:0 0 7px;width:36px;height:36px;border-radius:11px;
  border:2px solid var(--dk-blue);background:#EAF6FC;color:var(--dk-blue);
  font:700 18px/32px var(--mono);text-align:center;
  transition:background-color 260ms var(--ease-out),border-color 260ms var(--ease-out),
             color 260ms var(--ease-out)}
.mrab.bad{border-color:#C7A0A4;background:#FBF0F1;color:#9A5B60}
.mr2.told .mrab.bad{border-color:#C7454E;background:#FCEDEC;color:#C7454E}
.mr2.told .mrab:not(.bad){border-color:#1F9D62;background:#E9F6ED;color:#12633F}
body.present .mrab{width:clamp(32px,3.2vw,52px);height:clamp(32px,3.2vw,52px);
  font-size:clamp(15px,1.6vw,26px);line-height:clamp(28px,2.9vw,48px)}
@media (prefers-reduced-motion:reduce){ .mrab{transition-duration:1ms} }
"""
