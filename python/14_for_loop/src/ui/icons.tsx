/**
 * Minimal line-icon set (currentColor, 24-grid). Kept tiny and dependency-free.
 */
import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = (p: P) => ({
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...p,
})

export const Check = (p: P) => (
  <svg {...base(p)}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
)
export const Cross = (p: P) => (
  <svg {...base(p)}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)
export const ArrowRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
export const Bulb = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A7 7 0 0 0 12 2Z" />
  </svg>
)
export const Bolt = (p: P) => (
  <svg {...base(p)}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
  </svg>
)
export const Info = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
)
export const Warning = (p: P) => (
  <svg {...base(p)}>
    <path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
)
export const Star = (p: P) => (
  <svg {...base(p)}>
    <path d="m12 2 3 6.5 7 .9-5 4.8 1.3 7L12 18l-6.6 3.2L6.7 14l-5-4.8 7-.9L12 2Z" />
  </svg>
)
export const Code = (p: P) => (
  <svg {...base(p)}>
    <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
  </svg>
)
export const Play = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 4v16l14-8L6 4Z" />
  </svg>
)
/* ---- Added for session 14, each because a wrong glyph was in its place ----
 *
 * The set is drawn here rather than imported, per this file's own note, but the
 * geometry follows `lucide-react` (already a dependency, ISC) so a name means
 * the same picture here as anywhere else in the product.
 */

/** A stopwatch. `Timer` was drawing a PLAY triangle for a countdown, on six
 *  frames: a triangle says "start something", not "time is running out". */
export const Stopwatch = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 13V9M9 2h6M18.5 6.5l1.5-1.5" />
  </svg>
)

/** One trip round, and round again: the picture of a loop. It replaces a play
 *  triangle on "for goes through each item of a sequence, one at a time". */
export const Repeat = (p: P) => (
  <svg {...base(p)}>
    <path d="M17 2l4 4-4 4" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
    <path d="M7 22l-4-4 4-4" />
    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
  </svg>
)

/** A number. It replaces a play triangle on "The input is one number". */
export const Hash = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
  </svg>
)

export const Target = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" />
  </svg>
)
export const Rocket = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 15c-1.5 1-2 4-2 4s3-.5 4-2c.6-.9.5-2-.3-2.7-.8-.8-1.9-.9-2.7-.3ZM9 13l-2-2c1-4 4-8 9-9 0 5-4 8-9 9Z" />
    <path d="M13 7h.01" />
  </svg>
)
export const Book = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 4h13a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V4ZM19 20V6" />
  </svg>
)
export const Chat = (p: P) => (
  <svg {...base(p)}>
    <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2Z" />
  </svg>
)

/* ------------------------------------------------------------------ */
/* lucide-react bridge — curated, tree-shaken picks from the library.  */
/* Same 24-grid stroke style as the hand-rolled set; slide plans can   */
/* reference these by name (e.g. "icon": "shield"). Add more imports   */
/* here as sessions need them — the icon-picker playground             */
/* (workflow/icon-picker.html) is the browsing tool.                   */
/* ------------------------------------------------------------------ */
import {
  Shield,
  ShieldCheck,
  Lock,
  KeyRound,
  Globe,
  Server,
  Database,
  Plug,
  Link as LinkIcon,
  Unlink,
  Settings,
  MonitorSmartphone,
  Network,
  FileJson,
  TerminalSquare,
  Route,
  Eye,
  Plus,
  Pencil,
  Trash2,
  Folder,
  FolderOpen,
  FileText,
  Download,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'

export const iconByName = {
  check: Check,
  // The counterpart to `check`. `StatusList` needs a glyph for a row that
  // FAILS, and the warning triangle already means "careful", not "broken".
  cross: Cross,
  arrow: ArrowRight,
  bulb: Bulb,
  bolt: Bolt,
  info: Info,
  warning: Warning,
  star: Star,
  code: Code,
  play: Play,
  stopwatch: Stopwatch,
  repeat: Repeat,
  hash: Hash,
  target: Target,
  rocket: Rocket,
  book: Book,
  chat: Chat,
  // lucide picks
  shield: Shield,
  'shield-check': ShieldCheck,
  lock: Lock,
  key: KeyRound,
  globe: Globe,
  server: Server,
  database: Database,
  plug: Plug,
  link: LinkIcon,
  unlink: Unlink,
  settings: Settings,
  devices: MonitorSmartphone,
  network: Network,
  json: FileJson,
  terminal: TerminalSquare,
  route: Route,
  eye: Eye,
  plus: Plus,
  pencil: Pencil,
  trash: Trash2,
  // Added for Session 2: the FileTree figure needs a folder and a file glyph,
  // and "download" is the honest picture of `docker pull`.
  folder: Folder,
  'folder-open': FolderOpen,
  file: FileText,
  download: Download,
  // Added for the FileTree redesign: a folder that can be shut needs a glyph
  // that says which way it is. The chevron is the only affordance in the figure,
  // so it is drawn, never implied by indentation alone.
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
}
export type IconName = keyof typeof iconByName
