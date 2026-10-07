"""Shared chrome lifted from session 15: panel columns, the variable box that
keeps its history, the terminal, the takeaway rows and the white editor card.
Session 15's own hook and slicing rules are left behind."""

BASE_CSS = r"""
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

"""
