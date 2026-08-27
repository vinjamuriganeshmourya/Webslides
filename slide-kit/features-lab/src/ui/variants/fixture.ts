import type { FeaturesFigureProps } from './featuresFigure'

/**
 * ONE FIXTURE, RENDERED BY EVERY VARIANT.
 *
 * The comparison is worth nothing unless the content is identical, so this is
 * the only content in the lab. A variant that needs different words to look good
 * has told you something.
 *
 * Deliberately NOT a concept from the corpus. A lab that dresses its candidates
 * in one session's content gets picked on how well it renders that session, and
 * the winner then goes into the kit for every other one. A note app is the
 * stand-in because everyone in the room already knows what one does, so no
 * attention goes on understanding the example instead of judging the layout.
 *
 * WHAT IT DELIBERATELY STRESSES
 *
 *   - FIVE features, which is the realistic upper-middle of the range and the
 *     count a flat grid handles worst
 *   - ONE hero, so a variant has to show that something leads
 *   - both `body` and `outcome` on every item, so a variant has to decide where
 *     the "what it buys you" line goes, or admit it has nowhere to put it
 *   - labels of uneven length, because a layout that only composes when every
 *     label is one word is not usable
 */
export const noteAppFeatures: Pick<FeaturesFigureProps, 'items'> = {
  items: [
    {
      id: 'search',
      metric: { value: '40', unit: 'ms to first result' },
      without: 'You lose an afternoon a week to filing',
      label: 'Search everything',
      body: 'Full text, across every note, as you type',
      outcome: 'You stop filing things and just find them',
      icon: 'eye',
      weight: 'hero',
      detail: 'Indexes on write rather than on read, so the first keystroke already has results. Attachments are indexed too.',
    },
    {
      id: 'sync',
      metric: { value: '100', unit: 'per cent available offline' },
      without: 'A tunnel or a bad hotel costs you the session',
      label: 'Offline first',
      body: 'Every note is on the device, not just cached',
      outcome: 'A tunnel changes nothing',
      icon: 'devices',
      detail: 'The network is treated as an optimisation. Conflicts resolve per paragraph rather than per note, so two people editing different sections never collide.',
    },
    {
      id: 'links',
      metric: { value: '0', unit: 'folders to design up front' },
      without: 'You design the folder tree before you know the shape',
      label: 'Links between notes',
      body: 'Reference any note from any other',
      outcome: 'The structure emerges instead of being planned',
      icon: 'link',
      detail: 'Backlinks are derived, never stored, so a rename can never leave a dangling reference behind.',
    },
    {
      id: 'history',
      metric: { value: 'every', unit: 'keystroke burst kept' },
      without: 'One bad paste and the paragraph is gone',
      label: 'Version history',
      body: 'Every save, kept and diffable',
      outcome: 'Nothing you write can be lost',
      icon: 'file',
      detail: 'Snapshots are per keystroke burst rather than per save, so recovering means picking a moment rather than a file.',
    },
    {
      id: 'export',
      metric: { value: '1', unit: 'folder, no export step' },
      without: 'Leaving means exporting, converting and checking',
      label: 'Plain files on disk',
      body: 'Markdown in a folder you own',
      outcome: 'Leaving costs you nothing',
      icon: 'folder',
      detail: 'No database, no proprietary container. The app is a reader for a directory that would still make sense without it.',
    },
  ],
}

export const FIXTURE_CAPTION = 'Five capabilities, and only one of them is the reason people switch.'

/**
 * A SECOND FIXTURE, AND ONLY `AnnotatedShot` USES IT.
 *
 * That variant pins its callouts to regions of a real screenshot, so the features
 * it lists have to be features OF THE THING IN THE PICTURE. The note app above
 * has no picture: it is a stand-in, and hard rule 11 forbids inventing a
 * screenshot of it, while hard rule 8 forbids annotating an unrelated capture
 * with unrelated claims.
 *
 * **That is the variant's main cost, not a gap in this lab.** `AnnotatedShot`
 * only works where a real capture of the actual product exists, and it therefore
 * cannot be compared like for like against the other five. It is judged on
 * whether the form is worth having, not on the same words.
 *
 * The capture is `public/shots/s1-app-products.png`, a real screenshot from
 * deployment session 1: the React storefront reading live products from Django.
 * The features below are things that screenshot genuinely shows.
 */
export const storefrontFeatures: Pick<FeaturesFigureProps, 'items'> = {
  items: [
    {
      id: 'live',
      label: 'Live data, not fixtures',
      body: 'Every card is a row Django returned',
      outcome: 'What you see is what the API said',
      weight: 'hero',
      detail: 'The list is fetched on mount from /api/products/. Nothing on this screen is hardcoded, which is why an empty database renders an empty grid rather than placeholders.',
    },
    {
      id: 'grid',
      label: 'One component per product',
      body: 'The grid maps over the response',
      outcome: 'Ten products or ten thousand, one component',
      detail: 'A single ProductCard, rendered once per item. Adding a field to the serializer is the only change needed to show it here.',
    },
    {
      id: 'price',
      label: 'Formatted on the client',
      body: 'The API sends a number, React renders currency',
      outcome: 'The same data suits every locale',
      detail: 'The serializer returns a decimal. Formatting is a presentation concern and stays on the client, so a second front end can format it differently.',
    },
  ],
}

export const STOREFRONT_CAPTION = 'Three claims, each pinned to the part of the screen that proves it.'

/**
 * A THIRD FIXTURE, AND ONLY `MetricLed` USES IT.
 *
 * `MetricLed` sets every number at one size, in one colour, in one field. That
 * asserts the numbers are five readings of the SAME instrument, and on
 * `noteAppFeatures` they are not: 40 is milliseconds, 100 is a percentage, 0 is a
 * count of folders and "every" is not a number at all. No amount of unit text
 * under each figure repairs that, because the assertion is made by the layout
 * before the units are read.
 *
 * **That is a precondition of the variant, not a bug in it.** `MetricLed` needs a
 * feature set whose metrics are commensurable, and plenty of real sets are not.
 * Rather than manufacture comparable numbers for the note app, which would be
 * fabrication, the variant gets a set where the precondition genuinely holds:
 * every figure below is SECONDS, of the same pipeline, measured the same way.
 *
 * So it is the second variant in this lab that cannot be judged on the shared
 * fixture, after `AnnotatedShot`. Both facts are the useful output: a lab exists
 * to find out that a design has an entry requirement, and to find it out before a
 * deck does.
 *
 * The numbers are illustrative, and the fixture says so. They are not measured
 * from anything, which is fine for a lab and would not be fine on a slide: hard
 * rule 11's principle is that a figure must not claim a measurement it did not
 * make.
 */
export const pipelineFeatures: Pick<FeaturesFigureProps, 'items'> = {
  items: [
    {
      id: 'cache',
      label: 'Layer caching',
      body: 'Unchanged layers are never rebuilt',
      outcome: 'Most builds skip most of the work',
      metric: { value: '9', unit: 'seconds' },
      weight: 'hero',
      detail: 'Illustrative figures, all measured the same way: wall clock for one full build of the same commit on the same machine.',
    },
    {
      id: 'parallel',
      label: 'Parallel test shards',
      body: 'The suite splits across four workers',
      outcome: 'Tests stop being the long pole',
      metric: { value: '24', unit: 'seconds' },
    },
    {
      id: 'slim',
      label: 'Slim base image',
      body: 'A smaller image to pull and push',
      outcome: 'Less waiting on every machine',
      metric: { value: '11', unit: 'seconds' },
    },
    {
      id: 'prune',
      label: 'Pruned build context',
      body: 'A dockerignore that actually excludes things',
      outcome: 'The daemon stops reading node_modules',
      metric: { value: '6', unit: 'seconds' },
    },
  ],
}

export const PIPELINE_CAPTION = 'Four changes, all measured the same way: seconds off one build.'
