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
