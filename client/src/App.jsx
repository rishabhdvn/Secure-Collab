import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom';
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
      <HashRouter>
        <Routes>
          <Route path="/" element={<MaxWidthWrapper><HomePage /></MaxWidthWrapper>} />
          <Route path="/editor/:roomId?" element={<EditorPage />} />
          <Route path="/create-room" element={<MaxWidthWrapper><CreateRoomPage /></MaxWidthWrapper>} />
          <Route path="*" element={<MaxWidthWrapper><NotFoundPage /></MaxWidthWrapper>} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App

const styles = `
  body, #root, .app-container {
    min-height: 100vh;
    position: relative;
  }

  body::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("https://www.transparenttextures.com/patterns/asfalt-dark.png");
    opacity: 0.4;
    filter: blur(0.5px);
    pointer-events: none;
    z-index: -1;
  }
`;

const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);
