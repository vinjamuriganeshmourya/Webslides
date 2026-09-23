/**
 * ShellPanel — a plain terminal window, for a shell that is NOT VS Code's.
 *
 * WHY IT EXISTS, AND WHY IT IS NOT THE KIT'S `Terminal`
 *   The kit's `Terminal` draws VS Code's panel and hardcodes a PowerShell
 *   prompt, `PS C:\path>`. That is right for every command the course runs on
 *   the learner's own Windows machine, and wrong for the two shells this
 *   session meets:
 *
 *     the laptop's SSH client  AWS prints `chmod` and `ssh`, which are not
 *                              PowerShell commands, so a PowerShell prompt in
 *                              front of them would teach the wrong window
 *     the instance itself      after `ssh` lands, the prompt is Ubuntu's,
 *                              `ubuntu@ip-172-31-7-32:~$`, on a computer in
 *                              Mumbai, not on the laptop
 *
 *   Hard rule 31: a panel that shows commands says exactly where they run. So
 *   the title bar names the machine and the prompt is that machine's own.
 *   Nothing here is invented: every line is copied from the session's captures
 *   and from the transcript of the real SSH session.
 *
 * It is session-local. Promoting it to the kit is a separate approval.
 */

export interface ShellLine {
  text: string
  /** `cmd` gets the prompt; `out` is what the machine printed back. */
  kind?: 'cmd' | 'out'
}

export function ShellPanel({
  title,
  prompt,
  lines,
  caption,
  fontSize = 15,
  className = '',
}: {
  /** The window's title bar: which machine this shell is on. */
  title: string
  /** The prompt in front of every typed line, for example `ubuntu@ip-172-31-7-32:~$`. */
  prompt: string
  lines: ShellLine[]
  caption?: string
  fontSize?: number
  className?: string
}) {
  return (
    <div className={className}>
      <div className="overflow-hidden rounded-card shadow-card" style={{ background: '#1E1E1E' }}>
        <div className="flex items-center gap-2 px-4 py-2" style={{ background: '#2D2D2D' }}>
          <span className="size-3 rounded-full" style={{ background: '#FF5F57' }} />
          <span className="size-3 rounded-full" style={{ background: '#FEBC2E' }} />
          <span className="size-3 rounded-full" style={{ background: '#28C840' }} />
          <span className="ml-3 font-mono text-[12px]" style={{ color: '#C8C8C8' }}>{title}</span>
        </div>
        <div className="px-5 py-4 font-mono leading-7" style={{ fontSize }}>
          {lines.map((l, i) => (
            <div key={i} className="whitespace-pre-wrap break-words">
              {l.kind === 'out' ? (
                <span style={{ color: '#D4D4D4' }}>{l.text}</span>
              ) : (
                <>
                  <span style={{ color: '#5AD07A' }}>{`${prompt} `}</span>
                  <span style={{ color: '#E7E7E7' }}>{l.text}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      {caption && <p className="mt-2 text-center text-body-sm font-semibold text-ink">{caption}</p>}
    </div>
  )
}
