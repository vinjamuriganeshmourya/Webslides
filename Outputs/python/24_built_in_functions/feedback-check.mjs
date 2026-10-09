/**
 * Content rule 41: the deck's feedback slide is an exact copy of Python session
 * 18's, the source of truth being its BUILT file:
 *
 *   Outputs/python/18_comparing_strings_naming_variables/dist-single/python-session-18-comparing-strings-naming-variables.html
 *
 * Opens both built files from file://, finds the slide whose id is `feedback`
 * (the hash `#/<n>-feedback`), and compares the rendered slide markup. The only
 * allowed difference is session-specific text, listed in ALLOWED below (none
 * today: the slide carries no session name). Also asserts the QR image loads,
 * the link text, the form frame's src, and that the slide is the deck's last but
 * one (Thank you closes the deck, as in the source).
 *
 * Run: node feedback-check.mjs [path/to/built.html]
 */
import { chromium } from 'playwright'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { HTML_FILE } from './deck.config.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const SOURCE = resolve(here, '../18_comparing_strings_naming_variables/dist-single/python-session-18-comparing-strings-naming-variables.html')
const TARGET = resolve(process.argv[2] ?? resolve(here, HTML_FILE))
const ALLOWED = [] /* [from, to] pairs of session-specific text, if the slide ever carries any */

const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
const read = async (file) => {
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
  await p.route(/^https?:/, (r) => r.abort()) /* the form frame needs the network; markup is what is compared */
  await p.goto(`file://${file}?fbcheck`)
  await p.waitForTimeout(1200)
  let n = 0
  for (let i = 1; i <= 60; i++) {
    await p.goto(`file://${file}?fbcheck=${i}#/${i}`)
    await p.waitForTimeout(300)
    if ((await p.evaluate(() => location.hash)).endsWith('-feedback')) { n = i; break }
  }
  if (!n) { await p.close(); return null }
  await p.waitForTimeout(2500) /* entrance settled */
  const r = await p.evaluate(() => {
    const stage = [...document.querySelectorAll('section')].filter((s) => s.getBoundingClientRect().width >= 1200 && s.querySelector('iframe')).pop()
    const q = stage?.querySelector('img[src*="feedback-qr"], img[alt*="QR"]')
    return {
      html: stage ? stage.outerHTML.replace(/\sstyle="[^"]*opacity[^"]*"/g, '') : '',
      qr: q ? q.naturalWidth : 0,
      link: [...(stage?.querySelectorAll('a') ?? [])].map((a) => a.textContent.trim()),
      frame: stage?.querySelector('iframe')?.getAttribute('src') ?? '',
    }
  })
  /* what follows: Thank you, and nothing after it */
  await p.goto(`file://${file}?fbnext#/${n + 1}`)
  await p.waitForTimeout(300)
  const next = await p.evaluate(() => location.hash)
  await p.goto(`file://${file}?fbnext2#/${n + 2}`)
  await p.waitForTimeout(300)
  const after = await p.evaluate(() => location.hash)
  await p.close()
  return { n, next, last: !after.startsWith(`#/${n + 2}`), ...r }
}
const src = await read(SOURCE)
const tgt = await read(TARGET)
await b.close()

let ok = true
const say = (good, msg) => { console.log(`${good ? '   ok' : ' FAIL'} ${msg}`); ok &&= good }
say(Boolean(src), 'source deck has a slide with id `feedback`')
say(Boolean(tgt), 'this deck has a slide with id `feedback`')
if (src && tgt) {
  let html = tgt.html
  for (const [a, c] of ALLOWED) html = html.split(c).join(a)
  say(html === src.html, `slide markup identical to session 18's (${src.html.length} chars)`)
  if (html !== src.html) {
    let i = 0
    while (i < html.length && html[i] === src.html[i]) i++
    console.log(`        first difference at char ${i}:\n        source: …${src.html.slice(Math.max(0, i - 60), i + 80)}\n        deck:   …${html.slice(Math.max(0, i - 60), i + 80)}`)
  }
  say(tgt.qr > 0, `QR image loads (${tgt.qr}px)`)
  say(tgt.link.some((t) => t.includes('forms.gle/5d1Ru8geTKdC4Bcr7')), 'link text forms.gle/5d1Ru8geTKdC4Bcr7')
  say(tgt.frame === src.frame && /viewform\?embedded=true/.test(tgt.frame), 'form frame src matches the source')
  say(/-thank-you$/.test(tgt.next) && tgt.last, `feedback is slide ${tgt.n}, followed only by Thank you (${tgt.next})`)
}
console.log(ok ? '\nfeedback: an exact copy of session 18\'s' : '\nfeedback: NOT an exact copy')
process.exit(ok ? 0 : 1)
