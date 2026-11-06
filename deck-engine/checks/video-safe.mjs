/* Port of ../video-safe.mjs as a page function: nothing may sit in the reserved video area (x 913..1280, y 0..220). */
export function videoSafe() {
  const R = { x: 1280 - 367, y: 0, w: 367, h: 220 }
  const sec = [...document.querySelectorAll('section')].pop()
  if (!sec) return []
  const base = sec.getBoundingClientRect()
  const hidden = (el) => {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      const cs = getComputedStyle(n)
      if (cs.visibility === 'hidden' || cs.opacity === '0' || cs.display === 'none') return true
      if (typeof n.className === 'string' && /pointer-events-none/.test(n.className)) return true
    }
    return false
  }
  const rel = (r) => ({ x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height })
  const intrudes = (b) => b.w > 1 && b.h > 1 && b.x + b.w > R.x + 1 && b.x < R.x + R.w && b.y + b.h > R.y + 1 && b.y < R.y + R.h
  const hits = []
  const push = (kind, b, txt) => hits.push(`${kind} @${Math.round(b.x)},${Math.round(b.y)} ${Math.round(b.w)}x${Math.round(b.h)} ${Math.round(b.x + b.w - R.x)}px in "${(txt || '').trim().slice(0, 30)}"`)
  const tw = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT)
  for (let n = tw.nextNode(); n; n = tw.nextNode()) {
    if (!n.nodeValue || !n.nodeValue.trim()) continue
    const el = n.parentElement
    if (!el || hidden(el)) continue
    const range = document.createRange()
    range.selectNodeContents(n)
    for (const r of range.getClientRects()) { const b = rel(r); if (intrudes(b)) push('text', b, n.nodeValue) }
  }
  for (const el of sec.querySelectorAll('img, svg, canvas, video')) {
    if (hidden(el)) continue
    const b = rel(el.getBoundingClientRect())
    if (intrudes(b)) push(el.tagName.toLowerCase(), b, el.getAttribute('alt') || '')
  }
  for (const el of sec.querySelectorAll('div, span, li, td, th, figure, header, aside')) {
    if (hidden(el)) continue
    const cs = getComputedStyle(el)
    const hasBg = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent'
    const hasBorder = parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderLeftWidth) > 0
    if (!hasBg && !hasBorder) continue
    const b = rel(el.getBoundingClientRect())
    if (b.w > base.width * 0.8 || b.h > base.height * 0.8) continue
    if (intrudes(b)) push('surface', b, el.textContent)
  }
  return hits
}
