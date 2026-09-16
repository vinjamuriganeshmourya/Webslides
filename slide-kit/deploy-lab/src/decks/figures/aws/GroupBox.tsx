import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { AwsIcon } from './AwsIcon'
import { GROUP, PENDING, ADDING, type GroupKind } from './awsTokens'

/**
 * An AWS group border: the AWS Cloud, a Region, a VPC, a subnet.
 *
 * The border colour and whether it is dashed both come from AWS and are not
 * decoration, so they are looked up rather than passed in. What a caller
 * chooses is the STATE:
 *
 *   'pending'  this does not exist yet. Grey and dashed, whatever AWS says.
 *   'adding'   this is what the current step creates. Brand blue, thicker.
 *   'built'    it exists and is not the subject. AWS's own colour, quiet.
 *
 * A group that is `pending` deliberately overrides AWS's colours. The room is
 * being told "not yet", and that reads faster than a correct-but-quiet purple.
 */
export type GroupState = 'pending' | 'adding' | 'built'

export function GroupBox({
  kind,
  label,
  sub,
  state = 'built',
  delay = 0,
  className = '',
  children,
}: {
  kind: GroupKind
  label: string
  sub?: string
  state?: GroupState
  delay?: number
  className?: string
  children?: ReactNode
}) {
  const instant = useInstant()
  const style = GROUP[kind]

  const colour = state === 'pending' ? PENDING : state === 'adding' ? ADDING : style.colour
  const dashed = state === 'pending' ? true : style.dashed
  const width = state === 'adding' ? 3 : 2

  return (
    <motion.div
      initial={instant ? false : { opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={instant ? { duration: 0 } : { duration: 0.52, delay, ease: [0.22, 0.61, 0.36, 1] }}
      className={`relative rounded-xl ${className}`}
      style={{
        border: `${width}px ${dashed ? 'dashed' : 'solid'} ${colour}`,
        background: state === 'pending' ? 'transparent' : style.tint,
      }}
    >
      <div className="flex items-center gap-2 px-3 pt-2.5">
        {style.icon && (
          <span style={{ opacity: state === 'pending' ? 0.45 : 1 }}>
            <AwsIcon kind="group" name={style.icon.replace('group/', '').replace('.svg', '')} size={22} title="" />
          </span>
        )}
        <span className="font-heading text-[15px] font-bold leading-tight" style={{ color: colour }}>
          {label}
        </span>
        {sub && (
          <span className="text-[13px] leading-tight" style={{ color: state === 'pending' ? PENDING : '#64748B' }}>
            {sub}
          </span>
        )}
      </div>
      {children}
    </motion.div>
  )
}
