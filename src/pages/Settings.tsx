
import React from 'react';
import { Settings as SettingsIcon, BellRing, MapPin, Video, Shield, Lock, Bell, Users, Info } from 'lucide-react';

const Settings = () => {
  return (
    <div className="min-h-screen pt-16 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <SettingsIcon size={24} className="text-sheild-primary mr-2" />
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>
        
        <div className="space-y-6">
          <SettingCategory 
            title="Emergency Settings" 
            icon={<BellRing size={20} className="text-sheild-primary" />}
          >
            <ToggleSetting 
              title="Automatic SOS Trigger" 
              description="Automatically activate SOS when Guardian AI detects danger"
              defaultChecked={true}
            />
            <ToggleSetting 
              title="Emergency Services Auto-Call" 
              description="Automatically call 911 after SOS is activated"
              defaultChecked={false}
            />
            <ToggleSetting 
              title="Loud Alarm" 
              description="Play a loud alarm sound when SOS is activated"
              defaultChecked={true}
            />
          </SettingCategory>
          
          <SettingCategory 
            title="Location Sharing" 
            icon={<MapPin size={20} className="text-sheild-primary" />}
          >
            <ToggleSetting 
              title="Share Location with Emergency Contacts" 
              description="Allow your emergency contacts to see your location during an SOS event"
              defaultChecked={true}
            />
            <ToggleSetting 
              title="Share Location with Nearby Helpers" 
              description="Allow verified community helpers to see your location during an SOS event"
              defaultChecked={true}
            />
            <ToggleSetting 
              title="Background Location Access" 
              description="Allow SHEild to access your location even when the app is closed"
              defaultChecked={true}
            />
          </SettingCategory>
          
          <SettingCategory 
            title="Live Streaming" 
            icon={<Video size={20} className="text-sheild-primary" />}
          >
            <ToggleSetting 
              title="Emergency Live Stream" 
              description="Automatically start video livestream when SOS is activated"
              defaultChecked={true}
            />
            <ToggleSetting 
              title="High Quality Video" 
              description="Stream in HD quality (uses more data)"
              defaultChecked={false}
            />
            <ToggleSetting 
              title="Save Video Locally" 
              description="Save a copy of the emergency livestream on your device"
              defaultChecked={true}
            />
          </SettingCategory>
          
          <SettingCategory 
            title="Guardian AI" 
            icon={<Shield size={20} className="text-sheild-primary" />}
          >
            <ToggleSetting 
              title="Automatic Threat Detection" 
              description="Use AI to automatically detect potential threats around you"
              defaultChecked={true}
            />
            <ToggleSetting 
              title="Voice Alerts" 
              description="Guardian AI will speak alerts through your device speakers"
              defaultChecked={true}
            />
            <ToggleSetting 
              title="Collect Training Data" 
              description="Help improve Guardian AI by sharing anonymous usage data"
              defaultChecked={false}
            />
          </SettingCategory>
          
          <SettingCategory 
            title="Notifications" 
            icon={<Bell size={20} className="text-sheild-primary" />}
          >
            <ToggleSetting 
              title="Guardian Alerts" 
              description="Receive notifications when Guardian AI detects potential threats"
              defaultChecked={true}
            />
            <ToggleSetting 
              title="Network Updates" 
              description="Get notified when helpers join or leave your network"
              defaultChecked={true}
            />
            <ToggleSetting 
              title="Safety Tips" 
              description="Receive periodic safety tips and best practices"
              defaultChecked={true}
            />
          </SettingCategory>
        </div>
      </div>
    </div>
  );
};

interface SettingCategoryProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SettingCategory = ({ title, icon, children }: SettingCategoryProps) => {
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center mb-4">
        <div className="h-10 w-10 rounded-full bg-sheild-primary/20 flex items-center justify-center mr-3">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

interface ToggleSettingProps {
  title: string;
  description: string;
  defaultChecked?: boolean;
}

const ToggleSetting = ({ title, description, defaultChecked = false }: ToggleSettingProps) => {
  const [checked, setChecked] = React.useState(defaultChecked);
  
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
      <div>
        <h3 className="text-white font-medium">{title}</h3>
        <p className="text-sm text-white/60">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer"
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <div className="w-11 h-6 bg-sheild-dark-accent peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-sheild-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sheild-primary"></div>
      </label>
    </div>
  );
};

export default Settings;
