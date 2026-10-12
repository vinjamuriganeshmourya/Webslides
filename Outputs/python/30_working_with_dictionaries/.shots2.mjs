// scratch: screenshot slides at every press on a dev server, and check the press count.
// node .shots2.mjs <port> "<slide>:<presses>,<slide>:<presses>,..." <outdir> [waitMs]
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
const [port, list, out, waitArg] = process.argv.slice(2)
const WAIT = Number(waitArg ?? 2600)
mkdirSync(out, { recursive: true })
const pad = (n) => String(n).padStart(2, '0')
const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
const errs = []
p.on('pageerror', (e) => errs.push(String(e)))
p.on('console', (m) => m.type() === 'error' && errs.push('console: ' + m.text().slice(0, 300)))
for (const item of list.split(',')) {
  const [n, presses] = item.split(':').map(Number)
  await p.goto(`http://localhost:${port}/?nav=steps&noauto#/${n}`, { waitUntil: 'load' })
  await p.waitForTimeout(2600)
  for (let k = 1; k <= presses; k++) {
    if (k > 1) {
      await p.keyboard.press('ArrowRight')
      await p.waitForTimeout(WAIT)
    }
    await p.screenshot({ path: `${out}/s${pad(n)}-${pad(k)}.png` })
  }
  const before = await p.evaluate(() => location.hash)
  await p.keyboard.press('ArrowRight')
  await p.waitForTimeout(700)
  const after = await p.evaluate(() => location.hash)
  const moved = Number(/^#\/(\d+)/.exec(after)?.[1]) === n + 1
  console.log(`slide ${n}: ${presses} presses, then ${before} -> ${after} ${moved ? 'OK' : 'MISMATCH: the slide did not end there'}`)
}
console.log(errs.length ? `page errors:\n${[...new Set(errs)].join('\n')}` : 'no page errors')
await b.close()
