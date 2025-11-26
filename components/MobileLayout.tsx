import React, { useState, useEffect } from 'react';
import { Users, Eye, MessageCircle, Moon, Sun, Shield } from 'lucide-react';
import ConnectPanel from './ConnectPanel';
import FeatureCard from './FeatureCard';
import RevealModal from './RevealModal';
import PrivacyModal from './PrivacyModal';
import { Feature, FeatureType } from '../types';

const FEATURES: Feature[] = [
  {
    id: FeatureType.SCORE_CHECKS,
    title: 'Reveal Score Checks',
    description: 'See who recently viewed your score',
    icon: <Users size={24} className="text-yellow-600 dark:text-yellow-400" />,
  },
  {
    id: FeatureType.BEST_FRIENDS,
    title: 'Reveal Best Friends',
    description: 'View the 8 Best Friends list',
    icon: <Users size={24} className="text-purple-600 dark:text-purple-400" />,
  },
  {
    id: FeatureType.EYES_ONLY,
    title: 'Reveal Eyes Only',
    description: 'Access hidden locked content',
    icon: <Eye size={24} className="text-indigo-600 dark:text-indigo-400" />,
  },
  {
    id: FeatureType.CHAT_HISTORY,
    title: 'Reveal Chat History',
    description: 'Recover sent and received messages',
    icon: <MessageCircle size={24} className="text-green-500 dark:text-green-400" />,
  },
];

const MobileLayout: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [targetUser, setTargetUser] = useState('');
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Initial dark mode check
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Apply dark mode class to html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleConnect = async (username: string) => {
    setTargetUser(username);
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setTargetUser('');
    setSelectedFeature(null);
  };

  const handleFeatureClick = (feature: Feature) => {
    if (!isConnected) {
        // Focus input if not connected
        const inputEl = document.querySelector('input');
        if (inputEl) {
            inputEl.focus();
            inputEl.parentElement?.classList.add('animate-pulse');
            setTimeout(() => inputEl.parentElement?.classList.remove('animate-pulse'), 500);
        }
        return;
    }
    setSelectedFeature(feature);
  };

  return (
    <div className="min-h-screen pb-12 bg-[#F5F7FA] dark:bg-[#0f172a] transition-colors duration-500 font-sans">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100 dark:border-slate-800 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center shadow-sm shadow-yellow-400/50">
             <Eye className="text-white" size={18} />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-gray-800 dark:text-white">
            Snap<span className="text-yellow-500">Spy</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowPrivacy(true)}
              className="text-xs font-semibold text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              Privacy
            </button>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-400 hover:text-gray-800 dark:text-slate-400 dark:hover:text-yellow-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 active:scale-95"
            >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 pt-6 max-w-lg mx-auto">
        
        <ConnectPanel 
          isConnected={isConnected}
          connectedUser={targetUser}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />

        <div className="space-y-3.5">
          <div className="flex items-center gap-2 mb-2 px-1">
             <Shield size={14} className="text-gray-400 dark:text-slate-500" />
             <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">Available Tools</span>
          </div>
          {FEATURES.map((feature, index) => (
            <div 
                key={feature.id} 
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
            >
                <FeatureCard
                  feature={feature}
                  onClick={handleFeatureClick}
                  disabled={!isConnected}
                />
            </div>
          ))}
        </div>

      </main>
      
      {/* Simple footer for visual balance */}
      <footer className="mt-12 text-center pb-6">
         <div className="inline-flex items-center justify-center w-8 h-1 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
      </footer>

      <RevealModal 
        isOpen={!!selectedFeature}
        onClose={() => setSelectedFeature(null)}
        feature={selectedFeature}
        targetUser={targetUser}
      />

      <PrivacyModal 
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />

    </div>
  );
};

export default MobileLayout;