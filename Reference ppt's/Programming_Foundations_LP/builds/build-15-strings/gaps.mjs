import { chromium } from "playwright-core";
import { pathToFileURL } from "url";
import { resolve, join } from "path";
import { existsSync, readdirSync } from "fs";
const S = "15_string_methods";
const PW = join(process.env.LOCALAPPDATA || "", "ms-playwright");
const exe = readdirSync(PW).filter(d => d.startsWith("chromium-")).sort()
  .map(d => resolve(PW, d, "chrome-win64/chrome.exe")).filter(existsSync).pop();
const b = await chromium.launch({ executablePath: exe });
const p = await (await b.newContext({ viewport: { width: 1600, height: 900 } })).newPage();
await p.goto(pathToFileURL(resolve("out", `${S}_student_view.html`)).href);
await p.waitForTimeout(400); await p.keyboard.press("p"); await p.waitForTimeout(300);
const SEL = "#hk-next,[data-anim-next],[data-lw-step],[data-rcp-next],.stage-ctl button:not(.ghost)";
const n = await p.evaluate(() => document.querySelectorAll(".slide,.pcard").length);
console.log("card | biggest empty band (px) | where | label");
for (let i = 0; i < n; i++) {
  await p.evaluate(async (SEL) => {
    const c = document.querySelector(".pcard.active,.slide.active"); if (!c) return;
    for (let k = 0; k < 260; k++) {
      const bs = [...c.querySelectorAll(SEL)].filter(b => !b.disabled && b.offsetParent);
      if (!bs.length) break; bs.forEach(b => b.click());
      await new Promise(r => setTimeout(r, 10));
    }
  }, SEL);
  await p.waitForTimeout(420);
  const out = await p.evaluate(() => {
    const c = document.querySelector(".pcard.active,.slide.active");
    if (!c) return null;
    const r = c.getBoundingClientRect();
    const bands = [];
    c.querySelectorAll("*").forEach(el => {
      if (el.children.length) return;
      const q = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      if (!q.height || !q.width) return;
      if (st.visibility === "hidden" || +st.opacity === 0) return;
      const ink = (el.textContent || "").trim() || el.tagName === "IMG" ||
                  el.tagName === "svg" || st.backgroundColor !== "rgba(0, 0, 0, 0)" ||
                  st.borderTopWidth !== "0px";
      if (ink) bands.push([q.top, q.bottom]);
    });
    if (!bands.length) return null;
    bands.sort((a, b) => a[0] - b[0]);
    let cov = [], cur = bands[0].slice();
    for (const [t, bo] of bands.slice(1)) {
      if (t <= cur[1] + 1) cur[1] = Math.max(cur[1], bo);
      else { cov.push(cur); cur = [t, bo]; }
    }
    cov.push(cur);
    let best = 0, at = 0;
    for (let k = 0; k + 1 < cov.length; k++) {
      const g = cov[k + 1][0] - cov[k][1];
      if (g > best) { best = g; at = cov[k][1]; }
    }
    const tail = r.bottom - cov[cov.length - 1][1];
    if (tail > best) { best = tail; at = cov[cov.length - 1][1]; }
    return { best: Math.round(best), at: Math.round(at - r.top),
             label: c.dataset.label || "" };
  });
  if (out) console.log(`${String(i+1).padStart(4)} | ${String(out.best).padStart(23)} | y=${String(out.at).padStart(4)} | ${out.label}`);
  await p.keyboard.press("ArrowRight"); await p.waitForTimeout(200);
}
await b.close();
