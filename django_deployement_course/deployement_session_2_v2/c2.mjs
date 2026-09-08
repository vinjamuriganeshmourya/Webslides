import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
for (const n of [6,26,35,43]) {
  await p.goto(`http://localhost:5213/?all#/${n}`, { waitUntil: 'load' })
  await p.waitForTimeout(3000)
  await p.screenshot({ path: `/tmp/shots/v2-${n}.png` })
}
// prove hover works: slide 26, first RuleStack row
await p.goto('http://localhost:5213/?all#/26', { waitUntil: 'load' })
await p.waitForTimeout(3000)
const nodes = await p.$$('.fc-node--hoverable')
console.log('hoverable rows on slide 26:', nodes.length)
if (nodes[0]) { await nodes[0].hover(); await p.waitForTimeout(700) }
await p.screenshot({ path: '/tmp/shots/v2-hover.png' })
await b.close(); console.log('ok')
