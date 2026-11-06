/* Port of ../box-overflow-check.mjs (one step): no text outside its own box, no clipped content. Root = the live slide. */
export function overflow(tol = 1) {
  const root = [...document.querySelectorAll('section')].pop()
  if (!root) return []
  const out = []
  const visible = (el) => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const cs = getComputedStyle(e)
      if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.05) return false
    }
    return true
  }
  const isBox = (el) => {
    const cs = getComputedStyle(el)
    const bg = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent'
    const border = ['Top', 'Right', 'Bottom', 'Left'].some((d) => parseFloat(cs[`border${d}Width`]) > 0 && cs[`border${d}Style`] !== 'none')
    return bg || border || cs.boxShadow !== 'none' || cs.outlineStyle !== 'none' || cs.backgroundImage !== 'none'
  }
  const clips = (el) => { const cs = getComputedStyle(el); return cs.overflowX !== 'visible' || cs.overflowY !== 'visible' }
  const name = (el) => `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').slice(0, 3).join('.') : ''}`
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent.trim()) continue
    const el = n.parentElement
    if (!el || !visible(el) || el.closest('svg')) continue
    const range = document.createRange()
    range.selectNodeContents(n)
    const rects = [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0)
    if (!rects.length) continue
    const t = { l: Math.min(...rects.map((r) => r.left)), r: Math.max(...rects.map((r) => r.right)), t: Math.min(...rects.map((r) => r.top)), b: Math.max(...rects.map((r) => r.bottom)) }
    for (let a = el; a && a !== root.parentElement; a = a.parentElement) {
      if (!(isBox(a) || clips(a))) continue
      const r = a.getBoundingClientRect()
      const over = Math.max(r.left - t.l, t.r - r.right, r.top - t.t, t.b - r.bottom)
      if (over > tol) out.push(`"${n.textContent.trim().slice(0, 34)}" ${Math.round(over)}px outside ${name(a).slice(0, 40)}`)
      break
    }
  }
  for (const el of root.querySelectorAll('*')) {
    if (!visible(el) || el.closest('svg') || !clips(el) || !el.textContent.trim()) continue
    const cs = getComputedStyle(el)
    const x = cs.overflowX !== 'visible' && el.scrollWidth > el.clientWidth + tol
    const y = cs.overflowY !== 'visible' && el.scrollHeight > el.clientHeight + tol
    if (x || y) out.push(`${name(el).slice(0, 40)} clips "${el.textContent.trim().slice(0, 26)}" (${x ? el.scrollWidth - el.clientWidth + 'px wide' : ''}${x && y ? ', ' : ''}${y ? el.scrollHeight - el.clientHeight + 'px tall' : ''})`)
  }
  for (const g of root.querySelectorAll('[data-group]')) {
    if (!visible(g)) continue
    const over = Math.max(g.scrollHeight - g.clientHeight, g.scrollWidth - g.clientWidth)
    if (over > tol) out.push(`${name(g).slice(0, 40)} content ${over}px past its group`)
  }
  return [...new Set(out)]
}
