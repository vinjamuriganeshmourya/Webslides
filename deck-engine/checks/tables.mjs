/*
 * R8.3 table highlights. Tables in these decks are grids of div rows (VisualTable) or real <table>s.
 * A "row group" = 2+ sibling elements with the same grid-template-columns (2+ tracks), or <tr>s.
 * A row counts as highlighted at `?still` when it carries an orange background or an orange inset shadow.
 * Returns { tables: [{rows, highlighted: [idx...], last: bool}] }, indexes 1-based within the group.
 */
export function tables() {
  const section = [...document.querySelectorAll('section')].pop()
  if (!section) return { tables: [] }
  const parse = (s) => [...s.matchAll(/rgba?\(([^)]+)\)/g)].map((m) => m[1].split(/[ ,\/]+/).map(Number))
  const orange = (c) => {
    const [r, g, b, a = 1] = c
    if (a < 0.2) return false
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b)
    if (mx - mn < 18) return false
    const d = mx - mn
    let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4
    h = (h * 60 + 360) % 360
    const l = (mx + mn) / 510
    const s = d / 255 / (1 - Math.abs(2 * l - 1) || 1)
    return h >= 14 && h <= 46 && s >= 0.55
  }
  const lit = (el) => {
    const cs = getComputedStyle(el)
    if (Number(cs.opacity) < 0.05) return false
    const bg = parse(cs.backgroundColor).concat(parse(cs.backgroundImage)).some(orange)
    const sh = (cs.boxShadow || '').split(/,(?![^(]*\))/).some((p) => /inset/.test(p) && parse(p).some(orange))
    return bg || sh
  }
  const out = []
  const parents = new Set()
  for (const tr of section.querySelectorAll('tr')) parents.add(tr.parentElement)
  for (const el of section.querySelectorAll('div,ul,tbody')) {
    const kids = [...el.children].filter((k) => getComputedStyle(k).display === 'grid')
    if (kids.length < 2) continue
    const key = (k) => getComputedStyle(k).gridTemplateColumns
    const cols = key(kids[0])
    if (cols.split(' ').length < 2) continue
    if (kids.every((k) => key(k) === cols)) parents.add(el)
  }
  for (const p of parents) {
    const rows = [...p.children].filter((k) => k.tagName === 'TR' || getComputedStyle(k).display === 'grid').filter((k) => k.getBoundingClientRect().height > 4)
    if (rows.length < 2) continue
    const vis = rows.filter((r) => Number(getComputedStyle(r).opacity) > 0.05)
    const hi = []
    rows.forEach((r, i) => { if (lit(r)) hi.push(i + 1) })
    out.push({ rows: rows.length, shown: vis.length, highlighted: hi, last: hi.includes(rows.length) })
  }
  return { tables: out }
}
