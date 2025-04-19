import React, { useState } from 'react';
import { Shield, Users, MapPin, AlertTriangle, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import SOSDashboard from '@/components/SOSDashboard';
import GuardianAI from '@/components/GuardianAI';
import LivestreamComponent from '@/components/LivestreamComponent';
import TripStatusBar from '@/components/TripStatusBar';
import LiveLocationDashboard from '@/components/LiveLocationDashboard';
import UserDashboard from '@/components/UserDashboard';

const Home = () => {
  const [showSOSDashboard, setShowSOSDashboard] = useState(false);
  const [isGuardianActive, setIsGuardianActive] = useState(false);
  const [isLivestreaming, setIsLivestreaming] = useState(false);
  const [showLocationDashboard, setShowLocationDashboard] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const activateGuardian = () => {
    setIsGuardianActive(!isGuardianActive);
    toast({
      title: isGuardianActive ? "Guardian AI Dashboard Closed" : "Guardian AI Dashboard Open",
      description: isGuardianActive 
        ? "You've exited the Guardian AI interface."
        : "You can now chat with your Guardian AI assistant."
    });
  };

  const activateSOS = () => {
    setShowSOSDashboard(true);
    toast({
      title: "Emergency Mode Activated",
      description: "Contacting your emergency network",
      variant: "destructive"
    });
  };

  const navigateToCommunity = () => {
    navigate('/community');
  };

  const navigateToContacts = () => {
    navigate('/contacts');
  };

  const shareLocation = () => {
    toast({
      title: "Location Shared",
      description: "Your live location has been shared with your emergency contacts"
    });
  };

  return (
    <div className="min-h-screen pt-16 pb-8 px-4">
      {/* Hero section */}
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="mb-3 relative">
          <div className="h-16 w-16 rounded-full bg-[#ED4EC9]/20 flex items-center justify-center pulse-circle relative">
            <Shield size={32} className="text-[#ED4EC9]" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">SHEild</h1>
        <p className="text-lg text-white/70">Your personal safety companion</p>
      </div>

      {/* Trip Status Bar */}
      <div className="max-w-5xl mx-auto mt-2 mb-4">
        <TripStatusBar />
      </div>

      {/* Main sections - Guardian AI and Help Network swapped */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
        <GuardianAI isActive={isGuardianActive} onToggle={() => setIsGuardianActive(!isGuardianActive)} />
        
        <div className="glass-card rounded-2xl p-5 overflow-hidden shadow-lg bg-gradient-to-br from-purple-500/20 to-blue-600/10 relative border border-purple-500/30">
          <div className="flex items-center justify-center mb-4 bg-[#d946ef] rounded-lg py-3 px-4">
            <Users size={20} className="text-white mr-2" />
            <h2 className="text-xl font-semibold text-white">Help Network</h2>
          </div>
          
          <div className="mb-4 text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-sheild-primary/10 border border-sheild-primary/30 text-white/90">
              <Users size={16} className="inline mr-2 text-sheild-primary" />
              <span>SHEild users near you</span>
            </span>
          </div>
          
          <div className="space-y-3 mb-4 max-h-36 overflow-y-auto pr-2 scrollbar-none">
            <HelperItem name="Priya S." distance="0.3" status="online" />
            <HelperItem name="Inspector Sharma" distance="0.7" status="online" />
          </div>
          
          <div className="flex">
            <button 
              onClick={navigateToCommunity}
              className="w-full bg-gradient-to-r from-[#d946ef] to-[#9333ea] text-white font-medium py-3 px-4 rounded-lg shadow-md flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <Users size={16} className="mr-2" />
              Community Chat
            </button>
          </div>
        </div>
      </div>
      
      {/* Emergency Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-6">
        <button 
          onClick={() => setShowSOSDashboard(true)}
          className="sos-button h-14 w-full sm:w-52 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center shadow-lg transition-colors"
        >
          <AlertTriangle size={24} className="mr-2" />
          Emergency SOS
        </button>

        <button 
          onClick={() => setShowLocationDashboard(true)}
          className="h-14 w-full sm:w-52 rounded-full bg-[#ED4EC9] hover:bg-[#ED4EC9]/90 text-white font-bold flex items-center justify-center shadow-lg transition-colors"
        >
          <Share2 size={24} className="mr-2" />
          Share Live Location
        </button>
      </div>
      
      {showSOSDashboard && <SOSDashboard onClose={() => setShowSOSDashboard(false)} />}
      {isLivestreaming && <LivestreamComponent isActive={isLivestreaming} onClose={() => setIsLivestreaming(false)} />}
      <LiveLocationDashboard isOpen={showLocationDashboard} onClose={() => setShowLocationDashboard(false)} />
      <UserDashboard isOpen={showUserDashboard} onClose={() => setShowUserDashboard(false)} />
    </div>
  );
};

const HelperItem = ({ 
  name, 
  distance,
  status = "online"
}: { 
  name: string; 
  distance: string; 
  status?: "online" | "away" | "offline"
}) => {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/10 hover:bg-sheild-dark-accent/50 transition-colors rounded px-2">
      <div className="flex items-center">
        <div className="relative">
          <div className="h-8 w-8 rounded-full bg-sheild-primary/20 flex items-center justify-center mr-3">
            <Users size={14} className="text-sheild-primary" />
          </div>
          <span className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-sheild-dark-accent ${
            status === "online" ? "bg-green-500" : 
            status === "away" ? "bg-yellow-500" : "bg-gray-500"
          }`}></span>
        </div>
        <span className="text-white">{name}</span>
      </div>
      <div className="flex items-center text-white/70 text-sm">
        <MapPin size={14} className="mr-1" />
        <span>{distance} km away</span>
      </div>
    </div>
  );
};

export default Home;
