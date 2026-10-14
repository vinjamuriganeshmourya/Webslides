import { AnimatePresence, motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Group, Lines } from './common'
import { Appear, Swap, sentences, CODE_FS } from './pieces'
import { CodePane, StepCaption } from './trace'
import { OutRow } from './game'
import { LiveClock, Phone } from './Phone'
import { DeckLine, lines, type Prog } from './cards'
import { SPEC } from './spec'

/**
 * HOOK H2: RATING 4.0+. Nine presses.
 *
 * The food app on Ravi's phone: the location, the search, the chip row and
 * six biryani places with their rating badge, veg mark and price for one.
 * Tapping Rating 4.0+ makes the three places under 4.0 DISAPPEAR, as the
 * real app does (its must line; never greyed); Pure Veg instead keeps two.
 * Ten chips: did the coder write a new loop for every button? buttons.py
 * prints the two lists the app showed. Then the cart: each line's amount is
 * a `?` until the room has said it, the item total too; cart.py and
 * total.py print the same numbers. The last press names the three shapes.
 *
 * THE APP IS DRAWN AS THE REAL THING (course rule R5b): red accents, white
 * cards, green rating badges, veg and non-veg marks, the chip row. The app's
 * own colours stay inside the phone (content rule 37); no product name, no
 * logo (rule 12); the spec's captions name the app in words. The phone is
 * 170 x 350 (1 : 2.06) with the live clock; the caption sits under it, so the
 * right column holds the eleven-line buttons.py with its two output rows.
 * Every program ran on CPython 3.12.3.
 */
const H2 = SPEC.H2
const S: string[] = H2.show
const P: Prog[] = H2.code
type Place = { name: string; rating: number; veg: boolean; price_for_one: number }
const PLACES: Place[] = H2.data.places
const KEPT_RATING: string[] = H2.data.kept_rating_4
const KEPT_VEG: string[] = H2.data.kept_veg
type CartLine = { item: string; price: number; qty: number; amount: number }
const CART: CartLine[] = H2.data.cart
const TOTAL = Number(H2.data.item_total)
const CHIPS = ['Rating 4.0+', 'Pure Veg', 'Less than ₹300', 'Offers', 'Fast delivery', 'Rating 4.5+', 'Under 30 min', 'Distance under 2 km', 'Free delivery', 'Previously ordered']
const LABELS: [string, string, string][] = [
  ['filter', 'the buttons', 'keep some'],
  ['map', 'the cart lines', 'one answer per item'],
  ['reduce', 'the item total', 'many into one'],
]
/* the app's own colours, inside the phone only (content rule 37) */
const RED = '#E23744'
const GREEN = '#24963F'
const VEG = '#0F8A3C'
const NONVEG = '#B3261E'
const EASE = [0.22, 1, 0.36, 1] as const
const PW = 156
const PH = 321 /* 1 : 2.06 */
type Filter = 'rating' | 'veg' | null

const kept = (f: Filter) => (f === 'rating' ? PLACES.filter((p) => KEPT_RATING.includes(p.name)) : f === 'veg' ? PLACES.filter((p) => KEPT_VEG.includes(p.name)) : PLACES)
const rupees = (n: number) => `₹${n}`

function Star({ size = 8 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden>
      <path d="M12 2l3 6.6 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21.2l1.4-7L2 9.4l7-.8z" />
    </svg>
  )
}

/** The veg or non-veg mark: a square with a dot, green or red. */
function Mark({ veg, size = 9 }: { veg: boolean; size?: number }) {
  const c = veg ? VEG : NONVEG
  return (
    <span className="inline-grid shrink-0 place-items-center" style={{ width: size, height: size, border: `1.2px solid ${c}`, borderRadius: 2 }}>
      <span className="block rounded-full" style={{ width: size * 0.45, height: size * 0.45, background: c }} />
    </span>
  )
}

function Badge({ rating, size = 8 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-[2px] rounded-[4px] px-1 font-bold text-white" style={{ background: GREEN, fontSize: size, lineHeight: `${size + 5}px` }}>
      {rating.toFixed(1)}
      <Star size={size - 1} />
    </span>
  )
}

function Chip({ on, children, small = false }: { on: boolean; children: string; small?: boolean }) {
  const tween = useTween(300)
  return (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full font-semibold" style={{ fontSize: small ? 7.5 : 13, padding: small ? '2px 6px' : '5px 11px', background: on ? RED : colors.white, color: on ? colors.white : colors.ink, boxShadow: `inset 0 0 0 1px ${on ? RED : colors.line}`, transition: tween }}>
      {children}
    </span>
  )
}

/** The list screen: location, search, the chip row, the places that pass the filter. */
function ListScreen({ filter }: { filter: Filter }) {
  const instant = useInstant()
  const rows = kept(filter)
  return (
    <div className="flex h-full w-full flex-col" style={{ background: '#F7F7F7' }}>
      <div className="flex flex-col gap-[3px] bg-white px-2 pb-1 pt-0.5" style={{ boxShadow: `0 1px 0 ${colors.line}` }}>
        <span className="flex items-center gap-1 text-[8.5px] font-bold" style={{ color: colors.ink }}>
          <svg width="8" height="10" viewBox="0 0 12 16" aria-hidden>
            <path d="M6 0a6 6 0 0 0-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 0 0-6-6zm0 8.2A2.2 2.2 0 1 1 6 3.8a2.2 2.2 0 0 1 0 4.4z" fill={RED} />
          </svg>
          Campus, Main Gate
        </span>
        <span className="flex h-[18px] items-center gap-1 rounded-md px-1.5 text-[8.5px] font-semibold" style={{ background: '#F0F0F0', color: colors.ink }}>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={colors.body} strokeWidth="3" aria-hidden>
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M15.5 15.5L21 21" />
          </svg>
          biryani
        </span>
        <span className="flex flex-wrap gap-[3px]">
          <Chip small on={false}>
            Filters
          </Chip>
          <Chip small on={filter === 'rating'}>
            Rating 4.0+
          </Chip>
          <Chip small on={filter === 'veg'}>
            Pure Veg
          </Chip>
          <Chip small on={false}>
            Less than ₹300
          </Chip>
        </span>
      </div>
      <div className="flex flex-col gap-[3px] px-1.5 pt-1">
        <AnimatePresence initial={false}>
          {rows.map((p) => (
            <motion.div
              key={p.name}
              layout={!instant}
              className="flex h-[26px] items-center gap-1.5 rounded-md bg-white px-1.5"
              style={{ boxShadow: `0 1px 2px rgba(0,0,0,0.06)` }}
              initial={instant ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, height: 0, marginTop: -4, transition: { duration: instant ? 0 : 0.42, ease: EASE } }}
              transition={{ duration: instant ? 0 : 0.42, ease: EASE }}
            >
              <span className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-md" style={{ background: p.veg ? '#E6F4EA' : '#FBEAE8' }}>
                <Mark veg={p.veg} size={8} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="whitespace-nowrap text-[8px] font-bold leading-[10px]" style={{ color: colors.ink }}>
                  {p.name}
                </span>
                <span className="whitespace-nowrap text-[7px] leading-[9px]" style={{ color: colors.body }}>
                  {rupees(p.price_for_one)} for one
                </span>
              </span>
              <Badge rating={p.rating} size={7} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

/** The cart screen: the three lines, each amount a `?` until it is said, and the item total. */
function CartScreen({ amounts, total }: { amounts: boolean; total: boolean }) {
  const tween = useTween(420)
  return (
    <div className="flex h-full w-full flex-col gap-1.5 px-1.5 pt-1.5" style={{ background: '#F7F7F7' }}>
      <span className="text-[8.5px] font-bold" style={{ color: colors.ink }}>
        Your cart · Spice Route
      </span>
      <div className="flex flex-col gap-[3px] rounded-md bg-white p-1.5">
        {CART.map((c) => (
          <span key={c.item} className="flex flex-col gap-[1px] text-[8px] leading-[11px]">
            <span className="flex items-center gap-1">
              <Mark veg={c.item !== 'Chicken biryani'} size={7} />
              <span className="whitespace-nowrap font-semibold" style={{ color: colors.ink }}>
                {c.item}
              </span>
            </span>
            <span className="flex items-center justify-between pl-[11px]">
              <span className="whitespace-nowrap" style={{ color: colors.body }}>
                {rupees(c.price)} × {c.qty}
              </span>
              <span className="whitespace-nowrap text-right font-mono font-bold" style={{ color: amounts ? colors.ink : colors.muted, transition: tween }}>
                {amounts ? rupees(c.amount) : '?'}
              </span>
            </span>
          </span>
        ))}
        <span className="mt-0.5 flex items-center justify-between border-t pt-1 text-[8.5px] font-bold" style={{ borderColor: colors.line, color: colors.ink }}>
          <span>Item total</span>
          <span className="font-mono" style={{ color: total ? GREEN : colors.muted, transition: tween }}>
            {total ? rupees(TOTAL) : '?'}
          </span>
        </span>
      </div>
      <span className="mt-auto mb-2 grid h-[22px] place-items-center rounded-md text-[8.5px] font-bold text-white" style={{ background: RED }}>
        Place order
      </span>
    </div>
  )
}

function AppHeader({ cart }: { cart: boolean }) {
  return (
    <div className="flex items-center justify-between px-2.5 pb-1.5">
      <span className="text-[10px] font-bold text-white">{cart ? 'Cart' : 'Delivery'}</span>
      <span className="grid h-[14px] w-[14px] place-items-center rounded-full bg-white/25">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" aria-hidden>
          <path d="M3 4h2l2.4 11h11L21 7H6" />
          <circle cx="9" cy="20" r="1.5" fill="#FFFFFF" />
          <circle cx="17" cy="20" r="1.5" fill="#FFFFFF" />
        </svg>
      </span>
    </div>
  )
}

/** The six places, big, for the back of the room: the same rows the phone shows, dropped the same way. */
function PlacesTable({ filter }: { filter: Filter }) {
  const instant = useInstant()
  const rows = kept(filter)
  return (
    <div className="flex flex-col gap-1.5">
      <AnimatePresence initial={false}>
        {rows.map((p) => (
          <motion.div
            key={p.name}
            layout={!instant}
            className="flex h-[40px] items-center gap-3 rounded-xl bg-white px-3"
            style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}
            initial={instant ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0, marginTop: -6, transition: { duration: instant ? 0 : 0.42, ease: EASE } }}
            transition={{ duration: instant ? 0 : 0.42, ease: EASE }}
          >
            <Mark veg={p.veg} size={14} />
            <span className="w-[190px] whitespace-nowrap text-[16px] font-bold" style={{ color: colors.ink }}>
              {p.name}
            </span>
            <Badge rating={p.rating} size={12} />
            <span className="ml-auto whitespace-nowrap font-mono text-[14px] font-semibold" style={{ color: colors.body }}>
              {rupees(p.price_for_one)} for one
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/** The cart, big: price times how many on every line, the amount a `?` until said, the item total. */
function CartTable({ amounts, total }: { amounts: boolean; total: boolean }) {
  const tween = useTween(420)
  return (
    <div className="flex flex-col gap-0.5 rounded-xl bg-white px-3 py-1.5" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
      {CART.map((c) => (
        <span key={c.item} className="flex h-[24px] items-center gap-3 text-[14px]">
          <Mark veg={c.item !== 'Chicken biryani'} size={12} />
          <span className="w-[170px] whitespace-nowrap font-semibold" style={{ color: colors.ink }}>
            {c.item}
          </span>
          <span className="whitespace-nowrap font-mono" style={{ color: colors.body }}>
            {rupees(c.price)} × {c.qty}
          </span>
          <span className="ml-auto w-[64px] whitespace-nowrap text-right font-mono font-bold" style={{ color: amounts ? colors.ink : colors.muted, transition: tween }}>
            {amounts ? rupees(c.amount) : '?'}
          </span>
        </span>
      ))}
      <span className="mt-0.5 flex h-[26px] items-center justify-between border-t pt-1 text-[15px] font-bold" style={{ borderColor: colors.line, color: colors.ink }}>
        <span>Item total</span>
        <span className="font-mono" style={{ color: total ? '#137A3A' : colors.muted, transition: tween }}>
          {total ? rupees(TOTAL) : '?'}
        </span>
      </span>
    </div>
  )
}

export function FoodHook() {
  const beat = useBeats(9)
  const filter: Filter = beat === 2 || beat === 5 ? 'rating' : beat === 3 ? 'veg' : null
  const cart = beat >= 6
  const amounts = beat >= 7
  const total = beat >= 8
  const caption = beat === 1 ? S[1] : beat === 2 ? S[2] : beat === 3 ? S[4] : beat === 4 ? S[5] : beat === 5 ? S[6] : beat === 6 ? null : beat === 7 ? S[7] : beat === 8 ? `${S[8]} ${S[9]}` : S[10]
  const prog = beat === 5 ? P[0] : beat === 7 ? P[1] : P[2]
  return (
    <>
      <div className="flex items-stretch gap-3">
        <Group pad={8} className="flex w-[300px] shrink-0 flex-col items-center gap-1.5" style={{ height: 413 }} active={beat <= 3 || beat === 6}>
          <Phone width={PW} height={PH} island={null} time={<LiveClock />} top={{ bg: RED, light: true, header: <AppHeader cart={cart} /> }}>
            <div className="relative h-full w-full">
              <Swap k={cart ? 'cart' : 'list'} overlay>
                {cart ? <CartScreen amounts={amounts} total={total} /> : <ListScreen filter={filter} />}
              </Swap>
            </div>
          </Phone>
          <div className="w-full">
            <StepCaption text={caption} size={13.5} h={70} />
          </div>
        </Group>
        <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-2.5" style={{ height: 413 }} active={beat === 4 || beat === 5 || beat >= 7}>
          <Swap k={beat <= 3 ? 'places' : beat === 4 ? 'chips' : beat === 5 ? 'code' : beat === 6 ? 'cart' : beat <= 8 ? 'cartcode' : 'labels'}>
            {beat <= 3 ? (
              <div className="flex flex-col gap-2.5">
                <DeckLine size={17}>{S[0]}</DeckLine>
                <PlacesTable filter={filter} />
                <div style={{ minHeight: 24 }}>
                  {beat === 2 && (
                    <Appear>
                      <p className="text-[13.5px] font-semibold" style={{ color: colors.muted }}>
                        <Lines lines={sentences(S[3])} />
                      </p>
                    </Appear>
                  )}
                </div>
              </div>
            ) : beat === 4 ? (
              <div className="flex flex-wrap content-start gap-2.5 pt-1">
                {CHIPS.map((c, i) => (
                  <Appear key={c} delay={i * 90}>
                    <Chip on={i < 2}>{c}</Chip>
                  </Appear>
                ))}
              </div>
            ) : beat === 5 ? (
              <div className="flex flex-col gap-1.5">
                <CodePane code={prog.src} fontSize={CODE_FS} rows={12} dense mark={[11, 12]} />
                {lines(prog.output).map((l, i) => (
                  <OutRow key={i} lines={[l]} label={i === 0 ? 'Line 11' : 'Line 12'} />
                ))}
              </div>
            ) : beat === 6 ? (
              <div className="flex flex-col gap-2.5">
                <DeckLine size={16}>Ravi's cart from Spice Route</DeckLine>
                <CartTable amounts={false} total={false} />
              </div>
            ) : beat <= 8 ? (
              <div className="flex flex-col gap-2">
                <CartTable amounts={amounts} total={total} />
                <CodePane code={prog.src} fontSize={CODE_FS} rows={7} dense highlight={prog.src.split('\n').length} />
                <OutRow lines={lines(prog.output)} />
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-1">
                {LABELS.map(([word, moment, shape], i) => (
                  <Appear key={word} delay={i * 180}>
                    <div className="flex h-[64px] items-center gap-4 rounded-xl bg-white px-4" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
                      <span className="w-[110px] font-mono text-[22px] font-bold" style={{ color: colors.brandDark }}>
                        {word}
                      </span>
                      <span className="w-[180px] text-[17px] font-semibold" style={{ color: colors.body }}>
                        {moment}
                      </span>
                      <span className="text-[17px] font-bold" style={{ color: colors.ink }}>
                        {shape}
                      </span>
                    </div>
                  </Appear>
                ))}
              </div>
            )}
          </Swap>
        </Group>
      </div>
      <StepControls at={beat} total={9} />
    </>
  )
}
