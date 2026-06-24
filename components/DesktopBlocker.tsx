import React from 'react';
import { Smartphone } from 'lucide-react';
import GhostLogo from './GhostLogo';

const DesktopBlocker: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-snapbg flex items-center justify-center z-50 px-6">
      <div className="snap-card rounded-[32px] p-10 flex flex-col items-center max-w-sm text-center">
        <div className="animate-float drop-hard mb-6">
          <GhostLogo size={70} />
        </div>
        <h2 className="font-display text-2xl font-extrabold text-snapink mb-3">Mobile Only Experience</h2>
        <p className="text-snapbrown text-sm leading-relaxed font-medium">
          Please open <span className="text-snapink font-bold">SnapNoid</span> on your smartphone for the full experience.
        </p>
        <div className="mt-7 flex items-center gap-2 text-xs text-snapbrown bg-black/5 px-4 py-2 rounded-full font-semibold">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Optimized for iOS &amp; Android</span>
        </div>
      </div>
    </div>
  );
};

export default DesktopBlocker;
