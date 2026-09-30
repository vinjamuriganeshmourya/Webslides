import type { DefinitionFigureProps } from './definitionFigure'

/**
 * ONE SET OF TERMS, RENDERED BY EVERY VARIANT.
 *
 * The comparison is worth nothing unless the content is identical, so this is
 * almost the only content in the lab. A variant that needs a different set to
 * look good has told you something.
 *
 * WHY THESE THREE, AND HOW THEY ARE CHOSEN TO STRESS THE GEOMETRY
 *
 * Placeholder content, but not arbitrary: these are three terms a CS course
 * actually defines, and each statement here is true and would be defended. That
 * matters because a definition figure's failure mode is a card that reads
 * beautifully and teaches something false.
 *
 * The set is picked to break the layouts rather than to flatter them:
 *
 *   - **The definitions are deliberately different lengths.** Idempotency is 71
 *     characters, one line at every card width in the lab. Memoization is 201, so
 *     two or three lines. Race condition is 236 over two sentences, which is four
 *     lines in `TermGrid`'s column and three in a card. That spread is the whole
 *     test: a variant that sizes for the short one makes the long one eat its own
 *     padding, and a variant that sizes for the long one strands 80px under the
 *     short one. Every variant here is checked against all three at once, in a row
 *     where they have to end level.
 *   - **The terms are 11, 12 and 14 characters**, which is the awkward range: long
 *     enough that a 28px display setting is not free, short enough that nothing
 *     wraps, so a variant cannot get credit for handling a wrap it never sees.
 *     `resolveDefinitions` guards the real ceiling at 28.
 *   - **Every term carries an example, and every example is 2 or 3 lines.** The
 *     three-line one (race condition) is what proves the example zone grows
 *     without pushing the card off the frame.
 *   - **One term is `new`, one `neutral`, one `contrast`**, so a variant that
 *     paints every card identically is visibly making a claim it did not mean.
 *   - **Every glyph depicts its own term** rather than the topic, per hard rule 8:
 *     a bolt for a timing collision, a shield for an operation that is safe to
 *     repeat, a database for a stored answer. None of the three is a cog.
 *
 * WHY THE EXAMPLES ARE NOT REAL TRANSCRIPTS
 *
 * They are illustrations, and they are framed as illustrations: `ExampleBlock` is
 * a tinted well in the mono face, deliberately NOT the kit's `CodeBlock`, which
 * draws a file with traffic lights and a filename and would claim these came off
 * disk. Nothing here is presented as captured output, so the never-invent-output
 * rule is satisfied by the framing rather than broken by the content.
 */
export const csTermsFixture: DefinitionFigureProps = {
  terms: [
    {
      id: 'race-condition',
      term: 'Race Condition',
      gloss: 'a timing bug',
      /* 236 characters, two sentences: the long end of what this lab holds. */
      definition:
        'Two operations read the same value before either has written its result back, so one of the two writes is silently lost. Which one wins depends on scheduling, which is why it shows up on the build server and never on your laptop.',
      example:
        'A: read balance -> 100      B: read balance -> 100\nA: write 70                 B: write 50\nbalance is 50, and 30 went missing',
      exampleNote: 'Both reads saw 100, so the first write was overwritten',
      icon: 'bolt',
      /* The term this frame exists to introduce. */
      tone: 'new',
    },
    {
      id: 'idempotency',
      term: 'Idempotency',
      gloss: 'safe to retry',
      /* 71 characters, one sentence: the short end. */
      definition: 'Calling it twice leaves the system in the same state as calling it once',
      example: 'PUT /users/7  {"tier":"pro"}  -> 200 OK\nPUT /users/7  {"tier":"pro"}  -> 200 OK',
      exampleNote: 'The second call is not an error, it is a no-op',
      icon: 'shield',
      tone: 'neutral',
    },
    {
      id: 'memoization',
      term: 'Memoization',
      gloss: 'cache the answer',
      /* 201 characters, two sentences: the middle. */
      definition:
        'The function keeps a table of the arguments it has already been called with and returns the stored answer instead of computing it again. Only safe when the same input always gives the same output.',
      example: 'fib(35)  first call   1.240 s\nfib(35)  again        0.000004 s',
      exampleNote: 'The second call never enters the function body',
      icon: 'database',
      /* Set against caching, which is the thing every room confuses it with. */
      tone: 'contrast',
    },
  ],
  caption: 'Three words a room will nod at and then use interchangeably.',
}

/**
 * A SECOND SET, FOR THE ONE VARIANT WHOSE ARGUMENT IS DENSITY.
 *
 * The sibling labs keep exactly one fixture, and warn that a variant needing
 * different content to look good has told you something. That warning is about
 * flattery, and this is not that: `TermGrid` exists to answer "what do you do
 * when the slide is a six-term recap", and rendering it with three terms would
 * show it looking fine at a load it was not built for. Testing a dense variant
 * on a sparse set is the same mistake as sizing a card for the short definition.
 *
 * So slide 5 renders the three-term set AND this one, in that order, and the
 * comparison against the other four variants is still made on the three-term set.
 *
 * These definitions are short on purpose. Six terms with 200-character
 * definitions is not a slide at any density, and `resolveDefinitions` caps the
 * count at six, which this set sits exactly on.
 */
export const glossaryFixture: DefinitionFigureProps = {
  terms: [
    {
      id: 'race-condition',
      term: 'Race Condition',
      definition: 'Two writes interleave and one is silently lost',
      tone: 'new',
    },
    {
      id: 'idempotency',
      term: 'Idempotency',
      definition: 'Calling it twice is the same as calling it once',
    },
    {
      id: 'memoization',
      term: 'Memoization',
      definition: 'Return the stored answer instead of computing it again',
      tone: 'contrast',
    },
    {
      id: 'deadlock',
      term: 'Deadlock',
      definition: 'Each side holds what the other is waiting for, so neither moves',
    },
    {
      id: 'back-pressure',
      term: 'Back Pressure',
      definition: 'A slow consumer telling a fast producer to send less',
    },
    {
      id: 'cold-start',
      term: 'Cold Start',
      definition: 'The first call pays for the runtime the later ones reuse',
    },
  ],
  caption: 'Six terms, one frame, as a recap of words the room has already met.',
}

/**
 * THE SAME TERMS AT ONE AND AT TWO, FOR THE COUNT-SPECIFIC VARIANTS.
 *
 * WHY THESE ARE SLICES AND NOT NEW CONTENT
 *
 * The lab's rule is that the comparison is worth nothing unless the content is
 * identical, and it applies across counts as hard as it applies across variants:
 * a one-term layout shown a short, friendly definition and a three-term layout
 * shown the 236-character one is not a comparison of layouts, it is a comparison
 * of copy. So these take the shared fixture's own terms, in the shared fixture's
 * own order, and change nothing but the caption, which belongs to the SET rather
 * than to any term in it.
 *
 * WHY THE SLICE STARTS AT THE HARDEST TERM
 *
 * `csTermsFixture.terms[0]` is the race condition: 236 characters over two
 * sentences, the longest definition in the lab, and a three-line example, the
 * longest example in the lab. A one-definition frame has a whole 1152x440 well
 * and nothing to share it with, so it is the layout most likely to look correct
 * on easy content and fall apart on real content. Handing it the worst case is
 * the only way the well's height budget gets tested at all.
 *
 * The pair adds idempotency, 71 characters, which is deliberate in the other
 * direction: 236 against 71 is the widest length spread the lab holds, so two
 * cards side by side have to end level while one of them carries three times the
 * prose of the other. A pair of evenly matched definitions would have proved
 * nothing about the equal-height row.
 */
export const soloTermFixture: DefinitionFigureProps = {
  terms: csTermsFixture.terms.slice(0, 1),
  caption: 'One word, one frame, and the whole well to say it in.',
}

export const pairTermsFixture: DefinitionFigureProps = {
  terms: csTermsFixture.terms.slice(0, 2),
  caption: 'Two words on one frame: the long definition and the short one, ending level.',
}
