
import React, { useState } from 'react';
import { Users, Plus, UserRound, Phone, Mail, MessageSquare } from 'lucide-react';
import ContactChatDashboard from '@/components/ContactChatDashboard';

interface Contact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

const Contacts = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showChatDashboard, setShowChatDashboard] = useState(false);

  const handleOpenChat = (contact: Contact) => {
    setSelectedContact(contact);
    setShowChatDashboard(true);
  };

  return (
    <div className="min-h-screen pt-16 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users size={24} className="text-sheild-primary mr-2" />
            <h1 className="text-2xl font-bold text-white">Emergency Contacts</h1>
          </div>
          <button className="flex items-center bg-sheild-primary hover:bg-sheild-secondary text-white rounded-lg px-4 py-2 transition-colors">
            <Plus size={18} className="mr-1" /> 
            <span>Add New</span>
          </button>
        </div>
        
        <div className="bg-sheild-dark-accent rounded-xl p-4 mb-6">
          <p className="text-white/80">
            Your emergency contacts will be notified automatically when you activate SOS mode.
            Make sure to keep this list updated with people you trust.
          </p>
        </div>
        
        <div className="space-y-4">
          <ContactCard 
            name="Priya Sharma" 
            relationship="Friend"
            phone="+91 98765 43210" 
            email="priya.s@gmail.com"
            onChatClick={() => handleOpenChat({
              name: "Priya Sharma",
              relationship: "Friend",
              phone: "+91 98765 43210",
              email: "priya.s@gmail.com"
            })}
          />
          
          <ContactCard 
            name="Mom" 
            relationship="Family"
            phone="+91 95432 10987" 
            email="mom@gmail.com"
            onChatClick={() => handleOpenChat({
              name: "Mom",
              relationship: "Family",
              phone: "+91 95432 10987",
              email: "mom@gmail.com"
            })}
          />
          
          <ContactCard 
            name="Dad" 
            relationship="Family"
            phone="+91 98765 12345" 
            email="dad@gmail.com" 
            onChatClick={() => handleOpenChat({
              name: "Dad",
              relationship: "Family",
              phone: "+91 98765 12345",
              email: "dad@gmail.com"
            })}
          />
          
          <ContactCard 
            name="Inspector Sharma" 
            relationship="Police"
            phone="+91 99123 45678" 
            email="sharma.police@gmail.com" 
            onChatClick={() => handleOpenChat({
              name: "Inspector Sharma",
              relationship: "Police",
              phone: "+91 99123 45678",
              email: "sharma.police@gmail.com"
            })}
          />
          
          <ContactCard 
            name="Delhi Safety Watch" 
            relationship="Emergency Service"
            phone="+91 11234 56789" 
            email="safety@delhi.org" 
            onChatClick={() => handleOpenChat({
              name: "Delhi Safety Watch",
              relationship: "Emergency Service",
              phone: "+91 11234 56789",
              email: "safety@delhi.org"
            })}
          />
        </div>
      </div>

      {/* Show chat dashboard when a contact is selected */}
      {selectedContact && (
        <ContactChatDashboard
          isOpen={showChatDashboard}
          onClose={() => setShowChatDashboard(false)}
          contact={selectedContact}
        />
      )}
    </div>
  );
};

interface ContactCardProps {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  onChatClick: () => void;
}

const ContactCard = ({ name, relationship, phone, email, onChatClick }: ContactCardProps) => {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-start">
        <div className="h-12 w-12 rounded-full bg-sheild-primary/20 flex items-center justify-center mr-4">
          <UserRound size={24} className="text-sheild-primary" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">{name}</h3>
            <span className="text-xs bg-sheild-primary/20 text-sheild-primary rounded-full px-3 py-1">
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
        
        <button 
          onClick={onChatClick}
          className="ml-4 p-2 rounded-lg bg-[#ED4EC9] text-white hover:bg-[#ED4EC9]/90 transition-colors"
        >
          <MessageSquare size={20} />
        </button>
      </div>
    </div>
  );
};

export default Contacts;
