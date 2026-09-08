import { SlideBase } from '@/ui/SlideBase'
import { SlideHeader } from '@/ui/SlideHeader'
import { SlideLead } from '@/ui/SlideLead'
import { Callout } from '@/ui/Callout'
import { SyntaxBreakdown } from '@/ui/SyntaxBreakdown'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import { SLIDE_FAMILY } from '@/motion/continuity'
import type { CodeSyntaxSlideProps, CommandSyntaxSlideProps } from './types'

/**
 * SYNTAX EXPLANATION — two types, one figure.
 *
 * `CodeSyntaxSlide` explains the grammar of a language construct. It answers
 * "what are the slots in a `def` line, and which of them do I choose?".
 *
 * `CommandSyntaxSlide` explains the grammar of a command. It answers "what are
 * the slots in `docker run -d -p 8000:8000 myapp`, and which of them do I
 * choose?".
 *
 * They are separate types rather than one with a flag because a plan should be
 * able to say which of the two it means, and because the pair they must NOT be
 * confused with are also separate: `CodeBuildSlide` (a real file, built up) and
 * `Terminal` inside a `ContentSlide` (a real command, actually run). The four
 * cover file/command against shape/instance, and picking the wrong quadrant is
 * the most common way this content gets rendered wrong.
 *
 *   |            | the SHAPE of it     | an INSTANCE of it        |
 *   |------------|---------------------|--------------------------|
 *   | a file     | CodeSyntaxSlide     | CodeBuildSlide           |
 *   | a command  | CommandSyntaxSlide  | ContentSlide + Terminal  |
 *
 * THE SHAPE COMES FROM THE FINALIZED DECKS
 *
 * `SyntaxBreakdown` is session 5's `TargetAnatomy` generalised: a white panel,
 * the tokens as tinted chips, the captions as a row of cards with a coloured
 * left rail. Session 4 built the same figure twice as an SVG and shipped it with
 * overlapping labels that every harness passed. Read that file's header before
 * changing this one.
 *
 * THE HEIGHT BUDGET
 *
 * The specimen panel is about 120px and the caption row about 110px, because the
 * captions sit SIDE BY SIDE rather than stacked. The content well runs
 * y=220..656, so the budget is set by the caption grid's width, not its height:
 * FIVE parts at 160px a column, comfortably FOUR at 205px, and a `note` still
 * fits under either.
 *
 * Past five, split across two slides. That is usually the better lesson anyway:
 * five slots is already more than one idea.
 *
 * WHY THE LEAD-LESS GUARD
 *
 * A header stops at y=168, and the specimen panel is full width, so with nothing
 * between the two its top-right corner sits inside the instructor-video rectangle
 * (x 913..1280, y 0..220) and `video-safe.mjs` fails. `ContentSlide` carries the
 * same 52px guard for the same reason. The test reads `lead` because a lead is
 * what fills that band, drawn in the well by `SlideLead` rather than in the
 * header.
 */
function SyntaxSlide({
  kicker,
  title,
  lead,
  parts,
  stepped = true,
  note,
  lesson,
  mode,
  language,
}: (CodeSyntaxSlideProps | CommandSyntaxSlideProps) & {
  mode: 'code' | 'command'
  language?: string
}) {
  const guard = lead ? '' : 'pt-[52px]'
  return (
    <SlideBase variant="light" lesson={lesson}>
      <div className="flex h-full flex-col">
        <SlideHeader kicker={kicker} title={title} />
        {/*
          The point opens the well, above the specimen panel and outside the
          centred block. Inside it, the lead would be centred along with the
          breakdown and read as a caption on the grammar rather than as the
          sentence saying which construct is being taken apart.
        */}
        {lead && <SlideLead>{lead}</SlideLead>}
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <RevealGroup className={guard}>
            <Reveal dir="up">
              <SyntaxBreakdown
                parts={parts}
                mode={mode}
                language={language}
                stepped={stepped}
              />
            </Reveal>
            {note && (
              <Reveal dir="up" delay={0.06} className="mt-6">
                <Callout kind={note.kind} title={note.title} asStep={false}>
                  {note.body}
                </Callout>
              </Reveal>
            )}
          </RevealGroup>
        </div>
      </div>
    </SlideBase>
  )
}

/** The grammar of a language construct. See the quadrant table above. */
export function CodeSyntaxSlide({ language = 'python', ...rest }: CodeSyntaxSlideProps) {
  return <SyntaxSlide {...rest} mode="code" language={language} />
}
CodeSyntaxSlide.family = SLIDE_FAMILY.content

/** The grammar of a command. Runs nothing — see the note on the props type. */
export function CommandSyntaxSlide(props: CommandSyntaxSlideProps) {
  return <SyntaxSlide {...props} mode="command" />
}
CommandSyntaxSlide.family = SLIDE_FAMILY.content
