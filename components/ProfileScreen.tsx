import React, { useState } from 'react';
import { ArrowLeft, Menu, BadgeCheck, Users as UsersIcon, Link as LinkIcon, ChevronRight } from 'lucide-react';
import { Feature, SnapProfile } from '../types';
import GhostLogo from './GhostLogo';

interface ProfileScreenProps {
  profile: SnapProfile;
  features: Feature[];
  onSelectFeature: (f: Feature) => void;
  onBack: () => void;
  onOpenMenu: () => void;
}

const formatCount = (n: number | null): string | null => {
  if (n == null) return null;
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1).replace(/\.0$/, '') + 'K';
  return n.toLocaleString();
};

const Avatar: React.FC<{ profile: SnapProfile }> = ({ profile }) => {
  const [broken, setBroken] = useState(false);
  const showImg = profile.avatarUrl && !broken;
  return (
    <div className="relative">
      {/* soft offset shadow */}
      <div className="absolute inset-0 translate-x-1.5 translate-y-2 rounded-full bg-black/10 blur-[2px]" />
      <div className="relative w-[132px] h-[132px] rounded-full bg-snapblue ring-4 ring-white/70 shadow-lg overflow-hidden flex items-center justify-center">
        {showImg ? (
          <img
            src={profile.avatarUrl as string}
            alt={profile.displayName}
            onError={() => setBroken(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="pt-3"><GhostLogo size={74} /></div>
        )}
      </div>
      {/* LIVE badge */}
      <div className="absolute bottom-2 right-1 bg-snapink text-white text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        LIVE
      </div>
    </div>
  );
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ profile, features, onSelectFeature, onBack, onOpenMenu }) => {
  const subs = formatCount(profile.subscriberCount);

  return (
    <div className="min-h-screen px-6 pb-12">
      {/* Header */}
      <header className="flex items-center justify-between pt-5">
        <button onClick={onBack} aria-label="Back" className="p-2 -ml-2 text-snapink active:scale-90 transition-transform">
          <ArrowLeft size={24} strokeWidth={2.6} />
        </button>
        <span className="font-display font-extrabold text-lg text-snapink">SnapSpy</span>
        <button onClick={onOpenMenu} aria-label="Menu" className="p-2 -mr-2 text-snapink active:scale-90 transition-transform">
          <Menu size={24} strokeWidth={2.4} />
        </button>
      </header>

      {/* Profile */}
      <div className="flex flex-col items-center mt-6 animate-fade-in-up">
        <Avatar profile={profile} />

        <div className="flex items-center gap-1.5 mt-5">
          <h2 className="font-display font-extrabold text-2xl text-snapink">
            {profile.displayName && profile.displayName !== profile.username ? profile.displayName : `@${profile.username}`}
          </h2>
          {profile.verified && <BadgeCheck size={20} className="text-snapblue" fill="#4FC3F7" stroke="#fff" />}
        </div>

        {profile.displayName && profile.displayName !== profile.username && (
          <div className="text-sm font-semibold text-snapbrown -mt-0.5">@{profile.username}</div>
        )}

        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="w-2 h-2 rounded-full bg-snapgreen animate-pulse" />
          <span className="text-xs font-bold tracking-[0.18em] uppercase text-snapgreen">Online Now</span>
        </div>

        {/* Public info chips */}
        {(subs || profile.website) && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {subs && (
              <span className="snap-card rounded-full px-3.5 py-1.5 text-xs font-bold text-snapink flex items-center gap-1.5">
                <UsersIcon size={13} className="text-snapbrown" /> {subs} subscribers
              </span>
            )}
            {profile.website && (
              <a
                href={`https://${profile.website.replace(/^https?:\/\//, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="snap-card rounded-full px-3.5 py-1.5 text-xs font-bold text-snapink flex items-center gap-1.5 max-w-[190px] truncate"
              >
                <LinkIcon size={12} className="text-snapbrown shrink-0" /> {profile.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        )}

        {profile.bio && (
          <p className="mt-3 text-sm text-center text-snapink/80 font-medium max-w-xs leading-relaxed">
            {profile.bio}
          </p>
        )}
      </div>

      {/* Available tools */}
      <div className="mt-8 space-y-3.5 max-w-md mx-auto">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-snapbrown px-1 mb-1">
          Available Tools
        </div>
        {features.map((feature, index) => (
          <button
            key={feature.id}
            onClick={() => onSelectFeature(feature)}
            className="snap-card w-full rounded-3xl px-5 py-4 flex items-center justify-between group active:scale-[0.98] transition-transform opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <span className="flex items-center gap-4">
              <span className="w-11 h-11 rounded-2xl bg-snapbg/70 flex items-center justify-center text-snapink shrink-0">
                {feature.icon}
              </span>
              <span className="text-left">
                <span className="block font-bold text-[15px] text-snapink leading-tight">{feature.title}</span>
                <span className="block text-xs text-snapbrown font-medium mt-0.5">{feature.description}</span>
              </span>
            </span>
            <ChevronRight size={20} className="text-snapbrown group-hover:translate-x-0.5 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileScreen;
