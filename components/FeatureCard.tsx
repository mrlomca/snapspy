import React from 'react';
import { ChevronRight, Lock } from 'lucide-react';
import { Feature } from '../types';

interface FeatureCardProps {
  feature: Feature;
  onClick: (feature: Feature) => void;
  disabled?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, onClick, disabled }) => {
  return (
    <button
      onClick={() => !disabled && onClick(feature)}
      disabled={disabled}
      className={`w-full relative overflow-hidden p-4 rounded-4xl transition-all duration-300 group glass-sheen
        ${disabled
          ? 'liquid-glass-soft opacity-60 cursor-not-allowed'
          : 'liquid-glass hover:scale-[1.015] hover:-translate-y-0.5 active:scale-[0.98]'
        }`}
    >
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className={`relative p-3.5 rounded-2xl transition-all duration-300 ring-1 ring-white/40 dark:ring-white/10
            ${disabled
              ? 'bg-white/30 dark:bg-white/5'
              : 'bg-white/55 dark:bg-white/10 group-hover:bg-white/75 dark:group-hover:bg-white/15 shadow-sm'}`}>
            <div className={`${disabled ? 'text-gray-400 dark:text-slate-600 grayscale' : 'transition-transform duration-300 group-hover:scale-110'}`}>
              {feature.icon}
            </div>
          </div>
          <div className="text-left">
            <h3 className={`font-bold text-[15px] tracking-tight ${disabled ? 'text-gray-500 dark:text-slate-500' : 'text-gray-900 dark:text-white'}`}>
                {feature.title}
            </h3>
            <p className={`text-xs mt-0.5 ${disabled ? 'text-gray-400 dark:text-slate-600' : 'text-gray-500 dark:text-slate-400'}`}>
                {feature.description}
            </p>
          </div>
        </div>

        <div className={`${disabled ? 'text-gray-300 dark:text-slate-700' : 'text-gray-400 dark:text-slate-500 group-hover:text-amber-500 dark:group-hover:text-yellow-400 group-hover:translate-x-0.5'} transition-all`}>
          {feature.locked ? <Lock size={16} /> : <ChevronRight size={20} />}
        </div>
      </div>
    </button>
  );
};

export default FeatureCard;
