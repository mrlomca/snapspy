import React, { useState } from 'react';
import { MapPin, Eye, Sparkles, ShieldOff, MessageCircle, X, FileText } from 'lucide-react';
import SearchScreen from './SearchScreen';
import ConnectingScreen from './ConnectingScreen';
import ProfileScreen from './ProfileScreen';
import RevealModal from './RevealModal';
import PrivacyModal from './PrivacyModal';
import { Feature, FeatureType, SnapProfile } from '../types';
import bestFriendsImg from '../images/best-friends.jpg';

// Independent clone of the main page (rendered at /clone). Shares the same
// presentational screens as MobileLayout but keeps its own feature list and
// state, so it can be customised separately from the main funnel.
const FEATURES: Feature[] = [
  {
    id: FeatureType.LIVE_LOCATION,
    title: 'Check Live Location',
    description: 'Track last known GPS location',
    icon: <MapPin size={22} className="text-snapink" />,
  },
  {
    id: FeatureType.SCORE_CHECKS,
    title: 'Reveal Score Checks',
    description: 'See who recently viewed your score',
    icon: <Eye size={22} className="text-snapink" />,
  },
  {
    id: FeatureType.BEST_FRIENDS,
    title: 'Reveal Best Friends',
    description: 'View the 8 Best Friends list',
    icon: <Sparkles size={22} className="text-snapink" />,
  },
  {
    id: FeatureType.EYES_ONLY,
    title: 'Reveal Eyes Only',
    description: 'Access hidden locked content',
    icon: <ShieldOff size={22} className="text-snapink" />,
  },
  {
    id: FeatureType.CHAT_HISTORY,
    title: 'Reveal Chat History',
    description: 'Recover sent and received messages',
    icon: <MessageCircle size={22} className="text-snapink" />,
  },
];

type Step = 'SEARCH' | 'CONNECTING' | 'PROFILE';

const CloneLayout: React.FC = () => {
  const [step, setStep] = useState<Step>('SEARCH');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<SnapProfile | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleContinue = async () => {
    const uname = username.trim().replace(/^@+/, '');
    if (!uname) {
      setError('Please enter a username');
      return;
    }
    if (uname.length < 3 || uname.length > 15) {
      setError('Username must be between 3 and 15 characters');
      return;
    }
    setError('');
    setStep('CONNECTING');

    try {
      // Run the lookup and a minimum loader time in parallel.
      const [res] = await Promise.all([
        fetch(`/api/profile?username=${encodeURIComponent(uname)}`).then((r) => r.json() as Promise<SnapProfile>),
        new Promise((resolve) => setTimeout(resolve, 2200)),
      ]);

      if (!res || !res.found) {
        setStep('SEARCH');
        if (res && res.reason === 'invalid') {
          setError('Invalid username format');
        } else if (res && (res.reason === 'upstream_error' || res.reason === 'network_error')) {
          setError('Snapchat is unreachable right now. Try again.');
        } else {
          setError(`No public profile found for @${uname}`);
        }
        return;
      }

      setProfile(res);
      setStep('PROFILE');
    } catch {
      setStep('SEARCH');
      setError('Connection failed. Please try again.');
    }
  };

  const handleBack = () => {
    setStep('SEARCH');
    setProfile(null);
    setSelectedFeature(null);
  };

  return (
    <div className="min-h-screen bg-snapbg text-snapink font-sans">
      {step === 'SEARCH' && (
        <SearchScreen
          username={username}
          setUsername={(v) => { setUsername(v); if (error) setError(''); }}
          onContinue={handleContinue}
          error={error}
          onOpenMenu={() => setMenuOpen(true)}
        />
      )}

      {step === 'CONNECTING' && (
        <ConnectingScreen username={username.trim().replace(/^@+/, '')} />
      )}

      {step === 'PROFILE' && profile && (
        <ProfileScreen
          profile={profile}
          features={FEATURES}
          onSelectFeature={setSelectedFeature}
          onBack={handleBack}
          onOpenMenu={() => setMenuOpen(true)}
        />
      )}

      {/* Hamburger menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[55]" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/20" />
          <div
            className="absolute top-14 right-5 snap-card rounded-2xl p-2 w-52 animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { setShowPrivacy(true); setMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-snapink hover:bg-black/5 transition-colors"
            >
              <FileText size={16} className="text-snapbrown" /> Privacy Policy
            </button>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-snapink hover:bg-black/5 transition-colors"
            >
              <X size={16} className="text-snapbrown" /> Close
            </button>
          </div>
        </div>
      )}

      <RevealModal
        isOpen={!!selectedFeature}
        onClose={() => setSelectedFeature(null)}
        feature={selectedFeature}
        targetUser={profile ? profile.username : username}
        profile={profile}
        revealRedirects={{ [FeatureType.BEST_FRIENDS]: bestFriendsImg }}
      />

      <PrivacyModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />
    </div>
  );
};

export default CloneLayout;
