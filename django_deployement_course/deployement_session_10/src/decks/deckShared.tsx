/**
 * THE ONE CANONICAL BLOCK OF VALUES for session 10.
 *
 * Every slide and every session figure reads from here, so the deck and the
 * screenshots behind it cannot drift. User instruction, 2026-09-16: the
 * addresses, ports and security group names on a slide must be the ones in the
 * captures.
 *
 * EVERY VALUE HERE WAS MEASURED during the real run on 2026-09-16. The capture
 * that proves each one is named in
 * `django_deployement_course/workflow/captures/session-10/MANIFEST.md`.
 * If you are tempted to change one, change the capture first.
 */

export const SESSION = 'Deploying Your App on AWS'
export const COURSE = 'React + Django Integration · Deployment'

/* The seven concepts. Key Takeaways restates exactly these, hard rule 20. */
export const C1 = 'Logging In'
export const C2 = 'Docker on the Server'
export const C3 = 'Running the Stack'
export const C4 = 'Security Groups'
export const C5 = 'A Permanent Address'
export const C6 = 'Shipping a Fix'
export const C7 = 'Jenkins on AWS'

export const CLOSING_KICKER = 'Before You Leave'

/* ---- where everything lives ------------------------------------------- */

export const REGION_NAME = 'Asia Pacific (Mumbai)'
export const REGION_CODE = 'ap-south-1'
export const ZONE = 'ap-south-1b'
export const VPC_ID = 'vpc-0292256715a0e0ab2'
export const VPC_CIDR = '172.31.0.0/16'
export const SUBNET_ID = 'subnet-0b52b9ce32d8053c0'

/* ---- the application server -------------------------------------------- */

export const APP_NAME = 'nxttrendz-server'
export const APP_INSTANCE_ID = 'i-06031b2ad99f0b796'
export const APP_PRIVATE_IP = '172.31.7.32'
export const APP_HOSTNAME = 'ip-172-31-7-32'
export const APP_DISK = '8 GiB'
export const APP_SG_NAME = 'nxttrendz-sg'
export const APP_SG_ID = 'sg-03340990eb18a3456'

/* ---- the build server --------------------------------------------------- */

export const JENKINS_NAME = 'nxttrendz-jenkins'
export const JENKINS_INSTANCE_ID = 'i-0c96a9a3b4803cefc'
export const JENKINS_IP = '3.108.220.155'
export const JENKINS_PRIVATE_IP = '172.31.15.67'
export const JENKINS_DISK = '20 GiB'
export const JENKINS_SWAP = '4 GiB'
export const JENKINS_SG_NAME = 'jenkins-sg'
export const JENKINS_SG_ID = 'sg-0a8dd5bcc3a3e91a8'
export const JOB_NAME = 'nxttrendz-pipeline'
export const JOB_NAME_OLD = 'nxttrendz-build-test'

/* Both instances are the same size. The build server is the one that suffers,
 * which is why JENKINS_SWAP exists and why MEM_* below is on a slide. */
export const INSTANCE_TYPE = 't3.micro'
export const INSTANCE_VCPU = '2 vCPU'
export const INSTANCE_RAM = '1 GiB'
export const DISK_TYPE = 'gp3'
export const AMI_NAME = 'Ubuntu Server 26.04 LTS'
export const AMI_ID = 'ami-01a00762f46d584a1'
export const SSH_USER = 'ubuntu'
export const KEY_NAME = 'nxttrendz-key'
export const KEY_FILE = `${KEY_NAME}.pem`

/* Measured on the build server at idle, before any build ran. Figure
 * `MemoryBar` prints these, so they must stay real. */
export const MEM_TOTAL = '908 MiB'
export const MEM_JENKINS_IDLE = '436 MiB'
export const MEM_FREE = '133 MiB'
export const SWAP_IN_USE = '486 MiB'

/* ---- addresses ---------------------------------------------------------- */

export const ELASTIC_IP = '13.202.184.214'
export const ALLOCATION_ID = 'eipalloc-0947cde9d5ed8fa6a'

/** Every public address this one instance has had, oldest first. Three came
 *  from session 9, the fourth from this session's start. The argument for an
 *  Elastic IP is this list, so it is printed rather than summarised. */
export const ADDRESSES_IN_ORDER = [
  '15.207.88.14',
  '13.203.216.68',
  '65.2.153.167',
  '13.127.157.193',
] as const
export const ADDRESS_ON_START = ADDRESSES_IN_ORDER[3]

/* ---- ports and sources -------------------------------------------------- */

export const PORT_SSH = 22
export const PORT_FRONTEND = 3000
export const PORT_BACKEND = 8000
export const PORT_JENKINS = 8080
export const PORT_DB = 5432

export const MY_IP_CIDR = '49.200.108.250/32'
export const ANYWHERE_CIDR = '0.0.0.0/0'
export const CONNECT_CIDR = '13.233.177.0/29'

/** GitHub publishes these at https://api.github.com/meta under `hooks`.
 *  Read on 2026-09-16. They are why the webhook reaches Jenkins at all. */
export const GITHUB_HOOK_RANGES = [
  '192.30.252.0/22',
  '185.199.108.0/22',
  '140.82.112.0/20',
  '143.55.64.0/20',
] as const
/** The address the hook actually arrived from, visible in the Jenkins hook log.
 *  It sits inside GITHUB_HOOK_RANGES[2], which is the point of the slide. */
export const HOOK_SOURCE_SEEN = '140.82.115.248'

/* ---- the application ---------------------------------------------------- */

export const DOCKER_ID = 'jeevansravanth'
export const IMAGE_BACKEND = `${DOCKER_ID}/nxttrendz-backend`
export const IMAGE_FRONTEND = `${DOCKER_ID}/nxttrendz-frontend`
export const REPO_URL = 'https://github.com/jeevan170902/nxttrendz'
export const PROJECT_DIR = '~/nxttrendz'

/** The four tags the room sees, and what each one meant.
 *  6 is where the session starts, 7 carried the CORS fix and was deployed by
 *  hand, 8 was the first automatic deploy, and 1 is the first build from the
 *  Jenkins that lives on EC2, which is why the number appears to go backwards. */
export const TAG_START = '6'
export const TAG_CORS_FIX = '7'
export const TAG_FIRST_AUTO = '8'
export const TAG_FIRST_FROM_AWS = '1'

export const CRED_DOCKERHUB = 'dockerhub-credentials'
export const CRED_SSH = 'ec2-ssh-key'

/* ---- measurements printed on slides ------------------------------------- */

export const T_8000_OK = '0.073 seconds'
export const T_3000_TIMEOUT = '15 seconds'
export const T_TAG_TO_HUB = '40 seconds'
export const T_BUILD_TOTAL = '2 min 10 sec'
export const T_DEPLOY_STAGE = '17 seconds'

export const AWS_MARK = { src: '/assets/tech/aws.png', alt: 'AWS' }
