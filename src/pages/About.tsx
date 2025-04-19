
import React from 'react';
import { Shield, Heart, Users, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen pt-16 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-sheild-primary/20 mb-4">
            <Shield size={40} className="text-sheild-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">About SHEild</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Empowering safety through technology and community connection
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-xl font-bold text-sheild-primary mb-4 flex items-center">
              <Sparkles className="mr-2" size={20} />
              Our Mission
            </h2>
            <p className="text-white/80 mb-4">
              SHEild was created with a singular purpose: to provide an innovative safety solution that empowers individuals through technology and community support.
            </p>
            <p className="text-white/80">
              We believe everyone deserves to feel secure in their daily lives, and we leverage cutting-edge AI technology to make that possible.
            </p>
          </div>
          
          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-xl font-bold text-sheild-primary mb-4 flex items-center">
              <Heart className="mr-2" size={20} />
              Our Values
            </h2>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-start">
                <span className="h-5 w-5 rounded-full bg-sheild-primary/20 flex items-center justify-center mr-2 mt-1">
                  <span className="text-xs text-sheild-primary">✓</span>
                </span>
                <span><strong className="text-white">Empowerment</strong> - Giving individuals control over their safety</span>
              </li>
              <li className="flex items-start">
                <span className="h-5 w-5 rounded-full bg-sheild-primary/20 flex items-center justify-center mr-2 mt-1">
                  <span className="text-xs text-sheild-primary">✓</span>
                </span>
                <span><strong className="text-white">Innovation</strong> - Using technology to solve real-world problems</span>
              </li>
              <li className="flex items-start">
                <span className="h-5 w-5 rounded-full bg-sheild-primary/20 flex items-center justify-center mr-2 mt-1">
                  <span className="text-xs text-sheild-primary">✓</span>
                </span>
                <span><strong className="text-white">Community</strong> - Building networks of support and trust</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="glass-card p-8 rounded-xl mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How SHEild Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              title="Guardian AI"
              icon={<Shield size={24} className="text-sheild-primary" />}
              description="Our AI system monitors for signs of danger and can automatically activate emergency protocols when needed."
            />
            <FeatureCard
              title="Help Network"
              icon={<Users size={24} className="text-sheild-primary" />}
              description="Connect with trusted contacts and community helpers who can respond quickly in emergency situations."
            />
            <FeatureCard
              title="Emergency Response"
              icon={<Heart size={24} className="text-sheild-primary" />}
              description="When danger is detected, SHEild shares your location, notifies your network, and provides real-time assistance."
            />
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Join the SHEild Community</h2>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Be part of a movement that's making the world safer, one connection at a time. 
            Together, we can create a network of support that empowers everyone.
          </p>
          <button className="bg-sheild-primary hover:bg-sheild-secondary text-white font-medium py-3 px-6 rounded-lg transition-colors">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ 
  title, 
  icon, 
  description 
}: { 
  title: string;
  icon: React.ReactNode;
  description: string;
}) => {
  return (
    <div className="bg-sheild-dark p-5 rounded-lg border border-sheild-primary/20 text-center">
      <div className="h-12 w-12 rounded-full bg-sheild-primary/10 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-white/70 text-sm">{description}</p>
    </div>
  );
};

export default About;
