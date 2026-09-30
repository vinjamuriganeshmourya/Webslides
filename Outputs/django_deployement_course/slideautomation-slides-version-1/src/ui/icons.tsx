/**
 * THE HOUSE ICON SET — one family, from one open-source library.
 *
 * WHY THIS FILE STOPPED DRAWING ITS OWN ICONS
 *
 * It used to hand-roll fourteen glyphs (check, cross, arrow, bulb, bolt, info,
 * warning, star, code, play, target, rocket, book, chat) and import the other
 * twenty-four from `lucide-react`. Both halves were nominally the same style,
 * 24-grid and `strokeWidth: 2`, and on a projector they were visibly not: the
 * hand-rolled rocket is one closed path with a dot for a window, the bulb has no
 * filament, the book is two rectangles, and the chat bubble's tail leaves at an
 * angle lucide never uses. On a slide where a lucide `server` sits next to a
 * hand-rolled `code`, the pair reads as two different icon sets.
 *
 * Every name below now resolves to lucide, which is MIT-licensed, drawn on the
 * same 24-grid this set always claimed, and maintained by people who draw icons.
 * The `iconByName` keys are unchanged, so no deck, figure or plan has to be
 * touched: `icon: 'bulb'` still means a lightbulb.
 *
 * Icons inherit `currentColor` from their context and are never coloured
 * directly. An icon that does not clarify what the label already says should be
 * dropped, not chosen more carefully.
 */
import type { SVGProps } from 'react'
import {
  /* the fourteen that used to be hand-rolled */
  Check as LuCheck,
  X as LuX,
  ArrowRight as LuArrowRight,
  Lightbulb,
  Zap,
  Info as LuInfo,
  TriangleAlert,
  Star as LuStar,
  Code as LuCode,
  Play as LuPlay,
  Target as LuTarget,
  Rocket as LuRocket,
  BookOpen,
  MessageSquare,
  /* the picks that were always lucide */
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
  /* added by this design pass, for the figures that name real things */
  AppWindow,
  Container,
  Package,
  Layers,
  Laptop,
  Users,
} from 'lucide-react'

type P = SVGProps<SVGSVGElement>

/*
  NAMED EXPORTS, KEPT AS ALIASES.

  `AnalogyMap` imports `ArrowRight` from this module by name, and `src/ui/index.ts`
  re-exports the whole module as `Icons`. Aliasing rather than deleting keeps both
  working, and keeps the option of swapping any single glyph out again without
  hunting for its call sites.
*/
export const Check = (p: P) => <LuCheck {...p} />
/** The counterpart to `check`. `StatusList` needs a glyph for a row that FAILS,
 *  and the warning triangle already means "careful", not "broken". */
export const Cross = (p: P) => <LuX {...p} />
export const ArrowRight = (p: P) => <LuArrowRight {...p} />
export const Bulb = (p: P) => <Lightbulb {...p} />
export const Bolt = (p: P) => <Zap {...p} />
export const Info = (p: P) => <LuInfo {...p} />
export const Warning = (p: P) => <TriangleAlert {...p} />
export const Star = (p: P) => <LuStar {...p} />
export const Code = (p: P) => <LuCode {...p} />
export const Play = (p: P) => <LuPlay {...p} />
export const Target = (p: P) => <LuTarget {...p} />
export const Rocket = (p: P) => <LuRocket {...p} />
export const Book = (p: P) => <BookOpen {...p} />
export const Chat = (p: P) => <MessageSquare {...p} />

export const iconByName = {
  check: Check,
  cross: Cross,
  arrow: ArrowRight,
  bulb: Bulb,
  bolt: Bolt,
  info: Info,
  warning: Warning,
  star: Star,
  code: Code,
  play: Play,
  target: Target,
  rocket: Rocket,
  book: Book,
  chat: Chat,
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
  /*
    ADDED BY THE DESIGN PASS.

    `browser` is the one this deck was missing and faking: `MachineBoundary` drew
    a browser with `devices` (a monitor with a phone in front of it), which is
    the icon for "responsive", not for "a browser". `AppWindow` is a window with
    a title bar, which is what a browser looks like.

    `container`, `package` and `layers` are here because this session's whole
    vocabulary is sealed units and stacks, and `laptop` because "the other
    machine" is a laptop in every story the deck tells.
  */
  browser: AppWindow,
  /* "Other people", which this deck needs on the two-questions slide and had
     been drawing with `globe`. R1 forbids a globe in this session: it is the
     picture of Problem 2, which is named and never opened here. */
  users: Users,
  container: Container,
  package: Package,
  layers: Layers,
  laptop: Laptop,
}
export type IconName = keyof typeof iconByName
