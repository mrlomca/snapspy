import React from 'react';

interface GhostLogoProps {
  size?: number;
  className?: string;
}

// Snapchat-style ghost: white body, black outline, two eyes, scalloped feet.
const GhostLogo: React.FC<GhostLogoProps> = ({ size = 64, className = '' }) => (
  <svg
    width={size}
    height={size * (76 / 64)}
    viewBox="0 0 64 76"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M32 5
         C 20.5 5 13.5 13.5 13.5 26.5
         L 13.5 60
         Q 16.5 66.5 19.5 60.2
         Q 22.5 53.9 25.5 60.2
         Q 28.5 66.5 31.5 60.2
         Q 34.5 53.9 37.5 60.2
         Q 40.5 66.5 43.5 60.2
         Q 46.5 53.9 49.5 60
         L 50.5 26.5
         C 50.5 13.5 43.5 5 32 5 Z"
      fill="#fff"
      stroke="#161616"
      strokeWidth="3.6"
      strokeLinejoin="round"
    />
    <ellipse cx="25" cy="31" rx="3.1" ry="4.6" fill="#161616" />
    <ellipse cx="39" cy="31" rx="3.1" ry="4.6" fill="#161616" />
  </svg>
);

export default GhostLogo;
