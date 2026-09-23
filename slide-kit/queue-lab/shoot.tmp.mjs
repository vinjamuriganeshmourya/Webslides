import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const pg = await b.newPage({ viewport: { width: 1280, height: 720 } })
for (const n of process.argv.slice(2)) {
  await pg.goto(`http://localhost:5234/?all#/${n}`, { waitUntil: 'networkidle' })
  await pg.waitForTimeout(2600)
  await pg.screenshot({ path: `${process.env.SP}/cand-${n}.png` })
  console.log('shot', n)
}
await b.close()
