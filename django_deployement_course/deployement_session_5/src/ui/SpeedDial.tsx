import { RevealGroup, Reveal } from '@/motion/Reveal'
import { colors } from '@/design/tokens'

/**
 * Kiran's phone, as an iPhone showing the actual dial pad.
 *
 * WHY THIS EXISTS, AND THE THREE REVISIONS BEHIND IT.
 *
 * It began as an `AnalogyMap`: two columns of text, "Full phone number" beside
 * "docker compose up -d --build". That is the analogy asserted rather than told.
 * The review then asked for three things in turn, and each one made it more
 * concrete rather than more decorative:
 *
 *   > "give slide of name a character, kiran has speed dial of multiple numbers
 *      in his phone. 1 means mom, 2 means dad and 3 means sister. now he dont
 *      remember the number he just hits those numbers"
 *   > "Use Iphone UI for Spead dail and represent mapping"
 *   > "add UI of Actual Speed dail with dail pad instead representing numbers"
 *
 * So the mapping is no longer drawn BESIDE the phone as badges and arrows. It is
 * drawn where it actually lives: on the keypad. Keys 1, 2 and 3 carry a name
 * where every other key carries its letters, which is the whole idea in one
 * picture -- the short thing you press, and the person it reaches.
 *
 * WHY THE REAL KEYPAD BEATS AN ABSTRACTION OF ONE. A row of numbered badges is a
 * diagram, and a diagram has to be decoded before it can be believed. Everyone in
 * the room has this exact keypad in their pocket, so it is read instantly and
 * costs them nothing, which is the only thing an analogy is for: it has to be
 * cheaper to understand than the thing it explains.
 *
 * WHAT IT MUST NOT BECOME. Content rule 8: a figure depicts the slide's own
 * concept, and the concept is A SHORT NAME STANDING IN FOR A LONG ONE. The
 * letters under the unassigned keys, the call button and the status bar are there
 * to make the keypad recognisable as a keypad. Anything further about telephony
 * is decoration and should be cut.
 *
 * WHY IT IS NOT AN SVG. Content rule 17. This figure is mostly labels, and two
 * SVG figures shipped in session 4 with their `<text>` labels overlapping while
 * all three harnesses reported clean, because an `<svg>` is one DOM rectangle to
 * them. Every key here is a real element in a real grid.
 */

interface DialKey {
  digit: string
  /** The letters iOS prints under an unassigned key. */
  letters?: string
  /** A speed-dial assignment. When set, it replaces the letters and lights the key. */
  who?: string
}

/*
  THE PAD, IN THE ORDER A PHONE PRINTS IT.

  Twelve keys, and only the first three are assigned. That ratio matters: the
  three lit keys have to read as a few saved shortcuts among the ordinary keys,
  not as the whole keypad being special. The same is true of a Makefile, which is
  a handful of named targets in a shell that still has every command in it.
*/
const PAD: DialKey[] = [
  { digit: '1', who: 'Mom' },
  { digit: '2', who: 'Dad' },
  { digit: '3', who: 'Sister' },
  { digit: '4', letters: 'GHI' },
  { digit: '5', letters: 'JKL' },
  { digit: '6', letters: 'MNO' },
  { digit: '7', letters: 'PQRS' },
  { digit: '8', letters: 'TUV' },
  { digit: '9', letters: 'WXYZ' },
  { digit: '∗', letters: '' },
  { digit: '0', letters: '+' },
  { digit: '#', letters: '' },
]

/** The numbers Kiran used to have to know. Context for the pad, never content. */
const HIDDEN = [
  { who: 'Mom', number: '+91 98455 *****' },
  { who: 'Dad', number: '+91 99801 *****' },
  { who: 'Sister', number: '+91 90360 *****' },
]

/** The iOS status-bar glyphs, small enough to read as texture rather than data. */
function StatusBar() {
  return (
    <div className="flex items-center justify-between px-3.5 pb-0.5 pt-1">
      <span className="font-heading text-[9.5px] font-bold" style={{ color: colors.ink }}>
        9:41
      </span>
      <span className="flex items-center gap-[3px]">
        {[3.5, 5.5, 7.5, 9.5].map((h) => (
          <span key={h} className="w-[2.5px] rounded-sm" style={{ height: h, background: colors.ink }} />
        ))}
        <span
          className="ml-1 flex h-[9px] w-[16px] items-center rounded-[3px] border px-[1.5px]"
          style={{ borderColor: colors.ink }}
        >
          <span className="h-[4px] w-[9px] rounded-[1px]" style={{ background: colors.ink }} />
        </span>
      </span>
    </div>
  )
}

export function SpeedDial({ className = '' }: { className?: string }) {
  return (
    <RevealGroup className={`flex items-start gap-9 ${className}`} stagger={0.12}>
      <Reveal dir="up">
        {/*
          THE DEVICE. The bezel is a dark ring with the screen inset inside it,
          which is what gives the shape a thickness a single-border rectangle
          cannot have. The shadow is brand-tinted rather than neutral, per
          STYLE_GUIDE section 9.
        */}
        {/*
          300px WIDE, WHICH IS AS BIG AS THE COLUMN TAKES.

          It was 254px, sized to leave room for a narrow list beside it. Now that
          the right-hand column carries the whole argument the phone can have its
          own column outright: *"make phone full width"*. 300px plus the 36px gap
          leaves 816px for the right, which is more than that column needs, and it
          keeps the device readable from the back of a room rather than merely
          identifiable.
        */}
        <div
          className="shrink-0 rounded-[42px] p-[9px]"
          style={{
            width: 300,
            background: 'linear-gradient(150deg, #3A4658 0%, #1C2531 48%, #2A3442 100%)',
            boxShadow: [
              `0 18px 40px -20px ${colors.brandDeep}8c`,
              'inset 0 1px 0 0 rgba(255,255,255,0.28)',
              'inset 0 -1px 0 0 rgba(0,0,0,0.45)',
            ].join(', '),
          }}
        >
          <div
            className="relative overflow-hidden rounded-[34px]"
            style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 74%, #F4F7FC 100%)' }}
          >
            {/* The Dynamic Island. */}
            <div
              className="absolute left-1/2 top-[7px] h-[17px] w-[80px] -translate-x-1/2 rounded-full"
              style={{ background: '#101720' }}
            />

            <div className="pt-[26px]">
              <StatusBar />

              {/*
                THE PAD HAS ITS FULL HEIGHT BACK.

                It was cut to 41px keys to make room for a callout underneath the
                figure. The callout is now in the right-hand column instead -- the
                review pointed out that half the slide was empty -- so the whole
                well below the lead belongs to the phone, and the keys are the
                size a phone actually draws them.
              */}
              <div className="grid grid-cols-3 gap-x-2.5 gap-y-2 px-3.5 pb-2 pt-1">
                {PAD.map((k) => {
                  const assigned = !!k.who
                  return (
                    <span
                      key={k.digit}
                      className="mx-auto grid h-[56px] w-[56px] place-items-center rounded-full"
                      style={
                        assigned
                          ? {
                              /* A lit key: the brand ramp, a tinted drop shadow
                                 and a white top hairline, so an assigned key
                                 reads as raised rather than merely coloured. */
                              background: `linear-gradient(135deg, #4C7AFD 0%, ${colors.brand} 46%, ${colors.brandDark} 100%)`,
                              boxShadow: `0 3px 8px -3px ${colors.brandDeep}80, inset 0 1px 0 0 #FFFFFF59`,
                            }
                          : {
                              /* An ordinary key: the grey iOS disc, kept flat on
                                 purpose. Lighting all twelve would make the three
                                 that matter stop standing out. */
                              background: 'linear-gradient(180deg, #F2F4F8 0%, #E8ECF3 100%)',
                              boxShadow: 'inset 0 1px 0 0 #FFFFFF',
                            }
                      }
                    >
                      <span className="flex flex-col items-center leading-none">
                        <span
                          className="font-heading text-[21px] font-bold"
                          style={{ color: assigned ? '#FFFFFF' : colors.ink }}
                        >
                          {k.digit}
                        </span>
                        {/* An assigned key prints the NAME where the letters
                            would go. That substitution is the figure's whole
                            argument, in the place the eye already looks. */}
                        {(k.who || k.letters) && (
                          <span
                            className="mt-[2px] font-heading text-[8.5px] font-bold uppercase tracking-wider"
                            style={{ color: assigned ? '#FFFFFFd9' : colors.muted }}
                          >
                            {k.who ?? k.letters}
                          </span>
                        )}
                      </span>
                    </span>
                  )
                })}
              </div>

              {/* The call button. One of the two details that make the screen
                  unmistakably the Phone app. */}
              <div className="grid place-items-center pb-1.5">
                <span
                  className="grid h-[48px] w-[48px] place-items-center rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #4CD97B 0%, #22B85B 55%, #12994A 100%)',
                    boxShadow: '0 3px 9px -3px rgba(18,153,74,0.6), inset 0 1px 0 0 rgba(255,255,255,0.45)',
                  }}
                >
                  {/* A handset, drawn as one path. Small enough that a vendor
                      glyph would be indistinguishable from this. */}
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden>
                    <path d="M6.6 10.8c1.2 2.3 3.1 4.2 5.4 5.4l1.8-1.8c.3-.3.7-.4 1.1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V19c0 .6-.4 1-1 1C10.4 20 4 13.6 4 5.6c0-.6.4-1 1-1h3.2c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1.1l-2 1.6z" />
                  </svg>
                </span>
              </div>

              {/* The home indicator, the second unmistakable detail. */}
              <div className="mx-auto mb-2 h-[4px] w-[94px] rounded-full" style={{ background: '#C2CCDA' }} />
            </div>
          </div>
        </div>
      </Reveal>

      {/* WHAT THE THREE KEYS SAVED HIM FROM. The last five digits are masked, on
          the user's ask, so nothing on the slide reads as a real person's phone
          number. The digit COUNT is preserved by the asterisks, which is the part
          that carries the point: the length is the cost, not the joke. */}
      {/*
        THE RIGHT-HAND COLUMN, WHICH IS NOW HALF THE SLIDE.

        The figure used to be a phone with a narrow list beside it, and the
        payoff sentence sat in a callout underneath. That left the right third of
        the frame empty and forced the phone to shrink, which the review caught:
        *"on the speeddail slide the right is full empty we can place on the
        right."*

        So the column carries both halves of the argument now -- what Kiran no
        longer types, and what he does instead -- and the slide needs no callout
        at all.

        `pt-4` IS A VIDEO-RECTANGLE GUARD, NOT SPACING. This column is wide
        enough to cross x=913, and the top right of the canvas
        (x 913..1280, y 0..220) is held for the instructor video. The well opens
        at about y=211 under a one-line lead, so without this the column's first
        line lands inside the reserved band and `video-safe.mjs` fails the deck.
      */}
      <Reveal dir="up">
        <div className="pt-4">
          <p
            className="mb-3 font-heading text-body-sm font-bold uppercase tracking-wider"
            style={{ color: colors.muted }}
          >
            What he never types any more
          </p>
          <div className="flex flex-col gap-2.5">
            {HIDDEN.map((h) => (
              <div
                key={h.who}
                className="flex items-baseline gap-3 rounded-xl border px-3.5 py-2.5"
                style={{
                  borderColor: colors.line,
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FDFEFF 58%, #F5F8FC 100%)',
                  boxShadow: `inset 0 1px 0 0 #FFFFFF, 0 2px 7px -6px ${colors.brandDeep}59`,
                }}
              >
                <span className="w-[54px] shrink-0 font-heading text-body-sm font-bold" style={{ color: colors.ink }}>
                  {h.who}
                </span>
                <span
                  className="font-mono text-[15px] tracking-tight"
                  style={{ color: colors.muted, textDecoration: 'line-through' }}
                >
                  {h.number}
                </span>
              </div>
            ))}
          </div>

          {/*
            THE PAYOFF, AS ITS OWN PANEL RATHER THAN AS A CALLOUT.

            It reads as the deck's `success` callout on purpose -- same tint, same
            tick, same weight -- because that is the register the room has learned
            means "this is the point". It sits here rather than under the figure so
            it lands beside the thing it is about.
          */}
          <div
            className="mt-5 flex items-start gap-3 rounded-card border-l-[3px] px-4 py-3.5"
            style={{
              borderColor: colors.success,
              background: `linear-gradient(135deg, #F4FDF7 0%, #EAFBF1 55%, #D9F5E5 100%)`,
              boxShadow: `0 4px 14px -8px ${colors.success}80, inset 0 1px 0 0 #FFFFFF`,
            }}
          >
            <span
              className="mt-[3px] grid h-6 w-6 shrink-0 place-items-center rounded-lg"
              style={{
                background: `linear-gradient(135deg, #4CD97B 0%, ${colors.success} 60%, #12994A 100%)`,
                boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.5)`,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <p className="text-body-lg font-semibold leading-snug" style={{ color: '#0E5A32' }}>
              Kiran presses one key and does not remember a single one of the numbers
            </p>
          </div>
        </div>
      </Reveal>
    </RevealGroup>
  )
}
