import { chromium } from 'playwright'
const OUT = '/home/nxtwave/.claude/jobs/170bacfd/tmp/isolation'
const ids = ['brand','shipped','sealed','reach','lone','blocked','stress-one','stress-five','clamp-proof','thankyou']
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 })
p.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE ERROR', m.text()) })
for (let i = 0; i < ids.length; i++) {
  await p.goto(`http://localhost:5230/?all#/${i + 1}`, { waitUntil: 'load' })
  await p.waitForTimeout(2600)
  await p.screenshot({ path: `${OUT}/${String(i + 1).padStart(2, '0')}-${ids[i]}.png` })
  console.log('shot', ids[i])
}
await b.close()
