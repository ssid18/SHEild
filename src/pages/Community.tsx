import React, { useState, useEffect } from 'react';
import { MessageSquare, UserRound, Send, Video, MapPin, Users, Navigation } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import CommunityChatDashboard from '@/components/CommunityChatDashboard';

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
  isLiveStream?: boolean;
}

interface ActiveUser {
  id: string;
  name: string;
  status: 'online' | 'away' | 'emergency';
  lastActive: Date;
  location?: string;
}

const Community = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [activeStreams, setActiveStreams] = useState<{id: string, user: string, location: string}[]>([]);
  const [showChatDashboard, setShowChatDashboard] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const mockMessages = [
      {
        id: '1',
        user: 'Priya S.',
        text: 'Just started my evening walk, all looks good in Connaught Place.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
      },
      {
        id: '2',
        user: 'Delhi Safety Watch',
        text: 'We have two volunteers patrolling the downtown area tonight.',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
      },
      {
        id: '3',
        user: 'Inspector Sharma',
        text: 'I\'m available for quick response in South Delhi tonight.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
      },
      {
        id: '4',
        user: 'System',
        text: 'Live emergency stream started by Neha K. in Lajpat Nagar area.',
        timestamp: new Date(Date.now() - 1000 * 60),
        isLiveStream: true
      }
    ];

    const mockUsers = [
      {
        id: '1',
        name: 'Priya S.',
        status: 'online' as const,
        lastActive: new Date(),
        location: 'Connaught Place'
      },
      {
        id: '2',
        name: 'Delhi Safety Watch',
        status: 'online' as const,
        lastActive: new Date(),
        location: 'Central Delhi'
      },
      {
        id: '3',
        name: 'Inspector Sharma',
        status: 'online' as const,
        lastActive: new Date(),
        location: 'South Delhi'
      },
      {
        id: '4',
        name: 'Neha K.',
        status: 'emergency' as const,
        lastActive: new Date(),
        location: 'Lajpat Nagar'
      },
      {
        id: '5',
        name: 'Mom',
        status: 'away' as const,
        lastActive: new Date(Date.now() - 1000 * 60 * 20),
      }
    ];

    const mockStreams = [
      { id: 'stream1', user: 'Neha K.', location: 'Lajpat Nagar' },
      { id: 'stream2', user: 'Ravi M.', location: 'Karol Bagh' }
    ];

    setMessages(mockMessages);
    setActiveUsers(mockUsers);
    setActiveStreams(mockStreams);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const newMsg: Message = {
      id: Date.now().toString(),
      user: 'You',
      text: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the community"
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const joinStream = (streamId: string, user: string) => {
    toast({
      title: "Joining Stream",
      description: `Connecting to ${user}'s live stream...`
    });
  };

  return (
    <div className="min-h-screen pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Community Safety Network</h1>
          <button 
            onClick={() => setShowChatDashboard(true)}
            className="bg-[#ED4EC9] hover:bg-[#ED4EC9]/90 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <MessageSquare size={18} className="mr-2" />
            Open Full Chat
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:flex-1 glass-card rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-sheild-primary p-4 flex items-center">
              <MessageSquare className="text-white mr-2" size={20} />
              <h2 className="text-xl font-semibold text-white">Community Chat</h2>
            </div>
            
            <div className="h-[500px] flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.user === 'You' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${
                      msg.isLiveStream 
                        ? 'bg-red-500/20 border border-red-500/50' 
                        : msg.user === 'You' 
                          ? 'bg-purple-600/20 border border-purple-500/50' 
                          : 'bg-sheild-dark-accent border border-white/10'
                    } rounded-lg p-3`}>
                      {msg.user !== 'You' && (
                        <div className="flex items-center mb-1">
                          <div className="h-6 w-6 rounded-full bg-sheild-primary/20 flex items-center justify-center mr-2">
                            <UserRound size={12} className="text-sheild-primary" />
                          </div>
                          <span className="text-sheild-primary text-sm font-medium">{msg.user}</span>
                        </div>
                      )}
                      
                      {msg.isLiveStream ? (
                        <div>
                          <div className="flex items-center mb-2">
                            <Video size={16} className="text-red-400 mr-2" />
                            <span className="text-red-400 text-sm font-medium">LIVE EMERGENCY</span>
                          </div>
                          <p className="text-white/90">{msg.text}</p>
                          <div className="mt-2 p-2 bg-sheild-dark rounded-md border border-red-500/30">
                            <button 
                              onClick={() => joinStream('stream1', 'Neha K.')}
                              className="w-full bg-red-500 hover:bg-red-600 text-white rounded py-1 text-sm transition-colors"
                            >
                              Join Live Stream
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-white/90">{msg.text}</p>
                      )}
                      
                      <div className="mt-1 text-right">
                        <span className="text-xs text-white/50">{formatTime(msg.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-sheild-dark-accent">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-sheild-dark border border-white/20 rounded-l-lg py-2 px-4 text-white/80 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-sheild-primary hover:bg-sheild-secondary text-white py-2 px-4 rounded-r-lg transition-colors"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="lg:w-80">
            <div className="glass-card rounded-2xl mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-sheild-primary p-4 flex items-center rounded-t-2xl">
                <Users className="text-white mr-2" size={18} />
                <h2 className="text-lg font-semibold text-white">Active Helpers</h2>
              </div>
              <div className="p-3 max-h-[300px] overflow-y-auto">
                {activeUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between py-2 border-b border-white/10">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="h-8 w-8 rounded-full bg-sheild-primary/20 flex items-center justify-center mr-3">
                          <UserRound size={14} className="text-sheild-primary" />
                        </div>
                        <span className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-sheild-dark-accent ${
                          user.status === 'online' ? 'bg-green-500' : 
                          user.status === 'emergency' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></span>
                      </div>
                      <div>
                        <span className="text-white text-sm">{user.name}</span>
                        {user.location && (
                          <div className="flex items-center">
                            <MapPin size={10} className="text-white/50 mr-1" />
                            <span className="text-white/50 text-xs">{user.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {user.status === 'emergency' && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">SOS</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass-card rounded-2xl">
              <div className="bg-red-500 p-4 flex items-center rounded-t-2xl">
                <Video className="text-white mr-2" size={18} />
                <h2 className="text-lg font-semibold text-white">Emergency Streams</h2>
              </div>
              <div className="p-4 space-y-4">
                {activeStreams.map(stream => (
                  <div key={stream.id} className="bg-sheild-dark/70 rounded-lg border border-red-500/30 p-3">
                    <div className="flex items-center mb-2">
                      <div className="h-3 w-3 bg-red-500 rounded-full mr-2 animate-blink"></div>
                      <span className="text-red-400 text-sm">LIVE</span>
                    </div>
                    <div className="mb-3">
                      <p className="text-white text-sm">Emergency stream from <span className="font-semibold">{stream.user}</span></p>
                      <div className="flex items-center mt-1">
                        <MapPin size={12} className="text-white/50 mr-1" />
                        <span className="text-white/50 text-xs">{stream.location}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => joinStream(stream.id, stream.user)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white rounded py-2 text-sm transition-colors"
                    >
                      Join Stream
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CommunityChatDashboard 
        isOpen={showChatDashboard} 
        onClose={() => setShowChatDashboard(false)} 
      />
    </div>
  );
};

export default Community;
