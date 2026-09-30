import type { ComparisonFigureProps } from './comparisonFigure'

/**
 * ONE COMPARISON, RENDERED BY EVERY VARIANT.
 *
 * The comparison is worth nothing unless the content is identical, so this is
 * almost the only content in the lab. A variant that needs a different set to
 * look good has told you something.
 *
 * WHY THIS ONE, AND HOW IT IS CHOSEN TO STRESS THE GEOMETRY
 *
 * Placeholder content, but not arbitrary: `docker run` against
 * `docker compose up` is a comparison the deployment course actually makes, and
 * every claim here is true and would be defended. That matters because a
 * comparison figure's failure mode is a row that reads beautifully and teaches
 * something false.
 *
 * The set is picked to break the layouts rather than to flatter them:
 *
 *   - **The cells are deliberately different lengths.** "One container, from one
 *     image." is 30 characters and sits on one line at every width in the lab.
 *     "One network is created for the project, and every service joins it." is
 *     67, which is two lines in `AttributeSpine`'s 476px half-column and one in
 *     `HeadToHead`'s 528px panel. That spread is the whole test: a variant that
 *     sizes for the short cell makes the long one eat its padding, and a variant
 *     that sizes for the long one strands white space under the short one. The
 *     two cells of a row have to end level regardless.
 *   - **The attributes run 14 to 27 characters**, the awkward range: long enough
 *     that a 200px gutter is not free, short enough that nothing wraps to three
 *     lines, so a variant cannot get credit for handling a wrap it never sees.
 *     `resolveComparison` guards the real ceiling at 32.
 *   - **Five rows**, one under the six-row cap, so the tallest honest case is
 *     what gets drawn rather than a comfortable three.
 *   - **One row is the pivot.** Networking is the row this comparison exists for:
 *     it is where the two commands stop being conveniences for each other. A
 *     variant that paints every row identically is visibly failing to make the
 *     point the author marked.
 *   - **The two sides are `neutral` and `contrast`, and neither is `lead`**, which
 *     is the default case and the one that matters. This slide is not arguing
 *     that compose is better. `leadFixture` below is the opt-in case.
 *
 * WHY THE CELLS ARE NOT COMMAND TRANSCRIPTS
 *
 * They are claims about the two commands, not captured output, and nothing here
 * is framed as a terminal. Hard rule 3 wants a real panel with a folder path for
 * an actual transcript, and the never-invent-output rule is satisfied by the
 * framing rather than broken by the content.
 */
export const dockerFixture: ComparisonFigureProps = {
  a: {
    id: 'run',
    label: 'docker run',
    gloss: 'one container, by hand',
    icon: 'terminal',
    tone: 'neutral',
  },
  b: {
    id: 'compose',
    label: 'docker compose up',
    gloss: 'the whole project, declared',
    icon: 'network',
    tone: 'contrast',
  },
  rows: [
    {
      id: 'starts',
      attribute: 'What it starts',
      a: 'One container, from one image.',
      b: 'Every service in the file, together.',
    },
    {
      id: 'settings',
      attribute: 'Where the settings live',
      a: 'In the flags you type, every time.',
      b: 'In docker-compose.yml, committed with the code.',
    },
    {
      id: 'networking',
      /* The row the comparison exists for. See the pivot note above. */
      attribute: 'Networking between services',
      a: 'You create the network and attach each container to it yourself.',
      b: 'One network is created for the project, and every service joins it.',
      pivot: true,
    },
    {
      id: 'teardown',
      attribute: 'Tearing it down',
      a: 'docker stop, then docker rm, once per container.',
      b: 'docker compose down, once.',
    },
    {
      id: 'reach',
      attribute: 'When you reach for it',
      a: 'A one-off: a shell, a quick test, a single image.',
      b: 'Anything with more than one moving part.',
    },
  ],
  caption: 'Both start containers. Only one of them wires them together for you.',
}

/**
 * THE SAME SHAPE AT TWO ROWS, AND WITH A SIDE MARKED `lead`.
 *
 * Two things are being tested here that the five-row set cannot test.
 *
 * **Two rows is where `AttributeSpine` stops being worth it.** A spine earns its
 * 200px gutter by being the thing several rows hang off; at two rows the gutter
 * is a third of the figure's width spent on two short labels, and `HeadToHead`
 * says the same content with the room going to the words. The spine renders it
 * rather than refusing, because two rows is legible, and the lab's own CLAUDE.md
 * records that the honest choice at this count is the other variant.
 *
 * **`lead` is exercised exactly once in the lab**, here, because it is the opt-in
 * that the contract deliberately does not default. A slide that IS arguing for a
 * side has to say so, and this is what that looks like: one side in the deepest
 * brand blue, the other left alone.
 */
export const leadFixture: ComparisonFigureProps = {
  a: {
    id: 'bind',
    label: 'Bind mount',
    gloss: 'a path on your machine',
    icon: 'folder',
    tone: 'neutral',
  },
  b: {
    id: 'volume',
    label: 'Named volume',
    gloss: 'storage Docker owns',
    icon: 'database',
    tone: 'lead',
  },
  rows: [
    {
      id: 'who-owns',
      attribute: 'Who owns the data',
      a: 'Your filesystem. The container borrows a path you already have.',
      b: 'Docker. The container gets storage that exists independently of it.',
    },
    {
      id: 'survives',
      attribute: 'Survives on another machine',
      a: 'No. The path is yours, and the next machine does not have it.',
      b: 'Yes. The volume is declared, so it is created wherever the project runs.',
      pivot: true,
    },
  ],
  caption: 'For anything the application has to keep, the volume is the one that travels.',
}

/**
 * A SET THE LAB REFUSES, KEPT SO THE REFUSAL IS VISIBLE.
 *
 * Three separate authoring mistakes, each of which renders as something
 * plausible and none of which any harness would catch:
 *
 *   1. A row that is empty on one side. It draws a tidy row with a blank cell,
 *      which reads as an oversight. What it means is "only the first one has
 *      this", and that is a three-region figure, not a comparison.
 *   2. A cell well over the 110-character ceiling, which wraps to three lines and
 *      makes one row twice the height of the rest.
 *   3. An attribute written as a sentence, which turns the gutter into a third
 *      column of prose.
 *
 * Rendered on its own slide rather than described, because a refusal nobody has
 * seen is a refusal nobody trusts.
 */
export const brokenFixture: ComparisonFigureProps = {
  a: { id: 'rest', label: 'REST', icon: 'globe', tone: 'neutral' },
  b: { id: 'graphql', label: 'GraphQL', icon: 'route', tone: 'contrast' },
  rows: [
    {
      id: 'shape',
      attribute: 'Does the client choose the shape of the response?',
      a: 'No. The endpoint decides what comes back.',
      b: 'Yes. The query names the fields.',
    },
    {
      id: 'caching',
      attribute: 'Caching',
      a: 'Straightforward, because a URL identifies a resource and HTTP caching was built for exactly that, so proxies and browsers cache it with no work from you at all.',
      b: 'Harder. One endpoint serves every query, so the URL no longer identifies what came back.',
    },
    {
      id: 'versioning',
      attribute: 'Versioning',
      a: '/v1, /v2, and a deprecation window.',
      b: '',
    },
  ],
}

/**
 * THREE ROWS OF LONG CELLS, WHICH IS THE CONTENT `LabelBand` EXISTS FOR.
 *
 * THREE AND NOT FOUR, AND THE VARIANT DECIDED THAT RATHER THAN TASTE. This set
 * was written with a fourth row, "Where the rule lives", and `LabelBand` refused
 * it: four rows whose cells all run to two lines is 424px of rows against a well
 * of about 417, and the refusal said so in those terms. The row was cut rather
 * than the rule loosened, which is the whole point of having the rule.
 *
 * Authentication against authorization: a comparison this course makes, where
 * every answer needs a clause rather than a phrase because the distinction is
 * the whole lesson and a three-word cell would restate the confusion instead of
 * clearing it.
 *
 * THE CELLS ARE SIZED TO BREAK `AttributeSpine` ON PURPOSE. They run 118 to 132
 * characters. A spine's 200px gutter leaves 476px a side, about 58 characters a
 * line, so every one of these is three lines there and the rows stop scanning;
 * the spine refuses the set outright and names `LabelBand` in the refusal.
 * `LabelBand` spends a line of height on the attribute instead of a column of
 * width and hands the same cell 552px, about 67 characters a line, which is two.
 *
 * That is the entire trade the two variants are arguing about, and it is only
 * visible on content long enough to force it.
 */
export const authFixture: ComparisonFigureProps = {
  a: {
    id: 'authn',
    label: 'Authentication',
    gloss: 'who you are',
    icon: 'key',
    tone: 'neutral',
  },
  b: {
    id: 'authz',
    label: 'Authorization',
    gloss: 'what you may do',
    icon: 'lock',
    tone: 'contrast',
  },
  rows: [
    {
      id: 'establishes',
      attribute: 'What it establishes',
      a: 'Who you are. The system confirms the identity you are claiming, usually against something only you could have.',
      b: 'What you may do. The system checks whether the identity it already trusts is allowed to perform this action.',
    },
    {
      id: 'when',
      attribute: 'When it runs',
      a: 'Once, at the start of a session, and the answer is carried afterwards in a token or a cookie.',
      b: 'On every request, because the answer depends on what is being asked for this time and by whom.',
    },
    {
      id: 'failure',
      /* The row the comparison exists for: the two status codes are where the
         distinction stops being philosophical and starts costing debugging time. */
      attribute: 'What failure looks like',
      a: '401. The server is saying it does not know who you are, so signing in again is the thing that helps.',
      b: '403. The server knows exactly who you are, it has checked, and the answer is still no.',
      pivot: true,
    },
  ],
  caption: 'Signing in again fixes a 401. It has never once fixed a 403.',
}

/**
 * SIX ROWS OF SHORT CELLS, WHICH IS THE CONTENT `PairGrid` EXISTS FOR.
 *
 * Python's list against its tuple: six attributes whose answers are a word, a
 * literal or a short phrase. This is the shape the other three variants handle
 * worst, and for the same reason in each case.
 *
 * A VERTICAL LIST OF SIX SHORT ROWS IS MOSTLY EMPTY. `AttributeSpine` gives
 * "Yes" a 476px column and stacks six of them, which is about 390px of figure
 * height carrying roughly twelve words. The height is spent on the count and the
 * width is spent on nothing. `PairGrid` turns the set ninety degrees: three
 * cards across, two down, so the six attributes use the width they were being
 * denied and the figure is two rows tall instead of six.
 *
 * The cells are 3 to 28 characters, well inside `PairGrid`'s own 60-character
 * ceiling, and the longest is deliberately at the edge of what a 312px card
 * holds on one line.
 */
export const pyFixture: ComparisonFigureProps = {
  a: { id: 'list', label: 'list', gloss: 'a collection you change', icon: 'file', tone: 'neutral' },
  b: { id: 'tuple', label: 'tuple', gloss: 'a record that is fixed', icon: 'lock', tone: 'contrast' },
  rows: [
    { id: 'literal', attribute: 'How you write one', a: '[1, 2, 3]', b: '(1, 2, 3)' },
    /* The pivot: every other row on this card is a consequence of this one. */
    { id: 'mutable', attribute: 'Can it be changed', a: 'Yes, in place.', b: 'No, ever.', pivot: true },
    { id: 'dictkey', attribute: 'Usable as a dict key', a: 'No. It is unhashable.', b: 'Yes.' },
    { id: 'methods', attribute: 'Methods it carries', a: 'About eleven.', b: 'Two: count and index.' },
    { id: 'memory', attribute: 'Memory for the same items', a: 'Larger, and it over-allocates.', b: 'Smaller, and exact.' },
    { id: 'reach', attribute: 'When you reach for it', a: 'A list of things you will edit.', b: 'One record with fixed fields.' },
  ],
  caption: 'Same items either way. The difference is whether the shape is allowed to move.',
}
