
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { MessageSquare, User, MapPin, Send } from 'lucide-react'
import { useState } from 'react'

interface Message {
  id: string
  content: string
  sender: string
  timestamp: Date
  location?: string
  isEmergency?: boolean
}

interface CommunityChatDashboardProps {
  isOpen: boolean
  onClose: () => void
}

const CommunityChatDashboard = ({ isOpen, onClose }: CommunityChatDashboardProps) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Just started my evening walk, all looks good in Connaught Place.',
      sender: 'Priya S.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      location: 'Connaught Place'
    },
    {
      id: '2',
      content: 'We have two volunteers patrolling the downtown area tonight.',
      sender: 'Delhi Safety Watch',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      location: 'Central Delhi'
    },
    {
      id: '3',
      content: 'I\'m available for quick response in South Delhi tonight.',
      sender: 'Inspector Sharma',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      location: 'South Delhi'
    },
    {
      id: '4',
      content: 'Help needed in Lajpat Nagar area!',
      sender: 'Neha K.',
      timestamp: new Date(Date.now() - 1000 * 60),
      location: 'Lajpat Nagar',
      isEmergency: true
    }
  ])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'You',
      timestamp: new Date(),
      location: 'Your Location'
    }

    setMessages(prev => [...prev, newMessage])
    setMessage('')
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="bg-sheild-dark border-sheild-primary/30 max-w-4xl h-[80vh]">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-sheild-primary p-4 flex items-center">
            <MessageSquare size={24} className="text-white mr-3" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">Community Chat</h2>
              <p className="text-sm text-white/80">Connect with helpers in your area</p>
            </div>
            <div className="bg-white/20 rounded-lg px-3 py-1 text-sm text-white">
              <span>12 Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.sender === 'You'
                      ? 'bg-[#ED4EC9] text-white rounded-tr-none'
                      : msg.isEmergency
                        ? 'bg-red-500/30 border border-red-500/50 text-white rounded-tl-none'
                        : 'bg-sheild-dark-accent text-white rounded-tl-none'
                  }`}
                >
                  {msg.sender !== 'You' && (
                    <div className="flex items-center mb-2">
                      <div className="h-6 w-6 rounded-full bg-sheild-primary/20 flex items-center justify-center mr-2">
                        <User size={12} className="text-sheild-primary" />
                      </div>
                      <span className={`text-sm font-medium ${msg.isEmergency ? 'text-red-400' : 'text-sheild-primary'}`}>
                        {msg.sender}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-white/90">{msg.content}</p>
                  
                  <div className="mt-2 flex justify-between items-center text-xs text-white/50">
                    {msg.location && (
                      <div className="flex items-center">
                        <MapPin size={10} className="mr-1" />
                        <span>{msg.location}</span>
                      </div>
                    )}
                    <span>{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSend} className="p-4 bg-sheild-dark-accent/50 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow bg-sheild-dark-accent p-3 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#ED4EC9]/50"
            />
            <button
              type="submit"
              className="bg-[#ED4EC9] hover:bg-[#ED4EC9]/90 text-white p-3 rounded-lg"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommunityChatDashboard
