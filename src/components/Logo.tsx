import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = '', size = 48 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size * 0.85}
      viewBox="0 0 540 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none`}
    >
      <defs>
        {/* Soft elegant 3D light gradients */}
        <linearGradient id="qgGradient" x1="0" y1="0" x2="540" y2="460" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c084fc" /> {/* purple-400 */}
          <stop offset="40%" stopColor="#a855f7" /> {/* purple-500 */}
          <stop offset="70%" stopColor="#8b5cf6" /> {/* violet-500 */}
          <stop offset="100%" stopColor="#6d28d9" /> {/* violet-700 */}
        </linearGradient>

        <linearGradient id="glowGradient" x1="0" y1="0" x2="0" y2="460" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#d8b4fe" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.2" />
        </linearGradient>

        <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#3b0764" floodOpacity="0.25" />
        </filter>

        <filter id="innerShadow">
          <feComponentTransfer in="SourceAlpha">
            <feFuncA type="linear" slope="1" />
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feOffset dx="0" dy="4" />
          <feComposite operator="out" in2="SourceGraphic" result="inverse" />
          <feFlood floodColor="#000" floodOpacity="0.3" result="color" />
          <feComposite operator="in" in2="inverse" result="shadow" />
          <feComposite operator="over" in2="SourceGraphic" />
        </filter>
      </defs>

      {/* Background soft tech accent grid glow */}
      <g opacity="0.15">
        <circle cx="270" cy="230" r="180" fill="url(#glowGradient)" filter="blur(40px)" />
      </g>

      {/* Main Stylized 'Q' and 'G' Combined Letterform */}
      <g filter="url(#dropShadow)">
        {/* Q Letter Body - Left Circle */}
        <path
          d="M 190,80 
             C 90,80 15,145 15,225 
             C 15,305 90,370 190,370 
             C 230,370 265,355 290,330
             L 335,385
             C 342,392 355,392 362,385
             L 380,367
             C 387,360 387,348 380,341
             L 332,288
             C 352,260 365,225 365,185
             C 365,145 352,110 332,82
             C 310,95 285,105 255,105
             C 210,105 175,80 190,80 Z"
          fill="url(#qgGradient)"
          filter="url(#innerShadow)"
        />

        {/* Q's inner cutout */}
        <path
          d="M 190,140 
             C 135,140 90,178 90,225 
             C 90,272 135,310 190,310 
             C 220,310 245,295 262,272
             L 220,225
             L 265,180
             C 248,155 221,140 190,140 Z"
          fill="#ffffff"
          opacity="0.95"
        />

        {/* G Letter Body - Right Circle with straight lines */}
        <path
          d="M 370,110 
             C 340,110 320,120 300,135
             C 315,160 325,190 325,225
             C 325,270 305,305 280,325
             C 298,340 325,350 355,350
             C 415,350 465,308 465,255
             L 380,255
             C 370,255 360,265 360,275
             L 360,305
             L 470,305
             L 470,390
             C 470,405 455,415 440,415
             C 425,415 415,405 415,390
             L 415,360
             L 355,360
             C 295,360 245,305 245,240
             C 245,160 315,95 390,95
             C 435,95 475,115 505,150
             L 522,125
             C 485,80 430,110 370,110 Z"
          fill="url(#qgGradient)"
          filter="url(#innerShadow)"
        />

        {/* QG Connecting Core Bridge - gives a modern tech-integrated aesthetic */}
        <path
          d="M 245,215 
             L 295,215 
             L 280,245 
             L 230,245 
             Z"
          fill="url(#qgGradient)"
          opacity="0.85"
        />
      </g>
    </svg>
  );
}
