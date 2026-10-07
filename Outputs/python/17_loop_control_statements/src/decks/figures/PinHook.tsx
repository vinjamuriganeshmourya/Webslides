import { PinStory, type Frame } from './PinStory'

/**
 * THE PIN THAT KEEPS ASKING. PF 17 slide 4, the hook for break, five clicks.
 *
 * A UPI payment on a phone: the app allows three tries at the PIN, the first
 * is wrong, the second is right and the money goes, and then the app asks a
 * third time and takes the money again. Reworked on the feedback of
 * 2026-10-06 (change 1): the program that runs the app sits beside the
 * phone, so the room traces the bug to a line instead of being told the
 * cause (content rule 23: the cost before the mechanism). The word `break`
 * is not on this frame; the plan in plain English moved to the next slide.
 *
 * Inputs 1111, 4821, 4821. Real run (CPython 3.12.3): `Incorrect PIN`,
 * `Payment successful`, `Payment successful`. The app takes the money twice.
 */
const CODE = 'correct_pin = "4821"\nfor attempt in range(3):\n    pin = input()\n    if pin == correct_pin:\n        print("Payment successful")\n    else:\n        print("Incorrect PIN")'

const BEATS: Frame[][] = [
  /* 1: the whole program, the pay sheet */
  [],
  /* 2: line 3, then line 7: try 1, the wrong PIN */
  [{ line: 3, screen: 'pin1' }, { line: 7, screen: 'pin1x', out: 'Incorrect PIN', tiles: { 1: 'wrong' } }],
  /* 3: line 3, then line 5: try 2, the right PIN, the money goes */
  [{ line: 3, screen: 'pin2' }, { line: 5, screen: 'paid', out: 'Payment successful', tiles: { 2: 'right' }, paid: 40 }],
  /* 4: line 3: the PIN screen again */
  [{ line: 3, screen: 'pin3', tiles: { 3: 'again' } }],
  /* 5: line 5: paid again, ₹80 gone */
  [{ line: 5, screen: 'paid', out: 'Payment successful', tiles: { 3: 'twice' }, paid: 80 }],
]

export function PinHook() {
  return <PinStory code={CODE} rows={7} beats={BEATS} outHeight={128} ledger />
}
