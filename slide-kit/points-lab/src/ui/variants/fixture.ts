import type { PointsFigureProps } from './pointsFigure'

/**
 * ONE SET OF POINTS, RENDERED BY EVERY VARIANT.
 *
 * The comparison is worth nothing unless the content is identical, so this is the
 * only content in the lab. A variant that needs a different set to look good has
 * told you something.
 *
 * WHY FOUR DOCKER NOUNS AND NOT SOMETHING NEUTRAL
 *
 * The sibling flow labs use deliberately neutral fixtures, because they are
 * choosing a shape for a diagram and a familiar subject would bias the judgement
 * toward whichever variant flatters it. A points figure is the opposite case: what
 * is being judged is whether a CLAIM plus its REASON survives at slide scale, and
 * invented copy cannot test that. Real claims have awkward lengths.
 *
 * So this is the set the course actually states, in the words it states them in:
 * image, container, volume, port. It is chosen to stress the geometry rather than
 * to flatter it:
 *
 *   - every point carries a `term`, so a variant that aligns them has something to
 *     align, and the terms are 4 to 9 characters, which is the awkward range
 *   - the labels run 41 to 44 characters, so a one-line label needs about 510px at
 *     20px and a card 260px wide has to wrap it to three
 *   - point 2's reason is 81 characters and point 4's is 48, which is the ratio
 *     that breaks a fixed-height card: size for the short one and the long one
 *     eats its own padding
 *   - one point is the LEAD, one is GOOD news and one is a RISK, so a variant that
 *     draws every point identically is visibly making a claim it did not mean
 *   - every point has a `detail`, so the hover aside is exercised on all of them
 *
 * THE POINTS ARE TRUE. Each one is a statement this course makes and would defend,
 * which matters because a points figure's failure mode is a claim that reads well
 * and is wrong.
 */
export const dockerNounsFixture: PointsFigureProps = {
  title: 'Four words that do not mean the same thing',
  points: [
    {
      id: 'image',
      term: 'Image',
      label: 'An image is a recipe, not a running thing',
      body: 'Built once, then copied. Nothing inside it is running.',
      icon: 'file',
      /* The lead, because the other three are only sayable once this one lands. */
      tone: 'lead',
      detail:
        'An image is layers plus a manifest, and it is read only. That is why two containers from one image cannot corrupt each other: neither of them can write to it.',
    },
    {
      id: 'container',
      term: 'Container',
      label: 'A container is one running copy of an image',
      body: 'Start ten containers from one image and none of them can see another one\'s memory.',
      icon: 'server',
      tone: 'neutral',
      detail:
        'It is a process on your own kernel with its own view of the filesystem and the network, which is why it starts in milliseconds and a virtual machine takes a minute.',
    },
    {
      id: 'volume',
      term: 'Volume',
      label: 'A volume outlives the container that used it',
      body: 'Delete the container and the data is still on the host.',
      icon: 'database',
      tone: 'good',
      detail:
        'This is the whole answer to "where does the database go". A container writing to its own filesystem loses everything the moment it is replaced, and it will be replaced on every deploy.',
    },
    {
      id: 'port',
      term: 'Port',
      label: 'A port has to be published to be reachable',
      body: 'Inside the container is not inside your machine.',
      icon: 'plug',
      tone: 'risk',
      detail:
        'The single most common first failure: the app is listening on 8000 inside the container, the browser asks localhost:8000 on the host, and nothing published the one to the other.',
    },
  ],
  caption: 'Four claims, one reason each, in the order they become sayable.',
}
