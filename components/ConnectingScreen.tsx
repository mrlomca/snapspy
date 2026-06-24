import React from 'react';
import GhostLogo from './GhostLogo';

interface ConnectingScreenProps {
  username: string;
}

const ConnectingScreen: React.FC<ConnectingScreenProps> = ({ username }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8">
      <div className="w-full max-w-sm">
        <h2 className="font-display font-extrabold text-3xl text-snapink text-center mb-5">
          Connecting...
        </h2>

        {/* Progress track with the ghost riding the fill */}
        <div className="relative h-1.5 w-full bg-black/15 rounded-full">
          <div className="absolute left-0 top-0 h-full bg-snapink rounded-full animate-load-fill" />
          <div className="absolute -top-[15px] animate-ghost-run" style={{ left: '3%' }}>
            <div className="-translate-x-1/2 animate-wiggle">
              <GhostLogo size={26} className="drop-hard" />
            </div>
          </div>
        </div>

        <p className="mt-7 text-center text-sm font-semibold tracking-wide text-snapbrown">
          {username ? <>Locating <span className="text-snapink">@{username}</span>...</> : 'Locating profile...'}
        </p>
      </div>
    </div>
  );
};

export default ConnectingScreen;
