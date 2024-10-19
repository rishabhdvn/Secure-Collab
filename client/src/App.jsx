import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import EditorPage from './pages/EditorPage'
import CreateRoomPage from './pages/CreateRoomPage'
import NotFoundPage from './pages/NotFoundPage'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'

function App() {
  return (
    <BrowserRouter>
      <MaxWidthWrapper>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor/:roomId" element={<EditorPage />} />
          <Route path="/create-room" element={<CreateRoomPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MaxWidthWrapper>
    </BrowserRouter>
  )
}

export default App
