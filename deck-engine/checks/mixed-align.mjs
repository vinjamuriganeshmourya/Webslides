/* Port of ../mixed-align-check.mjs: one slide must not mix left-edge blocks and centred blocks in the body zone. */
export function mixedAlign() {
  const zone = document.querySelector('[data-zone="space1"]')
  if (!zone) return { skipped: true }
  const Z = zone.getBoundingClientRect()
  const k = Z.width / zone.offsetWidth || 1
  const W = Z.width / k
  const blocks = []
  const name = (el) => { const t = (el.innerText || '').trim().replace(/\s+/g, ' '); return (t ? `"${t.slice(0, 30)}"` : `<${el.tagName.toLowerCase()}>`) + ` ${Math.round(el.getBoundingClientRect().width / k)}px` }
  const walk = (el) => {
    for (const c of el.children) {
      const cs = getComputedStyle(c)
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'absolute' || cs.position === 'fixed') continue
      const r = c.getBoundingClientRect()
      if (r.width < 24 || r.height < 16) continue
      const left = (r.left - Z.left) / k, right = (Z.right - r.right) / k, width = r.width / k
      if (width >= W - 24) {
        if ([...c.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && cs.textAlign === 'center') blocks.push({ kind: 'centre', what: name(c) })
        walk(c)
        continue
      }
      if (left <= 12) blocks.push({ kind: 'left', what: name(c) })
      else if (Math.abs(left - right) <= 14 && left > 40) blocks.push({ kind: 'centre', what: name(c) })
      else blocks.push({ kind: 'other', what: name(c) })
    }
  }
  walk(zone)
  const lefts = blocks.filter((b) => b.kind === 'left'), centres = blocks.filter((b) => b.kind === 'centre')
  return { mixed: lefts.length > 0 && centres.length > 0, left: lefts.slice(0, 2).map((b) => b.what), centre: centres.slice(0, 2).map((b) => b.what) }
}
