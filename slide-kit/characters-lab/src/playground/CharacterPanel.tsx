/* Every CharacterConfig field as a control. The option lists repeat the
 * unions in skins/config.ts because a type has no runtime; keep them in
 * step when a style is added there. */
import { memo, useState } from 'react'
import { PRESETS, type CharacterConfig, type HairColor, type SkinTone } from '@/skins'
import { Check, Choice, Color, Select, Slider, Text, type Hex } from './controls'

const TONES = ['fair', 'wheatish', 'medium', 'dusky', 'deep'] as const
const HAIR_COLORS = ['black', 'darkBrown', 'brown', 'auburn', 'grey'] as const
const HAIR_STYLES = ['short', 'sidePart', 'quiff', 'curly', 'buzz', 'braid', 'ponytail', 'bob', 'long', 'bun', 'wavy'] as const
const TOPS = ['shirt', 'shirtTie', 'tshirt', 'kurta', 'hoodie', 'blouse', 'polo'] as const
const BOTTOMS = ['trousers', 'jeans', 'skirt', 'salwar', 'shorts'] as const
const ARTS = ['soft', 'line'] as const
const SHADINGS = ['flat', 'lit'] as const
const JAWS = ['round', 'oval', 'square'] as const
const BROWS = ['thin', 'medium', 'thick'] as const
const EYES = ['oval', 'dot'] as const
const MOUTHS = ['full', 'line'] as const
const GLASSES = ['none', 'round', 'rect'] as const
const BEARDS = ['none', 'stubble', 'short'] as const

type Props = { config: CharacterConfig; onChange: (c: CharacterConfig) => void }

/* A named tone or hair colour, or a hex. The select carries the names plus
   "custom"; picking custom reveals a colour input seeded with a mid value. */
function NamedOrHex<T extends string>({ label, value, names, seed, onChange }: { label: string; value: T | Hex; names: readonly T[]; seed: Hex; onChange: (v: T | Hex) => void }) {
  const custom = value.startsWith('#')
  const options = [...names, 'custom'] as const
  return (
    <>
      <Select label={label} value={custom ? 'custom' : (value as T)} options={options} onChange={(v) => onChange(v === 'custom' ? seed : (v as T))} />
      {custom && <Color label="" value={value as Hex} onChange={onChange} />}
    </>
  )
}

/* An optional hex field: off means "the skin's default". */
function OptionalColor({ label, value, seed, onChange }: { label: string; value?: Hex; seed: Hex; onChange: (v?: Hex) => void }) {
  return (
    <div className="row">
      <Check label={label} checked={value !== undefined} onChange={(on) => onChange(on ? seed : undefined)} />
      {value !== undefined && <Color label="" value={value} onChange={onChange} />}
    </div>
  )
}

/* A segmented control with its label, for the short unions. */
function Pick<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly T[]; onChange: (v: T) => void }) {
  return (
    <div className="field">
      <label>{label}</label>
      <Choice value={value} options={options} onChange={onChange} />
    </div>
  )
}

export const CharacterPanel = memo(function CharacterPanel({ config, onChange }: Props) {
  const [copied, setCopied] = useState(false)

  const set = (patch: Partial<CharacterConfig>) => onChange({ ...config, ...patch })
  const face = (patch: Partial<CharacterConfig['face']>) => set({ face: { ...config.face, ...patch } })
  const outfit = (patch: Partial<CharacterConfig['outfit']>) => set({ outfit: { ...config.outfit, ...patch } })
  const acc = (patch: Partial<CharacterConfig['accessories']>) => set({ accessories: { ...config.accessories, ...patch } })
  const build = (patch: Partial<CharacterConfig['build']>) => set({ build: { ...config.build, ...patch } })

  const json = JSON.stringify(config, null, 2)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      /* no clipboard on a plain http origin: hand it over the old way */
      window.prompt('Copy the config', json)
    }
  }
  const solo = `?config=${encodeURIComponent(JSON.stringify(config))}`

  return (
    <details className="panel character">
      <summary>
        Character
        <span className="muted">{config.name}</span>
      </summary>

      <div className="row">
        {Object.entries(PRESETS).map(([key, preset]) => (
          <button key={key} type="button" className="btn small" onClick={() => onChange(preset)}>
            {preset.name}
          </button>
        ))}
        <span className="spacer" />
        <a className="btn small" href={solo} target="_blank" rel="noreferrer">
          Open solo
        </a>
        <button type="button" className="btn small" onClick={copy}>
          {copied ? 'Copied' : 'Copy JSON'}
        </button>
      </div>

      <div className="form">
        <Text label="name" value={config.name} onChange={(name) => set({ name })} />
        <Pick label="gender" value={config.gender} options={['male', 'female']} onChange={(gender) => set({ gender })} />
        <Pick label="art" value={config.art} options={ARTS} onChange={(art) => set({ art })} />
        <Pick label="shading" value={config.shading ?? 'flat'} options={SHADINGS} onChange={(shading) => set({ shading })} />

        <NamedOrHex<SkinTone> label="skin" value={config.skinTone} names={TONES} seed="#F8C9A8" onChange={(skinTone) => set({ skinTone: skinTone as SkinTone })} />
        <Select label="hair" value={config.hair.style} options={HAIR_STYLES} onChange={(style) => set({ hair: { ...config.hair, style } })} />
        <NamedOrHex<HairColor> label="hair colour" value={config.hair.color} names={HAIR_COLORS} seed="#151515" onChange={(color) => set({ hair: { ...config.hair, color: color as HairColor } })} />

        <Pick label="jaw" value={config.face.jaw} options={JAWS} onChange={(jaw) => face({ jaw })} />
        <Pick label="brows" value={config.face.brows} options={BROWS} onChange={(brows) => face({ brows })} />
        <Pick label="eyes" value={config.face.eyes} options={EYES} onChange={(eyes) => face({ eyes })} />
        <Pick label="mouth" value={config.face.mouth} options={MOUTHS} onChange={(mouth) => face({ mouth })} />
        <Slider label="blush" value={config.face.blush ?? 0} min={0} max={1} step={0.05} onChange={(blush) => face({ blush })} />
        <OptionalColor label="lip colour" value={config.face.lip} seed="#B5636B" onChange={(lip) => face({ lip })} />

        <Select label="top" value={config.outfit.top} options={TOPS} onChange={(top) => outfit({ top })} />
        <Color label="top colour" value={config.outfit.topColor} onChange={(topColor) => outfit({ topColor })} />
        <Select label="bottom" value={config.outfit.bottom} options={BOTTOMS} onChange={(bottom) => outfit({ bottom })} />
        <Color label="bottom colour" value={config.outfit.bottomColor} onChange={(bottomColor) => outfit({ bottomColor })} />
        <OptionalColor label="shoe colour" value={config.outfit.shoeColor} seed="#2A2F45" onChange={(shoeColor) => outfit({ shoeColor })} />
        <OptionalColor label="accent (tie, band)" value={config.outfit.accentColor} seed="#1E2B4F" onChange={(accentColor) => outfit({ accentColor })} />

        <Select label="glasses" value={config.accessories.glasses ?? 'none'} options={GLASSES} onChange={(glasses) => acc({ glasses })} />
        <Select label="beard" value={config.accessories.beard ?? 'none'} options={BEARDS} onChange={(beard) => acc({ beard })} />
        <div className="row span">
          <Check label="belt" checked={!!config.accessories.belt} onChange={(belt) => acc({ belt })} />
          <Check label="watch" checked={!!config.accessories.watch} onChange={(watch) => acc({ watch })} />
          <Check label="earrings" checked={!!config.accessories.earrings} onChange={(earrings) => acc({ earrings })} />
          <Check label="bindi" checked={!!config.accessories.bindi} onChange={(bindi) => acc({ bindi })} />
          <Check label="flower" checked={!!config.accessories.flower} onChange={(flower) => acc({ flower })} />
          <Check label="necklace" checked={!!config.accessories.necklace} onChange={(necklace) => acc({ necklace })} />
        </div>

        <Slider label="height" value={config.build.height} min={0.9} max={1.1} step={0.01} onChange={(height) => build({ height })} />
        <Slider label="shoulders" value={config.build.shoulders} min={0.9} max={1.1} step={0.01} onChange={(shoulders) => build({ shoulders })} />
      </div>
    </details>
  )
})
