import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ThreadPage from './pages/ThreadPage'
import NewThreadPage from './pages/NewThreadPage'
import SearchPage from './pages/SearchPage'
import TagsPage from './pages/TagsPage'
import TagThreadsPage from './pages/TagThreadsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories/:id" element={<CategoryPage />} />
          <Route path="/categories/:id/new" element={<NewThreadPage />} />
          <Route path="/threads/:id" element={<ThreadPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="/tags/:name" element={<TagThreadsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
