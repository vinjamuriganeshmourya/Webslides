import type { ReactNode } from 'react'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import { iconByName } from './icons'
import { colors } from '@/design/tokens'

/**
 * A project folder, drawn.
 *
 * WHY THIS EXISTS. Session 2 asks the learner to create four files, and a slide
 * that shows a file's *contents* never says where the file goes. "Create a file
 * called Dockerfile" is not an instruction until it says which folder, and
 * "capital D, no extension" only makes sense next to the other names in the same
 * folder. This figure is the answer to "where does this go", and it appears
 * every time a new file is introduced so the room watches the project fill up.
 *
 * `state` is what makes it teach rather than decorate:
 *
 *   `new`      the file this slide is asking them to create (brand, tagged)
 *   `existing` already there from an earlier slide (quiet grey)
 *   `later`    named but not created yet (dashed ghost)
 *
 * Rows reveal on entry, never on a click: the tree is the visual half of a
 * text-and-visual pair, and those arrive together.
 */

export type FileState = 'new' | 'existing' | 'later'

export interface FileEntry {
  name: string
  /** Small right-aligned annotation, e.g. what the file is for. */
  note?: ReactNode
  state?: FileState
  /** Renders the folder glyph instead of the file glyph. */
  folder?: boolean
  /**
   * Indent level, 0 by default.
   *
   * Needed because the session's demo folder is a sibling of the learner's real
   * `backend` and `frontend` folders, and "where does this go" is only answered
   * by showing it next to them.
   */
  depth?: number
}

const STATE: Record<FileState, { bg: string; border: string; text: string; dashed?: boolean }> = {
  new: { bg: '#EAF1FF', border: colors.brand, text: colors.brandDark },
  existing: { bg: '#FFFFFF', border: colors.line, text: colors.body },
  later: { bg: 'transparent', border: colors.line, text: colors.muted, dashed: true },
}

export function FileTree({
  root,
  entries,
  caption,
  width,
  className = '',
}: {
  /** The folder path, shown in the header row. */
  root: string
  entries: FileEntry[]
  caption?: ReactNode
  width?: number
  className?: string
}) {
  const Folder = iconByName.folder
  const File = iconByName.file
  return (
    <div className={className} style={width ? { width } : undefined}>
      <RevealGroup className="block" stagger={0.08}>
        <Reveal dir="up">
          <div
            className="flex items-center gap-2.5 rounded-t-card border-2 border-b-0 px-4 py-2.5"
            style={{ borderColor: colors.line, background: '#F1F5F9' }}
          >
            <Folder width={18} height={18} style={{ color: colors.body }} />
            <span className="font-mono text-body-sm font-semibold" style={{ color: colors.ink }}>
              {root}
            </span>
          </div>
        </Reveal>

        {entries.map((e, i) => {
          const s = STATE[e.state ?? 'existing']
          const Glyph = e.folder ? Folder : File
          const last = i === entries.length - 1
          return (
            <Reveal dir="up" key={i}>
              <div
                className={`flex items-center gap-2.5 border-2 border-t-0 px-4 py-2.5 ${
                  last ? 'rounded-b-card' : ''
                }`}
                style={{
                  /* The vertical borders stay solid even on a `later` row: a
                     dashed box inside a solid stack reads as a broken frame, so
                     only the row's own fill and text carry the ghosting. */
                  borderColor: colors.line,
                  background: s.bg,
                  borderLeftColor: s.dashed ? colors.line : s.border,
                  borderLeftWidth: 4,
                }}
              >
                {e.depth ? <span style={{ width: e.depth * 22 }} aria-hidden /> : null}
                <Glyph width={17} height={17} style={{ color: s.text, opacity: 0.75 }} />
                <span
                  className="font-mono text-body-sm font-semibold"
                  style={{ color: s.text, fontStyle: s.dashed ? 'italic' : undefined }}
                >
                  {e.name}
                </span>
                {e.note && (
                  <span className="ml-auto text-xs" style={{ color: colors.muted }}>
                    {e.note}
                  </span>
                )}
                {/* Tag only the top-level new entry. When a new folder carries new
                    files, tagging all three repeats one instruction three times
                    and the eye stops reading the tag at all. The children stay
                    brand-coloured, which is enough to group them. */}
                {e.state === 'new' && !e.depth && (
                  <span
                    className="ml-auto rounded-pill px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white"
                    style={{ background: colors.brand }}
                  >
                    create this
                  </span>
                )}
              </div>
            </Reveal>
          )
        })}
      </RevealGroup>
      {caption && (
        <p className="mt-2.5 text-center text-body-sm leading-snug text-body">{caption}</p>
      )}
    </div>
  )
}
