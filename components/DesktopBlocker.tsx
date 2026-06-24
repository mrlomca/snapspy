import React from 'react';
import { Smartphone, Ghost } from 'lucide-react';

const DesktopBlocker: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden bg-[#06070d]">
      {/* Aurora backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full blur-[80px] opacity-40 animate-aurora" style={{ background: 'radial-gradient(circle, #FFFC00, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[55vw] h-[55vw] rounded-full blur-[80px] opacity-30 animate-aurora" style={{ background: 'radial-gradient(circle, #BF5AF2, transparent 70%)', animationDelay: '-8s' }} />
      </div>

      <div className="relative liquid-glass glass-sheen text-white p-9 rounded-5xl flex flex-col items-center max-w-sm text-center transition-all hover:scale-[1.02] duration-300 mx-4">
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-snap-yellow to-snap-amber flex items-center justify-center mb-7 shadow-xl shadow-yellow-400/30 animate-float">
            <Ghost className="w-9 h-9 text-black/85" strokeWidth={2.2} />
            <div className="absolute inset-0 rounded-3xl ring-1 ring-white/50" />
        </div>
        <h2 className="font-display text-2xl font-extrabold mb-3 tracking-tight">Mobile Only Experience</h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          Please open <span className="bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent font-bold">SnapSpy</span> on your smartphone for the full experience.
        </p>
        <div className="mt-7 flex items-center gap-2 text-xs text-slate-400 bg-white/5 px-4 py-2 rounded-full ring-1 ring-white/10">
            <Smartphone className="w-3.5 h-3.5" />
            <span className="font-medium">Optimized for iOS &amp; Android</span>
        </div>
      </div>
    </div>
  );
};

export default DesktopBlocker;
