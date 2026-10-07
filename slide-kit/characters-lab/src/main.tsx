import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

/* No StrictMode on purpose: its double-run of effects would start every
   URL-driven gesture and line twice, and the harnesses screenshot the first
   frames. */
createRoot(document.getElementById('root')!).render(<App />)
