import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const EditorPage = () => {
  const { roomId } = useParams()
  const [code, setCode] = useState('')

  useEffect(() => {
    // In a real application, you'd set up real-time collaboration here
    console.log(`Connected to room: ${roomId}`)
  }, [roomId])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Editor - Room {roomId}</h1>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-64 border rounded p-2 font-mono"
        placeholder="Start coding here..."
      />
    </div>
  )
}

export default EditorPage
