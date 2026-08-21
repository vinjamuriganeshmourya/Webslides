// Post-build step for the single-file bundle: rewrites every "/assets/..."
// and "/shots/..." reference in dist-single/index.html to a base64 data URI
// read from public/, so the page needs no sibling files at all.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const htmlPath = join(root, 'dist-single', 'index.html')
let html = readFileSync(htmlPath, 'utf8')

const MIME = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
  gif: 'image/gif', svg: 'image/svg+xml', webp: 'image/webp',
  ico: 'image/x-icon', mp4: 'video/mp4',
}

const refs = [...new Set(html.match(/\/(?:assets|shots)\/[\w./-]+\.\w+/g) ?? [])]
let inlined = 0, missing = []
for (const ref of refs) {
  const file = join(root, 'public', ref)
  if (!existsSync(file)) { missing.push(ref); continue }
  const ext = ref.split('.').pop().toLowerCase()
  const dataUri = `data:${MIME[ext] ?? 'application/octet-stream'};base64,${readFileSync(file).toString('base64')}`
  html = html.split(ref).join(dataUri)
  inlined++
}

writeFileSync(htmlPath, html)
console.log(`Inlined ${inlined}/${refs.length} assets. Output: ${(html.length / 1024 / 1024).toFixed(2)} MB`)
if (missing.length) console.log('Missing files:', missing.join(', '))
