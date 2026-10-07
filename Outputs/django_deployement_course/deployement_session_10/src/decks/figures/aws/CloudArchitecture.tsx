import { motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { AwsIcon } from './AwsIcon'
import { GroupBox, type GroupState } from './GroupBox'
import { CATEGORY, PENDING, ADDING } from './awsTokens'

/**
 * The one architecture picture for session 10, drawn with the official AWS
 * icons and AWS's own group-border conventions, and grown one state at a time.
 *
 * WHY THIS IS A COMPONENT AND NOT EIGHT EXPORTED SVGs
 *
 * Eight static files drift: a port changes and seven of them still say the old
 * one. Here every value comes from one place, the reveal is tied to the deck's
 * own stepper so the picture grows as the instructor talks, and `useInstant()`
 * is honoured so a Ctrl+arrow jump lands on the finished frame instead of
 * replaying an animation nobody is watching.
 *
 * THE STATES, in the order the session uses them.
 */
export type ArchState =
  | 'gap' /** nothing inside AWS, and no line reaching it */
  | 'ssh' /** the app instance is up and you can log in */
  | 'containers' /** two containers and the volume, pulled from Docker Hub */
  | 'doors' /** the security group lets users in on 3000 and 8000 */
  | 'elastic' /** the address stops moving */
  | 'jenkins' /** the build server joins, inside the same VPC */
  | 'finished' /** the whole loop, with the only manual step marked */

const ORDER: ArchState[] = ['gap', 'ssh', 'containers', 'doors', 'elastic', 'jenkins', 'finished']
const at = (s: ArchState, min: ArchState) => ORDER.indexOf(s) >= ORDER.indexOf(min)

const W = 1190
const H = 470

const INK = '#0F172A'
const BODY = '#334155'
const MUTED = '#64748B'
const LINE = '#CBD5E1'

/** A plain box for the things that are not AWS: GitHub, Docker Hub, people. */
function OutsideBox({
  x,
  y,
  w,
  h,
  title,
  lines = [],
  logo,
  icon,
  dim = false,
  delay = 0,
}: {
  x: number
  y: number
  w: number
  h: number
  title: string
  lines?: string[]
  logo?: string
  icon?: { kind: 'resource'; name: string }
  dim?: boolean
  delay?: number
}) {
  const instant = useInstant()
  return (
    <motion.div
      initial={instant ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: dim ? 0.45 : 1, y: 0 }}
      transition={instant ? { duration: 0 } : { duration: 0.52, delay, ease: [0.22, 0.61, 0.36, 1] }}
      className="absolute flex flex-col items-center justify-center rounded-xl bg-white"
      style={{ left: x, top: y, width: w, height: h, border: `2px solid ${LINE}` }}
    >
      <div className="flex items-center gap-2">
        {logo && <img src={`/assets/tech/${logo}.png`} alt="" style={{ width: 20, height: 20 }} />}
        {icon && <AwsIcon kind={icon.kind} name={icon.name} size={26} title="" />}
        <span className="font-heading text-[15px] font-bold leading-tight" style={{ color: INK }}>
          {title}
        </span>
      </div>
      {lines.map((l) => (
        <span key={l} className="text-[12px] leading-[17px]" style={{ color: MUTED }}>
          {l}
        </span>
      ))}
    </motion.div>
  )
}

/** One EC2 instance, drawn with AWS's resource icon rather than a plain box. */
function InstanceCard({
  x,
  y,
  w,
  h,
  name,
  spec,
  state,
  delay = 0,
  children,
}: {
  x: number
  y: number
  w: number
  h: number
  name: string
  spec: string[]
  state: GroupState
  delay?: number
  children?: React.ReactNode
}) {
  const instant = useInstant()
  const colour = state === 'pending' ? PENDING : state === 'adding' ? ADDING : CATEGORY.compute
  return (
    <motion.div
      initial={instant ? false : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={instant ? { duration: 0 } : { duration: 0.52, delay, ease: [0.22, 0.61, 0.36, 1] }}
      className="absolute rounded-xl bg-white"
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        border: `${state === 'adding' ? 3 : 2}px ${state === 'pending' ? 'dashed' : 'solid'} ${colour}`,
      }}
    >
      <div className="flex items-center gap-2 px-3 pt-2.5">
        <span style={{ opacity: state === 'pending' ? 0.45 : 1 }}>
          <AwsIcon kind="resource" name="ec2-instance" size={26} title="EC2 instance" />
        </span>
        <span className="font-heading text-[15px] font-bold leading-tight" style={{ color: state === 'pending' ? PENDING : INK }}>
          {name}
        </span>
      </div>
      <div className="px-3 pt-1">
        {spec.map((l) => (
          <div key={l} className="text-[12px] leading-[17px]" style={{ color: state === 'pending' ? PENDING : MUTED }}>
            {l}
          </div>
        ))}
      </div>
      {children}
    </motion.div>
  )
}

/** A container running inside an instance. */
function ContainerPill({ x, y, w, label, port, delay = 0 }: { x: number; y: number; w: number; label: string; port: string; delay?: number }) {
  const instant = useInstant()
  return (
    <motion.div
      initial={instant ? false : { opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={instant ? { duration: 0 } : { duration: 0.45, delay, ease: [0.22, 0.61, 0.36, 1] }}
      className="absolute flex items-center gap-2 rounded-lg bg-white px-2.5 py-1"
      style={{ left: x, top: y, width: w, border: `2px solid ${LINE}` }}
    >
      <img src="/assets/tech/docker.png" alt="" style={{ width: 16, height: 16 }} />
      <span className="text-[13px] font-bold leading-[18px]" style={{ color: INK }}>
        {label}
      </span>
      <span className="ml-auto text-[12px] leading-[18px]" style={{ color: MUTED }}>
        {port}
      </span>
    </motion.div>
  )
}


/** The connectors, drawn once in one SVG so nothing has to guess where a box edge is.
 *  AWS labels an arrow with the port or the protocol, never with prose, so these do too. */
function Wires({ state }: { state: ArchState }) {
  const instant = useInstant()
  const showSsh = at(state, 'ssh')
  const showPull = at(state, 'containers')
  const showUsers = at(state, 'doors')
  const showHook = at(state, 'jenkins')

  const line = (d: string, colour: string, dashed = false, delay = 0, key = '') => (
    <motion.path
      key={key}
      d={d}
      fill="none"
      stroke={colour}
      strokeWidth={2}
      strokeDasharray={dashed ? '6 5' : undefined}
      markerEnd={`url(#arw-${colour.replace('#', '')})`}
      initial={instant ? false : { pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={instant ? { duration: 0 } : { duration: 0.86, delay, ease: [0.22, 0.61, 0.36, 1] }}
    />
  )

  const cap = (x: number, y: number, text: string, colour = MUTED) => (
    <text x={x} y={y} fontSize={12} fill={colour} textAnchor="middle" fontWeight={600}>
      {text}
    </text>
  )

  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <defs>
        {[INK, ADDING, PENDING, CATEGORY.compute].map((c) => (
          <marker key={c} id={`arw-${c.replace('#', '')}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={c} />
          </marker>
        ))}
      </defs>
      {/* developer to GitHub, always true */}
      {line('M76,82 L76,102', INK, false, 0.1, 'dev')}
      {/* the webhook: a long detour to the laptop, until Jenkins moves into AWS */}
      {!showHook && line('M152,133 C210,133 210,52 152,52', PENDING, true, 0.2, 'hook-old')}
      {!showHook && cap(252, 74, 'webhook via ngrok', PENDING)}
      {showHook && line('M152,115 L288,115', ADDING, false, 0.2, 'hook-new')}
      {showHook && cap(220, 104, 'webhook 8080')}
      {/* administering the server */}
      {showSsh && line('M152,44 C230,44 230,210 288,210', INK, false, 0.35, 'ssh')}
      {showSsh && cap(232, 178, 'SSH 22')}
      {/* pulling the images */}
      {showPull && line('M152,223 L288,223', INK, false, 0.5, 'pull')}
      {showPull && cap(220, 214, 'pull')}
      {/* users arriving on the two public ports */}
      {showUsers && line('M152,335 C240,335 240,300 288,300', INK, false, 0.65, 'users')}
      {showUsers && cap(228, 356, '3000 and 8000')}
    </svg>
  )
}

export function CloudArchitecture({ state = 'gap', scale = 1 }: { state?: ArchState; scale?: number }) {
  const instant = useInstant()
  const hasApp = at(state, 'ssh')
  const hasContainers = at(state, 'containers')
  const hasUsers = at(state, 'doors')
  const hasElastic = at(state, 'elastic')
  const hasJenkins = at(state, 'jenkins')

  return (
    <div style={{ width: W * scale, height: H * scale }}>
      <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'top left', position: 'relative' }}>
        <Wires state={state} />

        {/* --- outside AWS ------------------------------------------------ */}
        <OutsideBox
          x={0}
          y={0}
          w={152}
          h={hasJenkins ? 62 : 82}
          title="Developer"
          lines={hasJenkins ? [] : ['Jenkins runs here', 'behind an ngrok tunnel']}
          logo="jenkins"
          dim={hasJenkins}
        />
        <OutsideBox x={0} y={hasJenkins ? 84 : 102} w={152} h={62} title="GitHub" logo="github" delay={0.1} />
        <OutsideBox x={0} y={188} w={152} h={70} title="Docker Hub" lines={['two images']} logo="docker" delay={0.2} />
        {hasUsers && <OutsideBox x={0} y={300} w={152} h={70} title="Users" lines={['anywhere on', 'the internet']} icon={{ kind: 'resource', name: 'users' }} delay={0.3} />}

        {/* --- AWS, three nested groups, AWS's own colours ----------------- */}
        <div style={{ position: 'absolute', left: 292, top: 0 }}>
          <GroupBox kind="region" label="AWS Region" sub="Asia Pacific (Mumbai), ap-south-1" state={hasApp ? 'built' : 'pending'} delay={0.15}>
            <div style={{ position: 'relative', width: 894, height: 412 }}>
              <div style={{ position: 'absolute', left: 14, top: 8, width: 866, height: 392 }}>
                <GroupBox kind="vpc" label="VPC" sub="172.31.0.0/16" state={hasApp ? 'built' : 'pending'} delay={0.25}>
                  <div style={{ position: 'relative', width: 862, height: 352 }}>
                    <div style={{ position: 'absolute', left: 14, top: 8, width: 834, height: 332 }}>
                      <GroupBox kind="publicSubnet" label="Public subnet" sub="ap-south-1b" state={hasApp ? 'built' : 'pending'} delay={0.35}>
                        <div style={{ position: 'relative', width: 830, height: 290 }}>
                          {hasJenkins && (
                            <InstanceCard
                              x={12}
                              y={8}
                              w={400}
                              h={266}
                              name="nxttrendz-jenkins"
                              spec={['t3.micro, 20 GiB gp3', 'jenkins-sg', 'private 172.31.15.67']}
                              state={state === 'jenkins' ? 'adding' : 'built'}
                              delay={0.45}
                            >
                              <div className="absolute" style={{ left: 14, top: 132, width: 372 }}>
                                <div className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5" style={{ border: `2px solid ${LINE}` }}>
                                  <img src="/assets/tech/jenkins.png" alt="" style={{ width: 18, height: 18 }} />
                                  <span className="text-[13px] font-bold" style={{ color: INK }}>
                                    nxttrendz-pipeline
                                  </span>
                                </div>
                                {/* One row, not four: the stages are named on their own slide, and a
                                    four-row list here pushes the card past the subnet it sits in. */}
                                <div className="mt-2 flex items-center gap-1.5">
                                  {['Checkout', 'Build', 'Push', 'Deploy'].map((st, i) => (
                                    <span
                                      key={st}
                                      className="rounded px-1.5 py-0.5 text-[12px] font-bold leading-[16px]"
                                      style={{
                                        color: i === 3 ? '#FFFFFF' : BODY,
                                        background: i === 3 ? ADDING : '#F1F5F9',
                                      }}
                                    >
                                      {st}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div
                                className="absolute flex items-center gap-1.5 rounded-lg bg-white px-2 py-1"
                                style={{ left: 14, top: 206, border: `2px solid ${CATEGORY.compute}` }}
                              >
                                <AwsIcon kind="resource" name="elastic-ip" size={18} title="Elastic IP" />
                                <span className="text-[12px] font-bold leading-[18px]" style={{ color: INK }}>
                                  Elastic IP 3.108.1.66
                                </span>
                              </div>
                            </InstanceCard>
                          )}
                          <InstanceCard
                            x={hasJenkins ? 424 : 154}
                            y={8}
                            w={hasJenkins ? 402 : 520}
                            h={266}
                            name="nxttrendz-server"
                            spec={['t3.micro, 8 GiB gp3', 'nxttrendz-sg', 'private 172.31.7.32']}
                            state={hasApp ? (state === 'ssh' ? 'adding' : 'built') : 'pending'}
                            delay={0.45}
                          >
                            {hasContainers && (
                              <>
                                <ContainerPill x={14} y={96} w={hasJenkins ? 372 : 490} label="backend, Django" port="8000" delay={0.6} />
                                <ContainerPill x={14} y={140} w={hasJenkins ? 372 : 490} label="frontend, React" port="3000" delay={0.72} />
                                <div
                                  className="absolute flex items-center gap-2 rounded-lg px-2.5 py-1"
                                  style={{ left: 14, top: 186, width: hasJenkins ? 372 : 490, border: `2px solid ${CATEGORY.storage}` }}
                                >
                                  <img src="/assets/tech/sqlite.png" alt="" style={{ width: 16, height: 16 }} />
                                  <span className="text-[12px] leading-[18px]" style={{ color: BODY }}>
                                    db_data volume, no port at all
                                  </span>
                                </div>
                              </>
                            )}
                            {hasElastic && (
                              <motion.div
                                initial={instant ? false : { opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={instant ? { duration: 0 } : { duration: 0.5, delay: 0.3 }}
                                className="absolute flex items-center gap-1.5 rounded-lg bg-white px-2 py-1"
                                style={{ left: 14, top: 226, border: `2px solid ${CATEGORY.compute}` }}
                              >
                                <AwsIcon kind="resource" name="elastic-ip" size={18} title="Elastic IP" />
                                <span className="text-[12px] font-bold leading-[18px]" style={{ color: INK }}>
                                  Elastic IP 13.202.184.214
                                </span>
                              </motion.div>
                            )}
                          </InstanceCard>
                        </div>
                      </GroupBox>
                    </div>
                  </div>
                </GroupBox>
              </div>
            </div>
          </GroupBox>
        </div>

        {!hasApp && (
          <div className="absolute" style={{ left: 470, top: 220, width: 560 }}>
            <div className="text-center text-[17px] font-bold" style={{ color: PENDING }}>
              nothing has been set up inside AWS yet
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
