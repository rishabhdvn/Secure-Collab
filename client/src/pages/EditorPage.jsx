import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Code2, Copy, LogOut } from "lucide-react"
import { Client } from '@/components/Client'
import { CodeEditor } from '@/components/CodeEditor'

export default function EditorPage() {
  const navigate = useNavigate()

  const [members, setMembers] = useState([
    { socketId: 1, name: 'Alice Johnson' },
    { socketId: 2, name: 'Bob Smith' },
    { socketId: 3, name: 'Charlie Brown' },
  ])

  const [roomId, setRoomId] = useState('ABC123')

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
              <Client key={member.socketId} name={member.name} />
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
        <CodeEditor />
      </div>
    </div>
  )
}
