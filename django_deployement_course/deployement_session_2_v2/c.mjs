import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
for (const n of [9,24,26,29,31,33,43]) {
  await p.goto(`http://localhost:5213/?all#/${n}`, { waitUntil: 'load' })
  await p.waitForTimeout(3000)
  await p.screenshot({ path: `/tmp/shots/s2-${n}.png` })
}
await b.close(); console.log('ok')
