interface Props {
  index: number
  total: number
  step: number
  maxStep: number
  isFirst: boolean
  isLast: boolean
  isFullscreen: boolean
  next: () => void
  prev: () => void
  toggleFullscreen: () => void
}

function IconBtn({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      // Grey on a near-opaque light chip. Grey alone was invisible on white
      // stages (the old white was) and mid-grey on the night/brand stages has
      // too little contrast either way, so the chip supplies a constant
      // background and the grey reads the same on both slide families.
      className="grid h-10 w-10 place-items-center rounded-pill bg-white/85 text-muted ring-1 ring-muted/20 backdrop-blur transition hover:bg-white hover:text-body disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  )
}

/**
 * Bottom-LEFT control cluster: the slide / animation-step counter, the
 * ◀ ▶ nav arrows, and a fullscreen toggle. Overview, speaker notes, and
 * click-to-advance are intentionally omitted.
 *
 * Left, not right: the cluster and the NxtWave mark swapped corners. The mark
 * is the signature and now sits bottom-right where the eye finishes; the
 * controls are the presenter's tools and sit out of the reading path.
 */
export function DeckControls({
  index,
  total,
  step,
  maxStep,
  isFirst,
  isLast,
  isFullscreen,
  next,
  prev,
  toggleFullscreen,
}: Props) {
  return (
    <div className="absolute bottom-4 left-5 z-30 flex items-center gap-2">
      <span className="mr-1 select-none rounded-pill bg-white/85 px-2.5 py-1 font-mono text-sm font-medium text-muted ring-1 ring-muted/20 backdrop-blur">
        {/* Slide number only. The build-step counter that used to follow it
            ("· 2/4") reported the state of the reveal machinery, which is the
            presenter's business and not the room's, and it changed on every tap
            of the arrow key while the slide number sat still. */}
        {String(index + 1).padStart(2, '0')}
        <span className="text-muted/60"> / {String(total).padStart(2, '0')}</span>
      </span>

      <IconBtn label="Previous" onClick={prev} disabled={isFirst && step === 0}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </IconBtn>

      <IconBtn label="Next" onClick={next} disabled={isLast && step >= maxStep}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </IconBtn>

      <IconBtn label="Toggle fullscreen" onClick={toggleFullscreen}>
        {isFullscreen ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 3v6H3M21 9h-6V3M15 21v-6h6M3 15h6v6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </IconBtn>
    </div>
  )
}
