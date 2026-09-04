import { Suspense } from 'react'
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import { Layout } from './app/Layout'
import { HomePage } from './app/HomePage'
import { PlaceholderPage } from './chapters/PlaceholderPage'
import { CHAPTER_COMPONENTS } from './chapters/registry'

function ChapterRoute() {
  const { chapterId } = useParams()
  const Chapter = chapterId ? CHAPTER_COMPONENTS[chapterId] : undefined
  if (!Chapter) return <PlaceholderPage />
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-subtext">章节加载中…</div>}>
      <Chapter />
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="chapter/:chapterId" element={<ChapterRoute />} />
          <Route path="*" element={<PlaceholderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
