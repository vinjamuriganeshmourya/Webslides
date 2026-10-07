/*
 * check_browser.mjs - drive session 12 in a real browser over file://
 *
 *   node check_browser.mjs
 *
 * Every assertion here is about behaviour a static read cannot see: the hook
 * swapping the machine for the room's own examples and back, the classify panel
 * refusing a wrong bin, and no card painting over its own title once it is on
 * its last step.
 */
import { chromium } from "playwright-core";
import { join, resolve } from "path";
import { readdirSync, existsSync, mkdirSync } from "fs";
import { pathToFileURL } from "url";

const PW = join(process.env.LOCALAPPDATA, "ms-playwright");
const exe = readdirSync(PW).filter(d => d.startsWith("chromium-")).sort()
  .map(d => resolve(PW, d, "chrome-win64/chrome.exe")).filter(existsSync).pop();

const DIR = resolve("../../Plans/Programming Foundations/12 - Loops");
const SHOTS = resolve("work/shots");
mkdirSync(SHOTS, { recursive: true });

let fails = 0;
const ck = (ok, what, detail = "") => {
  console.log((ok ? "  ok   " : " FAIL  ") + what + (ok ? "" : "  " + detail));
  if (!ok) fails++;
};

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const errs = [];
page.on("pageerror", e => errs.push(String(e)));
page.on("console", m => { if (m.type() === "error") errs.push(m.text()); });

await page.goto(pathToFileURL(join(DIR, "12_loops_student_view.html")).href);
await page.waitForTimeout(400);

// ---- presenter mode ------------------------------------------------------
await page.click(".sp-btn");
await page.waitForTimeout(400);
ck(await page.evaluate(() => document.body.classList.contains("present")),
   "presenter view opens");
ck(await page.evaluate(() => document.querySelectorAll(".slide.active,.pcard.active").length) === 1,
   "exactly one card is active");

// the card grid's cells are the only navigation that does not fight a staged
// card for the arrow keys
const go = n => page.evaluate(k => {
  document.querySelectorAll(".p-cell")[k].click();
}, n);

// ---- the hook: machine, then their examples, then the collapse -----------
await go(3);                                   // card 4, zero based
await page.waitForTimeout(400);
const stage = ".pcard.active .stage[data-anim]";
const at = () => page.evaluate(s => document.querySelector(s).dataset.animAt, stage);
const vis = sel => page.evaluate(s => {
  const n = document.querySelector(s);
  return !!n && getComputedStyle(n).display !== "none";
}, sel);

ck(await page.evaluate(s => document.querySelector(s)?.dataset.anim, stage) === "8",
   "the hook card has eight presses");
ck(await vis(".pcard.active .hkfig") && !(await vis(".pcard.active .hkyt")),
   "press 1: the shop is up, the examples are not");
ck(await page.evaluate(() => getComputedStyle(
     document.querySelector(".pcard.active .hmorph .hgroup")).opacity) === "0",
   "press 1: the card does not already answer its own question");
await page.click(".pcard.active [data-anim-next]");
await page.waitForTimeout(500);
ck(await page.evaluate(() => getComputedStyle(
     document.querySelector(".pcard.active .hmorph .hgroup")).opacity) === "1",
   "press 2: the column of forty arrives");
await page.click(".pcard.active [data-anim-next]");
await page.click(".pcard.active [data-anim-next]");
await page.waitForTimeout(500);
ck(await at() === "4", "it steps to press 4", await at());
ck(!(await vis(".pcard.active .hkfig")) && (await vis(".pcard.active .hkyt")),
   "press 4: the machine stands down, the question replaces it");
ck(await page.evaluate(() => {
     const o = getComputedStyle(document.querySelector(".pcard.active .exg2 .ex")).opacity;
     const c = getComputedStyle(document.querySelector(".pcard.active .exg2 .ex b")).opacity;
     return parseFloat(o) > 0 && parseFloat(o) < 0.3 && c === "0";
   }), "press 4: three empty slots, no words in them yet");
for (let k = 0; k < 3; k++) await page.click(".pcard.active [data-anim-next]");
await page.waitForTimeout(600);
ck(await page.evaluate(() => [...document.querySelectorAll(".pcard.active .exg2 .ex")]
     .every(e => getComputedStyle(e).opacity === "1")),
   "press 7: all three examples are up");
await page.click(".pcard.active [data-anim-next]");
await page.waitForTimeout(1200);
ck(await vis(".pcard.active .hkfig") && !(await vis(".pcard.active .hkyt")),
   "press 8: the machine is back");
ck(await page.evaluate(() => {
     const g = document.querySelector(".pcard.active .hmorph .hgroup");
     return getComputedStyle(g).transform !== "none" && getComputedStyle(g).opacity === "1";
   }), "press 8: the column has collapsed");
ck(await page.evaluate(() => getComputedStyle(
     document.querySelector(".pcard.active .hmorph .hcode")).opacity) === "1",
   "press 8: the loop is drawn");
await page.screenshot({ path: join(SHOTS, "hook-8.png") });

// ---- the classify panel --------------------------------------------------
await go(16);                                  // card 17
await page.waitForTimeout(400);
ck(await page.evaluate(() => !!document.querySelector(".pcard.active [data-classify]")),
   "the classify panel is on card 17");
const say = () => page.evaluate(() => document.querySelector(".pcard.active .cl-say").textContent);
const cnt = () => page.evaluate(() => document.querySelector(".pcard.active [data-cl-count]").textContent);
ck(await cnt() === "0 / 6", "it starts at nought of six", await cnt());
await page.click('.pcard.active .cl-bin[data-bin="u"]');     // wrong on purpose
await page.waitForTimeout(300);
ck(await cnt() === "0 / 6", "a wrong bin does not advance it", await cnt());
ck((await say()).length > 10, "a wrong bin says why", await say());
ck(await page.evaluate(() => document.querySelector(".pcard.active .cl-say")
     .classList.contains("no")), "a wrong bin is marked wrong");
await page.click('.pcard.active .cl-bin[data-bin="i"]');     // right
await page.waitForTimeout(400);
ck(await cnt() === "1 / 6", "the right bin advances it", await cnt());
ck(await page.evaluate(() => !!document.querySelector(
     '.pcard.active .cl-bin[data-bin="i"] .cl-landed')), "the line lands in the bin");
await page.screenshot({ path: join(SHOTS, "classify.png") });
await page.click(".pcard.active [data-cl-reset]");
await page.waitForTimeout(200);
ck(await cnt() === "0 / 6", "Replay clears it", await cnt());

// ---- the guide's closing sections ---------------------------------------
{
  const g = await browser.newPage();
  await g.goto(pathToFileURL(join(DIR, "12_loops_instructor_guide.html")).href);
  await g.waitForTimeout(300);
  const t = await g.evaluate(() => document.body.innerText);
  ck(/Every answer, in one place/.test(t), "the guide has the answer table");
  ck(await g.evaluate(() => document.querySelectorAll("table.gans tr").length) === 13,
     "the answer table has a row per place");
  ck(/Source defects/.test(t), "the guide has a source defects section");
  ck((t.match(/Short of time:/g) || []).length >= 15,
     "most cards carry a Short of time bullet",
     String((t.match(/Short of time:/g) || []).length));
  ck(!/paper/i.test(t.replace(/wallpaper/gi, "")), "the guide says nothing about paper");
  await g.close();
}

// ---- the quiz card carries nothing --------------------------------------
await go(18);
await page.waitForTimeout(300);
ck(await page.evaluate(() => {
     const c = document.querySelector(".pcard.active");
     return !c.querySelector(".tmr") && !c.querySelector("[data-reveal]");
   }), "the classroom quiz card has no timer and no reveal");

// ---- every card, on its last step, inside its own box --------------------
const over = await page.evaluate(async () => {
  const cards = [...document.querySelectorAll(".slide,.pcard")];
  const bad = [];
  for (let i = 0; i < cards.length; i++) {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  }
  for (let i = 0; i < cards.length; i++) {
    const c = cards[i];
    cards.forEach(x => x.classList.remove("active"));
    c.classList.add("active");
    const st = c.querySelector(".stage[data-anim]");
    if (st && typeof st.animGo === "function") st.animGo(parseInt(st.dataset.anim, 10));
    c.querySelectorAll("[data-reveal]").forEach(b => b.click());
    await new Promise(r => requestAnimationFrame(r));
    if (c.scrollHeight - c.clientHeight > 4) bad.push(i + 1 + ":" + (c.scrollHeight - c.clientHeight));
  }
  return bad;
});
ck(over.length === 0, "no card overflows on its last step, answers revealed", over.join(", "));

// ---- nothing names the session before the title card ---------------------
const early = await page.evaluate(() => {
  const cards = [...document.querySelectorAll(".slide,.pcard")].slice(0, 4);
  return cards.map((c, i) => [i + 1, /loop/i.test(c.innerText)]).filter(r => r[1]).map(r => r[0]);
});
ck(early.length === 0, "no card before the title names the topic", "cards " + early.join(", "));

ck(errs.length === 0, "no page errors", errs.slice(0, 2).join(" | "));

// ---- the worksheet keeps what a student typed ---------------------------
const w = await browser.newPage();
await w.goto(pathToFileURL(join(DIR, "12_loops_student_handout.html")).href);
await w.waitForTimeout(300);
const N = await w.evaluate(() => document.querySelectorAll("textarea,input").length);
ck(N === 21, "the worksheet has twenty-one fields", String(N));
await w.fill("textarea", "a = a + 1\nprint(a)\na = a + 1\nprint(a)");
await w.waitForTimeout(600);
await w.reload();
await w.waitForTimeout(500);
const back = await w.evaluate(() => document.querySelector("textarea").value);
ck(back === "a = a + 1\nprint(a)\na = a + 1\nprint(a)",
   "a four line answer comes back after a reload", JSON.stringify(back));
ck(!/NameError|infinite|never stops/i.test(await w.evaluate(() => document.body.innerText)),
   "the worksheet carries no answers");

await browser.close();
console.log("\n" + (fails ? fails + " failed" : "all browser checks pass"));
process.exit(fails ? 1 : 0);
