/*
 * R7 line limit: a point in the left column beside a figure takes at most 2 lines.
 * Figure = the widest element below the header, starting at x >= 380, that holds an svg/img/canvas.
 * Point = a block-level text element (text only or inline children), >= 3 words, fully left of the figure,
 * not in svg, not monospace. Lines = distinct line bands of its client rects.
 */
export function points(MAX = 2) {
  const section = [...document.querySelectorAll('section')].pop()
  if (!section) return { over: [], n: 0 }
  const hd = section.querySelector('h1,h2')
  const top0 = hd ? hd.getBoundingClientRect().bottom - 4 : 150
  const visible = (el) => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const cs = getComputedStyle(e)
      if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.05) return false
    }
    return true
  }
  let fig = null
  for (const el of section.querySelectorAll('div,section,figure')) {
    const r = el.getBoundingClientRect()
    if (r.left < 380 || r.width < 340 || r.height < 180 || r.top < top0 - 20 || r.left > 900) continue
    if (!el.querySelector('svg,img,canvas')) continue
    /* the innermost such element that still holds the whole picture: prefer the smaller box */
    if (!fig || r.width * r.height < fig.width * fig.height) fig = r
  }
  if (!fig) return { over: [], n: 0 }
  const over = []
  let n = 0
  const inlineish = (c) => c.nodeType === 3 || (c.nodeType === 1 && /^(inline|contents)/.test(getComputedStyle(c).display) && !c.querySelector('div,p,li'))
  for (const el of section.querySelectorAll('div,p,li,span,h3,h4,h5')) {
    if (el.closest('svg') || !(el instanceof HTMLElement)) continue
    const cs = getComputedStyle(el)
    if (/^inline$/.test(cs.display)) continue
    if (!el.childNodes.length || ![...el.childNodes].every(inlineish)) continue
    const text = el.textContent.replace(/\s+/g, ' ').trim()
    if (text.split(' ').length < 3 || /mono|courier|consolas/i.test(cs.fontFamily)) continue
    const r = el.getBoundingClientRect()
    if (r.top < top0 || r.right > fig.left + 6 || r.width < 120 || !visible(el)) continue
    if (parseFloat(cs.fontSize) < 14) continue
    const range = document.createRange()
    range.selectNodeContents(el)
    const rects = [...range.getClientRects()].filter((q) => q.width > 1 && q.height > 4).sort((a, b) => a.top - b.top)
    const bands = []
    for (const q of rects) {
      const last = bands[bands.length - 1]
      if (last && q.top < last.bottom - q.height * 0.5) { last.bottom = Math.max(last.bottom, q.bottom); continue }
      bands.push({ top: q.top, bottom: q.bottom })
    }
    n++
    if (bands.length > MAX) over.push(`${bands.length} lines: "${text.slice(0, 50)}"`)
  }
  return { over: [...new Set(over)], n }
}
