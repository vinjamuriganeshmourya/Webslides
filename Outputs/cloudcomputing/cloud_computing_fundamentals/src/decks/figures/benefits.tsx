import { useState } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { Card, Stage, At, Fade, Label, Arrow, Rail, Control, LeadLines, Traveller, useBeatState, useTicker, STILL, BOX_W } from './scene'
import { Idling, BUST, FACE } from './Cast'
import { ANITA, MEERA, RAVI, TENANTS } from './people'
import { Balance, Bell, Coin, Coins, Idea, MapGround, Padlock, Pin, Rocket, ServerUnit, useEase } from './art'

/**
 * SECTION 5, BENEFITS & CHALLENGES (4MAT): every benefit with the risk it
 * carries. Every string is the reference's.
 */

/* ================================================================== 38 · Cloud Trade-Offs Map (reference 43 + 44) */

const PAIRS: [string, string][] = [
  ['Cost model shift (CapEx→OpEx)', 'Vendor lock-in'],
  ['Elasticity of resources', 'Cost overruns'],
  ['Global reach', 'Latency'],
  ['Speed to market', 'Data residency'],
]

export function TradeoffScale({ lesson }: { lesson: string }) {
  const beat = useBeats(4)
  const ease = useEase()
  const tilt = [6, -4, 3, 0][beat - 1]
  return (
    <Card id="tradeoffs" kicker="Benefits & Challenges" title="Cloud Trade-Offs Map" lead="Cloud adoption delivers clear business benefits, but each benefit carries a matching operational risk; recognising both before migration separates sound architecture decisions from costly surprises" lesson={lesson} beat={beat} total={4}>
      <div className="flex gap-4">
        <Stage w={330} h={360} active={false}>
          <At x={165} y={20} cx><Idling cfg={ANITA} scale={0.42} crop={BUST} seed={31} expression="thinking" /></At>
          <At x={165} y={150} cx><Balance w={290} tilt={tilt} /></At>
          <At x={16} y={300} w={140}>
            <div className="flex justify-center"><Label tone="brand" size={12} strong>{PAIRS[beat - 1][0].split(' (')[0]}</Label></div>
          </At>
          <At x={174} y={300} w={140}>
            <div className="flex justify-center"><Label tone="bad" size={12} strong>{PAIRS[beat - 1][1]}</Label></div>
          </At>
        </Stage>
        <Stage w={764} h={360} active={false} pad={16}>
          <div className="grid items-center" style={{ gridTemplateColumns: '1fr 80px 1fr', rowGap: 12 }}>
            <span className="text-right font-heading text-[14px] font-semibold tracking-[0.06em]" style={{ color: colors.brandDark }}>BENEFITS</span>
            <span />
            <span className="font-heading text-[14px] font-semibold tracking-[0.06em]" style={{ color: colors.danger }}>CHALLENGES</span>
            {PAIRS.map(([b, c], i) => {
              const on = beat >= i + 1
              const now = beat === i + 1
              return [
                <div key={`b${i}`} className="rounded-xl px-4 py-3 text-right text-[15px] font-semibold" style={{ background: now ? colors.surface2 : colors.white, boxShadow: `inset 0 0 0 ${now ? 2 : 1.5}px ${colors.brand}`, color: colors.ink, opacity: on ? 1 : 0, transition: ease }}>{b}</div>,
                <div key={`a${i}`} className="relative h-[20px]"><Arrow x1={12} y1={10} x2={68} y2={10} on={on} both tone={colors.muted} /></div>,
                <div key={`c${i}`} className="rounded-xl px-4 py-3 text-[15px] font-semibold" style={{ background: now ? '#FDECEC' : colors.white, boxShadow: `inset 0 0 0 ${now ? 2 : 1.5}px ${colors.danger}`, color: colors.ink, opacity: on ? 1 : 0, transition: ease }}>{c}</div>,
              ]
            })}
          </div>
        </Stage>
      </div>
    </Card>
  )
}

/* ================================================================== 39 · CapEx To OpEx (reference 45 + 46) */

function Bars({ title, values, tone, on, active }: { title: string; values: number[]; tone: string; on: boolean; active?: boolean }) {
  const ease = useEase(800)
  return (
    <Stage w={316} h={206} active={active} pad={12}>
      <span className="font-heading text-[15px] font-semibold" style={{ color: colors.ink }}>{title}</span>
      <div className="mt-2 flex h-[120px] items-end justify-around border-b-2" style={{ borderColor: colors.line }}>
        {values.map((v, i) => (
          <div key={i} className="w-[44px] rounded-t-md" style={{ height: on ? Math.max(4, v * 116) : 4, background: tone, transition: ease, transitionDelay: `${i * 90}ms` }} />
        ))}
      </div>
      <div className="mt-1.5 flex justify-around">
        {['Yr 1', 'Yr 2', 'Yr 3', 'Yr 4'].map((y) => (
          <span key={y} className="w-[44px] text-center text-[14px] font-medium" style={{ color: colors.ink }}>{y}</span>
        ))}
      </div>
    </Stage>
  )
}

export function CapexOpex({ lesson }: { lesson: string }) {
  const beat = useBeats(4)
  const [reserved, setReserved] = useBeatState(beat, () => false)
  const opex = reserved ? [0.17, 0.18, 0.16, 0.19] : [0.22, 0.25, 0.21, 0.26]
  const items = [
    { text: 'No upfront hardware purchase or depreciation schedule', at: 1 },
    { text: 'Spend scales largely with actual resource usage (committed-use options like Reserved Instances trade some flexibility for lower rates)', at: 2 },
    { text: 'Frees capital for core business investment', at: 3 },
    { text: 'AWS Cost Explorer and Billing Dashboard track OpEx spend', at: 4 },
  ]
  return (
    <Card
      id="capex-opex"
      kicker="Cost Model Shift"
      title="CapEx To OpEx"
      lead={<LeadLines lines={['On-premise IT demands large upfront capital expenditure on hardware before any workload runs', "Cloud shifts most of that spend to metered operating expenditure, billed for resources as they're consumed"]} />}
      lesson={lesson}
      beat={beat}
      total={4}
    >
      <div className="flex gap-4">
        <Rail items={items} beat={beat} width={440} size={16} gap={8} />
        <div className="flex flex-col gap-3" style={{ width: 654 }}>
          <div className="flex gap-[22px]">
            <Bars title="CapEx" values={[1, 0, 0, 0]} tone={colors.muted} on active={beat === 1} />
            <Bars title="OpEx" values={opex} tone={colors.brand} on={beat >= 2} active={beat === 2} />
          </div>
          <div className="flex items-center justify-between">
            <Fade on={beat >= 2}>
              <Control on={reserved} onClick={() => setReserved(!reserved)} size={13}>{reserved ? 'Reserved Instances: on' : 'Reserved Instances: off'}</Control>
            </Fade>
            <Fade on={beat >= 3}>
              <div className="flex items-center gap-2">
                <Coins w={26} n={6} />
                <Label tone="good" size={13}>capital kept for the business</Label>
              </div>
            </Fade>
            <Fade on={beat >= 4}>
              <div className="flex items-center gap-2">
                <img src="/assets/tech/aws.png" alt="" className="h-[16px] w-auto" draggable={false} />
                <Label tone="brand" size={13}>Cost Explorer</Label>
              </div>
            </Fade>
          </div>
        </div>
      </div>
    </Card>
  )
}

/* ================================================================== 41 · Scale Reach Speed */

const REGIONS: [number, number][] = [
  [110, 70], [150, 120], [250, 60], [300, 95], [330, 150], [420, 75], [460, 120], [520, 170], [560, 90], [590, 200],
]

export function GrowthSpeed({ lesson }: { lesson: string }) {
  const beat = useBeats(4)
  const tick = useTicker(beat === 2, 500, 10)
  const ease = useEase()
  const shown = beat >= 3 ? REGIONS.length : beat === 2 ? Math.min(REGIONS.length, 1 + tick) : 0
  const items = [
    { text: 'Elasticity: autoscaling matches spend to real-time load', at: 1 },
    { text: 'Global reach: new AWS Region live in minutes', at: 2 },
    { text: 'Speed to market: idea to production in days', at: 3 },
    { text: 'Real-world: AWS Auto Scaling groups, Global Infrastructure Region map', at: 4 },
  ]
  return (
    <Card id="growth-speed" kicker="Growth And Speed Benefits" title="Scale Reach Speed" lead="Elasticity, global reach and speed to market convert cloud's technical flexibility into concrete business value: faster launches, worldwide presence and lower idle spend" lesson={lesson} beat={beat} total={4}>
      <div className="flex gap-4">
        <Rail items={items} beat={beat} width={404} size={16} />
        <Stage w={690} h={360} active={false}>
          {/* beat 1: spend follows load */}
          <div className="absolute inset-0" style={{ opacity: beat === 1 ? 1 : 0, transition: ease }}>
            <At x={24} y={20}><Label strong size={14}>load and spend</Label></At>
            <svg className="absolute" style={{ left: 24, top: 60 }} width={640} height={250} aria-hidden>
              <path d="M 0 220 C 120 210 180 60 300 50 C 420 40 480 200 640 210" fill="none" stroke={colors.brand} strokeWidth={4} />
              <path d="M 0 226 H 100 V 150 H 200 V 70 H 380 V 150 H 500 V 216 H 640" fill="none" stroke={colors.teal} strokeWidth={4} strokeDasharray="1" pathLength={1} style={{ strokeDashoffset: beat === 1 ? 0 : 1, transition: 'stroke-dashoffset 1100ms' }} />
            </svg>
            <At x={420} y={20}>
              <div className="flex gap-3">
                <Label tone="brand" size={13}>load</Label>
                <Label tone="good" size={13}>spend</Label>
              </div>
            </At>
          </div>
          {/* beat 2 and 3: Regions light up, then idea to production */}
          <div className="absolute inset-0" style={{ opacity: beat === 2 || beat === 3 ? 1 : 0, transition: ease }}>
            <At x={24} y={18}><MapGround w={642} h={240} /></At>
            {REGIONS.map(([x, y], i) => (
              <At key={i} x={24 + x} y={18 + y} cx>
                <div style={{ opacity: i < shown ? 1 : 0, transform: i < shown ? 'none' : 'translateY(-10px)', transition: ease }}>
                  <Pin w={22} tone={i === shown - 1 && beat === 2 ? colors.accent : colors.brand} />
                </div>
              </At>
            ))}
            <At x={36} y={30}><Label tone="brand" size={13}>{`${shown} Regions`}</Label></At>
            <At x={24} y={272} w={642}>
              <Fade on={beat >= 3}>
                <div className="flex items-center gap-3">
                  <Idea w={26} />
                  <div className="relative h-[10px] flex-1 rounded-full" style={{ background: colors.surface2 }}>
                    <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: beat >= 3 ? '22%' : '0%', background: colors.success, transition: 'width 900ms' }} />
                  </div>
                  <Rocket w={22} />
                  <Label tone="good" size={13}>production in days</Label>
                </div>
                <div className="mt-2 flex items-center gap-3 opacity-60">
                  <span className="block w-[26px]" />
                  <div className="relative h-[10px] flex-1 rounded-full" style={{ background: colors.surface2 }}>
                    <div className="absolute inset-y-0 left-0 w-full rounded-full" style={{ background: colors.muted }} />
                  </div>
                  <span className="block w-[22px]" />
                  <Label tone="muted" size={13}>buying hardware: months</Label>
                </div>
              </Fade>
            </At>
          </div>
          {/* beat 4: the real capture */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4" style={{ opacity: beat >= 4 ? 1 : 0, transition: ease }}>
            <div className="overflow-hidden rounded-xl" style={{ boxShadow: `0 0 0 1.5px ${colors.line}, 0 14px 30px -18px rgba(0,37,75,0.5)` }}>
              <img src="/shots/aws-global-infrastructure-regions.png" alt="The AWS Global Infrastructure page, showing Regions worldwide" width={540} height={304} draggable={false} style={{ display: 'block' }} />
            </div>
            <span className="text-[14px] font-medium" style={{ color: colors.ink }}>The AWS Global Infrastructure page, showing Regions worldwide</span>
          </div>
        </Stage>
      </div>
    </Card>
  )
}

/* ================================================================== 42 · Switching Cost Risk */

export function LockIn({ lesson }: { lesson: string }) {
  const beat = useBeats(4)
  const [tries, setTries] = useState(0)
  const instant = useInstant()
  const ease = useEase()
  const open = beat >= 4
  const items = [
    { text: 'Proprietary services (Lambda triggers, DynamoDB APIs) resist portability', at: 1 },
    { text: 'Data egress fees add direct exit cost', at: 2 },
    { text: "Team skill-set built around one provider's tools", at: 3 },
    { text: 'Mitigation: multi-cloud design, open standards, Infrastructure as Code', at: 4 },
  ]
  return (
    <Card id="lock-in" kicker="Vendor Lock-In" title="Switching Cost Risk" lead="Deep reliance on one provider's proprietary APIs, data formats or managed services makes moving a workload elsewhere slow, risky and expensive" lesson={lesson} beat={beat} total={4}>
      <div className="flex gap-4">
        <Rail items={items} beat={beat} width={404} size={16} />
        <Stage w={690} h={360} active={false}>
          <At x={24} y={24} w={300}>
            <div className="rounded-2xl p-3.5" style={{ background: colors.surface2, boxShadow: `inset 0 0 0 2px ${colors.brand}` }}>
              <span className="block font-heading text-[14px] font-semibold tracking-[0.06em]" style={{ color: colors.brandDark }}>ONE PROVIDER</span>
              <motion.div
                key={`${tries}-${open}`}
                className="mt-2 rounded-xl bg-white p-3"
                style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}
                initial={false}
                animate={{ x: instant || STILL || tries === 0 ? 0 : open ? [0, 0] : [0, 90, 70, 0] }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
              >
                <span className="block text-[15px] font-semibold" style={{ color: colors.ink }}>Your application</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {open ? (
                    <>
                      <Label tone="good" size={12}>open standards</Label>
                      <Label tone="good" size={12}>Infrastructure as Code</Label>
                    </>
                  ) : (
                    <>
                      <Label tone="brand" size={12} mono>Lambda triggers</Label>
                      <Label tone="brand" size={12} mono>DynamoDB APIs</Label>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </At>
          <At x={352} y={88}>
            <div className="flex flex-col items-center gap-1" style={{ opacity: beat >= 2 ? 1 : 0, transition: ease }}>
              <Padlock w={30} open={open} tone={open ? colors.success : colors.danger} />
              <span className="text-center text-[14px] font-semibold" style={{ color: open ? colors.success : colors.danger }}>Data egress fees</span>
            </div>
          </At>
          <Arrow x1={336} y1={150} x2={470} y2={150} on={beat >= 1} dashed tone={open ? colors.success : colors.danger} />
          <At x={480} y={92} w={180}>
            <div className="grid h-[110px] place-items-center rounded-2xl border-2 border-dashed text-center" style={{ borderColor: open ? colors.success : colors.line, background: colors.white, transition: ease }}>
              <span className="font-heading text-[15px] font-semibold" style={{ color: colors.ink }}>Other providers</span>
            </div>
          </At>
          <At x={480} y={214} w={180}>
            <Fade on={beat >= 2}>
              <div className="flex items-center justify-center gap-1.5">
                <Coin w={22} />
                <Coin w={22} />
                <Coin w={22} />
                <Label tone="bad" size={12}>exit cost</Label>
              </div>
            </Fade>
          </At>
          <At x={24} y={210} w={300}>
            <Fade on={beat >= 3}>
              <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
                {[MEERA, RAVI, TENANTS[2]].map((c, i) => (
                  <Idling key={i} cfg={c} scale={0.24} crop={FACE} seed={120 + i} />
                ))}
                <span className="text-[14px] font-medium" style={{ color: colors.ink }}>skills in one provider's tools</span>
              </div>
            </Fade>
          </At>
          <At x={24} y={300} w={640}>
            <div className="flex items-center justify-between">
              <Control onClick={() => setTries(tries + 1)} size={13}>Move the application</Control>
              <span className="text-[14px] font-semibold" style={{ color: open ? colors.success : tries > 0 ? colors.danger : colors.muted }}>
                {open ? 'it moves: nothing fitted to one provider' : tries > 0 ? 'it snaps back: built from one provider’s parts' : 'try it'}
              </span>
            </div>
          </At>
        </Stage>
      </div>
    </Card>
  )
}

/* ================================================================== 44 · Unplanned Billing Risk */

const BILL = [0.1, 0.17, 0.24, 0.32, 0.4, 0.5, 0.95]

export function Overruns({ lesson }: { lesson: string }) {
  const beat = useBeats(4)
  const [stopped, setStopped] = useBeatState(beat, () => false)
  const ease = useEase()
  const values = stopped ? BILL.map((v, i) => (i >= 5 ? 0.32 : v)) : BILL
  const items = [
    { text: 'Idle or forgotten resources keep billing after use', at: 1 },
    { text: 'Misconfigured autoscaling can multiply costs unexpectedly', at: 2 },
    { text: 'Data transfer and API charges accumulate unnoticed', at: 3 },
    { text: 'AWS Budgets and Cost Anomaly Detection flag abnormal spend', at: 4 },
  ]
  const W = 400
  const H = 210
  const pts = values.map((v, i) => [12 + (i / (values.length - 1)) * (W - 24), H - 10 - v * (H - 24)] as [number, number])
  const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ')
  return (
    <Card id="cost-overruns" kicker="Cost Overruns" title="Unplanned Billing Risk" lead="Pay-per-use billing grows silently with usage, unlike a fixed on-premise budget; unmonitored or misconfigured resources can turn into a large, unexpected bill" lesson={lesson} beat={beat} total={4}>
      <div className="flex gap-4">
        <Rail items={items} beat={beat} width={404} size={16} />
        <Stage w={690} h={360} active={false} pad={14}>
          <div className="flex gap-4">
            <div className="flex flex-col gap-2" style={{ width: 210 }}>
              <span className="font-heading text-[14px] font-semibold" style={{ color: colors.ink }}>resources</span>
              <div className="flex items-center gap-2 rounded-xl bg-white px-2 py-2" style={{ boxShadow: `inset 0 0 0 ${stopped ? 1 : 2}px ${stopped ? colors.line : colors.warning}` }}>
                <ServerUnit w={60} state={stopped ? 'off' : 'run'} />
                <span className="text-[14px] font-medium" style={{ color: colors.ink }}>{stopped ? 'stopped' : 'forgotten, running'}</span>
              </div>
              <Fade on={beat >= 2}>
                <div className="flex items-center gap-1 rounded-xl bg-white px-2 py-2" style={{ boxShadow: `inset 0 0 0 1px ${colors.line}` }}>
                  {Array.from({ length: 5 }, (_, k) => <ServerUnit key={k} w={30} />)}
                </div>
              </Fade>
              <Fade on={beat >= 3}>
                <div className="flex flex-wrap gap-1">
                  <Label size={12} tone="warn">data transfer</Label>
                  <Label size={12} tone="warn">API calls</Label>
                </div>
              </Fade>
              <Fade on={beat >= 4}>
                <Control on={stopped} onClick={() => setStopped(!stopped)} size={12}>{stopped ? 'Start it again' : 'Stop the forgotten one'}</Control>
              </Fade>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="flex items-center gap-1.5 text-[14px] font-semibold" style={{ color: colors.ink }}><span className="block h-[3px] w-[16px] rounded-full" style={{ background: colors.danger }} />Monthly bill</span>
              <svg width={W} height={H} aria-hidden>
                <rect width={W} height={H} rx={12} fill={colors.white} />
                <path d={d + ` L ${W - 12} ${H - 10} L 12 ${H - 10} Z`} fill={colors.danger} opacity={0.08} />
                <path d={d} fill="none" stroke={colors.danger} strokeWidth={3} pathLength={1} strokeDasharray="1" style={{ strokeDashoffset: 1 - Math.min(1, beat / 3), transition: 'stroke-dashoffset 1000ms, d 600ms' }} />
                <line x1={pts[5][0] + 20} x2={pts[5][0] + 20} y1={10} y2={H - 10} stroke={colors.danger} strokeWidth={1.5} strokeDasharray="4 4" opacity={beat >= 3 ? 0.8 : 0} />
              </svg>
              <div className="flex items-center gap-2">
                <Fade on={beat >= 4}><Bell w={22} ringing={!stopped && !STILL} /></Fade>
                <Fade on={beat >= 3}><Label tone="bad" size={13}>An unmonitored resource kept billing</Label></Fade>
              </div>
              <Fade on={beat >= 4}>
                <div className="flex items-center gap-2">
                  <img src="/assets/tech/aws.png" alt="" className="h-[14px] w-auto" draggable={false} />
                  <Label tone="brand" size={12}>Budgets alert: abnormal spend</Label>
                </div>
              </Fade>
            </div>
          </div>
          <div style={{ display: 'none' }}>{ease}</div>
        </Stage>
      </div>
    </Card>
  )
}

/* ================================================================== 46 · Distance And Law Limits */

export function RegionMap({ lesson }: { lesson: string }) {
  const beat = useBeats(3)
  const [pick, setPick] = useBeatState<'near' | 'far'>(beat, (b) => (b >= 2 ? 'near' : 'far'))
  const [n, setN] = useState(0)
  const ease = useEase()
  const user = { x: 120, y: 190 }
  const near = { x: 300, y: 120 }
  const far = { x: 600, y: 230 }
  const items = [
    { text: 'Mitigation: nearest Region or a CDN edge location', at: 1 },
    { text: 'Data residency: laws such as GDPR require in-country storage', at: 2 },
    { text: 'AWS Region selection at creation enforces residency choice', at: 3 },
  ]
  const target = pick === 'near' ? near : far
  return (
    <Card id="latency-residency" kicker="Latency And Residency" title="Distance And Law Limits" lead="Physical distance to the nearest AWS Region adds network delay, and certain data must legally remain within national borders regardless of which Region is closest" lesson={lesson} beat={beat} total={3}>
      <div className="flex gap-4">
        <Rail items={items} beat={beat} width={404} size={16} />
        <Stage w={690} h={360} active={false}>
          <At x={16} y={16}><MapGround w={658} h={290} /></At>
          {/* the data residency zone: the user and the near Region inside one border */}
          <svg aria-hidden className="pointer-events-none absolute" style={{ left: 48, top: 48 }} width={344} height={234}>
            <rect x={1.5} y={1.5} width={341} height={231} rx={28} fill="none" stroke={beat >= 2 ? colors.success : colors.line} strokeWidth={3} strokeDasharray="8 7" style={{ transition: ease }} />
          </svg>
          <At x={60} y={58}><Fade on={beat >= 2}><Label tone="good" size={12} strong>Data residency zone</Label></Fade></At>
          <At x={user.x} y={user.y} cx cy>
            <div className="flex flex-col items-center">
              <Idling cfg={MEERA} scale={0.28} crop={BUST} seed={130} />
              <Label size={12} strong>User</Label>
            </div>
          </At>
          <At x={near.x} y={near.y} cx cy>
            <div className="flex flex-col items-center gap-1"><Pin w={28} tone={pick === 'near' ? colors.success : colors.brand} /><Label size={12} strong tone={pick === 'near' ? 'good' : 'plain'}>Nearest Region</Label></div>
          </At>
          <At x={far.x} y={far.y} cx cy>
            <div className="flex flex-col items-center gap-1"><Pin w={28} tone={pick === 'far' ? colors.warning : colors.brand} /><Label size={12} strong tone={pick === 'far' ? 'warn' : 'plain'}>Distant Region</Label></div>
          </At>
          <Arrow x1={user.x + 30} y1={user.y - 28} x2={near.x - 20} y2={near.y - 10} on tone={colors.success} />
          <At x={160} y={96}><Label tone="good" size={12}>less delay</Label></At>
          <Arrow x1={user.x + 34} y1={user.y + 20} x2={far.x - 22} y2={far.y - 6} on tone={colors.warning} dashed />
          <At x={420} y={246}><Label tone="warn" size={12}>more delay</Label></At>
          <Traveller k={`${pick}-${n}`} run={!STILL && n > 0} path={[[user.x, user.y], [target.x, target.y]]} dur={pick === 'near' ? 0.5 : 1.8} tone={pick === 'near' ? colors.success : colors.warning} />
          <At x={24} y={318} w={640}>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold" style={{ color: colors.ink }}>Send a request to</span>
              <Control on={pick === 'near'} onClick={() => { setPick('near'); setN(n + 1) }} size={12}>Nearest Region</Control>
              <Control on={pick === 'far'} onClick={() => { setPick('far'); setN(n + 1) }} size={12}>Distant Region</Control>
              <Fade on={beat >= 3}><div className="flex items-center gap-1.5"><img src="/assets/tech/aws.png" alt="" className="h-[14px] w-auto" draggable={false} /><Label tone="brand" size={12}>Region chosen at creation</Label></div></Fade>
            </div>
          </At>
        </Stage>
      </div>
    </Card>
  )
}

/* ================================================================== 47 · Weighing Trade-Offs Together (reference 54 + 55) */

const RISKS: [string, string][] = [
  ['Cost model shift (OpEx)', 'Cost overruns without governance'],
  ['Elasticity & speed to market', 'Vendor lock-in via managed services'],
  ['Global reach', 'Latency & data residency limits'],
]

export function PairScales({ lesson }: { lesson: string }) {
  const beat = useBeats(4)
  const [tilts, setTilts] = useBeatState<number[]>(beat, () => [0, 0, 0])
  const ease = useEase()
  return (
    <Card id="benefit-risk" kicker="Benefit Risk Pairing" title="Weighing Trade-Offs Together" lead="Each cloud benefit carries a paired risk; weighing both together, not benefits alone, is what a sound migration decision requires" lesson={lesson} beat={beat} total={4}>
      <div className="flex gap-[18px]">
        {RISKS.map(([b, r], i) => (
          <Stage key={b} w={358} h={206} active={beat === i + 1} pad={10}>
            <div className="flex flex-col items-center" style={{ opacity: beat >= i + 1 ? 1 : 0, transition: ease }}>
              <Balance w={230} tilt={tilts[i]} />
              <div className="mt-1 grid w-full grid-cols-2 gap-2">
                <button type="button" onClick={(e) => { setTilts(tilts.map((t, k) => (k === i ? (t === -8 ? 0 : -8) : t))); e.currentTarget.blur() }} className="rounded-xl px-2 py-1.5 text-center text-[14px] font-semibold leading-snug" style={{ background: colors.surface2, boxShadow: `inset 0 0 0 1.5px ${colors.brand}`, color: colors.ink }}>{b}</button>
                <button type="button" onClick={(e) => { setTilts(tilts.map((t, k) => (k === i ? (t === 8 ? 0 : 8) : t))); e.currentTarget.blur() }} className="rounded-xl px-2 py-1.5 text-center text-[14px] font-semibold leading-snug" style={{ background: '#FDECEC', boxShadow: `inset 0 0 0 1.5px ${colors.danger}`, color: colors.ink }}>{r}</button>
              </div>
            </div>
          </Stage>
        ))}
      </div>
      <Fade on={beat >= 4} className="mt-3">
        <div className="overflow-hidden rounded-xl bg-white" style={{ width: BOX_W, boxShadow: `inset 0 0 0 1px ${colors.line}` }}>
          <div className="grid grid-cols-2">
            <span className="px-4 py-2 font-heading text-[14px] font-semibold" style={{ background: colors.surface2, color: colors.brandDark }}>Benefit Driving Adoption</span>
            <span className="px-4 py-2 font-heading text-[14px] font-semibold" style={{ background: colors.surface2, color: colors.brandDark }}>Matching Risk To Manage</span>
            {RISKS.map(([b, r]) => [
              <span key={`b${b}`} className="px-4 py-[6px] text-[14px] font-semibold" style={{ color: colors.ink, borderTop: `1px solid ${colors.line}` }}>{b}</span>,
              <span key={`r${b}`} className="px-4 py-[6px] text-[14px] font-medium" style={{ color: colors.ink, borderTop: `1px solid ${colors.line}` }}>{r}</span>,
            ])}
          </div>
        </div>
      </Fade>
    </Card>
  )
}

