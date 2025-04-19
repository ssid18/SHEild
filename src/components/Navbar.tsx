
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Shield, Settings, User, Info } from 'lucide-react';
import UserDashboard from './UserDashboard';

const Navbar = () => {
  const [showUserDashboard, setShowUserDashboard] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-sheild-dark-accent border-b border-[#ED4EC9]/20 shadow-md z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-[#ED4EC9] flex items-center justify-center mr-2 pulse-circle relative">
              <Shield size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-[#ED4EC9]">SHEild</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" icon={<Heart size={18} />} label="Home" />
            <NavLink to="/contacts" icon={<Users size={18} />} label="Contacts" />
            <NavLink to="/safety-tips" icon={<Shield size={18} />} label="Safety Tips" />
            <NavLink to="/about" icon={<Info size={18} />} label="About Us" />
            <NavLink to="/settings" icon={<Settings size={18} />} label="Settings" />
          </div>
          
          <button 
            onClick={() => setShowUserDashboard(true)}
            className="flex items-center justify-center h-8 w-8 bg-[#ED4EC9]/20 rounded-full hover:bg-[#ED4EC9]/30 transition-colors"
          >
            <User size={18} className="text-[#ED4EC9]" />
          </button>
        </div>
      </div>

      <UserDashboard 
        isOpen={showUserDashboard}
        onClose={() => setShowUserDashboard(false)}
      />
    </nav>
  );
};

const NavLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  return (
    <Link to={to} className="flex items-center text-white/80 hover:text-[#ED4EC9] transition-colors">
      <span className="mr-2 text-[#ED4EC9]">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export default Navbar;
