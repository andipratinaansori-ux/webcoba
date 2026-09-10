import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  SERVICES,
  SOLUTIONS,
  BRANDS,
  CERTIFICATIONS,
  CLIENTS,
  OFFICE_CONTACT,
  BrandItem,
  ClientItem
} from './data/companyData';
import { idPack, enPack, LanguagePack } from './data/translations';
import Logo from './components/Logo';
import RfpConfigurator from './components/RfpConfigurator';
import { BrandLogoDispatcher, ClientLogoDispatcher } from './components/BrandLogos';
import AdminPortal from './components/AdminPortal';
import {
  Award,
  ShieldCheck,
  Lock,
  Cpu,
  HardDrive,
  Database,
  Activity,
  Radio,
  Zap,
  Globe,
  Search,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Check,
  CheckCircle,
  ChevronDown,
  Sparkles,
  Building,
  Clock,
  ExternalLink,
  Send,
  HelpCircle,
  Network,
  Laptop
} from 'lucide-react';

const HERO_SLIDES = [
  {
    badgeId: "SYSTEM INTEGRATOR & SOLUTION PROVIDER",
    badgeEn: "SYSTEM INTEGRATOR & SOLUTION PROVIDER",
    taglineId: "Integrator Sistem & Penyedia Solusi IT Terpercaya",
    taglineEn: "Your Trusted System Integrator & IT Solution Provider",
    subId: "Membangun lingkungan digital yang aman, tangguh, dan dapat diskalakan untuk transformasi enterprise Anda.",
    subEn: "Building secure, resilient, and scalable digital environments to empower your enterprise transformation.",
    bgGradient: "from-slate-950 via-purple-950 to-slate-950",
    featureId: "Arsitektur Jaringan Handal",
    featureEn: "Reliable Network Architecture",
    tag: "Networking",
    illustrationUrl: null
  },
  {
    badgeId: "CYBER SECURITY DEFENSE",
    badgeEn: "CYBER SECURITY DEFENSE",
    taglineId: "Keamanan Cyber Tingkat Tinggi Tanpa Kompromi",
    taglineEn: "Next-Gen Cyber Security Defense Without Compromise",
    subId: "Lindungi data sensitif dan infrastruktur digital Anda dari ancaman modern dengan solusi firewall, deteksi intrusi, dan enkripsi bersertifikasi global.",
    subEn: "Protect your sensitive data and digital infrastructure from modern threats with globally certified firewall, intrusion detection, and encryption solutions.",
    bgGradient: "from-slate-950 via-slate-900 to-purple-950",
    featureId: "Perlindungan Ancaman Proaktif",
    featureEn: "Proactive Threat Defense",
    tag: "Security",
    illustrationUrl: null
  },
  {
    badgeId: "CLOUD & ENTERPRISE DATACENTER",
    badgeEn: "CLOUD & ENTERPRISE DATACENTER",
    taglineId: "Modernisasi Infrastruktur & Virtualisasi Pusat Data",
    taglineEn: "Infrastructure Modernization & Datacenter Virtualization",
    subId: "Tingkatkan efisiensi komputasi dengan server handal, storage berkinerja tinggi, dan virtualisasi tangguh dari pemimpin teknologi dunia.",
    subEn: "Scale your compute efficiency with highly resilient servers, high-performance storage, and virtualization from global tech leaders.",
    bgGradient: "from-purple-950 via-indigo-950 to-slate-950",
    featureId: "Skalabilitas Komputasi Awan",
    featureEn: "Cloud Compute Scalability",
    tag: "Virtualization",
    illustrationUrl: null
  },
  {
    badgeId: "24/7 PROFESSIONAL MANAGED SERVICES",
    badgeEn: "24/7 PROFESSIONAL MANAGED SERVICES",
    taglineId: "Dukungan Teknis Proaktif Jaminan Layanan SLA Tinggi",
    taglineEn: "24/7 Proactive Managed Services & High SLA Support",
    subId: "Tim teknisi bersertifikat kami siap mengawasi, memelihara, dan mengoptimalkan performa operasional IT Anda sepanjang waktu tanpa jeda.",
    subEn: "Our certified engineering squad is fully dedicated to monitor, maintain, and optimize your IT infrastructure around the clock with zero downtime.",
    bgGradient: "from-slate-950 via-slate-900 to-indigo-950",
    featureId: "Dukungan Teknis 24 Jam",
    featureEn: "24/7 On-Demand Tech Support",
    tag: "Support",
    illustrationUrl: null
  }
];

export default function App() {
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const t: LanguagePack = lang === 'id' ? idPack : enPack;

  // Dynamic state fetched from MySQL database
  const [dynamicSlides, setDynamicSlides] = useState<any[]>([]);
  const [dynamicBrands, setDynamicBrands] = useState<any[]>([]);
  const [dynamicClients, setDynamicClients] = useState<any[]>([]);
  const [dynamicCerts, setDynamicCerts] = useState<any[]>([]);
  const [dynamicBranding, setDynamicBranding] = useState<any>(null);
  const [showAdminPortal, setShowAdminPortal] = useState(false);

  const slidesToUse = dynamicSlides.length > 0 ? dynamicSlides : HERO_SLIDES;
  const brandsToUse = dynamicBrands.length > 0 ? dynamicBrands : BRANDS;
  const clientsToUse = dynamicClients.length > 0 ? dynamicClients : CLIENTS;
  const certsToUse = dynamicCerts.length > 0 ? dynamicCerts : CERTIFICATIONS;

  // Hero slideshow slide controller
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (slidesToUse.length === 0) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slidesToUse.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slidesToUse.length]);

  // Handle secret gateway param or hash to open admin panel (?admin=true or #admin)
  useEffect(() => {
    if (window.location.search === '?admin=true' || window.location.hash === '#admin') {
      setShowAdminPortal(true);
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const loadDynamicData = async () => {
    try {
      const [slidesRes, brandsRes, clientsRes, certsRes, brandingRes] = await Promise.all([
        fetch('/api/hero-slides'),
        fetch('/api/brands'),
        fetch('/api/clients'),
        fetch('/api/certifications'),
        fetch('/api/branding-settings')
      ]);
      if (slidesRes.ok) setDynamicSlides(await slidesRes.json());
      if (brandsRes.ok) setDynamicBrands(await brandsRes.json());
      if (clientsRes.ok) setDynamicClients(await clientsRes.json());
      if (certsRes.ok) setDynamicCerts(await certsRes.json());
      if (brandingRes.ok) setDynamicBranding(await brandingRes.json());
    } catch (err) {
      console.warn("Using local fallback datasets as MySQL endpoints are offline.", err);
    }
  };

  useEffect(() => {
    loadDynamicData();
  }, []);

  // Active section track
  const [activeTab, setActiveTab] = useState('Home');

  // Mobile menu control
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Brand state controls
  const [brandSearch, setBrandSearch] = useState('');
  const [selectedBrandCat, setSelectedBrandCat] = useState<'All' | 'Security' | 'Network' | 'Cloud & Datacenter' | 'Software & IT Ops'>('All');

  // Client state controls
  const [selectedClientCat, setSelectedClientCat] = useState<'All' | 'Telecommunications' | 'Finance & Insurance' | 'Government & Public' | 'Enterprise & Professional'>('All');

  // Contact form submission state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    solutionOfInterest: 'Network, Wireless, Security'
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    setTimeout(() => {
      setContactSubmitting(false);
      setContactSubmitted(true);
      setTimeout(() => {
        setContactSubmitted(false);
        setContactForm({ name: '', email: '', phone: '', message: '', solutionOfInterest: 'Network, Wireless, Security' });
      }, 5000);
    }, 1200);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  // Filter technology brands
  const filteredBrands = brandsToUse.filter((brand: any) => {
    const matchSearch = brand.name.toLowerCase().includes(brandSearch.toLowerCase()) || 
                        (brand.description && brand.description.toLowerCase().includes(brandSearch.toLowerCase()));
    const matchCat = selectedBrandCat === 'All' || brand.category === selectedBrandCat;
    return matchSearch && matchCat;
  });

  // Filter client list
  const filteredClients = clientsToUse.filter((client: any) => {
    return selectedClientCat === 'All' || client.category === selectedClientCat;
  });

  // Smooth scroll helper
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  // Icon selector helper
  const getCertIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Award': return <Award className="w-6 h-6 text-purple-600" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-purple-600" />;
      case 'Lock': return <Lock className="w-6 h-6 text-purple-600" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-purple-600" />;
      case 'HardDrive': return <HardDrive className="w-6 h-6 text-purple-600" />;
      case 'Database': return <Database className="w-6 h-6 text-purple-600" />;
      case 'Activity': return <Activity className="w-6 h-6 text-purple-600" />;
      case 'Radio': return <Radio className="w-6 h-6 text-purple-600" />;
      case 'Zap': return <Zap className="w-6 h-6 text-purple-600" />;
      default: return <Award className="w-6 h-6 text-purple-600" />;
    }
  };

  const getSolutionIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Network': return <Network className={className} />;
      case 'Server': return <HardDrive className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Video': return <Radio className={className} />;
      case 'Laptop': return <Laptop className={className} />;
      default: return <Network className={className} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-purple-500 selection:text-white">
      {/* ------------------- STICKY HEADER / NAVIGATION ------------------- */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and brand name */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              {dynamicBranding?.logoUrl ? (
                <img src={dynamicBranding.logoUrl} alt="Logo" className="h-10 object-contain shrink-0" />
              ) : (
                <Logo size={42} className="shrink-0" />
              )}
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-950 via-purple-800 to-purple-600">
                  {dynamicBranding?.companyName || "PT. Qualita Global Teknologi"}
                </span>
                <span className="font-mono text-[10px] tracking-widest text-purple-600 uppercase font-bold">
                  qualitatech.id
                </span>
              </div>
            </div>

            {/* Desktop Nav menu items */}
            <nav className="hidden lg:flex items-center gap-1">
              <button onClick={() => scrollTo('overview')} className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-purple-700 hover:bg-slate-50 transition-all cursor-pointer">
                {t.navOverview}
              </button>
              <button onClick={() => scrollTo('services')} className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-purple-700 hover:bg-slate-50 transition-all cursor-pointer">
                {t.navServices}
              </button>
              <button onClick={() => scrollTo('solutions')} className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-purple-700 hover:bg-slate-50 transition-all cursor-pointer">
                {t.navSolutions}
              </button>
              <button onClick={() => scrollTo('technology')} className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-purple-700 hover:bg-slate-50 transition-all cursor-pointer">
                {t.navTech}
              </button>
              <button onClick={() => scrollTo('team')} className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-purple-700 hover:bg-slate-50 transition-all cursor-pointer">
                {t.navTeam}
              </button>
              <button onClick={() => scrollTo('clients')} className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-purple-700 hover:bg-slate-50 transition-all cursor-pointer">
                {t.navClients}
              </button>
              <button onClick={() => scrollTo('contact')} className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-purple-700 hover:bg-slate-50 transition-all cursor-pointer mr-2">
                {t.navContact}
              </button>

              {/* Language Switcher Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60 mr-3">
                <button
                  onClick={() => setLang('id')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    lang === 'id' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-800'
                  }`}
                >
                  ID
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    lang === 'en' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-800'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Action Button */}
              <button
                onClick={() => scrollTo('rfp-builder')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4.5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
              >
                <Sparkles size={14} /> RFP Configurator
              </button>
            </nav>

            {/* Mobile Menu & Language Toggles */}
            <div className="flex lg:hidden items-center gap-2">
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setLang('id')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    lang === 'id' ? 'bg-purple-600 text-white' : 'text-slate-600'
                  }`}
                >
                  ID
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    lang === 'en' ? 'bg-purple-600 text-white' : 'text-slate-600'
                  }`}
                >
                  EN
                </button>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-slate-200/60 bg-white"
            >
              <div className="px-4 py-4 space-y-2 flex flex-col">
                <button onClick={() => scrollTo('overview')} className="text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-purple-700 transition-all">
                  {t.navOverview}
                </button>
                <button onClick={() => scrollTo('services')} className="text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-purple-700 transition-all">
                  {t.navServices}
                </button>
                <button onClick={() => scrollTo('solutions')} className="text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-purple-700 transition-all">
                  {t.navSolutions}
                </button>
                <button onClick={() => scrollTo('technology')} className="text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-purple-700 transition-all">
                  {t.navTech}
                </button>
                <button onClick={() => scrollTo('team')} className="text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-purple-700 transition-all">
                  {t.navTeam}
                </button>
                <button onClick={() => scrollTo('clients')} className="text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-purple-700 transition-all">
                  {t.navClients}
                </button>
                <button onClick={() => scrollTo('contact')} className="text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-purple-700 transition-all">
                  {t.navContact}
                </button>
                <div className="pt-2">
                  <button
                    onClick={() => scrollTo('rfp-builder')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Sparkles size={16} /> Solution Configurator
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ------------------- HERO BANNER SLIDESHOW SECTION ------------------- */}
      <section 
        className={`relative bg-gradient-to-br ${slidesToUse[activeSlide]?.bgGradient || 'from-slate-950 via-purple-950 to-slate-950'} text-white overflow-hidden py-16 lg:py-24 border-b border-slate-900 min-h-[580px] lg:min-h-[640px] flex flex-col justify-between transition-all duration-700`}
        style={slidesToUse[activeSlide]?.bgImageUrl ? { backgroundImage: `url(${slidesToUse[activeSlide].bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {/* Dark overlay for readability when a custom background image is uploaded */}
        {slidesToUse[activeSlide]?.bgImageUrl && (
          <div className="absolute inset-0 bg-slate-950/70 z-0 pointer-events-none" />
        )}

        {/* Ambient abstract geometry vector decorations */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Elegant network lines connecting circles */}
            <line x1="10%" y1="20%" x2="40%" y2="50%" stroke="white" strokeWidth="1" />
            <line x1="40%" y1="50%" x2="80%" y2="20%" stroke="white" strokeWidth="1" />
            <line x1="40%" y1="50%" x2="60%" y2="80%" stroke="white" strokeWidth="1" />
            <circle cx="10%" cy="20%" r="6" fill="#c084fc" />
            <circle cx="40%" cy="50%" r="10" fill="#a855f7" />
            <circle cx="80%" cy="20%" r="8" fill="#d8b4fe" />
            <circle cx="60%" cy="80%" r="5" fill="#8b5cf6" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex-grow flex items-center">
          <div className="relative w-full overflow-hidden min-h-[460px] lg:min-h-[440px]">
            <AnimatePresence mode="wait">
              {slidesToUse.map((slide, index) => {
                if (index !== activeSlide) return null;
                return (
                  <motion.div
                    key={slide.id || slide.tag || index}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="grid lg:grid-cols-12 gap-12 items-center w-full"
                  >
                    {/* Left Content Column */}
                    <div className="lg:col-span-7 text-left space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-sm"
                      >
                        <Sparkles size={14} className="animate-pulse text-purple-400" />
                        {slide.badgeId}
                      </motion.div>

                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.4 }}
                        className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white"
                      >
                        <span className="block min-h-[90px] sm:min-h-[120px] lg:min-h-[140px] bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-purple-300">
                          {lang === 'id' ? slide.taglineId : slide.taglineEn}
                        </span>
                      </motion.h1>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="text-purple-100/85 text-base sm:text-lg lg:text-xl max-w-2xl font-light leading-relaxed min-h-[60px]"
                      >
                        {lang === 'id' ? slide.subId : slide.subEn}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                        className="flex flex-wrap gap-4 pt-2"
                      >
                        <button
                          onClick={() => scrollTo('rfp-builder')}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-7 py-3.5 rounded-2xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all flex items-center gap-2 text-sm cursor-pointer hover:scale-[1.02]"
                        >
                          {lang === 'id' ? 'Konfigurasi Solusi' : 'Configure Solution'} <ArrowRight size={16} />
                        </button>
                        <button
                          onClick={() => scrollTo('solutions')}
                          className="border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-semibold px-7 py-3.5 rounded-2xl transition-all text-sm cursor-pointer"
                        >
                          {lang === 'id' ? 'Pelajari Solusi' : 'Explore Portfolio'}
                        </button>
                        <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-white/10 text-purple-300 text-xs font-mono">
                          <CheckCircle size={14} className="text-purple-400" />
                          <span>{lang === 'id' ? slide.featureId : slide.featureEn}</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Right Interactive Card Column - QG Logo Concept Frame */}
                    <div className="lg:col-span-5 flex justify-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.25, duration: 0.4 }}
                        className="relative w-full max-w-sm aspect-square bg-gradient-to-tr from-purple-950/40 to-purple-500/5 rounded-3xl border border-white/10 p-8 flex items-center justify-center shadow-2xl backdrop-blur-sm group"
                      >
                        {/* Visual Glow Core */}
                        <div className="absolute w-48 h-48 rounded-full bg-purple-600/20 blur-3xl group-hover:bg-purple-600/30 transition-all duration-700" />
                        {slide.illustrationUrl ? (
                          <img 
                            src={slide.illustrationUrl} 
                            alt={lang === 'id' ? slide.taglineId : slide.taglineEn}
                            referrerPolicy="no-referrer"
                            className="relative z-10 w-[240px] h-[240px] object-contain transition-transform duration-500 hover:scale-105"
                          />
                        ) : (
                          <Logo size={240} className="relative z-10 transition-transform duration-500 hover:scale-105" />
                        )}
                        <div className="absolute bottom-6 left-6 right-6 text-center bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 p-3">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-purple-300 font-bold">
                            PT. Qualita Global Teknologi
                          </span>
                          <span className="block font-display text-xs font-semibold text-white mt-0.5">
                            {slide.tag} Enterprise Solution
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Manual navigation indicators */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-6 z-10 flex justify-between items-center">
          <div className="flex gap-2">
            {slidesToUse.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeSlide ? 'bg-purple-500 w-8' : 'bg-white/30 hover:bg-white/50 w-2'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <div className="text-white/40 text-[11px] font-mono select-none">
            0{activeSlide + 1} / 0{slidesToUse.length}
          </div>
        </div>
      </section>

      {/* ------------------- QUICK METRICS STATS BAR ------------------- */}
      <section className="bg-slate-950 py-10 border-b border-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center lg:text-left divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            <div className="pt-4 lg:pt-0 lg:px-6">
              <span className="block font-display text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white">
                30+
              </span>
              <span className="text-xs text-slate-400 mt-1 block font-medium uppercase tracking-wider">
                {t.statPartners}
              </span>
            </div>
            <div className="pt-4 lg:pt-0 lg:px-6">
              <span className="block font-display text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white">
                50+
              </span>
              <span className="text-xs text-slate-400 mt-1 block font-medium uppercase tracking-wider">
                {t.statEngineers}
              </span>
            </div>
            <div className="pt-4 lg:pt-0 lg:px-6">
              <span className="block font-display text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white">
                100+
              </span>
              <span className="text-xs text-slate-400 mt-1 block font-medium uppercase tracking-wider">
                {t.statProjects}
              </span>
            </div>
            <div className="pt-4 lg:pt-0 lg:px-6">
              <span className="block font-display text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white">
                24/7
              </span>
              <span className="text-xs text-slate-400 mt-1 block font-medium uppercase tracking-wider">
                {t.statSla}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------- INFINITE AUTO-SCROLL PARTNERS MARQUEE ------------------- */}
      <section className="bg-white py-8 overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <p className="text-center font-display font-bold text-[10px] uppercase tracking-widest text-slate-400">
            {lang === 'id' ? 'DIREKOMENDASIKAN OLEH PEMIMPIN INDUSTRI GLOBAL' : 'RECOGNIZED BY INDUSTRIAL TECH LEADERS'}
          </p>
        </div>
        <div className="relative flex overflow-x-hidden">
          <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
            {/* Duplicated list for infinite seamless carousel scroll */}
            {[...brandsToUse, ...brandsToUse].map((brand, idx) => (
              <div key={`${brand.name}-marquee-${idx}`} className="flex items-center gap-2 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300 px-6 cursor-pointer">
                {brand.imageUrl ? (
                  <img src={brand.imageUrl} alt={brand.name} className="h-8 max-w-[120px] object-contain" />
                ) : (
                  <BrandLogoDispatcher name={brand.name} className="h-8 max-w-[120px] object-contain" />
                )}
                <span className="font-display font-extrabold text-slate-500 text-xs hidden sm:inline">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------- OVERVIEW SECTION (ABOUT) ------------------- */}
      <section className="py-20 bg-white" id="overview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Brand Imagery/Concept Box */}
            <div className="space-y-6">
              <div className="p-10 rounded-3xl bg-white border border-slate-200/80 flex flex-col justify-between aspect-video relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/5 rounded-full blur-2xl" />
                <div className="flex justify-between items-center">
                  <Logo size={48} />
                  <span className="font-mono text-[10px] text-purple-700 bg-slate-100 border border-slate-200/60 px-3 py-1 rounded-full font-bold uppercase">
                    Partner Integrity
                  </span>
                </div>
                <div className="mt-8">
                  <h4 className="font-display font-bold text-xl text-slate-900">PT. Qualita Global Teknologi</h4>
                  <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">domain: qualitatech.id</p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-4 italic border-l-2 border-purple-500 pl-3">
                  "{lang === 'id' 
                    ? 'Menghadirkan integrasi tanpa batas untuk ekosistem cyber, jaringan, dan pusat data Anda.' 
                    : 'Delivering seamless integration for your cyber, network, and data center ecosystem.'}"
                </p>
              </div>

              {/* Core focus bento pill */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-slate-200 bg-white text-left shadow-sm hover:shadow-md transition-shadow">
                  <span className="font-display font-extrabold text-purple-700 text-lg">System Integrator</span>
                  <p className="text-xs text-slate-500 mt-1">{lang === 'id' ? 'Pengadaan terintegrasi perangkat keras & lunak.' : 'Integrated software & hardware procurement.'}</p>
                </div>
                <div className="p-5 rounded-2xl border border-slate-200 bg-white text-left shadow-sm hover:shadow-md transition-shadow">
                  <span className="font-display font-extrabold text-purple-700 text-lg">Solution Provider</span>
                  <p className="text-xs text-slate-500 mt-1">{lang === 'id' ? 'Arsitektur cyber-defense, cloud & data-center.' : 'Cyber-defense, cloud, & data-center architecture.'}</p>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="space-y-6 text-left">
              <span className="text-xs font-bold text-purple-700 tracking-widest uppercase bg-purple-50 border border-purple-100/50 px-3 py-1 rounded-full">
                {t.overviewTitle}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                {t.overviewHeading}
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                {t.overviewText}
              </p>

              {/* Service categories quick check */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { title: "Professional Services", color: "bg-emerald-100 text-emerald-800" },
                  { title: "Manage Services", color: "bg-purple-100 text-purple-800" },
                  { title: "Maintenance Services", color: "bg-blue-100 text-blue-800" },
                  { title: "Vulnerability Assessment", color: "bg-amber-100 text-amber-800" }
                ].map(item => (
                  <div key={item.title} className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/60 bg-white shadow-sm">
                    <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center shrink-0">
                      <Check size={12} className="text-white stroke-[3]" />
                    </div>
                    <span className="font-semibold text-xs text-slate-700">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------- OUR SERVICES SECTION (PDF) ------------------- */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold text-purple-700 tracking-widest uppercase bg-purple-50 border border-purple-100/50 px-3 py-1 rounded-full">
              {lang === 'id' ? 'LAYANAN UTAMA KAMI' : 'OUR EXPERT SERVICES'}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
              {t.servicesTitle}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t.servicesSub}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, index) => (
              <motion.div
                key={service.title}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-slate-100 text-purple-700 border border-slate-200/50 rounded-xl flex items-center justify-center mb-6 font-display font-extrabold text-lg">
                    0{index + 1}
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2">
                  {service.items.map(item => (
                    <div key={item} className="flex items-start gap-2">
                      <Check size={14} className="text-purple-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 font-medium leading-normal">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------- OUR SOLUTIONS SECTION (PDF) ------------------- */}
      <section className="py-20 bg-white" id="solutions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold text-purple-700 tracking-widest uppercase bg-purple-50 border border-purple-100/50 px-3 py-1 rounded-full">
              {lang === 'id' ? 'PORTFOLIO SOLUSI IT' : 'IT ARCHITECTURAL PORTFOLIO'}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
              {t.solutionsTitle}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t.solutionsSub}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SOLUTIONS.map(sol => (
              <motion.div
                key={sol.id}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 text-left flex flex-col justify-between group hover:border-purple-300 hover:shadow-md shadow-sm"
              >
                <div>
                  <div className="w-14 h-14 bg-slate-100 text-purple-700 border border-slate-200/60 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    {getSolutionIcon(sol.iconName, "w-6 h-6")}
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-900 mb-3">
                    {sol.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {sol.description}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl border border-slate-200/50 p-4 space-y-2">
                  {sol.items.map(item => (
                    <div key={item} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full shrink-0 mt-1.5" />
                      <span className="text-xs text-slate-700 font-semibold leading-normal">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------- TECHNOLOGY ECOSYSTEM (PDF) ------------------- */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/80" id="technology">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-bold text-purple-700 tracking-widest uppercase bg-purple-50 border border-purple-100/50 px-3 py-1 rounded-full">
              {lang === 'id' ? 'MITRA TEKNOLOGI KAMI' : 'OUR TECHNOLOGY ECOSYSTEM'}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
              {t.techTitle}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t.techSub}
            </p>
          </div>

          {/* Interactive filter and search panel */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 mb-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Filter tabs */}
              <div className="flex flex-wrap gap-1.5 w-full md:w-auto justify-center md:justify-start">
                {['All', 'Security', 'Network', 'Cloud & Datacenter', 'Software & IT Ops'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedBrandCat(cat as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedBrandCat === cat
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'All' ? t.techAll : cat}
                  </button>
                ))}
              </div>

              {/* Keyword Search Input */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  placeholder={t.techSearchPlaceholder}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:bg-white focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all outline-none"
                />
                {brandSearch && (
                  <button onClick={() => setBrandSearch('')} className="absolute right-3 top-2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 text-xs">
                    <X size={10} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Brands grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredBrands.map(brand => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={brand.id || brand.name}
                  className="bg-white hover:bg-purple-50/10 border border-slate-200/80 hover:border-purple-300 rounded-2xl p-5 flex flex-col justify-between items-center text-center min-h-[140px] transition-all cursor-help group relative shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-center h-12 w-full mb-2">
                    {brand.imageUrl ? (
                      <img src={brand.imageUrl} alt={brand.name} className="max-h-10 max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <BrandLogoDispatcher name={brand.name} className="max-h-10 max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className="block font-display font-bold text-xs text-slate-800 group-hover:text-purple-700 transition-colors">
                      {brand.name}
                    </span>
                    <span className="inline-block bg-slate-100 text-slate-600 text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider scale-95">
                      {brand.category}
                    </span>
                  </div>

                  {/* Tooltip detail description on hover */}
                  {brand.description && (
                    <div className="absolute inset-0 bg-slate-950 rounded-2xl p-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-center text-[11px] text-white select-none z-10">
                      {brand.description}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredBrands.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                No technology brands matched your filter keyword.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ------------------- OUR CERTIFIED TEAM SECTION (PDF) ------------------- */}
      <section className="py-20 bg-white" id="team">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold text-purple-700 tracking-widest uppercase bg-purple-50 border border-purple-100/50 px-3 py-1 rounded-full">
              {lang === 'id' ? 'TIM AHLI & LISENSI' : 'EXPERT TEAM & COMPLIANCE'}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
              {t.teamTitle}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t.teamSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {certsToUse.map(cert => (
              <div
                key={cert.id || cert.name}
                className="bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl p-5 text-left flex items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl shrink-0 flex items-center justify-center w-12 h-12">
                  {cert.imageUrl ? (
                    <img src={cert.imageUrl} alt={cert.name} className="w-8 h-8 object-contain" />
                  ) : (
                    getCertIcon(cert.iconName)
                  )}
                </div>
                <div>
                  <span className="block font-display font-extrabold text-slate-900 text-sm">
                    {cert.name}
                  </span>
                  <span className="block text-xs text-purple-700 font-bold mt-0.5">
                    {cert.issuer}
                  </span>
                  {cert.description && (
                    <span className="block text-[11px] text-slate-500 mt-2 leading-relaxed">
                      {cert.description}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------- CLIENTS SECTION (PDF) ------------------- */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80" id="clients">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-bold text-purple-700 tracking-widest uppercase bg-purple-50 border border-purple-100/50 px-3 py-1 rounded-full">
              {lang === 'id' ? 'KLIEN KAMI' : 'OUR CORPORATE CLIENTS'}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
              {t.clientsTitle}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t.clientsSub}
            </p>
          </div>

          {/* Client sector tabs filter */}
          <div className="flex flex-wrap gap-1.5 justify-center mb-8 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm max-w-2xl mx-auto">
            {['All', 'Telecommunications', 'Finance & Insurance', 'Government & Public', 'Enterprise & Professional'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedClientCat(cat as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedClientCat === cat
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat === 'All' ? t.techAll : cat}
              </button>
            ))}
          </div>

          {/* Clients bento-grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredClients.map(client => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={client.id || client.name}
                  className="bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl p-5 flex flex-col justify-between items-center text-center min-h-[140px] shadow-sm hover:shadow-md relative overflow-hidden group transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                  <div className="flex items-center justify-center h-12 w-full mb-2">
                    {client.imageUrl ? (
                      <img src={client.imageUrl} alt={client.name} className="max-h-10 max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <ClientLogoDispatcher name={client.name} className="max-h-10 max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                    )}
                  </div>
                  <div className="space-y-1 w-full">
                    <span className="block font-display font-bold text-xs text-slate-800 group-hover:text-purple-700 transition-colors line-clamp-2">
                      {client.name}
                    </span>
                    <span className="block text-[8px] font-bold text-slate-400 tracking-wider uppercase truncate">
                      {client.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ------------------- INTERACTIVE SOLUTION BUILDER (RFP) ------------------- */}
      <section className="py-20 bg-white" id="solutions-configurator">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-bold text-purple-700 tracking-widest uppercase bg-purple-50 border border-purple-100/50 px-3 py-1 rounded-full">
              {lang === 'id' ? 'KONFIGURATOR BIDDING' : 'RFP SPECIFICATION DESIGNER'}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
              {lang === 'id' ? 'Rancang Solusi IT Anda Secara Mandiri' : 'Design Your Custom IT Solutions Instantly'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {lang === 'id' 
                ? 'Gunakan asisten configurator interaktif di bawah untuk memilih layanan, memetakan jaringan, dan memilih teknologi mitra Anda.' 
                : 'Utilize the interactive wizard below to map your networking requirements and generate a pristine tech draft.'}
            </p>
          </div>

          <RfpConfigurator />
        </div>
      </section>

      {/* ------------------- OFFICE & CONTACT INFO (PDF) ------------------- */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Office Contacts Card */}
            <div className="lg:col-span-5 space-y-8 text-left">
              <div className="space-y-4">
                <span className="text-xs font-bold text-purple-700 tracking-widest uppercase bg-purple-50 border border-purple-100/50 px-3 py-1 rounded-full">
                  {t.navContact}
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
                  {t.contactTitle}
                </h2>
                <p className="text-slate-600 text-sm">
                  {t.contactSub}
                </p>
              </div>

              {/* Detail Address block */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 text-purple-700 border border-slate-200/50 rounded-xl flex items-center justify-center shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-xs text-slate-400 uppercase tracking-wide">
                      {t.officeLabel}
                    </span>
                    <span className="block font-display font-bold text-slate-900 mt-1">
                      {OFFICE_CONTACT.name}
                    </span>
                    <span className="block text-xs text-slate-600 mt-2 leading-relaxed">
                      {OFFICE_CONTACT.building}, {OFFICE_CONTACT.street}, {OFFICE_CONTACT.city}, {OFFICE_CONTACT.province} {OFFICE_CONTACT.postalCode}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4 border-t border-slate-100 pt-6">
                  <div className="w-10 h-10 bg-slate-100 text-purple-700 border border-slate-200/50 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-xs text-slate-400 uppercase tracking-wide">
                      {t.telpLabel}
                    </span>
                    <a href={`tel:${OFFICE_CONTACT.phone}`} className="block font-display font-bold text-slate-900 hover:text-purple-700 mt-1 transition-colors">
                      {OFFICE_CONTACT.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 border-t border-slate-100 pt-6">
                  <div className="w-10 h-10 bg-slate-100 text-purple-700 border border-slate-200/50 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-xs text-slate-400 uppercase tracking-wide">
                      {t.emailLabel}
                    </span>
                    <a href={`mailto:${OFFICE_CONTACT.email}`} className="block font-display font-bold text-slate-900 hover:text-purple-700 mt-1 transition-colors">
                      {OFFICE_CONTACT.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 border-t border-slate-100 pt-6">
                  <div className="w-10 h-10 bg-slate-100 text-purple-700 border border-slate-200/50 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-xs text-slate-400 uppercase tracking-wide">
                      {t.officeHours}
                    </span>
                    <span className="block font-semibold text-xs text-slate-700 mt-1">
                      {t.officeHoursDetail}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Active Map & Custom Message form */}
            <div className="lg:col-span-7 space-y-6">
              {/* Custom consultation form */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-display font-extrabold text-xl text-slate-900 mb-6 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-purple-600" /> {lang === 'id' ? 'Kirim Pesan Konsultasi' : 'Send Consultation Inquiry'}
                </h4>

                {contactSubmitted ? (
                  <div className="p-6 bg-slate-50 text-slate-800 rounded-2xl border border-slate-200/60 text-center">
                    <CheckCircle className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                    <span className="block text-sm font-semibold">{t.contactFormSuccess}</span>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">{t.contactFormName} *</label>
                        <input
                          type="text"
                          name="name"
                          value={contactForm.name}
                          onChange={handleContactChange}
                          required
                          className="w-full border border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:bg-white outline-none transition-all"
                          placeholder="Your Name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">{t.contactFormEmail} *</label>
                        <input
                          type="email"
                          name="email"
                          value={contactForm.email}
                          onChange={handleContactChange}
                          required
                          className="w-full border border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:bg-white outline-none transition-all"
                          placeholder="name@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">{t.contactFormPhone} *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={contactForm.phone}
                          onChange={handleContactChange}
                          required
                          className="w-full border border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:bg-white outline-none transition-all"
                          placeholder="(021) XXX-XXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">{lang === 'id' ? 'Kebutuhan Solusi' : 'Solution Area'}</label>
                        <select
                          name="solutionOfInterest"
                          value={contactForm.solutionOfInterest}
                          onChange={handleContactChange}
                          className="w-full border border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:bg-white outline-none transition-all cursor-pointer"
                        >
                          {SOLUTIONS.map(sol => (
                            <option key={sol.id} value={sol.title}>{sol.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">{t.contactFormMsg} *</label>
                      <textarea
                        name="message"
                        value={contactForm.message}
                        onChange={handleContactChange}
                        required
                        rows={3}
                        className="w-full border border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:bg-white outline-none transition-all resize-none"
                        placeholder="Describe your IT infrastructure requirements or security concerns..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={contactSubmitting}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm ml-auto cursor-pointer"
                    >
                      {contactSubmitting ? 'Sending...' : t.contactFormBtn} <Send size={14} />
                    </button>
                  </form>
                )}
              </div>

              {/* Google Map Container */}
              <div className="rounded-3xl border border-slate-200/80 overflow-hidden h-72 shadow-sm relative group">
                <iframe
                  title="Cibis Nine Office Location"
                  src={OFFICE_CONTACT.mapIframeUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5 backdrop-blur-sm">
                  <MapPin size={10} className="text-purple-400" /> Cibis Nine, Lt. 11
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------- FOOTER ------------------- */}
      <footer className="bg-slate-900 text-slate-200 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5 text-left space-y-4">
              <div className="flex items-center gap-3">
                {dynamicBranding?.logoUrl ? (
                  <img src={dynamicBranding.logoUrl} alt="Logo" className="h-10 object-contain shrink-0" />
                ) : (
                  <Logo size={42} />
                )}
                <div className="flex flex-col">
                  <span className="font-display font-bold text-md leading-tight text-white">
                    {dynamicBranding?.companyName || "PT. Qualita Global Teknologi"}
                  </span>
                  <span className="font-mono text-[9px] tracking-widest text-purple-400 uppercase font-semibold">
                    qualitatech.id
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                We are a SISTEM INTEGRATOR and SOLUTION PROVIDER focusing on providing premium IT products, services, and security frameworks to enterprises.
              </p>
            </div>

            <div className="md:col-span-4 text-left space-y-3">
              <span className="block font-display font-extrabold text-sm text-slate-300 uppercase tracking-widest">
                Our Headquarters
              </span>
              <span className="block text-xs text-slate-400 leading-relaxed">
                {OFFICE_CONTACT.building}, {OFFICE_CONTACT.street}, {OFFICE_CONTACT.city}, {OFFICE_CONTACT.province} {OFFICE_CONTACT.postalCode}
              </span>
            </div>

            <div className="md:col-span-3 text-left space-y-3">
              <span className="block font-display font-extrabold text-sm text-slate-300 uppercase tracking-widest">
                Direct Contact
              </span>
              <span className="block text-xs text-slate-400">
                <strong>Telp:</strong> {OFFICE_CONTACT.phone}
              </span>
              <span className="block text-xs text-slate-400">
                <strong>Email:</strong> {OFFICE_CONTACT.email}
              </span>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <span>
              &copy; {new Date().getFullYear()} {t.allRightsReserved}
              {/* Ultra-subtle administrator gateway button, hidden from public eyes */}
              <button 
                onClick={() => setShowAdminPortal(true)} 
                className="ml-2 text-[8px] text-slate-800 hover:text-slate-600 transition-colors cursor-pointer opacity-20"
                title="System settings"
              >
                &bull;
              </button>
            </span>
            <div className="flex gap-4">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-slate-300 transition-colors cursor-pointer font-medium">
                Back to Top
              </button>
            </div>
          </div>
        </div>
      </footer>

      {showAdminPortal && (
        <AdminPortal 
          onClose={() => { setShowAdminPortal(false); loadDynamicData(); }} 
          lang={lang} 
        />
      )}
    </div>
  );
}
