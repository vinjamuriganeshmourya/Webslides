/**
 * BrowserFrame — a capture of the running app, inside the browser it was
 * loaded in, with the address bar filled in.
 *
 * WHY IT EXISTS
 *   Every capture of the app in this session was taken by a headless browser,
 *   so it is the page alone: no tab strip, no address bar. On its own that is
 *   a picture of a web page, and a web page looks the same whether it came
 *   from localhost or from a machine in Mumbai. The whole session turns on
 *   which of those it is.
 *
 *   So the frame is not decoration. The address is the claim the slide is
 *   making, the capture is the evidence for it, and putting the address
 *   anywhere else makes the room join two things up by memory.
 *
 *   The address is written as a placeholder, `<your-elastic-ip>`, because
 *   every learner's is different. Hard rule 11 forbids retouching a capture,
 *   and nothing here touches the pixels: the frame is drawn around them.
 *
 * It is session-local. Promoting it to the kit is a separate approval.
 */

export function BrowserFrame({
  src,
  alt,
  url,
  width = 620,
  caption,
  className = '',
}: {
  src: string
  alt: string
  /** What stands in the address bar, for example `http://<your-elastic-ip>:3000/`. */
  url: string
  width?: number
  caption?: string
  className?: string
}) {
  return (
    <div className={className} style={{ width }}>
      <div className="overflow-hidden rounded-card border border-line shadow-card">
        <div className="flex items-center gap-2 px-3 py-2" style={{ background: '#E8EAED' }}>
          <span className="size-2.5 rounded-full" style={{ background: '#FF5F57' }} />
          <span className="size-2.5 rounded-full" style={{ background: '#FEBC2E' }} />
          <span className="size-2.5 rounded-full" style={{ background: '#28C840' }} />
          <div
            className="ml-2 flex-1 truncate rounded-full px-3 py-1 font-mono text-[12px]"
            style={{ background: '#FFFFFF', color: '#3C4043' }}
          >
            {url}
          </div>
        </div>
        <img src={src} alt={alt} className="block w-full" />
      </div>
      {caption && <p className="mt-2 text-center text-body-sm font-semibold text-ink">{caption}</p>}
    </div>
  )
}
