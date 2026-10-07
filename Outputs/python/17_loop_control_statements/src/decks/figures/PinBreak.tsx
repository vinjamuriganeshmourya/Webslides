import { PinStory, type Frame } from './PinStory'

/**
 * THE PIN, WITH BREAK. PF 17 slide 10, the first time the room sees `break`,
 * four clicks (feedback of 2026-10-06, change 3). The hook's own program and
 * phone come back, with one new line: the phone is redrawn beside the code
 * because the numbers are the same (1111, 4821, ₹40), the test
 * `pedagogy-to-components` Part I sets for a second appearance. The green
 * arrow out of the loop is slide 8's `break: jump out` and carries the same
 * words as the plan's arrow two slides earlier, `leave now`.
 *
 * Inputs 1111, 4821. Real run (CPython 3.12.3): `Incorrect PIN`,
 * `Payment successful`, then the program ends. Try 3 never happens.
 */
const CODE = 'correct_pin = "4821"\nfor attempt in range(3):\n    pin = input()\n    if pin == correct_pin:\n        print("Payment successful")\n        break\n    else:\n        print("Incorrect PIN")'

const BEATS: Frame[][] = [
  /* 1: the new line arrives, chipped `new`, before it runs */
  [],
  /* 2: line 3, then line 8: try 1 wrong */
  [{ line: 3, screen: 'pin1' }, { line: 8, screen: 'pin1x', out: 'Incorrect PIN', tiles: { 1: 'wrong' } }],
  /* 3: line 3, line 5, line 6: paid, then the arrow leaves the loop */
  [{ line: 3, screen: 'pin2' }, { line: 5, screen: 'paid', out: 'Payment successful', tiles: { 2: 'right' } }, { line: 6, arrow: true }],
  /* 4: nothing lights: there is no third try */
  [{ tiles: { 3: 'never' } }],
]

export function PinBreak() {
  return <PinStory code={CODE} rows={8} beats={BEATS} newLine={6} arrowFrom={6} outHeight={118} />
}
