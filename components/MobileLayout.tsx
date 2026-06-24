import React, { useState, useEffect } from 'react';
import { Ghost, Eye, MessageCircle, Moon, Sun, Shield, Sparkles } from 'lucide-react';
import ConnectPanel from './ConnectPanel';
import FeatureCard from './FeatureCard';
import RevealModal from './RevealModal';
import PrivacyModal from './PrivacyModal';
import { Feature, FeatureType, SnapProfile } from '../types';

const FEATURES: Feature[] = [
  {
    id: FeatureType.SCORE_CHECKS,
    title: 'Reveal Score Checks',
    description: 'See who recently viewed your score',
    icon: <Eye size={24} className="text-amber-500 dark:text-amber-300" />,
  },
  {
    id: FeatureType.BEST_FRIENDS,
    title: 'Reveal Best Friends',
    description: 'View the 8 Best Friends list',
    icon: <Sparkles size={24} className="text-fuchsia-500 dark:text-fuchsia-400" />,
  },
  {
    id: FeatureType.EYES_ONLY,
    title: 'Reveal Eyes Only',
    description: 'Access hidden locked content',
    icon: <Shield size={24} className="text-indigo-500 dark:text-indigo-400" />,
  },
  {
    id: FeatureType.CHAT_HISTORY,
    title: 'Reveal Chat History',
    description: 'Recover sent and received messages',
    icon: <MessageCircle size={24} className="text-emerald-500 dark:text-emerald-400" />,
  },
];

const AuroraBackground: React.FC = () => (
  <>
    <div className="aurora-field">
      <div
        className="aurora-blob animate-aurora"
        style={{ top: '-12%', left: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, #FFFC00, transparent 70%)' }}
      />
      <div
        className="aurora-blob animate-aurora"
        style={{ top: '20%', right: '-18%', width: '55vw', height: '55vw', background: 'radial-gradient(circle, #BF5AF2, transparent 70%)', animationDelay: '-6s' }}
      />
      <div
        className="aurora-blob animate-aurora"
        style={{ bottom: '-15%', left: '10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, #0A84FF, transparent 70%)', animationDelay: '-11s' }}
      />
    </div>
    <div className="grain" />
  </>
);

const MobileLayout: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [targetUser, setTargetUser] = useState('');
  const [profile, setProfile] = useState<SnapProfile | null>(null);
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

  const handleConnect = async (username: string, snapProfile: SnapProfile) => {
    setTargetUser(username);
    setProfile(snapProfile);
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setTargetUser('');
    setProfile(null);
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
    <div className="relative min-h-screen pb-12 text-gray-900 dark:text-white transition-colors duration-500 font-sans overflow-x-hidden">
      <AuroraBackground />

      {/* Header */}
      <header className="relative z-30 mx-3 mt-3 px-5 py-3.5 flex items-center justify-between liquid-glass glass-sheen rounded-3xl sticky top-3">
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-2xl flex items-center justify-center bg-gradient-to-br from-snap-yellow to-snap-amber shadow-lg shadow-yellow-400/40 animate-float">
             <Ghost className="text-black/85" size={20} strokeWidth={2.4} />
             <div className="absolute inset-0 rounded-2xl ring-1 ring-white/60" />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight">
            Snap<span className="bg-gradient-to-r from-amber-500 to-yellow-500 dark:from-yellow-300 dark:to-amber-300 bg-clip-text text-transparent">Spy</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrivacy(true)}
              className="text-xs font-semibold text-gray-600/80 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white transition-colors px-3 py-2 rounded-full hover:bg-white/40 dark:hover:bg-white/10"
            >
              Privacy
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-500 hover:text-amber-500 dark:text-slate-300 dark:hover:text-yellow-300 transition-all p-2.5 rounded-full bg-white/40 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 active:scale-90 ring-1 ring-white/40 dark:ring-white/10"
            >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-5 pt-7 max-w-lg mx-auto">

        <ConnectPanel
          isConnected={isConnected}
          connectedUser={targetUser}
          profile={profile}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />

        <div className="space-y-3.5">
          <div className="flex items-center gap-2 mb-2 px-1.5">
             <Shield size={13} className="text-amber-500/80 dark:text-yellow-400/80" />
             <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-slate-400">Available Tools</span>
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
      <footer className="relative z-10 mt-12 text-center pb-6">
         <div className="inline-flex items-center justify-center w-10 h-1.5 bg-gray-300/60 dark:bg-white/15 rounded-full"></div>
      </footer>

      <RevealModal
        isOpen={!!selectedFeature}
        onClose={() => setSelectedFeature(null)}
        feature={selectedFeature}
        targetUser={targetUser}
        profile={profile}
      />

      <PrivacyModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />

    </div>
  );
};

export default MobileLayout;
