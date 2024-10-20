# Real-Time Collaborative Code Editor

This project is a real-time collaborative code editor that allows multiple users to work on code simultaneously. It features a client-server architecture with a React frontend and a Node.js backend using Socket.IO for real-time communication.

## Features

- Real-time code collaboration
- Syntax highlighting
- Dark mode toggle
- Responsive design with max-width wrapper

## Project Structure

The project is divided into two main parts:

1. **Client**: React-based frontend
2. **Server**: Node.js backend with Express and Socket.IO

### Client Structure

- `src/App.jsx`: Main application component
- `src/components/`:
  - `Client.jsx`: Handles client-side Socket.IO connection
  - `CodeEditor.jsx`: Code editor component
  - `DarkModeToggle.jsx`: Toggle for dark/light mode
  - `MaxWidthWrapper.jsx`: Wrapper component for responsive layout
  - `ThemeContext.jsx`: Context for managing theme state

### Server Structure

- `server/index.js`: Main server file with Express and Socket.IO setup

## Prerequisites

- Node.js (v14 or later recommended)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/real-time-code-editor.git
   cd real-time-code-editor
   ```

2. Install server dependencies:
   ```
   cd server
   npm install
   ```

3. Install client dependencies:
   ```
   cd ../client
   npm install
   ```

## Configuration

1. In the `server` directory, create a `.env` file:
   ```
   PORT=3001
   ```

## Running the Application

1. Start the server:
   ```
   cd server
   npm start
   ```

2. In a new terminal, start the client:
   ```
   cd client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` (or the port specified by your React app).

## Technologies Used

- **Frontend**:
  - React
  - Socket.IO Client
  - [Add any additional libraries used for code editing, syntax highlighting, etc.]

- **Backend**:
  - Node.js
  - Express
  - Socket.IO
  - dotenv for environment variable management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Choose an appropriate license and add it here]

## Acknowledgements

[Add any acknowledgements, if applicable]
