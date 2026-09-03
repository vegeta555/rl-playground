import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './app/Layout'
import { HomePage } from './app/HomePage'
import { PlaceholderPage } from './chapters/PlaceholderPage'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="chapter/:chapterId" element={<PlaceholderPage />} />
          <Route path="*" element={<PlaceholderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
