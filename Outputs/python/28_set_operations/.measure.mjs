import { chromium } from 'playwright-core'
const n = process.argv[2]
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
await p.goto(`http://localhost:5258/?nav=steps&noauto#/${n}`, { waitUntil: 'networkidle' }); await p.waitForTimeout(2000)
console.log(await p.evaluate(() => {
  const r = (e) => { const x = e.getBoundingClientRect(); return [Math.round(x.left), Math.round(x.top), Math.round(x.right), Math.round(x.bottom)] }
  const spec = document.querySelector('[data-spec]')
  const next = [...document.querySelectorAll('button')].find((x) => x.textContent?.trim() === 'Next')
  return { spec: r(spec), parent: r(spec.parentElement), next: next && r(next) }
}))
await b.close()
