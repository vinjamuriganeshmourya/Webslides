import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
const OUT = process.argv[2]
mkdirSync(OUT, { recursive: true })
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const pg = await b.newPage({ viewport: { width: 1280, height: 720 } })
const N = Number(process.argv[3] || 62)
for (let n = 1; n <= N; n++) {
  await pg.goto(`http://localhost:5218/?all#/${n}`, { waitUntil: 'networkidle' })
  await pg.waitForTimeout(2600)   // preview.mjs documents this settle; 650ms reads animation as bugs
  await pg.screenshot({ path: `${OUT}/${String(n).padStart(2, '0')}.png` })
  if (n % 10 === 0) console.log('  ...', n)
}
console.log('rendered', N)
await b.close()
