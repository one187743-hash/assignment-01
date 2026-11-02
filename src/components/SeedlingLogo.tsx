import React from 'react';

interface SeedlingLogoProps {
  className?: string;
  size?: number;
}

export const SeedlingLogo: React.FC<SeedlingLogoProps> = ({ className = 'w-8 h-8', size }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="14" fill="#1f4d3a" />
      <path
        d="M32 50V30M32 30c0-9 6-14 15-14 0 9-6 14-15 14zM32 36c0-7-5-11-13-11 0 7 5 11 13 11z"
        fill="none"
        stroke="#f2b134"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SeedlingLogo;
