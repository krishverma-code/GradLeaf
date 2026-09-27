'use client';

import React from 'react';

interface GradLeafLogoProps {
  size?: number;
  className?: string;
  variant?: 'squircle' | 'bare';
}

export default function GradLeafLogo({
  size = 40,
  className = '',
  variant = 'squircle',
}: GradLeafLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <defs>
        {/* Dark Squircle Gradient */}
        <linearGradient id="glSquircle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        {/* White Cap Gradient */}
        <linearGradient id="glCap" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </linearGradient>

        {/* Collegiate Forest Leaf Gradient */}
        <linearGradient id="glLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#43825d" />
          <stop offset="50%" stopColor="#274d36" />
          <stop offset="100%" stopColor="#173523" />
        </linearGradient>

        {/* Drop Shadow */}
        <filter id="glShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodOpacity="0.35" floodColor="#000" />
        </filter>
      </defs>

      {/* Squircle Background */}
      {variant === 'squircle' && (
        <rect
          x="4"
          y="4"
          width="112"
          height="112"
          rx="28"
          fill="url(#glSquircle)"
          stroke="#334155"
          strokeWidth="1.5"
        />
      )}

      {/* Graduation Cap + Leaf Group */}
      <g filter={variant === 'squircle' ? 'url(#glShadow)' : undefined}>
        {/* Skull Cap Base */}
        <path
          d="M32 53 V 65 C 32 74, 60 80, 60 80 C 60 80, 88 74, 88 65 V 53"
          stroke="url(#glCap)"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Mortarboard Diamond Top */}
        <polygon
          points="60,26 100,44 60,62 20,44"
          fill="url(#glCap)"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Center Button */}
        <circle cx="60" cy="44" r="3.5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />

        {/* Tassel Cord leading to Leaf */}
        <path
          d="M60 44 Q 82 46, 86 58 Q 88 64, 87 72"
          stroke="#274d36"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Organic Leaf Blade */}
        <path
          d="M87 70 C 75 74, 69 88, 78 99 C 91 102, 100 89, 87 70 Z"
          fill="url(#glLeaf)"
          stroke="#142d1f"
          strokeWidth="1.2"
        />

        {/* Central Leaf Vein */}
        <path
          d="M86 74 Q 82 86, 79 97"
          stroke="#ecfdf5"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Delicate Side Veins */}
        <path
          d="M84 81 Q 79 83, 76 86"
          stroke="#ecfdf5"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M82 87 Q 78 90, 76 93"
          stroke="#ecfdf5"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.8"
        />
      </g>
    </svg>
  );
}
