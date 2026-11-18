/* R8.5: a rendered <img> keeps its natural aspect ratio within 3% (object-fit contain/cover/scale-down is exempt). */
export function logos() {
  const section = [...document.querySelectorAll('section')].pop()
  if (!section) return { bad: [], n: 0 }
  const bad = []
  let n = 0
  for (const img of section.querySelectorAll('img')) {
    const cs = getComputedStyle(img)
    if (cs.display === 'none' || !img.naturalWidth || !img.naturalHeight) continue
    if (/contain|cover|scale-down/.test(cs.objectFit)) continue
    const r = img.getBoundingClientRect()
    if (r.width < 2 || r.height < 2) continue
    /* a transformed ancestor scales both axes the same way, so the ratio is still comparable */
    n++
    const rat = r.width / r.height, nat = img.naturalWidth / img.naturalHeight
    const diff = Math.abs(rat / nat - 1)
    if (diff > 0.03) bad.push(`${(img.alt || (img.src.startsWith('data:') ? 'inline image' : img.src.split('/').pop()) || 'img').slice(0, 30)} ${Math.round(r.width)}x${Math.round(r.height)} vs natural ${img.naturalWidth}x${img.naturalHeight} (${(diff * 100).toFixed(0)}% off)`)
  }
  return { bad, n }
}

/*
 * An image that shows NOTHING: no source, or a source that did not load. `scripts/prune-icons.mjs` drops the library
 * icons a deck's script never names (2026-11-13, low-end pass); a slide that still asks for one of those would get
 * exactly this, an <img> with an empty src, and R8.5 above skips any image with no natural size, so nothing else
 * would say so.
 */
export function emptyImages() {
  const section = [...document.querySelectorAll('section')].pop()
  if (!section) return { bad: [], n: 0 }
  const bad = []
  let n = 0
  for (const img of section.querySelectorAll('img')) {
    if (getComputedStyle(img).display === 'none') continue
    n++
    const src = img.getAttribute('src') ?? ''
    const r = img.getBoundingClientRect()
    const where = `at ${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)}`
    if (!src) bad.push(`<img> with no source ${where}`)
    else if (img.complete && !img.naturalWidth) bad.push(`<img> whose source did not load ${where} (${src.startsWith('data:') ? src.slice(0, 28) + '...' : src.split('/').pop()})`)
  }
  return { bad, n }
}
