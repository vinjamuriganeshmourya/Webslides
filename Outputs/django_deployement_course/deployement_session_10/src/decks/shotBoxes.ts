import type { ShotHighlight } from './figures/AnnotatedShot'

/**
 * Highlight boxes for the session's captures, as percentages of each file.
 *
 * EVERY BOX HERE WAS MEASURED AND THEN CHECKED, not estimated. The loop is:
 *
 *   1. read the coordinates off the grid in `slide-kit/shot-lab`, port 5237,
 *      which lays a labelled 10% grid over the capture
 *   2. crop exactly that box back out and look at it:
 *
 *        cd workflow/captures/session-10
 *        ./verify-box.sh dep-06-sg-three-rules 68.5 55 10 11
 *
 *      If the crop is not exactly the thing you meant to point at, the numbers
 *      are wrong. A box three per cent out looks fine in the source and sits
 *      beside the button on the slide.
 *
 * Boxes are grouped by the capture they belong to, because a capture is
 * usually annotated more than once and the numbers only make sense together.
 */

/* ── Starting the instance ────────────────────────────────────────────── */

/** The Instance state menu, with Start instance enabled and Stop greyed out. */
export const START_INSTANCE_ITEM: ShotHighlight = { left: 73.5, top: 19, width: 11.5, height: 3.2 }

/* ── The security group, before and after ─────────────────────────────── */

/** All three inbound rules the instance arrived with. */
export const SG_THREE_RULES: ShotHighlight = { left: 15.5, top: 56, width: 82.5, height: 10 }

/** Just the Port range column: 22, 22, 8000. The whole failure is what is NOT
 *  in this column, so the highlight is the column and not a rule. */
export const SG_PORT_COLUMN: ShotHighlight = { left: 68.5, top: 55, width: 10, height: 11 }

/** The rule that fixed it, alone, in the list of four. */
export const SG_RULE_3000: ShotHighlight = { left: 15.5, top: 66, width: 82.5, height: 4.2 }

/** The fourth row being composed on the Edit inbound rules form: Custom TCP,
 *  3000, and the description. Verified with verify-box.sh. */
export const SG_NEW_ROW_FORM: ShotHighlight = { left: 8, top: 48, width: 82, height: 8 }

/** Both instances' Public IPv4 and Elastic IP columns, side by side. The point
 *  is that the two columns now hold the SAME value: the Elastic IP became the
 *  public address rather than sitting beside it. Verified. */
export const INSTANCES_ELASTIC_COLUMNS: ShotHighlight = { left: 76.5, top: 20.5, width: 23, height: 12 }

/** The Payload URL field on GitHub, still holding an ngrok address. Verified. */
export const WEBHOOK_NGROK_URL: ShotHighlight = { left: 37, top: 38, width: 44, height: 5 }
