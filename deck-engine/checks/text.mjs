/*
 * R8.4 capitals + Title Case for chips, labels, kickers and titles.
 * `capitals` and `titleCase` are SELF-CONTAINED page functions (they are
 * serialised into the browser by Playwright, so they may not use imports).
 * Returns { fails: [string], warns: [string] } for the slide on screen.
 */

export function capitals() {
  const section = [...document.querySelectorAll('section')].pop()
  if (!section) return { fails: [], warns: [] }
  const MONO = /mono|courier|consolas|menlo|code/i
  const SKIP_TAG = new Set(['SCRIPT', 'STYLE', 'PRE', 'CODE', 'KBD', 'SAMP', 'INPUT', 'TEXTAREA'])
  const ALLOW = new Set(['e.g.', 'i.e.', 'vs', 'vs.', 'etc.', 'ok'])
  const idLike = (t) => /[0-9_/@#()\\.\[\]=<>{}]|-/.test(t) || /^[a-z]+[A-Z]/.test(t) || /[a-z][A-Z]/.test(t)
  const visible = (el) => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const cs = getComputedStyle(e)
      if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.05) return false
      if (SKIP_TAG.has(e.tagName)) return false
    }
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0 && r.right > 0 && r.left < 1280 && r.bottom > 0 && r.top < 720
  }
  const hasText = (n) => (n.nodeType === 3 ? n.textContent.trim() : n.nodeType === 1 ? (n.textContent || '').trim() : '')
  const continues = (node) => {
    let n = node
    for (let guard = 0; guard < 12; guard++) {
      let p = n.previousSibling
      while (p && p.nodeType === 3 && !p.textContent.trim()) p = p.previousSibling
      if (p && p.nodeType === 1 && p.tagName === 'BR') return false
      if (p && hasText(p)) return true
      const par = n.parentElement
      if (!par || par === section) return false
      const d = getComputedStyle(par).display
      if (d !== 'inline' && d !== 'contents') return false
      n = par
    }
    return false
  }
  const fails = []
  const warns = []
  const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT)
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = n.textContent.replace(/\s+/g, ' ').trim()
    if (text.length < 2) continue
    const el = n.parentElement
    if (!el || !visible(el)) continue
    const cs = getComputedStyle(el)
    if (MONO.test(cs.fontFamily) || (cs.textTransform && cs.textTransform !== 'none')) continue
    if (!/^[a-z]/.test(text)) continue
    if (continues(n)) continue
    const toks = text.split(' ')
    if (ALLOW.has(toks[0].toLowerCase())) continue
    if (idLike(toks[0])) continue
    if (/^(docker|git|npm|npx|pip|python3?|cd|ls|mkdir|kubectl|aws|curl|sudo|apt|cat|echo|ssh|ping|node|cp|mv|rm|touch|chmod|nano|vim|systemctl|terraform|helm)$/.test(toks[0]) && (toks.length > 1) && (/\s-/.test(text) || toks.length <= 4)) continue
    if (toks.length === 1) warns.push(text.slice(0, 40))
    else fails.push(text.slice(0, 46))
  }
  return { fails: [...new Set(fails)], warns: [...new Set(warns)] }
}

export function titleCase() {
  const section = [...document.querySelectorAll('section')].pop()
  if (!section) return { warns: [], chips: 0 }
  const MONO = /mono|courier|consolas|menlo|code/i
  const SMALL = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'nor', 'in', 'on', 'at', 'of', 'to', 'for', 'by', 'as', 'when', 'not', 'vs', 'via', 'per'])
  const idLike = (t) => /[0-9_/@#()\\.]/.test(t) || /[a-z][A-Z]/.test(t) || t === '&'
  const visible = (el) => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const cs = getComputedStyle(e)
      if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.05) return false
    }
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0 && r.right > 0 && r.left < 1280
  }
  /* chips and labels: EVERY word capitalised, short words included (user, Session 6, 2026-11-06: "Anyone Off The
     Street"); slide titles and kickers keep the short-word exemption (they are the TR's own headings) */
  const bad = (text, strict = false) => {
    const toks = text.split(' ').filter(Boolean)
    const out = []
    toks.forEach((raw, i) => {
      const t = raw.replace(/^[("'“‘]+|[)"'”’,.;:!?]+$/g, '')
      if (!t || idLike(t)) return
      const first = i === 0
      const last = i === toks.length - 1
      const afterColon = i > 0 && /:$/.test(toks[i - 1])
      const parts = t.split('-')
      parts.forEach((part, k) => {
        if (!part || /[0-9]/.test(part)) return
        if (/^[A-Z]/.test(part)) return
        const small = !strict && SMALL.has(part.toLowerCase()) && parts.length === 1
        if (small && !first && !last && !afterColon) return
        if (!strict && parts.length === 1 && /^[a-z]{1,3}$/.test(part) && /^[a-z]/.test(part) && toks.length > 1 && !first && !last && SMALL.has(part)) return
        out.push(part)
      })
    })
    return out
  }
  const warns = []
  let chips = 0
  const seen = new Set()
  const consider = (el, label) => {
    const text = (el.textContent || '').replace(/\s+/g, ' ').trim()
    if (text.length < 5 || text.length > 70 || text.split(' ').length < 2) return
    if (seen.has(text)) return
    seen.add(text)
    if (/^[a-z]/.test(text) && /[a-z][A-Z]|[0-9_/]/.test(text.split(' ')[0])) return
    const b = bad(text, label === 'chip')
    if (b.length) warns.push(`${label} "${text.slice(0, 44)}" (${b.slice(0, 3).join(', ')})`)
  }
  for (const el of section.querySelectorAll('.text-kicker, h1, h2')) if (visible(el)) { chips++; consider(el, 'title') }
  for (const el of section.querySelectorAll('*')) {
    if (el.closest('svg') || el.closest('h1,h2,.text-kicker,pre,code') || !(el instanceof HTMLElement)) continue
    const cs = getComputedStyle(el)
    if (!['inline-flex', 'inline-block', 'flex', 'inline-grid', 'block'].includes(cs.display)) continue
    if (MONO.test(cs.fontFamily) || cs.textTransform !== 'none') continue
    const r = el.getBoundingClientRect()
    if (r.height < 14 || r.height > 52 || r.width > 380 || r.width < 30) continue
    const rad = parseFloat(cs.borderTopLeftRadius) || 0
    const hasBg = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent'
    const hasBorder = parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none'
    const ring = /inset/.test(cs.boxShadow)
    if (!(hasBg || hasBorder || ring) || rad < Math.min(8, r.height / 2 - 1)) continue
    if (!visible(el)) continue
    const own = (el.textContent || '').trim()
    if (!own || /[.!?,;]$/.test(own) || /[.!?] /.test(own)) continue
    if ([...el.children].some((c) => c.children.length > 3)) continue
    chips++
    consider(el, 'chip')
  }
  return { warns, chips }
}

/**
 * A chip or tag never runs past the card it sits in (user, Session 6 slide 14, 2026-11-06: "This Session Focuses On
 * Cloud-Managed" was nowrap and wider than its card; the overflow check missed it because nothing clipped it).
 * For every chip-like element, the nearest ancestor that paints a box (background, border or inset ring) and is
 * larger than the chip must contain it, within 2px.
 */
export function chipInParent() {
  const section = [...document.querySelectorAll('section')].pop()
  if (!section) return { fails: [], checked: 0 }
  const fails = []
  let checked = 0
  const boxed = (cs) => (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') || (parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none') || /inset/.test(cs.boxShadow)
  for (const el of section.querySelectorAll('*')) {
    if (el.closest('svg') || !(el instanceof HTMLElement)) continue
    const cs = getComputedStyle(el)
    if (!['inline-flex', 'inline-block', 'flex'].includes(cs.display) || Number(cs.opacity) < 0.05) continue
    const r = el.getBoundingClientRect()
    if (r.height < 14 || r.height > 64 || r.width < 30) continue
    const rad = parseFloat(cs.borderTopLeftRadius) || 0
    if (!boxed(cs) || rad < Math.min(8, r.height / 2 - 1)) continue
    const own = (el.textContent || '').trim()
    if (!own || own.length < 4) continue
    for (let a = el.parentElement; a && a !== section; a = a.parentElement) {
      const acs = getComputedStyle(a)
      if (!boxed(acs)) continue
      const ar = a.getBoundingClientRect()
      if (ar.width <= r.width + 4 && ar.height <= r.height + 4) continue
      checked++
      const out = Math.max(ar.left - r.left, r.right - ar.right, ar.top - r.top, r.bottom - ar.bottom)
      if (out > 2) fails.push(`"${own.slice(0, 40)}" runs ${Math.round(out)}px outside its card`)
      break
    }
  }
  return { fails, checked }
}
