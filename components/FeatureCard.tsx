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
      className={`w-full relative overflow-hidden bg-white dark:bg-[#1e293b] p-4 rounded-2xl border transition-all duration-300 group
        ${disabled 
          ? 'border-transparent opacity-60 cursor-not-allowed' 
          : 'border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-slate-900/50 hover:shadow-md hover:border-gray-200 dark:hover:border-slate-700 active:scale-[0.98]'
        }`}
    >
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-xl transition-colors duration-300 ${disabled ? 'bg-gray-100 dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-800 group-hover:bg-yellow-50 dark:group-hover:bg-yellow-900/10'}`}>
            <div className={`${disabled ? 'text-gray-400 dark:text-slate-600 grayscale' : 'transition-transform duration-300 group-hover:scale-110'}`}>
              {feature.icon}
            </div>
          </div>
          <div className="text-left">
            <h3 className={`font-bold text-sm ${disabled ? 'text-gray-500 dark:text-slate-500' : 'text-gray-900 dark:text-gray-100'}`}>
                {feature.title}
            </h3>
            <p className={`text-xs mt-0.5 ${disabled ? 'text-gray-400 dark:text-slate-600' : 'text-gray-500 dark:text-slate-400'}`}>
                {feature.description}
            </p>
          </div>
        </div>
        
        <div className={`${disabled ? 'text-gray-300 dark:text-slate-700' : 'text-gray-300 dark:text-slate-600 group-hover:text-yellow-500 dark:group-hover:text-yellow-400'} transition-colors`}>
          {feature.locked ? <Lock size={16} /> : <ChevronRight size={20} />}
        </div>
      </div>
      
      {/* Subtle gradient overlay on hover for premium feel (only if active) */}
      {!disabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-gray-50/50 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </button>
  );
};

export default FeatureCard;