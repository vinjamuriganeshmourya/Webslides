import { useEffect, useRef, useState } from 'react'

/** Runs one server job (build, qa, …) over server-sent events and keeps its output. */
export function useJob() {
  const [lines, setLines] = useState<string[]>([])
  const [running, setRunning] = useState<string | null>(null)
  const [exitCode, setExitCode] = useState<number | null>(null)

  const run = (url: string, label: string) => {
    setLines([`$ ${label}`])
    setRunning(label)
    setExitCode(null)
    const source = new EventSource(url)
    source.onmessage = (e: MessageEvent<string>) => {
      const line = JSON.parse(e.data) as string
      setLines((prev) => [...prev, line])
      const exit = line.match(/^exit (\d+)$/)
      if (exit) {
        source.close()
        setRunning(null)
        setExitCode(Number(exit[1]))
      }
    }
    source.onerror = () => {
      source.close()
      setRunning(null)
      setLines((prev) => [...prev, '[the job could not start, or the connection was lost]'])
    }
  }
  return { lines, running, exitCode, run }
}

export function JobLog({ lines }: { lines: string[] }) {
  const el = useRef<HTMLPreElement>(null)
  useEffect(() => el.current?.scrollTo(0, el.current.scrollHeight), [lines])
  if (!lines.length) return null
  return <pre ref={el} className="log">{lines.join('\n')}</pre>
}
