import type { ChangeFigureProps } from './changeFigure'

/**
 * ONE CHANGE, RENDERED BY BOTH VARIANTS.
 *
 * The comparison is worth nothing unless the content is identical, so slides 1
 * and 2 carry this set and differ only in geometry. A variant that needs a
 * different change to look good has told you something.
 *
 * WHY THIS ONE
 *
 * Deploying by hand against deploying from a pipeline is a change the deployment
 * course actually teaches, and every claim here is true of a real team. That
 * matters because a before-and-after figure's failure mode is a row that reads
 * beautifully and overstates what happened.
 *
 * HOW IT IS CHOSEN TO STRESS THE GEOMETRY
 *
 *   - **Three dimensions**, which is `StateArrow`'s ceiling and well inside
 *     `DeltaRows`'s five. Both variants render it, which is what makes slides 1
 *     and 2 a comparison rather than two demos.
 *   - **Only one dimension carries a delta.** "About 40 minutes" to "six
 *     minutes" has a number in it; "the two people who know the server" to
 *     "anyone who can merge" does not, and inventing one would be the exact
 *     failure the delta field's doc comment warns about. This is the set that
 *     proves a partial delta column does not look broken.
 *   - **Both states carry a note**, because that sentence is `StateArrow`'s
 *     whole content and `DeltaRows` structurally cannot show it. Rendering the
 *     same fixture through both is how that gap becomes visible rather than
 *     argued.
 *   - **The before state is `muted`, not `risk`.** Deploying by hand is not
 *     broken. It is what you do before the pipeline exists, and on many teams it
 *     is what the previous session taught. `brokenFixture` below is the case
 *     where `risk` is earned.
 *
 * WHY THE CELLS ARE NOT TRANSCRIPTS
 *
 * They are claims about how a team worked, not captured output, and nothing here
 * is framed as a terminal. Hard rule 3 wants a real panel with a folder path for
 * an actual transcript, so the never-invent-output rule is satisfied by the
 * framing rather than broken by the content.
 */
export const deployFixture: ChangeFigureProps = {
  before: {
    id: 'by-hand',
    label: 'Deploying by hand',
    gloss: 'someone runs the script',
    icon: 'terminal',
    tone: 'muted',
    note: 'A deploy is an event someone schedules, and somebody has to be free to do it.',
  },
  after: {
    id: 'pipeline',
    label: 'Deploying from a pipeline',
    gloss: 'merging is the deploy',
    icon: 'route',
    tone: 'brand',
    note: 'A deploy is a consequence of merging, so nobody has to decide to do one.',
  },
  rows: [
    {
      id: 'starts',
      dimension: 'How it starts',
      before: 'Someone opens a terminal and runs the script.',
      after: 'A push to main.',
    },
    {
      id: 'takes',
      dimension: 'How long it takes',
      before: 'About forty minutes, if nothing goes wrong.',
      after: 'Six minutes, and it says which six.',
      delta: '-34 min',
    },
    {
      id: 'who',
      dimension: 'Who can do it',
      before: 'The two people who know the server.',
      after: 'Anyone who can merge.',
    },
  ],
  caption: 'The pipeline did not make the deploy faster. It made it stop being a decision.',
}

/**
 * FIVE DIMENSIONS, WHICH IS THE CONTENT `DeltaRows` EXISTS FOR AND `StateArrow`
 * REFUSES.
 *
 * A database migration, where the lesson genuinely is the inventory: five
 * separate things moved and the room needs to see each one move rather than two
 * summaries of the move.
 *
 * `StateArrow` refuses this set by name. Three rows stacked inside a 528px panel
 * is already 400px of panel once the head, the note and the padding are counted,
 * and five puts the caption behind the deck controls. That refusal is rendered on
 * slide 4 rather than described.
 *
 * **Three of the five carry a delta and two do not**, which is the realistic
 * shape: query time and row count are measurable, and "who owns the schema" is
 * not. A figure that looked wrong with a ragged delta column would be a figure
 * pushing authors to invent numbers.
 */
export const migrationFixture: ChangeFigureProps = {
  before: {
    id: 'single',
    label: 'One shared table',
    gloss: 'everything in orders',
    icon: 'database',
    tone: 'muted',
  },
  after: {
    id: 'split',
    label: 'Split by concern',
    gloss: 'orders, items, payments',
    icon: 'network',
    tone: 'brand',
  },
  rows: [
    {
      id: 'query',
      dimension: 'Typical query time',
      before: '1.9 seconds at p95.',
      after: '140 milliseconds at p95.',
      delta: 'x13 faster',
    },
    {
      id: 'width',
      dimension: 'Columns in the hot table',
      before: 'Sixty-one, most of them null.',
      after: 'Nine, all of them used.',
      delta: '61 to 9',
    },
    {
      id: 'lock',
      dimension: 'What a write locks',
      before: 'The row every report also reads.',
      after: 'One row in one narrow table.',
    },
    {
      id: 'index',
      dimension: 'Indexes to maintain',
      before: 'Fourteen on one table.',
      after: 'Six, spread across three.',
      delta: '-8',
    },
    {
      id: 'owns',
      dimension: 'Who owns the schema',
      before: 'Whoever needed a column last.',
      after: 'The team that owns the concern.',
    },
  ],
  caption: 'Splitting the table was the cheap part. Agreeing what the concerns were was not.',
}

/**
 * THE CASE WHERE `risk` ON THE BEFORE STATE IS EARNED.
 *
 * Storing passwords in plain text is not "what we did before we knew better" in
 * the way deploying by hand is. It was wrong at the time, it is wrong now, and a
 * slide that paints it in neutral grey next to a green fix is being polite about
 * something that should not be treated politely.
 *
 * So this set passes `beforeWasBroken`, which is what unlocks `tone: 'risk'`.
 * The flag is separate from the tone on purpose: the paint is a claim, and the
 * claim gets made once, deliberately, at the call site where a reviewer sees it.
 * Without the flag `resolveChange` refuses the paint and says that earlier is not
 * the same as wrong.
 */
export const brokenFixture: ChangeFigureProps = {
  before: {
    id: 'plain',
    label: 'Passwords in plain text',
    gloss: 'readable by anyone with the table',
    icon: 'key',
    tone: 'risk',
    note: 'One dump of the users table is every account on the service, and on every other service where the password was reused.',
  },
  after: {
    id: 'hashed',
    label: 'Salted and hashed',
    gloss: 'unreadable even to us',
    icon: 'shield',
    tone: 'brand',
    note: 'A dump of the users table is a set of hashes that cost real money to attack one at a time.',
  },
  beforeWasBroken: true,
  rows: [
    {
      id: 'dump',
      dimension: 'If the table leaks',
      before: 'Every account is compromised immediately.',
      after: 'Each password has to be attacked on its own.',
    },
    {
      id: 'reset',
      dimension: 'What a reset can do',
      before: 'Show the user their old password.',
      after: 'Set a new one. The old one is not recoverable.',
    },
    {
      id: 'reuse',
      dimension: 'Damage beyond this service',
      before: 'Every site where the password was reused.',
      after: 'None, unless the hash is broken first.',
    },
  ],
  caption: 'This is the one case where the before state is painted as a risk, and it is earned.',
}

/**
 * A SET THE LAB REFUSES, KEPT SO THE REFUSAL IS VISIBLE.
 *
 * Four authoring mistakes, each of which renders as something PLAUSIBLE and none
 * of which any harness would catch, because all four produce a tidy figure that
 * sits comfortably inside the frame:
 *
 *   1. **A row that says the same thing on both sides.** The single most likely
 *      mistake in this figure and the reason the resolver exists. It draws two
 *      cells and an arrow between them, and the room reads "this changed too"
 *      because the whole frame says change. Nothing about the output disagrees.
 *   2. **A delta that is prose.** "Much faster now" is an opinion wearing a
 *      number's clothes, and it is what gets typed when the author does not have
 *      the number.
 *   3. **The before state painted as a risk** without `beforeWasBroken`, which
 *      is the check that stops a deck teaching that last week's lesson was a
 *      mistake.
 *   4. **A dimension written as a sentence**, which turns the label column into
 *      a third column of prose.
 */
export const refusedFixture: ChangeFigureProps = {
  before: {
    id: 'old',
    label: 'Local state',
    gloss: 'each component keeps its own',
    icon: 'file',
    tone: 'risk',
  },
  after: {
    id: 'new',
    label: 'One store',
    gloss: 'a single source of truth',
    icon: 'database',
    tone: 'brand',
  },
  rows: [
    {
      id: 'where',
      dimension: 'Where does the state actually live?',
      before: 'In whichever component asked for it first.',
      after: 'In one store, named and typed.',
    },
    {
      id: 'same',
      dimension: 'How it is read',
      before: 'A hook in the component.',
      after: 'A hook in the component.',
    },
    {
      id: 'speed',
      dimension: 'Re-renders per update',
      before: 'Every component in the subtree.',
      after: 'Only the ones that read the value.',
      delta: 'much faster now',
    },
  ],
}
