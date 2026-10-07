import { chromium } from 'playwright'
const out = process.argv[2]
const b = await chromium.launch({ executablePath: '/usr/bin/brave-browser' })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
const shot = (n) => p.screenshot({ path: `${out}/${n}.png` })
await p.goto('http://localhost:5244/#/11', { waitUntil: 'networkidle' }); await p.waitForTimeout(1600); await shot('b0-idle')
await p.getByRole('button', { name: 'B abcd', exact: true }).click(); await p.waitForTimeout(400); await shot('b1-picked')
await p.getByRole('button', { name: 'Run it' }).click()
for (const [k, ms] of [[2,160],[3,500],[4,520],[5,520],[6,520],[7,520],[8,520],[9,460],[10,900]]) { await p.waitForTimeout(ms); await shot(`b${k}`) }
await p.waitForTimeout(1200); await shot('b11-settled')
for (const name of ['B 1c', 'B bc4']) { await p.getByRole('button', { name: 'Next level' }).click(); await p.waitForTimeout(400); await p.getByRole('button', { name, exact: true }).click(); await p.getByRole('button', { name: 'Run it' }).click(); await p.waitForTimeout(3600) }
await p.getByRole('button', { name: 'Next level' }).click(); await p.waitForTimeout(400)
await p.getByRole('button', { name: 'Next level' }).click().catch(() => {})
await p.getByRole('button', { name: 'B nothing at all', exact: true }).click(); await p.getByRole('button', { name: 'Run it' }).click()
await p.waitForTimeout(800); await shot('c1-empty-run'); await p.waitForTimeout(1900); await shot('c2-empty-done')
await b.close()
