/**
 * Design tokens for the six chrome slides.
 *
 * TYPEFACES come from the NxtWave PPT style guide (`slidestraining/NxtWave PPT
 * Template/02`): Sora for the big words and titles, DM Sans for everything
 * else. EVERYTHING ELSE — sizes, weights, colours, positions — is measured off
 * the reference renders in `slidestraining/`, which are the source of truth
 * (decision of 2026-10-09). That is why colours outside the guide's palette
 * appear below: they are in the references.
 *
 * CANVAS: 1920x1080, the frame the references were exported at. Every number
 * in this folder is a px on that canvas.
 */

export const SLIDE_WIDTH = 1920
export const SLIDE_HEIGHT = 1080

export const colors = {
  /* the style guide's palette */
  blue: '#2D63FB',
  deep: '#0146C7',
  navy: '#00254B',
  black: '#1C1C1C',
  white: '#FFFFFF',
  /* reference-only colours (agenda) */
  /** agenda kicker and title: pure black, measured */
  ink: '#000000',
  /** agenda ground, measured (240,243,252) */
  paper: '#F0F3FC',
  /** agenda corner wash at full strength, back-solved from three alphas */
  azure: '#2989FD',
} as const

export const fonts = {
  title: "'Sora', system-ui, sans-serif",
  body: "'DM Sans', system-ui, sans-serif",
} as const

/**
 * Text styles, one per use, sized so the ink height of the reference string
 * is reproduced in the style-guide typeface (fitted with the real TTFs, then
 * checked in the browser). The reference height each one reproduces is noted.
 */
export const type = {
  /**
   * "Welcome": sized so the word is as WIDE as the reference's (916px); at the
   * reference's ink height Sora ran 999px and read too big (review of
   * 2026-10-09, "reduce the font size"). Ink now ≈ 144px tall.
   */
  heroWelcome: { fontFamily: fonts.title, fontWeight: 600, fontSize: 192, lineHeight: 1 },
  /** "Thank You!" / "All The Best": width-matched the same way (822 / 876px). */
  heroClosing: { fontFamily: fonts.title, fontWeight: 600, fontSize: 150, lineHeight: 1 },
  /** next-session name: ink 123px per line, 163px line pitch */
  sessionTitle: { fontFamily: fonts.title, fontWeight: 600, fontSize: 126, lineHeight: 163 / 126 },
  /** section-breaker title: the old frame's "Functions", ink 78px */
  sectionTitle: { fontFamily: fonts.title, fontWeight: 600, fontSize: 101, lineHeight: 1 },
  /** section-breaker kicker: 17px caps, tracked out to 418px over 26 characters */
  sectionKicker: {
    fontFamily: fonts.body,
    fontWeight: 500,
    fontSize: 22,
    lineHeight: 1,
    letterSpacing: '0.16em',
    textTransform: 'uppercase' as const,
  },
  /** "Next Session" in the chip: ink 58px */
  chip: { fontFamily: fonts.body, fontWeight: 500, fontSize: 77, lineHeight: 1 },
  /* agenda */
  agendaKicker: { fontFamily: fonts.body, fontWeight: 500, fontSize: 34, lineHeight: 1.2 },
  agendaTitle: { fontFamily: fonts.body, fontWeight: 600, fontSize: 69, lineHeight: 1.2 },
  agendaNumber: { fontFamily: fonts.body, fontWeight: 300, fontSize: 57, lineHeight: 1 },
  agendaItem: { fontFamily: fonts.body, fontWeight: 700, fontSize: 36, lineHeight: 1.3 },
  agendaBody: { fontFamily: fonts.body, fontWeight: 400, fontSize: 30, lineHeight: 1.2 },
} as const

/* Geometry shared by the references, measured off the pixels. */

/** Every background ring is this radius, with a 3px stroke. */
export const ARC_RADIUS = 790
export const ARC_STROKE = 3

/** The corner mark: 100px wide at (1780, 992). */
export const CORNER_LOGO = { left: 1780, top: 992, width: 100 } as const

/** The centred mark on the welcome / closing slides. */
export const HERO_LOGO_WIDTH = 332
