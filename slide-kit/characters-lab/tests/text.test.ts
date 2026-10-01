import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

function walk(dir: string, out: string[] = []): string[] {
  for (const f of readdirSync(dir)) {
    if (f === 'node_modules' || f === 'review' || f === 'dist') continue
    const p = join(dir, f)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(tsx?|mjs|md|css)$/.test(f)) out.push(p)
  }
  return out
}

describe('repo text rules', () => {
  it('no em dash anywhere in the lab', () => {
    for (const f of walk(join(__dirname, '..'))) {
      const src = readFileSync(f, 'utf8')
      const at = src.indexOf(String.fromCharCode(0x2014))
      expect(at, `${f} has an em dash at ${at}`).toBe(-1)
    }
  })
})
