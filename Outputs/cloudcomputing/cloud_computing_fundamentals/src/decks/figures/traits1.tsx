import { useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { Card, Stage, At, Fade, Label, Note, Arrow, Rail, Control, Traveller, useBeatState, useTicker, STILL, BOX_W } from './scene'
import { Idling, BUST, FACE } from './Cast'
import { MEERA, RAVI, TENANTS } from './people'
import { Calendar, CloudShape, Desktop, Laptop, MeterDial, MiniPhone, Padlock, Rack, ServerUnit, Terminal, Ticket, useEase } from './art'

/**
 * SECTION 3, ESSENTIAL CHARACTERISTICS - I (Merrill): the five traits named,
 * then the first three shown working. Every string is the reference's.
 */

/* ================================================================== 24 · Five NIST Traits (reference 27 + 28) */

const TRAITS = [
  { name: 'On-Demand Self-Service', gloss: 'On-demand self-service: provisioning without human intervention' },
  { name: 'Broad Network Access', gloss: 'Broad network access: reachable over standard protocols' },
  { name: 'Resource Pooling', gloss: 'Resource pooling: shared infrastructure across multiple tenants' },
  { name: 'Rapid Elasticity', gloss: 'Rapid elasticity: capacity scales automatically with demand' },
  { name: 'Measured Service', gloss: 'Measured service: usage metered and billed per consumption' },
]

function TraitMini({ i }: { i: number }): ReactNode {
  const tick = useTicker(true, 900, 2)
  if (i === 0)
    return (
      <div className="flex items-center gap-2">
        <Laptop w={70} glow />
        <div className="flex flex-col gap-1">{[0, 1].map((k) => <div key={k} style={{ opacity: k <= tick % 2 ? 1 : 0.2, transition: 'opacity 400ms' }}><ServerUnit w={44} /></div>)}</div>
      </div>
    )
  if (i === 1)
    return (
      <div className="flex items-end gap-2">
        <Laptop w={58} glow={tick % 3 === 0} />
        <MiniPhone w={22} lit={tick % 3 === 1} />
        <Terminal w={44} lit={tick % 3 === 2} />
      </div>
    )
  if (i === 2)
    return (
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((k) => <Idling key={k} cfg={TENANTS[k]} scale={0.2} crop={FACE} seed={90 + k} />)}
        <Rack w={30} units={['run', 'run', 'run']} />
      </div>
    )
  if (i === 3)
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 4 }, (_, k) => <div key={k} style={{ opacity: k < 1 + (tick % 4) ? 1 : 0.15, transition: 'opacity 400ms' }}><ServerUnit w={30} /></div>)}
      </div>
    )
  return <MeterDial w={70} value={((tick % 5) + 1) / 6} spin={!STILL} />
}

export function TraitRing({ lesson }: { lesson: string }) {
  const beat = useBeats(6)
  const [pick, setPick] = useBeatState<number | null>(beat, () => null)
  const lit = pick ?? (beat >= 2 ? beat - 2 : null)
  const ease = useEase()
  const R = { cx: 280, cy: 182, rx: 200, ry: 140 }
  const pos = TRAITS.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5
    return { x: R.cx + R.rx * Math.cos(a), y: R.cy + R.ry * Math.sin(a) }
  })
  const items = TRAITS.map((t, i) => ({ text: t.gloss, at: i + 2 }))
  return (
    <Card id="five-traits" kicker="Essential Characteristics" title="Five NIST Traits" lead="NIST formally defines cloud computing through five essential characteristics, the standard checklist that distinguishes cloud from traditional IT" lesson={lesson} beat={beat} total={6}>
      <div className="flex gap-4">
        <Stage w={560} h={360} active={beat === 1}>
          <svg className="absolute inset-0" width={560} height={360} aria-hidden>
            <ellipse cx={R.cx} cy={R.cy} rx={R.rx - 40} ry={R.ry - 30} fill="none" stroke={colors.line} strokeWidth={2} strokeDasharray="6 8" />
          </svg>
          <At x={R.cx} y={R.cy} cx cy>
            <div className="grid h-[120px] w-[180px] place-items-center rounded-full" style={{ background: colors.white, boxShadow: `inset 0 0 0 2px ${lit !== null ? colors.brand : colors.line}`, transition: ease }}>
              {lit === null ? (
                <div className="flex flex-col items-center">
                  <CloudShape w={96} />
                  <span className="font-heading text-[16px] font-semibold" style={{ color: colors.brandDark }}>Cloud</span>
                </div>
              ) : (
                <TraitMini key={lit} i={lit} />
              )}
            </div>
          </At>
          {TRAITS.map((t, i) => {
            const on = lit === i
            const seen = beat >= i + 2
            return (
              <At key={t.name} x={pos[i].x} y={pos[i].y} cx cy>
                <button
                  type="button"
                  onClick={(e) => {
                    setPick(i)
                    e.currentTarget.blur()
                  }}
                  className="grid h-[52px] w-[150px] place-items-center rounded-xl px-2 text-center font-heading text-[14px] font-semibold leading-tight"
                  style={{ background: on ? colors.brand : seen ? colors.surface2 : colors.white, color: on ? colors.white : colors.brandDark, boxShadow: on ? `0 10px 22px -12px ${colors.brand}` : `inset 0 0 0 1.5px ${colors.brand}`, transition: ease }}
                >
                  {t.name}
                </button>
              </At>
            )
          })}
        </Stage>
        <Rail items={items} beat={lit !== null && pick !== null ? Math.max(beat, lit + 2) : beat} width={534} size={16} gap={10} />
      </div>
    </Card>
  )
}

/* ================================================================== 25 · No Human Intervention */

export function SelfService({ lesson }: { lesson: string }) {
  const beat = useBeats(4)
  const [tab, setTab] = useBeatState<'Console' | 'CLI' | 'API'>(beat, () => 'Console')
  const [launched, setLaunched] = useBeatState(beat, (b) => b >= 4)
  const tick = useTicker(beat === 2, 700, 6)
  const desk = tick % 4
  const ease = useEase()
  const items = [
    { text: 'Customer requests via console, CLI or API', at: 1 },
    { text: 'Contrasts with traditional IT: weeks-long procurement tickets', at: 2 },
    { text: "AWS: EC2 'Launch Instance' or CLI run-instances call", at: 3 },
  ]
  return (
    <Card id="self-service" kicker="On-Demand Self-Service" title="No Human Intervention" lead="On-demand self-service lets a customer provision computing resources automatically, without requiring a phone call or ticket to the provider's staff" lesson={lesson} beat={beat} total={4}>
      <div className="flex gap-4">
        <Rail items={items} beat={Math.min(beat, 3)} width={360} size={16} />
        <div className="flex flex-col gap-3" style={{ width: 734 }}>
          <Stage w={734} h={138} active={beat === 2}>
            <At x={14} y={10}><Idling cfg={RAVI} scale={0.36} crop={BUST} seed={21} expression={beat >= 2 ? 'bored' : 'neutral'} /></At>
            {[0, 1, 2].map((k) => (
              <At key={k} x={150 + k * 140} y={56} w={120}>
                <div className="grid h-[40px] w-[110px] place-items-center rounded-lg" style={{ background: colors.surface, boxShadow: `inset 0 0 0 1px ${colors.line}` }}>
                  <span className="text-[14px] font-medium" style={{ color: colors.ink }}>{['manager', 'finance', 'IT desk'][k]}</span>
                </div>
              </At>
            ))}
            <div className="absolute" style={{ left: 172 + Math.min(desk, 2) * 140, top: 6, opacity: beat >= 2 ? 1 : 0, transition: ease }}>
              <Ticket w={64} struck={beat >= 3} />
            </div>
            <At x={150} y={102}><Fade on={beat >= 2}><Label tone={beat >= 3 ? 'muted' : 'bad'} size={12}>Weeks-long procurement ticket</Label></Fade></At>
            <At x={620} y={30}><Fade on={beat >= 2}><Calendar w={56} page={beat >= 3 ? 6 : desk + 1} /></Fade></At>
          </Stage>
          <Stage w={734} h={222} active={beat === 1 || beat === 3}>
            <At x={14} y={14}><Idling cfg={MEERA} scale={0.48} seed={22} expression={launched ? 'happy' : 'neutral'} /></At>
            <At x={134} y={16} w={320}>
              <div className="flex gap-1.5">
                {(['Console', 'CLI', 'API'] as const).map((t) => (
                  <Control key={t} on={tab === t} onClick={() => setTab(t)} size={13}>{t}</Control>
                ))}
              </div>
            </At>
            <At x={134} y={58} w={320}>
              <div className="flex h-[150px] flex-col justify-center gap-3 rounded-xl px-4" style={{ background: tab === 'Console' ? colors.white : colors.night, boxShadow: `inset 0 0 0 1.5px ${colors.line}`, transition: ease }}>
                {tab === 'Console' ? (
                  <>
                    <div className="flex items-center gap-2">
                      <img src="/assets/tech/aws.png" alt="" className="h-[16px] w-auto" draggable={false} />
                      <span className="text-[14px] font-semibold" style={{ color: colors.ink }}>EC2</span>
                    </div>
                    <Fade on={beat >= 3}>
                      <Control on onClick={() => setLaunched(true)}>Launch Instance</Control>
                    </Fade>
                  </>
                ) : (
                  <>
                    <span className="font-mono text-[15px]" style={{ color: colors.white }}>{tab === 'CLI' ? 'run-instances' : 'RunInstances'}</span>
                    <Fade on={beat >= 3}>
                      <Control on onClick={() => setLaunched(true)}>{tab === 'CLI' ? 'Run' : 'Send'}</Control>
                    </Fade>
                  </>
                )}
              </div>
            </At>
            <Arrow x1={464} y1={132} x2={524} y2={132} on={launched} />
            <At x={528} y={18} w={196}>
              <div className="flex flex-col items-center gap-1.5">
                {[0, 1, 2].map((k) => (
                  <Fade key={k} on={launched} delay={k * 160}>
                    <ServerUnit w={104} />
                  </Fade>
                ))}
                <Fade on={launched} delay={500}>
                  <div className="flex flex-col items-center">
                    <Label tone="good" size={13} strong>Resources provisioned</Label>
                    <span className="mt-0.5 whitespace-nowrap text-[14px] font-medium" style={{ color: colors.ink }}>without human intervention</span>
                  </div>
                </Fade>
              </div>
            </At>
          </Stage>
        </div>
      </div>
    </Card>
  )
}

/* ================================================================== 27 · Ubiquitous Standard Access */

const DEVICES = [
  { label: 'Laptop', x: 180, y: 24 },
  { label: 'Mobile app', x: 930, y: 24 },
  { label: 'Browser console', x: 180, y: 196 },
  { label: 'CLI', x: 930, y: 196 },
]

function DeviceArt({ i, lit }: { i: number; lit: boolean }) {
  if (i === 0) return <Laptop w={96} glow={lit} />
  if (i === 1) return <MiniPhone w={36} lit={lit} />
  if (i === 2) return <Desktop w={96} lit={lit} />
  return <Terminal w={78} lit={lit} />
}

export function DeviceRing({ lesson }: { lesson: string }) {
  const beat = useBeats(3)
  const [sent, setSent] = useState<{ i: number; n: number } | null>(null)
  const tick = useTicker(beat >= 3 && sent === null, 1500, 0)
  const active = sent?.i ?? (beat >= 3 ? tick % 4 : -1)
  const hub = { x: BOX_W / 2, y: 160 }
  const people = [MEERA, TENANTS[1], TENANTS[0], RAVI]
  return (
    <Card id="network-access" kicker="Broad Network Access" title="Ubiquitous Standard Access" lead="Broad network access means cloud resources are reachable over standard network protocols from heterogeneous client devices, laptops, phones or thin clients alike" lesson={lesson} beat={beat} total={3}>
      <Stage w={BOX_W} h={360} active={false}>
        {DEVICES.map((d, i) => (
          <Arrow key={d.label} x1={d.x < hub.x ? d.x + 150 : d.x - 150} y1={d.y + 40} x2={d.x < hub.x ? hub.x - 100 : hub.x + 100} y2={hub.y + (d.y < hub.y ? -20 : 20)} on={beat >= 1} tone={active === i ? colors.accent : colors.brand} both />
        ))}
        {DEVICES.map((d, i) => (
          <At key={`t${d.label}`} x={(d.x + hub.x) / 2 + (d.x < hub.x ? 20 : -20)} y={(d.y + 40 + hub.y) / 2 - 26} cx>
            <Label size={12} tone={active === i ? 'warn' : 'brand'} mono>HTTPS/API</Label>
          </At>
        ))}
        <At x={hub.x} y={hub.y} cx cy>
          <div className="flex h-[150px] w-[190px] flex-col items-center justify-center gap-2 rounded-full" style={{ background: colors.brand, boxShadow: `0 18px 40px -20px ${colors.brand}` }}>
            <div className="rounded-lg bg-white px-2 py-1"><img src="/assets/tech/aws.png" alt="" className="h-[24px] w-auto" draggable={false} /></div>
            <span className="font-heading text-[18px] font-semibold text-white">AWS API</span>
          </div>
        </At>
        {DEVICES.map((d, i) => (
          <At key={`d${d.label}`} x={d.x} y={d.y} cx>
            <Fade on={beat >= 2} delay={i * 120}>
              <button
                type="button"
                onClick={(e) => {
                  setSent({ i, n: (sent?.n ?? 0) + 1 })
                  e.currentTarget.blur()
                }}
                className="flex items-end gap-2 rounded-2xl px-2 pb-1 pt-1"
                style={{ background: active === i ? colors.surface2 : 'transparent', boxShadow: active === i ? `inset 0 0 0 2px ${colors.accent}` : 'none' }}
              >
                <Idling cfg={people[i]} scale={0.3} crop={BUST} seed={100 + i} />
                <div className="flex flex-col items-center gap-1">
                  <DeviceArt i={i} lit={active === i} />
                  <Label size={13} strong tone={active === i ? 'brand' : 'plain'}>{d.label}</Label>
                </div>
              </button>
            </Fade>
          </At>
        ))}
        {active >= 0 && <Traveller k={`${active}-${sent?.n ?? tick}`} run path={[[DEVICES[active].x, DEVICES[active].y + 60], [hub.x, hub.y], [DEVICES[active].x, DEVICES[active].y + 60]]} dur={1.4} />}
        <At x={hub.x} y={330} cx><Fade on={beat >= 3}><Note size={14}>Press a device to send its request</Note></Fade></At>
      </Stage>
    </Card>
  )
}

/* ================================================================== 28 · Shared Infrastructure Model */

const TONES = [colors.accent, colors.teal, colors.brand]

export function TenantRack({ lesson }: { lesson: string }) {
  const beat = useBeats(4)
  const tick = useTicker(true, 1600, 0)
  const [hide, setHide] = useBeatState(beat, (b) => b >= 3)
  const ease = useEase()
  /* capacity assigned dynamically: each tenant's slice count changes over time */
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
  const items = [
    { text: 'Multi-tenancy: multiple customers share same physical hardware', at: 1 },
    { text: 'Hypervisor: virtualization software splitting one server into isolated tenants', at: 2 },
    { text: 'Location independence: customer unaware of physical resource', at: 3 },
    { text: 'AWS: EC2 hosts run multiple tenants via shared hypervisor', at: 4 },
  ]
  return (
    <Card id="pooling" kicker="Pooling And Multi-Tenancy" title="Shared Infrastructure Model" lead="Resource pooling means provider infrastructure is shared across customers, with capacity assigned dynamically rather than dedicated per customer" lesson={lesson} beat={beat} total={4}>
      <div className="flex gap-4">
        <Rail items={items} beat={beat} width={404} size={16} />
        <Stage w={690} h={360} active={false}>
          <At x={20} y={14} w={650}>
            <div className="grid grid-cols-3 gap-3">
              {['Tenant A', 'Tenant B', 'Tenant C'].map((t, i) => (
                <div key={t} className="flex items-center gap-2 rounded-xl bg-white px-2 py-1.5" style={{ boxShadow: `inset 0 0 0 2px ${TONES[i]}` }}>
                  <Idling cfg={TENANTS[i]} scale={0.26} crop={FACE} seed={110 + i} />
                  <div className="flex flex-col">
                    <span className="font-heading text-[14px] font-semibold" style={{ color: colors.ink }}>{t}</span>
                    <span className="text-[14px]" style={{ color: colors.ink }}>{`${shares[i]} slices now`}</span>
                  </div>
                </div>
              ))}
            </div>
          </At>
          <At x={20} y={96} w={650}>
            <div className="grid grid-cols-6 gap-2">
              {slots.map((t, k) => (
                <div key={k} className="relative grid h-[60px] place-items-center rounded-lg" style={{ background: TONES[t], transition: ease }}>
                  <span className="text-[14px] font-semibold text-white">{['A', 'B', 'C'][t]}</span>
                  {beat >= 2 && <span className="absolute right-1 top-1"><Padlock w={10} tone={colors.white} /></span>}
                </div>
              ))}
            </div>
          </At>
          <At x={20} y={168} w={650}>
            <Fade on={beat >= 2}>
              <div className="grid h-[38px] place-items-center rounded-xl font-heading text-[15px] font-semibold text-white" style={{ background: colors.brandDark }}>Hypervisor</div>
            </Fade>
          </At>
          <At x={20} y={216} w={650}>
            <div className="relative flex h-[66px] items-center justify-center gap-3 rounded-xl bg-white" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
              <div className="flex gap-2" style={{ filter: hide ? 'blur(5px)' : 'none', opacity: hide ? 0.5 : 1, transition: ease }}>
                <ServerUnit w={70} />
                <ServerUnit w={70} />
                <span className="self-center text-[14px] font-medium" style={{ color: colors.ink }}>rack 14, host 3</span>
              </div>
              <span className="text-[14px] font-medium" style={{ color: colors.ink }}>Shared physical hardware</span>
            </div>
          </At>
          <At x={20} y={296} w={650}>
            <div className="flex items-center justify-between">
              <Fade on={beat >= 3}>
                <Control on={hide} onClick={() => setHide(!hide)} size={13}>{hide ? 'Where does it run? Hidden' : 'Where does it run? Shown'}</Control>
              </Fade>
              <Fade on={beat >= 4}>
                <div className="flex items-center gap-2">
                  <img src="/assets/tech/aws.png" alt="" className="h-[18px] w-auto" draggable={false} />
                  <Label tone="brand" size={13}>EC2 host: many tenants</Label>
                </div>
              </Fade>
            </div>
          </At>
        </Stage>
      </div>
    </Card>
  )
}

