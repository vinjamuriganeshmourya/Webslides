/**
 * One official AWS icon, at the size AWS intended it to be used.
 *
 * AWS ships three kinds and they are NOT interchangeable, which is the single
 * most common mistake in a hand-drawn AWS diagram:
 *
 *   service   64px, a filled square in the category colour, white glyph.
 *             Use for the SERVICE: EC2, VPC, S3.
 *   resource  48px, line art, no square.
 *             Use for ONE THING of that kind: an instance, an Elastic IP.
 *   group     32px, the mark that sits in a group border's corner.
 *
 * Two EC2 instances inside a subnet are two RESOURCE icons. Drawing them as
 * two orange squares says "two copies of the EC2 service", which is not a
 * thing. See `slide-kit/assets/aws/README.md`.
 */
export type AwsIconKind = 'service' | 'resource' | 'group'

const NATIVE: Record<AwsIconKind, number> = { service: 64, resource: 48, group: 32 }

export function AwsIcon({
  kind,
  name,
  size,
  title,
  className = '',
}: {
  kind: AwsIconKind
  /** File name without the extension, as it sits in `public/assets/aws/<kind>/`. */
  name: string
  /** Defaults to the size AWS drew it at. Scale up sparingly: these are vectors, but the glyphs are tuned for their native size. */
  size?: number
  /** Read out by screen readers, and the reason none of these are decorative. */
  title: string
  className?: string
}) {
  const px = size ?? NATIVE[kind]
  return (
    <img
      src={`/assets/aws/${kind}/${name}.svg`}
      width={px}
      height={px}
      alt={title}
      className={className}
      style={{ width: px, height: px, display: 'block' }}
    />
  )
}
