import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { Card, Stage, At, Fade, Label, Note, Arrow, Caption, Rail, Slider, Traveller, Num, useBeatState, useTicker, STILL, BOX_W } from './scene'
import { Idling, BUST } from './Cast'
import { MEERA, RAVI, ARJUN } from './people'
import { Calendar, CloudShape, Coin, Coins, KeyIcon, Laptop, MeterDial, ProviderBuilding, Rack, ServerRoom, ServerUnit, Stopwatch, Toolbox, useEase, type UnitState } from './art'

/**
 * SECTION 1, CLOUD COMPUTING BASICS (SCQA): the need (Ravi's rack bought on a
 * guess), the definition, its three branches, the analogy, the five contrasts,
 * the architecture, and the three drivers. Every string is the reference's.
 */

/* ================================================================== 5 · Why Cloud Emerged */

const OWNED = 6

function needOf(d: number) {
  return Math.round(d * 9)
}

export function WhyCloud({ lesson }: { lesson: string }) {
  const beat = useBeats(4)
  const [demand, setDemand] = useBeatState<number>(beat, (b) => (b === 3 ? 0.85 : b === 4 ? 0.25 : 0.4))
  const need = needOf(demand)
  const units: UnitState[] = Array.from({ length: OWNED }, (_, i) => (i < need ? 'run' : 'idle'))
  const idle = Math.max(0, OWNED - need)
  const short = Math.max(0, need - OWNED)
  const ease = useEase()
  return (
    <Card id="why-emerged" kicker="Cloud Computing Overview" title="Why Cloud Emerged" lead="Traditional IT ties hardware purchases to guesses about future demand, locking capital years before the load actually arrives" lesson={lesson} beat={beat} total={4}>
      <div className="flex gap-[30px]">
        <Stage w={540} h={292} active={beat === 1 || beat === 3}>
          <At x={18} y={14}>
            <Label strong size={16} tone="dark">On-premise IT</Label>
            <Note size={14} className="mt-1.5">organisation buys, installs, maintains hardware</Note>
          </At>
          <At x={30} y={84}><Rack w={96} units={units} locked /></At>
          <At x={150} y={92}>
            <Idling key={short > 0 ? 'worried' : 'ok'} cfg={RAVI} scale={0.5} seed={2} expression={short > 0 ? 'worried' : 'neutral'} />
          </At>
          <At x={292} y={96} w={230}>
            <div className="flex flex-col items-start gap-2">
              <Label tone="plain" size={13}>{`${OWNED} servers bought on a guess`}</Label>
              <Fade on={beat >= 3 && idle > 0}>
                <Label tone="warn" size={13}>{`${idle} paid, idle`}</Label>
              </Fade>
              <Fade on={beat >= 3 && short > 0}>
                <Label tone="bad" size={13}>{`short by ${short}: order more, wait weeks`}</Label>
              </Fade>
            </div>
          </At>
          <At x={300} y={200}><div style={{ opacity: beat >= 3 && short > 0 ? 1 : 0, transition: ease }}><Calendar w={56} page="6" /></div></At>
        </Stage>
        <Stage w={540} h={292} active={beat === 2 || beat === 3}>
          <Fade on={beat >= 2}>
            <At x={18} y={14}>
              <Label strong size={16} tone="brand">Cloud IT</Label>
              <Note size={14} className="mt-1.5">computing rented as a metered service</Note>
            </At>
            <At x={18} y={92}><Idling cfg={MEERA} scale={0.5} seed={4} /></At>
            <At x={110} y={212}><Laptop w={92} glow /></At>
            <Arrow x1={208} y1={228} x2={288} y2={170} on={beat >= 2} dashed />
            <At x={290} y={80}><CloudShape w={150} /></At>
            <At x={292} y={150} w={160}>
              <div className="grid grid-cols-3 gap-1.5">
                {Array.from({ length: 9 }, (_, i) => (
                  <div key={i} style={{ opacity: i < need ? 1 : 0.12, transform: i < need ? 'none' : 'scale(0.9)', transition: ease }}>
                    <ServerUnit w={48} />
                  </div>
                ))}
              </div>
            </At>
            <At x={466} y={84}><MeterDial w={60} value={need / 9} spin={need > 0 && !STILL} /></At>
            <At x={458} y={150}><Label size={12} tone="good">{`${need} billed`}</Label></At>
          </Fade>
        </Stage>
      </div>
      <div className="mt-3 flex items-center justify-between" style={{ width: BOX_W }}>
        <Slider value={demand} onChange={setDemand} label="Demand" width={360} />
        <Fade on={beat >= 4}>
          <span className="block rounded-pill px-5 py-1.5 font-heading text-[16px] font-semibold" style={{ background: colors.surface2, color: colors.brandDark, boxShadow: `inset 0 0 0 1.5px ${colors.brand}` }}>
            Shift driven by cost, scale and speed pressures
          </span>
        </Fade>
      </div>
    </Card>
  )
}

/* ================================================================== 6 · NIST Formal View */

/** The definition, cut at the phrases each bullet points at. `hi` is the part lit on each beat. */
const DEF: { t: string; hi?: number[] }[] = [
  { t: 'The National Institute of Standards and Technology (NIST) defines cloud computing as a model for enabling ' },
  { t: 'anywhere, convenient, on-demand network access', hi: [2, 5] },
  { t: ' to ' },
  { t: 'a shared pool of configurable computing resources', hi: [2, 3] },
  { t: ' (networks, servers, storage, applications, and services) that can be ' },
  { t: 'rapidly provisioned and released', hi: [2, 5] },
  { t: ' with ' },
  { t: 'minimal management effort or service provider interaction', hi: [2, 5] },
  { t: '.' },
]

export function NistReader({ lesson }: { lesson: string }) {
  const beat = useBeats(5)
  const ease = useEase()
  const items = [
    { text: 'Five essential characteristics govern shared resource access', at: 2 },
    { text: 'Three service models: IaaS, PaaS, SaaS', at: 3 },
    { text: 'Four deployment models: public, private, hybrid, community', at: 4 },
    { text: 'AWS Management Console exposes this self-service resource catalog', at: 5 },
  ]
  const tally = [
    { n: 5, label: 'characteristics', at: 2 },
    { n: 3, label: 'service models', at: 3 },
    { n: 4, label: 'deployment models', at: 4 },
  ]
  return (
    <Card id="nist" kicker="Cloud Computing Defined" title="NIST Formal View" lesson={lesson} beat={beat} total={5}>
      <div className="flex gap-4">
        <Rail items={items} beat={beat} width={420} />
        <Stage w={674} h={410} active={beat === 1} pad={22}>
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full font-heading text-[14px] font-semibold text-white" style={{ background: colors.brand }}>i</span>
            <span className="font-heading text-[17px] font-semibold" style={{ color: colors.brandDark }}>NIST Definition</span>
          </div>
          <p className="mt-3 text-[18px] leading-[1.55]" style={{ color: colors.ink }}>
            {DEF.map((p, i) => {
              const lit = p.hi ? beat >= p.hi[0] : false
              return (
                <span key={i} style={{ color: lit ? colors.brandDark : colors.ink, textDecorationLine: lit ? 'underline' : 'none', textDecorationColor: colors.brand, textDecorationThickness: 2, textUnderlineOffset: 4, transition: ease, fontWeight: lit ? 600 : 500 }}>
                  {p.t}
                </span>
              )
            })}
          </p>
          <div className="mt-4 flex items-center gap-3">
            {tally.map((t) => (
              <Fade key={t.label} on={beat >= t.at}>
                <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-1.5" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
                  <span className="font-heading text-[22px] font-semibold" style={{ color: colors.brand }}>{t.n}</span>
                  <span className="text-[14px] font-medium" style={{ color: colors.ink }}>{t.label}</span>
                </div>
              </Fade>
            ))}
            <Fade on={beat >= 5}>
              <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-1.5" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
                <img src="/assets/tech/aws.png" alt="" className="h-[18px] w-auto" draggable={false} />
                <span className="text-[14px] font-medium" style={{ color: colors.ink }}>Console</span>
              </div>
            </Fade>
          </div>
        </Stage>
      </div>
    </Card>
  )
}

/* ================================================================== 7 · NIST three branches */

export function NistTree({ lesson }: { lesson: string }) {
  const beat = useBeats(4)
  const branches = [
    { label: 'Essential Characteristics', body: 'five of them', leaves: ['On-demand self-service', 'Broad network access', 'Resource pooling', 'Rapid elasticity', 'Measured service'], x: 30, today: true },
    { label: 'Service Models', body: 'IaaS, PaaS, SaaS', leaves: ['IaaS', 'PaaS', 'SaaS'], x: 390, today: false },
    { label: 'Deployment Models', body: 'public, private, hybrid, community', leaves: ['public', 'private', 'hybrid', 'community'], x: 750, today: false },
  ]
  const ease = useEase()
  return (
    <Card id="nist-branches" kicker="Cloud Computing Defined" title="NIST Formal View" lesson={lesson} beat={beat} total={4}>
      <Stage w={BOX_W} h={432} active={false}>
        <At x={BOX_W / 2} y={22} cx>
          <div className="grid h-[64px] w-[250px] place-items-center rounded-2xl font-heading text-[20px] font-semibold text-white" style={{ background: colors.brand, boxShadow: `0 14px 30px -16px ${colors.brand}` }}>
            NIST Definition
          </div>
        </At>
        {branches.map((b, i) => (
          <Arrow key={b.label} x1={BOX_W / 2} y1={90} x2={b.x + 165} y2={142} on={beat >= i + 2} delay={0} />
        ))}
        {branches.map((b, i) => (
          <At key={b.label} x={b.x} y={150} w={330}>
            <Fade on={beat >= i + 2}>
              <div className="rounded-2xl bg-white p-4" style={{ boxShadow: `inset 0 0 0 2px ${b.today ? colors.brand : colors.line}`, transition: ease }}>
                <span className="block font-heading text-[18px] font-semibold" style={{ color: colors.ink }}>{b.label}</span>
                <span className="mt-0.5 block text-[15px]" style={{ color: colors.ink }}>{b.body}</span>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {b.leaves.map((l, k) => (
                    <Fade key={l} on={beat >= i + 2} delay={300 + k * 110}>
                      <Label size={13} tone={b.today ? 'brand' : 'plain'}>{l}</Label>
                    </Fade>
                  ))}
                </div>
              </div>
            </Fade>
          </At>
        ))}
        <At x={30} y={392} w={1050}>
          <Fade on={beat >= 2}>
            <div className="flex items-center gap-2">
              <span className="block h-[12px] w-[12px] rounded-full" style={{ background: colors.brand }} />
              <span className="text-[14px] font-medium" style={{ color: colors.ink }}>opened in this session</span>
            </div>
          </Fade>
        </At>
      </Stage>
    </Card>
  )
}

/* ================================================================== 9 · Ownership and Delivery */

const ROWS: [string, string, string][] = [
  ['Ownership', 'Organisation owns hardware', 'Provider owns infrastructure'],
  ['Cost model', 'Capital expenditure (CapEx)', 'Operating expenditure (OpEx)'],
  ['Provisioning time', 'Weeks to months', 'Minutes'],
  ['Scaling', 'Manual hardware upgrade', 'On-demand, software-driven'],
  ['Maintenance', 'In-house IT team', 'Provider-managed'],
]

function RowPicture({ row, side }: { row: number; side: 'on' | 'cloud' }) {
  const tick = useTicker(true, 900, 3)
  const pics: Record<'on' | 'cloud', ReactNode[]> = {
    on: [
      <div className="flex items-center gap-3"><ServerRoom w={110} /><KeyIcon w={50} /></div>,
      <div className="flex items-end gap-3"><Coins w={44} n={9} /><Label tone="warn" size={13}>paid up front</Label></div>,
      <div className="flex items-center gap-3"><Calendar w={66} page={`${(tick % 8) + 1}`} /><Label tone="bad" size={13}>weeks</Label></div>,
      <div className="flex items-center gap-3"><Rack w={52} units={['run', 'run', 'run', 'off']} /><Label tone="warn" size={13}>buy, ship, rack</Label></div>,
      <div className="flex items-center gap-3"><Toolbox w={70} /><Label size={13}>your team</Label></div>,
    ],
    cloud: [
      <div className="flex items-center gap-3"><ProviderBuilding w={130} lit={6} /></div>,
      <div className="flex items-center gap-3"><MeterDial w={70} value={0.4} spin={!STILL} /><Label tone="good" size={13}>pay as used</Label></div>,
      <div className="flex items-center gap-3"><Stopwatch w={56} turn={(tick % 4) / 4} /><Label tone="good" size={13}>minutes</Label></div>,
      <div className="flex flex-col gap-1">{[0, 1, 2].map((i) => <div key={i} style={{ opacity: i <= tick % 3 ? 1 : 0.15, transition: 'opacity 400ms' }}><ServerUnit w={70} /></div>)}</div>,
      <div className="flex items-center gap-3"><Idling cfg={ARJUN} scale={0.34} crop={BUST} seed={8} /><Label size={13}>provider</Label></div>,
    ],
  }
  return <>{pics[side][row]}</>
}

export function OwnershipSplit({ lesson }: { lesson: string }) {
  const beat = useBeats(6)
  const row = Math.max(0, beat - 2)
  const ease = useEase()
  return (
    <Card id="onprem-vs-cloud" kicker="On-Premise vs Cloud" title="Ownership and Delivery" lead="On-premise IT keeps hardware, software and staff inside the organisation; cloud shifts ownership and operation to a provider, delivered over the network" lesson={lesson} beat={beat} total={6}>
      <div className="flex gap-4">
        <div className="flex flex-col gap-3" style={{ width: 360 }}>
          <Stage w={360} h={170} active={beat >= 2}>
            <At x={14} y={12}><Label strong size={14} tone="dark">On-Premise IT</Label></At>
            <At x={180} y={104} cx cy>
              {beat >= 2 ? <RowPicture key={`on${row}`} row={row} side="on" /> : <div className="flex flex-col items-center gap-2"><ServerRoom w={96} /><Label size={13}>A locked data centre</Label></div>}
            </At>
          </Stage>
          <Stage w={360} h={170} active={beat >= 2}>
            <At x={14} y={12}><Label strong size={14} tone="brand">Cloud</Label></At>
            <At x={180} y={96} cx cy>
              {beat >= 2 ? <RowPicture key={`cl${row}`} row={row} side="cloud" /> : <div className="flex flex-col items-center gap-2"><CloudShape w={110} /><Label size={13} tone="brand">Reachable from anywhere over the internet</Label></div>}
            </At>
          </Stage>
        </div>
        <Stage w={734} h={352} active={beat === 1} pad={14}>
          <div className="grid overflow-hidden rounded-xl bg-white" style={{ gridTemplateColumns: '170px 1fr 1fr', boxShadow: `inset 0 0 0 1px ${colors.line}` }}>
            {['Aspect', 'On-Premise IT', 'Cloud'].map((h) => (
              <span key={h} className="px-4 py-2.5 font-heading text-[15px] font-semibold" style={{ background: colors.surface2, color: colors.brandDark }}>{h}</span>
            ))}
            {ROWS.map((r, i) => {
              const shown = beat >= i + 2
              const now = beat === i + 2
              return r.map((c, k) => (
                <span key={`${i}${k}`} className={`px-4 py-3 text-[15px] ${k === 0 ? 'font-heading font-semibold' : 'font-medium'}`} style={{ color: colors.ink, background: now ? 'rgba(45,99,251,0.09)' : 'transparent', borderTop: `1px solid ${colors.line}`, opacity: shown ? 1 : 0.0, transition: ease }}>
                  {c}
                </span>
              ))
            })}
          </div>
        </Stage>
      </div>
    </Card>
  )
}

/* ================================================================== 10 · Cloud Computing Architecture */

const LAYERS = [
  { n: 2, label: 'Application' },
  { n: 3, label: 'Service' },
  { n: 4, label: 'Runtime Cloud' },
  { n: 5, label: 'Storage' },
  { n: 6, label: 'Infrastructure' },
]

export function ArchitectureWalk({ lesson }: { lesson: string }) {
  const beat = useBeats(5)
  const ease = useEase()
  const cx = 470
  const layerY = (i: number) => 218 + i * 40
  /* the request's path: client, internet, then down the layers lit so far */
  const lastLayer = beat >= 4 ? 4 : beat >= 3 ? 1 : -1
  const path: [number, number][] = [[cx, 52], [cx, 120], ...(lastLayer >= 0 ? LAYERS.slice(0, lastLayer + 1).map((_, i) => [cx, layerY(i) + 16] as [number, number]) : [])]
  return (
    <Card id="architecture" kicker="On-Premise vs Cloud" title="Cloud Computing Architecture" lesson={lesson} beat={beat} total={5}>
      <Stage w={BOX_W} h={432} active={false}>
        <At x={cx} y={30} cx>
          <div className="flex h-[44px] items-center gap-2 rounded-pill bg-white px-4" style={{ boxShadow: `inset 0 0 0 2px ${colors.brand}` }}>
            <Num n={1} />
            <span className="font-heading text-[16px] font-semibold" style={{ color: colors.ink }}>Client Infrastructure</span>
          </div>
        </At>
        <At x={cx + 150} y={42}><span className="font-heading text-[14px] font-semibold tracking-[0.08em]" style={{ color: colors.muted }}>FRONT END</span></At>
        <At x={160} y={22}><Laptop w={110} glow={beat >= 2} /></At>
        <At x={cx} y={118} cx>
          <Fade on={beat >= 2}>
            <div className="flex h-[40px] items-center gap-2 rounded-pill px-4" style={{ background: colors.surface2, boxShadow: `inset 0 0 0 1.5px ${colors.brand}` }}>
              <Num n={9} />
              <span className="font-heading text-[15px] font-semibold" style={{ color: colors.brandDark }}>Internet</span>
            </div>
          </Fade>
        </At>
        <Arrow x1={cx} y1={78} x2={cx} y2={114} on={beat >= 2} both />
        <Arrow x1={cx} y1={162} x2={cx} y2={202} on={beat >= 3} both />
        <At x={cx - 200} y={206} w={400}>
          <Fade on={beat >= 3}>
            <div className="relative rounded-2xl p-2.5" style={{ background: colors.white, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
              <div className="flex flex-col gap-1.5 px-[52px]">
                {LAYERS.map((l, i) => {
                  const lit = beat >= 4 || (beat === 3 && i <= 1)
                  return (
                    <div key={l.label} className="flex h-[34px] items-center gap-2 rounded-lg px-3" style={{ background: lit ? colors.brand : colors.surface2, color: lit ? colors.white : colors.brandDark, transition: ease }}>
                      <Num n={l.n} size={22} on={!lit} />
                      <span className="font-heading text-[15px] font-semibold">{l.label}</span>
                    </div>
                  )
                })}
              </div>
              <div className="absolute bottom-2.5 left-2.5 top-2.5 flex w-[40px] flex-col items-center justify-between rounded-lg py-2" style={{ background: beat >= 5 ? colors.surface2 : colors.surface, boxShadow: `inset 0 0 0 1.5px ${beat >= 5 ? colors.brand : colors.line}`, transition: ease }}>
                <span className="text-[14px] font-semibold" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: colors.ink }}>Management</span>
                <Num n={7} size={22} on={beat >= 5} />
              </div>
              <div className="absolute bottom-2.5 right-2.5 top-2.5 flex w-[40px] flex-col items-center justify-between rounded-lg py-2" style={{ background: beat >= 5 ? colors.surface2 : colors.surface, boxShadow: `inset 0 0 0 1.5px ${beat >= 5 ? colors.brand : colors.line}`, transition: ease }}>
                <span className="text-[14px] font-semibold" style={{ writingMode: 'vertical-rl', color: colors.ink }}>Security</span>
                <Num n={8} size={22} on={beat >= 5} />
              </div>
            </div>
          </Fade>
        </At>
        <At x={cx + 222} y={262}><Fade on={beat >= 3}><span className="font-heading text-[14px] font-semibold tracking-[0.08em]" style={{ color: colors.muted }}>BACK END</span></Fade></At>
        <At x={cx + 222} y={292} w={300}>
          <Fade on={beat >= 3}>
            <ProviderBuilding w={160} lit={beat >= 4 ? 12 : 4} />
          </Fade>
        </At>
        <Traveller path={path} run={beat >= 2 && !STILL} k={beat} />
        <Caption
          k={beat}
          w={228}
          x={24}
          y={200}
          size={15}
          text={
            [
              'The front end: what the client uses',
              'The internet joins the two halves',
              'The request reaches the back end',
              'Five back-end layers, top down',
              'Management and security run down both sides',
            ][beat - 1]
          }
        />
      </Stage>
    </Card>
  )
}

/* ================================================================== 11 · Cost Scale Speed */

function Driver({ title, body, on, flip, before, after }: { title: string; body: string; on: boolean; flip: boolean; before: ReactNode; after: ReactNode }) {
  const ease = useEase()
  return (
    <Stage w={354} h={250} active={on && !flip ? false : on} pad={14}>
      <div className="flex items-center gap-2">
        <span className="font-heading text-[18px] font-semibold" style={{ color: colors.ink }}>{title}</span>
      </div>
      <Note size={14} className="mt-1">{body}</Note>
      <div className="absolute inset-x-3 bottom-3 top-[86px] grid grid-cols-2 gap-2">
        <div className="flex flex-col items-center justify-end gap-1.5 rounded-xl py-2" style={{ background: colors.surface }}>
          {before}
          <Label size={12} tone="muted">before</Label>
        </div>
        <div className="flex flex-col items-center justify-end gap-1.5 rounded-xl py-2" style={{ background: flip ? colors.surface2 : colors.surface, opacity: flip ? 1 : 0.35, transition: ease }}>
          {after}
          <Label size={12} tone={flip ? 'brand' : 'muted'}>cloud</Label>
        </div>
      </div>
    </Stage>
  )
}

export function Drivers({ lesson }: { lesson: string }) {
  const beat = useBeats(5)
  return (
    <Card id="drivers" kicker="Adoption Drivers" title="Cost Scale Speed" lead="Three pressures push organisations toward cloud: unpredictable cost of owning hardware, difficulty scaling for sudden demand, and slow speed of provisioning new infrastructure" lesson={lesson} beat={beat} total={5}>
      <div className="flex gap-[24px]">
        <Driver title="Cost" body="converts CapEx to pay-per-use OpEx, cuts idle capacity" on={beat >= 1} flip={beat >= 2} before={<Coins w={34} n={8} />} after={<div className="flex items-center gap-1"><Coin w={26} /><MeterDial w={46} value={0.3} /></div>} />
        <Driver title="Scale" body="resources added or removed as demand shifts" on={beat >= 1} flip={beat >= 3} before={<Rack w={40} units={['run', 'run', 'idle']} />} after={<div className="flex flex-col gap-1">{[0, 1, 2].map((i) => <ServerUnit key={i} w={66} />)}</div>} />
        <Driver title="Speed" body="servers provisioned in minutes, not procurement cycles" on={beat >= 1} flip={beat >= 4} before={<Calendar w={52} page="6" />} after={<Stopwatch w={46} turn={0.15} />} />
      </div>
      <div className="relative mt-3" style={{ width: BOX_W, height: 26 }}>
        {[177, 555, 933].map((x) => (
          <Arrow key={x} x1={x} y1={0} x2={x} y2={24} on={beat >= 5} />
        ))}
      </div>
      <Fade on={beat >= 5}>
        <div className="grid h-[42px] place-items-center rounded-pill font-heading text-[17px] font-semibold text-white" style={{ background: colors.brand, width: BOX_W }}>
          Cloud Adoption
        </div>
      </Fade>
      <Fade on={beat >= 5} className="mt-2">
        <div className="flex items-center gap-2" style={{ width: BOX_W }}>
          <img src="/assets/tech/aws.png" alt="" className="h-[16px] w-auto" draggable={false} />
          <span className="text-[15px] font-medium" style={{ color: colors.ink }}>Reflected in tools like AWS Cost Explorer, Pricing Calculator</span>
        </div>
      </Fade>
    </Card>
  )
}

