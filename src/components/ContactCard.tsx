
import { User, Phone, Mail, Edit, Trash2, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import ContactChatDashboard from './ContactChatDashboard';

interface ContactCardProps {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

const ContactCard = ({ name, relationship, phone, email }: ContactCardProps) => {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-start">
          <div className="h-12 w-12 rounded-full bg-[#ED4EC9]/20 flex items-center justify-center mr-4">
            <User size={24} className="text-[#ED4EC9]" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">{name}</h3>
              <span className="text-xs bg-[#ED4EC9]/20 text-[#ED4EC9] rounded-full px-3 py-1">
                {relationship}
              </span>
            </div>
            
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-white/70">
                <Phone size={14} className="mr-2" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center text-white/70">
                <Mail size={14} className="mr-2" />
                <span>{email}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowChat(true)}
              className="p-2 rounded-full hover:bg-[#ED4EC9]/20 text-white/70 hover:text-[#ED4EC9] transition-colors"
            >
              <MessageSquare size={16} />
            </button>
            <button className="p-2 rounded-full hover:bg-[#ED4EC9]/20 text-white/70 hover:text-[#ED4EC9] transition-colors">
              <Edit size={16} />
            </button>
            <button className="p-2 rounded-full hover:bg-[#ED4EC9]/20 text-white/70 hover:text-[#ED4EC9] transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <ContactChatDashboard
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        contact={{ name, relationship, phone, email }}
      />
    </>
  );
};

export default ContactCard;
