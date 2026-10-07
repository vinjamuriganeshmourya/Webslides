import { useMemo } from 'react'
import { readUrl } from './playground/url'
import { Playground } from './playground/Playground'
import { UrlActor } from './playground/UrlActor'

/* One page, two faces. With no query it is the lab: both actors and every
   control. When the URL names a skin, a config or a reel it is a single
   actor with no chrome, which shoot.mjs and record.mjs drive through
   window.__actors.main. The URL is read once; it never changes under a
   mounted page. */
export default function App() {
  const setup = useMemo(() => readUrl(window.location.search), [])
  return setup ? <UrlActor setup={setup} /> : <Playground />
}
