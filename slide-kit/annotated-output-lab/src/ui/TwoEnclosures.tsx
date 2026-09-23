import { Reveal, RevealGroup } from '@/motion/Reveal'
import { Terminal } from './Terminal'
import {
  flattenOutput,
  runCountLabel,
  FIGURE_ROOT,
  FIGURE_VIDEO_GUARD,
  type AnnotatedOutputProps,
} from './annotatedOutput'
import { Enclosure, EnclosureLabel } from './annotatedEnclosure'

/**
 * CANDIDATE 3 — TWO ENCLOSURES
 *
 * Two boxes in one panel: the three `Pushed` lines in the primary box, and
 * `b7f7d2967507: Mounted from library/python` in a second, differently marked
 * one. The panel then says *"these three travelled, this one did not"* as two
 * enclosures rather than as one enclosure plus a sentence somewhere else.
 *
 * TWO BOXES MEANS TWO COLOURS, and the reviewer asked for exactly that: *"use
 * different colors if multiple highlight in a single."* Two boxes of one hue
 * stacked on adjacent lines read as one box with a seam.
 *
 * THE COLOURS ARE NON-VERDICT ON PURPOSE, and this is the one decision in the
 * lab that would have been a content bug rather than a taste call. This deck's
 * palette is semantic and the room has been trained on it all session: green
 * means works, amber means careful, red means fails. `Mounted from` is none of
 * those. That layer was not uploaded because the registry already held it, which
 * is the layer system PAYING OFF, so painting the second box amber or red would
 * tell the room to worry about the best thing on the slide. The tones are
 * therefore `primary` (brand blue) and `secondary` (teal), and `BOX_TONE` in
 * `annotatedSurface.ts` is where that reservation is written down.
 *
 * COLOUR IS NOT THE ONLY DIFFERENCE, EITHER. The second box is dashed rather
 * than solid, and both boxes carry their own label — required by `Enclosure`'s
 * props, not optional. So the two groups stay distinguishable in greyscale and
 * to a colour-blind viewer, which is `StatusList`'s discipline (a verdict there
 * gets an icon AND a word) held to on a figure.
 *
 * WORST AT: weight. It is the only candidate that puts two claims on one panel,
 * and `slide-content-rules` is one idea per slide, so this is a figure that
 * wants a lead saying two things. In session 6 the two claims are two
 * consecutive slides on purpose — `c3-layers-travel` then `c3-mounted-from` —
 * and this candidate collapses them into one, which is the wrong shape for that
 * deck even if it is the right shape for a recap. It is also the tightest: two
 * boxes on adjacent lines leave 2px between them, and a third box would have
 * nowhere to go.
 */

export function TwoEnclosures({
  path,
  nodes,
  chrome = 'vscode',
  fontSize = 14,
  caption,
  className = '',
}: AnnotatedOutputProps) {
  const { lines, runs } = flattenOutput(nodes)
  const total = lines.length
  const terminalLines = lines.map((f) => ({ text: f.line.text, kind: f.line.kind }))

  return (
    <RevealGroup
      className={`${FIGURE_ROOT} max-w-[1000px] ${className}`}
      style={{ paddingTop: FIGURE_VIDEO_GUARD, paddingBottom: FIGURE_VIDEO_GUARD }}
      stagger={0.1}
    >
      <Reveal dir="up">
        <div className="relative">
          <Terminal path={path} lines={terminalLines} fontSize={fontSize} chrome={chrome} />

          {runs.map((span) => {
            const first = span.members[0]
            const last = span.members[span.members.length - 1]
            const boxes = []
            if (first !== undefined && last !== undefined) {
              boxes.push(
                <Enclosure
                  key={`m${span.runIndex}`}
                  from={first}
                  to={last}
                  fontSize={fontSize}
                  total={total}
                  tone="primary"
                  label={<EnclosureLabel tone="primary">{runCountLabel(span)}</EnclosureLabel>}
                />,
              )
            }
            /* THE SECOND BOX, one per exception. Contiguous runs of exceptions
               are not merged: each is its own line and each says its own thing,
               and the fixture has exactly one. */
            for (const at of span.exceptions) {
              const note = lines[at].line.exceptionNote ?? lines[at].line.note ?? 'Not one of them'
              boxes.push(
                <Enclosure
                  key={`x${at}`}
                  from={at}
                  to={at}
                  fontSize={fontSize}
                  total={total}
                  tone="secondary"
                  stroke="dashed"
                  label={
                    <EnclosureLabel tone="secondary" fill="quiet">
                      {note}
                    </EnclosureLabel>
                  }
                />,
              )
            }
            return boxes
          })}
        </div>
      </Reveal>

      {caption && (
        <Reveal dir="up">
          <p className="mt-4 text-center text-body-sm font-semibold text-ink">{caption}</p>
        </Reveal>
      )}
    </RevealGroup>
  )
}
