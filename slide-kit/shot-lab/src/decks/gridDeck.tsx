import type { DeckMeta, SlideDef } from '@/deck/types'
import { ContentSlide } from '@/slides'

/**
 * A measuring tool, not a design.
 *
 * `AnnotatedShot` takes highlight boxes as PERCENTAGES of the capture, and
 * guessing them produces boxes that sit next to the thing they point at. This
 * lays a labelled 10% grid over a capture so the numbers can be read off
 * instead: find the corner of the button, read the nearest gridline, adjust.
 *
 * One slide per capture that session 10 actually annotates. Delete a row when
 * its coordinates are recorded in the session's `shotBoxes.ts`.
 */
const SHOTS: { file: string; what: string }[] = [
  { file: 'dep-02-instance-state-menu', what: 'Instance state menu, Start instance' },
  { file: 'dep-06-sg-three-rules', what: 'The three inbound rules, and the missing 3000' },
  { file: 'dep-07-edit-inbound-rules', what: 'Edit inbound rules, the Add rule button' },
  { file: 'dep-08-new-rule-3000', what: 'The composed 3000 rule' },
  { file: 'dep-11-sg-four-rules', what: 'Four rules, the new row' },
  { file: 'dep-15-allocate-form', what: 'Allocate Elastic IP, the Allocate button' },
  { file: 'dep-16-allocated', what: 'Allocated, the empty Associated instance column' },
  { file: 'dep-19-associated', what: 'Associated, the instance and private IP' },
  { file: 'dep-25-credentials-store', what: 'The credential store, Add Credentials' },
  { file: 'dep-29-five-stages-deploy-log', what: 'Five stages, and the Deploy log' },
  { file: 'jen-01-launch-name-ubuntu', what: 'Launch form, the Name field and Ubuntu tile' },
  { file: 'jen-02-jenkins-sg-rules', what: 'jenkins-sg, the two My IP rules' },
  { file: 'jen-03-storage-20gib', what: 'Storage raised to 20 GiB' },
  { file: 'jen-05-two-instances', what: 'Two instances in one list' },
  { file: 'jen-06-sg-source-is-jenkins-sg', what: 'The rule whose source is a security group' },
  { file: 'jen-09-github-webhook-ranges', what: "GitHub's four ranges on 8080" },
  { file: 'jen-11-build-1-on-aws', what: 'Build one on AWS, the stage row' },
  { file: 'jen-17-github-hook-log', what: 'The hook log and its source address' },
]

/** A 10% grid with the percentage printed on every line. */
function Grid({ file }: { file: string }) {
  const ticks = [10, 20, 30, 40, 50, 60, 70, 80, 90]
  return (
    <div className="relative mx-auto" style={{ width: 1000 }}>
      <img src={`/shots/${file}.png`} alt="" style={{ width: 1000, display: 'block' }} />
      <svg className="absolute inset-0" width="100%" height="100%" style={{ pointerEvents: 'none' }}>
        {ticks.map((t) => (
          <g key={`v${t}`}>
            <line x1={`${t}%`} y1="0" x2={`${t}%`} y2="100%" stroke="#DC2626" strokeWidth={t === 50 ? 1.4 : 0.7} opacity={0.65} />
            <text x={`${t}%`} y="12" fontSize="11" fill="#DC2626" textAnchor="middle" fontWeight="700">{t}</text>
          </g>
        ))}
        {ticks.map((t) => (
          <g key={`h${t}`}>
            <line x1="0" y1={`${t}%`} x2="100%" y2={`${t}%`} stroke="#2563EB" strokeWidth={t === 50 ? 1.4 : 0.7} opacity={0.6} />
            <text x="3" y={`${t}%`} fontSize="11" fill="#2563EB" dy="-2" fontWeight="700">{t}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

export const gridDeck: SlideDef[] = SHOTS.map(({ file, what }) => ({
  id: `grid-${file}`,
  section: 'Measuring',
  label: file,
  element: (
    <ContentSlide kicker="Measure" title={file} lead={what} lesson="Highlight lab">
      <Grid file={file} />
    </ContentSlide>
  ),
}))

export const gridMeta: DeckMeta = { title: 'Session 10 highlight measuring', lesson: 'Highlight lab' }
