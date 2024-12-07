# CodeBridge - Real-Time Collaborative Code Editor

CodeBridge is a modern, real-time collaborative code editor that enables multiple developers to write and edit code simultaneously. It features a robust client-server architecture with a React frontend and Node.js backend, utilizing Socket.IO for seamless real-time communication.

## 🏗 Architecture

### Client-Side Architecture
- React-based frontend with modern hooks
- Socket.IO for real-time communication
- Tailwind CSS for styling
- Custom UI components using shadcn/ui

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
git clone https://github.com/your-username/codebridge.git
cd codebridge
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
VITE_SERVER_URL=http://localhost:3001
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

## 🐳 Docker Support

The project includes Docker support for secure code execution:

1. Build the Docker images:
```bash
docker build -t codebridge-cpp -f dockerfiles/cpp/Dockerfile .
```

2. Run the container:
```bash
docker run -d --name codebridge-cpp codebridge-cpp
```

## 🛠 Technical Stack

### Frontend
- React 18
- Socket.IO Client
- Tailwind CSS
- shadcn/ui components
- CodeMirror for code editing
- Vite for build tooling

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

## 📧 Contact

Aman Singh - amanabhaysingh@gmail.com

---

