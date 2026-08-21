/**
 * The one permitted brand mark — the NxtWave logo. On dark backgrounds it
 * sits on a soft white pill so it stays legible.
 */
export function Logo({
  className = 'h-7',
  onDark = false,
}: {
  className?: string
  onDark?: boolean
}) {
  const img = (
    <img
      src="/assets/logo-nxtwave.png"
      alt="NxtWave"
      className={`${className} w-auto select-none`}
      draggable={false}
    />
  )
  if (!onDark) return img
  return (
    <span className="inline-flex items-center rounded-pill bg-white/95 px-3 py-1.5 shadow-card-soft">
      {img}
    </span>
  )
}
