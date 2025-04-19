
import React from 'react';
import { ShieldAlert, AlertCircle, CheckSquare, Heart } from 'lucide-react';

const SafetyTips = () => {
  return (
    <div className="min-h-screen pt-16 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <ShieldAlert size={24} className="text-sheild-primary mr-2" />
          <h1 className="text-2xl font-bold text-white">Safety Tips</h1>
        </div>
        
        <div className="bg-sheild-dark-accent rounded-xl p-4 mb-6">
          <p className="text-white/80">
            These safety tips can help you stay secure in various situations.
            Remember to always prioritize your safety and trust your instincts.
          </p>
        </div>
        
        <div className="space-y-6">
          <TipCategory 
            title="Walking Alone" 
            icon={<Heart size={22} className="text-sheild-primary" />}
            tips={[
              "Stay alert and aware of your surroundings at all times",
              "Walk confidently and with purpose",
              "Avoid dark, isolated areas, especially at night",
              "Keep your phone charged but avoid being distracted by it",
              "Consider sharing your location with trusted contacts"
            ]}
          />
          
          <TipCategory 
            title="Public Transportation" 
            icon={<AlertCircle size={22} className="text-sheild-primary" />}
            tips={[
              "Wait in well-lit, busy areas",
              "Sit near the driver or in populated train cars",
              "Keep personal belongings secure and close to you",
              "Be aware of who gets off at your stop",
              "Have your keys ready before reaching your destination"
            ]}
          />
          
          <TipCategory 
            title="Emergency Situations" 
            icon={<ShieldAlert size={22} className="text-sheild-primary" />}
            tips={[
              "Press the SOS button in the SHEild app to alert your contacts",
              "Try to move to a public area with other people",
              "Make noise to draw attention if you feel threatened",
              "Use clear language when communicating with emergency services",
              "Remember descriptions of people or vehicles involved"
            ]}
          />
          
          <TipCategory 
            title="Personal Safety" 
            icon={<CheckSquare size={22} className="text-sheild-primary" />}
            tips={[
              "Trust your instincts - if something feels wrong, it probably is",
              "Let someone know where you're going and when you expect to return",
              "Keep your doors locked when at home or in your car",
              "Be careful about sharing personal information online",
              "Consider taking a self-defense class"
            ]}
          />
        </div>
      </div>
    </div>
  );
};

interface TipCategoryProps {
  title: string;
  icon: React.ReactNode;
  tips: string[];
}

const TipCategory = ({ title, icon, tips }: TipCategoryProps) => {
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center mb-4">
        <div className="h-10 w-10 rounded-full bg-sheild-primary/20 flex items-center justify-center mr-3">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      
      <ul className="space-y-2">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start">
            <div className="h-5 w-5 rounded-full bg-sheild-primary/20 flex items-center justify-center mr-3 mt-0.5">
              <span className="text-xs text-sheild-primary font-medium">{index + 1}</span>
            </div>
            <span className="text-white/80">{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SafetyTips;
