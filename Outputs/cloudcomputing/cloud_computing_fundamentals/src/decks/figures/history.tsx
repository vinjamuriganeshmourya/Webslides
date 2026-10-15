import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { Card, Stage, At, Fade, Label, Note, Arrow, Rail, useTicker, STILL, BOX_W } from './scene'
import { Idling, BUST, FACE } from './Cast'
import { OPERATOR, TENANTS } from './people'
import { VmStack } from './analogy'
import { ClockFace, CloudShape, Desktop, Mainframe, MeterDial, Padlock, ProviderBuilding, Rack, Storefront, Terminal, useEase } from './art'

/**
 * SECTION 2, HISTORY & EVOLUTION (STAR): four eras, each solving the
 * resource-sharing problem of its own time, then the table of what cloud
 * inherited. Every string is the reference's.
 */

/* ================================================================== 13 · Four eras */

const ERAS = [
  { period: '1960s-70s', label: 'mainframes & time-sharing' },
  { period: '1980s-2000s', label: 'client-server & x86 virtualization' },
  { period: '1990s-2000s', label: 'grid & utility computing' },
  { period: '2006 onward', label: 'the public cloud era' },
]

function EraPicture({ i }: { i: number }): ReactNode {
  if (i === 0)
    return (
      <div className="flex items-end gap-1">
        <Idling cfg={OPERATOR} scale={0.3} crop={BUST} seed={3} />
        <Mainframe w={120} busy />
      </div>
    )
  if (i === 1)
    return (
      <div className="flex items-end gap-3">
        <Desktop w={84} lit />
        <Rack w={46} units={['run', 'run', 'run']} />
      </div>
    )
  if (i === 2)
    return (
      <div className="relative" style={{ width: 200, height: 100 }}>
        {[0, 1, 2].map((k) => (
          <div key={k} className="absolute" style={{ left: k * 70, top: k === 1 ? 0 : 40 }}>
            <Desktop w={58} lit />
          </div>
        ))}
      </div>
    )
  return (
    <div className="flex items-end gap-2">
      <ProviderBuilding w={150} lit={10} />
    </div>
  )
}

export function EraWalk({ lesson }: { lesson: string }) {
  const beat = useBeats(4)
  const ease = useEase()
  return (
    <Card id="four-eras" kicker="Four Eras Of Computing" title="From Mainframes To Cloud" lead="Cloud computing did not appear overnight; it inherited ideas from four earlier eras, each solving the resource-sharing problem of its own time" lesson={lesson} beat={beat} total={4}>
      <div className="flex gap-[16px]">
        {ERAS.map((e, i) => {
          const now = beat === i + 1
          const seen = beat >= i + 1
          return (
            <Stage key={e.period} w={265} h={236} active={now}>
              <div className="absolute inset-x-0 top-0 grid h-[160px] place-items-center" style={{ opacity: seen ? 1 : 0.28, filter: seen ? 'none' : 'grayscale(1)', transition: ease }}>
                <EraPicture i={i} />
              </div>
              <div className="absolute inset-x-0 bottom-[14px] flex flex-col items-center gap-1.5">
                <Label tone={seen ? 'brand' : 'muted'} strong size={14}>{e.period}</Label>
                <span className="text-[14px] font-medium" style={{ color: colors.ink }}>{e.label}</span>
              </div>
            </Stage>
          )
        })}
      </div>
      <div className="relative mt-3" style={{ width: BOX_W, height: 40 }}>
        <div className="absolute left-[40px] right-[40px] top-[18px] h-[4px] rounded-full" style={{ background: colors.line }} />
        <div className="absolute left-[40px] top-[18px] h-[4px] rounded-full" style={{ background: colors.brand, width: `${((beat - 1) / 3) * (BOX_W - 80)}px`, transition: ease }} />
        {ERAS.map((e, i) => (
          <span key={e.period} className="absolute top-[11px] h-[18px] w-[18px] rounded-full" style={{ left: 132 + i * 281 - 9, background: beat >= i + 1 ? colors.brand : colors.white, boxShadow: `inset 0 0 0 3px ${colors.brand}`, transition: ease }} />
        ))}
      </div>
    </Card>
  )
}

/* ================================================================== 14 · One Machine Many Users (reference 14 + 15) */

export function MainframeScene({ lesson }: { lesson: string }) {
  const beat = useBeats(5)
  const tick = useTicker(beat >= 3, 1200, 1)
  const turn = tick % 4
  const ease = useEase()
  const instant = useInstant()
  const items = [
    { text: 'Mainframes: centralised, costly machines run by dedicated operators', at: 1 },
    { text: 'Batch processing: jobs queued and run without interaction', at: 2 },
    { text: 'Time-sharing (1960s): CPU scheduled across simultaneous terminal users', at: 3 },
    { text: 'Each user experienced an illusion of a private computer', at: 4 },
    { text: "IBM's CP-40/CP-67 (1960s) pioneered mainframe virtualization: the earliest form of the concept", at: 5 },
  ]
  const TX = [60, 220, 380, 540]
  return (
    <Card id="mainframes" kicker="Mainframes & Time-Sharing" title="One Machine Many Users" lead="Early mainframes were too costly for one user alone, so time-sharing let many users access the same machine at once" lesson={lesson} beat={beat} total={5}>
      <div className="flex gap-4">
        <Rail items={items} beat={beat} width={404} size={16} gap={8} />
        <Stage w={690} h={392} active={false}>
          <At x={20} y={20}><Idling cfg={OPERATOR} scale={0.42} seed={12} /></At>
          <At x={20} y={180}><Label size={12} tone="muted">operator</Label></At>
          <At x={220} y={18}>
            <div className="relative">
              <Mainframe w={200} busy={beat >= 2} />
              <Fade on={beat >= 5} style={{ position: 'absolute', inset: '24px 18px 18px 18px' }}>
                <div className="grid h-full grid-cols-3 gap-1.5">
                  {[0, 1, 2].map((k) => (
                    <div key={k} className="grid place-items-center rounded-md text-[14px] font-semibold text-white" style={{ background: colors.brand }}>VM</div>
                  ))}
                </div>
              </Fade>
            </div>
          </At>
          <At x={432} y={26} w={240}>
            <div className="flex flex-col items-start gap-1.5">
              <Label strong tone="dark" size={14}>Mainframe</Label>
              <Fade on={beat >= 3}><Note size={13}>CPU scheduled across simultaneous terminal users</Note></Fade>
              <Fade on={beat >= 5}><Label tone="brand" size={13}>CP-40/CP-67</Label></Fade>
            </div>
          </At>
          {/* the batch tray: jobs queued, run one after another without interaction */}
          <At x={432} y={118} w={240}>
            <Fade on={beat === 2}>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((k) => (
                    <motion.span key={k} className="block h-[34px] w-[26px] rounded-md" style={{ background: colors.white, boxShadow: `inset 0 0 0 2px ${colors.warning}` }} initial={false} animate={{ x: instant ? 0 : beat === 2 ? [0, -8, 0] : 0 }} transition={{ duration: 0.8, delay: k * 0.2 }} />
                  ))}
                </div>
                <Label tone="warn" size={12}>jobs queued</Label>
              </div>
            </Fade>
          </At>
          <At x={548} y={150}>
            <Fade on={beat >= 3}><ClockFace w={56} turn={turn / 4} /></Fade>
          </At>
          <At x={548} y={210}><Fade on={beat >= 3}><Label size={12} tone="brand">scheduled turns</Label></Fade></At>
          {TX.map((x, i) => (
            <Arrow key={i} x1={x + 44} y1={262} x2={320} y2={184} on={beat >= 3} tone={beat >= 3 && i === turn ? colors.brand : colors.line} />
          ))}
          {TX.map((x, i) => {
            const lit = beat >= 3 && i === turn
            return (
              <At key={i} x={x} y={266} w={88}>
                <div className="flex flex-col items-center gap-1" style={{ opacity: beat >= 3 ? 1 : 0.25, transition: ease }}>
                  <Terminal w={70} lit={lit || beat >= 4} />
                  <Label size={12} tone={lit ? 'brand' : 'plain'}>Terminal</Label>
                </div>
              </At>
            )
          })}
          {TX.map((x, i) => (
            <At key={`b${i}`} x={x + 44} y={360} cx>
              <Fade on={beat >= 4} delay={i * 120}>
                <Label size={12} tone="good">my computer</Label>
              </Fade>
            </At>
          ))}
        </Stage>
      </div>
    </Card>
  )
}

/* ================================================================== 16 · Hardware Gets Abstracted (reference 17 + 18) */

export function HypervisorScene({ lesson }: { lesson: string }) {
  const beat = useBeats(4)
  const ease = useEase()
  const tick = useTicker(beat === 1, 1300, 1)
  const items = [
    { text: '1980s-90s: client-server split desktop and network-server roles', at: 1 },
    { text: 'Commodity x86 virtualization (late 1990s onward, e.g. VMware): a hypervisor partitions one server', at: 2 },
    { text: 'Each virtual machine runs its own OS, isolated from others', at: 3 },
    { text: 'Decouples software from physical hardware, enabling resource pooling', at: 4 },
  ]
  return (
    <Card id="virtualization" kicker="Client-Server & Virtualization" title="Hardware Gets Abstracted" lead="Personal computers and networks split work into client requests and dedicated servers; virtualization then lets one physical server run several independent virtual machines" lesson={lesson} beat={beat} total={4}>
      <div className="flex gap-4">
        <Rail items={items} beat={beat} width={404} size={16} />
        <Stage w={690} h={360} active={false}>
          {/* clients on the left */}
          <At x={20} y={20} w={200}>
            <div className="flex flex-col items-center gap-2">
              {[0, 1].map((k) => (
                <div key={k} className="flex items-center gap-2">
                  <Idling cfg={TENANTS[k]} scale={0.28} crop={FACE} seed={80 + k} />
                  <Desktop w={84} lit={beat === 1 && tick % 2 === k} />
                </div>
              ))}
              <Label size={12}>client: the desktop</Label>
            </div>
          </At>
          <Arrow x1={222} y1={124} x2={294} y2={124} on both />
          <At x={222} y={86}><Label size={11} tone="muted">requests</Label></At>
          {/* the server: one box, then the hypervisor and its VMs */}
          <At x={300} y={20} w={380}>
            <div style={{ opacity: beat === 1 ? 1 : 0, transition: ease, position: 'absolute', inset: 0 }}>
              <div className="flex flex-col items-center gap-2 pt-6">
                <Rack w={110} units={['run', 'run', 'run', 'run']} />
                <Label size={12}>network server</Label>
              </div>
            </div>
          </At>
          <div className="absolute" style={{ left: 300, top: 0, width: 380, height: 340, opacity: beat >= 2 ? 1 : 0, transition: ease }}>
            <VmStack top={34} cx={190} vms={beat >= 2 ? 3 : 0} osTag={beat >= 3} />
          </div>
          <At x={300} y={290} w={380}>
            <Fade on={beat >= 3}>
              <div className="flex items-center justify-center gap-2">
                <Padlock w={16} />
                <span className="text-[14px] font-medium" style={{ color: colors.ink }}>isolated from others</span>
              </div>
            </Fade>
          </At>
          <At x={300} y={318} w={380}>
            <Fade on={beat >= 4}>
              <div className="flex items-center justify-center gap-2">
                <Label tone="brand" size={13}>software</Label>
                <span className="text-[14px]" style={{ color: colors.ink }}>no longer tied to one machine</span>
              </div>
            </Fade>
          </At>
        </Stage>
      </div>
    </Card>
  )
}

/* ================================================================== 18 · Pooling And Metering Power (reference 20 + 21) */

export function GridScene({ lesson }: { lesson: string }) {
  const beat = useBeats(4)
  const run = beat >= 2
  const tick = useTicker(run, 800, 3)
  const ease = useEase()
  const instant = useInstant()
  const items = [
    { text: 'Grid computing: idle CPUs across institutions combined for shared jobs', at: 1 },
    { text: 'Example: distributed scientific projects pooling volunteer processing power', at: 2 },
    { text: 'Utility computing: pay only for capacity consumed, not owned', at: 3 },
    { text: 'Both separate consumption from ownership of hardware, ahead of cloud', at: 4 },
  ]
  const INST = [
    { x: 30, y: 30 },
    { x: 30, y: 140 },
    { x: 30, y: 250 },
  ]
  const hub = { x: 400, y: 150 }
  return (
    <Card id="grid-utility" kicker="Grid & Utility Computing" title="Pooling And Metering Power" lead="Grid computing pooled processing power across many organisations for one large task, while utility computing proposed billing that powers the way electricity is billed" lesson={lesson} beat={beat} total={4}>
      <div className="flex gap-4">
        <Rail items={items} beat={beat} width={404} size={16} />
        <Stage w={690} h={360} active={false}>
          {INST.map((p, i) => (
            <At key={i} x={p.x} y={p.y}>
              <div className="flex items-center gap-2">
                <Desktop w={70} lit={run && (tick + i) % 2 === 0} />
                <Label size={12}>Institution</Label>
              </div>
            </At>
          ))}
          {INST.map((p, i) => (
            <Arrow key={i} x1={p.x + 168} y1={p.y + 30} x2={hub.x - 84} y2={hub.y + 10 + (i - 1) * 24} on={beat >= 1} />
          ))}
          <At x={hub.x} y={hub.y - 80} cx>
            <div className="flex flex-col items-center gap-1.5">
              <CloudShape w={160} />
              <Label strong tone="brand" size={14}>One grid</Label>
              <Note size={13} className="w-[200px] text-center">Idle CPUs combined for shared jobs</Note>
            </div>
          </At>
          {/* pieces of one job flying out and back */}
          {run &&
            [0, 1, 2].map((i) => (
              <motion.span
                key={`${i}-${beat}`}
                className="absolute h-[14px] w-[14px] rounded-[4px]"
                style={{ background: colors.accent, left: 0, top: 0 }}
                initial={instant || STILL ? { x: INST[i].x + 28, y: INST[i].y + 16 } : { x: hub.x - 7, y: hub.y }}
                animate={instant || STILL ? { x: INST[i].x + 28, y: INST[i].y + 16 } : { x: [hub.x - 7, INST[i].x + 28, hub.x - 7], y: [hub.y, INST[i].y + 16, hub.y] }}
                transition={{ duration: 2.4, delay: i * 0.4, repeat: instant || STILL ? 0 : Infinity, repeatDelay: 0.6, ease: 'easeInOut' }}
              />
            ))}
          <At x={560} y={40} w={120}>
            <Fade on={beat >= 3}>
              <div className="flex flex-col items-center gap-1.5">
                <MeterDial w={86} value={beat >= 3 ? ((tick % 6) + 2) / 8 : 0} spin={!STILL} />
                <Label size={12} tone="good">metered billing</Label>
              </div>
            </Fade>
          </At>
          <At x={548} y={200} w={136}>
            <Fade on={beat >= 4}>
              <div className="flex flex-col gap-2">
                <div className="rounded-xl px-2.5 py-2 text-[14px] font-medium" style={{ background: colors.surface, boxShadow: `inset 0 0 0 1px ${colors.line}`, color: colors.ink }}>
                  owned: stays with each institution
                </div>
                <div className="rounded-xl px-2.5 py-2 text-[14px] font-medium" style={{ background: colors.surface2, boxShadow: `inset 0 0 0 1.5px ${colors.brand}`, color: colors.ink }}>
                  consumed: paid by use
                </div>
              </div>
            </Fade>
          </At>
          <div style={{ display: 'none' }}>{ease}</div>
        </Stage>
      </div>
    </Card>
  )
}

/* ================================================================== 20 · 2006 Onward Milestones */

const MILES = [
  { period: '2006', label: 'Amazon Web Services launches S3 storage, then EC2 compute', logo: '/assets/companies/amazon.png' },
  { period: '2008', label: 'Google App Engine offers a managed application platform', logo: '/assets/companies/google.png' },
  { period: '2010', label: 'Microsoft launches Windows Azure commercially', logo: '/assets/companies/microsoft.png' },
  { period: 'By the 2010s', label: 'public cloud becomes the default for new IT', logo: '' },
]

export function Milestones({ lesson }: { lesson: string }) {
  const beat = useBeats(4)
  const ease = useEase(900)
  return (
    <Card id="public-cloud" kicker="Public Cloud Emerges" title="2006 Onward Milestones" lead="The public cloud era began when providers started selling the pooled, virtualized, metered resources of earlier eras directly over the internet, on demand" lesson={lesson} beat={beat} total={4}>
      <Stage w={BOX_W} h={360} active={false}>
        {MILES.map((m, i) => {
          const open = beat >= i + 1
          return (
            <At key={m.period} x={40 + i * 270} y={18} w={240}>
              <div className="flex flex-col items-center gap-2">
                <Label tone={open ? 'brand' : 'muted'} strong size={15}>{m.period}</Label>
                <Storefront w={130} open={open}>
                  {m.logo ? <img src={m.logo} alt="" className="h-[30px] w-auto" draggable={false} /> : <CloudShape w={56} />}
                </Storefront>
                <span className="text-center text-[14px] font-medium leading-snug" style={{ color: colors.ink, opacity: open ? 1 : 0.3, transition: ease }}>{m.label}</span>
              </div>
            </At>
          )
        })}
        <svg className="absolute" style={{ left: 30, top: 236 }} width={1050} height={110} aria-hidden>
          <path d="M 0 100 C 260 98 420 92 560 80 C 740 64 900 34 1040 6" fill="none" stroke={colors.line} strokeWidth={3} />
          <path d="M 0 100 C 260 98 420 92 560 80 C 740 64 900 34 1040 6" fill="none" stroke={colors.brand} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray="1" style={{ strokeDashoffset: 1 - beat / 4, transition: ease }} />
        </svg>
        <At x={1000} y={318}><Label tone="brand" size={13}>Adoption</Label></At>
      </Stage>
    </Card>
  )
}

/* ================================================================== 21 · Eras And Their Legacy */

const TABLE: [string, string, string, string][] = [
  ['Mainframes & Time-sharing', '1960s-70s', 'Many users share one machine', 'Shared-access roots'],
  ['Client-Server & Virtualization', '1980s-2000s', 'Hardware abstracted into virtual machines', 'Resource pooling'],
  ['Grid & Utility Computing', '1990s-2000s', 'Pooled capacity, pay-per-use billing', 'Metered service model'],
  ['Public Cloud', '2006 onward', 'On-demand delivery over internet', "Today's cloud platforms"],
]

export function EraTable({ lesson }: { lesson: string }) {
  const beat = useBeats(4)
  const ease = useEase()
  return (
    <Card id="evolution-table" kicker="Evolution At A Glance" title="Eras And Their Legacy" lead="Each era solved a resource problem that cloud computing still answers, from shared access on one machine to metered, on-demand delivery over the internet" lesson={lesson} beat={beat} total={4}>
      <div className="flex gap-4">
        <div className="flex flex-col gap-3" style={{ width: 806 }}>
          <div className="relative h-[40px]">
            <div className="absolute left-[20px] right-[20px] top-[10px] h-[3px] rounded-full" style={{ background: colors.line }} />
            {TABLE.map((r, i) => (
              <div key={r[1]} className="absolute flex flex-col items-center" style={{ left: 100 + i * 200, transform: 'translateX(-50%)' }}>
                <span className="block h-[14px] w-[14px] rounded-full" style={{ marginTop: 4, background: beat >= i + 1 ? colors.brand : colors.white, boxShadow: `inset 0 0 0 3px ${colors.brand}`, transition: ease }} />
                <span className="mt-1 whitespace-nowrap font-heading text-[14px] font-semibold" style={{ color: colors.brandDark }}>{r[1]}</span>
              </div>
            ))}
          </div>
          <Stage w={806} h={300} active={false} pad={10}>
            <div className="grid overflow-hidden rounded-xl bg-white" style={{ gridTemplateColumns: '1.3fr 0.9fr 1.4fr 1fr', boxShadow: `inset 0 0 0 1px ${colors.line}` }}>
              {['Era', 'Period', 'Core Idea', 'Cloud Legacy'].map((h) => (
                <span key={h} className="px-3 py-2.5 font-heading text-[14px] font-semibold" style={{ background: colors.surface2, color: colors.brandDark }}>{h}</span>
              ))}
              {TABLE.map((r, i) =>
                r.map((c, k) => (
                  <span key={`${i}${k}`} className={`px-3 py-3 text-[14px] leading-snug ${k === 0 ? 'font-heading font-semibold' : 'font-medium'}`} style={{ color: colors.ink, borderTop: `1px solid ${colors.line}`, background: beat === i + 1 ? 'rgba(45,99,251,0.09)' : 'transparent', opacity: beat >= i + 1 ? 1 : 0, transition: ease }}>
                    {c}
                  </span>
                )),
              )}
            </div>
          </Stage>
        </div>
        <Stage w={288} h={352} active={beat >= 1}>
          <At x={144} y={18} cx><CloudShape w={150} /></At>
          <At x={144} y={118} cx><span className="whitespace-nowrap font-heading text-[15px] font-semibold" style={{ color: colors.ink }}>what cloud inherited</span></At>
          <At x={20} y={150} w={248}>
            <div className="flex flex-col gap-2">
              {TABLE.map((r, i) => (
                <Fade key={r[3]} on={beat >= i + 1}>
                  <Label tone="brand" size={14} strong>{r[3]}</Label>
                </Fade>
              ))}
            </div>
          </At>
        </Stage>
      </div>
    </Card>
  )
}

