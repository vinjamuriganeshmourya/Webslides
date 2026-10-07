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
import hook as H

_KEPT = r"""
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


/* ============================== the agenda ============================== */
/* The deck's own chevron ribbon, redrawn so it arrives one stop at a time. The
   dashed outline of all three is there from press 1: the room can see how far
   the session goes before it has been told what is in it. */
.agwrap{display:flex;flex:1;min-height:0;align-items:center;justify-content:center}
.agmap{display:block;width:100%;height:auto;max-height:100%}
.ag-s{opacity:0;transform:translateY(16px);transform-box:fill-box;
  transform-origin:50% 50%;
  transition:opacity 380ms var(--ease-out),transform 380ms var(--ease-out)}
.an-1 .ag-s1,.an-2 .ag-s1,.an-3 .ag-s1,
.an-2 .ag-s2,.an-3 .ag-s2,
.an-3 .ag-s3{opacity:1;transform:none}
/* one real line from later in the session, under each stop. Without these the
   ribbon floats in the middle of a white card. */
.ag-chip{fill:#F4F7FA;stroke:#CFE0EC;stroke-width:2}
.ag-code{font:700 30px var(--mono);fill:var(--dk-blue)}
.ag-gives{font:600 20px var(--sans);fill:#6B7784}
@media (prefers-reduced-motion:reduce){
  .ag-s{transition-duration:1ms;transform:none}
}
@media print{ .ag-s{opacity:1;transform:none} }

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

/* ============================== the takeaway boards ==============================
   Not a map. The map had no examples on it, which on the one card a student
   photographs is the whole defect. These are the examples, laid out in HTML so
   a label cannot run out of a box: a box that grows cannot overflow, and that
   is a class of defect gone rather than a check added.

   One row or one cell per press, arriving with the same 16px lift every other
   staged reveal in this plan uses. */
.tkboard{display:flex;flex-direction:column;flex:1;min-height:0;
  justify-content:safe center}
/* the string every row below points at, with its index under each box */
.tstr{display:flex;flex-wrap:wrap;align-items:flex-end;flex:none;
  margin:0 0 14px}
.tstr .tnm{margin:0 12px 6px 0;font:600 15px var(--sans);color:#8B98A5}
.tstr .tbx{flex:none;width:40px;margin:0 6px 0 0;text-align:center}
.tstr .tbx b{display:block;padding:7px 0;border-radius:8px;
  border:2px solid #CFE0EC;background:#F4F7FA;
  font:700 20px/1 var(--mono);color:var(--dk-text)}
.tstr .tbx i{display:block;margin-top:3px;font:600 13px var(--mono);
  font-style:normal;color:#8B98A5}
body.present .tstr .tnm{font-size:clamp(13px,1.4vw,21px)}
body.present .tstr .tbx{width:clamp(36px,3.2vw,58px);
  margin-right:clamp(5px,.6vw,10px)}
body.present .tstr .tbx b{font-size:clamp(17px,1.8vw,30px);
  padding:clamp(6px,.9vh,12px) 0}
body.present .tstr .tbx i{font-size:clamp(11px,1.15vw,17px)}

/* one slice per row: what kind it is, the line, what you get, and why.

   The row IS its slot. It is a dashed shell from press 1 and what goes in it
   arrives on its press, so the card is never one row and a screenful of white
   while the instructor is still talking, and nothing is drawn twice to hold
   the space open. */
.trows{display:flex;flex-direction:column;flex:none}
.trow{flex:none;margin:0 0 11px;padding:11px 14px;border-radius:11px;
  border:2px dashed #E8EEF3;background:#FBFCFD;
  transition:background-color 300ms var(--ease-out),
             border-color 300ms var(--ease-out)}
.trow .tin,.tcell .tin{display:flex;align-items:center;opacity:0;
  transform:translateY(12px);
  transition:opacity 300ms var(--ease-out),transform 300ms var(--ease-out)}
.tchip{flex:none;margin-right:12px;padding:4px 11px;border-radius:8px;
  font:700 13px/1.35 var(--sans);color:#FFFFFF;white-space:nowrap}
.tex{flex:none;margin-right:12px;font:700 19px var(--mono);
  color:var(--dk-blue)}
.tarr{flex:none;margin-right:10px;font:700 18px var(--sans);color:#9AA1B0}
.tout{flex:none;margin-right:14px;padding:4px 11px;border-radius:8px;
  background:#E9F6ED;font:700 19px var(--mono);color:#12633F;
  white-space:nowrap}
.tout.tnone{background:#F4F7FA;color:#8B98A5;font-family:var(--sans);
  font-size:15px}
.twhy{flex:1;min-width:0;font:15px/1.45 var(--sans);color:var(--dk-text)}
body.present .trow{margin-bottom:clamp(9px,1.5vh,20px);
  padding:clamp(11px,1.6vh,22px) clamp(12px,1.3vw,22px)}
body.present .tchip{font-size:clamp(12px,1.3vw,20px);
  padding:clamp(4px,.7vh,9px) clamp(10px,1.1vw,18px)}
body.present .tex{font-size:clamp(17px,1.8vw,31px)}
body.present .tout{font-size:clamp(17px,1.8vw,31px)}
body.present .tout.tnone{font-size:clamp(13px,1.4vw,22px)}
body.present .twhy{font-size:clamp(13px,1.45vw,23px)}

/* the two rules, last, because no single row above can say either of them */
.trules{display:flex;flex:none;margin:8px 0 0}
.trule{flex:1 1 50%;margin-right:12px;padding:12px 15px;border-radius:11px;
  border:2px dashed #E8EEF3;border-left-width:4px;background:#FBFCFD;
  transition:background-color 300ms var(--ease-out),
             border-color 300ms var(--ease-out)}
.trule .tin{display:block;opacity:0;transform:translateY(12px);
  transition:opacity 300ms var(--ease-out),transform 300ms var(--ease-out)}
.trule:last-child{margin-right:0}
.trule b{display:block;margin:0 0 3px;font:700 17px var(--sans);
  color:#9A5B12}
.trule:last-child b{color:#0B5FA5}
.trule span{font:14.5px/1.45 var(--sans);color:var(--dk-text)}
body.present .trule{padding:clamp(11px,1.6vh,22px) clamp(13px,1.4vw,24px)}
body.present .trule b{font-size:clamp(15px,1.6vw,26px)}
body.present .trule span{font-size:clamp(13px,1.4vw,22px)}

/* the method board: one cell per method, three across, the summary last */
.tcells{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;flex:none}
.tcell{padding:13px 15px;border-radius:12px;border:2px dashed #E8EEF3;
  background:#FBFCFD;
  transition:background-color 300ms var(--ease-out),
             border-color 300ms var(--ease-out)}
.tcell .tin{flex-direction:column;align-items:flex-start}
/* the line comes in two pieces, the subject over the call, so the longest of
   them never has to wrap inside a token. `"htt` on one line and `ps://"` on
   the next is worse on a card they photograph than a smaller font would be. */
.tcell .tex{margin:9px 0 0;font-size:16px;white-space:normal}
.tcell .tex .tsub,.tcell .tex .tcall{display:block}
.tcell .tex .tsub{color:#22863A}
.tcell .tgot{display:flex;align-items:center;margin:9px 0 0}
.tcell .tkind{margin:9px 0 0;font:600 12.5px var(--sans);color:#8B98A5;
  letter-spacing:.03em;text-transform:uppercase}
.tsum .tsl{margin:0 0 7px;font:14.5px/1.45 var(--sans);color:var(--dk-text)}
.tsum .tsl b{font:700 20px var(--mono);color:var(--dk-blue)}
.tsum .tsl em{font-style:normal;font-weight:700;color:#12633F}
.tsum .tlast{margin-bottom:0;font-weight:700;color:#0B5FA5}
body.present .tcells{gap:clamp(11px,1.3vw,22px)}
body.present .tcell{padding:clamp(12px,1.7vh,24px) clamp(13px,1.4vw,24px)}
body.present .tcell .tex{font-size:clamp(14px,1.5vw,25px)}
body.present .tcell .tkind{font-size:clamp(11px,1.2vw,18px)}
body.present .tsum .tsl{font-size:clamp(13px,1.4vw,22px)}
body.present .tsum .tsl b{font-size:clamp(18px,1.9vw,32px)}
@media (prefers-reduced-motion:reduce){
  .trow,.tcell,.trule,.trow .tin,.tcell .tin,
  .trule .tin{transition-duration:1ms;transform:none}
}
@media print{
  .trow .tin,.tcell .tin,.trule .tin{opacity:1;transform:none}
  .trow,.tcell,.trule{border-style:solid;border-color:#E2E9EF;
    background:#fff}
}
"""

_NEW = r"""
/* ============ the hook: the sorry Anjali could not find =====================
   Six beats. The phone tells the story for three of them, then the message
   opens out into boxes and the last beat is the turn.

   One moving group, `.hkcomb`. Scaling it by two about the first mark sends
   the marks from boxes 0, 1, 2, 3, 4 to boxes 0, 2, 4, 6, 8, so the jump
   getting longer IS the argument and the characters never move. The origin is
   written into the transform, because transform-origin on an SVG group is not
   honoured everywhere. */
.hkwrap{display:flex;flex:1;min-height:0;align-items:center;justify-content:center}
.hkfig{display:block;width:100%;height:auto;max-height:100%}

/* the three phone screens: the fight, her search, and Tuesday */
.hkscr{opacity:0;transition:opacity 280ms var(--ease-out)}
.an-1 .hkscr1{opacity:1}
.an-2 .hkscr2{opacity:1}
.an-3 .hkscr3,.an-4 .hkscr3,.an-5 .hkscr3,.an-6 .hkscr3{opacity:1}
.hkcaret{opacity:0}
.an-2 .hkcaret{animation:hkblink 1.1s steps(1,end) infinite}
@keyframes hkblink{0%,49%{opacity:1}50%,100%{opacity:0}}

/* The story rail, and there are two of them: exactly one is ever up.

   While the phone is telling the story the story IS the right half, so it is
   set large and centred (`.hkrailbig`). Once the boxes arrive on press 4 the
   same three lines shrink to a strip of context above them (`.hkrailsm`).
   Nothing travels between the two: one group is hidden and the other shown.

   Both groups sit at different y values, so leaving both visible paints the
   large lines straight through the small ones. That is what it did, and it
   is why every rule below names which group it belongs to. */
.hkrail{opacity:0;transition:opacity 240ms var(--ease-out)}
.an-1 .hkrailbig,.an-2 .hkrailbig,.an-3 .hkrailbig{opacity:1}
.an-4 .hkrailsm,.an-5 .hkrailsm,.an-6 .hkrailsm{opacity:1}
/* the big rail: the story, while the phone is still the card */
.hkstoryB{font:400 30px var(--sans);fill:#39404B}
.hkaskB{font:700 32px var(--sans);fill:var(--dk-blue);opacity:0;
  transition:opacity 240ms var(--ease-out)}
.an-1 .hkaskB1,.an-2 .hkaskB2,.an-3 .hkaskB3{opacity:1}
/* the small rail: the same three lines, now context over the boxes */
.hkstory{font:400 21px var(--sans);fill:#6B7784}
.hkask{font:700 26px var(--sans);fill:var(--dk-blue);opacity:0;
  transition:opacity 240ms var(--ease-out)}
.an-4 .hkask4,.an-5 .hkask5,.an-6 .hkask6{opacity:1}
/* the boxes belong to the second half of the hook. Drawn as empty slots from
   press 1 would mean nine dashed rectangles beside a story about a fight. */
.hkstrip,.hkgh{opacity:0;transition:opacity 260ms var(--ease-out)}
.an-4 .hkstrip,.an-5 .hkstrip,.an-6 .hkstrip,
.an-4 .hkgh,.an-5 .hkgh,.an-6 .hkgh{opacity:1}

/* the slots are drawn empty from press 1 and filled on press 4 */
.hkbox{fill:#FBFCFD;stroke:#E2E9EF;stroke-width:2;stroke-dasharray:6 5;
  transition:fill 260ms var(--ease-out),stroke 260ms var(--ease-out)}
.an-4 .hkbox,.an-5 .hkbox,.an-6 .hkbox{
  fill:#F4F7FA;stroke:#CFE0EC;stroke-dasharray:none}
.hkch,.hkix{opacity:0;transition:opacity 320ms var(--ease-out),
  fill 260ms var(--ease-out)}
.an-4 .hkch,.an-5 .hkch,.an-6 .hkch,
.an-4 .hkix,.an-5 .hkix,.an-6 .hkix{opacity:1}
.hkch{font:700 36px var(--mono);fill:#2B3138}
.hkix{font:600 19px var(--mono);fill:#8B98A5}
/* a space you can see. Four of the nine boxes are spaces, and that is the
   whole answer to why the search found nothing. */
.hkcell.hksp .hkch{fill:#AEB8C2}
.an-4 .hkcell.hksp .hkbox,.an-5 .hkcell.hksp .hkbox,
.an-6 .hkcell.hksp .hkbox{fill:#FFFFFF;stroke:#E2E9EF}
/* the letters light up as the marks LAND on them, not while they are still
   travelling. Slowed down, the early highlight reads as the answer arriving
   before the argument does. */
.an-6 .hkcell.hkd .hkbox{fill:#DCF0FB;stroke:var(--dk-blue);stroke-width:3;
  transition-delay:640ms}
/* the delay belongs to the COLOUR only. `transition-delay` here delayed
   `opacity` with it, so jumping straight to the last press (Replay, or the
   presenter grid) left nine empty boxes on screen for two thirds of a
   second. */
.an-6 .hkcell.hkd .hkch{fill:var(--dk-blue);
  transition:opacity 320ms var(--ease-out),fill 260ms var(--ease-out) 640ms}

.hkghp{fill:none;stroke:#DDE5EC;stroke-width:2.5;stroke-dasharray:8 7;
  transition:opacity 260ms var(--ease-out)}
.an-5 .hkghp,.an-6 .hkghp{opacity:0}
.hkyou{font:600 21px var(--sans);fill:#6B7784}

.hkcomb{opacity:0;transform-box:view-box;transform-origin:0 0;
  transition:opacity 260ms var(--ease-out),
             transform 900ms var(--ease-in-out)}
.an-5 .hkcomb,.an-6 .hkcomb{opacity:1}
.an-6 .hkcomb{transform:translate(__SHIFT__px,0) scale(2,1)}
.hkmark{fill:var(--dk-blue)}
.hkarc{fill:none;stroke:var(--dk-blue);stroke-width:3;stroke-dasharray:7 6}
.hklbl{font:700 21px var(--sans);fill:var(--dk-blue);opacity:0;
  transition:opacity 260ms var(--ease-out)}
.an-5 .hklbl1{opacity:1}
.an-6 .hklbl2{opacity:1}

.hkres{opacity:0;transition:opacity 300ms var(--ease-out)}
.an-5 .hkres1{opacity:1}
.an-6 .hkres2{opacity:1}
.hkres>rect{fill:#FFFFFF;stroke:#CFE0EC;stroke-width:2.5}
.hkres2>rect{fill:#EAF6FC;stroke:var(--dk-blue);stroke-width:3}
.hkpt{font:700 32px var(--mono);fill:#2B3138}
.hkres2 .hkpt{fill:var(--dk-blue)}
.hkpn{font:600 16px var(--sans);fill:#8B98A5}

@media (prefers-reduced-motion:reduce){
  /* the colour changes stay, the travel goes. The finding lives in the end
     state, so the end state must still be reachable. */
  .hkcomb{transition-duration:1ms}
  .hkcaret{animation:none;opacity:1}
}
@media print{
  .hkch,.hkix,.hkcomb,.hklbl2,.hkres2,.hkscr3,.hkask6,
  .hkrailsm,.hkstrip,.hkgh{opacity:1}
  .hkcomb{transform:translate(__SHIFT__px,0) scale(2,1)}
}

/* ============ the two redrawn slicing slides, animated =====================
   Slide 12 and slide 17 were flat pictures of a finished slice. Here the
   characters actually leave the string: one group per character, translated
   out of its box and into the result, one press each. What comes out of the
   string is GONE from it, because a ghost left behind in the row is the
   misconception the whole panel exists to fix. */
.slwrap{display:flex;flex:1;min-height:0;align-items:center;justify-content:center}
.slfig{display:block;width:100%;height:auto;max-height:100%}
.slbox{fill:#F4F7FA;stroke:#CFE0EC;stroke-width:2;
  transition:fill 260ms var(--ease-out),stroke 260ms var(--ease-out)}
.slch{font:700 40px var(--mono);fill:#2B3138;
  transition:fill 260ms var(--ease-out)}
.slix{font:600 21px var(--mono);fill:#8B98A5}
/* the window that says which run we asked for */
.slwin{fill:none;stroke:var(--dk-blue);stroke-width:3;stroke-dasharray:9 6;
  opacity:0;transition:opacity 300ms var(--ease-out)}
/* the box that exists and is never reached. It arrives WITH the line that
   asks for it: eight boxes under a seven character string, before anybody has
   asked for a stop index, is a counting question nobody needed. */
.slghost{opacity:0;transition:opacity 300ms var(--ease-out)}
.slghost .slbox{fill:#FFFFFF;stroke-dasharray:7 6;stroke:#E2E9EF}
.slghost .slch{fill:#C6CFD6}
/* the expression, directly under the string and the biggest text on the card.
   This is the one line the card exists to teach, so it is set at the size the
   back row can read and it is never at the bottom edge. */
.slexpr{font:700 44px var(--mono);fill:var(--dk-blue);opacity:0;
  transition:opacity 260ms var(--ease-out)}
.slarrow{font:700 34px var(--sans);fill:#8B98A5}
.slgot{font:700 44px var(--mono);fill:#1F9D62}
.slgotg{opacity:0;transition:opacity 260ms var(--ease-out)}
/* a space is a character too, and the room has to be able to see it */
.slsp .slch{fill:#AEB8C2}
.slsp .slbox{fill:#FFFFFF}
.slstop{font:700 18px var(--sans);fill:#C7454E;opacity:0;
  transition:opacity 300ms var(--ease-out)}
/* one character, lifted out of its box into the result pill */
.sllift{transform-box:view-box;transform-origin:0 0;
  transition:transform 620ms var(--ease-in-out),opacity 260ms var(--ease-out)}
.slout{fill:#EAF6FC;stroke:var(--dk-blue);stroke-width:3}
.slout-gh{fill:none;stroke:#DDE5EC;stroke-width:2.5;stroke-dasharray:8 7}
.slcap text{font:600 24px var(--sans);fill:var(--dk-text)}
.slcap{opacity:0;transition:opacity 260ms var(--ease-out)}
.slmark{fill:var(--dk-blue);opacity:0;
  transition:opacity 220ms var(--ease-out),transform 420ms var(--ease-in-out);
  transform-box:view-box;transform-origin:0 0}
@media (prefers-reduced-motion:reduce){
  .sllift,.slmark{transition-duration:1ms}
}
@media print{ .sllift,.slmark,.slexpr,.slgotg,.slcap{opacity:1} }

/* ============ the method card: the line, then what it does =================
   One card per method. Press 1 is the code and an empty output box, and the
   room says what it prints before anything runs. Press 2 runs it, one
   character at a time where the character is the mechanism. Press 3 is the
   shape and the one line of what it does, which is the deck's own wording. */
.mth .mthbody{display:flex;flex-direction:column;flex:1;min-height:0;
  justify-content:safe center}
.mthtop{display:flex;flex:none;align-items:flex-start;margin:0 0 14px}
.mthtop>div:first-child{flex:1 1 56%;min-width:0;padding-right:22px}
.mthtop>div:last-child{flex:1 1 44%;min-width:0}
body.present .mthtop>div:first-child{padding-right:clamp(16px,2vw,40px)}
.mthask{margin:0 0 10px;font:600 17px var(--sans);color:var(--dk-blue)}
body.present .mthask{font-size:clamp(15px,1.6vw,26px)}
/* the characters the method is looking at, ticked or crossed one at a time */
.mthrow{display:flex;flex-wrap:wrap;align-items:flex-start;margin:0 0 12px;
  min-height:70px}
.mthrow .ch{position:relative;flex:none;width:52px;height:56px;
  margin:0 9px 8px 0;border-radius:9px;border:2px solid #CFE0EC;
  background:#F4F7FA;display:flex;align-items:center;justify-content:center;
  font:700 22px/1 var(--mono);color:var(--dk-text);
  transition:border-color 220ms var(--ease-out),
             background-color 220ms var(--ease-out),
             opacity 220ms var(--ease-out),transform 220ms var(--ease-out)}
.mthrow .ch i{position:absolute;left:50%;top:100%;transform:translateX(-50%);
  margin-top:4px;font:700 15px/1 var(--sans);font-style:normal;opacity:0;
  transition:opacity 220ms var(--ease-out)}
.mthrow .ch.sp{color:#AEB8C2;background:#FFFFFF}
.mth.go .ch.yes{border-color:#1F9D62;background:#E9F6ED}
.mth.go .ch.no{border-color:#C7454E;background:#FBF1F1}
.mth.go .ch.off{opacity:0;transform:translateY(16px) scale(.8)}
.mth.go .ch i{opacity:1}
.mthrow .ch.yes i{color:#12633F}
.mthrow .ch.no i{color:#C7454E}
body.present .mthrow .ch{width:clamp(46px,3.8vw,72px);
  height:clamp(50px,4.4vw,80px);font-size:clamp(19px,2vw,34px)}
body.present .mthrow{min-height:clamp(66px,8vh,116px)}
body.present .mthrow .ch i{font-size:clamp(13px,1.35vw,22px)}
/* the shape and the one line, on press 3 */
.mthdef{flex:none;margin:0;padding:14px 18px;border-radius:12px;
  background:#EAF6FC;border-left:4px solid var(--dk-blue)}
.mthdef .shape{display:block;margin:0 0 6px;font:700 24px var(--mono);
  color:var(--dk-blue)}
.mthdef p{margin:0;font:16px/1.55 var(--sans);color:var(--dk-text)}
body.present .mthdef .shape{font-size:clamp(20px,2.2vw,38px)}
body.present .mthdef p{font-size:clamp(14px,1.5vw,24px)}
/* replace: one chip per word, and only the two it touches carry a second
   reading. The three it does not touch never move, which is the claim. */
.mthwords{display:flex;flex-wrap:wrap;align-items:center;margin:0 0 12px;
  min-height:62px}
.mthwords .wd{position:relative;flex:none;margin:0 10px 8px 0;
  padding:9px 14px;border-radius:10px;border:2px solid #E2E9EF;
  background:#FFFFFF;font:600 21px/1.2 var(--mono);color:var(--dk-text);
  transition:border-color 240ms var(--ease-out),
             background-color 240ms var(--ease-out)}
/* the two readings of a word replace touches. Neither is struck through: a
   strikethrough reads as GONE, and what happened here is that the word was
   rewritten. */
.mthwords .wd .was,.mthwords .wd .now{display:block;
  transition:opacity 240ms var(--ease-out),transform 240ms var(--ease-out)}
.mthwords .wd .now{position:absolute;left:0;top:0;width:100%;height:100%;
  display:flex;align-items:center;justify-content:center;opacity:0;
  transform:translateY(10px);color:#12633F;font-weight:700}
body.present .mthwords .wd{font-size:clamp(18px,1.9vw,32px);
  padding:clamp(8px,1.1vh,15px) clamp(11px,1.2vw,21px)}
body.present .mthwords{min-height:clamp(58px,7vh,104px)}

/* upper and lower: one box, three readings, one of them showing */
.mthrow .ch.flip{position:relative}
.mthrow .ch.flip>span{position:absolute;left:0;top:0;width:100%;height:100%;
  display:flex;align-items:center;justify-content:center;opacity:0;
  transition:opacity 240ms var(--ease-out)}

/* startswith: the front of the string, framed, and what it is compared with.
   The tail is dimmed because the method never reads it. */
.stw{flex:none;margin:0 0 12px}
.stwline{display:flex;flex-wrap:wrap;align-items:center;
  font:700 22px/1.3 var(--mono)}
.stwhead{padding:6px 10px;border-radius:9px;border:2px solid #CFE0EC;
  background:#F4F7FA;color:var(--dk-text);
  transition:border-color 240ms var(--ease-out),
             background-color 240ms var(--ease-out),
             color 240ms var(--ease-out)}
.stwtail{padding:6px 2px;color:#9AA1B0}
.stwcmp{display:flex;flex-wrap:wrap;align-items:center;margin:10px 0 0;
  opacity:0;transition:opacity 260ms var(--ease-out)}
.stwcmp .stwlb{margin-right:10px;font:600 14px var(--sans);color:#8B98A5}
.stwcmp .stwpre{margin-right:12px;font:700 20px var(--mono);color:#22863A}
.stwcmp .stwv{padding:4px 12px;border-radius:999px;background:#E9F6ED;
  font:700 13px var(--sans);color:#12633F;letter-spacing:.03em;
  text-transform:uppercase}
body.present .stwline{font-size:clamp(17px,1.8vw,30px)}
body.present .stwcmp .stwlb{font-size:clamp(12px,1.3vw,19px)}
body.present .stwcmp .stwpre{font-size:clamp(16px,1.7vw,28px)}
body.present .stwcmp .stwv{font-size:clamp(11px,1.2vw,17px)}
@media (prefers-reduced-motion:reduce){
  .mthwords .wd,.mthwords .wd .was,.mthwords .wd .now,.stwhead,.stwcmp,
  .mthrow .ch.flip>span{transition-duration:1ms}
}
.mthstep{display:none;flex-direction:column;flex:1;min-height:0}
.mth.an-1 .ms1,.mth.an-2 .ms2,.mth.an-3 .ms3,.mth.an-4 .ms4{display:flex}
@media (prefers-reduced-motion:reduce){
  .mthrow .ch{transition-duration:1ms}
}


/* ============ why a string method at all: the phone and the two programs ===
   The left half is one phone, drawn once, reacting to the press. The right
   half is one block per press: the question, the long program, what it cost,
   and then the two lines that replace it. Nothing is redrawn between beats. */
.wyp2>div:first-child{flex:1 1 40%;padding-right:26px}
.wyp2>div:last-child{flex:1 1 60%}
.wyleft{display:flex;align-items:center;justify-content:center;min-height:0}
.wyfig{display:block;width:100%;height:auto;max-height:100%}
.wyright{display:flex;flex-direction:column;min-height:0;
  justify-content:safe center}
.wystep{display:none;flex-direction:column;flex:1;min-height:0;
  justify-content:safe center}
/* the PIN boxes. Empty on press 1, and the character that is not a digit
   wears the red on every press after it. */
.wypb{fill:#F4F7FA;stroke:#CFE0EC;stroke-width:1.8;
  transition:fill 240ms var(--ease-out),stroke 240ms var(--ease-out)}
.wypc{font:700 26px var(--mono);fill:#111B21;opacity:0;
  transition:opacity 260ms var(--ease-out),fill 240ms var(--ease-out)}
.wyerr{opacity:0;transition:opacity 260ms var(--ease-out)}
.wyask{opacity:1;transition:opacity 200ms var(--ease-out)}
.wykey{fill:#FFFFFF;stroke:#E2E9EF;stroke-width:1.4}
.wykt{font:600 17px var(--sans);fill:#111B21}
/* the two things the app has to be sure of, one ticked and one still open.
   Press 1 without it is two sentences and an empty half card. */
.wyreq{display:flex;flex-direction:column;flex:none;margin:4px 0 14px}
.wyr{display:flex;align-items:flex-start;flex:none;margin:0 0 9px;
  padding:11px 14px;border-radius:11px;border:1px solid #E2E9EF;
  background:#FFFFFF}
.wyr:last-child{margin-bottom:0}
.wyr .wyrm{flex:none;width:26px;height:26px;margin-right:12px;
  border-radius:50%;display:flex;align-items:center;justify-content:center;
  font:700 14px/1 var(--sans);color:#FFFFFF}
.wyr.done{background:#F4FAF6;border-color:#BFE3CC}
.wyr.done .wyrm{background:#1F9D62}
.wyr.todo{background:#FFFBF2;border-color:#E8D4AE}
.wyr.todo .wyrm{background:#E8A13A}
.wyr b{display:block;font:700 16px var(--sans);color:var(--dk-text)}
.wyr span{font:14.5px/1.45 var(--sans);color:#6B7784}
body.present .wyr{padding:clamp(10px,1.4vh,19px) clamp(12px,1.3vw,22px)}
body.present .wyr .wyrm{width:clamp(24px,2.2vw,38px);
  height:clamp(24px,2.2vw,38px);font-size:clamp(13px,1.3vw,21px)}
body.present .wyr b{font-size:clamp(14px,1.5vw,25px)}
body.present .wyr span{font-size:clamp(12.5px,1.35vw,21px)}

/* the counters, so the cost of the long way is a number and not an adjective */
.wychips{display:flex;flex-wrap:wrap;flex:none;margin:4px 0 12px}
.wychip{flex:none;margin:0 10px 8px 0;padding:8px 14px;border-radius:10px;
  background:#EAF6FC;font:600 14px/1.2 var(--sans);color:#0B5FA5}
.wychip b{display:block;font:700 26px/1.15 var(--mono);color:var(--dk-blue)}
body.present .wychip{font-size:clamp(12px,1.3vw,19px);
  padding:clamp(7px,1vh,13px) clamp(11px,1.2vw,20px)}
body.present .wychip b{font-size:clamp(21px,2.3vw,40px)}
/* the name, last, and only after the room has watched the long way */
.wyname{flex:none;margin:12px 0 0;padding:14px 18px;border-radius:12px;
  background:#EAF6FC;border-left:4px solid var(--dk-blue)}
.wyname .shape{display:block;margin:0 0 6px;font:700 24px var(--sans);
  color:var(--dk-blue)}
.wyname p{margin:0;font:16px/1.55 var(--sans);color:var(--dk-text)}
body.present .wyname .shape{font-size:clamp(20px,2.2vw,38px)}
body.present .wyname p{font-size:clamp(14px,1.5vw,24px)}
@media (prefers-reduced-motion:reduce){
  .wypb,.wypc,.wyerr,.wyask{transition-duration:1ms}
}
@media print{ .wypc,.wyerr{opacity:1} }

/* ============ the editor card ==============================================
   Code on a slide is a white editor card with a file tab, line numbers and
   coloured keywords. A black slab is not what any of them has written code in,
   and it is the one thing on a card that cannot be read from the back. */
.edcard{flex:none;margin:0 0 12px;border-radius:12px;overflow:hidden;
  border:1px solid #DDE5EC;background:#FFFFFF;
  box-shadow:0 1px 2px rgba(16,33,48,.06)}
.edtab{display:flex;align-items:center;padding:8px 14px;
  background:#F4F7FA;border-bottom:1px solid #E2E9EF;
  font:600 12.5px var(--sans);color:#6B7784}
.edtab .eddot{flex:none;width:9px;height:9px;margin-right:9px;
  border-radius:50%;background:#3FB5E5}
.edcard .cx{background:#FFFFFF;border-radius:0}
.edcard .cx .ln.hot{background:#FFF6E2;box-shadow:inset 3px 0 0 #E8A13A}
body.present .edtab{font-size:clamp(11px,1.2vw,18px);
  padding:clamp(7px,1vh,12px) clamp(11px,1.2vw,20px)}
body.present .edtab .eddot{width:clamp(8px,.8vw,13px);
  height:clamp(8px,.8vw,13px)}

/* ======================= worksheet task 1: three slices, written down first */
.qlist{margin:0 0 12px;padding:0;list-style:none}
.qlist li{margin:0 0 9px;padding:9px 14px;border-radius:9px;background:#F4F7FA;
  border-left:4px solid var(--dk-cyan)}
.qlist code{font:700 19px var(--mono);color:var(--dk-blue)}
body.present .qlist code{font-size:clamp(17px,1.8vw,30px)}
body.present .qlist li{padding:clamp(8px,1.2vh,16px) clamp(11px,1.2vw,22px)}

/* one box per character with its index under it, for the cards that ask for a
   slice. The index has to be in front of them, not counted on fingers. */
.seqbar.ixb{align-items:flex-start}
.seqbar.ixb .bx{flex-direction:column;height:58px;justify-content:center;
  border-color:#CFE0EC;background:#F4F7FA}
.seqbar.ixb .bx b{font:700 20px/1 var(--mono);color:var(--dk-text)}
.seqbar.ixb .bx i{margin-top:3px;font:600 12px/1 var(--mono);font-style:normal;
  color:#8B98A5}
body.present .seqbar.ixb .bx{height:clamp(52px,5.2vw,86px)}
body.present .seqbar.ixb .bx b{font-size:clamp(17px,1.8vw,30px)}
body.present .seqbar.ixb .bx i{font-size:clamp(11px,1.1vw,18px)}

/* ====================== the slice machine: predict, then run ================
   Run is locked until an option is picked. That gate is the activity, and it
   is the only thing on this card that cannot be skipped. */
.mach{display:flex;flex-direction:column;flex:1;min-height:0;
  justify-content:safe center}
.mtop{display:flex;align-items:baseline;flex:none;margin:0 0 6px}
.mvar{font:600 20px var(--mono);color:var(--dk-text)}
.mvar em{color:#22863A;font-style:normal}
.mlv{margin-left:auto;font:600 14px var(--sans);color:var(--dk-line)}
.mrail{display:block;width:100%;height:auto;flex:none;max-height:30vh}
.mcell rect{fill:#F4F7FA;stroke:#CFE0EC;stroke-width:2;
  transition:fill 200ms var(--ease-out),stroke 200ms var(--ease-out)}
.mcell .mch{font:700 34px var(--mono);fill:#2B3138;
  transition:fill 200ms var(--ease-out)}
.mcell .mix{font:600 20px var(--mono);fill:#8B98A5}
.mcell.hit rect{fill:#DCF0FB;stroke:var(--dk-blue);stroke-width:3}
.mcell.hit .mch{fill:var(--dk-blue)}
.mask{flex:none;margin:6px 0 10px;font:17px var(--sans);color:var(--dk-text)}
.mask b{font:700 19px var(--mono);color:var(--dk-blue)}
.mopts{display:flex;flex-wrap:wrap;flex:none;margin:0}
.mopt{flex:1 1 44%;display:flex;align-items:center;margin:0 10px 10px 0;
  padding:9px 13px;border:2px solid #D8E2EA;border-radius:11px;background:#fff;
  cursor:pointer;text-align:left;
  transition:border-color 160ms var(--ease-out),
             background-color 160ms var(--ease-out),
             opacity 160ms var(--ease-out),transform 140ms var(--ease-out)}
.mopt:active{transform:scale(.97)}
.mopt .ml{flex:none;margin-right:11px;width:26px;height:26px;border-radius:8px;
  background:#EEF3F7;color:#5A6A75;font:700 14px/26px var(--mono);
  text-align:center}
.mopt .mv{font:700 18px var(--mono);color:var(--dk-text)}
.mopt.picked{border-color:var(--dk-blue);background:#EAF6FC}
.mopt.right{border-color:#1F9D62;background:#E9F6ED}
.mopt.right .ml{background:#1F9D62;color:#fff}
.mopt.wrong{opacity:.5}
.mopt[disabled]{cursor:default}
body.present .mvar{font-size:clamp(17px,1.8vw,30px)}
body.present .mlv{font-size:clamp(12px,1.3vw,19px)}
body.present .mask{font-size:clamp(15px,1.6vw,26px)}
body.present .mask b{font-size:clamp(16px,1.7vw,28px)}
body.present .mopt .mv{font-size:clamp(16px,1.7vw,28px)}
body.present .mopt .ml{width:clamp(24px,2.4vw,40px);height:clamp(24px,2.4vw,40px);
  line-height:clamp(24px,2.4vw,40px);font-size:clamp(12px,1.3vw,20px)}
body.present .mopt{padding:clamp(8px,1.2vh,16px) clamp(11px,1.2vw,22px)}
@media (prefers-reduced-motion:reduce){
  .mcell rect,.mcell .mch,.mopt{transition-duration:1ms}
}

/* ============== worksheet task 3: the task, then one operation per press ====
   The two halves of the right column are laid out as columns in their own
   right; without this they inherit a flex ROW from .p2 > div and the timer
   sits beside the instructions. */
.t3ask,.t3chk{flex-direction:column;flex:1;min-height:0}
/* the output box stops growing, so both columns centre in the card */
.tw .term{flex:none;min-height:104px;max-height:24vh}
body.present .tw .term{min-height:clamp(96px,15vh,200px)}
.tw .seqbar .bx{transition:opacity 220ms var(--ease-out),
                           transform 220ms var(--ease-out)}
/* a space you can see. The guide names the grey dot once, at line 1. */
.seqbar .bx .sp,.varbox .vl .sp{color:#AEB8C2}

/* ===================== the explainer: where does strip stop? ================
   Three states and the third is the point. A character that is in the set and
   sits in the middle is never reached, goes `never`, and STAYS that way after
   the run ends. */
.seqbar.strip{min-height:96px;align-items:flex-start}
/* wide enough that a stop tag and a never tag on neighbouring boxes do not
   run into each other */
/* nine boxes have to fit the column on one line, or the tag under the last
   one ends up under the first. Wide enough for a stop tag, narrow enough
   that 9 of them plus their margins clear 48% of the card. */
.seqbar.strip .bx{position:relative;overflow:visible;width:50px}
body.present .seqbar.strip .bx{width:clamp(44px,3.4vw,60px);
  margin-right:clamp(5px,.6vw,11px)}
.seqbar.strip .bx i{position:absolute;left:50%;top:100%;
  transform:translateX(-50%);margin-top:5px;white-space:nowrap;
  font:600 11px/1 var(--sans);font-style:normal;color:#C7454E}
.seqbar.strip .bx i.ok{color:#12633F}
.seqbar.strip .bx.never{opacity:.34;border-style:dashed;border-color:#C7454E;
  background:#FBF1F1}
.seqbar.strip .bx.stop{border-color:#1F9D62;background:#E9F6ED}
/* the output box stops growing, so the right column centres in the card the
   way the left one does instead of towering over it */
.sw .term{flex:none;min-height:104px;max-height:24vh}
body.present .sw .term{min-height:clamp(96px,15vh,200px)}
body.present .seqbar.strip{min-height:clamp(88px,11vh,150px)}
body.present .seqbar.strip .bx i{font-size:clamp(10px,1.05vw,17px)}

/* the key under the program. It is deliberately not `.wkey .sw`, because the
   explainer's own wrapper carries the class `sw` and a two-purpose class name
   is how a legend ends up greyed out by the walker that runs beside it. */
.wkey .sw-k{flex:none;width:16px;height:16px;margin:0 7px 0 14px;
  border-radius:4px;border:1px solid #D6E2EA}
.wkey .sw-k:first-child{margin-left:0}
.wkey .sw-k.ran{background:#EAF6FC}
.wkey .sw-k.now{background:#CFE9F8;box-shadow:inset 3px 0 0 var(--dk-blue)}
.wkey .sw-k.dead{background:#FBF1F1;border-style:dashed;border-color:#C7454E;
  opacity:.5}
body.present .wkey .sw-k{width:clamp(14px,1.4vw,22px);
  height:clamp(14px,1.4vw,22px)}

@media (prefers-reduced-motion:reduce){
  /* the colour and the marks stay, because the finding lives in the end
     state. Only the travel goes. */
  .seqbar.strip .bx,.tw .seqbar .bx{transition-duration:1ms}
  .hkcell .hkbox,.hkch,.hkix,.hkres,.hkcap,.hklbl{transition-duration:1ms}
  .ewstep,.ewgh .ewline{transition-duration:1ms}
}
@media print{
  .seqbar.strip .bx.never,.seqbar.strip .bx.stop{opacity:1}
}

/* ======================= you write the other end =========================== */
.ew .p2>div:first-child{flex:1 1 50%}
.ew .p2>div:last-child{flex:1 1 50%}
/* two presses on the shared controller. .stage-step belongs to the OTHER
   stepper, so a card that mixes the two shows press 1 for ever. */
.ew .ewstep{display:none;flex:1;min-height:0;flex-direction:column;
  justify-content:safe center}
.ew.an-1 .ew1,.ew.an-2 .ew2{display:flex}
/* the slots the room is about to fill, drawn empty from press 1 */
.ewgh{flex:none;margin:0 0 14px;padding:14px 16px;border-radius:10px;
  border:2px dashed #D8E2EA;background:#FBFCFD}
.ewgh .lb{display:block;margin:0 0 10px;font:600 13px var(--sans);
  color:#8B98A5}
.ewgh .ewline{display:block;height:14px;margin:0 0 11px;border-radius:7px;
  background:#EEF2F6}
.ewgh .ewline:last-child{margin-bottom:0;width:62%}
.ewgh .ewline:nth-child(2){width:82%}
body.present .ewgh .lb{font-size:clamp(12px,1.3vw,19px)}
body.present .ewgh .ewline{height:clamp(13px,1.7vh,26px)}
"""

# the one number the hook's CSS cannot know on its own
EXTRA_CSS = _KEPT + _NEW.replace('__SHIFT__', f'{H.SHIFT:g}')
