import type { ReactNode } from 'react'

/**
 * ONE CONTRACT FOR EVERY PROJECT-CODE FIGURE.
 *
 * Same principle as the sibling labs: it describes **meaning** and never
 * geometry. Picking a winner is a rename at the call site.
 *
 * WHY THIS LAB IS SEPARATE FROM THE PSEUDOCODE ONE
 *
 * They look like the same problem and they are not. Pseudocode explanation is
 * about ONE algorithm: what does this logic do, and what happens when it runs.
 * Project-code explanation is about MANY FILES: where does this live, what calls
 * it, and what has to be true elsewhere for this line to make sense.
 *
 * A trace table answers the first question and is useless for the second. A file
 * map answers the second and is useless for the first. Two labs, because one
 * winner cannot serve both.
 *
 * WHAT THE KIT CANNOT DO TODAY
 *
 * `CodeBlock` shows one file. `CodeBuildSlide` shows one file growing. `FileTree`
 * shows the shape of a directory. Nothing connects them, so a walkthrough of four
 * files is four slides with no thread, and the room is asked to remember where
 * `serializers.py` sat while looking at `views.py`.
 *
 * WHAT THE LITERATURE ASKS FOR
 *
 * Walkthrough documentation is described as a GUIDED TOUR of a codebase, using
 * snippets as points of interest on a map, and its value is named as filling the
 * gap between low-level and high-level documentation. The three things it needs
 * are annotation (notes that clarify relationships), consistent colour per
 * module or layer, and the ability to move between levels of abstraction.
 *
 * So the unit of this contract is a STOP ON A TOUR, not a file. `files` is the
 * map; `stops` is the route.
 */

export interface CodeFile {
  /** Repo-relative, and the id other things refer to. */
  path: string
  /** For the highlighter and the chip. */
  language?: string
  /** The whole file as it stands, one entry per line, no trailing newline. */
  lines: string[]
  /** What this file is FOR, in one line. Shown when the map is drawn. */
  role?: string
  /**
   * Which architectural layer it belongs to.
   *
   * Colour per layer, held consistent across every figure, is the one thing the
   * literature is unanimous about: it is how a reader identifies a module
   * without reading its name each time.
   */
  layer?: string
}

export interface TourStop {
  id: string
  /** `CodeFile.path` of the file this stop is in. */
  file: string
  /**
   * The lines this stop is about, 1-based and inclusive.
   *
   * A RANGE rather than a whole file, deliberately. A stop that means "this file"
   * is not a stop, it is a chapter, and the room cannot look at 40 lines and know
   * which three the sentence was about.
   */
  range: [number, number]
  /** What the room should take from this stop. A claim, not a heading. */
  title: string
  /** One or two lines of why. */
  body?: ReactNode
  /** The aside the presenter reaches for when asked. Hover only. */
  detail?: ReactNode
  /**
   * What this stop hands to, if the tour follows a call or a value rather than a
   * reading order. `stops[i + 1]` is the default next stop, so this is only for
   * naming the MECHANISM of the handover: `docker push`, `HTTP GET`, `import`.
   */
  via?: string
}

export interface ProjectFigureProps {
  files: CodeFile[]
  /** The route, in the order the room should walk it. */
  stops: TourStop[]
  /** Which stop is current, for a variant that shows one at a time. */
  at?: number
  caption?: ReactNode
  className?: string
}

export interface ResolvedProject {
  files: CodeFile[]
  stops: TourStop[]
  byPath: Record<string, CodeFile>
  /** Layers in first-appearance order, so colour assignment is stable. */
  layers: string[]
  /** The snippet a stop points at, already sliced. */
  snippet: (stop: TourStop) => { lines: string[]; from: number; language?: string }
  problems: string[]
}

/**
 * Resolve once, so the variants disagree about geometry only.
 *
 * Every check here is a mistake that renders as something plausible. A stop
 * pointing past the end of a file draws an empty panel; a range of the whole file
 * draws a wall of code the sentence does not match.
 */
export function resolveProject({
  files,
  stops,
}: Pick<ProjectFigureProps, 'files' | 'stops'>): ResolvedProject {
  const problems: string[] = []
  const byPath: Record<string, CodeFile> = {}
  for (const f of files) {
    if (byPath[f.path]) problems.push(`file "${f.path}" declared twice`)
    byPath[f.path] = f
  }

  const layers: string[] = []
  for (const f of files) {
    const l = f.layer ?? 'unassigned'
    if (!layers.includes(l)) layers.push(l)
  }

  for (const [i, s] of stops.entries()) {
    const f = byPath[s.file]
    if (!f) {
      problems.push(`stop ${i + 1} is in "${s.file}", which is not in files`)
      continue
    }
    const [a, b] = s.range
    if (a < 1 || b > f.lines.length) {
      problems.push(`stop ${i + 1} wants lines ${a} to ${b} of "${s.file}", which has ${f.lines.length}`)
    }
    if (a > b) problems.push(`stop ${i + 1} has an inverted range`)
    if (b - a > 11) {
      problems.push(`stop ${i + 1} spans ${b - a + 1} lines; past a dozen the room cannot tell which the sentence was about`)
    }
  }
  if (stops.length > 6) problems.push(`${stops.length} stops; past six this is a chapter, not a slide`)

  return {
    files,
    stops,
    byPath,
    layers,
    snippet: (stop) => {
      const f = byPath[stop.file]
      if (!f) return { lines: [], from: stop.range[0] }
      return {
        lines: f.lines.slice(stop.range[0] - 1, stop.range[1]),
        from: stop.range[0],
        language: f.language,
      }
    },
    problems,
  }
}
