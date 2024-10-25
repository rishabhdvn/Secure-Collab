import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Code2, Copy, LogOut } from "lucide-react"
import { Client } from '@/components/Client'
import { CodeEditor } from '@/components/CodeEditor'
import { initSocket } from '@/lib/socket'
import { useToast } from "@/hooks/use-toast"

export default function EditorPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()

  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const { roomId } = useParams();

  const [members, setMembers] = useState([])
  const [username, setUsername] = useState('');

  useEffect(() => {
    const init = async () => {
      if (!location.state?.username) {
        navigate('/create-room', {
          state: {
            roomId,
            directAccess: true
          }
        });
        return;
      }

      setUsername(location.state.username);
      //console.log(socketRef)
      socketRef.current = await initSocket();
      socketRef.current.on('connect-error', (err) => handleError(err));
      socketRef.current.on('connect_failed', (err) => handleError(err));


      const handleError = (e) => {
        console.log('connect_error', e);
        toast({
          title: 'Socket Connection Error',
          description: e.message,
          variant: 'destructive'
        })
        navigate('/create-room')
      }

      const username = location.state?.username
      socketRef.current.emit("join", {
        roomId,
        username: username,
      })

      socketRef.current.on('joined', ({ clients, username, socketId }) => {
        if (username !== username) {
          toast({
            title: 'New Member Joined',
            description: `${username} joined the room.`,
            variant: 'default'
          })
        }
        setMembers(clients)
        
        socketRef.current.emit('sync-code', {
          code: codeRef.current,
          socketId
        })
      })

      socketRef.current.on('disconnected', ({ socketId, username }) => {
        toast({
          title: 'Member Disconnected',
          description: `${username} disconnected from the room.`,
          variant: 'default'
        })
        setMembers((prev) => {
          return prev.filter(
            (client) => client.socketId !== socketId
          )
        })
      })
    }

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off('joined')
        socketRef.current.off('disconnected')
      }
    }

  }, [])

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId)
  }

  const handleLeaveRoom = () => {
    navigate('/')
  }


  return (
    <div className="flex h-screen bg-[#1e1e1e] text-white">
      <div className="w-64 bg-[#252526] flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Code2 className="h-6 w-6" />
            <span className="font-bold text-lg">CodeBridge</span>
          </div>
        </div>
        <div className="flex-grow overflow-auto p-4">
          <h2 className="text-sm font-semibold mb-2">Members</h2>
          <ul className="space-y-2">
            {members.map((member) => (
              <Client key={member.socketId} name={member.username} />
            ))}
          </ul>
        </div>
        <div className="p-4 space-y-2">
          <Button
            onClick={copyRoomId}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
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
      <div className="flex-grow">
        <CodeEditor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => (codeRef.current = code)} />
      </div>
    </div>
  )
}
