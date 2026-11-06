/**
 * THE DECK FOLDER, AS A MODULE (deck-engine v1).
 *
 * `virtual:deck` is the session's `deck.json`, with every `images/...` string turned
 * into an imported URL (so the single-file build inlines it) and `dims` giving each
 * image's natural size (screenshot rings are in source pixels). `@custom` is the
 * session's `custom/index.tsx` when it has one, else an empty module.
 *
 * The folder comes from the `DECK` environment variable, set by `deck.mjs`.
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, isAbsolute, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

export function deckDir() {
  const d = process.env.DECK || 'samples/demo'
  return isAbsolute(d) ? d : resolve(process.env.DECK_CWD || process.cwd(), d)
}

/** natural size of a PNG / JPEG / SVG / WebP, or null */
export function imageSize(file) {
  const b = readFileSync(file)
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) return [b.readUInt32BE(16), b.readUInt32BE(20)]
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2
    while (i < b.length) {
      if (b[i] !== 0xff) return null
      const m = b[i + 1]
      const len = b.readUInt16BE(i + 2)
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]
      i += 2 + len
    }
    return null
  }
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const t = b.toString('ascii', 12, 16)
    if (t === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)]
    if (t === 'VP8L') {
      const bits = b.readUInt32LE(21)
      return [1 + (bits & 0x3fff), 1 + ((bits >> 14) & 0x3fff)]
    }
    return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff]
  }
  const s = b.toString('utf8', 0, Math.min(b.length, 4000))
  const vb = s.match(/viewBox="[\d.\-]+\s+[\d.\-]+\s+([\d.]+)\s+([\d.]+)"/)
  if (vb) return [Number(vb[1]), Number(vb[2])]
  return null
}

const IMG = /^(img:)?(\.\/)?(images\/.+\.(png|jpe?g|svg|webp|gif))$/i

export function deckPlugin() {
  const VIRTUAL = 'virtual:deck'
  const RESOLVED = '\0virtual:deck'
  return {
    name: 'deck-data',
    config() {
      const dir = deckDir()
      const custom = resolve(dir, 'custom/index.tsx')
      return {
        resolve: {
          /* a session's custom/ files import packages by bare name (`three`, `three/examples/jsm/...`): the session
             folder has no node_modules, so resolve them from the engine (Session 6 S53, 2026-11-06) */
          dedupe: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei'],
          alias: {
            '@custom': existsSync(custom) ? custom : resolve(here, 'src/engine/noCustom.ts'),
            /* the presenter's text edits, per deck (`slide-edits.ts` in the deck folder, written by the dev server) */
            '@edits': existsSync(resolve(dir, 'slide-edits.ts')) ? resolve(dir, 'slide-edits.ts') : resolve(here, 'src/engine/noEdits.ts'),
          },
        },
        server: { fs: { allow: [here, dir] } },
      }
    },
    /* any bare package import from a session's own files (custom/*.tsx) resolves from the ENGINE's node_modules:
       the session folder has none, and every library a deck may use is installed once, here (2026-11-06) */
    async resolveId(id, importer) {
      if (id === VIRTUAL) return RESOLVED
      if (!importer || id.startsWith('\0') || id.startsWith('.') || id.startsWith('/') || id.startsWith('@/') || id.startsWith('@custom') || id.startsWith('@edits') || id.startsWith('virtual:')) return null
      const dir = deckDir()
      if (!importer.startsWith(dir + '/')) return null
      return this.resolve(id, resolve(here, 'src/main.tsx'), { skipSelf: true })
    },
    load(id) {
      if (id !== RESOLVED) return
      const dir = deckDir()
      const file = resolve(dir, 'deck.json')
      this.addWatchFile(file)
      const data = JSON.parse(readFileSync(file, 'utf8'))
      const imports = []
      const dims = []
      const seen = new Map()
      const walk = (v) => {
        if (typeof v === 'string') {
          const m = v.match(IMG)
          if (!m) return v
          const rel = m[3]
          const abs = resolve(dir, rel)
          if (!existsSync(abs)) throw new Error(`[deck] missing image ${rel} in ${dir}`)
          let n = seen.get(abs)
          if (n === undefined) {
            n = seen.size
            seen.set(abs, n)
            imports.push(`import __img${n} from ${JSON.stringify(abs)}`)
            const sz = imageSize(abs)
            dims.push(`[__img${n}]: ${JSON.stringify(sz)}`)
            this.addWatchFile(abs)
          }
          return `@@IMG${m[1] ? 'P' : ''}${n}@@`
        }
        if (Array.isArray(v)) return v.map(walk)
        if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]))
        return v
      }
      const json = JSON.stringify(walk(data))
        .replace(/"@@IMGP(\d+)@@"/g, (_, n) => `"img:" + __img${n}`)
        .replace(/"@@IMG(\d+)@@"/g, (_, n) => `__img${n}`)
      return `${imports.join('\n')}\nexport const dims = { ${dims.join(', ')} }\nexport default ${json}\n`
    },
    transformIndexHtml(html) {
      try {
        const data = JSON.parse(readFileSync(resolve(deckDir(), 'deck.json'), 'utf8'))
        return html.replace(/%DECK_TITLE%/g, data.meta?.title ?? 'Deck')
      } catch {
        return html
      }
    },
  }
}
