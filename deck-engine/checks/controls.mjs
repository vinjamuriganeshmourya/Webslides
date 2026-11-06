/*
 * Generic controls-clear (adapted from ../controls-clear-check.mjs, which needs the PF decks' [data-spec]/Autoplay markup).
 * Content of the live slide must keep GAP px away from (a) buttons that live INSIDE the slide (Next / Autoplay)
 * and (b) the player's control bar (the box around the "Toggle fullscreen" button), when that bar is visible.
 */
export function controls(GAP = 6) {
  const sec = [...document.querySelectorAll('section')].pop()
  if (!sec) return []
  const keep = []
  for (const b of sec.querySelectorAll('button')) { const r = b.getBoundingClientRect(); if (r.width > 4 && r.height > 4) keep.push(r) }
  let bar = document.querySelector('button[aria-label="Toggle fullscreen"]')
  while (bar && bar.getBoundingClientRect().width < 300) bar = bar.parentElement
  if (bar && !sec.contains(bar)) { const r = bar.getBoundingClientRect(); if (Number(getComputedStyle(bar).opacity) > 0.3 && r.top < 700) keep.push(r) }
  if (!keep.length) return []
  const seen = (el) => { for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.05) return false } return true }
  const drawn = (el) => {
    const cs = getComputedStyle(el)
    if ([...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return true
    if (['svg', 'IMG', 'IFRAME'].includes(el.tagName) || el.tagName === 'img') return true
    return (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') || cs.boxShadow !== 'none' || parseFloat(cs.borderTopWidth) > 0
  }
  const out = []
  for (const el of sec.querySelectorAll('*')) {
    if (el.closest('button') || el.closest('footer') || (el.closest('svg') && el.tagName !== 'svg')) continue
    const r = el.getBoundingClientRect()
    if (r.width < 2 || r.height < 2 || r.width > 1000 || r.height > 520) continue
    if (getComputedStyle(el).pointerEvents === 'none' && !el.textContent.trim()) continue
    if (!drawn(el) || !seen(el)) continue
    for (const k of keep) {
      if (r.left < k.right + GAP && r.right > k.left - GAP && r.top < k.bottom + GAP && r.bottom > k.top - GAP) {
        out.push(`${el.tagName.toLowerCase()} "${(el.textContent || '').trim().slice(0, 28)}" ${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)} vs control at y${Math.round(k.top)}`)
        break
      }
    }
  }
  return out
}
