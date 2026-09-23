import { Reveal, RevealGroup } from '@/motion/Reveal'
import { colors, accentByTone, type Tone } from '@/design/tokens'
import { figureTiming as T } from '@/ui'

/**
 * The sports club application form: this session's one analogy, drawn once.
 *
 * The source PPTX returns to the same form on nine slides, each time with a new
 * thing pointed at: first empty, then filled, then the left column named
 * "Variable Names", then the right column "Values stored in variables", then
 * one answer at a time tagged with its data type. So the figure is one card
 * whose props say which of those states it is in, and the deck never redraws
 * the form.
 *
 * SESSION-OWNED, on purpose. A second deck would want a different form, so
 * this stays in `src/decks/figures/` rather than the kit. DOM, colours from
 * tokens (content rule 17).
 */

export type FormField = 'sport' | 'age' | 'height' | 'participated'

const FIELDS: { key: FormField; label: string }[] = [
  { key: 'sport', label: 'Sport :' },
  { key: 'age', label: 'Age (in yrs) :' },
  { key: 'height', label: 'Height (in ft) :' },
  { key: 'participated', label: 'Did you participate anywhere before?' },
]

/** The filled-in form, exactly as the source fills it. */
export const FILLED: Record<FormField, string> = {
  sport: 'Cricket',
  age: '10',
  height: '4.2',
  participated: 'Yes',
}

const TAG_TONE: Record<string, Tone> = {
  String: 'accent',
  Integer: 'brand',
  Float: 'teal',
  Boolean: 'success',
}

function Tag({ text }: { text: string }) {
  const color = accentByTone[TAG_TONE[text] ?? 'brand']
  return (
    <span className="rounded-pill px-3.5 py-1 font-heading text-body-sm font-bold text-white" style={{ background: color }}>
      {text}
    </span>
  )
}

/** A column heading drawn as a tag, for the two "Names and Values" slides. */
function ColumnLabel({ text }: { text?: string }) {
  return (
    <span className="min-h-[30px] font-heading text-body-sm font-bold uppercase tracking-wider" style={{ color: colors.brand }}>
      {text}
    </span>
  )
}

export function ApplicationForm({
  values,
  tags = {},
  columnLabels,
  className = '',
}: {
  /** Omit for the blank form. */
  values?: Record<FormField, string>
  /** A data-type tag at the end of a row: `{ sport: 'String' }`. */
  tags?: Partial<Record<FormField, string>>
  /** Headings over the two columns, for the Names and Values slides. */
  columnLabels?: { names?: string; values?: string }
  className?: string
}) {
  return (
    <RevealGroup stagger={T.stagger} delayChildren={T.lead} className={`mx-auto w-[820px] ${className}`}>
      <Reveal dir="up">
        <div className="overflow-hidden rounded-card border border-line bg-white shadow-card">
          <div className="border-b border-line bg-surface px-6 py-3 text-center font-heading text-[20px] font-bold text-ink">
            Application Form
          </div>
          <div className="grid grid-cols-[1.4fr_1fr_auto] items-center gap-x-6 px-6 pt-4">
            <ColumnLabel text={columnLabels?.names} />
            <ColumnLabel text={columnLabels?.values} />
            <span />
          </div>
          <div className="px-6 pb-5">
            {FIELDS.map((f) => (
              <div key={f.key} className="grid grid-cols-[1.4fr_1fr_auto] items-center gap-x-6 border-b border-line py-3.5 last:border-0">
                <span className="text-body-lg text-ink">{f.label}</span>
                <span className="min-h-[36px] rounded-lg border border-dashed border-line bg-surface px-3 py-1 font-mono text-[20px] text-ink">
                  {f.key === 'participated' ? (
                    <span className="flex items-center gap-4">
                      <Option label="Yes" checked={values?.participated === 'Yes'} />
                      <Option label="No" checked={values?.participated === 'No'} />
                    </span>
                  ) : (
                    (values?.[f.key] ?? '')
                  )}
                </span>
                <span className="min-w-[92px] text-right">{tags[f.key] && <Tag text={tags[f.key]!} />}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </RevealGroup>
  )
}

function Option({ label, checked }: { label: string; checked?: boolean }) {
  return (
    <span className="flex items-center gap-1.5 font-body text-body-lg">
      <span
        className="grid h-5 w-5 place-items-center rounded border text-[13px] font-bold text-white"
        style={{ borderColor: colors.muted, background: checked ? colors.success : colors.white }}
      >
        {checked ? '✔' : ''}
      </span>
      {label}
    </span>
  )
}
