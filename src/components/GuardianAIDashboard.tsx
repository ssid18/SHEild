import React, { useState, useRef, useEffect } from 'react';
import { Shield, CheckCircle, AlertCircle, Video, X, Send, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

interface GuardianAIDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'guardian';
  timestamp: Date;
}

const GEMINI_API_KEY = 'AIzaSyD6-lshoUX6wJBUNfEZMIH-cqUCtlUM5U4';

async function fetchGeminiResponse(userInput: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userInput }]
          }
        ]
      })
    }
  );

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here to help. Could you tell me more?";
}

const GuardianAIDashboard: React.FC<GuardianAIDashboardProps> = ({ isOpen, onClose }) => {
  const [showSafetyCheck, setShowSafetyCheck] = useState(false);
  const [showLiveStreamPrompt, setShowLiveStreamPrompt] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '👋 Hi, I\'m Guardian AI. I\'m here with you. How are you feeling today?',
      sender: 'guardian',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false); // 🟣 ADDED
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const lowerCaseMessage = message.toLowerCase();
    setMessage('');

    if (
      lowerCaseMessage.includes('unsafe') ||
      lowerCaseMessage.includes('help') ||
      lowerCaseMessage.includes('scared') ||
      lowerCaseMessage.includes('danger')
    ) {
      setTimeout(() => {
        setShowSafetyCheck(true);
      }, 500);
    } else {
      setIsTyping(true); // 🟣 ADDED
      setTimeout(async () => {
        const geminiReply = await fetchGeminiResponse(message);
        const guardianResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: geminiReply,
          sender: 'guardian',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, guardianResponse]);
        setIsTyping(false); // 🟣 ADDED
      }, 1000);
    }
  };

  const handleFeelUnsafeClick = () => {
    setShowSafetyCheck(false);
    setShowLiveStreamPrompt(true);
  };

  const handleLiveStreamYes = () => {
    toast({
      title: "SOS Mode Activated",
      description: "Redirecting to emergency dashboard...",
    });
    onClose();
    navigate('/');
    setTimeout(() => {
      const sosButtonElement = document.querySelector('.sos-button') as HTMLElement;
      if (sosButtonElement) {
        sosButtonElement.click();
      }
    }, 500);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]); // 🟣 ADDED `isTyping`

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} modal={true}>
      <DialogContent className="bg-sheild-dark border-sheild-primary/30 max-w-6xl w-full max-h-[90vh] h-[90vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-[#ED4EC9] p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="text-white mr-2" size={24} />
              <h2 className="text-2xl font-bold text-white">Guardian AI</h2>
              <div className="ml-3 flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-400 mr-1"></span>
                <span className="text-xs text-green-400">Online</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-[#ED4EC9]/80"
              onClick={onClose}
            >
              <X size={20} />
            </Button>
          </div>

          {/* Main Chat UI */}
          <div className="flex flex-grow overflow-hidden">
            <div className="flex-grow flex flex-col h-full p-4">
              <div className="flex-grow overflow-y-auto p-2 space-y-4 max-h-[calc(100vh-250px)]">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'guardian' && (
                      <div className="h-8 w-8 rounded-full bg-[#ED4EC9]/20 flex items-center justify-center mr-2">
                        <Shield size={16} className="text-[#ED4EC9]" />
                      </div>
                    )}
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' 
                        ? 'bg-[#ED4EC9] text-white rounded-tr-none' 
                        : 'bg-sheild-dark-accent text-white rounded-tl-none'}`}
                    >
                      {msg.content}
                    </div>
                    {msg.sender === 'user' && (
                      <Avatar className="h-8 w-8 bg-sheild-primary/20 ml-2">
                        <AvatarFallback className="bg-sheild-primary/20 text-sheild-primary">
                          <UserRound size={16} />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {/* 🟣 TYPING INDICATOR */}
                {isTyping && (
                  <div className="flex items-center space-x-2 ml-10 animate-pulse">
                    <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:0s]" />
                    <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span className="text-white text-sm">Guardian AI is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleMessageSubmit} className="mt-2 flex items-center gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-grow bg-sheild-dark-accent border-sheild-primary/30 text-white"
                />
                <Button type="submit" className="bg-[#ED4EC9] hover:bg-[#ED4EC9]/90">
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Safety Check Dialog */}
      <Dialog open={showSafetyCheck} onOpenChange={setShowSafetyCheck}>
        <DialogContent className="sm:max-w-md border-[#ED4EC9]/30 bg-sheild-dark">
          <div className="text-center mb-4">
            <Shield size={40} className="mx-auto text-[#ED4EC9] mb-2" />
            <h2 className="text-xl font-bold text-white">How are you feeling?</h2>
            <p className="text-white/70">Let me know if you need immediate assistance</p>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <Button 
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 text-lg"
              onClick={() => setShowSafetyCheck(false)}
            >
              <CheckCircle size={24} className="mr-2" />
              I'm Okay
            </Button>
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-6 text-lg"
              onClick={handleFeelUnsafeClick}
            >
              <AlertCircle size={24} className="mr-2" />
              I Feel Unsafe
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Live Stream Prompt Dialog */}
      <Dialog open={showLiveStreamPrompt} onOpenChange={setShowLiveStreamPrompt}>
        <DialogContent className="sm:max-w-md border-[#ED4EC9]/30 bg-sheild-dark">
          <div className="text-center mb-4">
            <Video size={40} className="mx-auto text-[#ED4EC9] mb-2" />
            <h2 className="text-xl font-bold text-white">Start a live stream?</h2>
            <p className="text-white/70">
              Your emergency contacts will be notified and can view your live stream
            </p>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <Button 
              className="bg-[#ED4EC9] hover:bg-[#ED4EC9]/90 text-white font-bold py-4"
              onClick={handleLiveStreamYes}
            >
              <Video size={20} className="mr-2" />
              Yes, start live stream
            </Button>
            <Button 
              variant="outline"
              className="border-[#ED4EC9]/30 text-white hover:bg-[#ED4EC9]/10"
              onClick={() => setShowLiveStreamPrompt(false)}
            >
              No, not now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default GuardianAIDashboard;
