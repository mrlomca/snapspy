import React, { useState, useEffect } from 'react';
import { User, Loader2, X, Search, ShieldCheck, BadgeCheck, Users as UsersIcon, Link as LinkIcon } from 'lucide-react';
import { SnapProfile } from '../types';

interface ConnectPanelProps {
  isConnected: boolean;
  connectedUser: string;
  profile: SnapProfile | null;
  onConnect: (username: string, profile: SnapProfile) => Promise<void>;
  onDisconnect: () => void;
}

type ConnectStatus = 'IDLE' | 'SEARCHING' | 'VERIFYING' | 'CONNECTED';

const formatCount = (n: number | null): string | null => {
  if (n == null) return null;
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1).replace(/\.0$/, '') + 'K';
  return n.toLocaleString();
};

const ProfileAvatar: React.FC<{ profile: SnapProfile; size?: number }> = ({ profile, size = 56 }) => {
  const [broken, setBroken] = useState(false);
  const initial = (profile.displayName || profile.username || '?').charAt(0).toUpperCase();
  if (profile.avatarUrl && !broken) {
    return (
      <img
        src={profile.avatarUrl}
        alt={profile.displayName}
        width={size}
        height={size}
        onError={() => setBroken(true)}
        className="rounded-2xl object-cover ring-2 ring-white/60 dark:ring-white/15 shadow-md bg-white/40"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-2xl flex items-center justify-center font-display font-extrabold text-black/80 bg-gradient-to-br from-snap-yellow to-snap-amber ring-2 ring-white/60 shadow-md"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
};

const ConnectPanel: React.FC<ConnectPanelProps> = ({ isConnected, connectedUser, profile, onConnect, onDisconnect }) => {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<ConnectStatus>('IDLE');
  const [error, setError] = useState('');
  const [statusText, setStatusText] = useState('');

  // Reset internal state if external props change (e.g., forced disconnect)
  useEffect(() => {
    if (!isConnected && status === 'CONNECTED') {
      setStatus('IDLE');
    }
  }, [isConnected]);

  const handleConnect = async () => {
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

    setStatus('SEARCHING');
    setStatusText('Searching Snapchat directory...');

    try {
      const res = await fetch(`/api/profile?username=${encodeURIComponent(uname)}`);
      const data: SnapProfile = await res.json();

      if (!data || !data.found) {
        setStatus('IDLE');
        if (data && data.reason === 'invalid') {
          setError('Invalid username format');
        } else if (data && (data.reason === 'upstream_error' || data.reason === 'network_error')) {
          setError('Snapchat is unreachable right now. Try again.');
        } else {
          setError(`No public profile found for @${uname}`);
        }
        return;
      }

      setStatus('VERIFYING');
      setStatusText('Profile found. Verifying public data...');
      await new Promise((resolve) => setTimeout(resolve, 750));

      await onConnect(uname, data);
      setStatus('CONNECTED');
    } catch {
      setStatus('IDLE');
      setError('Connection failed. Please try again.');
    }
  };

  const handleDisconnect = () => {
    setUsername('');
    setStatus('IDLE');
    onDisconnect();
  };

  const subs = profile ? formatCount(profile.subscriberCount) : null;

  return (
    <div className="relative liquid-glass glass-sheen p-5 rounded-4xl mb-6 transition-all duration-300 overflow-hidden">

      {status === 'CONNECTED' && profile ? (
        <div className="animate-fade-in-up">
           {/* Real public profile card */}
           <div className="flex items-start gap-4">
             <ProfileAvatar profile={profile} size={60} />

             <div className="flex-1 min-w-0">
               <div className="flex items-center gap-1.5">
                 <h3 className="font-display font-extrabold text-lg text-gray-900 dark:text-white truncate">
                   {profile.displayName}
                 </h3>
                 {profile.verified && <BadgeCheck size={17} className="text-ios-blue shrink-0" />}
               </div>
               <div className="text-sm font-semibold text-gray-500 dark:text-slate-400 truncate">@{profile.username}</div>

               <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                 {subs && (
                   <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-700 dark:text-slate-200">
                     <UsersIcon size={12} className="text-amber-500" />
                     {subs} <span className="font-medium text-gray-400 dark:text-slate-500">subscribers</span>
                   </span>
                 )}
                 {profile.website && (
                   <a
                     href={`https://${profile.website.replace(/^https?:\/\//, '')}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="inline-flex items-center gap-1 text-xs font-semibold text-ios-blue hover:underline truncate max-w-[160px]"
                   >
                     <LinkIcon size={11} className="shrink-0" />
                     {profile.website.replace(/^https?:\/\//, '')}
                   </a>
                 )}
               </div>
             </div>

             <button
              onClick={handleDisconnect}
              className="liquid-glass-soft text-gray-700 dark:text-slate-200 font-semibold px-3.5 py-2 rounded-2xl text-xs transition-all hover:scale-[1.04] active:scale-95 shrink-0"
             >
               Change
             </button>
           </div>

           {profile.bio && (
             <p className="mt-3 text-sm text-gray-600 dark:text-slate-300 leading-relaxed bg-white/40 dark:bg-white/5 rounded-2xl px-4 py-3 ring-1 ring-white/40 dark:ring-white/10">
               {profile.bio}
             </p>
           )}

           <div className="mt-3 flex items-center justify-between gap-2 px-1">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-slate-400">
                  {profile.isPublicProfile ? 'Public Profile · Live' : 'Profile Synced · Live'}
                </span>
              </span>
              {profile.snapcodeUrl && (
                <img src={profile.snapcodeUrl} alt="Snapcode" className="h-8 w-8 opacity-70 dark:invert" />
              )}
           </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
              Snapchat Username
            </h2>
            <div className="flex items-center gap-1.5 bg-white/50 dark:bg-white/10 px-2.5 py-1 rounded-full ring-1 ring-white/40 dark:ring-white/10">
                <ShieldCheck size={12} className="text-emerald-500 dark:text-emerald-400" />
                <span className="text-[10px] font-semibold text-gray-600 dark:text-slate-300">Anonymous</span>
            </div>
          </div>

          <div className="relative">
             <div className="flex gap-2">
                <div className="relative flex-1 group">
                    <input
                        type="text"
                        value={username}
                        disabled={status !== 'IDLE'}
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setError('');
                        }}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleConnect(); }}
                        placeholder="Enter username"
                        className={`w-full bg-white/55 dark:bg-white/5 border ${error ? 'border-rose-400/60' : 'border-white/50 dark:border-white/10 focus:border-snap-amber dark:focus:border-snap-yellow'} rounded-2xl px-4 py-3.5 pl-11 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none transition-all font-medium disabled:opacity-70 focus:ring-4 focus:ring-snap-yellow/25 backdrop-blur-sm`}
                    />
                    <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${status !== 'IDLE' ? 'text-amber-500' : 'text-gray-400 dark:text-slate-500'}`}>
                         {status === 'SEARCHING' || status === 'VERIFYING' ? <Loader2 size={18} className="animate-spin" /> : <User size={18} />}
                    </div>

                    {username && status === 'IDLE' && (
                        <button
                            onClick={() => setUsername('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 p-1 bg-black/5 dark:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>

                <button
                    onClick={handleConnect}
                    disabled={status !== 'IDLE' || !username}
                    className="relative overflow-hidden bg-gradient-to-br from-snap-yellow to-snap-amber text-black font-bold px-6 py-3 rounded-2xl text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-yellow-400/40 min-w-[104px] ring-1 ring-white/50"
                >
                    <span className="relative z-10">Connect</span>
                    <span className="absolute top-0 left-0 h-full w-1/3 bg-white/50 blur-md animate-sheen pointer-events-none" />
                </button>
            </div>

            {/* Status Feedback Area */}
            <div className={`overflow-hidden transition-all duration-300 ${status !== 'IDLE' || error ? 'max-h-10 mt-2.5' : 'max-h-0'}`}>
                 {error ? (
                     <p className="text-xs text-rose-500 font-semibold ml-1 flex items-center gap-1">
                        <X size={12} /> {error}
                     </p>
                 ) : (
                     <p className="text-xs text-amber-600 dark:text-yellow-400 font-semibold ml-1 flex items-center gap-2 animate-pulse">
                        <Search size={12} /> {statusText}
                     </p>
                 )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectPanel;
