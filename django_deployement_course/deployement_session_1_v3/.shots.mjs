import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
for (const n of process.argv.slice(2)) {
  await p.goto(`http://localhost:5212/?all#/${n}`, { waitUntil: 'networkidle' })
  await p.waitForTimeout(2600)
  await p.screenshot({ path: `/tmp/v${n}.png` })
}
await b.close()
