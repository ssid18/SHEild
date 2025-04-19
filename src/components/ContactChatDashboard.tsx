import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Send, User } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'contact'
  timestamp: Date
  contactId: string
}

interface ContactChatDashboardProps {
  isOpen: boolean
  onClose: () => void
  contact: {
    name: string
    relationship: string
    phone: string
    email: string
  }
}

const ContactChatDashboard = ({ isOpen, onClose, contact }: ContactChatDashboardProps) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    if (isOpen) {
      const initialMessage = contact.name === "Priya"
        ? `Hi! This is ${contact.name}. How can I help you?`
        : "" // Blank message for everyone except Priya

      setMessages([
        {
          id: `${contact.name}-1`,
          content: initialMessage,
          sender: 'contact',
          timestamp: new Date(),
          contactId: contact.name
        },
        {
          id: `${contact.name}-2`,
          content: 'Live Location is being shared 28.6359°N and 77.3074°E [Microsoft Sovereign Office]',
          sender: 'user',
          timestamp: new Date(),
          contactId: contact.name
        }
      ])
    }
  }, [isOpen, contact.name])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
      contactId: contact.name
    }

    setMessages(prev => [...prev, newMessage])
    setMessage('')

    setTimeout(() => {
      let responseContent = "I've received your message. I'll get back to you soon!"

      if (contact.relationship === "Police") {
        responseContent = "This is an official channel. Your message has been logged. We'll respond shortly."
      } else if (contact.relationship === "Emergency Service") {
        responseContent = "Emergency services received your message. Help is on the way."
      } else if (contact.relationship === "Family") {
        responseContent = "Got your message. Stay safe, we're here for you!"
      }

      const contactResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: 'contact',
        timestamp: new Date(),
        contactId: contact.name
      }

      setMessages(prev => [...prev, contactResponse])
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-sheild-dark border-sheild-primary/30 max-w-2xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="sr-only">Chat with {contact.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-[#ED4EC9] p-4 flex items-center">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <User size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-white font-bold">{contact.name}</h2>
              <p className="text-sm text-white/80">{contact.relationship}</p>
            </div>
            <div className="text-sm text-white/80">
              <div>{contact.phone}</div>
              <div>{contact.email}</div>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages
              .filter(msg => msg.contactId === contact.name)
              .map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-[#ED4EC9] text-white rounded-tr-none'
                        : 'bg-sheild-dark-accent text-white rounded-tl-none'
                    }`}
                  >
                    {msg.content}
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

export default ContactChatDashboard
