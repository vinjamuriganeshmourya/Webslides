import { chromium } from 'playwright-core'
const b = await chromium.launch({ executablePath: '/usr/bin/brave-browser' })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
for (const q of ['?still', '']) {
await p.goto('about:blank'); await p.goto(`http://localhost:5280/${q}#/17`, { waitUntil: 'load' }); await p.waitForTimeout(q ? 2500 : 4200)
console.log(q || 'live', await p.evaluate(() => ['rq1','rq2','rq3'].map(id => { const e = document.querySelector(`[data-diagram-chip="${id}"] > div`); const r = e.getBoundingClientRect(); return `${id} ${Math.round(r.left)}-${Math.round(r.right)} y${Math.round(r.top)}` }).join(' | ')))
}
await p.screenshot({ path: process.argv[2], clip: { x: 300, y: 380, width: 500, height: 200 } })
await b.close()
