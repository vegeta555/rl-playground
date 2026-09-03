import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// 自托管字体（中文按 unicode-range 子集加载），避免依赖外部 CDN
import '@fontsource/noto-sans-sc/400.css'
import '@fontsource/noto-sans-sc/500.css'
import '@fontsource/noto-sans-sc/700.css'
import '@fontsource/noto-serif-sc/600.css'
import '@fontsource/noto-serif-sc/700.css'
import 'katex/dist/katex.min.css'

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
