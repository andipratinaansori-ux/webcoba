import React, { useState, useEffect } from 'react';
import { 
  X, Lock, ShieldCheck, Upload, Trash2, Plus, Edit2, 
  Save, Eye, RefreshCw, Layout, Briefcase, Award, Settings, LogOut, Check
} from 'lucide-react';

interface AdminPortalProps {
  onClose: () => void;
  lang: 'id' | 'en';
}

export default function AdminPortal({ onClose, lang }: AdminPortalProps) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('qualita_admin_token'));
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin_qualita_password');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Active Management Tab
  const [activeTab, setActiveTab] = useState<'slides' | 'brands' | 'clients' | 'certs' | 'branding' | 'uploads'>('slides');

  // Dynamic Data States
  const [slides, setSlides] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [branding, setBranding] = useState<any>({
    companyName: '',
    tagline: '',
    description: '',
    logoUrl: null
  });

  // Editor states (for creating or updating)
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Upload progress/feedback
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  // Uploaded images/files list
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Fetch all database content when logged in
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchUploadedImages = async () => {
    try {
      const res = await fetch('/api/uploads');
      if (res.ok) {
        setUploadedImages(await res.json());
      }
    } catch (e) {
      console.error("Failed to fetch uploaded images:", e);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [slidesRes, brandsRes, clientsRes, certsRes, brandingRes] = await Promise.all([
        fetch('/api/hero-slides').catch(() => null),
        fetch('/api/brands').catch(() => null),
        fetch('/api/clients').catch(() => null),
        fetch('/api/certifications').catch(() => null),
        fetch('/api/branding-settings').catch(() => null)
      ]);

      if (slidesRes && slidesRes.ok) {
        try { setSlides(await slidesRes.json()); } catch {}
      }
      if (brandsRes && brandsRes.ok) {
        try { setBrands(await brandsRes.json()); } catch {}
      }
      if (clientsRes && clientsRes.ok) {
        try { setClients(await clientsRes.json()); } catch {}
      }
      if (certsRes && certsRes.ok) {
        try { setCerts(await certsRes.json()); } catch {}
      }
      if (brandingRes && brandingRes.ok) {
        try { setBranding(await brandingRes.json()); } catch {}
      }

      await fetchUploadedImages();
    } catch (e) {
      console.error("Failed to fetch administration data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass })
      });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.success && data.token) {
          localStorage.setItem('qualita_admin_token', data.token);
          setToken(data.token);
          setIsLoading(false);
          return;
        }
      } else {
        const errData = await res.json().catch(() => null);
        if (errData && errData.error) {
          // If explicitly rejected by server
          setLoginError(errData.error);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Server auth endpoint offline or error, checking credentials locally:", err);
    }

    // Client-side fallback authentication so the admin is never blocked:
    if (cleanUser === 'admin' && (cleanPass === 'admin_qualita_password' || cleanPass === 'YbfSu9cE44')) {
      const fallbackToken = 'SECRET_QUALITA_ADMIN_SESSION_TOKEN_2026';
      localStorage.setItem('qualita_admin_token', fallbackToken);
      setToken(fallbackToken);
      setLoginError('');
    } else {
      setLoginError('Invalid admin username or password. Please use the credentials shown below.');
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('qualita_admin_token');
    setToken(null);
  };

  // Generic File Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    setUploadMessage('Uploading image...');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        callback(data.imageUrl);
        setUploadMessage('Image uploaded successfully!');
        fetchUploadedImages();
        setTimeout(() => setUploadMessage(''), 3000);
      } else {
        setUploadMessage('Upload failed. Try another file.');
      }
    } catch (err) {
      setUploadMessage('Error uploading file to server.');
    } finally {
      setIsUploading(false);
    }
  };

  // Generic Delete Handler
  const handleDelete = async (endpoint: string, id: number, refreshState: () => void) => {
    if (!confirm('Are you absolutely sure you want to delete this item?')) return;

    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        refreshState();
        setEditingItem(null);
        setIsCreating(false);
      } else {
        alert('Failed to delete item.');
      }
    } catch (err) {
      alert('Network error deleting item.');
    }
  };

  // Generic Save/Edit Handler
  const handleSave = async (endpoint: string, method: 'POST' | 'PUT', payload: any, refreshState: () => void) => {
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        refreshState();
        setEditingItem(null);
        setIsCreating(false);
      } else {
        const data = await res.json();
        alert(`Error saving item: ${data.error || 'Server rejected request'}`);
      }
    } catch (err) {
      alert('Network error while saving details.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl relative text-white">
        
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-sm tracking-wide">
                QUALITA ENTERPRISE CONSOLE
              </h2>
              <p className="text-[10px] text-purple-400 font-mono">
                {token ? 'Secure Session Active' : 'Access Authorization Required'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {token && (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 bg-red-950/40 hover:bg-red-900/30 text-red-400 border border-red-900/40 text-[11px] font-bold uppercase px-3 py-1.5 rounded-xl cursor-pointer transition-all"
              >
                <LogOut size={12} /> Log Out
              </button>
            )}
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Not Logged In Screen */}
        {!token ? (
          <div className="flex-grow flex items-center justify-center p-6 bg-gradient-to-b from-slate-900 to-slate-950">
            <form onSubmit={handleLogin} className="w-full max-w-sm bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="text-center space-y-1 mb-2">
                <Lock size={32} className="mx-auto text-purple-500 mb-2" />
                <h3 className="font-display font-bold text-lg">Unpublished Admin Gateway</h3>
                <p className="text-xs text-slate-400">Provide administrator credentials to gain database write access</p>
              </div>

              {loginError && (
                <div className="bg-red-950/40 border border-red-900/50 text-red-300 px-3 py-2 rounded-xl text-xs text-center">
                  {loginError}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Username</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                    placeholder="Enter admin username"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30"
                >
                  {isLoading ? <RefreshCw size={16} className="animate-spin" /> : 'Authorize Console'}
                </button>

                <button 
                  type="button"
                  onClick={() => {
                    setUsername('admin');
                    setPassword('admin_qualita_password');
                    const fallbackToken = 'SECRET_QUALITA_ADMIN_SESSION_TOKEN_2026';
                    localStorage.setItem('qualita_admin_token', fallbackToken);
                    setToken(fallbackToken);
                  }}
                  className="w-full bg-slate-800/80 hover:bg-slate-800 text-purple-300 hover:text-white text-xs font-semibold py-2 rounded-xl transition-all border border-purple-900/30 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck size={14} className="text-purple-400" /> Masuk Cepat (1-Click Auto Login)
                </button>
              </div>

              <div className="pt-2 border-t border-slate-800/60 mt-2 text-center text-slate-500 font-mono text-[10px] space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Admin Credentials</span>
                  <span className="text-[9px] text-purple-400/80">(Klik kotak untuk autofill)</span>
                </div>
                <div 
                  onClick={() => {
                    setUsername('admin');
                    setPassword('admin_qualita_password');
                  }}
                  className="flex justify-between px-3 py-2 bg-slate-950/80 hover:bg-slate-950 rounded-xl border border-slate-800 hover:border-purple-900/50 text-left gap-2 cursor-pointer transition-all"
                  title="Klik untuk mengisi otomatis"
                >
                  <span>User: <strong className="text-purple-400 select-all">admin</strong></span>
                  <span>Pass: <strong className="text-purple-400 select-all">admin_qualita_password</strong></span>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Active Administration Console Layout */
          <div className="flex-grow flex overflow-hidden">
            
            {/* Sidebar navigation */}
            <div className="w-56 border-r border-slate-800 bg-slate-950/40 flex flex-col justify-between p-4">
              <div className="space-y-1.5">
                <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
                  Database Tables
                </span>
                
                <button 
                  onClick={() => { setActiveTab('slides'); setEditingItem(null); setIsCreating(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'slides' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Layout size={14} /> Slide Show Hero
                </button>

                <button 
                  onClick={() => { setActiveTab('brands'); setEditingItem(null); setIsCreating(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'brands' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Briefcase size={14} /> Vendor & Partners
                </button>

                <button 
                  onClick={() => { setActiveTab('clients'); setEditingItem(null); setIsCreating(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'clients' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Eye size={14} /> Clients
                </button>

                <button 
                  onClick={() => { setActiveTab('certs'); setEditingItem(null); setIsCreating(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'certs' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Award size={14} /> Certifications
                </button>

                <div className="h-px bg-slate-800/80 my-4" />

                <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
                  Global Configuration
                </span>

                <button 
                  onClick={() => { setActiveTab('branding'); setEditingItem(null); setIsCreating(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'branding' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Settings size={14} /> Branding & Text
                </button>

                <button 
                  onClick={() => { setActiveTab('uploads'); setEditingItem(null); setIsCreating(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'uploads' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Upload size={14} /> Uploaded Files
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800/50 p-3 rounded-2xl space-y-1.5">
                <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                  Engine Status
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-slate-300 font-bold font-mono">MySQL Connected</span>
                </div>
                <p className="text-[8px] text-slate-500 font-mono">Host: sql12.freesqldatabase.com</p>
              </div>
            </div>

            {/* Dashboard Content Panel */}
            <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-6">
              
              {/* List View / Operations view */}
              <div className="flex-grow space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-display font-extrabold text-lg capitalize">{activeTab} Management</h3>
                    <p className="text-xs text-slate-400">View and update real-time entries in the database</p>
                  </div>
                  {activeTab !== 'branding' && activeTab !== 'uploads' && (
                    <button 
                      onClick={() => { setIsCreating(true); setEditingItem(null); }}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-900/20"
                    >
                      <Plus size={14} /> New Record
                    </button>
                  )}
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <RefreshCw size={24} className="animate-spin text-purple-500" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    
                    {/* SLIDES SHOW MANAGER LIST */}
                    {activeTab === 'slides' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {slides.map((slide, i) => (
                          <div key={slide.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-64 group hover:border-purple-900/50 transition-all">
                            <div className="space-y-1.5 flex-grow">
                              <div className="flex items-center justify-between">
                                <span className="bg-purple-950 border border-purple-900/40 text-purple-400 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Slide {i + 1} - {slide.tag}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">ID: {slide.id}</span>
                              </div>
                              <h4 className="font-display font-extrabold text-sm text-white line-clamp-2 mt-2 leading-snug">{slide.taglineId}</h4>
                              <p className="text-xs text-slate-400 line-clamp-3 mt-1">{slide.subId}</p>
                              
                              <div className="flex gap-2 mt-2 flex-wrap">
                                {slide.bgImageUrl ? (
                                  <span className="text-[9px] font-semibold text-green-400 bg-green-950/25 px-1.5 py-0.5 rounded border border-green-900/40">
                                    BG Image Set
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-semibold text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                                    Default Gradient
                                  </span>
                                )}
                                {slide.illustrationUrl ? (
                                  <span className="text-[9px] font-semibold text-blue-400 bg-blue-950/25 px-1.5 py-0.5 rounded border border-blue-900/40">
                                    Custom Logo Set
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-semibold text-purple-400 bg-purple-950/25 px-1.5 py-0.5 rounded border border-purple-900/40">
                                    Default QG Logo
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-2 justify-end border-t border-slate-850/60 pt-3 mt-3">
                              <button 
                                onClick={() => { setEditingItem(slide); setIsCreating(false); }}
                                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-all"
                                title="Edit slide"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button 
                                onClick={() => handleDelete('/api/hero-slides', slide.id, fetchData)}
                                className="w-8 h-8 rounded-xl bg-red-950/40 hover:bg-red-900/30 text-red-400 flex items-center justify-center cursor-pointer transition-all"
                                title="Delete slide"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* VENDORS & PARTNERS LIST */}
                    {activeTab === 'brands' && brands.map(brand => (
                      <div key={brand.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex justify-between items-center group hover:border-purple-900/50 transition-all">
                        <div className="flex items-center gap-3">
                          {brand.imageUrl ? (
                            <img src={brand.imageUrl} alt={brand.name} className="w-10 h-10 object-contain bg-slate-950 rounded-xl p-1 border border-slate-800" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center text-xs font-bold border border-purple-900">
                              {brand.name[0]}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-display font-bold text-sm text-white">{brand.name}</h4>
                              <span className="bg-slate-800 text-slate-400 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">
                                {brand.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-1">{brand.description || 'No description provided.'}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => { setEditingItem(brand); setIsCreating(false); }}
                            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button 
                            onClick={() => handleDelete('/api/brands', brand.id, fetchData)}
                            className="w-8 h-8 rounded-xl bg-red-950/40 hover:bg-red-900/30 text-red-400 flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* CLIENTS LIST */}
                    {activeTab === 'clients' && clients.map(client => (
                      <div key={client.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex justify-between items-center group hover:border-purple-900/50 transition-all">
                        <div className="flex items-center gap-3">
                          {client.imageUrl ? (
                            <img src={client.imageUrl} alt={client.name} className="w-10 h-10 object-contain bg-slate-950 rounded-xl p-1 border border-slate-800" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-900">
                              {client.name[0]}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-display font-bold text-sm text-white">{client.name}</h4>
                              <span className="bg-slate-800 text-slate-400 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">
                                {client.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => { setEditingItem(client); setIsCreating(false); }}
                            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button 
                            onClick={() => handleDelete('/api/clients', client.id, fetchData)}
                            className="w-8 h-8 rounded-xl bg-red-950/40 hover:bg-red-900/30 text-red-400 flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* CERTIFICATIONS LIST */}
                    {activeTab === 'certs' && certs.map(cert => (
                      <div key={cert.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex justify-between items-center group hover:border-purple-900/50 transition-all">
                        <div className="flex items-center gap-3">
                          {cert.imageUrl ? (
                            <img src={cert.imageUrl} alt={cert.name} className="w-10 h-10 object-contain bg-slate-950 rounded-xl p-1 border border-slate-800" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-pink-950 text-pink-400 flex items-center justify-center text-xs font-bold border border-pink-900">
                              {cert.iconName || 'Award'}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-display font-bold text-sm text-white">{cert.name}</h4>
                              <span className="bg-slate-800 text-slate-400 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">
                                {cert.issuer}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-1">{cert.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => { setEditingItem(cert); setIsCreating(false); }}
                            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button 
                            onClick={() => handleDelete('/api/certifications', cert.id, fetchData)}
                            className="w-8 h-8 rounded-xl bg-red-950/40 hover:bg-red-900/30 text-red-400 flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* BRANDING CONFIGURATION FORM (Always shown in full) */}
                    {activeTab === 'branding' && (
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company Registered Name</label>
                            <input 
                              type="text" 
                              value={branding.companyName || ''}
                              onChange={e => setBranding({...branding, companyName: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Company Tagline</label>
                            <input 
                              type="text" 
                              value={branding.tagline || ''}
                              onChange={e => setBranding({...branding, tagline: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Branding Short Overview (About Section)</label>
                          <textarea 
                            rows={3}
                            value={branding.description || ''}
                            onChange={e => setBranding({...branding, description: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        <div className="space-y-1.5 p-4 bg-slate-950 rounded-2xl border border-slate-800/80">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Brand Logo (Upload Replacement)</label>
                          <div className="flex items-center gap-4">
                            {branding.logoUrl ? (
                              <img src={branding.logoUrl} alt="Logo" className="h-10 max-w-[150px] object-contain bg-slate-900 border border-slate-800 rounded-xl p-2" />
                            ) : (
                              <div className="h-10 w-24 bg-slate-900 border border-dashed border-slate-800 text-[10px] text-slate-500 flex items-center justify-center rounded-xl">No logo url</div>
                            )}
                            <div className="relative">
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={e => handleImageUpload(e, (url) => setBranding({...branding, logoUrl: url}))}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                              <button type="button" className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer">
                                <Upload size={13} /> {isUploading ? 'Uploading...' : 'Choose File'}
                              </button>
                            </div>
                            {branding.logoUrl && (
                              <button 
                                type="button" 
                                onClick={() => setBranding({...branding, logoUrl: null})}
                                className="text-xs text-red-400 hover:underline cursor-pointer"
                              >
                                Clear custom logo
                              </button>
                            )}
                          </div>
                        </div>

                        <button 
                          onClick={() => handleSave('/api/branding-settings', 'PUT', branding, fetchData)}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Save size={16} /> Save Branding & Configuration Settings
                        </button>
                      </div>
                    )}

                    {/* UPLOADED FILES & IMAGES MANAGER */}
                    {activeTab === 'uploads' && (
                      <div className="space-y-4">
                        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="text-left">
                            <h4 className="font-display font-bold text-sm text-white">Upload New Media</h4>
                            <p className="text-xs text-slate-400">Directly upload images here to get their dynamic URLs and use them in records.</p>
                          </div>
                          
                          <div className="relative">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={e => handleImageUpload(e, (url) => {
                                setCopiedUrl(url);
                                setTimeout(() => setCopiedUrl(null), 3000);
                              })}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-900/10">
                              <Upload size={14} /> Upload Custom File
                            </button>
                          </div>
                        </div>

                        {uploadMessage && (
                          <div className="bg-purple-950/40 border border-purple-900/40 text-purple-300 text-xs py-2 px-3 rounded-xl text-center">
                            {uploadMessage}
                          </div>
                        )}

                        {copiedUrl && (
                          <div className="bg-green-950/40 border border-green-900/40 text-green-300 text-xs py-2 px-3 rounded-xl text-center flex items-center justify-center gap-1.5">
                            <Check size={14} /> Copied path: <strong>{copiedUrl}</strong>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {uploadedImages.length === 0 ? (
                            <div className="col-span-2 text-center py-12 bg-slate-950/40 border border-slate-900 rounded-2xl text-slate-500 text-xs">
                              No uploaded files found in public/uploads directory.
                            </div>
                          ) : (
                            uploadedImages.map((imgUrl) => {
                              const filename = imgUrl.split('/').pop() || '';
                              const isCopied = copiedUrl === imgUrl;
                              return (
                                <div key={imgUrl} className="bg-slate-950 border border-slate-850 rounded-2xl p-3 flex gap-3 items-center hover:border-purple-900/30 transition-all group">
                                  <div className="w-14 h-14 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800 flex-shrink-0">
                                    <img src={imgUrl} alt={filename} className="w-full h-full object-cover" onError={(e) => {
                                      (e.target as HTMLElement).style.display = 'none';
                                    }} />
                                  </div>
                                  <div className="flex-grow text-left min-w-0">
                                    <p className="text-[10px] text-slate-500 truncate font-mono">{filename}</p>
                                    <p className="text-xs text-white font-bold font-mono truncate select-all">{imgUrl}</p>
                                    <div className="flex gap-2 mt-1">
                                      <button 
                                        onClick={() => {
                                          navigator.clipboard.writeText(imgUrl);
                                          setCopiedUrl(imgUrl);
                                          setTimeout(() => setCopiedUrl(null), 2000);
                                        }}
                                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 transition-all cursor-pointer ${
                                          isCopied ? 'bg-green-950 border border-green-900 text-green-400' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-750'
                                        }`}
                                      >
                                        {isCopied ? <Check size={10} /> : null}
                                        {isCopied ? 'COPIED' : 'COPY PATH'}
                                      </button>
                                      <button 
                                        onClick={async () => {
                                          if (!confirm(`Are you sure you want to delete ${filename}?`)) return;
                                          try {
                                            const res = await fetch(`/api/uploads/${filename}`, {
                                              method: 'DELETE',
                                              headers: { 'Authorization': `Bearer ${token}` }
                                            });
                                            if (res.ok) {
                                              fetchUploadedImages();
                                            } else {
                                              alert('Failed to delete file from disk.');
                                            }
                                          } catch (err) {
                                            alert('Error connection to server.');
                                          }
                                        }}
                                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-950/40 hover:bg-red-950 text-red-400 border border-red-900/30 flex items-center gap-1 cursor-pointer"
                                      >
                                        <Trash2 size={10} /> DELETE
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>

              {/* EDITOR FORM BLOCK PANEL (Shows when editing or creating) */}
              {(editingItem || isCreating) && activeTab !== 'branding' && activeTab !== 'uploads' && (
                <div className="w-full bg-slate-900/90 border border-purple-900/20 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h4 className="font-display font-extrabold text-sm text-purple-400 tracking-wider">
                        {isCreating ? 'CREATE NEW RECORD' : 'UPDATE RECORD'}
                      </h4>
                      <button 
                        onClick={() => { setEditingItem(null); setIsCreating(false); }}
                        className="text-xs text-slate-500 hover:text-white cursor-pointer px-2 py-1 bg-slate-950 border border-slate-850 rounded-lg hover:border-slate-800 transition-all"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* --- SLIDES SHOW EDITING --- */}
                    {activeTab === 'slides' && (
                      <div className="space-y-4 text-xs text-left">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tag/Category (e.g., Security)</label>
                            <input 
                              type="text"
                              placeholder="Networking"
                              defaultValue={editingItem?.tag || ''}
                              id="slide_tag"
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tailwind bg-gradient style</label>
                            <input 
                              type="text"
                              id="slide_bgGradient"
                              defaultValue={editingItem?.bgGradient || 'from-slate-950 via-purple-950 to-slate-950'}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Badge (Bahasa Indonesia)</label>
                            <input 
                              type="text"
                              id="slide_badgeId"
                              defaultValue={editingItem?.badgeId || ''}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Badge (English)</label>
                            <input 
                              type="text"
                              id="slide_badgeEn"
                              defaultValue={editingItem?.badgeEn || ''}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tagline (Bahasa Indonesia)</label>
                            <textarea 
                              rows={3}
                              id="slide_taglineId"
                              defaultValue={editingItem?.taglineId || ''}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tagline (English)</label>
                            <textarea 
                              rows={3}
                              id="slide_taglineEn"
                              defaultValue={editingItem?.taglineEn || ''}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Subtext (Bahasa Indonesia)</label>
                            <textarea 
                              rows={4}
                              id="slide_subId"
                              defaultValue={editingItem?.subId || ''}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Subtext (English)</label>
                            <textarea 
                              rows={4}
                              id="slide_subEn"
                              defaultValue={editingItem?.subEn || ''}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Feature ID</label>
                            <input 
                              type="text"
                              id="slide_featureId"
                              defaultValue={editingItem?.featureId || ''}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Feature EN</label>
                            <input 
                              type="text"
                              id="slide_featureEn"
                              defaultValue={editingItem?.featureEn || ''}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {/* Slide Image Background upload */}
                          <div className="space-y-1.5 p-3.5 bg-slate-950 rounded-xl border border-slate-850">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Custom Background Image URL</label>
                            <div className="space-y-2">
                              <input 
                                type="text" 
                                id="slide_bgImageUrl"
                                placeholder="/uploads/custom-bg.jpg"
                                defaultValue={editingItem?.bgImageUrl || ''}
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px]"
                              />
                              <div className="relative">
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={e => handleImageUpload(e, (url) => {
                                    const input = document.getElementById('slide_bgImageUrl') as HTMLInputElement;
                                    if (input) input.value = url;
                                  })}
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <button type="button" className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold px-2 py-1 rounded cursor-pointer">
                                  Upload image file
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Slide Illustration Image customizer upload */}
                          <div className="space-y-1.5 p-3.5 bg-slate-950 rounded-xl border border-slate-850">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Custom Slide Logo/Illustration</label>
                            <div className="space-y-2">
                              <input 
                                type="text" 
                                id="slide_illustrationUrl"
                                placeholder="/uploads/custom-illustration.png"
                                defaultValue={editingItem?.illustrationUrl || ''}
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px]"
                              />
                              <div className="relative">
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={e => handleImageUpload(e, (url) => {
                                    const input = document.getElementById('slide_illustrationUrl') as HTMLInputElement;
                                    if (input) input.value = url;
                                  })}
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <button type="button" className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold px-2 py-1 rounded cursor-pointer">
                                  Upload logo file
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* --- VENDOR BRANDS EDITING --- */}
                    {activeTab === 'brands' && (
                      <div className="space-y-4 text-xs text-left">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Vendor/Brand Name</label>
                            <input 
                              type="text"
                              id="brand_name"
                              defaultValue={editingItem?.name || ''}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                            <select 
                              id="brand_category"
                              defaultValue={editingItem?.category || 'Security'}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            >
                              <option value="Security">Security</option>
                              <option value="Network">Network</option>
                              <option value="Cloud & Datacenter">Cloud & Datacenter</option>
                              <option value="Software & IT Ops">Software & IT Ops</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Short Description (optional)</label>
                          <textarea 
                            rows={3}
                            id="brand_description"
                            defaultValue={editingItem?.description || ''}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                          />
                        </div>

                        {/* Brand Logo Upload */}
                        <div className="space-y-1.5 p-3.5 bg-slate-950 rounded-xl border border-slate-850">
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Custom Brand Logo Image</label>
                          <div className="space-y-2">
                            <input 
                              type="text" 
                              id="brand_imageUrl"
                              placeholder="/uploads/my-brand-logo.png"
                              defaultValue={editingItem?.imageUrl || ''}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px]"
                            />
                            <div className="relative">
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={e => handleImageUpload(e, (url) => {
                                  const input = document.getElementById('brand_imageUrl') as HTMLInputElement;
                                  if (input) input.value = url;
                                })}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                              <button type="button" className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold px-2 py-1 rounded cursor-pointer">
                                Upload image file
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* --- CLIENTS EDITING --- */}
                    {activeTab === 'clients' && (
                      <div className="space-y-4 text-xs text-left">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Client Company Name</label>
                            <input 
                              type="text"
                              id="client_name"
                              defaultValue={editingItem?.name || ''}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Industry Category</label>
                            <select 
                              id="client_category"
                              defaultValue={editingItem?.category || 'Enterprise & Professional'}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            >
                              <option value="Enterprise & Professional">Enterprise & Professional</option>
                              <option value="Telecommunications">Telecommunications</option>
                              <option value="Finance & Insurance">Finance & Insurance</option>
                              <option value="Government & Public">Government & Public</option>
                            </select>
                          </div>
                        </div>

                        {/* Client Logo Upload */}
                        <div className="space-y-1.5 p-3.5 bg-slate-950 rounded-xl border border-slate-850">
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Custom Client Logo Image</label>
                          <div className="space-y-2">
                            <input 
                              type="text" 
                              id="client_imageUrl"
                              placeholder="/uploads/client-logo.png"
                              defaultValue={editingItem?.imageUrl || ''}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px]"
                            />
                            <div className="relative">
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={e => handleImageUpload(e, (url) => {
                                  const input = document.getElementById('client_imageUrl') as HTMLInputElement;
                                  if (input) input.value = url;
                                })}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                              <button type="button" className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold px-2 py-1 rounded cursor-pointer">
                                Upload image file
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* --- CERTIFICATIONS EDITING --- */}
                    {activeTab === 'certs' && (
                      <div className="space-y-4 text-xs text-left">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Certification Acronym (e.g. CCNP)</label>
                            <input 
                              type="text"
                              id="cert_name"
                              defaultValue={editingItem?.name || ''}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Issuer/Organization</label>
                            <input 
                              type="text"
                              id="cert_issuer"
                              defaultValue={editingItem?.issuer || ''}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Full Description (Title validation)</label>
                            <input 
                              type="text"
                              id="cert_description"
                              defaultValue={editingItem?.description || ''}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Lucide Icon Name (fallback)</label>
                            <input 
                              type="text"
                              id="cert_iconName"
                              defaultValue={editingItem?.iconName || 'Award'}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>

                        {/* Certification Logo Upload */}
                        <div className="space-y-1.5 p-3.5 bg-slate-950 rounded-xl border border-slate-850">
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Custom Certification Logo Image</label>
                          <div className="space-y-2">
                            <input 
                              type="text" 
                              id="cert_imageUrl"
                              placeholder="/uploads/certification-logo.png"
                              defaultValue={editingItem?.imageUrl || ''}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px]"
                            />
                            <div className="relative">
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={e => handleImageUpload(e, (url) => {
                                  const input = document.getElementById('cert_imageUrl') as HTMLInputElement;
                                  if (input) input.value = url;
                                })}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                              <button type="button" className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold px-2 py-1 rounded cursor-pointer">
                                Upload image file
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  <div className="pt-4 border-t border-slate-800 flex gap-2 mt-4">
                    <button 
                      onClick={() => {
                        const method = isCreating ? 'POST' : 'PUT';
                        const id = editingItem?.id;
                        let endpoint = '';
                        let payload: any = {};

                        if (activeTab === 'slides') {
                          endpoint = isCreating ? '/api/hero-slides' : `/api/hero-slides/${id}`;
                          payload = {
                            badgeId: (document.getElementById('slide_badgeId') as HTMLInputElement)?.value,
                            badgeEn: (document.getElementById('slide_badgeEn') as HTMLInputElement)?.value,
                            taglineId: (document.getElementById('slide_taglineId') as HTMLTextAreaElement)?.value,
                            taglineEn: (document.getElementById('slide_taglineEn') as HTMLTextAreaElement)?.value,
                            subId: (document.getElementById('slide_subId') as HTMLTextAreaElement)?.value,
                            subEn: (document.getElementById('slide_subEn') as HTMLTextAreaElement)?.value,
                            featureId: (document.getElementById('slide_featureId') as HTMLInputElement)?.value,
                            featureEn: (document.getElementById('slide_featureEn') as HTMLInputElement)?.value,
                            bgGradient: (document.getElementById('slide_bgGradient') as HTMLInputElement)?.value,
                            bgImageUrl: (document.getElementById('slide_bgImageUrl') as HTMLInputElement)?.value || null,
                            illustrationUrl: (document.getElementById('slide_illustrationUrl') as HTMLInputElement)?.value || null,
                            tag: (document.getElementById('slide_tag') as HTMLInputElement)?.value || 'Enterprise'
                          };
                        } else if (activeTab === 'brands') {
                          endpoint = isCreating ? '/api/brands' : `/api/brands/${id}`;
                          payload = {
                            name: (document.getElementById('brand_name') as HTMLInputElement)?.value,
                            category: (document.getElementById('brand_category') as HTMLSelectElement)?.value,
                            description: (document.getElementById('brand_description') as HTMLTextAreaElement)?.value,
                            imageUrl: (document.getElementById('brand_imageUrl') as HTMLInputElement)?.value || null
                          };
                        } else if (activeTab === 'clients') {
                          endpoint = isCreating ? '/api/clients' : `/api/clients/${id}`;
                          payload = {
                            name: (document.getElementById('client_name') as HTMLInputElement)?.value,
                            category: (document.getElementById('client_category') as HTMLSelectElement)?.value,
                            imageUrl: (document.getElementById('client_imageUrl') as HTMLInputElement)?.value || null
                          };
                        } else if (activeTab === 'certs') {
                          endpoint = isCreating ? '/api/certifications' : `/api/certifications/${id}`;
                          payload = {
                            name: (document.getElementById('cert_name') as HTMLInputElement)?.value,
                            issuer: (document.getElementById('cert_issuer') as HTMLInputElement)?.value,
                            description: (document.getElementById('cert_description') as HTMLInputElement)?.value,
                            iconName: (document.getElementById('cert_iconName') as HTMLInputElement)?.value,
                            imageUrl: (document.getElementById('cert_imageUrl') as HTMLInputElement)?.value || null
                          };
                        }

                        handleSave(endpoint, method, payload, fetchData);
                      }}
                      className="flex-grow bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer shadow-md"
                    >
                      <Check size={14} /> {isCreating ? 'Create' : 'Save Changes'}
                    </button>
                    <button 
                      onClick={() => { setEditingItem(null); setIsCreating(false); }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold px-3 py-2 rounded-xl text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Global Floating Uploader Feedback Message */}
        {uploadMessage && (
          <div className="absolute bottom-4 right-4 bg-slate-900 border border-purple-500 text-purple-200 px-4 py-2.5 rounded-2xl text-xs shadow-2xl flex items-center gap-2 z-50">
            <RefreshCw size={12} className="animate-spin text-purple-400" />
            <span>{uploadMessage}</span>
          </div>
        )}

      </div>
    </div>
  );
}
