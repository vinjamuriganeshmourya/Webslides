import type { ReactNode } from 'react'
import { Logo } from './Logo'
import { DotGrid, Blob, Orb } from './Decor'

export type SlideVariant = 'light' | 'plain' | 'brand' | 'night'

const BG: Record<SlideVariant, string> = {
  light: 'bg-brand-soft text-ink',
  plain: 'bg-white text-ink',
  brand: 'bg-brand-gradient text-white',
  night: 'bg-night-gradient text-white',
}

/**
 * The frame every slide sits in: a 1280×720 canvas with a background
 * variant, optional decorative furniture, and an optional footer carrying
 * the NxtWave mark. Content slides use `light`/`plain`; section & hero
 * slides use `brand`/`night`.
 */
export function SlideBase({
  variant = 'light',
  children,
  className = '',
  decor = true,
  footer = true,
  footerLogo = true,
  lesson,
  padded = true,
}: {
  variant?: SlideVariant
  children: ReactNode
  className?: string
  decor?: boolean
  footer?: boolean
  /** Hide the footer logo while keeping the lesson text (brand slide: logo hero already on stage). */
  footerLogo?: boolean
  lesson?: string
  padded?: boolean
}) {
  const dark = variant === 'brand' || variant === 'night'
  return (
    <section
      className={`absolute inset-0 overflow-hidden font-body ${BG[variant]} ${className}`}
      style={{ width: 1280, height: 720 }}
    >
      {/* Decorative furniture per family */}
      {decor && (variant === 'light' || variant === 'plain') && (
        <>
          <DotGrid className="right-10 top-9" color="#0B5FFF" opacity={0.16} />
          <Blob className="-bottom-24 -left-24 h-72 w-72" opacity={0.1} />
        </>
      )}
      {decor && variant === 'brand' && (
        <>
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border-[40px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-white/5" />
          <DotGrid className="right-16 bottom-16" color="#FFFFFF" opacity={0.22} rows={4} cols={6} />
        </>
      )}
      {decor && variant === 'night' && (
        <>
          <Orb className="-right-24 -top-24" color="#0B5FFF" size={460} />
          <Orb className="-bottom-32 -left-24" color="#12B5A8" size={420} />
          <DotGrid className="right-16 top-1/2" color="#FFFFFF" opacity={0.14} />
        </>
      )}

      {/* Content region */}
      <div className={`relative z-10 flex h-full flex-col ${padded ? 'px-16 pb-16 pt-12' : ''}`}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-8 pb-4">
          {footerLogo ? <Logo className="h-6" onDark={dark} /> : <span />}
          {lesson && (
            <span className={`text-body-sm font-medium ${dark ? 'text-white/70' : 'text-body/70'}`}>
              {lesson}
            </span>
          )}
        </footer>
      )}
      {footer && !dark && <div className="slide-footer-bar" />}
    </section>
  )
}
