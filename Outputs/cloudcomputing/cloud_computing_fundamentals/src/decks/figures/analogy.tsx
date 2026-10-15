import { useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { Card, Stage, At, Fade, Label, Arrow, Control, useTicker, STILL, BOX_W } from './scene'
import { Idling, Posed, FACE, BUST, BAKER } from './Cast'
import { MEERA, TENANTS } from './people'
import {
  Atm, Bag, Bed, Bill, Book, Bricks, Bulb, ClockFace, CloudShape, Counter, Cupboards, Desktop, Fan, Flats, Fridge, House, Lamp,
  Laptop, Mainframe, MessCounter, MeterDial, Moon, Padlock, Parcel, ParkedCar, Plate, ProviderBuilding, Rack, RoamingPhone, RubberBand,
  ServerUnit, Sofa, Stove, TableTop, Taxi, Terminal, Truck, Wall, WeighScale, useEase,
} from './art'

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
  return (
    <AnalogyScene
      id="nist-analogy"
      kicker="Cloud Computing Defined"
      lesson={lesson}
      everyday={{
        label: 'A furnished apartment',
        scene: (b) => (
          <>
            <At x={14} y={14} w={300}>
              <div className="relative rounded-xl" style={{ width: 300, height: 262, background: colors.surface }}>
                <At x={16} y={120}><Sofa w={120} /></At>
                <At x={150} y={150}><Bed w={136} /></At>
                <At x={18} y={22}><Lamp w={34} /></At>
                <At x={226} y={30}><Fridge w={50} /></At>
                <At x={70} y={26}><Label tone="good" size={13}>ready to use</Label></At>
              </div>
            </At>
            <At x={330} y={70}><Idling cfg={MEERA} scale={0.5} seed={5} /></At>
            <At x={334} y={232}><Bag w={44} /></At>
            <Fade on={b >= 2} style={{ position: 'absolute', left: 392, top: 226 }}>
              <div className="relative">
                <Bricks w={62} />
                <span className="absolute left-0 top-[18px] block h-[4px] w-[70px] rotate-[-22deg] rounded-full" style={{ background: colors.danger }} />
              </div>
            </Fade>
          </>
        ),
      }}
      cloud={{
        label: 'Cloud computing',
        scene: () => (
          <>
            <At x={16} y={18}><ProviderBuilding w={240} lit={8} /></At>
            <At x={22} y={200} w={232}>
              <div className="flex flex-wrap gap-2">
                <Label tone="brand" size={13}>servers</Label>
                <Label tone="brand" size={13}>storage</Label>
                <Label tone="brand" size={13}>networks</Label>
                <Label tone="brand" size={13}>applications</Label>
              </div>
            </At>
            <At x={300} y={64}><Idling cfg={MEERA} scale={0.5} seed={6} /></At>
            <At x={272} y={214}><Laptop w={100} glow /></At>
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
  const tick = useTicker(true, 1400, 1)
  const turn = tick % 4
  const ease = useEase(700)
  const seats = [56, 152, 248, 344]
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
              <At key={i} x={x} y={92} cx>
                <div style={{ opacity: i === turn ? 1 : 0.55, transition: ease }}>
                  <Idling cfg={TENANTS[i]} scale={0.42} crop={BUST} seed={20 + i} />
                </div>
              </At>
            ))}
            <At x={14} y={180}><TableTop w={420} /></At>
            <div className="absolute" style={{ left: seats[turn] - 24, top: 150, transition: ease }}>
              <Book w={48} />
            </div>
            <At x={400} y={14}><ClockFace w={50} turn={turn / 4} /></At>
            <At x={20} y={226} w={430}>
              <div className="flex justify-between">
                {seats.map((_, i) => (
                  <Label key={i} tone={i === turn ? 'brand' : 'muted'} size={13}>
                    {`turn ${i + 1}`}
                  </Label>
                ))}
              </div>
            </At>
          </>
        ),
      }}
      cloud={{
        label: 'Time-sharing',
        scene: () => (
          <>
            <At x={235} y={14} cx><Mainframe w={170} busy /></At>
            {seats.map((x, i) => (
              <At key={i} x={x + 10} y={176} cx>
                <div style={{ opacity: i === turn ? 1 : 0.5, transition: ease }}>
                  <Terminal w={74} lit={i === turn} />
                </div>
              </At>
            ))}
            <At x={20} y={252} w={430}>
              <div className="flex justify-between">
                {seats.map((_, i) => (
                  <Label key={i} tone={i === turn ? 'brand' : 'muted'} size={13}>
                    {`turn ${i + 1}`}
                  </Label>
                ))}
              </div>
            </At>
          </>
        ),
      }}
      claim="Everyone gets a scheduled turn"
    />
  )
}

/** Client-server and virtualization: one plot, locked apartments. */
export function PlotAnalogy({ lesson }: { lesson: string }) {
  return (
    <AnalogyScene
      id="virtualization-analogy"
      kicker="Client-Server & Virtualization"
      lesson={lesson}
      everyday={{
        label: 'One plot, locked apartments',
        scene: () => (
          <>
            <At x={235} y={34} cx><Flats w={380} n={3} /></At>
            {[0, 1, 2].map((i) => (
              <At key={i} x={235 - 120 + i * 120} y={150} cx>
                <Idling cfg={TENANTS[i]} scale={0.32} crop={FACE} seed={30 + i} />
              </At>
            ))}
            <At x={235} y={262} cx><Label size={13}>one plot</Label></At>
          </>
        ),
      }}
      cloud={{
        label: 'Virtual machines',
        scene: () => <VmStack top={30} faces />,
      }}
      claim="One space, divided and locked"
    />
  )
}

/** Three VMs on a hypervisor on one physical server: drawn as DOM so every label is a real element. */
export function VmStack({ top = 30, faces = false, vms = 3, osTag = true, cx = 235 }: { top?: number; faces?: boolean; vms?: number; osTag?: boolean; cx?: number }) {
  const ease = useEase()
  return (
    <At x={cx} y={top} cx w={380}>
      <div className="flex flex-col gap-2">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(3, 1fr)` }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative flex h-[110px] flex-col items-center justify-center gap-1 rounded-xl" style={{ background: colors.white, boxShadow: `inset 0 0 0 2px ${colors.brand}`, opacity: i < vms ? 1 : 0, transform: i < vms ? 'none' : 'translateY(10px)', transition: ease }}>
              {faces ? <Idling cfg={TENANTS[i]} scale={0.26} crop={FACE} seed={40 + i} /> : null}
              <span className="font-heading text-[15px] font-semibold" style={{ color: colors.brandDark }}>VM</span>
              {osTag && <span className="text-[14px]" style={{ color: colors.ink }}>its own OS</span>}
              <span className="absolute right-2 top-2"><Padlock w={14} /></span>
            </div>
          ))}
        </div>
        <div className="grid h-[34px] place-items-center rounded-xl font-heading text-[15px] font-semibold text-white" style={{ background: colors.brand }}>
          Hypervisor
        </div>
        <div className="flex h-[40px] items-center justify-center gap-2 rounded-xl" style={{ background: colors.white, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
          <ServerUnit w={44} />
          <span className="text-[14px] font-medium" style={{ color: colors.ink }}>One physical server</span>
        </div>
      </div>
    </At>
  )
}

/** Grid and utility computing: one shipping company's trucks. */
export function TruckAnalogy({ lesson }: { lesson: string }) {
  const tones = [colors.accent, colors.teal, colors.brand]
  const weights = ['2 kg', '5 kg', '3 kg']
  return (
    <AnalogyScene
      id="grid-analogy"
      kicker="Grid & Utility Computing"
      lesson={lesson}
      everyday={{
        label: "One shipping company's trucks",
        scene: () => (
          <>
            {[0, 1, 2].map((i) => (
              <At key={i} x={18} y={18 + i * 84}>
                <div className="flex items-center gap-2">
                  <Idling cfg={TENANTS[i]} scale={0.3} crop={FACE} seed={50 + i} />
                  <Parcel w={30} tone={tones[i]} />
                  <Label size={12} tone="warn">{weights[i]}</Label>
                </div>
              </At>
            ))}
            <At x={210} y={70}><Truck w={240} parcels={tones} /></At>
            <At x={250} y={200}><WeighScale w={64} value={0.6} /></At>
            <At x={324} y={218}><Label size={13}>pay by weight</Label></At>
          </>
        ),
      }}
      cloud={{
        label: 'Grid and utility computing',
        scene: () => (
          <>
            {[0, 1, 2].map((i) => (
              <At key={i} x={22} y={20 + i * 86}>
                <div className="flex items-center gap-2">
                  <Desktop w={70} lit />
                  <span className="block h-[16px] w-[16px] rounded" style={{ background: tones[i] }} />
                </div>
              </At>
            ))}
            <At x={196} y={70}><CloudShape w={150} /></At>
            <At x={218} y={170}><Label tone="brand" size={13}>pooled processing power</Label></At>
            <At x={372} y={58}><MeterDial w={80} value={0.55} spin={!STILL} /></At>
            <At x={344} y={146}><Label size={13}>metered billing</Label></At>
            <Arrow x1={118} y1={50} x2={196} y2={100} />
            <Arrow x1={118} y1={136} x2={196} y2={120} />
            <Arrow x1={118} y1={222} x2={196} y2={140} />
          </>
        ),
      }}
      claim="Pool the load, pay your share"
    />
  )
}

/** On-demand self-service: an ATM. */
export function AtmAnalogy({ lesson }: { lesson: string }) {
  const tick = useTicker(true, 1500, 2)
  const phase = tick % 3
  return (
    <AnalogyScene
      id="self-service-analogy"
      kicker="On-Demand Self-Service"
      lesson={lesson}
      alt="A bank ATM set into a wall, its keypad and card slot lit"
      everyday={{
        label: 'An ATM',
        scene: () => (
          <>
            <At x={40} y={40}><Atm w={130} card={phase >= 1} cash={phase >= 2} screen={phase >= 1 ? colors.brand : colors.surface2} /></At>
            <At x={176} y={70}><Idling cfg={MEERA} scale={0.48} seed={7} /></At>
            <At x={300} y={60}>
              <div className="flex flex-col items-center gap-2 opacity-60">
                <Counter w={130} />
                <Label tone="muted" size={12}>no queue, no clerk</Label>
              </div>
            </At>
            <At x={40} y={244} w={140}>
              <div className="flex justify-center">
                <Label tone={phase >= 2 ? 'good' : 'brand'} size={13}>{phase === 0 ? 'card in' : phase === 1 ? 'PIN' : 'cash out'}</Label>
              </div>
            </At>
          </>
        ),
      }}
      cloud={{
        label: 'On-demand self-service',
        scene: () => (
          <>
            <At x={30} y={60}><Laptop w={170} glow={phase >= 1} /></At>
            <At x={70} y={92}><Label tone={phase >= 1 ? 'dark' : 'plain'} size={12}>Launch Instance</Label></At>
            <At x={230} y={64}><Idling cfg={MEERA} scale={0.44} seed={8} /></At>
            <At x={340} y={70} w={110}>
              <div className="flex flex-col items-center gap-2">
                {[0, 1, 2].map((i) => (
                  <Fade key={i} on={phase >= 2 || STILL} delay={i * 120}>
                    <ServerUnit w={90} />
                  </Fade>
                ))}
                <Label tone="good" size={12}>ready</Label>
              </div>
            </At>
            <At x={40} y={234}><Label tone="muted" size={13}>Nobody to ask first</Label></At>
          </>
        ),
      }}
      claim="Nobody to ask first"
    />
  )
}

/** Pooling and multi-tenancy: a hostel mess kitchen. */
export function MessAnalogy({ lesson }: { lesson: string }) {
  const tick = useTicker(true, 1300, 3)
  const served = tick % 4
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
            <At x={175} y={4} cx><Posed cfg={BAKER} props scale={0.42} expression="happy" gesture="presentRight" amplitude={0.5} at={1.0} /></At>
            <At x={20} y={140}><MessCounter w={300} served={served} /></At>
            {[0, 1, 2].map((i) => (
              <At key={i} x={352} y={18 + i * 86}>
                <div className="flex items-center gap-2">
                  <Idling cfg={TENANTS[i]} scale={0.28} crop={FACE} seed={60 + i} />
                  <Plate w={44} portions={i < served ? 3 : 0} />
                </div>
              </At>
            ))}
            <At x={24} y={250}>
              <div className="flex items-center gap-2 opacity-60">
                <Stove w={40} />
                <Label tone="muted" size={12}>no stove per student</Label>
              </div>
            </At>
          </>
        ),
      }}
      cloud={{
        label: 'Resource pooling',
        scene: () => (
          <>
            <At x={40} y={20}><Rack w={120} units={['run', 'run', 'run', 'run', 'run', 'idle']} /></At>
            <At x={40} y={272 - 22}><Label size={12}>one shared pool</Label></At>
            {[0, 1, 2].map((i) => (
              <At key={i} x={210} y={30 + i * 84}>
                <div className="flex items-center gap-3">
                  <Idling cfg={TENANTS[i]} scale={0.28} crop={FACE} seed={70 + i} />
                  <div className="flex gap-1">
                    {Array.from({ length: i + 1 }, (_, k) => (
                      <Fade key={k} on={i < served || STILL} delay={k * 100}>
                        <ServerUnit w={52} />
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
  const tick = useTicker(true, 1100, 2)
  const stretch = [0, 0.5, 1, 0.5][tick % 4]
  const count = [2, 4, 6, 4][tick % 4]
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
            <At x={235} y={90} cx><RubberBand w={420} stretch={stretch} /></At>
            <At x={235} y={232} cx>
              <Label tone={stretch > 0.7 ? 'warn' : stretch > 0 ? 'brand' : 'good'} size={13}>{stretch > 0.7 ? 'stretched under load' : stretch > 0 ? 'stretching' : 'at rest'}</Label>
            </At>
          </>
        ),
      }}
      cloud={{
        label: 'Rapid elasticity',
        scene: () => (
          <>
            <At x={235} y={40} cx w={420}>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {Array.from({ length: 6 }, (_, i) => (
                  <Fade key={i} on={i < count} lift={6}>
                    <ServerUnit w={110} />
                  </Fade>
                ))}
              </div>
            </At>
            <At x={235} y={232} cx>
              <Label tone="brand" size={13}>{`${count} instances`}</Label>
            </At>
          </>
        ),
      }}
      claim="Stretch, then spring back"
    />
  )
}

/** Measured service: a household electricity meter. The room switches the appliances. */
export function MeterAnalogy({ lesson }: { lesson: string }) {
  const [on, setOn] = useState<[boolean, boolean, boolean]>([true, true, false])
  const live = on.filter(Boolean).length
  const flip = (i: number) => setOn((v) => v.map((x, k) => (k === i ? !x : x)) as [boolean, boolean, boolean])
  return (
    <AnalogyScene
      id="measured-analogy"
      kicker="Measured Service"
      lesson={lesson}
      everyday={{
        label: 'A household electricity meter',
        scene: () => (
          <>
            <At x={20} y={20}><House w={120} /></At>
            <At x={40} y={150}><Fan w={52} on={on[0]} /></At>
            <At x={108} y={156}><Bulb w={38} on={on[1]} /></At>
            <At x={160} y={170}><div style={{ opacity: on[2] ? 1 : 0.45 }}><Fridge w={36} /></div></At>
            <At x={230} y={30}><MeterDial w={120} value={live / 3} spin={live > 0 && !STILL} /></At>
            <At x={370} y={40}><Bill w={74} rows={live} /></At>
            <At x={236} y={170} w={220}><span className="block text-center text-[14px] font-semibold" style={{ color: colors.ink }}>{live === 0 ? 'nothing on, the meter rests' : `${live} on, the meter turns`}</span></At>
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
                  <ServerUnit key={i} w={140} state={x ? 'run' : 'off'} />
                ))}
              </div>
            </At>
            <At x={230} y={30}><MeterDial w={120} value={live / 3} spin={live > 0 && !STILL} /></At>
            <At x={370} y={40}><Bill w={74} rows={live} /></At>
            <At x={236} y={170} w={220}><span className="block text-center text-[14px] font-semibold" style={{ color: colors.ink }}>{live === 0 ? 'no usage, no charge' : `${live} running, ${live} billed`}</span></At>
          </>
        ),
      }}
      controls={(b) => (
        <div className="flex items-center gap-2" style={{ opacity: b >= 1 ? 1 : 0 }}>
          <span className="text-[14px] font-semibold" style={{ color: colors.ink }}>Switch</span>
          <Control on={on[0]} onClick={() => flip(0)}>fan</Control>
          <Control on={on[1]} onClick={() => flip(1)}>light</Control>
          <Control on={on[2]} onClick={() => flip(2)}>fridge</Control>
        </div>
      )}
      claim="Billed for what was used"
    />
  )
}

/** Cost model shift: renting a taxi. */
export function TaxiAnalogy({ lesson }: { lesson: string }) {
  const tick = useTicker(true, 900, 4)
  const fare = (tick % 6) + 1
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
            <At x={20} y={26}><Taxi w={220} meterOn /></At>
            <At x={60} y={130}><Label tone="good" size={13}>{`meter: trip ${fare} of 6`}</Label></At>
            <At x={270} y={12}><Idling cfg={MEERA} scale={0.4} crop={BUST} seed={9} /></At>
            <At x={24} y={178}>
              <div className="flex items-center gap-3 opacity-70">
                <ParkedCar w={150} />
                <div className="flex flex-col gap-1">
                  <Label tone="muted" size={12}>owned car, idle most days</Label>
                  <Label tone="warn" size={12}>loan, insurance, upkeep</Label>
                </div>
              </div>
            </At>
          </>
        ),
      }}
      cloud={{
        label: 'OpEx cloud billing',
        scene: () => (
          <>
            <At x={30} y={30} w={410}>
              <div className="flex items-end justify-between" style={{ height: 150 }}>
                {[3, 6, 2, 8, 4, 5].map((v, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-[44px] rounded-t-md" style={{ height: v * 15, background: i + 1 <= fare ? colors.brand : colors.surface2, transition: 'height 400ms' }} />
                    <span className="text-[14px]" style={{ color: colors.ink }}>{`trip ${i + 1}`}</span>
                  </div>
                ))}
              </div>
            </At>
            <At x={30} y={214}><Label tone="brand" size={13}>pay per use, nothing between trips</Label></At>
          </>
        ),
      }}
      claim="Pay for the trip, not the car"
    />
  )
}

/** Vendor lock-in: a landlord's fitted cupboards. */
export function CupboardAnalogy({ lesson }: { lesson: string }) {
  return (
    <AnalogyScene
      id="lock-in-analogy"
      kicker="Vendor Lock-In"
      lesson={lesson}
      alt="Cupboards fitted along a kitchen wall, each drawer labelled"
      everyday={{
        label: "A landlord's fitted cupboards",
        scene: (b) => (
          <>
            <At x={14} y={14}><Wall w={300} h={262} /></At>
            <At x={30} y={60}><Cupboards w={268} labels={b >= 2} /></At>
            <At x={30} y={26}><Label size={12} tone="warn">fitted to this wall</Label></At>
            <At x={330} y={60}><Idling cfg={MEERA} scale={0.46} seed={11} expression="worried" /></At>
            <At x={336} y={226}><Bag w={40} /></At>
            <At x={330} y={20}><Label size={12} tone="muted">moving out</Label></At>
          </>
        ),
      }}
      cloud={{
        label: 'Vendor lock-in',
        scene: () => (
          <>
            <At x={20} y={24} w={250}>
              <div className="rounded-2xl p-3" style={{ background: colors.surface2, boxShadow: `inset 0 0 0 2px ${colors.brand}` }}>
                <span className="block font-heading text-[14px] font-semibold" style={{ color: colors.brandDark }}>One provider</span>
                <div className="mt-2 rounded-xl bg-white p-2.5" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
                  <span className="block text-[14px] font-semibold" style={{ color: colors.ink }}>Your application</span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Label tone="brand" size={12} mono>Lambda triggers</Label>
                    <Label tone="brand" size={12} mono>DynamoDB APIs</Label>
                  </div>
                </div>
              </div>
            </At>
            <At x={300} y={70}><Padlock w={34} /></At>
            <At x={350} y={60} w={100}>
              <div className="grid h-[70px] place-items-center rounded-xl text-center text-[14px] font-semibold" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}`, background: colors.white, color: colors.ink }}>
                Other providers
              </div>
            </At>
            <At x={30} y={210}><Label tone="warn" size={13}>built from one provider's parts</Label></At>
          </>
        ),
      }}
      claim="Fitted things do not move"
    />
  )
}

/** Cost overruns: roaming left switched on. */
export function RoamingAnalogy({ lesson }: { lesson: string }) {
  const tick = useTicker(true, 700, 5)
  const n = (tick % 7) + 1
  const bars = (tone: string) => (
    <div className="flex items-end gap-1.5" style={{ height: 130 }}>
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} className="w-[22px] rounded-t-md" style={{ height: 14 + i * i * 2.2, background: i < n ? (i >= 5 ? colors.danger : tone) : colors.surface2, transition: 'background-color 300ms' }} />
      ))}
    </div>
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
            <At x={30} y={30}><RoamingPhone w={84} on /></At>
            <At x={22} y={218}><Label tone="warn" size={13}>roaming: on</Label></At>
            <At x={140} y={24}><Moon w={36} /></At>
            <At x={200} y={60}>{bars(colors.warning)}</At>
            <At x={200} y={208}><Label tone="bad" size={13}>charges grow overnight</Label></At>
          </>
        ),
      }}
      cloud={{
        label: 'Cost overruns',
        scene: () => (
          <>
            <At x={30} y={60} w={130}>
              <div className="flex flex-col items-center gap-2">
                <ServerUnit w={120} state="run" />
                <Label tone="warn" size={12}>forgotten, still running</Label>
              </div>
            </At>
            <At x={200} y={60}>{bars(colors.brand)}</At>
            <At x={200} y={208}><Label tone="bad" size={13}>billing until the invoice</Label></At>
          </>
        ),
      }}
      claim="Left on, still charging"
    />
  )
}

