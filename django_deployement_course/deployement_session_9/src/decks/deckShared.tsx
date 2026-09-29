import type { ReactNode } from 'react'
import type { ShotHighlight } from './figures/AnnotatedShot'

/**
 * SHARED CONSTANTS FOR THE SESSION 9 DECK.
 *
 * Anything two or more slides need lives here, so a change lands once. The deck
 * itself is `awsIntroDeck.tsx` and it is content only.
 *
 * Plan: `../../session_plans/deployement_session_9/plan.md`, rev2, signed off
 * 2026-09-15. Figures: `../../session_plans/deployement_session_9/illustrations.md`.
 * Hard rules 29, 30 and 31 were written because session 8 broke them. Read
 * them before touching a string here.
 */

export const SESSION = 'Introduction to AWS'
export const COURSE = 'React + Django Integration · Deployment'

/**
 * THE FOUR CONCEPTS, DECLARED ONCE, EXACTLY AS PLAN §3 NAMES THEM.
 *
 * Hard rule 20: the Key Takeaways slide carries the agenda's items word for
 * word, so both slides read these constants. Each divider and each per-concept
 * recap reads them too, so the concept is named the same way everywhere.
 */
export const C1 = 'Cloud Basics'
export const C2 = 'AWS and EC2'
export const C3 = 'Launching an Instance'
export const C4 = 'Billing'

/**
 * THE ONE SET OF VALUES THE SESSION USES, DECLARED ONCE.
 *
 * User, 2026-09-16, and it is strict: every name, port, address and Security
 * Group printed in a figure, a table, a caption or a pending capture's `at` and
 * `shows` line must be the SAME value the hands-on screenshot will show, and
 * the walk-through must be exactly the path a student follows. So no slide and
 * no figure writes one of these as a literal: they all read from here, and the
 * capture checklist in the plan (§13) lists the same values for whoever takes
 * the screenshots.
 *
 * The values match session 8's project and TR 11.
 */
export const REGION_NAME = 'Asia Pacific (Mumbai)'
export const REGION_CODE = 'ap-south-1'
/**
 * The Availability Zone the instance actually landed in, and its two siblings.
 *
 * The launch form was left on `No preference`, which is what a student does,
 * and AWS placed the instance in `ap-south-1b`. The deck says so rather than
 * pretending a zone was chosen.
 */
export const ZONE = 'ap-south-1b'
export const ZONES: [string, string, string] = ['ap-south-1a', 'ap-south-1b', 'ap-south-1c']

/** The three names the student TYPES. The captures show these exact strings. */
export const INSTANCE_NAME = 'nxttrendz-server'
export const KEY_NAME = 'nxttrendz-key'
export const SG_NAME = 'nxttrendz-sg'

/** What the student CHOOSES from a list, as the console offered it on the day. */
export const AMI_NAME = 'Ubuntu Server 26.04 LTS'
export const AMI_ID = 'ami-01a00762f46d584a1'
/** The login name baked into that AMI. The console prints it under Username. */
export const SSH_USER = 'ubuntu'
export const INSTANCE_TYPE = 't3.micro'
export const INSTANCE_PRICE = 'USD 0.0112 per hour'
export const DISK_SIZE = '8 GiB'
export const DISK_TYPE = 'gp3'

/** The file AWS hands back once, the moment the key pair is created. */
export const KEY_FILE = `${KEY_NAME}.pem`

/** What AWS created, read off the captures in `public/shots/`. */
export const INSTANCE_ID = 'i-06031b2ad99f0b796'
export const VPC_ID = 'vpc-0292256715a0e0ab2'
export const VPC_CIDR = '172.31.0.0/16'
export const SUBNET_ID = 'subnet-0b52b9ce32d8053c0'
export const SG_ID = 'sg-03340990eb18a3456'
export const DATA_CENTRE = 'Amazon Data Centre, Mumbai'

/**
 * The three ports. 22 is SSH for you, 8000 is the app for your users, and 5432
 * is the one that stays CLOSED: it is never listed in the Security Group, which
 * is how the room sees that an unlisted port is shut (TR 11 §4).
 */
export const PORT_SSH = 22
export const PORT_APP = 8000
export const PORT_DB = 5432
/** The two sources the Security Group was created with. */
export const MY_IP_CIDR = '49.200.108.250/32'
export const ANYWHERE_CIDR = '0.0.0.0/0'
/**
 * The third rule, added after the browser Connect was refused.
 *
 * EC2 Instance Connect runs the browser terminal on AWS's own machines, so it
 * arrives from an AWS address, not the learner's. This is the range it uses in
 * Mumbai, checked on 2026-09-16; every Region has its own, and AWS publishes
 * them all at ip-ranges.amazonaws.com.
 */
export const CONNECT_CIDR = '13.233.177.0/29'
export const IP_RANGES_URL = 'https://ip-ranges.amazonaws.com/ip-ranges.json'

/**
 * THE ADDRESSES, AS THE CONSOLE ASSIGNED THEM ON 2026-09-16.
 *
 * `PUBLIC_IP` is what the instance got at launch; `PUBLIC_IP_RESTARTED` is what
 * it got after a Stop and a Start, which is the whole point of The Address
 * Changed. The private address did not move. Every slide that prints one says
 * AWS assigns it and a student's own will differ.
 */
export const PUBLIC_IP = '15.207.88.14'
export const PUBLIC_IP_RESTARTED = '13.203.216.68'
/** And again after the next Stop and Start. Three public addresses, one instance. */
export const PUBLIC_IP_FINAL = '65.2.153.167'
export const PRIVATE_IP = '172.31.7.32'
/** The instance's own name inside Linux, which IS its private address. */
export const HOSTNAME = 'ip-172-31-7-32'
/** The readable form of the public address, printed on the Connect page. */
export const PUBLIC_DNS = 'ec2-13-203-216-68.ap-south-1.compute.amazonaws.com'

/** The account block (plan slides 3a to 3e) is an errand, not a concept. */
export const ACCOUNT_KICKER = 'Before We Start'

/** Rule 12: a named technology carries its mark. Beside every console caption. */
export const AWS_MARK = { src: '/assets/tech/aws.png', alt: 'AWS' }

/**
 * THE FREE PLAN CREDIT, IN BOTH CURRENCIES (plan D6).
 *
 * USD as the console shows it. The rupee figure is at 95.9 rupees to the
 * dollar, read on 2026-09-15. Re-read on the day if the deck is regenerated.
 */
export const CREDIT_USD = 'USD 100'
export const CREDIT_INR = '₹9,590'

/**
 * REGIONS OF THE TWO FULL-SCREEN CONSOLE CAPTURES, AS PERCENTAGES OF THE IMAGE.
 *
 * Measured on the 1568x741 captures in `public/shots/`, and shared with
 * `slide-kit/shot-lab`, where the annotation layer was designed on these same
 * files. A percentage survives any render width, which is why the numbers are
 * not pixels.
 */
export const HOME_SEARCH: ShotHighlight = { left: 12.4, top: 1.9, width: 40.8, height: 5.1 }
export const HOME_REGION: ShotHighlight = { left: 75.3, top: 2.4, width: 10.8, height: 4.2 }
export const HOME_ACCOUNT: ShotHighlight = { left: 87.3, top: 0.5, width: 11.6, height: 3.6 }
export const SEARCH_BOX: ShotHighlight = { left: 12.4, top: 1.9, width: 40.8, height: 5.1 }
export const SEARCH_SERVICES_TAB: ShotHighlight = { left: 22.4, top: 19.4, width: 4.9, height: 3.6 }
export const SEARCH_EC2_ROW: ShotHighlight = { left: 38.1, top: 17.5, width: 49.4, height: 11.9 }

/** On the 1918x900 signin.aws.amazon.com capture. */
export const SIGNIN_ROOT_USER: ShotHighlight = { left: 26.8, top: 32.9, width: 15.8, height: 8.7 }
export const SIGNIN_EMAIL: ShotHighlight = { left: 26.8, top: 53.5, width: 15.8, height: 6.9 }

/** On the 1568x784 "Complete your account setup" page. */
export const SETUP_COMPLETE_BUTTON: ShotHighlight = { left: 9.4, top: 68.6, width: 22.9, height: 5.7 }
export const SETUP_UPGRADE_BUTTON: ShotHighlight = { left: 9.4, top: 94.6, width: 12, height: 5.2 }

/**
 * HIGHLIGHTS ON THE EIGHTEEN LAUNCH CAPTURES, AS PERCENTAGES OF EACH IMAGE.
 *
 * Measured on the files in `public/shots/` (`ec2-01` to `ec2-07` are 1518x784,
 * `ec2-08` to `ec2-17` are 1568x744, `ec2-18` is 1568x402). Percentages, not
 * pixels, so the frame can be rendered at any width.
 */
export const EC2_MENU_INSTANCES: ShotHighlight = { left: 1.0, top: 27.3, width: 4.6, height: 2.7 }
export const EC2_REGION: ShotHighlight = { left: 79.3, top: 1.2, width: 7.9, height: 3.0 }
export const EC2_LAUNCH_BUTTON: ShotHighlight = { left: 88.0, top: 10.3, width: 8.6, height: 3.6 }
export const EC2_NAME_FIELD: ShotHighlight = { left: 8.3, top: 24.9, width: 36.2, height: 4.3 }
export const EC2_UBUNTU_TILE: ShotHighlight = { left: 18.5, top: 55.2, width: 5.6, height: 13.2 }
export const EC2_AMI_ROW: ShotHighlight = { left: 8.3, top: 72.0, width: 54.2, height: 7.2 }
export const EC2_TYPE_BOX: ShotHighlight = { left: 8.3, top: 60.8, width: 39.8, height: 9.0 }
export const EC2_KEY_NAME_FIELD: ShotHighlight = { left: 35.2, top: 32.7, width: 29.6, height: 4.0 }
export const EC2_KEY_PEM: ShotHighlight = { left: 35.2, top: 54.3, width: 11.2, height: 4.3 }
export const EC2_KEY_CREATE: ShotHighlight = { left: 56.9, top: 76.6, width: 7.9, height: 3.7 }
export const EC2_KEY_SELECTED: ShotHighlight = { left: 8.3, top: 87.3, width: 36.2, height: 4.0 }
export const EC2_NET_VPC: ShotHighlight = { left: 8.2, top: 52.5, width: 11.0, height: 3.0 }
export const EC2_NET_SUBNET: ShotHighlight = { left: 8.2, top: 58.5, width: 20.0, height: 3.0 }
export const EC2_NET_PUBLIC_IP: ShotHighlight = { left: 8.2, top: 64.5, width: 8.0, height: 3.1 }
export const EC2_SG_NAME: ShotHighlight = { left: 8.3, top: 11.1, width: 36.0, height: 4.2 }

/* `ec2-25-security-groups-nav.png`, 1253x342: the EC2 left nav with Security
 * Groups selected, and the orange button that opens the create form. */
export const EC2_NAV_NETWORK_SECURITY: ShotHighlight = { left: 1.3, top: 16.4, width: 13.3, height: 8.2 }
export const EC2_CREATE_SG_BUTTON: ShotHighlight = { left: 84.0, top: 17.0, width: 14.4, height: 7.6 }
export const EC2_SG_RULE_SSH: ShotHighlight = { left: 8.3, top: 31.2, width: 54.5, height: 25.5 }
export const EC2_SG_RULE_APP: ShotHighlight = { left: 8.3, top: 58.2, width: 54.5, height: 24.5 }
export const EC2_SUCCESS: ShotHighlight = { left: 1.5, top: 13.8, width: 32.0, height: 7.0 }
export const EC2_ROW_ID: ShotHighlight = { left: 23.6, top: 25.0, width: 9.2, height: 4.0 }
export const EC2_ROW_STATE: ShotHighlight = { left: 34.0, top: 25.0, width: 6.2, height: 4.0 }
export const EC2_ROW_PUBLIC_IP: ShotHighlight = { left: 77.5, top: 25.0, width: 7.2, height: 4.0 }
export const EC2_ROW_NO_ADDRESS: ShotHighlight = { left: 66.5, top: 25.0, width: 18.2, height: 4.0 }
export const EC2_DETAIL_PUBLIC: ShotHighlight = { left: 42.4, top: 24.0, width: 13.6, height: 3.2 }
export const EC2_DETAIL_PRIVATE: ShotHighlight = { left: 70.2, top: 24.0, width: 9.4, height: 3.2 }
export const EC2_DETAIL_DNS: ShotHighlight = { left: 70.2, top: 30.7, width: 20.6, height: 3.2 }
export const EC2_MENU_STOP: ShotHighlight = { left: 82.7, top: 18.8, width: 12.2, height: 3.5 }
export const EC2_MENU_TERMINATE: ShotHighlight = { left: 82.7, top: 32.1, width: 12.2, height: 3.5 }
export const EC2_STOP_WARNING: ShotHighlight = { left: 36.0, top: 52.3, width: 41.2, height: 9.6 }
export const EC2_STOP_BUTTON: ShotHighlight = { left: 72.8, top: 74.6, width: 4.4, height: 3.9 }
export const EC2_RESTART_ROW_IP: ShotHighlight = { left: 77.5, top: 31.3, width: 7.2, height: 4.0 }
export const EC2_RESTART_PRIVATE: ShotHighlight = { left: 70.2, top: 72.5, width: 9.4, height: 3.2 }
export const EC2_CONNECT_TABS: ShotHighlight = { left: 7.3, top: 37.5, width: 15.4, height: 4.0 }
export const EC2_CONNECT_USERNAME: ShotHighlight = { left: 8.3, top: 79.9, width: 21.4, height: 4.1 }
export const EC2_CONNECT_BUTTON: ShotHighlight = { left: 86.7, top: 88.2, width: 6.0, height: 3.7 }
export const EC2_SSH_TAB: ShotHighlight = { left: 15.4, top: 37.5, width: 7.4, height: 4.0 }
export const EC2_SSH_DNS: ShotHighlight = { left: 37.2, top: 51.6, width: 21.4, height: 3.2 }
export const EC2_SSH_COMMAND: ShotHighlight = { left: 8.3, top: 82.7, width: 39.8, height: 4.8 }
export const EC2_REFUSED: ShotHighlight = { left: 0.6, top: 11.4, width: 50.0, height: 12.7 }
export const EC2_ADD_RULE: ShotHighlight = { left: 8.6, top: 50.7, width: 5.4, height: 3.4 }
export const EC2_NEW_RULE: ShotHighlight = { left: 22.8, top: 41.3, width: 62.5, height: 8.2 }
export const EC2_SAVE_RULES: ShotHighlight = { left: 86.9, top: 62.6, width: 5.8, height: 3.4 }
/**
 * The three inbound rules are three table rows 3.4% apart, which is thinner
 * than a badge: three numbered boxes there collide however they are placed. So
 * the slide draws ONE box around the three, and the rows are read out in the
 * lead and the notes instead.
 */
export const EC2_RULES_TABLE: ShotHighlight = { left: 15.0, top: 62.9, width: 82.5, height: 11.2 }
export const EC2_RULES_COUNT: ShotHighlight = { left: 35.8, top: 35.2, width: 14.4, height: 5.4 }
export const EC2_WELCOME: ShotHighlight = { left: 0.2, top: 9.8, width: 30.0, height: 3.1 }
export const EC2_ENS5: ShotHighlight = { left: 15.6, top: 30.4, width: 17.4, height: 3.0 }
export const EC2_BROWSER_IPS: ShotHighlight = { left: 0.2, top: 91.8, width: 18.6, height: 3.2 }
export const EC2_BROWSER_CMDS: ShotHighlight = { left: 0.2, top: 56.9, width: 28.0, height: 9.8 }

/** On `aws-global-infrastructure.png`, 1600x560, and the two extra EC2 pages. */
export const GLOBAL_SENTENCE: ShotHighlight = { left: 11.8, top: 12.3, width: 48.0, height: 13.6 }
export const EC2_STORAGE_TAB: ShotHighlight = { left: 47.0, top: 76.0, width: 5.6, height: 4.2 }
export const EC2_ROOT_DEVICE: ShotHighlight = { left: 14.7, top: 85.6, width: 62.0, height: 5.4 }
export const EC2_STOPPED_PUBLIC: ShotHighlight = { left: 42.4, top: 22.4, width: 8.2, height: 4.2 }
export const EC2_STOPPED_PRIVATE: ShotHighlight = { left: 70.2, top: 22.4, width: 9.4, height: 4.2 }

/** On the two Billing captures, both 1568x744. */
export const BILL_FREE_PANEL: ShotHighlight = { left: 15.7, top: 33.6, width: 83.0, height: 9.6 }
export const BILL_DATA_UNAVAILABLE: ShotHighlight = { left: 21.8, top: 52.8, width: 39.5, height: 11.6 }
export const BILL_TEMPLATE: ShotHighlight = { left: 16.9, top: 22.5, width: 40.2, height: 8.1 }
export const BILL_ZERO_SPEND: ShotHighlight = { left: 16.9, top: 50.8, width: 40.2, height: 6.4 }
export const BILL_NAME_EMAIL: ShotHighlight = { left: 16.8, top: 75.5, width: 53.5, height: 19.5 }

/*
 * `PendingShot` lived here until 2026-09-16: a dashed frame standing in for a
 * console screen the account could not reach yet. Every one of them has been
 * replaced by a real capture in `public/shots/`, so the component is gone
 * rather than left lying around for someone to reach for. Hard rule 30 has no
 * stand-in: a process slide carries a real screenshot or it is not finished.
 */

export { Scaled } from './figures/Scaled'

/** A company or technology mark with its name beside it (rule 12: the mark supports the label). */
export function MarkRow({ src, alt, children, size = 40 }: { src: string; alt: string; children: ReactNode; size?: number }) {
  return (
    <span className="inline-flex items-center gap-3">
      <img src={src} alt={alt} draggable={false} style={{ height: size, width: 'auto' }} className="select-none" />
      <span>{children}</span>
    </span>
  )
}
