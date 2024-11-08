'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Code2, Copy, LogOut, Play, Users, Code, SquareTerminal, Download, ListRestart } from "lucide-react"
import { Client } from '@/components/Client'
import { CodeEditor } from '@/components/CodeEditor'
import { Console } from '@/components/Console'
import { initSocket } from '@/lib/socket'
import { useToast } from "@/hooks/use-toast"
import axios from 'axios'

export default function EditorPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()

  const [language, setLanguage] = useState('java')
  const [isMobile, setIsMobile] = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const [showConsole, setShowConsole] = useState(false)

  const socketRef = useRef(null)
  const codeRef = useRef(null)
  const editorRef = useRef(null)
  const { roomId } = useParams()

  const [members, setMembers] = useState([])
  const [username, setUsername] = useState('')
  const [consoleOutput, setConsoleOutput] = useState('')
  const [fileName, setFileName] = useState("Main")

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const handleFileNameChange = (event) => {
    setFileName(event.target.value)
  }

  useEffect(() => {
    const init = async () => {
      if (!location.state?.username) {
        navigate('/create-room', {
          state: {
            roomId,
            directAccess: true
          }
        })
        return
      }

      setUsername(location.state.username)
      socketRef.current = await initSocket()
      socketRef.current.on('connect-error', (err) => handleError(err))
      socketRef.current.on('connect_failed', (err) => handleError(err))

      const handleError = (e) => {
        console.log('connect_error', e)
        toast({
          title: 'Socket Connection Error',
          description: e.message,
          variant: 'destructive'
        })
        navigate('/create-room')
      }

      socketRef.current.emit("join", {
        roomId,
        username: location.state.username,
      })

      socketRef.current.on('joined', ({ clients, username, socketId }) => {
        if (username !== location.state.username) {
          toast({
            title: 'New Member Joined',
            description: `${username} joined the room.`,
            variant: 'default'
          })
        }
        setMembers(clients)

        socketRef.current.on('sync-code', ({ code }) => {
          if (code !== null) {
            codeRef.current = code;
            if (editorRef.current) {
              editorRef.current.setValue(code);
            }
          }
        });
      })

      socketRef.current.on('disconnected', ({ socketId, username }) => {
        toast({
          title: 'Member Disconnected',
          description: `${username} disconnected from the room.`,
          variant: 'default'
        })
        setMembers((prev) => prev.filter(client => client.socketId !== socketId))
      })
    }

    init()

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current.off('joined')
        socketRef.current.off('disconnected')
        socketRef.current.off('sync-code');
      }
    }
  }, [])

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId)
    toast({
      title: 'Room ID Copied',
      description: 'The room ID has been copied to your clipboard.',
      variant: 'default'
    })
  }

  const handleLeaveRoom = () => {
    navigate('/')
  }

  const handleRunCode = async () => {
    try {
      setConsoleOutput('');
      console.log('Running code with socket ID:', socketRef.current.id);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/compile`, {
        code: editorRef.current.getValue(),
        language,
        socketId: socketRef.current.id
      });
      console.log('Compile response:', response.data);
    } catch (error) {
      console.error('Error running code:', error);
      setConsoleOutput('Error running code: ' + error.message);
    }
  };

  const handleConsoleInput = (input) => {
    socketRef.current.emit('program-input', input);
  };

  useEffect(() => {
    if (socketRef.current) {
      console.log('Setting up program-output listener');
      socketRef.current.on('program-output', ({ output }) => {
        console.log('Received output:', output);
        setConsoleOutput(prev => prev + output);
      });

      return () => {
        socketRef.current.off('program-output');
      };
    }
  }, [socketRef.current]); // Add dependency

  const handleFileDownload = () => {
    const code = editorRef.current.getValue()
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fileName}.${language}`
    a.click()
  }

  const resetCode = () => {
    editorRef.current.setValue('')
  }
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-900 text-white">
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Code2 className="text-blue-500" />
          <span className="font-bold text-lg">CodeBridge</span>
        </div>
        {isMobile && (
          <div className="flex space-x-2">
            <Button onClick={() => setShowMembers(!showMembers)} variant="outline" size="sm">
              <Users className="h-4 w-4" />
            </Button>
            <Button onClick={() => setShowConsole(!showConsole)} variant="outline" size="sm">
              <SquareTerminal className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex-grow flex overflow-hidden">
        {(!isMobile || showMembers) && (
          <div className={`${isMobile ? 'absolute inset-y-0 left-0 z-10' : 'w-[200px]'} flex-shrink-0 border-r border-gray-700 bg-gray-800 flex flex-col`}>
            <div className="flex-grow overflow-auto p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold">Members</h2>
                <Users className="h-4 w-4 text-gray-500" />
              </div>
              <ul className="space-y-2">
                {members.map((member) => (
                  <Client key={member.socketId} name={member.username} />
                ))}
              </ul>
            </div>
            <div className="p-4 space-y-2">
              <Button
                onClick={copyRoomId}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Copy className="mr-2 h-4 w-4" /> Copy Room ID
              </Button>
              <Button
                onClick={handleLeaveRoom}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <LogOut className="mr-2 h-4 w-4" /> Leave Room
              </Button>
            </div>
          </div>
        )}

        <div className='flex-grow flex flex-col overflow-hidden'>
          <div className="p-2 border-b bg-gray-800 border-gray-700 flex justify-between items-center">
            <Select value={language} onValueChange={(value) => setLanguage(value)}>
              <SelectTrigger className="w-[150px] bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white">
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="python">Python</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
            <div className='flex-grow border-r border-gray-700 bg-gray-800 flex flex-col overflow-hidden'>
              <div className='flex p-2 justify-between flex-wrap'>
                <div className='flex items-center space-x-2 mb-2 md:mb-0'>
                  <Code className='mx-3' />
                  <div className="relative w-[160px]">
                    <Input
                      type="text"
                      id="fileName"
                      name="fileName"
                      value={fileName}
                      onChange={handleFileNameChange}
                      className="pr-[80px] bg-transparent border-0 border-b-2 rounded-none border-gray-600 text-white"
                      placeholder="File name"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500">. {language}</span>
                    </div>
                  </div>
                  <Button onClick={handleFileDownload} className="text-white border-2 bg-transparent border-gray-600">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className='space-x-2 flex flex-row items-center justify-center'>
                  <ListRestart className="h-6 w-6 text-gray-400 hover:text-gray-200 cursor-pointer mr-3" title="Reset Code" onClick={resetCode} />
                  <Button onClick={handleRunCode} className="bg-green-600 hover:bg-green-700 text-white">
                    <Play className="mr-2 h-6 w-6" /> Run Code
                  </Button>
                </div>
              </div>
              <div className="flex-grow overflow-hidden">
                <CodeEditor
                  socketRef={socketRef}
                  roomId={roomId}
                  onCodeChange={(code) => { codeRef.current = code }}
                  language={language}
                  editorRef={editorRef}
                />
              </div>
            </div>

            {(!isMobile || showConsole) && (
              <div className={`${isMobile ? 'absolute inset-y-0 right-0 z-10' : 'w-1/4'} bg-gray-800 flex flex-col overflow-hidden`}>
                <div className='flex p-1 items-center'>
                  <SquareTerminal className='m-3' />
                  Terminal
                </div>
                <div className="flex-grow overflow-hidden">
                  <Console
                    consoleOutput={consoleOutput}
                    onInput={handleConsoleInput}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}