import { marked } from 'marked'

/** Renders a plan. The text is a file in this repo, written by us or by Claude Code. */
export default function Markdown({ text }: { text: string }) {
  const html = marked.parse(text, { async: false }) as string
  return <div className="md" dangerouslySetInnerHTML={{ __html: html }} />
}
