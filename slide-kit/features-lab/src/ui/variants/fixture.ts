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
      label: 'Search everything',
      body: 'Full text, across every note, as you type',
      outcome: 'You stop filing things and just find them',
      icon: 'eye',
      weight: 'hero',
      detail: 'Indexes on write rather than on read, so the first keystroke already has results. Attachments are indexed too.',
    },
    {
      id: 'sync',
      label: 'Offline first',
      body: 'Every note is on the device, not just cached',
      outcome: 'A tunnel changes nothing',
      icon: 'devices',
      detail: 'The network is treated as an optimisation. Conflicts resolve per paragraph rather than per note, so two people editing different sections never collide.',
    },
    {
      id: 'links',
      label: 'Links between notes',
      body: 'Reference any note from any other',
      outcome: 'The structure emerges instead of being planned',
      icon: 'link',
      detail: 'Backlinks are derived, never stored, so a rename can never leave a dangling reference behind.',
    },
    {
      id: 'history',
      label: 'Version history',
      body: 'Every save, kept and diffable',
      outcome: 'Nothing you write can be lost',
      icon: 'file',
      detail: 'Snapshots are per keystroke burst rather than per save, so recovering means picking a moment rather than a file.',
    },
    {
      id: 'export',
      label: 'Plain files on disk',
      body: 'Markdown in a folder you own',
      outcome: 'Leaving costs you nothing',
      icon: 'folder',
      detail: 'No database, no proprietary container. The app is a reader for a directory that would still make sense without it.',
    },
  ],
}

export const FIXTURE_CAPTION = 'Five capabilities, and only one of them is the reason people switch.'
