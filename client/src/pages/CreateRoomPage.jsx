import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Copy, Code2, Github } from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { v4 as uuidv4 } from 'uuid'; 
import { useToast } from "@/hooks/use-toast"

export default function CreateRoom() {
  const [roomId, setRoomId] = useState('')
  const [username, setUsername] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state?.roomId) {
      setRoomId(location.state.roomId)
      if (location.state.directAccess) {
        toast({
          title: 'Welcome!',
          description: 'Please enter your username to join the room.',
          variant: 'default'
        })
      }
    }
  }, [location.state, toast])

  const handleJoin = (e) => {
    e.preventDefault()
    if(!roomId || !username) {
      toast({
        title: 'Error',
        description: 'Please enter a room ID and your name',
        variant: 'destructive'
      })
      return;
    }
    navigate(`/editor/${roomId}`, { state: { username } })
    toast({
      title: 'Success',
      description: 'You have now joined the room',
      variant: 'default'
    })
  }

  const generateNewMeeting = (e) => {
    const uuid = uuidv4().replace(/-/g, '');
    const meetingId = `${uuid.slice(0, 3)}-${uuid.slice(3, 7)}-${uuid.slice(7, 10)}`;
    setRoomId(meetingId)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.origin}/editor/${roomId}`)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="flex flex-col min-h-screen  dark:bg-gray-900">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" to="/">
          <Code2 className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">CodeCollab</span>
        </Link>
      </header>
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">Join a Room</h1>
          <form onSubmit={handleJoin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomId">Room ID</Label>
              <Input
                id="roomId"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" onClick={handleJoin}>Join Room</Button>
          </form>
          <div className="text-center">
            <Dialog>
              <DialogTrigger asChild>
                <p>
                  <span className="">Dont have a room ID ?</span>
                  <Button
                    variant="link"
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={generateNewMeeting}
                  >
                    Create New Room
                  </Button>
                </p>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Meeting Created</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-lg font-semibold">Your meeting ID: <span className="text-blue-500">{roomId}</span></p>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex-row flex w-full gap-2">
                      <Input
                        value={`http://localhost:5173/editor/${roomId}`}
                        readOnly
                        className="flex-grow"
                      />
                      <Button onClick={copyToClipboard} className="flex items-center space-x-2">
                        <Copy className="h-4 w-4" />
                        <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                      </Button>
                    </div>
                    <Input
                      value={username}
                      placeholder="Enter your name"
                      onChange={(e) => setUsername(e.target.value)}
                      className="flex-grow"
                    />
                  </div>
                  <Button className="w-full" onClick={handleJoin}>
                    Join this room
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 CodeCollab. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="https://github.com/SSShogunn" target="_blank">
            <Github className="h-4 w-4" />
          </Link>
        </nav>
      </footer>
    </div>
  )
}
