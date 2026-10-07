  /* ================= execution walker =================
     Steps are computed from the slider, so the room can change the number the
     counter is compared against and walk it again. The condition test is
     re-emitted before every pass — that re-emission is the lesson. At the end,
     everything the interpreter never touched greys out and stays grey, which at
     0 is the whole body: a while loop can run its block no times at all. */
  (function(){
    var W=document.getElementById('walker');
    if(!W) return;
    // the dot sits inside each node but clear of its label, so it never covers
    // the very text the room is being asked to read
    var POS={a:[128,34],d:[142,124],b1:[322,124],b2:[322,204],b3:[322,284],e:[128,380]};
    // ...and it travels along the drawn edges rather than cutting across the
    // chart. Each route is the polyline from the previous node to the next one,
    // in chart coordinates, ending on the destination's resting spot. The back
    // edge is the one that matters: the room has to see the dot go up the same
    // line it came down, into the same question.
    var ROUTE={
      din:  [[200,34],[200,84],[142,124]],
      t:    [[285,124],[322,124]],
      e1:   [[395,124],[395,204],[322,204]],
      e2:   [[395,204],[395,284],[322,284]],
      back: [[490,284],[530,284],[530,72],[200,72],[142,124]],
      f:    [[200,164],[200,356],[128,380]]
    };
    var TRAVEL=520;                        // ms for a whole move, split by segment length
    var dot=W.querySelector('.wdot'),
        out=W.querySelector('.wout'),
        ask=W.querySelector('#wask'),
        slider=W.querySelector('input[type=range]'),
        label=W.querySelector('.wslide label'),
        playBtn=W.querySelector('[data-w=play]'),
        stepBtn=W.querySelector('[data-w=step]'),
        resetBtn=W.querySelector('[data-w=reset]');
    var steps=[], at=0, timer=null, hop=null, dotAt=POS.a.slice();

    function plan(n){
      // one step per thing Python actually does, in order
      var s=[{node:'a',line:1},{node:'a',line:2}];
      var a=5, c=0, guard=0;
      while(guard++ < 12){
        var hit = c < n;
        s.push({node:'d', line:3, test:hit, edge:(c===0?'din':'back'), ask:c+' < '+n+' ?'});
        if(!hit) break;
        a=a+1;
        s.push({node:'b1', line:4, edge:'t'});
        s.push({node:'b2', line:5, edge:'e1', print:String(a)});
        c=c+1;
        s.push({node:'b3', line:6, edge:'e2'});
      }
      s.push({node:'e', line:7, edge:'f', print:'End'});
      return s;
    }

    function place(p){
      dot.style.transitionDuration='0ms';
      dot.style.transform='translate('+p[0]+'px,'+p[1]+'px)';
      dotAt=p.slice();
    }
    function travel(pts){
      // walk the polyline one segment at a time, sharing TRAVEL between them in
      // proportion to how far each one is, so a long back edge does not crawl
      if(hop){ clearTimeout(hop); hop=null; }
      if(!pts || !pts.length) return;
      var prev=dotAt, segs=[], total=0;
      pts.forEach(function(p){
        var d=Math.abs(p[0]-prev[0])+Math.abs(p[1]-prev[1]);
        segs.push({p:p, d:d}); total+=d; prev=p;
      });
      if(!total){ place(pts[pts.length-1]); return; }
      var i=0;
      (function go(){
        if(i>=segs.length){ hop=null; return; }
        var s=segs[i++], ms=Math.max(70, Math.round(TRAVEL*s.d/total));
        dot.style.transitionDuration=ms+'ms';
        dot.style.transform='translate('+s.p[0]+'px,'+s.p[1]+'px)';
        dotAt=s.p.slice();
        hop=setTimeout(go, ms);
      })();
    }

    function clear(){
      if(hop){ clearTimeout(hop); hop=null; }
      W.querySelectorAll('.wline').forEach(function(l){ l.className='wline'; });
      W.querySelectorAll('[data-node],[data-edge]').forEach(function(n){
        n.classList.remove('visited','dead','no'); });
      dot.classList.remove('off');
      place(POS.a);
      out.textContent='';
      if(ask) ask.textContent='0 < '+slider.value+' ?';
    }

    function render(){
      var s=steps[at-1];
      if(!s) return;
      W.querySelectorAll('.wline.now').forEach(function(l){ l.classList.remove('now'); });
      var line=W.querySelector('#wl'+s.line);
      if(line){ line.classList.add('ran','now'); }
      var node=W.querySelector('[data-node="'+s.node+'"]');
      if(node){ node.classList.add('visited'); if(s.test===false) node.classList.add('no'); }
      if(s.edge){
        var e=W.querySelector('[data-edge="'+s.edge+'"]');
        if(e) e.classList.add('visited');
      }
      if(s.ask && ask) ask.textContent=s.ask;
      if(s.edge && ROUTE[s.edge]) travel(ROUTE[s.edge]);
      else place(POS[s.node]);
      if(s.print) out.textContent = out.textContent ? out.textContent+'\n'+s.print : s.print;
      if(at===steps.length) finish();
    }

    function finish(){
      // grey out every line and node the dot never reached, and leave it grey
      W.querySelectorAll('.wline').forEach(function(l){
        if(!l.classList.contains('ran') && l.textContent.trim()) l.classList.add('dead');
      });
      W.querySelectorAll('[data-node],[data-edge]').forEach(function(n){
        if(!n.classList.contains('visited')) n.classList.add('dead');
      });
      W.querySelectorAll('.wline.now').forEach(function(l){ l.classList.remove('now'); });
    }

    function step(){
      if(at>=steps.length) return false;
      at++; render(); return at<steps.length;
    }
    function stop(){ if(timer){ clearInterval(timer); timer=null; } playBtn.textContent='Play'; }
    function play(){
      if(timer){ stop(); return; }
      if(at>=steps.length) reset();
      playBtn.textContent='Pause';
      timer=setInterval(function(){ if(!step()) stop(); }, 900);
    }
    function reset(){ stop(); at=0; steps=plan(+slider.value); clear(); }

    slider.addEventListener('input', function(){
      label.textContent='counter < '+slider.value;
      var l=W.querySelector('#wl3');
      if(l) l.innerHTML='<b>while</b> counter <b>&lt;</b> <i>'+slider.value+'</i>:';
      reset();
    });
    playBtn.addEventListener('click', play);
    stepBtn.addEventListener('click', function(){ stop(); if(at>=steps.length) reset(); step(); });
    resetBtn.addEventListener('click', reset);
    reset();

    W.replayWalker = reset;
  })();


/* ---------------------------------------------- tap to classify (template 23)
   One case is live at a time. The instructor taps the bin the ROOM voted for,
   not the right one: a bin that bounces is what the beat is for. Click driven
   only, so the arrow keys still belong to the presenter. */
document.querySelectorAll('[data-classify]').forEach(function(panel){
  var cases = Array.prototype.slice.call(panel.querySelectorAll('.cl-case'));
  var bins  = Array.prototype.slice.call(panel.querySelectorAll('.cl-bin'));
  var say   = panel.querySelector('.cl-say');
  var count = panel.querySelector('[data-cl-count]');
  var reset = panel.querySelector('[data-cl-reset]');
  var at = 0;

  function draw(){
    cases.forEach(function(c, i){ c.classList.toggle('cur', i === at); });
    if (count) count.textContent = Math.min(at, cases.length) + ' / ' + cases.length;
  }
  function clear(){
    bins.forEach(function(b){
      b.classList.remove('no');
      var d = b.querySelector('.cl-drop');
      while (d.firstChild) d.removeChild(d.firstChild);
    });
    cases.forEach(function(c){ c.classList.remove('done', 'bounce', 'cur'); });
    if (say){ say.textContent = ''; say.className = 'cl-say'; }
    at = 0; draw();
  }
  function tap(bin, btn){
    if (at >= cases.length) return;
    var c = cases[at];
    if (c.getAttribute('data-bin') === bin){
      var landed = document.createElement('div');
      landed.className = 'cl-landed';
      landed.textContent = c.querySelector('code').textContent;
      btn.querySelector('.cl-drop').appendChild(landed);
      c.classList.add('done');
      if (say){ say.textContent = c.getAttribute('data-why'); say.className = 'cl-say yes'; }
      at++;
      draw();
    } else {
      c.classList.remove('bounce'); void c.offsetWidth; c.classList.add('bounce');
      btn.classList.add('no');
      setTimeout(function(){ btn.classList.remove('no'); }, 700);
      if (say){ say.textContent = c.getAttribute('data-oops'); say.className = 'cl-say no'; }
    }
  }
  bins.forEach(function(b){
    b.addEventListener('click', function(){ tap(b.getAttribute('data-bin'), b); });
  });
  if (reset) reset.addEventListener('click', clear);
  draw();
});
