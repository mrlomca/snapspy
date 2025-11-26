import React from 'react';
import { Smartphone } from 'lucide-react';

const DesktopBlocker: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-[#0f172a] flex items-center justify-center z-50">
      <div className="bg-gray-900 dark:bg-[#1e293b] text-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm text-center transform transition-all hover:scale-105 duration-300 border border-gray-800 dark:border-slate-700">
        <div className="w-16 h-16 rounded-full bg-yellow-900/30 flex items-center justify-center mb-6 border-2 border-yellow-400/20">
            <Smartphone className="w-8 h-8 text-yellow-400" />
        </div>
        <h2 className="text-xl font-bold mb-3">Mobile Only Experience</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Please access <span className="text-yellow-400 font-semibold">SnapSpy</span> from your smartphone for the best experience.
        </p>
      </div>
    </div>
  );
};

export default DesktopBlocker;