declare module 'virtual:deck' {
  import type { DeckData } from './types'
  const deck: DeckData
  export const dims: Record<string, [number, number] | null>
  export default deck
}
declare module '@custom' {
  import type { ComponentType } from 'react'
  /** one-off figures a slide names with `{ "type": "custom", "name": ... }`; each gets `{ step, ...props }` */
  export const figures: Record<string, ComponentType<Record<string, unknown>>>
  /** whole one-off slides a slide names with `{ "layout": "custom", "component": ... }`; each gets `{ lesson, ...props }` */
  export const slides: Record<string, ComponentType<Record<string, unknown>>>
  /** extra keyframes for the custom pieces */
  export const css: string
}
declare module '@edits' {
  export const SLIDE_EDITS: Record<string, Record<string, string>>
}
