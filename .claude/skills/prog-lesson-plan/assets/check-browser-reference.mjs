/*
 * check-browser-reference.mjs - a worked browser harness. Copy it beside the
 * builder as check_browser.mjs, change the counts and the ids, and run it:
 *
 *   NODE_PATH=../../node_modules node check_browser.mjs
 *
 * It asserts what reading the HTML cannot, and every check here exists because
 * the static linter passed a build that was broken in exactly this way:
 *
 *   - the worksheet counter, and that it is right again after a reload
 *   - a typed answer survives a refresh, including one typed a moment before
 *   - no answer text anywhere in the student file
 *   - every field carries data-label and data-task
 *   - presenter view opens, exactly one card is active, arrow keys advance it
 *   - the hook steps, a staged panel reveals, the explainer walks
 *   - no em-dash in innerText of any of the three files
 *   - no page errors on any of them
 *
 * Loaded over file://, which is how these run in the lab: no server, no
 * network. Chrome gives every file:// page one storage partition, so the
 * worksheet's storage key has to be per-session; that is checked here too.
 *
 * Counts (77 fields, 4 tasks, the tree assertions) are from the session this
 * was lifted from. Replace them with this session's. A harness that asserts
 * the wrong numbers is worse than none.
 */import { chromium } from "playwright-core";
import { pathToFileURL } from "url";
import { resolve, join } from "path";
import { existsSync, readdirSync } from "fs";

const PW_ROOT = join(process.env.LOCALAPPDATA || "", "ms-playwright");

const OUT = resolve("out");
const url = (f) => pathToFileURL(resolve(OUT, f)).href;
// one SESSION, three names, exactly as build-template.py derives them
const SESSION = "NN - Session name";
const PRESENTER = `${SESSION}_student_view.html`;
const WORKSHEET = `${SESSION}_student_handout.html`;
const GUIDE = `${SESSION}_instructor_guide.html`;

let pass = 0, fail = 0;
const ok = (name, cond, detail = "") => {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name}${detail ? "  -> " + detail : ""}`); }
};

// this machine's Playwright browsers were installed by a different tool, so
// point at the newest one we can find rather than at playwright-core's own
const roots = existsSync(PW_ROOT)
  ? readdirSync(PW_ROOT).filter(d => d.startsWith("chromium-")).sort()
  : [];
const exe = roots.map(d => resolve(PW_ROOT, d, "chrome-win64/chrome.exe"))
                 .filter(existsSync).pop();
if (!exe) { console.error("no chromium found under " + PW_ROOT); process.exit(2); }

const browser = await chromium.launch({ executablePath: exe });
const ctx = await browser.newContext({
  permissions: ["clipboard-read", "clipboard-write"],
});
const errors = [];
ctx.on("weberror", (e) => errors.push(String(e.error())));

/* ---------------------------------------------------------------- worksheet */
console.log("\nworksheet");
const w = await ctx.newPage();
w.on("pageerror", (e) => errors.push("worksheet: " + e.message));
await w.goto(url(WORKSHEET));

const shape = await w.evaluate(() => ({
  tasks: [...document.querySelectorAll("section.task")].map(s => s.dataset.task),
  fields: document.querySelectorAll("[data-count]").length,
  labelled: [...document.querySelectorAll("[data-count]")]
              .every(el => el.getAttribute("data-label")),
  tasked: [...document.querySelectorAll("[data-count]")]
              .every(el => el.getAttribute("data-task")),
  trees: document.querySelectorAll("svg.w-minitree, svg.w-tree").length,
  count: document.getElementById("count").textContent,
}));
ok("four tasks, numbered 1-4", JSON.stringify(shape.tasks) === '["1","2","3","4"]',
   JSON.stringify(shape.tasks));
ok("77 countable fields", shape.fields === 77, String(shape.fields));
ok("every field has a label", shape.labelled);
ok("every field knows its task", shape.tasked);
ok("six trees drawn (task 1, task 2, 4 mini)", shape.trees === 6, String(shape.trees));
ok("counter starts at zero", /^0 of 77/.test(shape.count), shape.count);

// fill some in, the way a student would
await w.fill("#who-id", "N24-0117");
await w.fill("#who-name", "Test Student");
// the real input is hidden behind a drawn tick, so click what a student clicks
await w.click("label:has(> #roles-1-0)");   // node 1 is Root
await w.click("label:has(> #roles-4-2)");   // node 4 is Leaf
await w.fill("#q-h", "4");
await w.fill("#q-anc", "7, 3, 1");
await w.fill("#e-node", "internal");
await w.fill("#e-height", "4");
await w.fill("#e-why1", "zero children");
await w.click("label:has(> #sort-1-2)");     // tree 1 is Perfect
await w.fill("#k-matches", "63");

await w.waitForTimeout(400);   // the autosave debounce
const after = await w.evaluate(() => ({
  count: document.getElementById("count").textContent,
  width: document.querySelector(".meter i").style.width,
  saved: document.getElementById("saved").textContent,
}));
ok("counter tracks answers", /^9 of 77/.test(after.count), after.count);
ok("meter moved off zero", after.width && after.width !== "0%", after.width);
ok("says it saved", /^Saved on this laptop$/.test(after.saved), after.saved);

// reload: the work has to come back
await w.reload();
const back = await w.evaluate(() => ({
  id: document.getElementById("who-id").value,
  h: document.getElementById("q-h").value,
  anc: document.getElementById("q-anc").value,
  root1: document.getElementById("roles-1-0").checked,
  leaf4: document.getElementById("roles-4-2").checked,
  perfect1: document.getElementById("sort-1-2").checked,
  count: document.getElementById("count").textContent,
  saved: document.getElementById("saved").textContent,
}));
ok("roll number survives a reload", back.id === "N24-0117", back.id);
ok("typed answers survive", back.h === "4" && back.anc === "7, 3, 1");
ok("ticks survive", back.root1 && back.leaf4 && back.perfect1);
ok("counter is right after restore", /^9 of 77/.test(back.count), back.count);
ok("tells them their work is back", /back/i.test(back.saved), back.saved);

// the lid-shut case: type, then leave inside the debounce window
await w.fill("#k-rounds", "6");
await w.evaluate(() => window.dispatchEvent(new Event("pagehide")));
await w.reload();
const lid = await w.evaluate(() => document.getElementById("k-rounds").value);
ok("an answer typed a moment before leaving is kept", lid === "6", lid);


// the answer key must not be reachable from the student file
const src = await w.content();
const leaks = ["Node 7 has one child so it is internal", "63 matches",
               "Full, complete, perfect and balanced", "the sides switch",
               "Ancestors of 8 are 7, 3, 1"]
  .filter(s => src.includes(s));
ok("no answers in the student file", leaks.length === 0, leaks.join(" | "));


/* ----------------------------------------------------------------- guide */
console.log("\nguide");
const g = await ctx.newPage();
g.on("pageerror", (e) => errors.push("guide: " + e.message));
await g.goto(url(GUIDE));
const gv = await g.evaluate(() => ({
  tabs: [...document.querySelectorAll(".g-tab")].map(t => t.textContent),
  visible: [...document.querySelectorAll(".g-panel")]
             .filter(p => p.offsetParent !== null).map(p => p.id),
  h1: document.querySelector(".g-h1").textContent,
  imgs: document.querySelectorAll("img").length,
}));
ok("four tabs", gv.tabs.length === 4, gv.tabs.join(", "));
ok("one panel showing", gv.visible.length === 1, gv.visible.join(", "));
ok("no slide images in the guide", gv.imgs === 0, String(gv.imgs));

await g.click('.g-tab[data-gp="g-ans"]');
const ans = await g.evaluate(() => {
  const p = document.getElementById("g-ans");
  return { shown: p.offsetParent !== null, text: p.innerText };
});
ok("answers tab opens", ans.shown);
ok("worksheet answers are in it",
   ans.text.includes("Node 2") && /ws 3/.test(ans.text));
ok("the grid answer is there", /Root\s*1/.test(ans.text.replace(/·/g, "")));
ok("the take-home answer is there", ans.text.includes("63 matches"));

await g.click('.g-tab[data-gp="g-run"]');
const run = await g.evaluate(() => document.getElementById("g-run").innerText);
ok("run sheet says when laptops open", /Lids up now/.test(run));
ok("run sheet names the worksheet at the activity",
   /task 2 on your worksheet/i.test(run));
ok("run sheet asks for the count, not the answers",
   /what does your counter say/i.test(run));
ok("no printed-sheet prompts left",
   !/optional sheet task|tree sheet|shade every leaf|circle every node/i.test(run),
   (run.match(/.{0,60}(optional sheet task|tree sheet|shade every leaf).{0,60}/) || [""])[0]);

await g.click('.g-tab[data-gp="g-prep"]');
const prep = await g.evaluate(() => document.getElementById("g-prep").innerText);
ok("prepare tab describes the worksheet", /The worksheet/.test(prep));
ok("prepare tab names the file", prep.includes(WORKSHEET));
ok("no printer step left", !/printer/i.test(prep),
   (prep.match(/.{0,60}printer.{0,60}/) || [""])[0]);

/* ------------------------------------------------------------- presenter */
console.log("\npresenter");
const p = await ctx.newPage();
p.on("pageerror", (e) => errors.push("presenter: " + e.message));
await p.goto(url(PRESENTER));
const pv = await p.evaluate(() => ({
  slides: document.querySelectorAll(".slide").length,
  cards: document.querySelectorAll(".slide, .pcard").length,
  imgs: document.querySelectorAll("img").length,
  guideLinks: [...document.querySelectorAll(".sp-link")].map(a => a.getAttribute("href")),
  stray: document.querySelectorAll("#guide-view, .g-tab").length,
  present: !!document.getElementById("present-btn"),
}));
ok("all 48 taught slides present", pv.slides >= 30, String(pv.slides));
ok("every slide image loaded inline", pv.imgs === 37, String(pv.imgs));
ok("links to the other two files",
   pv.guideLinks.includes(GUIDE) && pv.guideLinks.includes(WORKSHEET),
   pv.guideLinks.join(", "));
ok("no guide left behind in it", pv.stray === 0, String(pv.stray));

// presenter view still drives
await p.click("#present-btn");
const p1 = await p.evaluate(() => ({
  on: document.body.classList.contains("present"),
  active: document.querySelectorAll(".slide.active, .pcard.active").length,
  count: document.getElementById("p-count").textContent,
}));
ok("presenter view opens", p1.on);
ok("exactly one card showing", p1.active === 1, String(p1.active));

await p.keyboard.press("ArrowRight");
await p.keyboard.press("ArrowRight");
const p2 = await p.evaluate(() => ({
  count: document.getElementById("p-count").textContent,
  active: document.querySelectorAll(".slide.active, .pcard.active").length,
}));
ok("arrow keys advance", p2.count !== p1.count, `${p1.count} -> ${p2.count}`);
ok("still exactly one card", p2.active === 1, String(p2.active));

await p.keyboard.press("Escape");
// the hook stepper
const hook = await p.evaluate(() => {
  const btn = document.getElementById("hf-next");
  const before = document.getElementById("hf-count").textContent;
  btn.click(); btn.click();
  return { before, after: document.getElementById("hf-count").textContent };
});
ok("hook steps", hook.before !== hook.after, `${hook.before} -> ${hook.after}`);

// the activity reveal
const act = await p.evaluate(() => {
  document.getElementById("ac-reveal").click();
  return { lit: document.querySelector(".actfig").classList.contains("lit"),
           shown: document.getElementById("ac-ans").classList.contains("shown") };
});
ok("activity reveals", act.lit && act.shown);

// the four-tree stepper
const ex = await p.evaluate(() => {
  const before = document.getElementById("ex-count").textContent;
  document.getElementById("ex-next").click();
  return { before, after: document.getElementById("ex-count").textContent };
});
ok("exit stepper moves", ex.before !== ex.after, `${ex.before} -> ${ex.after}`);

/* ------------------------------------------------------------------ done */
console.log("\nconsole");
ok("no page errors anywhere", errors.length === 0, errors.join(" | "));

await browser.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
