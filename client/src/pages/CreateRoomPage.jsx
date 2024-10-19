import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateRoomPage = () => {
  const [roomName, setRoomName] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (roomName.trim()) {
      // In a real application, you'd generate a unique room ID here
      const roomId = Math.random().toString(36).substr(2, 9)
      navigate(`/editor/${roomId}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create a New Room</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter room name"
          className="border rounded px-3 py-2 mr-2"
          required
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Create Room
        </button>
      </form>
    </div>
  )
}

export default CreateRoomPage
