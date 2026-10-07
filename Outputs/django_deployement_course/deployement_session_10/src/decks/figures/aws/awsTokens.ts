/**
 * AWS's own architecture-diagram conventions, as constants.
 *
 * Every value here was read out of the official AWS Architecture Icons package,
 * release 07312026, and not copied from a blog post. The full write-up lives in
 * `slide-kit/assets/aws/README.md`.
 *
 * The one thing to understand before using these: **line style carries
 * meaning.** A Region and an Availability Zone are dashed, because they are
 * places. A VPC and a subnet are solid, because they are network boundaries
 * with addresses. Getting that backwards makes a diagram that looks right to a
 * beginner and wrong to anyone who works with AWS.
 */

export type GroupKind =
  | 'cloud'
  | 'region'
  | 'availabilityZone'
  | 'vpc'
  | 'publicSubnet'
  | 'privateSubnet'
  | 'dataCentre'
  | 'instanceContents'

interface GroupStyle {
  /** The border colour AWS assigns this group. */
  colour: string
  /** Dashed means logical, solid means a boundary you can point at. */
  dashed: boolean
  /** The 32px mark that sits in the top-left corner, or null where AWS ships none. */
  icon: string | null
  /** A very light wash, so nested groups stay readable on a projector. */
  tint: string
}

export const GROUP: Record<GroupKind, GroupStyle> = {
  cloud: { colour: '#242F3E', dashed: false, icon: 'group/aws-cloud.svg', tint: 'rgba(36,47,62,0.03)' },
  region: { colour: '#00A4A6', dashed: true, icon: 'group/region.svg', tint: 'rgba(0,164,166,0.04)' },
  availabilityZone: { colour: '#00A4A6', dashed: true, icon: null, tint: 'transparent' },
  vpc: { colour: '#8C4FFF', dashed: false, icon: 'group/virtual-private-cloud-vpc.svg', tint: 'rgba(140,79,255,0.04)' },
  publicSubnet: { colour: '#7AA116', dashed: false, icon: 'group/public-subnet.svg', tint: 'rgba(122,161,22,0.06)' },
  privateSubnet: { colour: '#00A4A6', dashed: false, icon: 'group/private-subnet.svg', tint: 'rgba(0,164,166,0.06)' },
  dataCentre: { colour: '#7D8998', dashed: false, icon: 'group/corporate-data-center.svg', tint: 'transparent' },
  instanceContents: { colour: '#7D8998', dashed: false, icon: 'group/ec2-instance-contents.svg', tint: 'transparent' },
}

/** AWS's service-category colours, for labels that should match their icon. */
export const CATEGORY = {
  compute: '#ED7100',
  containers: '#ED7100',
  networking: '#8C4FFF',
  storage: '#7AA116',
  security: '#DD344C',
  database: '#C925D1',
  management: '#E7157B',
} as const

/** Everything not yet built is drawn in this, dashed and quiet. */
export const PENDING = '#94A3B8'
/** Whatever this step is adding gets the deck's own brand blue, not an AWS colour. */
export const ADDING = '#2563EB'
