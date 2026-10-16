import { useEffect, useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { useBeats } from '@/ui'
import { Card, Stage, At, Fade, Label, Arrow, Traveller, useCycle, STILL, BOX_W } from './scene'
import { Idling, Posed, FACE_WHOLE, BUST, BAKER } from './Cast'
import { TENANTS } from './people'
import { ClaySvg, CloudShape, useEase } from './art'
import { mo } from './motion'
import { TILE_SKIN } from './card'
import { R, usePrefix, Shadow, BlurDef, Lin } from './depth'
import { CloudResources, FurnishedFlat, RESOURCE_VW, RESOURCE_X } from './clay-a'
import { ClayBar, ClayBook, ClayClock, ClayCloud, ClayDesktop, ClayFlats, ClayMainframe, ClayMeter, ClayOsWindow, ClayPadlock, ClayParcel, ClayScale, ClayServerBox, ClayShop, ClayTable, ClayTerminal, ClayTruck, FLAT_DOORS, FLAT_W, LAB } from './clay-b'
import { ClayBars, ClayFittedCupboards, ClayMoon, ClayMovingBox, ClayNo, ClayParkedCar, ClayPhone, ClayServerUnit, ClayTaxi } from './clay-d'
import { ClayAtm, ClayBand, ClayBill, ClayBulb, ClayFan, ClayFridge, ClayHouse, ClayLaptop as LaptopC, ClayMessCounter, ClayPlate, ClayRack, ClayServer as ServerC, ClayStove, ClosedCounter, ElectricMeter, TenantTile, TENANT_TONES } from './clay-c'

/**
 * EVERY ANALOGY IN THE DECK IS ONE SCENE PAIR (plan decision 4).
 *
 * Three beats, the reference's three parts in its own words:
 *   1  the everyday scene, labelled with the reference's everyday label
 *   2  `SAME IDEA`: the arrow draws and the cloud scene arrives, labelled with
 *      the reference's cloud label; each everyday object has its cloud twin
 *   3  the claim, the reference's own line, in a strip under both
 *
 * Both scenes are drawn in the lab's flat style; the people are lab
 * characters. The reference's photographs are gone; their descriptions (an
 * ATM "set into a wall, its keypad and card slot lit") are the scenes'
 * accessible names, so not one of the reference's words is lost.
 */

const SW = 470
const SH = 292
const MID = BOX_W - SW * 2

/**
 * REVIEW 2026-10-16 (global rules 3 to 5): no analogy needs a hand. Every
 * sequence runs on `useCycle` (one step every 2400ms, the deck's step), a
 * counting loop completes a lap in about 8s (the deck's lap), a connector
 * draws from its source to its target once its entrance is done, and a
 * transfer is a dot along the path. Everything holds still on harness URLs.
 */

/** True once a slide has been up long enough for its entrances to finish, so an arrow drawn then is seen drawing. Immediately true on harness URLs and in thumbnails. */
function useDrawn(delay = 1100): boolean {
  const instant = useInstant()
  const [d, setD] = useState(STILL || instant)
  useEffect(() => {
    if (d) return
    const t = window.setTimeout(() => setD(true), delay)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return d
}

/** A key on the floor: the tenant's, the flat being ready to move into (slide 9's illustration). Gold is its own colour,
 *  in the render's solids (user, 2026-10-16, slide 5 as the style): a graded gold with a lit crown, a darker underside on
 *  the bow and the blade, a specular on the bow, and a soft blurred shadow on the floor.
 *  Motion layer: it rests on the floor, so its idle is the gentle pulse, not a float that would lift it. */
function ClayKey({ w }: { w: number }) {
  const idle = mo('pulse', 9)
  const id = usePrefix()
  return (
    <ClaySvg w={w} vw={80} vh={36}>
      <defs>
        <BlurDef id={id} sd={2.5} />
        <Lin id={`${id}-gold`} from={R.goldHi} to={R.gold} />
        <Lin id={`${id}-side`} from={R.goldSide} to={R.goldSideDark} />
      </defs>
      <Shadow id={id} cx={40} cy={33} rx={34} ry={2.6} o={0.2} />
      <g className={idle.className} style={idle.style}>
        <circle cx={16} cy={20} r={14} fill={`url(#${id}-side)`} />
        <rect x={26} y={16} width={50} height={8} rx={4} fill={`url(#${id}-side)`} />
        <circle cx={16} cy={18} r={14} fill={`url(#${id}-gold)`} />
        <circle cx={16} cy={18} r={5} fill={R.goldSideDark} />
        <rect x={26} y={14} width={50} height={8} rx={4} fill={`url(#${id}-gold)`} />
        <rect x={58} y={20} width={6} height={9} rx={2} fill={`url(#${id}-side)`} />
        <rect x={68} y={20} width={6} height={12} rx={2} fill={`url(#${id}-side)`} />
        <ellipse cx={11} cy={11} rx={5} ry={2.4} fill={R.goldShine} opacity={0.8} transform="rotate(-30 11 11)" />
        <rect x={30} y={15} width={34} height={2} rx={1} fill={R.goldShine} opacity={0.6} />
      </g>
    </ClaySvg>
  )
}

export function AnalogyScene({
  id,
  kicker,
  lesson,
  everyday,
  cloud,
  claim,
  alt,
  controls,
}: {
  id: string
  kicker: string
  lesson: string
  everyday: { label: string; scene: (beat: number) => ReactNode }
  cloud: { label: string; scene: (beat: number) => ReactNode }
  claim: string
  /** the reference photo's own description, kept as the everyday scene's name */
  alt?: string
  /** a live control under the scenes, when the scene has one */
  controls?: (beat: number) => ReactNode
}) {
  const beat = useBeats(3)
  const ease = useEase()
  return (
    <Card id={id} kicker={kicker} title="Analogy" lesson={lesson} beat={beat} total={3}>
      <div className="flex items-start" style={{ width: BOX_W }}>
        <div className="flex flex-col items-center gap-2.5" style={{ width: SW }}>
          <Stage w={SW} h={SH} active={beat === 1}>
            <div role="img" aria-label={alt ?? everyday.label} className="absolute inset-0">
              {everyday.scene(beat)}
            </div>
          </Stage>
          <Label strong size={16}>
            {everyday.label}
          </Label>
        </div>
        <div className="relative flex flex-col items-center justify-center" style={{ width: MID, height: SH }}>
          <Fade on={beat >= 2}>
            <span className="font-heading text-[14px] font-semibold tracking-[0.08em]" style={{ color: colors.brandDark }}>
              SAME IDEA
            </span>
          </Fade>
          <div className="relative mt-2" style={{ width: 120, height: 20 }}>
            <Arrow x1={10} y1={10} x2={110} y2={10} on={beat >= 2} dashed />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2.5" style={{ width: SW }}>
          <Stage w={SW} h={SH} active={beat === 2}>
            <div className="absolute inset-0" style={{ opacity: beat >= 2 ? 1 : 0, transition: ease }}>
              {cloud.scene(beat)}
            </div>
            <div className="absolute inset-0 grid place-items-center" style={{ opacity: beat >= 2 ? 0 : 1, transition: ease }}>
              <CloudShape w={120} fill={colors.surface2} shade={colors.line} />
            </div>
          </Stage>
          <Fade on={beat >= 2}>
            <Label strong size={16} tone="brand">
              {cloud.label}
            </Label>
          </Fade>
        </div>
      </div>
      {controls && <div className="mt-3 flex justify-center" style={{ width: BOX_W }}>{controls(beat)}</div>}
      <Fade on={beat >= 3} className="mt-3">
        <div className="mx-auto w-fit rounded-pill px-6 py-2 font-heading text-[20px] font-semibold" style={{ background: colors.brand, color: colors.white, boxShadow: `0 10px 24px -14px ${colors.brand}` }}>
          {claim}
        </div>
      </Fade>
    </Card>
  )
}

/* ================================================================== the eleven scenes */

/** Cloud Computing Defined: a furnished apartment. */
export function ApartmentAnalogy({ lesson }: { lesson: string }) {
  const step = useCycle(4)
  return (
    <AnalogyScene
      id="nist-analogy"
      kicker="Cloud Computing Defined"
      lesson={lesson}
      everyday={{
        label: 'A furnished apartment',
        /* review 2026-10-16: the flat alone, in the clay look; no person, no bricks, no bag */
        scene: () => (
          <>
            <At x={14} y={14}><FurnishedFlat w={442} /></At>
            {/* review 2026-10-16: the keys on the floor, the move-in itself */}
            <At x={372} y={238}><ClayKey w={68} /></At>
            <At x={318} y={40}><Label tone="good" size={14}>Ready to use</Label></At>
          </>
        ),
      }}
      cloud={{
        label: 'Cloud computing',
        /* the provider's resources under its cloud, each named, ready the same way; review 2026-10-16: a
           packet leaves the cloud for each resource in turn, down the bus line, the provisioning itself */
        scene: () => (
          <>
            <At x={14} y={8}><CloudResources w={442} /></At>
            {['Servers', 'Storage', 'Networks', 'Applications'].map((t, i) => (
              <At key={t} x={14 + (RESOURCE_X[i] * 442) / RESOURCE_VW} y={236} cx>
                <Label tone="brand" size={14}>{t}</Label>
              </At>
            ))}
            <Traveller key={step} k={step} run={!STILL} dur={1.8} size={12} path={[[235, 118], [235, 137], [14 + (RESOURCE_X[step] * 442) / RESOURCE_VW, 137], [14 + (RESOURCE_X[step] * 442) / RESOURCE_VW, 160]]} />
          </>
        ),
      }}
      claim="Move in, do not build"
    />
  )
}

/** Mainframes and time-sharing: a library reading room. */
export function ReadingRoomAnalogy({ lesson }: { lesson: string }) {
  return <ReadingRoom lesson={lesson} />
}

function ReadingRoom({ lesson }: { lesson: string }) {
  const turn = useCycle(4, 2400, 1)
  const ease = useEase(700)
  /* one column per seat, shared by both scenes, so every chip sits centred under its person or terminal on one baseline */
  const seats = [80, 183, 286, 389]
  const CHIP_Y = 238
  const chips = seats.map((x, i) => (
    <At key={`t${i}`} x={x} y={CHIP_Y} cx>
      <Label tone={i === turn ? 'brand' : 'muted'} size={14}>
        {`Turn ${i + 1}`}
      </Label>
    </At>
  ))
  return (
    <AnalogyScene
      id="mainframes-analogy"
      kicker="Mainframes & Time-Sharing"
      lesson={lesson}
      everyday={{
        label: 'A library reading room',
        scene: () => (
          <>
            {seats.map((x, i) => (
              <At key={i} x={x} y={84} cx>
                <div style={{ opacity: i === turn ? 1 : 0.6, transition: ease }}>
                  <Idling cfg={TENANTS[i]} scale={0.42} crop={BUST} seed={20 + i} />
                </div>
              </At>
            ))}
            <At x={235} y={170} cx><ClayTable w={420} /></At>
            <div className="absolute" style={{ left: seats[turn] - 26, top: 150, transition: ease }}>
              <ClayBook w={52} />
            </div>
            <At x={408} y={14}><ClayClock w={48} turn={turn / 4} /></At>
            {chips}
          </>
        ),
      }}
      cloud={{
        label: 'Time-sharing',
        scene: () => (
          <>
            <At x={235} y={12} cx><ClayMainframe w={176} /></At>
            {seats.map((x, i) => (
              <At key={i} x={x} y={150} cx>
                <div style={{ opacity: i === turn ? 1 : 0.6, transition: ease }}>
                  <ClayTerminal w={84} lit={i === turn} />
                </div>
              </At>
            ))}
            {chips}
          </>
        ),
      }}
      claim="Everyone gets a scheduled turn"
    />
  )
}

/** Client-server and virtualization: one plot, locked apartments. */
export function PlotAnalogy({ lesson }: { lesson: string }) {
  const FW = 400
  const k = FW / FLAT_W
  return (
    <AnalogyScene
      id="virtualization-analogy"
      kicker="Client-Server & Virtualization"
      lesson={lesson}
      everyday={{
        label: 'One plot, locked apartments',
        scene: () => (
          <>
            {/* one plot, three flats: each furnished its own way, each door numbered and locked (review 2026-10-16: no faces) */}
            <At x={235} y={8} cx>
              <div className="relative" style={{ width: FW }}>
                <ClayFlats w={FW} />
                {FLAT_DOORS.map((d, i) => (
                  <span key={i} className="absolute font-heading text-[14px] font-semibold leading-none text-white" style={{ left: d.x * k, top: d.y * k, transform: 'translateX(-50%)' }}>
                    {i + 1}
                  </span>
                ))}
              </div>
            </At>
            <At x={235} y={256} cx><Label size={14}>One plot</Label></At>
          </>
        ),
      }}
      cloud={{
        label: 'Virtual machines',
        scene: () => <VmStack top={22} w={420} />,
      }}
      claim="One space, divided and locked"
    />
  )
}

/**
 * Three VMs on a hypervisor on one physical server, in clay: each VM a locked
 * card showing its own OS window (a different system in each), the hypervisor
 * and the server as clay slabs. Labels are DOM, so every word is a real element.
 */
export function VmStack({ top = 30, vms = 3, osTag = true, cx = 235, w = 380 }: { top?: number; vms?: number; osTag?: boolean; cx?: number; w?: number }) {
  const ease = useEase()
  const gap = 10
  const tile = (w - gap * 2) / 3
  return (
    <At x={cx} y={top} cx w={w}>
      <div className="flex flex-col" style={{ gap: 8 }}>
        <div className="flex" style={{ gap }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative flex flex-col items-center gap-1 rounded-2xl pb-2 pt-3" style={{ width: tile, ...TILE_SKIN, opacity: i < vms ? 1 : 0, transform: i < vms ? 'none' : 'translateY(10px)', transition: ease }}>
              <ClayOsWindow w={Math.round(tile * 0.64)} k={i} />
              <span className="font-heading text-[15px] font-semibold leading-tight" style={{ color: colors.brandDark }}>VM</span>
              {osTag && <span className="text-[14px] leading-tight" style={{ color: colors.ink }}>Its own OS</span>}
              <span className="absolute right-2 top-2"><ClayPadlock w={15} /></span>
            </div>
          ))}
        </div>
        <ClayBar w={w} h={36} fill={LAB.cobalt}>
          <span className="font-heading text-[15px] font-semibold text-white">Hypervisor</span>
        </ClayBar>
        <ClayBar w={w} h={44} fill={LAB.lavender}>
          <ClayServerBox w={30} n={2} />
          <span className="text-[15px] font-medium" style={{ color: colors.ink }}>One physical server</span>
        </ClayBar>
      </div>
    </At>
  )
}

/** Grid and utility computing: one shipping company's trucks. */
export function TruckAnalogy({ lesson }: { lesson: string }) {
  /* each sender's own colour (LAB palette), carried by its parcel and, in the cloud scene, by its job */
  const tones = [LAB.orange, LAB.sage, LAB.periwinkle]
  const weights = ['2 kg', '5 kg', '3 kg']
  const ROWS = [24, 110, 196]
  /* review 2026-10-16: the connectors draw from the desktops to the cloud and on to the meter, then one
     job at a time travels that way: into the pool, then to the bill */
  const drawn = useDrawn()
  const job = useCycle(3)
  return (
    <AnalogyScene
      id="grid-analogy"
      kicker="Grid & Utility Computing"
      lesson={lesson}
      everyday={{
        label: "One shipping company's trucks",
        scene: () => (
          <>
            {/* the senders are shops, not faces (review 2026-10-16) */}
            {ROWS.map((y, i) => (
              <At key={i} x={18} y={y}>
                <div className="flex items-center gap-2">
                  <ClayShop w={62} tone={tones[i]} />
                  <ClayParcel w={30} tone={tones[i]} />
                  <Label size={14} tone="warn">{weights[i]}</Label>
                </div>
              </At>
            ))}
            <At x={204} y={40}><ClayTruck w={252} parcels={tones} /></At>
            <At x={236} y={196}><ClayScale w={70} value={0.6} /></At>
            <At x={318} y={214}><Label size={14}>Pay by weight</Label></At>
          </>
        ),
      }}
      cloud={{
        label: 'Grid and utility computing',
        scene: () => (
          <>
            {ROWS.map((y, i) => (
              <At key={i} x={18} y={y}>
                <div className="flex items-center gap-2">
                  <ClayDesktop w={76} />
                  <ClayParcel w={22} tone={tones[i]} />
                </div>
              </At>
            ))}
            {ROWS.map((y, i) => (
              <Arrow key={i} x1={146} y1={y + 30} x2={176} y2={102 + i * 16} on={drawn} delay={i * 180} />
            ))}
            <At x={176} y={66}><ClayCloud w={146} /></At>
            <At x={284} y={190} cx><Label tone="brand" size={14}>Pooled processing power</Label></At>
            <Arrow x1={324} y1={110} x2={352} y2={100} on={drawn} delay={540} />
            {drawn && <Traveller key={job} k={job} run={!STILL} dur={2.1} size={12} tone={tones[job]} path={[[146, ROWS[job] + 30], [176, 102 + job * 16], [250, 112], [250, 112], [324, 110], [352, 100]]} />}
            <At x={356} y={40}><ClayMeter w={84} value={0.55} /></At>
            <At x={398} y={152} cx><Label size={14}>Metered billing</Label></At>
          </>
        ),
      }}
      claim="Pool the load, pay your share"
    />
  )
}

/** On-demand self-service: an ATM. */
export function AtmAnalogy({ lesson }: { lesson: string }) {
  const phase = useCycle(3, 2400, 2)
  return (
    <AnalogyScene
      id="self-service-analogy"
      kicker="On-Demand Self-Service"
      lesson={lesson}
      alt="A bank ATM set into a wall, its keypad and card slot lit"
      everyday={{
        label: 'An ATM',
        scene: () => (
          /* review 2026-10-16: no person, clay objects; the card, PIN and cash cycle is the self-service itself */
          <>
            <At x={50} y={22}><ClayAtm w={150} card={phase >= 1} cash={phase >= 2} lit={phase >= 1} /></At>
            <At x={50} y={238} w={150}>
              <div className="flex justify-center">
                <Label tone={phase >= 2 ? 'good' : 'brand'} size={14}>{phase === 0 ? 'Card in' : phase === 1 ? 'PIN' : 'Cash out'}</Label>
              </div>
            </At>
            <At x={250} y={70}>
              <div className="flex flex-col items-center gap-3">
                <ClosedCounter w={170} />
                <Label tone="muted" size={14}>No queue, no clerk</Label>
              </div>
            </At>
          </>
        ),
      }}
      cloud={{
        label: 'On-demand self-service',
        scene: () => (
          <>
            <At x={30} y={56}>
              <div className="flex flex-col items-center gap-3">
                <LaptopC w={190} lit={phase >= 1} />
                <Label tone={phase >= 1 ? 'dark' : 'plain'} size={14}>Launch Instance</Label>
              </div>
            </At>
            <At x={300} y={54} w={140}>
              <div className="flex flex-col items-center gap-2.5">
                {[0, 1, 2].map((i) => (
                  <Fade key={i} on={phase >= 2 || STILL} delay={i * 120}>
                    <ServerC w={120} />
                  </Fade>
                ))}
                <Label tone="good" size={14}>Ready</Label>
              </div>
            </At>
            <At x={30} y={250}><Label tone="muted" size={14}>Nobody to ask first</Label></At>
          </>
        ),
      }}
      claim="Nobody to ask first"
    />
  )
}

/** Pooling and multi-tenancy: a hostel mess kitchen. */
export function MessAnalogy({ lesson }: { lesson: string }) {
  const served = useCycle(4, 2400, 3)
  /* the half-body crop raised above the cap and widened to the canvas edge, past the presenting hand (review 2026-10-16: the hand was cut at the wrist) */
  const MESS_CROP = { x0: 70, y0: -36, x1: 400, y1: 392 }
  return (
    <AnalogyScene
      id="pooling-analogy"
      kicker="Pooling And Multi-Tenancy"
      lesson={lesson}
      alt="A serving counter, food portioned out of shared trays with tongs"
      everyday={{
        label: 'A hostel mess kitchen',
        scene: () => (
          <>
            {/* review 2026-10-16: the chef's cap and whole reaching hand inside the crop (MESS_CROP), clay objects throughout;
                the later review: the chef and the students alive, head, eyes and a little hand movement only */}
            <At x={20} y={6}><Posed cfg={BAKER} props scale={0.4} crop={MESS_CROP} expression="happy" gesture="presentRight" amplitude={0.5} at={1.0} alive /></At>
            <At x={14} y={156}><ClayMessCounter w={270} served={served} /></At>
            {[0, 1, 2].map((i) => (
              <At key={i} x={330} y={4 + i * 64}>
                <div className="flex items-center gap-2">
                  <Idling cfg={TENANTS[i]} scale={0.3} crop={FACE_WHOLE} seed={60 + i} alive />
                  <ClayPlate w={56} portions={i < served ? 3 : 0} />
                </div>
              </At>
            ))}
            <At x={372} y={206} cx>
              <div className="flex flex-col items-center gap-1.5 opacity-70">
                <ClayStove w={44} />
                <Label tone="muted" size={14}>No stove per student</Label>
              </div>
            </At>
          </>
        ),
      }}
      cloud={{
        label: 'Resource pooling',
        scene: () => (
          <>
            <At x={40} y={16}><ClayRack w={116} units={['run', 'run', 'run', 'run', 'run', 'idle']} /></At>
            <At x={98} y={244} cx><Label size={14}>One shared pool</Label></At>
            {[0, 1, 2].map((i) => (
              <At key={i} x={200} y={30 + i * 80}>
                <div className="flex items-center gap-3">
                  <TenantTile w={44} tone={TENANT_TONES[i]} />
                  <div className="flex gap-1.5">
                    {Array.from({ length: i + 1 }, (_, k) => (
                      <Fade key={k} on={i < served || STILL} delay={k * 100}>
                        <ServerC w={62} />
                      </Fade>
                    ))}
                  </div>
                </div>
              </At>
            ))}
          </>
        ),
      }}
      claim="One stock, portions on demand"
    />
  )
}

/** Rapid elasticity: a rubber band. */
export function BandAnalogy({ lesson }: { lesson: string }) {
  const k = useCycle(4, 2400, 2)
  const stretch = [0, 0.5, 1, 0.5][k]
  const count = [2, 4, 6, 4][k]
  return (
    <AnalogyScene
      id="elasticity-analogy"
      kicker="Rapid Elasticity"
      lesson={lesson}
      alt="A coil of coloured rubber bands resting on a table"
      everyday={{
        label: 'A rubber band',
        scene: () => (
          <>
            {/* review 2026-10-16: a clay band on a board; the stretch loop is the concept and stays */}
            <At x={235} y={60} cx><ClayBand w={430} stretch={stretch} /></At>
            <At x={235} y={232} cx>
              <Label tone={stretch > 0.7 ? 'warn' : stretch > 0 ? 'brand' : 'good'} size={14}>{stretch > 0.7 ? 'Stretched under load' : stretch > 0 ? 'Stretching' : 'At rest'}</Label>
            </At>
          </>
        ),
      }}
      cloud={{
        label: 'Rapid elasticity',
        scene: () => (
          <>
            <At x={235} y={44} cx w={420}>
              <div className="grid grid-cols-3 justify-items-center gap-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <Fade key={i} on={i < count} lift={6}>
                    <ServerC w={120} />
                  </Fade>
                ))}
              </div>
            </At>
            <At x={235} y={232} cx>
              <Label tone="brand" size={14}>{`${count} instances`}</Label>
            </At>
          </>
        ),
      }}
      claim="Stretch, then spring back"
    />
  )
}

/** The appliance states the meter scene cycles through: two on, all three, one, none. */
const METER_STATES: [boolean, boolean, boolean][] = [
  [true, true, false],
  [true, true, true],
  [false, true, false],
  [false, false, false],
]

/** Measured service: a household electricity meter. Review 2026-10-16: the switches throw themselves, one state every step, so the meter is seen turning and resting. */
export function MeterAnalogy({ lesson }: { lesson: string }) {
  const on = METER_STATES[useCycle(METER_STATES.length)]
  const live = on.filter(Boolean).length
  return (
    <AnalogyScene
      id="measured-analogy"
      kicker="Measured Service"
      lesson={lesson}
      everyday={{
        label: 'A household electricity meter',
        scene: () => (
          <>
            {/* review 2026-10-16: clay house, appliances, meter and bill; the meter's wheel turning is the concept */}
            <At x={24} y={20}><ClayHouse w={110} lit={live > 0} /></At>
            <At x={24} y={150} w={200}>
              <div className="flex items-end gap-4">
                <ClayFan w={50} on={on[0]} />
                <ClayBulb w={36} on={on[1]} />
                <div style={{ opacity: on[2] ? 1 : 0.45 }}><ClayFridge w={42} /></div>
              </div>
            </At>
            <At x={226} y={24}><ElectricMeter w={104} value={live / 3} spin={live > 0 && !STILL} /></At>
            <At x={358} y={36}><ClayBill w={74} rows={live} /></At>
            <At x={226} y={180} w={220}><span className="block text-center text-[15px] font-semibold" style={{ color: colors.ink }}>{live === 0 ? 'Nothing on, the meter rests' : `${live} on, the meter turns`}</span></At>
          </>
        ),
      }}
      cloud={{
        label: 'Measured service',
        scene: () => (
          <>
            <At x={24} y={40} w={150}>
              <div className="flex flex-col gap-3">
                {on.map((x, i) => (
                  <ServerC key={i} w={150} state={x ? 'run' : 'off'} />
                ))}
              </div>
            </At>
            <At x={226} y={24}><ElectricMeter w={104} value={live / 3} spin={live > 0 && !STILL} /></At>
            <At x={358} y={36}><ClayBill w={74} rows={live} /></At>
            <At x={226} y={180} w={220}><span className="block text-center text-[15px] font-semibold" style={{ color: colors.ink }}>{live === 0 ? 'No usage, no charge' : `${live} running, ${live} billed`}</span></At>
          </>
        ),
      }}
      claim="Billed for what was used"
    />
  )
}

/** Cost model shift: renting a taxi (review 2026-10-16: clay objects, no driver). */
export function TaxiAnalogy({ lesson }: { lesson: string }) {
  /* the meter counting trips is the concept, so this loop stays: six trips in a lap of about 8s */
  const fare = useCycle(6, 1300, 4) + 1
  const trips = [3, 6, 2, 8, 4, 5]
  return (
    <AnalogyScene
      id="capex-analogy"
      kicker="Cost Model Shift"
      lesson={lesson}
      alt="A yellow taxi moving through a city street, its surroundings blurred"
      everyday={{
        label: 'Renting a taxi',
        scene: () => (
          <>
            <At x={24} y={22}><ClayTaxi w={230} /></At>
            <At x={276} y={72}><Label tone="good" size={14}>{`Meter: trip ${fare} of 6`}</Label></At>
            <At x={24} y={168}><ClayParkedCar w={190} /></At>
            <At x={236} y={186}>
              <div className="flex flex-col items-start gap-1.5">
                <Label tone="muted" size={14}>Owned car, idle most days</Label>
                <Label tone="warn" size={14}>Loan, insurance, upkeep</Label>
              </div>
            </At>
          </>
        ),
      }}
      cloud={{
        label: 'OpEx cloud billing',
        scene: () => (
          <>
            <At x={30} y={28} w={410}>
              <ClayBars w={410} h={160} values={trips.map((v) => v / 8)} lit={fare} tone="#0055E8" />
              <div className="mt-2 flex justify-between">
                {trips.map((_, i) => (
                  <span key={i} className="text-center text-[14px] font-medium" style={{ width: 410 / 6 - 10, color: colors.ink }}>{`Trip ${i + 1}`}</span>
                ))}
              </div>
            </At>
            <At x={30} y={236}><Label tone="brand" size={14}>Pay per use, nothing between trips</Label></At>
          </>
        ),
      }}
      claim="Pay for the trip, not the car"
    />
  )
}

/**
 * Vendor lock-in: a landlord's fitted cupboards (review 2026-10-16: clay, no
 * person). Both scenes are drawn on one plan so the twins line up: the thing
 * built in place on the left, the way out with a shut sign in the middle, the
 * place it cannot go on the right, the reason under it.
 */
export function CupboardAnalogy({ lesson }: { lesson: string }) {
  return (
    <AnalogyScene
      id="lock-in-analogy"
      kicker="Vendor Lock-In"
      lesson={lesson}
      alt="Cupboards fitted along a kitchen wall, each drawer labelled"
      everyday={{
        label: "A landlord's fitted cupboards",
        scene: () => (
          <>
            <At x={20} y={44}><ClayFittedCupboards w={250} /></At>
            <Arrow x1={282} y1={146} x2={344} y2={146} dashed tone={colors.danger} />
            <At x={313} y={146} cx cy><ClayNo w={26} /></At>
            <At x={402} y={146} cx cy>
              <div className="flex flex-col items-center gap-2 pt-[30px]">
                <ClayMovingBox w={90} />
                <Label size={14} tone="muted">Moving out</Label>
              </div>
            </At>
            <At x={20} y={244}><Label size={14} tone="warn">Fitted to this wall</Label></At>
          </>
        ),
      }}
      cloud={{
        label: 'Vendor lock-in',
        scene: () => (
          <>
            <At x={20} y={50} w={250}>
              <div className="rounded-2xl p-3" style={{ background: TILE_SKIN.background, boxShadow: `inset 0 0 0 2px ${colors.brand}, 0 12px 24px -16px rgba(31,64,140,0.30)` }}>
                <span className="block font-heading text-[14px] font-semibold" style={{ color: colors.brandDark }}>One provider</span>
                <div className="mt-2 rounded-xl p-2.5" style={TILE_SKIN}>
                  <span className="block text-[14px] font-semibold" style={{ color: colors.ink }}>Your application</span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Label tone="brand" size={14} mono>Lambda triggers</Label>
                    <Label tone="brand" size={14} mono>DynamoDB APIs</Label>
                  </div>
                </div>
              </div>
            </At>
            <Arrow x1={282} y1={146} x2={344} y2={146} dashed tone={colors.danger} />
            <At x={313} y={146} cx cy><ClayNo w={26} /></At>
            <At x={354} y={106} w={96}>
              <div className="grid h-[80px] place-items-center rounded-xl border-2 border-dashed px-1 text-center text-[14px] font-semibold leading-tight" style={{ borderColor: colors.line, background: TILE_SKIN.background, boxShadow: '0 12px 24px -16px rgba(31,64,140,0.30)', color: colors.ink }}>
                Other providers
              </div>
            </At>
            <At x={20} y={244}><Label tone="warn" size={14}>Built from one provider's parts</Label></At>
          </>
        ),
      }}
      claim="Fitted things do not move"
    />
  )
}

/** Cost overruns: roaming left switched on (review 2026-10-16: clay, the plane wholly inside the screen). */
export function RoamingAnalogy({ lesson }: { lesson: string }) {
  /* the charges growing bar by bar is the concept, so this loop stays: seven bars in a lap of about 8s */
  const n = useCycle(7, 1150, 5) + 1
  const bars = (tone: string) => (
    <ClayBars w={236} h={150} values={Array.from({ length: 7 }, (_, i) => (14 + i * i * 2.2) / 100)} lit={n} tone={tone} hot={5} gap={10} />
  )
  return (
    <AnalogyScene
      id="overruns-analogy"
      kicker="Cost Overruns"
      lesson={lesson}
      everyday={{
        label: 'Roaming left switched on',
        scene: () => (
          <>
            <At x={40} y={26}><ClayPhone w={88} /></At>
            <At x={146} y={26}><ClayMoon w={38} /></At>
            <At x={210} y={56}>{bars('#FC963C')}</At>
            <At x={84} y={246} cx><Label tone="warn" size={14}>Roaming: on</Label></At>
            <At x={210} y={246}><Label tone="bad" size={14}>Charges grow overnight</Label></At>
          </>
        ),
      }}
      cloud={{
        label: 'Cost overruns',
        scene: () => (
          <>
            <At x={24} y={110}><ClayServerUnit w={150} /></At>
            <At x={210} y={56}>{bars('#0055E8')}</At>
            <At x={99} y={246} cx><Label tone="warn" size={14}>Forgotten, still running</Label></At>
            <At x={210} y={246}><Label tone="bad" size={14}>Billing until the invoice</Label></At>
          </>
        ),
      }}
      claim="Left on, still charging"
    />
  )
}
