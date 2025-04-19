
import React, { useState } from 'react';
import { Shield, MessageSquare } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import GuardianAIDashboard from '@/components/GuardianAIDashboard';

interface GuardianAIProps {
  isActive: boolean;
  onToggle: () => void;
}

const GuardianAI: React.FC<GuardianAIProps> = ({ onToggle }) => {
  const { toast } = useToast();
  const [showDashboard, setShowDashboard] = useState(false);

  const handleTalkToGuardian = () => {
    toast({
      title: "Guardian AI Assistant",
      description: "Opening Guardian AI dashboard...",
    });
    setShowDashboard(true);
  };

  const handleCloseDashboard = () => {
    setShowDashboard(false);
    onToggle();
  };

  return (
    <div className="glass-card rounded-2xl p-5 overflow-hidden shadow-lg h-full bg-gradient-to-br from-purple-500/20 to-blue-600/10 relative border border-purple-500/30">
      <div className="relative z-10 flex flex-col items-center h-full">
        <div className="w-full mb-3 bg-[#d946ef] rounded-lg py-3 px-4 shadow-md flex items-center justify-center">
          <Shield size={20} className="text-white mr-2" />
          <h2 className="text-xl font-bold text-white tracking-wide">Guardian AI</h2>
          <div className="ml-3 flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-400 mr-1"></span>
            <span className="text-xs text-green-400">Online</span>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-[#ED4EC9]/20 flex items-center justify-center pulse-circle">
            <Shield size={64} className="text-[#ED4EC9]" />
          </div>
        </div>
          
        <button
          onClick={handleTalkToGuardian}
          className="bg-gradient-to-r from-[#d946ef] to-[#9333ea] text-white font-medium py-3 px-4 rounded-lg shadow-md flex items-center justify-center hover:opacity-90 transition-all duration-300 hover:shadow-purple-500/20 hover:shadow-lg w-full mt-auto"
        >
          <MessageSquare size={18} className="mr-2" />
          Talk to Guardian
        </button>
      </div>

      <GuardianAIDashboard 
        isOpen={showDashboard} 
        onClose={handleCloseDashboard} 
      />
    </div>
  );
};

export default GuardianAI;
