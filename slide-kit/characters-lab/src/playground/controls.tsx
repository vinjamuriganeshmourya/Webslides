/* The handful of native-looking inputs the panels are built from. Plain
 * elements with class names; the styling lives in index.css. */
import type { ReactNode } from 'react'

export function Panel({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h3>{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  )
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 0.01,
  digits = 2,
  unit = '',
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  digits?: number
  unit?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <span className="value">
        {value.toFixed(digits)}
        {unit}
      </span>
    </div>
  )
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: readonly { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="seg" role="radiogroup">
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={o.value === value} className={o.value === value ? 'active' : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

/** A segmented control whose labels are the values themselves. */
export function Choice<T extends string>({ value, options, onChange }: { value: T; options: readonly T[]; onChange: (v: T) => void }) {
  return <Segmented value={value} options={options.map((v) => ({ value: v, label: v }))} onChange={onChange} />
}

export function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="check">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  )
}

export function Select<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly T[]; onChange: (v: T) => void }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}

export type Hex = `#${string}`

export function Color({ label, value, onChange }: { label: string; value: Hex; onChange: (v: Hex) => void }) {
  return (
    <div className="field">
      <label>{label}</label>
      <span className="color">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value as Hex)} />
        <code>{value.toUpperCase()}</code>
      </span>
    </div>
  )
}

export function Text({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
