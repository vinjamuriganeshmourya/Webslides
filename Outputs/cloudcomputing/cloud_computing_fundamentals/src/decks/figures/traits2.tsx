import { useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { Card, Stage, Fade, Label, Note, Rail, Slider, Control, LeadLines, useBeatState, STILL, BOX_W } from './scene'
import { Bell, Bill, MeterDial, ServerUnit, useEase } from './art'

/**
 * SECTION 4, ESSENTIAL CHARACTERISTICS - II (Merrill): elasticity,
 * scalability and metering, each shown moving with demand. Every string is
 * the reference's; the step lines are whole numbers on purpose (the reference's
 * note: "a server either exists or does not").
 */

/* ================================================================== 31 · Elasticity Scalability Metering */

export function ControlBoard({ lesson }: { lesson: string }) {
  const beat = useBeats(4)
  const [demand, setDemand] = useBeatState<number>(beat, (b) => (b >= 4 ? 0.7 : 0.35))
  const [vertical, setVertical] = useState(false)
  const n = 1 + Math.round(demand * 5)
  const ease = useEase()
  const cards = [
    { title: 'Rapid elasticity', body: 'automatic scale-out and scale-in with demand', at: 1 },
    { title: 'Scalability', body: 'capacity to grow, vertically or horizontally', at: 2 },
    { title: 'Measured service', body: 'usage tracked and billed per resource consumed', at: 3 },
  ]
  return (
    <Card
      id="three-overview"
      kicker="Three Characteristics Overview"
      title="Elasticity Scalability Metering"
      lead={<LeadLines lines={['Cloud platforms must absorb changing demand and charge only for what gets used', 'Three characteristics make that possible: rapid elasticity, scalability, and measured service']} />}
      lesson={lesson}
      beat={beat}
      total={4}
    >
      <div className="flex gap-[18px]">
        {cards.map((c, i) => (
          <Stage key={c.title} w={358} h={252} active={beat === c.at} pad={14}>
            <Fade on={beat >= c.at}>
              <span className="block font-heading text-[18px] font-semibold" style={{ color: colors.ink }}>{c.title}</span>
              <Note size={14} className="mt-1">{c.body}</Note>
            </Fade>
            <div className="absolute inset-x-3 bottom-3 top-[88px] grid place-items-center rounded-xl" style={{ background: colors.surface, opacity: beat >= c.at ? 1 : 0, transition: ease }}>
              {i === 0 && (
                <div className="grid grid-cols-3 gap-1.5">
                  {Array.from({ length: 6 }, (_, k) => (
                    <div key={k} style={{ opacity: k < n ? 1 : 0.12, transition: ease }}>
                      <ServerUnit w={70} />
                    </div>
                  ))}
                </div>
              )}
              {i === 1 && (
                <div className="flex flex-col items-center gap-2">
                  {vertical ? (
                    <div className="grid place-items-center rounded-lg" style={{ width: 60 + n * 22, height: 30 + n * 12, background: colors.brandDeep, transition: ease }}>
                      <span className="text-[14px] font-semibold text-white">{`size ${n}`}</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap justify-center gap-1.5" style={{ width: 240 }}>
                      {Array.from({ length: n }, (_, k) => (
                        <ServerUnit key={k} w={64} />
                      ))}
                    </div>
                  )}
                  <div className="flex gap-1.5">
                    <Control on={vertical} onClick={() => setVertical(true)} size={12}>vertically</Control>
                    <Control on={!vertical} onClick={() => setVertical(false)} size={12}>horizontally</Control>
                  </div>
                </div>
              )}
              {i === 2 && (
                <div className="flex items-center gap-4">
                  <MeterDial w={92} value={n / 6} spin={!STILL} />
                  <Bill w={58} rows={Math.min(n, 5)} />
                </div>
              )}
            </div>
          </Stage>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4" style={{ width: BOX_W }}>
        <Slider value={demand} onChange={setDemand} label="Demand" width={420} />
        <span className="text-[14px] font-medium" style={{ color: colors.ink }}>{`${n} of 6 servers in use`}</span>
      </div>
    </Card>
  )
}

/* ================================================================== 32 · Auto-Scaling Mechanism */

const DEMAND = [0.16, 0.18, 0.55, 0.92, 0.88, 0.45, 0.2, 0.18]
const COUNT = [0.14, 0.14, 0.3, 0.78, 0.78, 0.3, 0.16, 0.16]
const ALARM = 0.5

/** A smooth line through the points, the demand curve. */
function smooth(pts: [number, number][]) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    const mx = (x0 + x1) / 2
    d += ` C ${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`
  }
  return d
}

/** A step line, the instance count: a server either exists or does not. */
function steps(pts: [number, number][]) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) d += ` H ${pts[i][0]} V ${pts[i][1]}`
  return d
}

function sample(arr: number[], t: number) {
  const x = t * (arr.length - 1)
  const i = Math.min(arr.length - 2, Math.floor(x))
  const f = x - i
  return arr[i] * (1 - f) + arr[i + 1] * f
}

export function ElasticChart({ lesson }: { lesson: string }) {
  const beat = useBeats(5)
  const [t, setT] = useBeatState(beat, (b) => [0.1, 0.42, 0.42, 0.86, 0.6][b - 1])
  const ease = useEase(900)
  const W = 640
  const H = 210
  const X = (i: number, n: number) => 20 + (i / (n - 1)) * (W - 40)
  const Y = (v: number) => H - 14 - v * (H - 30)
  const dPts = DEMAND.map((v, i) => [X(i, DEMAND.length), Y(v)] as [number, number])
  const cPts = COUNT.map((v, i) => [X(i, COUNT.length), Y(v)] as [number, number])
  const demandNow = sample(DEMAND, t)
  const countNow = COUNT[Math.min(COUNT.length - 1, Math.round(t * (COUNT.length - 1)))]
  const servers = Math.max(1, Math.round(countNow * 10))
  const over = demandNow > ALARM
  const reveal = [0.0, 0.5, 0.5, 1, 1][beat - 1]
  const items = [
    { text: 'Triggered by real-time metrics, such as CloudWatch alarms', at: 2 },
    { text: 'Auto Scaling Groups add or remove instances within minutes', at: 3 },
    { text: 'Scales in both directions: out under load, in after', at: 4 },
    { text: 'Cost: extra capacity billed only while it actually runs', at: 5 },
  ]
  return (
    <Card id="elasticity" kicker="Rapid Elasticity" title="Auto-Scaling Mechanism" lead="Rapid elasticity is the cloud's ability to provision and release resources - in most cases automatically, almost instantly, as demand rises or falls" lesson={lesson} beat={beat} total={5}>
      <div className="flex gap-4">
        <Rail items={items} beat={beat} width={404} size={16} />
        <Stage w={690} h={360} active={false} pad={14}>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[14px] font-semibold" style={{ color: colors.ink }}><span className="block h-[3px] w-[18px] rounded-full" style={{ background: colors.brand }} />Demand</span>
            <span className="flex items-center gap-1.5 text-[14px] font-semibold" style={{ color: colors.ink }}><span className="block h-[3px] w-[18px] rounded-full" style={{ background: colors.teal }} />Instance count</span>
          </div>
          <div className="relative mt-1" style={{ width: W, height: H }}>
            <svg width={W} height={H} aria-hidden className="absolute inset-0">
              <rect x={0} y={0} width={W} height={H} rx={12} fill={colors.white} />
              <line x1={20} x2={W - 20} y1={Y(ALARM)} y2={Y(ALARM)} stroke={colors.danger} strokeWidth={2} strokeDasharray="6 6" style={{ opacity: beat >= 2 ? 1 : 0, transition: ease }} />
              <path d={smooth(dPts) + ` L ${W - 20} ${H - 14} L 20 ${H - 14} Z`} fill={colors.brand} opacity={0.08} />
              <path d={smooth(dPts)} fill="none" stroke={colors.brand} strokeWidth={3} />
              <path d={steps(cPts)} fill="none" stroke={colors.teal} strokeWidth={3.5} pathLength={1} strokeDasharray="1" style={{ strokeDashoffset: 1 - reveal, transition: ease }} />
              <line x1={20 + t * (W - 40)} x2={20 + t * (W - 40)} y1={8} y2={H - 8} stroke={colors.ink} strokeWidth={1.5} strokeDasharray="3 4" />
              <circle cx={20 + t * (W - 40)} cy={Y(demandNow)} r={6} fill={over ? colors.danger : colors.brand} />
            </svg>
            <div className="absolute" style={{ left: 30, top: Y(ALARM) - 28 }}>
              <Fade on={beat >= 2}><Label tone="bad" size={12}>CloudWatch alarm</Label></Fade>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Slider value={t} onChange={setT} label="Time" width={250} />
            <div className="flex items-center gap-1.5">
              <Bell w={20} ringing={over && !STILL} />
              <div className="flex gap-1">
                {Array.from({ length: 8 }, (_, k) => (
                  <div key={k} style={{ opacity: k < servers ? 1 : 0.12, transition: 'opacity 420ms' }}>
                    <ServerUnit w={34} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <Fade on={beat >= 3}><Label tone="brand" size={13}>CloudWatch alarm triggers the Auto Scaling Group</Label></Fade>
            <Fade on={beat >= 5}><Label tone={servers > 2 ? 'warn' : 'good'} size={13}>{`billing ${servers} instance${servers === 1 ? '' : 's'} now`}</Label></Fade>
          </div>
        </Stage>
      </div>
    </Card>
  )
}

/* ================================================================== 34 · Traffic Spike Traced (reference 38 + 39) */

const ELASTIC = [0.15, 0.15, 0.4, 0.85, 0.85, 0.4, 0.15, 0.15]
const SCALE = [0.25, 0.25, 0.25, 0.8, 0.8, 0.8, 0.8, 0.8]
const LANE_ROWS: [string, string, string][] = [
  ['Trigger', 'Real-time demand (CloudWatch alarm)', 'Planned capacity growth'],
  ['Timescale', 'Minutes, fully automatic', 'Hours to days, manual or automated'],
  ['Direction', 'Scales out and back in', 'Mostly one-directional growth'],
  ['Worked case', '2→10 instances in ~3 min, back to 2', 'm5.large resized to m5.4xlarge in advance'],
]

function Lane({ title, series, values, on, tone }: { title: string; series: string; values: number[]; on: boolean; tone: string }) {
  const ease = useEase(1100)
  const W = 520
  const H = 104
  const pts = values.map((v, i) => [10 + (i / (values.length - 1)) * (W - 20), H - 8 - v * (H - 20)] as [number, number])
  return (
    <Stage w={540} h={146} active={on} pad={8}>
      <div className="flex items-center gap-3 px-1">
        <span className="font-heading text-[15px] font-semibold" style={{ color: colors.ink }}>{title}</span>
        <span className="flex items-center gap-1.5 text-[14px] font-medium" style={{ color: colors.ink }}><span className="block h-[3px] w-[16px] rounded-full" style={{ background: tone }} />{series}</span>
      </div>
      <svg width={W} height={H} className="mt-1" aria-hidden>
        <rect width={W} height={H} rx={10} fill={colors.white} />
        <path d={steps(pts) + ` V ${H - 8} H 10 Z`} fill={tone} opacity={on ? 0.1 : 0} style={{ transition: ease }} />
        <path d={steps(pts)} fill="none" stroke={tone} strokeWidth={3} pathLength={1} strokeDasharray="1" style={{ strokeDashoffset: on ? 0 : 1, transition: ease }} />
      </svg>
    </Stage>
  )
}

export function TwoLanes({ lesson }: { lesson: string }) {
  const beat = useBeats(6)
  const ease = useEase()
  return (
    <Card id="elasticity-scalability" kicker="Elasticity Vs Scalability" title="Traffic Spike Traced" lead="During a demand surge, elasticity reacts automatically to the moment; scalability asks whether the underlying architecture can absorb growth at all" lesson={lesson} beat={beat} total={6}>
      <div className="flex gap-[30px]">
        <Lane title="Elasticity" series="Instance count" values={ELASTIC} on={beat >= 1} tone={colors.brand} />
        <Lane title="Scalability" series="Instance size" values={SCALE} on={beat >= 2} tone={colors.teal} />
      </div>
      <div className="mt-3 overflow-hidden rounded-xl bg-white" style={{ width: BOX_W, boxShadow: `inset 0 0 0 1px ${colors.line}` }}>
        <div className="grid" style={{ gridTemplateColumns: '170px 1fr 1fr' }}>
          {['Aspect', 'Elasticity', 'Scalability'].map((h) => (
            <span key={h} className="px-4 py-2 font-heading text-[14px] font-semibold" style={{ background: colors.surface2, color: colors.brandDark }}>{h}</span>
          ))}
          {LANE_ROWS.map((r, i) =>
            r.map((c, k) => (
              <span key={`${i}${k}`} className={`px-4 py-[7px] text-[14px] ${k === 0 ? 'font-heading font-semibold' : 'font-medium'}`} style={{ color: colors.ink, borderTop: `1px solid ${colors.line}`, background: beat === i + 3 ? 'rgba(45,99,251,0.09)' : 'transparent', opacity: beat >= i + 3 ? 1 : 0, transition: ease }}>
                {c}
              </span>
            )),
          )}
        </div>
      </div>
    </Card>
  )
}

/* ================================================================== 35 · Pay-Per-Use Metering */

const METRICS = ['compute-seconds', 'storage-GB', 'data transfer', 'API calls']

export function MeterBank({ lesson }: { lesson: string }) {
  const beat = useBeats(5)
  const [on, setOn] = useBeatState<boolean[]>(beat, (b) => (b >= 5 ? [false, false, false, false] : [true, true, true, true]))
  const live = on.filter(Boolean).length
  const ease = useEase()
  const items = [
    { text: 'Metrics tracked: compute-seconds, storage-GB, data transfer, API calls', at: 2 },
    { text: 'CloudWatch collects usage; Billing and Cost Explorer compute charges', at: 3 },
    { text: 'Granular units: EC2 per-second, S3 per-GB-month, Lambda per-request', at: 4 },
    { text: 'No usage recorded means no charge: true pay-per-use pricing', at: 5 },
  ]
  return (
    <Card id="measured-service" kicker="Measured Service" title="Pay-Per-Use Metering" lead="Measured service means cloud providers automatically monitor, meter and report resource usage, so bills map directly to actual consumption" lesson={lesson} beat={beat} total={5}>
      <div className="flex gap-4">
        <Rail items={items} beat={beat} width={404} size={16} />
        <Stage w={690} h={360} active={false} pad={14}>
          <div className="grid grid-cols-4 gap-2.5">
            {METRICS.map((m, i) => (
              <div key={m} className="flex flex-col items-center gap-1 rounded-xl bg-white py-2" style={{ boxShadow: `inset 0 0 0 ${on[i] ? 2 : 1}px ${on[i] ? colors.brand : colors.line}`, opacity: beat >= 2 ? 1 : 0.35, transition: ease }}>
                <MeterDial w={62} value={on[i] ? 0.25 + i * 0.17 : 0} spin={on[i] && !STILL} />
                <span className="text-[14px] font-semibold" style={{ color: colors.ink }}>{m}</span>
                <Control on={on[i]} onClick={() => setOn(on.map((x, k) => (k === i ? !x : x)))} size={12}>{on[i] ? 'in use' : 'off'}</Control>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Fade on={beat >= 3}>
              <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
                <span className="font-heading text-[14px] font-semibold" style={{ color: colors.brandDark }}>CloudWatch</span>
              </div>
            </Fade>
            <Fade on={beat >= 3}><span className="block h-[3px] w-[40px] rounded-full" style={{ background: colors.brand }} /></Fade>
            <Fade on={beat >= 3}>
              <div className="rounded-xl bg-white px-3 py-2" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.brand}`, width: 330 }}>
                <span className="block font-heading text-[14px] font-semibold" style={{ color: colors.brandDark }}>Billing and Cost Explorer</span>
                {METRICS.map((m, i) => (
                  <div key={m} className="mt-1 flex items-center justify-between text-[14px]" style={{ color: colors.ink }}>
                    <span>{m}</span>
                    <span className="font-mono" style={{ color: on[i] ? colors.success : colors.muted }}>{on[i] ? 'metered' : '0'}</span>
                  </div>
                ))}
              </div>
            </Fade>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Fade on={beat >= 4}>
              <div className="flex gap-1.5">
                <Label tone="brand" size={12} mono>EC2 per-second</Label>
                <Label tone="brand" size={12} mono>S3 per-GB-month</Label>
                <Label tone="brand" size={12} mono>Lambda per-request</Label>
              </div>
            </Fade>
            <Fade on={beat >= 5}><Label tone={live === 0 ? 'good' : 'plain'} size={13} strong>{live === 0 ? 'no usage, no charge' : `${live} metered`}</Label></Fade>
          </div>
        </Stage>
      </div>
    </Card>
  )
}
