import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SettingsProvider } from './context/SettingsContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import CreatePostPage from './pages/CreatePostPage'
import PostPage from './pages/PostPage'
import EditPostPage from './pages/EditPostPage'
import './App.css'

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePostPage />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/post/:id/edit" element={<EditPostPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </SettingsProvider>
  )
}

export default App
