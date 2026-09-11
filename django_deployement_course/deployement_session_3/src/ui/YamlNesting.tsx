import { motion } from 'framer-motion'
import { colors, easing } from '@/design/tokens'
import { useInstant } from '@/motion/instant'

/**
 * YAML in 60 seconds, for a room that writes Python.
 *
 * The TR's whole claim is that YAML is two rules they already know: `key: value`
 * pairs like a dictionary, and indentation for nesting like a Python block. So
 * the figure puts the YAML beside the Python it means and draws the equivalence,
 * rather than describing YAML on its own terms.
 *
 * THE KNOWN THING IS ON THE LEFT. The Python panel comes first and the YAML second,
 * so the row reads in the direction the learning goes: from the dictionary they
 * write every day to the new format that means the same. It was the other way
 * round, which asked the room to read the unfamiliar side first and then work
 * backwards to the familiar one, and a review of the deck caught it.
 *
 * The two panels are line-aligned deliberately: row 1 of the Python sits at the
 * same height as row 1 of the YAML, so the eye pairs them without needing arrows
 * for every line. That alignment is why the title row is a FIXED height that never
 * wraps: "The Python you already write" wrapped to two lines inside a 248px panel
 * while "YAML" stayed on one, which pushed one panel's code down by a line and
 * broke every pairing under it.
 */

const YAML = [
  { text: 'person:', indent: 0 },
  { text: 'name: Ravi', indent: 1 },
  { text: 'skills:', indent: 1 },
  { text: '- python', indent: 2 },
  { text: '- react', indent: 2 },
  /* Two blank rows, pairing with Python's `]` and `}`. YAML closes a block by
     dedenting, so there is nothing to write here, and that absence IS the
     comparison the slide is making. */
  { text: '', indent: 0 },
  { text: '', indent: 0 },
]

const PY = [
  { text: 'person = {', indent: 0 },
  { text: '"name": "Ravi",', indent: 1 },
  { text: '"skills": [', indent: 1 },
  { text: '"python",', indent: 2 },
  { text: '"react",', indent: 2 },
  /*
    THE TWO CLOSING LINES ARE NOT OPTIONAL, and they were missing.

    The panel is captioned "Python you already write" and showed a dict literal
    that opened a brace and a bracket and closed neither. On the one slide whose
    argument is that YAML is a format they can already read, the exhibit was not
    a thing anyone could run. YAML's own panel is padded with two blank rows so
    the two panels stay the same height and every line still pairs with the line
    opposite it, which is the alignment the header comment above depends on.
  */
  { text: ']', indent: 1 },
  { text: '}', indent: 0 },
]

function Panel({
  title,
  lines,
  keyColor,
  instant,
  delay,
}: {
  title: string
  lines: { text: string; indent: number }[]
  keyColor: string
  instant: boolean
  delay: number
}) {
  return (
    <motion.div
      className="w-[248px] rounded-card border-2 bg-white p-2.5"
      style={{ borderColor: colors.line }}
      initial={instant ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: instant ? 0 : delay, ease: easing.soft }}
    >
      {/*
        A FIXED, NON-WRAPPING title row. The two panels only pair line for line if
        their code starts at the same y, and these titles are different lengths, so
        a title allowed to wrap silently offsets one panel against the other.
      */}
      <div
        className="mb-2 flex h-4 items-center overflow-hidden whitespace-nowrap text-xs font-bold uppercase tracking-wide"
        style={{ color: colors.muted }}
      >
        {title}
      </div>
      <div className="space-y-0">
        {lines.map((l, i) => (
          <div
            key={i}
            className="font-mono text-body-sm font-semibold"
            style={{ paddingLeft: l.indent * 16, color: l.indent === 0 ? keyColor : colors.ink, height: 18 }}
          >
            {l.text}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export function YamlNesting({ className = '' }: { className?: string }) {
  const instant = useInstant()

  return (
    <div className={className}>
      <div className="flex items-start gap-4">
        <Panel
          title="Python you already write"
          lines={PY}
          keyColor={colors.tealDark}
          instant={instant}
          delay={0.1}
        />

        <motion.div
          className="flex h-[174px] w-[104px] shrink-0 items-center justify-center"
          initial={instant ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: instant ? 0 : 0.5 }}
        >
          {/* Reads left to right with the new order: the Python they know BECOMES
              this YAML. The old label said "means", which only made sense while the
              YAML was the left-hand panel. */}
          <span className="text-body-lg font-bold" style={{ color: colors.teal }}>
            becomes
          </span>
        </motion.div>

        <Panel title="YAML" lines={YAML} keyColor={colors.brandDark} instant={instant} delay={0.3} />
      </div>

      {/* The two rules, stated as rules, because the panels show them but do not
          name them. */}
      <div className="mt-2 flex gap-3">
        {[
          { rule: 'key: value', gloss: 'a pair, like a dictionary' },
          { rule: 'indentation', gloss: 'nesting, like a Python block' },
        ].map((r, i) => (
          <motion.div
            key={r.rule}
            className="flex-1 rounded-lg px-3 py-1.5"
            style={{ background: colors.surface2 }}
            initial={instant ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: instant ? 0 : 0.7 + i * 0.12, ease: easing.soft }}
          >
            <div className="font-mono text-body-sm font-bold" style={{ color: colors.brandDark }}>
              {r.rule}
            </div>
            <div className="text-xs font-semibold" style={{ color: colors.body }}>
              {r.gloss}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
