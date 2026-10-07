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

/*
  THE ROW GRID.

  Every row in the tree — the root header included — is laid out from these three
  numbers, so the glyphs, the names and the notes all share one datum. They were
  three separate literals before (`px-4` on the rows, `px-4` on the header, a 4px
  rail on rows against the header's 2px border, and a `depth * 22` spacer sitting
  inside the row gap), and the result was a stack whose left edge moved by two
  pixels at the header and by ten more on any indented row.
*/
/** Left rail width, shared by the header and every row. */
const RAIL_W = 4
/** Horizontal padding inside a row, measured from the rail. */
const ROW_PAD_X = 16
/** One indent step. */
const INDENT = 22

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
          {/*
            ONE LEFT DATUM FOR THE WHOLE TREE.

            The header used to carry a 2px left border while every row below it
            carried a 4px state rail, so the folder path started two pixels left
            of every filename under it and the column of glyphs was visibly out of
            true. The header now carries the same 4px rail (in the neutral line
            colour, since the root folder has no state) and the same `ROW_PAD_X`,
            which is what puts every glyph and every name on one vertical line.
          */}
          <div
            className="flex items-center gap-2.5 rounded-t-card border-2 border-b-0 py-2.5"
            style={{
              borderColor: colors.line,
              borderLeftColor: colors.line,
              borderLeftWidth: RAIL_W,
              paddingLeft: ROW_PAD_X,
              paddingRight: ROW_PAD_X,
              background: '#F1F5F9',
            }}
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
                className={`flex items-center gap-2.5 border-2 border-t-0 py-2.5 ${
                  last ? 'rounded-b-card' : ''
                }`}
                style={{
                  /* The vertical borders stay solid even on a `later` row: a
                     dashed box inside a solid stack reads as a broken frame, so
                     only the row's own fill and text carry the ghosting. */
                  borderColor: colors.line,
                  background: s.bg,
                  borderLeftColor: s.dashed ? colors.line : s.border,
                  borderLeftWidth: RAIL_W,
                  /* The indent is PADDING, not a spacer element. As a spacer it
                     sat inside the row's `gap-2.5`, so an indented row was pushed
                     the indent PLUS one extra gap and no depth landed on a
                     predictable grid. */
                  paddingLeft: ROW_PAD_X + (e.depth ?? 0) * INDENT,
                  paddingRight: ROW_PAD_X,
                }}
              >
                <Glyph
                  width={17}
                  height={17}
                  className="shrink-0"
                  style={{ color: s.text, opacity: 0.75 }}
                />
                {/* A filename never wraps. It is the thing being named, and
                    `docker-demo` broken across two lines beside a long note is
                    not a name any more. The note beside it is prose and gives way
                    instead. */}
                <span
                  className="shrink-0 whitespace-nowrap font-mono text-body-sm font-semibold"
                  style={{ color: s.text, fontStyle: s.dashed ? 'italic' : undefined }}
                >
                  {e.name}
                </span>
                {/*
                  ONE right-hand group, not two `ml-auto` siblings.

                  The note and the "create this" tag both used to claim `ml-auto`.
                  Two auto margins on one flex line SPLIT the free space between
                  them, so on a row carrying both the note stopped being
                  right-aligned and floated somewhere in the middle, out of line
                  with the notes on the rows above and below it. One wrapper takes
                  the auto margin and the two children sit inside it.
                */}
                {(e.note || (e.state === 'new' && !e.depth)) && (
                  <span className="ml-auto flex min-w-0 items-center justify-end gap-2.5 pl-3 text-right">
                    {e.note && (
                      <span
                        className="text-xs"
                        style={{ color: colors.muted }}
                      >
                        {e.note}
                      </span>
                    )}
                    {/* Tag only the top-level new entry. When a new folder carries
                        new files, tagging all three repeats one instruction three
                        times and the eye stops reading the tag at all. The children
                        stay brand-coloured, which is enough to group them. */}
                    {e.state === 'new' && !e.depth && (
                      /*
                        THE TAG'S OWN METRICS, which are not the same problem as
                        the row alignment above.

                        Three things were off. `py-0.5` against an inherited body
                        line-height made the pill taller than its text and sat the
                        label high inside it, so `leading-none` plus symmetric
                        vertical padding now centres it on its own cap height.
                        Letter-spacing is applied AFTER the last letter as well as
                        between letters, which pushes the visible text left of
                        centre in a pill with equal padding: the right padding is
                        reduced by exactly one tracking step to put it back. And
                        the label is set in small caps at 10px rather than 11px,
                        because at 11px it was competing with the filename it is
                        meant to annotate.
                      */
                      <span
                        className="rounded-pill py-1 pl-2 pr-[calc(0.5rem-0.08em)] text-[10px] font-bold uppercase leading-none tracking-[0.08em] text-white"
                        style={{ background: colors.brand }}
                      >
                        create this
                      </span>
                    )}
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
