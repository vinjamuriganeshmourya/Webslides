/**
 * ONE CONTRACT FOR EVERY QUESTION FRAME IN THIS LAB.
 *
 * Same principle as the sibling labs: it describes **meaning** and never
 * geometry, so picking a winner is a rename at the call site.
 *
 * WHY THIS LAB EXISTS
 *
 * The kit has exactly one design for the pause beat, `QuestionSlide`, added in
 * session 4, and it has never been compared against anything. That is the whole
 * problem. It was the first thing that was better than a `ContentSlide` with an
 * empty well, it was adopted on that basis, and eight decks later it is still
 * the only answer to a frame that does five different jobs:
 *
 *   1. **Opening a concept.** Nobody in the room can answer yet, and that is the
 *      point: the guess is what makes the answer land two slides later.
 *   2. **Checking one that was just taught.** Everybody should be able to answer,
 *      and the instructor needs to find out whether they can.
 *   3. **Asking about a thing on screen.** "What does this print" is not a
 *      question without the code, and the kit's answer to that today is a
 *      `ContentSlide` whose lead ends in a question mark, which sets the question
 *      at lead size under a larger heading that is not the question.
 *   4. **Marking the switch from listen to answer.** `QuizTimeSlide` does this
 *      and carries no question at all.
 *   5. **Being the sixth question slide in one deck**, where the identical card
 *      and the identical oversized mark have stopped registering as a beat.
 *
 * One design serving five jobs is the absence of a decision, and the cost is
 * item 5: a device that never varies stops being read. So four frames, one
 * fixture, and an argument attached to each.
 *
 * WHAT THE FOUR VARIANTS ARE ARGUING ABOUT
 *
 * Two things, and they are not the same thing:
 *
 *   **Where the "stop and think" signal comes from.** `SpotlightAsk` says from
 *   the ground, by turning the projector dark. `QuietField` says from the
 *   absence of anything else, with no card at all. `MarkCut` says from one
 *   enormous drawn glyph that is the composition rather than a watermark behind
 *   it.
 *
 *   **Whether a question may carry its subject.** `AskWithSubject` is the only
 *   one that answers yes, and it is the only variant here in tension with hard
 *   content rule 16. The argument, and the ceiling that keeps it honest, are in
 *   that file.
 *
 * WHAT NO VARIANT IN THIS LAB CARRIES, AND WHY THERE IS NO FIELD FOR IT
 *
 * **The answer.** There is no `answer` field on this contract, no `options`, and
 * no `correct`. Not as a build step, not behind a click, not in small grey text
 * at the bottom. A question frame's entire mechanism is that the room commits out
 * loud before it finds out, and the answer is the NEXT slide (hard content rule
 * 16). A contract that can hold the answer is a contract somebody will fill in.
 *
 * Options and a marked answer are the `mcq-lab` and `truefalse-lab` contracts,
 * which are separate labs for exactly this reason: they are a different device
 * with a different mechanism, not this one with more fields.
 *
 * HEIGHT, AND WHY THERE IS NO ARITHMETIC IN THIS FILE
 *
 * `points-lab`, `flowchart-lab` and `pseudocode-lab` compute a stage height in
 * pixels from the fixture's longest string. That is right for a figure laid out
 * on an absolute stage. It is the wrong tool here for the same reason
 * `definitions-lab` gave: these are full FRAMES, not figures in a well. Each one
 * owns the whole 1280x720 canvas, lays out in flex against it, and has one job
 * the arithmetic cannot help with, which is staying out of the instructor video
 * rectangle at x 913..1280, y 0..220 whatever length of question it is handed.
 *
 * So the resolver's job is to refuse a question that would not fit rather than to
 * guess how tall it is, and every ceiling below is a character count measured
 * against a real measure at a real type size, stated where it is checked.
 */

/**
 * WHERE THE QUESTION SITS IN THE LESSON, WHICH IS THE ONE THING WORTH PAINT.
 *
 * Deliberately narrower than the points lab's four-tone ramp, and narrower than
 * it first looks. A question is not a claim, so there is no `good` and no `risk`:
 * a question is not good news and it is not a warning, and painting one red says
 * the room is about to get something wrong, which is a hint.
 *
 * What genuinely varies is whether the room can answer yet, and that changes what
 * the frame is asking for:
 *
 *   `open`   asked before the answer exists in the room. Brand blue. A guess is
 *            the correct response and a wrong guess costs nothing.
 *   `check`  asked after the concept was taught. Deep blue, the same stop the
 *            sibling labs give their lead, because this is the frame that carries
 *            the session's weight: it is where the instructor finds out whether
 *            the last ten minutes landed.
 *   `pivot`  the one question the rest of the session turns on. Accent orange.
 *
 * `pivot` HAS A BUDGET OF ONE PER DECK, and it is a budget rather than a
 * guideline. Orange appears nowhere else on a light content slide in this kit, so
 * the first one is unmissable and the third one is a colour scheme. The resolver
 * cannot see a deck, so it cannot enforce this; the plan review can, and this
 * sentence is what it checks against.
 *
 * THERE IS NO `trap` TONE, AND THE REASON IS WORTH KEEPING.
 *
 * It was in the first draft: a question whose obvious answer is wrong, painted so
 * the room knows to look twice. That is self-defeating. A trap the room has been
 * warned about is a comprehension check with extra steps, and the wrong guess is
 * the entire teaching value of the slide. If the question is a trap, it is
 * painted `open` like any other and the trap stays shut.
 */
export type AskTone = 'open' | 'check' | 'pivot'

/**
 * The artefact a question is ABOUT.
 *
 * Only `AskWithSubject` renders it. It is on the shared contract rather than on
 * that one variant's props because the fixture has to be identical across the
 * lab for the comparison to mean anything, and because the other three variants
 * REFUSING a question that carries one is a result: it says out loud that "what
 * does this print" is not a frame they can draw, which is the thing the lab is
 * trying to find out.
 */
export interface AskSubject {
  /**
   * What the panel claims the lines came from, which decides how it is drawn and
   * is a statement about their origin, not a style:
   *
   *   `code`     lines from a file the learner has or will write.
   *   `terminal` a command and what it printed. Carries a prompt path, because
   *              hard content rule 3 says a terminal without one is a lie about
   *              where it ran.
   *   `literal`  a fragment that came from nowhere: a URL, a config line, a
   *              signature. The honest option, and the right one when the lines
   *              were written for the slide rather than lifted off a screen.
   */
  kind: 'code' | 'terminal' | 'literal'
  /** The name in the panel's bar, when there is one. A filename, or a prompt path. */
  label?: string
  lines: string[]
}

export interface AskFigureProps {
  /**
   * The concept this question belongs to, at the frame's top-left datum per hard
   * content rule 19. Not "A question first": that names the DEVICE, which the
   * room can already see, and spends the one line that could have said where in
   * the session they are.
   */
  kicker?: string
  /**
   * The question. One question, ending in a question mark, and short enough that
   * the room can hold all of it while thinking about the answer.
   *
   * A string rather than a `ReactNode`, which is the one place this contract is
   * stricter than its siblings. `DefinitionFigureProps` takes a node and gives up
   * on measuring it. Here every ceiling in the resolver is a character count, and
   * a node would silently opt out of all of them: the compound-question check,
   * the yes/no check and the length ceiling are the three most valuable things in
   * this file, and they are the three a node turns off. Nothing a question needs
   * is unavailable in a plain string.
   */
  question: string
  /**
   * At most one short line, for a constraint the room needs in order to answer:
   * "assume the container is already running".
   *
   * NOT a hint, not a rephrasing, and never the answer. The resolver checks for
   * all three, because this is the field every one of them gets written into.
   */
  qualifier?: string
  /** The thing the question is about. Only `AskWithSubject` draws it. */
  subject?: AskSubject
  /**
   * Which ask this is, for the variants that number it.
   *
   * `of` is optional and omitting it is usually right: "Question 2 of 6" tells a
   * room that four more are coming, which is a promise about the rest of the
   * session that the deck then has to keep.
   */
  ordinal?: { n: number; of?: number }
  tone?: AskTone
  className?: string
}

export interface ResolvedAsk {
  question: string
  qualifier?: string
  /** Question length in characters. Every variant sizes its type off this. */
  length: number
  /** Longest line in the subject panel, in characters. 0 when there is none. */
  subjectWidest: number
  problems: string[]
}

/*
  THE CEILINGS, ALL IN ONE PLACE, EACH MEASURED RATHER THAN CHOSEN.

  A question frame's failure mode is not that it fails to render. It is that it
  renders a paragraph at display size, looks composed in a screenshot, and cannot
  be held in a head while somebody thinks about the answer. Nothing about the
  output says so, which is the only kind of mistake worth checking for.
*/

/**
 * 120 CHARACTERS, AND THE NUMBER COMES OFF THE NARROWEST FRAME IN THE LAB.
 *
 * `MarkCut` gives the question a 620px measure at 40px Sora, which is about 40
 * characters a line, so 120 is three lines. Three lines at display size is the
 * last count that still reads as one sentence rather than as a paragraph
 * somebody set large. The kit's own `QuestionSlide` has an 840px card and would
 * hold more, and that is exactly how a 190-character question got written into
 * one: the widest frame set the ceiling for all of them.
 */
const MAX_QUESTION = 120

/**
 * 24 IS NOT A STYLE FLOOR, IT IS A "THIS IS NOT THE QUESTION" CHECK.
 *
 * "What now?" renders beautifully on all four frames and asks nothing. A question
 * under about 24 characters is almost always the shorthand an instructor says out
 * loud with the real question living in their head, and the room gets the
 * shorthand.
 */
const MIN_QUESTION = 24

/** One line under the question. 90 characters is one line at every measure here. */
const MAX_QUALIFIER = 90

/**
 * 54 CHARACTERS, BECAUSE THE PANEL DOES NOT WRAP.
 *
 * `AskWithSubject` gives its panel 420px at 14px in the mono face, which is 54
 * characters. A longer line scrolls sideways inside its own box, and a slide with
 * a horizontal scrollbar is a slide nobody can read the end of.
 */
const MAX_SUBJECT_LINE = 54

/**
 * SIX LINES. Past that the room reads the panel instead of answering, and the
 * frame has quietly become a content slide with a question on it.
 */
const MAX_SUBJECT_LINES = 6

/** Hard content rule 1: a spaced em dash is banned in every rendered string. */
const SPACED_EM_DASH = /\s—\s/

/**
 * A YES/NO OPENER, WHICH IS THE CHECK THIS LAB EXISTS NEXT DOOR TO.
 *
 * "Does the container keep its data?" is answerable by a coin flip, and on an
 * open question frame half the room is right by accident and learns nothing from
 * being right. That is not a bad question, it is a different DEVICE: it wants
 * `truefalse-lab`, where both answers are on the frame, the room commits to one,
 * and being right by luck is visible as luck.
 */
const YES_NO_OPENER =
  /^(is|are|am|was|were|does|do|did|can|could|will|would|shall|should|has|have|had|must|may)\b/i

/**
 * TWO QUESTIONS WEARING ONE QUESTION MARK.
 *
 * Hard content rule 16 splits a compound question, and the reason is that a room
 * asked "what happens, and why?" answers the easy half out loud and never
 * considers the second. The pattern is narrow on purpose: it fires on a
 * conjunction followed by a second interrogative, which is how the compound is
 * always written, and not on "when" or "where" used as an ordinary subordinator,
 * which is how half the good questions in this course are written.
 */
const COMPOUND = /\b(and|or)\s+(what|why|how|which|who|whose)\b/i

/** The qualifier is a constraint. These words mean it has become something else. */
const HINT_WORDS = /\b(hint|clue|tip|remember|recall|note that|think about|consider that)\b/i
const ANSWER_WORDS = /\b(answer|the reason is|this is because|correct|in fact)\b/i

/**
 * Resolve once, so the variants disagree about geometry only.
 *
 * Straight from the sibling labs: a frame that refuses is worth more than a frame
 * that renders an unanswerable question and lets it ship.
 */
export function resolveAsk({
  question,
  qualifier,
  subject,
  ordinal,
}: Pick<AskFigureProps, 'question' | 'qualifier' | 'subject' | 'ordinal'>): ResolvedAsk {
  const problems: string[] = []
  const q = (question ?? '').trim()

  if (!q) {
    problems.push('no question, so there is nothing for the room to answer')
  } else {
    if (!q.endsWith('?')) {
      problems.push('the question does not end in a question mark, so it is a statement')
    }
    if ((q.match(/\?/g) ?? []).length > 1) {
      problems.push('two question marks; hard rule 16 splits a compound question onto two frames')
    }
    if (COMPOUND.test(q)) {
      problems.push(
        'this asks two things at once; the room answers the easy half, so it is two frames',
      )
    }
    if (q.length > MAX_QUESTION) {
      problems.push(
        `the question is ${q.length} characters; past ${MAX_QUESTION} it is a paragraph set large, not a question`,
      )
    }
    if (q.length < MIN_QUESTION) {
      problems.push(
        `the question is ${q.length} characters; that is the shorthand, and the room needs the question`,
      )
    }
    if (YES_NO_OPENER.test(q)) {
      problems.push(
        'this is answerable yes or no, so half the room is right by accident; it wants a true/false frame',
      )
    }
    if (SPACED_EM_DASH.test(q)) {
      problems.push('the question carries a spaced em dash, which hard rule 1 bans in slide copy')
    }
    if (/\bstranger\b/i.test(q)) {
      problems.push('hard rule 2: the audience is not a stranger; say others, or someone else')
    }
  }

  const ql = qualifier?.trim()
  if (ql) {
    if (ql.endsWith('?')) {
      problems.push('the qualifier is a second question; one question per frame')
    }
    if (ql.length > MAX_QUALIFIER) {
      problems.push(
        `the qualifier is ${ql.length} characters; past ${MAX_QUALIFIER} it is an explanation, not a constraint`,
      )
    }
    if (HINT_WORDS.test(ql)) {
      problems.push('the qualifier reads as a hint; it may carry a constraint and nothing else')
    }
    if (ANSWER_WORDS.test(ql)) {
      problems.push('the qualifier gives the answer away; the answer is the next slide')
    }
    if (SPACED_EM_DASH.test(ql)) {
      problems.push('the qualifier carries a spaced em dash, which hard rule 1 bans in slide copy')
    }
  }

  let subjectWidest = 0
  if (subject) {
    const lines = subject.lines ?? []
    subjectWidest = Math.max(0, ...lines.map((l) => l.length))
    if (lines.length === 0) {
      problems.push('the subject panel has no lines, so it is an empty box beside the question')
    }
    if (lines.length > MAX_SUBJECT_LINES) {
      problems.push(
        `the subject is ${lines.length} lines; past ${MAX_SUBJECT_LINES} the room reads it instead of answering`,
      )
    }
    if (subjectWidest > MAX_SUBJECT_LINE) {
      problems.push(
        `the subject's longest line is ${subjectWidest} characters; the panel holds ${MAX_SUBJECT_LINE} without scrolling`,
      )
    }
    /*
      HARD CONTENT RULE 3, ENFORCED WHERE IT IS CHEAPEST TO ENFORCE.

      A terminal panel without its folder path is the single most repeated
      mistake in this repo's decks, and "wrong folder" is the first error a
      learner actually hits. The rule says every command carries its prompt path;
      here that means the panel has a label to put in its bar.
    */
    if (subject.kind === 'terminal' && !subject.label) {
      problems.push('a terminal subject needs its folder path; hard rule 3 wants the prompt shown')
    }
  }

  if (ordinal && ordinal.of !== undefined && ordinal.n > ordinal.of) {
    problems.push(`this is question ${ordinal.n} of ${ordinal.of}, which cannot be true`)
  }

  return {
    question: q,
    qualifier: ql,
    length: q.length,
    subjectWidest,
    problems,
  }
}
