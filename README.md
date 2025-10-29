# Secure-Collab- Real-Time Collaborative Code Editor

Secure Collab is a modern, real-time collaborative code editor that enables multiple developers to write and edit code simultaneously. It features a responsive design that works seamlessly on both desktop and mobile devices, with real-time collaboration powered by Socket.IO.

## ✨ Features

- **Real-time Collaboration**: Multiple users can code together in real-time
- **Multi-language Support**: Supports Java, Python, and C++
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Theme**: Built-in theme switching for comfortable coding
- **Live Console**: Interactive terminal with real-time output
- **File Management**: Download code files with custom naming
- **Member Management**: See active room members in real-time
- **Code Execution**: Secure code compilation and execution
- **Instant Feedback**: Real-time error reporting and output

## 🏗 Architecture

### Client-Side Architecture
- React 18 with Vite
- Socket.IO for real-time communication
- Tailwind CSS for responsive styling
- shadcn/ui for modern UI components
- CodeMirror for advanced code editing
- Context API for theme management
- Custom hooks for toast notifications

### Server-Side Architecture
- Node.js with Express
- Socket.IO for WebSocket handling
- Docker containers for secure code execution
- Environment-based configuration

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or later)
- Docker (for code execution feature)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rishabhdvn/Secure-Collab.git
cd Secure-Collab

```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

### Configuration

1. Create a `.env` file in the server directory:
```env
PORT=3001
```

2. Create a `.env` file in the client directory:
```env
VITE_BACKEND_URL=http://localhost:3001
VITE_SOCKET_URL=ws://localhost:3001
```

### Running the Application

1. Start the server:
```bash
cd server
npm run dev
```

2. Start the client:
```bash
cd client
npm run dev
```

3. Access the application at `http://localhost:5173`

## 🎨 UI Features

### Desktop
- Full-width code editor
- Sidebar with member list
- Expandable console
- Theme toggle
- File management controls

### Mobile
- Responsive layout
- Compact controls
- Collapsible member list
- Touch-friendly interface
- Optimized space usage

## 🛠 Technical Stack

### Frontend
- React 18
- Socket.IO Client
- Tailwind CSS
- shadcn/ui components
- CodeMirror
- Vite
- Lucide Icons

### Backend
- Node.js
- Express
- Socket.IO
- Docker SDK
- dotenv

### Development Tools
- ESLint
- Prettier
- Git
- Docker

## 🔒 Security Features

- Sandboxed code execution using Docker
- Rate limiting for API requests
- Input sanitization
- Secure WebSocket connections
- Environment variable protection

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📧 Contact



## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
