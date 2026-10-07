import { useCallback, useEffect, useRef, useState } from 'react'
import type { AgentEvent, AgentStatus, AskEvent } from './types'

/**
 * The assistant, over one WebSocket per deck session. The server replays the
 * conversation on attach and streams every later event; the browser sends
 * prompts, answers to the model's questions and approvals, and interrupts.
 */
export function useAgent(course: string | undefined, name: string | undefined) {
  const socket = useRef<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)
  const [status, setStatus] = useState<AgentStatus>('idle')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [events, setEvents] = useState<AgentEvent[]>([])
  const [streaming, setStreaming] = useState('')
  const [pending, setPending] = useState<AskEvent[]>([])
  const [epoch, setEpoch] = useState(0) // bump to reconnect

  useEffect(() => {
    if (!course || !name) return
    setEvents([]); setPending([]); setStreaming(''); setSessionId(null)
    const proto = location.protocol === 'https:' ? 'wss' : 'ws'
    const ws = new WebSocket(`${proto}://${location.host}/ws/agent/${course}/${name}`)
    socket.current = ws

    const take = (e: AgentEvent) => {
      switch (e.type) {
        case 'history':
          setEvents(e.events); setStatus(e.status); setSessionId(e.session_id)
          setPending(e.events.filter((x): x is AskEvent => x.type === 'ask'))
          return
        case 'status': return setStatus(e.status)
        case 'init': setSessionId(e.session_id); break
        case 'delta': if (!e.parent) setStreaming((s) => s + e.text); return
        case 'text': if (!e.parent) setStreaming(''); break
        case 'ask': setPending((p) => [...p, e]); break
        case 'answered': setPending((p) => p.filter((x) => x.id !== e.id)); return
      }
      setEvents((prev) => [...prev, e])
    }
    ws.onopen = () => setConnected(true)
    ws.onclose = () => setConnected(false)
    ws.onmessage = (m: MessageEvent<string>) => take(JSON.parse(m.data) as AgentEvent)
    return () => { ws.close(); socket.current = null }
  }, [course, name, epoch])

  const post = useCallback((msg: object) => {
    const ws = socket.current
    if (!ws || ws.readyState !== WebSocket.OPEN) return false
    ws.send(JSON.stringify(msg))
    return true
  }, [])

  const prompt = useCallback((text: string) => post({ type: 'prompt', text }), [post])
  const answer = useCallback((id: string, payload: object) => post({ type: 'answer', id, ...payload }), [post])
  const interrupt = useCallback(() => post({ type: 'interrupt' }), [post])
  const reconnect = useCallback(() => setEpoch((n) => n + 1), [])

  return { connected, status, sessionId, events, streaming, pending, prompt, answer, interrupt, reconnect }
}
