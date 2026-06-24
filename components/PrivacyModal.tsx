import React from 'react';
import { X } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Section = ({ title, children }: { title: string, children?: React.ReactNode }) => (
  <div className="bg-black/[0.04] p-5 rounded-2xl">
    <h3 className="font-bold text-snapink mb-2 text-base">{title}</h3>
    <p className="leading-relaxed text-snapink/70">{children}</p>
  </div>
);

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/45 transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-[#FBF7E6] rounded-[28px] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-pop-in">

        <div className="p-5 border-b border-black/10 flex justify-between items-center sticky top-0 bg-[#FBF7E6] z-10">
          <h2 className="font-display text-xl font-extrabold text-snapink tracking-tight">SnapNoid Privacy Policy</h2>
          <button
            onClick={onClose}
            className="text-snapink/50 hover:text-snapink transition-colors p-2 rounded-full bg-black/5 active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto no-scrollbar space-y-4 text-sm text-snapink/70">
           <p className="text-xs text-snapbrown mb-2">Last updated: November 25, 2025</p>

           <p className="mb-4">This Privacy Policy describes how your personal information is collected, used, and shared when you visit SnapNoid (the "Platform").</p>

           <Section title="Information We Collect">
             SnapNoid is designed for entertainment purposes only and does not collect or store any personal information. Any usernames or information input into the platform are not stored, tracked, or transmitted to external servers.
           </Section>

           <Section title="How We Use Your Information">
             SnapNoid does not collect or store any personal information, therefore we do not use it for any purpose. The platform simulates processing but does not perform any actual data retrieval or analysis.
           </Section>

           <Section title="Data Security">
             SnapNoid prioritizes user privacy and security. We implement industry-standard security measures to protect any interaction with our platform.
           </Section>

            <Section title="Cookies and Tracking">
             SnapNoid does not use cookies or any tracking technologies to collect information about visitors.
           </Section>

           <Section title="Updates to Privacy Policy">
             We may update this privacy policy periodically to reflect changes in our practices or for operational, legal, or regulatory reasons.
           </Section>

           <Section title="Contact Information">
             For questions about our privacy practices or to submit a privacy-related request, please contact the SnapNoid support team.
           </Section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
