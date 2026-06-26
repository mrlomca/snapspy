import React from 'react';
import { Menu, AlertCircle } from 'lucide-react';
import GhostLogo from './GhostLogo';

interface SearchScreenProps {
  username: string;
  setUsername: (v: string) => void;
  onContinue: () => void;
  error: string;
  onOpenMenu: () => void;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ username, setUsername, onContinue, error, onOpenMenu }) => {
  return (
    <div className="min-h-screen flex flex-col px-7">
      {/* Top bar */}
      <header className="flex items-center justify-end pt-5">
        <button
          onClick={onOpenMenu}
          aria-label="Menu"
          className="p-2 -mr-2 text-snapink active:scale-90 transition-transform"
        >
          <Menu size={26} strokeWidth={2.4} />
        </button>
      </header>

      {/* Centered content */}
      <main className="flex-1 flex flex-col items-center justify-center -mt-10 w-full max-w-sm mx-auto">
        <div className="animate-float drop-hard">
          <GhostLogo size={78} />
        </div>

        <h1 className="font-display font-extrabold text-4xl tracking-tight mt-6 mb-8 text-snapink">
          SnapSpy
        </h1>

        <div className="w-full">
          <input
            type="text"
            value={username}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onContinue(); }}
            placeholder="Enter username"
            className="snap-input w-full rounded-[22px] px-6 py-4 text-[15px] font-medium outline-none transition-all"
          />

          {error && (
            <p className="mt-2.5 ml-1 text-sm font-semibold text-red-600 flex items-center gap-1.5">
              <AlertCircle size={15} /> {error}
            </p>
          )}

          <button
            onClick={onContinue}
            disabled={!username.trim()}
            className="snap-btn w-full rounded-full py-4 mt-4 font-bold tracking-[0.15em] text-[15px] uppercase transition-transform"
          >
            Continue
          </button>
        </div>

        <p className="mt-5 text-xs font-semibold text-snapbrown tracking-wide">
          Updated: Today &middot; Version: v1.2
        </p>
      </main>
    </div>
  );
};

export default SearchScreen;
