import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import EditorPage from './pages/EditorPage'
import CreateRoomPage from './pages/CreateRoomPage'
import NotFoundPage from './pages/NotFoundPage'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <div className="app-container">
      <Toaster/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MaxWidthWrapper><HomePage /></MaxWidthWrapper>} />
          <Route path="/editor/:roomId?" element={<EditorPage />} />
          <Route path="/create-room" element={<MaxWidthWrapper><CreateRoomPage /></MaxWidthWrapper>} />
          <Route path="*" element={<MaxWidthWrapper><NotFoundPage /></MaxWidthWrapper>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

const styles = `
  body, #root, .app-container {
    min-height: 100vh;
    background-image: url("https://www.transparenttextures.com/patterns/axiom-pattern.png");
}
`;

const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);
