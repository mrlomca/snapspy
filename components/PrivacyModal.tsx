import React from 'react';
import { X } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Section = ({ title, children }: { title: string, children?: React.ReactNode }) => (
  <div className="bg-gray-50 dark:bg-slate-800/40 p-5 rounded-xl border border-gray-100 dark:border-slate-700/50">
    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-base">{title}</h3>
    <p className="leading-relaxed text-gray-600 dark:text-slate-400">{children}</p>
  </div>
);

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-pop-in border border-gray-100 dark:border-slate-700">
        
        <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur z-10">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">SnapSpy Privacy Policy</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto no-scrollbar space-y-4 text-sm text-gray-600 dark:text-slate-300">
           <p className="text-xs text-gray-400 dark:text-slate-500 mb-2">Last updated: November 25, 2025</p>
           
           <p className="mb-4">This Privacy Policy describes how your personal information is collected, used, and shared when you visit SnapSpy (the "Platform").</p>

           <Section title="Information We Collect">
             SnapSpy is designed for entertainment purposes only and does not collect or store any personal information. Any usernames or information input into the platform are not stored, tracked, or transmitted to external servers.
           </Section>

           <Section title="How We Use Your Information">
             SnapSpy does not collect or store any personal information, therefore we do not use it for any purpose. The platform simulates processing but does not perform any actual data retrieval or analysis.
           </Section>

           <Section title="Data Security">
             SnapSpy prioritizes user privacy and security. We implement industry-standard security measures to protect any interaction with our platform.
           </Section>

            <Section title="Cookies and Tracking">
             SnapSpy does not use cookies or any tracking technologies to collect information about visitors.
           </Section>

           <Section title="Updates to Privacy Policy">
             We may update this privacy policy periodically to reflect changes in our practices or for operational, legal, or regulatory reasons.
           </Section>

           <Section title="Contact Information">
             For questions about our privacy practices or to submit a privacy-related request, please contact the SnapSpy support team.
           </Section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;