import { useEffect, useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { Card, Stage, At, Label, Arrow, Rail, Statement, Traveller, useCycle, useTicker, STILL, BOX_W } from './scene'
import { Padlock, useEase } from './art'
import {
  ClayCalculator, ClayCalendar, ClayClipboard, ClayItDesk, ClayLaptop, ClayMonitor, ClayPhone, ClayRack, ClayServer, ClayTerminal, ClayTicket,
  ElectricMeter, RichCloud, TenantTile, TENANT_TONES,
} from './clay-c'
import { mo } from './motion'
import { tile, solid } from './basics'

/**
 * SECTION 3, ESSENTIAL CHARACTERISTICS - I (Merrill): the five traits named,
 * then the first three shown working. Every string is the reference's.
 *
 * Review 2026-10-16: every picture in the Character Lab's clay look
 * (`clay-c.tsx`), no people and no faces (a tenant is a badge, a request comes
 * from a device), and the two crowded slides split: points first, picture next.
 *
 * Review 2026-10-16 (global rules): nothing on these slides needs a hand. The
 * trait ring, the self-service tabs and Launch, the device requests all run
 * by themselves on `useCycle` (one step every 2400ms) and hold still on
 * harness URLs; the buttons are gone. A connecting arrow draws from source to
 * target once the entrances have settled (`useGo`), in reading order. Every
 * ease is the house curve at the deck's one state duration (`useEase`).
 */

/**
 * True once the slide has been on screen `ms`: a connection draws on after
 * the element entrances (which end by 1.5s) have settled, so the room sees
 * the line travel from its source to its target. True at once on harness
 * URLs and in a picker thumbnail, where nothing may be mid-flight.
 */
export function useGo(ms = 1200): boolean {
  const instant = useInstant()
  const held = STILL || instant
  const [go, setGo] = useState(held)
  useEffect(() => {
    if (held) return
    const t = window.setTimeout(() => setGo(true), ms)
    return () => window.clearTimeout(t)
  }, [ms, held])
  return held || go
}

/* a slice or a hypervisor bar is one of the render's solids now (`solid` in basics.tsx): lit top, shaded foot, soft shadow */

/** A point on its own card, its small clay picture above it (a split slide's points half). */
function PointCard({ text, art, w, h }: { text: ReactNode; art: ReactNode; w: number; h: number }) {
  return (
    <Stage w={w} h={h} active={false} pad={22}>
      <div className="flex h-full flex-col gap-4">
        <div className="flex h-[100px] items-end gap-3">{art}</div>
        <p className="text-[22px] font-medium leading-snug" style={{ color: colors.ink }}>{text}</p>
      </div>
    </Stage>
  )
}

/* ================================================================== 24 · Five NIST Traits (reference 27 + 28) */

const TRAITS = [
  { name: 'On-Demand Self-Service', gloss: 'On-demand self-service: provisioning without human intervention' },
  { name: 'Broad Network Access', gloss: 'Broad network access: reachable over standard protocols' },
  { name: 'Resource Pooling', gloss: 'Resource pooling: shared infrastructure across multiple tenants' },
  { name: 'Rapid Elasticity', gloss: 'Rapid elasticity: capacity scales automatically with demand' },
  { name: 'Measured Service', gloss: 'Measured service: usage metered and billed per consumption' },
]

function TraitMini({ i }: { i: number }): ReactNode {
  const tick = useTicker(true, 1200, 2)
  const ease = useEase()
  if (i === 0)
    return (
      <div className="flex items-center gap-2">
        <ClayLaptop w={70} lit />
        <div className="flex flex-col gap-1">{[0, 1].map((k) => <div key={k} style={{ opacity: k <= tick % 2 ? 1 : 0.2, transition: ease }}><ClayServer w={44} /></div>)}</div>
      </div>
    )
  if (i === 1)
    return (
      <div className="flex items-end gap-2">
        <ClayLaptop w={56} lit={tick % 3 === 0} />
        <ClayPhone w={22} lit={tick % 3 === 1} />
        <ClayTerminal w={44} lit={tick % 3 === 2} />
      </div>
    )
  if (i === 2)
    return (
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1">{TENANT_TONES.map((t) => <TenantTile key={t} w={24} tone={t} />)}</div>
        <ClayRack w={40} units={['run', 'run', 'run']} />
      </div>
    )
  if (i === 3)
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 4 }, (_, k) => <div key={k} style={{ opacity: k < 1 + (tick % 4) ? 1 : 0.15, transition: ease }}><ClayServer w={32} /></div>)}
      </div>
    )
  return <ElectricMeter w={64} value={((tick % 5) + 1) / 6} />
}

/** The lead, alone (review 2026-10-15: the ring and its points get the next frame). */
export function TraitStatement({ lesson }: { lesson: string }) {
  return (
    <Statement
      id="five-traits"
      kicker="Essential Characteristics"
      title="Five NIST Traits"
      label="Essential Characteristics"
      parts={[{ t: 'NIST formally defines cloud computing through ' }, { t: 'five essential characteristics', hi: true }, { t: ', the standard checklist that ' }, { t: 'distinguishes cloud from traditional IT', hi: true }]}
      lesson={lesson}
      art={<RichCloud w={260} />}
    />
  )
}

export function TraitRing({ lesson }: { lesson: string }) {
  const beat = useBeats(6)
  /* the ring walks its five traits by itself, one every step, round and round (global rule 3) */
  const lit = useCycle(5, 2400, 0)
  const ease = useEase()
  const R = { cx: 280, cy: 182, rx: 200, ry: 140 }
  const pos = TRAITS.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5
    return { x: R.cx + R.rx * Math.cos(a), y: R.cy + R.ry * Math.sin(a) }
  })
  const items = TRAITS.map((t, i) => ({ text: t.gloss, at: i + 2 }))
  return (
    <Card id="five-traits-ring" kicker="Essential Characteristics" title="Five NIST Traits" lesson={lesson} beat={beat} total={6}>
      <div className="flex gap-4">
        <Stage w={560} h={360} active={beat === 1}>
          <svg className="absolute inset-0" width={560} height={360} aria-hidden>
            <ellipse cx={R.cx} cy={R.cy} rx={R.rx - 40} ry={R.ry - 30} fill="none" stroke={colors.line} strokeWidth={2} strokeDasharray="6 8" className={mo('dash', 0, { dur: 2.4 }).className} style={mo('dash', 0, { dur: 2.4 }).style} />
          </svg>
          <At x={R.cx} y={R.cy} cx cy>
            <div className="relative h-[120px] w-[180px] rounded-full" style={tile(`2px ${colors.brand}`)}>
              {/* the five small pictures stacked, the lit trait's shown, so a change is a cross-fade and never a cut */}
              {TRAITS.map((_, i) => (
                <div key={i} className="absolute inset-0 grid place-items-center" style={{ opacity: lit === i ? 1 : 0, transition: ease }} aria-hidden={lit !== i}>
                  <TraitMini i={i} />
                </div>
              ))}
            </div>
          </At>
          {TRAITS.map((t, i) => {
            const on = lit === i
            return (
              <At key={t.name} x={pos[i].x} y={pos[i].y} cx cy>
                <div
                  className="grid h-[52px] w-[150px] place-items-center rounded-xl px-2 text-center font-heading text-[14px] font-semibold leading-tight"
                  style={{ ...(on ? solid(colors.brand) : tile(`1.5px ${colors.brand}`, { background: 'linear-gradient(180deg, #F3F7FF 0%, #E8F0FF 100%)' })), color: on ? colors.white : colors.brandDark, transition: ease }}
                >
                  {t.name}
                </div>
              </At>
            )
          })}
        </Stage>
        <Rail items={items} beat={beat} width={534} size={16} gap={10} />
      </div>
    </Card>
  )
}

/* ================================================================== 25 · No Human Intervention (split 2026-10-16: points, then the picture) */

export function SelfService({ lesson }: { lesson: string }) {
  const beat = useBeats(3)
  const points: { text: string; art: ReactNode }[] = [
    {
      text: 'Customer requests via console, CLI or API',
      art: (
        <>
          <ClayMonitor w={104} />
          <ClayTerminal w={96} />
          <ClayPhone w={42} />
        </>
      ),
    },
    {
      text: 'Contrasts with traditional IT: weeks-long procurement tickets',
      art: (
        <>
          <ClayTicket w={124} struck />
          <ClayCalendar w={92} />
        </>
      ),
    },
    {
      text: "AWS: EC2 'Launch Instance' or CLI run-instances call",
      art: (
        <>
          <img src="/assets/tech/aws.png" alt="" className="mb-2 h-[30px] w-auto" draggable={false} />
          <div className="flex flex-col gap-1">
            <ClayServer w={120} />
            <ClayServer w={120} />
          </div>
        </>
      ),
    },
  ]
  return (
    <Card id="self-service" kicker="On-Demand Self-Service" title="No Human Intervention" lead="On-demand self-service lets a customer provision computing resources automatically, without requiring a phone call or ticket to the provider's staff" lesson={lesson} beat={beat} total={3}>
      <div className="flex gap-[18px]">
        {points.map((p) => (
          <PointCard key={p.text} text={p.text} art={p.art} w={358} h={250} />
        ))}
      </div>
    </Card>
  )
}

const DESKS = [
  { label: 'Manager', art: <ClayClipboard w={64} /> },
  { label: 'Finance', art: <ClayCalculator w={84} /> },
  { label: 'IT desk', art: <ClayItDesk w={90} /> },
]

/** The picture: the old path's three desks and a weeks-long ticket, then the cloud path's one call. */
const TABS = ['Console', 'CLI', 'API'] as const

export function SelfServicePicture({ lesson }: { lesson: string }) {
  const beat = useBeats(2)
  /* each path in turn: the request shown, then sent and provisioned; a still frame shows the console's call landed */
  const k = useCycle(6, 2400, 1)
  const tab = TABS[Math.floor(k / 2)]
  const launched = k % 2 === 1
  const go = useGo()
  const ease = useEase()
  return (
    <Card id="self-service-2" kicker="On-Demand Self-Service" title="No Human Intervention" lesson={lesson} beat={beat} total={2}>
      <div className="flex flex-col gap-3">
        <Stage w={BOX_W} h={168} active={false}>
          {DESKS.map((d, k) => (
            <At key={d.label} x={110 + k * 190} y={18} cx>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-[92px] items-end">{d.art}</div>
                <Label size={15} strong>{d.label}</Label>
              </div>
            </At>
          ))}
          {[0, 1].map((k) => (
            <Arrow key={k} x1={170 + k * 190} y1={64} x2={240 + k * 190} y2={64} on={go} delay={k * 700} />
          ))}
          <Arrow x1={550} y1={64} x2={640} y2={64} dashed tone={colors.danger} on={go} delay={1400} />
          <At x={660} y={30}><ClayTicket w={104} struck /></At>
          <At x={800} y={14}><ClayCalendar w={84} /></At>
          <At x={900} y={44}><Label tone="bad" size={15} strong>Week 6</Label></At>
          <At x={660} y={124}><Label tone="bad" size={15}>Weeks-long procurement ticket</Label></At>
        </Stage>
        <Stage w={BOX_W} h={236} active={false}>
          <At x={30} y={20} w={420}>
            <div className="flex gap-1.5">
              {TABS.map((t) => (
                <Label key={t} tone={tab === t ? 'solid' : 'brand'} size={14} strong>{t}</Label>
              ))}
            </div>
          </At>
          <At x={30} y={66} w={300}>
            <div className="flex h-[148px] items-center justify-center">
              {tab === 'Console' ? <ClayMonitor w={170} lit={launched} /> : tab === 'CLI' ? <ClayTerminal w={170} lit={launched} /> : <ClayLaptop w={180} lit={launched} />}
            </div>
          </At>
          <At x={320} y={66} w={300}>
            <div className="flex h-[148px] flex-col justify-center gap-3 rounded-xl px-5" style={{ ...(tab === 'Console' ? tile(`1.5px ${colors.line}`) : { background: `linear-gradient(180deg, ${colors.night3} 0%, ${colors.night} 100%)`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 12px 24px -16px rgba(31,64,140,0.45)' }), transition: ease }}>
              {tab === 'Console' ? (
                <>
                  <div className="flex items-center gap-2">
                    <img src="/assets/tech/aws.png" alt="" className="h-[18px] w-auto" draggable={false} />
                    <span className="text-[16px] font-semibold" style={{ color: colors.ink }}>EC2</span>
                  </div>
                  <div style={{ transform: launched ? 'scale(0.95)' : 'none', transformOrigin: 'left center', transition: ease }}><Label tone="solid" size={14} strong>Launch Instance</Label></div>
                </>
              ) : (
                <>
                  <span className="font-mono text-[16px]" style={{ color: colors.white }}>{tab === 'CLI' ? 'run-instances' : 'RunInstances'}</span>
                  <div style={{ transform: launched ? 'scale(0.95)' : 'none', transformOrigin: 'left center', transition: ease }}><Label tone="solid" size={14} strong>{tab === 'CLI' ? 'Run' : 'Send'}</Label></div>
                </>
              )}
            </div>
          </At>
          <Arrow x1={636} y1={140} x2={706} y2={140} on={launched} />
          <At x={720} y={26} w={140}>
            <div className="flex flex-col items-center gap-2">
              {[0, 1, 2].map((k) => (
                <div key={k} style={{ opacity: launched ? 1 : 0.15, transition: ease, transitionDelay: `${k * 160}ms` }}>
                  <ClayServer w={130} />
                </div>
              ))}
            </div>
          </At>
          <At x={880} y={92} w={200}>
            <div className="flex flex-col items-start gap-2" style={{ opacity: launched ? 1 : 0, transition: ease }}>
              <Label tone="good" size={15} strong>Resources provisioned</Label>
              <span className="text-[15px] font-medium leading-snug" style={{ color: colors.ink }}>Without human intervention</span>
            </div>
          </At>
        </Stage>
      </div>
    </Card>
  )
}

/* ================================================================== 27 · Ubiquitous Standard Access */

const DEVICES = [
  { label: 'Laptop', x: 190, y: 92 },
  { label: 'Mobile app', x: 920, y: 92 },
  { label: 'Browser console', x: 190, y: 262 },
  { label: 'CLI', x: 920, y: 262 },
]

function DeviceArt({ i, lit }: { i: number; lit: boolean }) {
  if (i === 0) return <ClayLaptop w={120} lit={lit} />
  if (i === 1) return <ClayPhone w={42} lit={lit} />
  if (i === 2) return <ClayMonitor w={104} lit={lit} />
  return <ClayTerminal w={112} lit={lit} />
}

export function DeviceRing({ lesson }: { lesson: string }) {
  const beat = useBeats(3)
  /* the four devices send in turn, one every step, each request a dot to the API and back (global rules 3 and 4) */
  const tick = useTicker(true, 2400, 0)
  const active = tick % 4
  const go = useGo()
  const ease = useEase()
  const hub = { x: BOX_W / 2, y: 170 }
  return (
    <Card id="network-access" kicker="Broad Network Access" title="Ubiquitous Standard Access" lead="Broad network access means cloud resources are reachable over standard network protocols from heterogeneous client devices, laptops, phones or thin clients alike" lesson={lesson} beat={beat} total={3}>
      <Stage w={BOX_W} h={360} active={false}>
        {DEVICES.map((d, i) => {
          const left = d.x < hub.x
          const top = d.y < hub.y
          return <Arrow key={d.label} x1={left ? d.x + 104 : d.x - 104} y1={d.y - 10} x2={left ? hub.x - 132 : hub.x + 132} y2={hub.y + (top ? -28 : 28)} tone={active === i ? colors.accent : colors.brand} both on={go} delay={i * 300} />
        })}
        {DEVICES.map((d, i) => {
          const left = d.x < hub.x
          const top = d.y < hub.y
          return (
            <At key={`t${d.label}`} x={((left ? d.x + 104 : d.x - 104) + (left ? hub.x - 132 : hub.x + 132)) / 2} y={top ? 66 : 236} cx>
              <Label size={14} tone={active === i ? 'warn' : 'brand'} mono>HTTPS/API</Label>
            </At>
          )
        })}
        <At x={hub.x} y={hub.y} cx cy>
          <div className="relative grid place-items-center" style={{ width: 250, height: 170 }}>
            <div className="absolute inset-0"><RichCloud w={250} /></div>
            <div className="relative mt-4 flex flex-col items-center gap-1.5">
              <div className="rounded-lg px-2 py-1" style={tile()}><img src="/assets/tech/aws.png" alt="" className="h-[22px] w-auto" draggable={false} /></div>
              <span className="font-heading text-[18px] font-semibold text-white">AWS API</span>
            </div>
          </div>
        </At>
        {DEVICES.map((d, i) => (
          <At key={`d${d.label}`} x={d.x} y={d.y} cx cy>
            <div
              className="flex w-[190px] flex-col items-center gap-2 rounded-2xl px-3 py-2"
              style={{ background: active === i ? colors.surface2 : 'transparent', boxShadow: active === i ? `inset 0 0 0 2px ${colors.accent}` : 'inset 0 0 0 2px transparent', transition: ease }}
            >
              <div className="flex h-[92px] items-end"><DeviceArt i={i} lit={active === i} /></div>
              <Label size={15} strong tone={active === i ? 'brand' : 'plain'}>{d.label}</Label>
            </div>
          </At>
        ))}
        <Traveller k={tick} run path={[[DEVICES[active].x, DEVICES[active].y - 10], [hub.x, hub.y], [DEVICES[active].x, DEVICES[active].y - 10]]} dur={1.4} />
      </Stage>
    </Card>
  )
}

/* ================================================================== 28 · Shared Infrastructure Model (split 2026-10-16: points, then the picture) */

export function TenantRack({ lesson }: { lesson: string }) {
  const beat = useBeats(4)
  const points: { text: string; art: ReactNode }[] = [
    {
      text: 'Multi-tenancy: multiple customers share same physical hardware',
      art: (
        <>
          {TENANT_TONES.map((t) => <TenantTile key={t} w={38} tone={t} />)}
          <ClayServer w={64} />
        </>
      ),
    },
    {
      text: 'Hypervisor: virtualization software splitting one server into isolated tenants',
      art: (
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-1.5">
            {TENANT_TONES.map((t, k) => <span key={t} className={`block h-[16px] w-[40px] rounded-md ${mo('pulse', k).className}`} style={{ ...solid(t), ...mo('pulse', k).style }} />)}
          </div>
          <span className={`block h-[12px] w-[132px] rounded-md ${mo('pulse', 3).className}`} style={{ ...solid(colors.brandDark), ...mo('pulse', 3).style }} />
          <ClayServer w={132} />
        </div>
      ),
    },
    {
      text: 'Location independence: customer unaware of physical resource',
      art: <RichCloud w={136} />,
    },
    {
      text: 'AWS: EC2 hosts run multiple tenants via shared hypervisor',
      art: (
        <>
          <img src="/assets/tech/aws.png" alt="" className="mb-2 h-[30px] w-auto" draggable={false} />
          <ClayRack w={64} units={['run', 'run', 'run']} />
        </>
      ),
    },
  ]
  return (
    <Card id="pooling" kicker="Pooling And Multi-Tenancy" title="Shared Infrastructure Model" lead="Resource pooling means provider infrastructure is shared across customers, with capacity assigned dynamically rather than dedicated per customer" lesson={lesson} beat={beat} total={4}>
      <div className="grid grid-cols-4 gap-[14px]">
        {points.map((p) => (
          <PointCard key={p.text} text={p.text} art={p.art} w={267} h={300} />
        ))}
      </div>
    </Card>
  )
}

/** The picture: three tenants take slices of one host through the hypervisor; capacity moves between them. */
export function TenantRackTwo({ lesson }: { lesson: string }) {
  const beat = useBeats(2)
  const tick = useTicker(true, 2400, 0)
  const ease = useEase()
  /* capacity assigned dynamically: each tenant's slice count changes every step */
  const shares = [
    [2, 3, 1],
    [3, 1, 2],
    [1, 2, 3],
    [2, 2, 2],
  ][tick % 4]
  const slots: number[] = []
  shares.forEach((s, t) => {
    for (let k = 0; k < s; k++) slots.push(t)
  })
  return (
    <Card id="pooling-2" kicker="Pooling And Multi-Tenancy" title="Shared Infrastructure Model" lesson={lesson} beat={beat} total={2}>
      <Stage w={BOX_W} h={410} active={false}>
        <At x={30} y={22} w={1050}>
          <div className="grid grid-cols-3 gap-4">
            {['Tenant A', 'Tenant B', 'Tenant C'].map((t, i) => (
              <div key={t} className="flex items-center gap-3 rounded-xl px-3 py-2" style={tile(`2px ${TENANT_TONES[i]}`)}>
                <TenantTile w={46} tone={TENANT_TONES[i]} />
                <div className="flex flex-col">
                  <span className="font-heading text-[17px] font-semibold" style={{ color: colors.ink }}>{t}</span>
                  <span className="text-[15px]" style={{ color: colors.ink }}>{`${shares[i]} slice${shares[i] === 1 ? '' : 's'} now`}</span>
                </div>
              </div>
            ))}
          </div>
        </At>
        <At x={30} y={112} w={1050}>
          <div className="grid grid-cols-6 gap-2.5">
            {slots.map((t, k) => (
              <div key={k} className={`relative grid h-[66px] place-items-center rounded-xl ${mo('pulse', k).className}`} style={{ ...solid(TENANT_TONES[t]), transition: ease, ...mo('pulse', k).style }}>
                <span className="text-[17px] font-semibold text-white">{['A', 'B', 'C'][t]}</span>
                <span className="absolute right-2 top-2"><Padlock w={12} tone={colors.white} /></span>
              </div>
            ))}
          </div>
        </At>
        <At x={30} y={192} w={1050}>
          <div className={`grid h-[44px] place-items-center rounded-xl font-heading text-[17px] font-semibold text-white ${mo('pulse', 7).className}`} style={{ ...solid(colors.brandDark), ...mo('pulse', 7).style }}>Hypervisor</div>
        </At>
        <At x={30} y={248} w={1050}>
          <div className="flex h-[96px] items-center gap-8 rounded-xl px-6" style={tile()}>
            <div className="flex gap-3">
              {[0, 1, 2].map((k) => <ClayServer key={k} w={130} />)}
            </div>
            <span className="text-[17px] font-semibold" style={{ color: colors.ink }}>Shared physical hardware</span>
          </div>
        </At>
        <At x={30} y={360} w={1050}>
          <div className="flex items-center gap-2">
            <img src="/assets/tech/aws.png" alt="" className="h-[20px] w-auto" draggable={false} />
            <Label tone="brand" size={15}>EC2 host: many tenants</Label>
          </div>
        </At>
      </Stage>
    </Card>
  )
}
