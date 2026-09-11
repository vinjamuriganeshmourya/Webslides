import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const pg = await b.newPage({ viewport: { width: 1280, height: 720 } })
for (const n of process.argv.slice(3)) {
  await pg.goto(`http://localhost:5218/?all#/${n}`, { waitUntil: 'networkidle' })
  await pg.waitForTimeout(2600)
  await pg.screenshot({ path: `${process.argv[2]}/${n}.png` })
}
console.log('shot', process.argv.slice(3).join(' '))
await b.close()
