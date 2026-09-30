import type { AskFigureProps } from './askFigure'

/**
 * ONE QUESTION, RENDERED BY EVERY VARIANT.
 *
 * The comparison is worth nothing unless the content is identical, so this is
 * almost the only content in the lab. A variant that needs a different question
 * to look good has told you something.
 *
 * It matters more here than in any sibling lab. A definition card has four
 * fields to arrange and a flow chart has a topology; a question frame has one
 * sentence, so if the sentence changes between two frames there is nothing left
 * that is being compared.
 *
 * WHY THIS QUESTION, AND HOW IT IS CHOSEN TO BREAK THE LAYOUTS
 *
 * Placeholder content, but not arbitrary: it is a question the OOP session
 * actually asks, and the answer to it is the concept that session exists to
 * teach. That matters because a question frame's failure mode is a frame that
 * composes beautifully and asks something nobody can answer.
 *
 *   - **114 characters, against a ceiling of 120.** Deliberately six off the top
 *     of what the contract holds, because a frame sized for a 40-character
 *     question looks composed at 40 and falls apart at 114, and 114 is what a
 *     real question runs to. At `xl` it is three lines, at `md` it is two, and
 *     every variant here is judged on the version it actually renders.
 *   - **Two sentences, one question mark.** A setup and then the ask, which is
 *     how an instructor says it out loud, and it is the shape that breaks a
 *     layout sized for a single clause: the first sentence is not the question
 *     and must not look like it, and no variant here is allowed to set them
 *     differently to achieve that.
 *   - **It is not answerable yes or no.** `resolveAsk` refuses those outright and
 *     sends them to `truefalse-lab`, so the fixture has to be a question this
 *     contract will actually accept.
 *   - **The qualifier is a real constraint and not the answer.** See below; this
 *     is the field every hint, every rephrasing and every answer gets written
 *     into, and getting the fixture's own one right is the lab's first test of
 *     its own rules.
 *
 * THE KICKER IS THE MOST DANGEROUS STRING ON A QUESTION FRAME
 *
 * Hard content rule 19 pins the concept to the top-left of every slide, and on a
 * question frame that rule and rule 16 pull against each other: the concept IS
 * the answer, so the honest kicker is very often the give-away.
 *
 * The first draft of this fixture read `State lives on the object`, which is
 * word for word the answer to the question underneath it. The frame still
 * composed, the harnesses still passed, and the pause beat was worthless, because
 * anybody who read the top-left corner never had to think.
 *
 * So: **the kicker names the concept and never resolves it.** `Objects and their
 * state` says where in the session the room is, which is all rule 19 asks for,
 * and answers nothing. No resolver can check this, because the check is whether
 * two strings mean the same thing. It is checked in review, and this paragraph is
 * what it is checked against.
 */
export const stateFixture: AskFigureProps = {
  /* Names the concept. Does not resolve it. See the note above. */
  kicker: 'Objects and their state',
  /*
    114 characters. Setup, then the ask.

    It survives every check in `resolveAsk`: one question mark, no `and what`
    compound, no yes/no opener, no spaced em dash, and it is SIX under the
    ceiling rather than comfortably short, which is the point. A frame that holds
    this one holds anything the contract will accept.
  */
  question:
    'Two Dog objects are created from the same class. What happens to the second one when the first one\'s name changes?',
  /*
    A CONSTRAINT, AND SPECIFICALLY NOT THE ANSWER.

    This field is where every one of the three banned things gets written, and the
    drafts of this one line are the best illustration in the lab:

      "name is set inside __init__, not on the class"   <- the ANSWER. Knowing
          that `name` is per-instance IS the thing being asked. It reads like a
          constraint, it renders like a constraint, and the frame no longer asks
          anything. `resolveAsk` cannot catch this one, which is why it is here.
      "Remember what self refers to"                    <- a HINT. Caught:
          HINT_WORDS fires on `remember`.
      "Both objects were made from the same class"      <- a REPHRASING of the
          question's own first sentence, which spends the line saying nothing.

    What survives is a constraint that rules out a trick without deciding
    anything: it tells the room not to go looking for a fourth actor, and leaves
    the actual question exactly as hard as it was.
  */
  qualifier: 'Nothing else in the file touches either object.',
  /*
    NO `of`, DELIBERATELY, and the contract says why: "Question 02 of 06" is a
    promise about the rest of the session that the deck then has to keep, and a
    deck that asks four questions after promising six has told the room it ran
    out of time.
  */
  ordinal: { n: 2 },
  /*
    `check`, and all four slides use it.

    The ramp has three stops and this lab renders one of them, which is a
    deliberate cost. Tone paints the kicker, the rule and the mark, so varying it
    across the four slides would put a different coloured mark on each frame and
    the comparison would be measuring the paint. One tone, four geometries.

    `check` rather than `open` because this is the question asked AFTER the
    constructor has been taught, which is the job the frame is hardest at: the
    room can answer, the instructor needs to find out whether they will, and
    there is nothing on screen to look it up from.
  */
  tone: 'check',
}

/**
 * THE SAME QUESTION, WITH THE THING IT IS ABOUT.
 *
 * Only `AskWithSubject` renders this, and it is the one place in the lab where
 * the fixture changes. `definitions-lab` set the precedent and the reasoning is
 * identical: a variant that exists to carry a field the others refuse has to be
 * judged on content that carries it, or the slide is a demonstration of the
 * variant doing nothing.
 *
 * EXACTLY TWO THINGS CHANGE FROM `stateFixture`, AND BOTH ARE RESULTS.
 *
 * **The subject panel is added.** That is the variable under test.
 *
 * **The qualifier is removed**, and this is the finding rather than a
 * convenience. `stateFixture`'s qualifier rules out a fourth actor touching the
 * objects. With the file on screen the room can SEE that nothing else touches
 * them, so the line is the frame saying in prose something it is simultaneously
 * showing, which is the one thing a frame carrying a subject panel must never do:
 * a constraint stated in words has to be taken on trust, and the same constraint
 * visible in six lines of code can be checked. The prose version is strictly
 * worse whenever the panel is there.
 *
 * The general form, worth carrying into the kit if this variant is promoted:
 * **a subject panel and a qualifier are alternatives, not companions.** If a
 * frame needs both, the panel is not showing enough.
 *
 * WHY `code` AND NOT `terminal`
 *
 * Hard content rule 3's principle: the `kind` is a claim about where the lines
 * came from. These six lines are a file the learner has open, so `code` with the
 * filename in the bar is the true one. Drawing them in a terminal panel would
 * claim they were typed into a shell and that it printed nothing, which is a
 * small lie the room has no way to catch.
 */
export const printFixture: AskFigureProps = {
  kicker: stateFixture.kicker,
  question: stateFixture.question,
  ordinal: stateFixture.ordinal,
  tone: stateFixture.tone,
  subject: {
    kind: 'code',
    label: 'dog.py',
    /*
      SIX LINES, WHICH IS THE CEILING, AND THE LONGEST IS 29 CHARACTERS AGAINST
      54. Both numbers are the point: the panel is shown at its full height so the
      frame is judged at the worst case it claims to hold, and comfortably inside
      its line width so the lab is not also testing the scrollbar.

      The blank line is kept. Six lines with the class and the two objects run
      together is five lines of denser code, and a slide that teaches Python with
      no blank line after a class body teaches that too.
    */
    lines: [
      'class Dog:',
      '    def __init__(self, name):',
      '        self.name = name',
      '',
      'a = Dog("Bruno")',
      'b = Dog("Kaju")',
    ],
  },
}
