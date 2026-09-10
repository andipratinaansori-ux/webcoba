import React from 'react';

interface LogoProps {
  className?: string;
}

export const CiscoLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <svg viewBox="0 0 64 40" className={`text-sky-500 fill-current ${className}`} aria-hidden="true">
    {/* Cisco Bridge Waves */}
    <rect x="6" y="24" width="3" height="12" rx="1" />
    <rect x="12" y="18" width="3" height="18" rx="1" />
    <rect x="18" y="12" width="3" height="24" rx="1" />
    <rect x="24" y="6" width="3" height="30" rx="1" />
    <rect x="30" y="2" width="3" height="34" rx="1" />
    <rect x="36" y="6" width="3" height="30" rx="1" />
    <rect x="42" y="12" width="3" height="24" rx="1" />
    <rect x="48" y="18" width="3" height="18" rx="1" />
    <rect x="54" y="24" width="3" height="12" rx="1" />
  </svg>
);

export const HuaweiLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <svg viewBox="0 0 64 64" className={`${className}`} aria-hidden="true">
    {/* Stylized Huawei flower petals */}
    <g fill="#EC1C24">
      {/* Center Top */}
      <path d="M32 4c-1.2 5.5-3.5 12-3.5 16h7c0-4-2.3-10.5-3.5-16z" />
      {/* Left 1 */}
      <path d="M22.5 7.5C20 12.5 17 18.5 17.5 22.5c3.2-1.5 6.5-3 7-5.5-1.2-3.5-2-9.5-2-9.5z" />
      {/* Right 1 */}
      <path d="M41.5 7.5c.5 0-.3 6-1.5 9.5.5 2.5 3.8 4 7 5.5.5-4-2.5-10-5-15z" />
      {/* Left 2 */}
      <path d="M14 15.5c-4.5 4-7.5 9.5-6.5 13.5 3.2-.5 7.2-1.2 8.5-3.5-2.2-2.8-2-10-2-10z" />
      {/* Right 2 */}
      <path d="M50 15.5s.2 7.2-2 10c1.3 2.3 5.3 3 8.5 3.5 1-4-2-9.5-6.5-13.5z" />
      {/* Left Bottom */}
      <path d="M8.5 27c-5 2.5-6.5 8-5 12 3.5 0 7.5-.5 9-2.5-2.5-2.5-4-9.5-4-9.5z" />
      {/* Right Bottom */}
      <path d="M55.5 27s-1.5 7-4 9.5c1.5 2 5.5 2.5 9 2.5 1.5-4 0-9.5-5-12z" />
      {/* Center Bottom stem connector */}
      <path d="M32 25.5c-.8 0-1.5 1-1.5 3s.7 4.5 1.5 4.5 1.5-2.5 1.5-4.5-.7-3-1.5-3z" />
    </g>
  </svg>
);

export const FortinetLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <svg viewBox="0 0 64 64" className={`${className}`} aria-hidden="true">
    {/* Fortinet Security Grid Castle/F shape */}
    <g fill="#EE3124">
      <rect x="8" y="12" width="12" height="12" rx="2" />
      <rect x="26" y="12" width="12" height="12" rx="2" />
      <rect x="44" y="12" width="12" height="12" rx="2" />
      <rect x="8" y="30" width="12" height="12" rx="2" />
      <rect x="26" y="30" width="12" height="12" rx="2" />
      <rect x="8" y="48" width="12" height="12" rx="2" />
    </g>
  </svg>
);

export const DellLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <svg viewBox="0 0 80 40" className={`text-sky-600 fill-current ${className}`} aria-hidden="true">
    {/* Dell circular logo with text inside */}
    <circle cx="40" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="3.5" />
    <path d="M28 13.5h3.5c4 0 6 2 6 6.5s-2 6.5-6 6.5H28v-13zm3.5 10c2.5 0 3.5-1 3.5-3.5s-1-3.5-3.5-3.5H31.5v7h2zM43.5 13.5H51v3h-4.5v2h4v3h-4v2H51v3h-7.5v-13zM54 13.5h3v9.5h4v3h-7v-12.5zM64 13.5h3v9.5h4v3h-7v-12.5z" />
  </svg>
);

export const HpeLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <svg viewBox="0 0 80 30" className={`${className}`} aria-hidden="true">
    {/* HPE Green/Teal Rectangle */}
    <rect x="5" y="5" width="70" height="20" fill="none" stroke="#00B388" strokeWidth="6" />
  </svg>
);

export const PaloAltoLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <svg viewBox="0 0 64 64" className={`${className}`} aria-hidden="true">
    {/* Red/Blue ribbon overlapping nodes */}
    <circle cx="32" cy="18" r="6" fill="#F04E23" />
    <path d="M22 36l10-18 10 18H22z" fill="none" stroke="#F04E23" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="22" cy="36" r="6" fill="#005A9C" />
    <circle cx="42" cy="36" r="6" fill="#005A9C" />
    <line x1="22" y1="36" x2="42" y2="36" stroke="#005A9C" strokeWidth="4" />
  </svg>
);

export const TrendMicroLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <svg viewBox="0 0 64 64" className={`${className}`} aria-hidden="true">
    {/* Red half orbit arc with circular core */}
    <circle cx="32" cy="32" r="10" fill="#EC1C24" />
    <path d="M12 32C12 18 24 8 38 12c-4 1.5-8 5-10 9a16 16 0 004 22c5 .5 11-2.5 14-6-5 8-15 11-24 5z" fill="#EC1C24" />
  </svg>
);

export const VeeamLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <svg viewBox="0 0 64 64" className={`${className}`} aria-hidden="true">
    {/* Green squares partition */}
    <rect x="6" y="6" width="52" height="52" rx="4" fill="#00B359" />
    <rect x="14" y="14" width="16" height="16" fill="#ffffff" />
    <rect x="34" y="14" width="16" height="36" fill="#ffffff" />
    <rect x="14" y="34" width="16" height="16" fill="#ffffff" />
  </svg>
);

export const CiscoCertifiedIcon: React.FC<LogoProps> = ({ className = "h-8 text-sky-600" }) => (
  <svg viewBox="0 0 64 64" className={`fill-current ${className}`} aria-hidden="true">
    <path d="M32 4L10 12v24c0 13 10 21 22 24 12-3 22-11 22-24V12L32 4zm0 6l16 5.8V36c0 10.3-7.5 17-16 19.4C23.5 53 16 46.3 16 36V15.8L32 10z" />
    <path d="M26 34.5l-5-5 2-2 3 3 8-8 2 2z" />
  </svg>
);

export const RedHatLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <svg viewBox="0 0 64 64" className={`${className}`} aria-hidden="true">
    {/* Red hat profile silhouette */}
    <path d="M12 40c4-12 14-16 22-16s14 5 16 12h8c-2-12-14-18-24-18S12 26 8 38c-3 8-5 12-5 12l9-10z" fill="#EE0000" />
    <ellipse cx="32" cy="48" rx="24" ry="6" fill="#EE0000" />
  </svg>
);

export const CrowdstrikeLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <svg viewBox="0 0 64 64" className={`${className}`} aria-hidden="true">
    {/* Red Falcon wing swoop */}
    <path d="M12 50C10 40 18 20 34 10c2 8-5 15-12 22 10-6 18-5 22 4C36 30 22 36 12 50z" fill="#FC0000" />
    <path d="M42 45c-2-2-4-5-4-8 4-2 8-1 10 2-1 3-3 5-6 6z" fill="#FC0000" />
  </svg>
);

export const ArubaLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <svg viewBox="0 0 64 64" className={`${className}`} aria-hidden="true">
    {/* Aruba orange/yellow abstract double chevron */}
    <path d="M12 16h18L44 48H26L12 16z" fill="#FF8200" />
    <path d="M38 16h14L34 48H20L38 16z" fill="#FFC72C" />
  </svg>
);

export const F5Logo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <svg viewBox="0 0 64 64" className={`${className}`} aria-hidden="true">
    {/* F5 Red Circle with "f5" inside */}
    <circle cx="32" cy="32" r="26" fill="#ED1C24" />
    <text x="32" y="38" fill="white" fontSize="20" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">f5</text>
  </svg>
);

export const SolarWindsLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <svg viewBox="0 0 64 64" className={`${className}`} aria-hidden="true">
    {/* SolarWinds Orange Sunburst/Helix */}
    <g fill="#F25F22">
      <circle cx="32" cy="32" r="8" />
      <path d="M32 6c1.5 0 2.5 4 2.5 6s-1 6-2.5 6-2.5-4-2.5-6 1-6 2.5-6z" />
      <path d="M32 44c1.5 0 2.5 4 2.5 6s-1 6-2.5 6-2.5-4-2.5-6 1-6 2.5-6z" />
      <path d="M6 32c0-1.5 4-2.5 6-2.5s6 1 6 2.5-4 2.5-6 2.5-6-1-6-2.5z" />
      <path d="M44 32c0-1.5 4-2.5 6-2.5s6 1 6 2.5-4 2.5-6 2.5-6-1-6-2.5z" />
    </g>
  </svg>
);

export const JuniperLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <svg viewBox="0 0 64 64" className={`${className}`} aria-hidden="true">
    {/* Stylized Juniper blue J */}
    <rect x="14" y="14" width="36" height="36" rx="6" fill="#008470" />
    <path d="M26 22h12v12c0 4.4-3.6 8-8 8s-4-3.6-4-8" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export const TenableLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <svg viewBox="0 0 64 64" className={`${className}`} aria-hidden="true">
    {/* Blue circle target scanner nodes */}
    <circle cx="32" cy="32" r="26" fill="none" stroke="#00529B" strokeWidth="4" />
    <circle cx="32" cy="32" r="14" fill="none" stroke="#00529B" strokeWidth="3" />
    <circle cx="32" cy="32" r="5" fill="#00529B" />
    <rect x="30" y="2" width="4" height="60" fill="#00529B" />
    <rect x="2" y="30" width="60" height="4" fill="#00529B" />
  </svg>
);

export const LenovoLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <svg viewBox="0 0 80 28" className={`${className}`} aria-hidden="true">
    <rect x="2" y="2" width="76" height="24" fill="#E11936" rx="2" />
    <text x="40" y="18" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" letterSpacing="1">LENOVO</text>
  </svg>
);

// Fallback stylized monogram for any other brand
export const StylizedBrandLogo: React.FC<{ name: string; className?: string }> = ({ name, className = "h-8" }) => {
  // Simple hash to get distinct professional color gradients
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  const color1 = `hsl(${hue}, 70%, 45%)`;
  const color2 = `hsl(${(hue + 40) % 360}, 75%, 55%)`;
  
  const initials = name
    .split(/[\s.\-_]+/)
    .filter(Boolean)
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || name.substring(0, 2).toUpperCase();

  return (
    <div 
      style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}
      className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-extrabold text-white text-sm shadow-inner tracking-wide ${className}`}
    >
      {initials}
    </div>
  );
};

// ---------------- CLIENT LOGO SVG DEFINITIONS ----------------

export const TelkomselLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <svg viewBox="0 0 64 64" className={`${className}`} aria-hidden="true">
    {/* Red geometric diamond shape representing Telkomsel */}
    <g fill="#ED1C24">
      <path d="M32 4l20 20-20 20-20-20z" />
      <path d="M32 20l12 12-12 12-12-12z" fill="white" />
      <circle cx="32" cy="32" r="6" fill="#ED1C24" />
    </g>
  </svg>
);

export const ProdiaLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <svg viewBox="0 0 64 64" className={`${className}`} aria-hidden="true">
    {/* Prodia yellow and red circular health target/helix */}
    <circle cx="32" cy="32" r="26" fill="none" stroke="#FCEE21" strokeWidth="5" />
    <circle cx="32" cy="32" r="16" fill="none" stroke="#EE2A24" strokeWidth="4" />
    <circle cx="32" cy="32" r="7" fill="#EE2A24" />
  </svg>
);

export const KominfoLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <svg viewBox="0 0 64 64" className={`${className}`} aria-hidden="true">
    {/* Blue globes structure with gold waves */}
    <circle cx="32" cy="32" r="26" fill="none" stroke="#005A9C" strokeWidth="4" />
    <path d="M12 32h40M32 12v40" stroke="#005A9C" strokeWidth="3" />
    <path d="M32 12c6 4 8 12 8 20s-2 16-8 20c-6-4-8-12-8-20s2-16 8-20z" fill="none" stroke="#FDB913" strokeWidth="3.5" />
  </svg>
);

export const SmartfrenLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <svg viewBox="0 0 64 64" className={`${className}`} aria-hidden="true">
    {/* Bold magenta 'sf' monogram */}
    <rect x="6" y="6" width="52" height="52" rx="14" fill="#E5007D" />
    <text x="32" y="38" fill="white" fontSize="24" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">sf</text>
  </svg>
);

export const BankBengkuluLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <svg viewBox="0 0 64 64" className={`${className}`} aria-hidden="true">
    {/* Blue and green currency ribbon waves */}
    <path d="M10 20c10-8 20 8 30 0s10-8 14 0" fill="none" stroke="#008A4B" strokeWidth="5" strokeLinecap="round" />
    <path d="M10 32c10-8 20 8 30 0s10-8 14 0" fill="none" stroke="#005A9C" strokeWidth="5" strokeLinecap="round" />
    <path d="M10 44c10-8 20 8 30 0s10-8 14 0" fill="none" stroke="#FDB913" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export const HalalLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <svg viewBox="0 0 64 64" className={`${className}`} aria-hidden="true">
    {/* Purple calligraphy-style outline representing Halal Indonesia */}
    <rect x="6" y="6" width="52" height="52" rx="26" fill="#8C3092" />
    <path d="M22 32c0-8 12-10 12-10s8 2 8 10-12 12-12 12" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" />
    <line x1="32" y1="20" x2="32" y2="44" stroke="white" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

// Fallback stylized monogram for any client
export const StylizedClientLogo: React.FC<{ name: string; className?: string }> = ({ name, className = "h-8" }) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  const color1 = `hsl(${hue}, 60%, 40%)`;
  const color2 = `hsl(${(hue + 60) % 360}, 65%, 50%)`;
  
  const initials = name
    .split(/[\s.\-_]+/)
    .filter(Boolean)
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || name.substring(0, 2).toUpperCase();

  return (
    <div 
      style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}
      className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-black text-white text-xs shadow-md border-2 border-white/20 ${className}`}
    >
      {initials}
    </div>
  );
};


// Main brand dispatcher component
export const BrandLogoDispatcher: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const normalized = name.toLowerCase().trim();
  
  if (normalized.includes('cisco')) return <CiscoLogo className={className} />;
  if (normalized.includes('huawei')) return <HuaweiLogo className={className} />;
  if (normalized.includes('fortinet')) return <FortinetLogo className={className} />;
  if (normalized.includes('dell')) return <DellLogo className={className} />;
  if (normalized.includes('hewlett packard') || normalized.includes('hpe')) return <HpeLogo className={className} />;
  if (normalized.includes('palo alto')) return <PaloAltoLogo className={className} />;
  if (normalized.includes('trend micro')) return <TrendMicroLogo className={className} />;
  if (normalized.includes('veeam')) return <VeeamLogo className={className} />;
  if (normalized.includes('red hat')) return <RedHatLogo className={className} />;
  if (normalized.includes('crowdstrike')) return <CrowdstrikeLogo className={className} />;
  if (normalized.includes('aruba')) return <ArubaLogo className={className} />;
  if (normalized.includes('f5 networks') || normalized === 'f5') return <F5Logo className={className} />;
  if (normalized.includes('solarwinds')) return <SolarWindsLogo className={className} />;
  if (normalized.includes('juniper')) return <JuniperLogo className={className} />;
  if (normalized.includes('tenable')) return <TenableLogo className={className} />;
  if (normalized.includes('lenovo')) return <LenovoLogo className={className} />;
  
  return <StylizedBrandLogo name={name} className={className} />;
};

// Main client dispatcher component
export const ClientLogoDispatcher: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const normalized = name.toLowerCase().trim();
  
  if (normalized.includes('telkomsel')) return <TelkomselLogo className={className} />;
  if (normalized.includes('prodia')) return <ProdiaLogo className={className} />;
  if (normalized.includes('kominfo')) return <KominfoLogo className={className} />;
  if (normalized.includes('smartfren')) return <SmartfrenLogo className={className} />;
  if (normalized.includes('bengkulu')) return <BankBengkuluLogo className={className} />;
  if (normalized.includes('halal')) return <HalalLogo className={className} />;
  
  return <StylizedClientLogo name={name} className={className} />;
};
