
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { MapPin, User, Check } from 'lucide-react'
import { useState } from 'react'

interface LiveLocationDashboardProps {
  isOpen: boolean
  onClose: () => void
}

const LiveLocationDashboard = ({ isOpen, onClose }: LiveLocationDashboardProps) => {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const contacts = [
    { id: '1', name: 'Priya Sharma', relationship: 'Friend' },
    { id: '2', name: 'Mom', relationship: 'Family' },
    { id: '3', name: 'Dad', relationship: 'Family' },
    { id: '4', name: 'Inspector Sharma', relationship: 'Police' }
  ]

  const toggleContact = (id: string) => {
    setSelectedContacts(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const handleShare = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="bg-sheild-dark border-sheild-primary/30 max-w-lg">
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <MapPin size={24} className="text-[#ED4EC9] mr-2" />
            <h2 className="text-xl font-bold text-white">Share Live Location</h2>
          </div>

          <div className="space-y-3 mb-6">
            {contacts.map(contact => (
              <button
                key={contact.id}
                onClick={() => toggleContact(contact.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  selectedContacts.includes(contact.id) 
                    ? 'bg-[#ED4EC9]/20 border border-[#ED4EC9]/30' 
                    : 'bg-sheild-dark-accent/50 hover:bg-sheild-dark-accent'
                }`}
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-[#ED4EC9]/20 flex items-center justify-center mr-3">
                    <User size={20} className="text-[#ED4EC9]" />
                  </div>
                  <div className="text-left">
                    <p className="text-white">{contact.name}</p>
                    <p className="text-sm text-white/60">{contact.relationship}</p>
                  </div>
                </div>
                {selectedContacts.includes(contact.id) && (
                  <Check className="text-[#ED4EC9]" size={20} />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleShare}
            className="w-full bg-[#ED4EC9] hover:bg-[#ED4EC9]/90 text-white font-medium py-3 px-4 rounded-lg shadow-md flex items-center justify-center"
          >
            <MapPin size={18} className="mr-2" />
            Share Location with Selected Contacts
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LiveLocationDashboard;
