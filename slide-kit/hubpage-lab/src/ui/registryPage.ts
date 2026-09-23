/**
 * THE ONE CONTRACT ALL FOUR CANDIDATES TAKE.
 *
 * `comparison-lab` and `flow-lab` both work this way: every candidate takes
 * identical props, so choosing between them is a rename at the call site and
 * the gallery can render one fixture four times with the drawing as the only
 * variable.
 *
 * WHAT THIS CONTRACT MAY CARRY IS FIXED BY THE PLAN, NOT BY THE DRAWING.
 * Session 6 cannot capture anything (build rule R6: Docker Desktop will not run
 * on the capture machine, and this slide additionally needs a real Hub account
 * and a real push). So the figure stands in for a capture that cannot be taken,
 * and content rule 8 plus the spirit of rule 11 mean it may show ONLY what the
 * signed-off plan's section 6.1 authorises:
 *
 *   - the repository name
 *   - a Tags listing: the tag `v1`, its size, and when it was pushed
 *   - the `docker pull <repo>:<tag>` command Hub displays for copying
 *
 * There are deliberately no fields for a star count, a pull count, a description,
 * an overview body, a signed-in user, a second navigation tab or an "Updated by"
 * line. A candidate that needs one of those to look convincing is a candidate
 * with a fabrication problem, and the absence of the field is where that shows
 * up -- the same way `AnalogyMap`'s props were the tell in `comparison-lab`.
 */

export interface RegistryTagRow {
  /** e.g. `v1`. */
  tag: string
  /** e.g. `156MB`, exactly as `docker images` reported it. */
  size: string
  /** When it was pushed, in the words the deck already uses: `2 hours ago`. */
  pushed: string
  /**
   * The image ID, e.g. `3f2a8b91c04d`.
   *
   * ONLY `SplitProof` reads this, because it is the only candidate whose whole
   * argument is that the ID on the laptop and the ID on Hub are the same twelve
   * characters. The other three ignore it: Hub's Tags tab shows a digest, not
   * this ID, so drawing it inside a page view would be a page that lies.
   */
  imageId?: string
  /** The row the slide is about, lit. There is one on this slide, `v1`. */
  key?: boolean
}

/**
 * The matching row from `docker images` on the learner's own machine.
 *
 * ONLY `SplitProof` reads this, and that asymmetry is itself a finding: a
 * correspondence figure needs a second fact that a page figure has no place for.
 * It is optional so one fixture still serves all four.
 */
export interface RegistryLocalRow {
  repository: string
  tag: string
  imageId: string
  created: string
  size: string
}

export interface RegistryPageProps {
  /** The repository's full name, `<docker id>/<image>`. */
  repo: string
  /** Hub says PUBLIC or PRIVATE on the repository, and which one is the point. */
  visibility: 'public' | 'private'
  /** The address the room would type. Drawn only by `RepoPage`. */
  url?: string
  tags: RegistryTagRow[]
  /** The full command, e.g. `docker pull ravi123/nxttrendz-backend:v1`. */
  pullCommand: string
  local?: RegistryLocalRow
  caption?: string
  /**
   * Half a slide's width rather than the full well.
   *
   * The final slide may pair the figure with a points column, so every candidate
   * has to survive about 560px. This is a real prop and not a media query
   * because the canvas is a fixed 1280x720 and there are no breakpoints in this
   * repo.
   */
  compact?: boolean
  className?: string
}
