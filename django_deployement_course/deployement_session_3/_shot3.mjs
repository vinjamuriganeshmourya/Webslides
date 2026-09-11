import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
for (const n of [2,3,4,6,7,9,11,12,15]) {
  await p.goto(`http://localhost:5174/?all#/${n}`, { waitUntil: 'networkidle' })
  await p.waitForTimeout(2600)
  await p.screenshot({ path: `/tmp/s3-${n}.png` })
}
await b.close()
