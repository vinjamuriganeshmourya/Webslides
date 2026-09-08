import type { PseudoFigureProps } from './pseudoFigure'

/**
 * ONE ALGORITHM, RENDERED BY EVERY VARIANT.
 *
 * The comparison is worth nothing unless the content is identical, so this is
 * the only content in the lab. A variant that needs a different algorithm to
 * look good has told you something.
 *
 * WHY "THE LARGEST NUMBER IN A LIST"
 *
 * It is the smallest algorithm that still has everything a pseudocode figure has
 * to survive:
 *
 *   - a variable that is INITIALISED and then CHANGES, which is the only reason
 *     a trace table exists
 *   - a LOOP, so lines execute more than once and the trace has repeated rows
 *   - a BRANCH inside the loop that is sometimes taken and sometimes not, which
 *     is where a dry run earns its keep: the room can see the condition fail
 *   - two levels of INDENTATION, so nesting has to be drawn
 *   - an honest edge case worth a note (an empty list)
 *
 * It is also an algorithm nobody has to be taught, so no attention goes on
 * understanding the example instead of judging the layout.
 *
 * THE TRACE IS REAL. Every row below was worked through by hand against
 * `numbers = [3, 9, 4]`, and the values are what the algorithm actually produces.
 * A fabricated trace table would be the exact failure this lab exists to design
 * against: the figure would look right and teach something false.
 */
export const largestFixture: PseudoFigureProps = {
  title: 'Largest number in a list',
  vars: ['numbers', 'largest', 'item'],
  lines: [
    { n: 1, text: 'INPUT numbers', kind: 'io', note: 'A list of numbers to search. Assume at least one.' },
    { n: 2, text: 'SET largest TO first item of numbers', indent: 0, kind: 'assign', note: 'Start from a real value, not zero: a list of negatives would beat zero and the answer would be wrong.' },
    { n: 3, text: 'FOR EACH item IN numbers', indent: 0, kind: 'loop', note: 'Visit every value once. Order does not matter.' },
    { n: 4, text: 'IF item > largest THEN', indent: 1, kind: 'branch', note: 'The only question the algorithm asks.' },
    { n: 5, text: 'SET largest TO item', indent: 2, kind: 'assign', note: 'The new best. This is the only line that changes the answer.' },
    { n: 6, text: 'END IF', indent: 1, kind: 'plain' },
    { n: 7, text: 'END FOR', indent: 0, kind: 'plain' },
    { n: 8, text: 'OUTPUT largest', indent: 0, kind: 'io', note: 'After the loop, never inside it. Inside, it would print a running best.' },
  ],
  /*
    Dry run against [3, 9, 4]. `vars` shows state AFTER the named line ran.

    The interesting rows are 4 and 6: on the second pass the condition is TRUE
    and `largest` moves, and on the third it is FALSE and nothing happens. A
    trace table that only ever shows values changing does not teach that a
    branch can decline.
  */
  trace: [
    { line: 1, vars: { numbers: '[3, 9, 4]', largest: '', item: '' }, note: 'Nothing decided yet.' },
    { line: 2, vars: { numbers: '[3, 9, 4]', largest: '3', item: '' } },
    { line: 4, vars: { numbers: '[3, 9, 4]', largest: '3', item: '3' }, note: '3 > 3 is false. The first item never beats itself.' },
    { line: 4, vars: { numbers: '[3, 9, 4]', largest: '3', item: '9' }, note: '9 > 3 is true.' },
    { line: 5, vars: { numbers: '[3, 9, 4]', largest: '9', item: '9' }, note: 'The answer changes here, and only here.' },
    { line: 4, vars: { numbers: '[3, 9, 4]', largest: '9', item: '4' }, note: '4 > 9 is false, so line 5 is skipped.' },
    { line: 8, vars: { numbers: '[3, 9, 4]', largest: '9', item: '4' }, output: '9', note: 'The loop is over. Now it prints.' },
  ],
  /*
    The real implementation, line-aligned to the pseudocode above.

    `map[i]` is the pseudocode line that real line `i` implements. It is authored
    rather than guessed, because the pairing is a CLAIM: note that Python's
    `for item in numbers` needs no `END FOR`, so pseudocode lines 6 and 7 have no
    real counterpart at all. A variant that guessed the alignment by index would
    pair `print` with `END IF` and teach the wrong thing.
  */
  real: {
    language: 'python',
    lines: [
      'largest = numbers[0]',
      'for item in numbers:',
      '    if item > largest:',
      '        largest = item',
      'print(largest)',
    ],
    map: [2, 3, 4, 5, 8],
  },
  caption: 'One variable changes, and only on the line where the condition holds.',
}
