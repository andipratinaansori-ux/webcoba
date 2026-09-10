import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICES, SOLUTIONS, BRANDS, OFFICE_CONTACT } from '../data/companyData';
import { Check, ArrowRight, ArrowLeft, Mail, FileText, Send, CheckCircle, HelpCircle, Briefcase, Network, Cpu, FileCheck } from 'lucide-react';

interface RfpState {
  services: string[];
  solutions: string[];
  brands: string[];
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  message: string;
  timeline: string;
  budgetRange: string;
}

export default function RfpConfigurator() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RfpState>({
    services: [],
    solutions: [],
    brands: [],
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    message: '',
    timeline: '1-3 Months',
    budgetRange: 'Medium ($10k - $50k)'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleService = (serviceTitle: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceTitle)
        ? prev.services.filter(s => s !== serviceTitle)
        : [...prev.services, serviceTitle]
    }));
  };

  const toggleSolution = (solutionId: string) => {
    setFormData(prev => ({
      ...prev,
      solutions: prev.solutions.includes(solutionId)
        ? prev.solutions.filter(s => s !== solutionId)
        : [...prev.solutions, solutionId]
    }));
  };

  const toggleBrand = (brandName: string) => {
    setFormData(prev => ({
      ...prev,
      brands: prev.brands.includes(brandName)
        ? prev.brands.filter(b => b !== brandName)
        : [...prev.brands, brandName]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      services: [],
      solutions: [],
      brands: [],
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      message: '',
      timeline: '1-3 Months',
      budgetRange: 'Medium ($10k - $50k)'
    });
    setStep(1);
    setIsSubmitted(false);
  };

  // Helper to trigger standard mailto link
  const sendEmailProposal = () => {
    const subject = `IT Infrastructure Request for Proposal - ${formData.companyName || 'Enterprise'}`;
    const body = `
Request for Proposal (RFP) - PT. Qualita Global Teknologi
-----------------------------------------------------------
Client Company: ${formData.companyName || 'Not specified'}
Contact Person: ${formData.contactName}
Phone Number: ${formData.phone}
Email: ${formData.email}
Target Timeline: ${formData.timeline}
Estimated Budget: ${formData.budgetRange}

Requested Services:
${formData.services.length > 0 ? formData.services.map(s => ` - ${s}`).join('\n') : 'None selected'}

Requested Technical Solutions:
${formData.solutions.length > 0 ? formData.solutions.map(s => {
  const sol = SOLUTIONS.find(x => x.id === s);
  return ` - ${sol?.title || s}`;
}).join('\n') : 'None selected'}

Preferred Technology Brands:
${formData.brands.length > 0 ? formData.brands.map(b => ` - ${b}`).join('\n') : 'None selected'}

Client Brief / Additional Notes:
"${formData.message || 'No additional notes.'}"

-----------------------------------------------------------
Generated via Qualita Global Teknologi Interactive RFQ Configurator
    `;
    window.location.href = `mailto:${OFFICE_CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden" id="rfp-builder">
      {/* Header Banner */}
      <div className="bg-slate-900 px-6 py-8 text-white border-b border-slate-800">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="text-left">
            <span className="bg-slate-800 text-purple-400 border border-slate-700 text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full">
              Interactive Tool
            </span>
            <h3 className="font-display text-2xl font-bold mt-2 text-white">IT Architecture Configurator</h3>
            <p className="text-slate-400 text-sm mt-1">
              Select your requirements and get a customized solution proposal.
            </p>
          </div>
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-xl border border-slate-800">
            {[1, 2, 3, 4].map(num => (
              <div
                key={num}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
                  step === num
                    ? 'bg-purple-600 text-white shadow-md scale-110 font-bold'
                    : step > num
                    ? 'bg-purple-950/40 text-purple-300 border border-purple-900/30'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {step > num ? <Check size={14} className="stroke-[3]" /> : num}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 px-4 text-left"
              key="submitted"
            >
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={36} />
              </div>
              <h4 className="font-display text-2xl font-bold text-slate-900">Proposal Configured Successfully!</h4>
              <p className="text-slate-600 mt-2 max-w-lg mx-auto text-sm">
                Thank you! Your IT configuration has been captured. We have prepared your design spec draft. Click below to submit this configuration directly to our Sales team via your email client.
              </p>

              {/* Solution Summary Sheet */}
              <div className="mt-8 bg-slate-50 rounded-2xl border border-slate-200 p-6 text-left max-w-xl mx-auto">
                <h5 className="font-display font-semibold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
                  <FileCheck size={18} className="text-purple-600" /> Configuration Specification Draft
                </h5>
                <div className="space-y-4 mt-4 text-sm text-slate-700">
                  <div>
                    <strong className="text-slate-900">Company Profile:</strong> {formData.companyName || 'Self'} - {formData.contactName}
                  </div>
                  <div>
                    <strong className="text-slate-900">Selected Services:</strong>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {formData.services.length > 0 ? (
                        formData.services.map(s => (
                          <span key={s} className="bg-slate-150 text-slate-800 border border-slate-250 text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic text-xs">None selected</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <strong className="text-slate-900">Target Solutions:</strong>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {formData.solutions.length > 0 ? (
                        formData.solutions.map(s => {
                          const sol = SOLUTIONS.find(x => x.id === s);
                          return (
                            <span key={s} className="bg-purple-50 text-purple-700 border border-purple-100/65 text-xs px-2.5 py-1 rounded-full font-medium">
                              {sol?.title || s}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-slate-400 italic text-xs">None selected</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <strong className="text-slate-900">Tech Brand Preferences:</strong>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {formData.brands.length > 0 ? (
                        formData.brands.map(b => (
                          <span key={b} className="bg-slate-100 text-slate-800 border border-slate-200/60 text-xs px-2.5 py-1 rounded-full font-medium">
                            {b}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic text-xs">None selected</span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-xs">
                    <div>
                      <strong className="text-slate-950 block">Timeline</strong>
                      <span className="text-slate-600">{formData.timeline}</span>
                    </div>
                    <div>
                      <strong className="text-slate-950 block">Budget Scope</strong>
                      <span className="text-slate-600">{formData.budgetRange}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={sendEmailProposal}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail size={18} /> Send Draft via Email
                </button>
                <button
                  onClick={resetForm}
                  className="border border-slate-250 hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-all cursor-pointer bg-white border-slate-200"
                >
                  Configure New Solution
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* STEP 1: SERVICES SELECT */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  key="step1"
                  className="space-y-6 text-left"
                >
                  <div className="flex items-center gap-2 text-slate-900">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                    <h4 className="font-display text-lg font-bold text-slate-900">Step 1: Choose Required Services</h4>
                  </div>
                  <p className="text-slate-600 text-sm">
                    Select the key services you require from PT. Qualita Global Teknologi to help analyze, deploy, or maintain your technology:
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {SERVICES.map(service => {
                      const isSelected = formData.services.includes(service.title);
                      return (
                        <div
                          key={service.title}
                          onClick={() => toggleService(service.title)}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer select-none text-left flex flex-col justify-between ${
                            isSelected
                              ? 'border-purple-600 bg-purple-50/20 shadow-sm'
                              : 'border-slate-200 hover:border-purple-300 bg-white'
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start">
                              <span className={`font-display font-bold text-sm ${isSelected ? 'text-purple-700' : 'text-slate-900'}`}>
                                {service.title}
                              </span>
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                                  isSelected ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 bg-white'
                                }`}
                              >
                                {isSelected && <Check size={12} className="stroke-[3]" />}
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                              {service.description}
                            </p>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-1">
                            {service.items.slice(0, 3).map(item => (
                              <span key={item} className="bg-slate-100 text-slate-600 border border-slate-200/50 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                {item}
                              </span>
                            ))}
                            {service.items.length > 3 && (
                              <span className="text-[10px] text-purple-600 self-center ml-1 font-semibold">
                                +{service.items.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer"
                    >
                      Next Step <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: SOLUTIONS SELECT */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  key="step2"
                  className="space-y-6 text-left"
                >
                  <div className="flex items-center gap-2 text-slate-900">
                    <Network className="w-5 h-5 text-purple-600" />
                    <h4 className="font-display text-lg font-bold text-slate-900">Step 2: Select Key Technical Solutions</h4>
                  </div>
                  <p className="text-slate-600 text-sm">
                    Select the architectural areas you would like integrated or upgraded within your business networks:
                  </p>

                  <div className="space-y-3">
                    {SOLUTIONS.map(sol => {
                      const isSelected = formData.solutions.includes(sol.id);
                      return (
                        <div
                          key={sol.id}
                          onClick={() => toggleSolution(sol.id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer select-none text-left flex items-center justify-between gap-4 ${
                            isSelected
                              ? 'border-purple-600 bg-purple-50/20 shadow-sm'
                              : 'border-slate-200 hover:border-purple-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 p-2 rounded-lg ${isSelected ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'}`}>
                              {sol.iconName === 'Network' && <Network size={18} />}
                              {sol.iconName === 'Server' && <Cpu size={18} />}
                              {sol.iconName === 'ShieldCheck' && <CheckCircle size={18} />}
                              {sol.iconName === 'Video' && <Mail size={18} />}
                              {sol.iconName === 'Laptop' && <Cpu size={18} />}
                            </div>
                            <div>
                              <span className={`block font-display font-semibold text-sm ${isSelected ? 'text-purple-950' : 'text-slate-900'}`}>
                                {sol.title}
                              </span>
                              <span className="text-xs text-slate-500 line-clamp-1 leading-relaxed">{sol.description}</span>
                            </div>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                              isSelected ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check size={12} className="stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="border border-slate-250 hover:bg-slate-50 text-slate-700 font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer bg-white border-slate-200"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer"
                    >
                      Next Step <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: BRANDS SELECT */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  key="step3"
                  className="space-y-6 text-left"
                >
                  <div className="flex items-center gap-2 text-slate-900">
                    <Cpu className="w-5 h-5 text-purple-600" />
                    <h4 className="font-display text-lg font-bold text-slate-900">Step 3: Specify Technology Brand Preferences</h4>
                  </div>
                  <p className="text-slate-600 text-sm">
                    Select the vendor solutions you prefer to leverage or align with. We partner with elite Gartner-tier technology creators:
                  </p>

                  <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-4">
                    {['Security', 'Network', 'Cloud & Datacenter', 'Software & IT Ops'].map(cat => {
                      const categoryBrands = BRANDS.filter(b => b.category === cat);
                      return (
                        <div key={cat}>
                          <span className="text-xs font-bold text-slate-400 tracking-wider uppercase px-1">{cat}</span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                            {categoryBrands.map(brand => {
                              const isSelected = formData.brands.includes(brand.name);
                              return (
                                <div
                                  key={brand.name}
                                  onClick={() => toggleBrand(brand.name)}
                                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer select-none text-xs font-semibold ${
                                    isSelected
                                      ? 'border-purple-600 bg-purple-600 text-white font-bold shadow-sm'
                                      : 'border-slate-200 bg-white hover:border-purple-300 text-slate-750'
                                  }`}
                                >
                                  {brand.name}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="border border-slate-250 hover:bg-slate-50 text-slate-700 font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer bg-white border-slate-200"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer"
                    >
                      Finalize Specifications <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: CONTACT & ESTIMATES */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  key="step4"
                  className="space-y-6 text-left"
                >
                  <div className="flex items-center gap-2 text-slate-900">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <h4 className="font-display text-lg font-bold text-slate-900">Step 4: Complete Your RFP Brief</h4>
                  </div>
                  <p className="text-slate-600 text-sm">
                    Enter your contact credentials and details about your target deployment environment so we can generate your draft proposal:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Contact Name *</label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:bg-white outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Company Name</label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full border border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:bg-white outline-none transition-all"
                        placeholder="PT. Enterprise Indo"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Corporate Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:bg-white outline-none transition-all"
                        placeholder="john@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:bg-white outline-none transition-all"
                        placeholder="(021) XXX-XXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Timeline Preference</label>
                      <select
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        className="w-full border border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:bg-white outline-none transition-all cursor-pointer"
                      >
                        <option>Immediate (Within 1 Month)</option>
                        <option>1-3 Months</option>
                        <option>3-6 Months</option>
                        <option>Flexible / Planning Phase</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Estimated Budget Scope</label>
                      <select
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleInputChange}
                        className="w-full border border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:bg-white outline-none transition-all cursor-pointer"
                      >
                        <option>Basic Procurement (&lt; $10k)</option>
                        <option>Medium ($10k - $50k)</option>
                        <option>Enterprise ($50k - $200k)</option>
                        <option>Large Infrastructure ($200k+)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Scope Brief / Special Requirements</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full border border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:bg-white outline-none transition-all resize-none"
                      placeholder="Explain your technical requirements, network size, or any specific pain points..."
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="border border-slate-250 hover:bg-slate-50 text-slate-700 font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer bg-white border-slate-200"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Drafting Proposal...
                        </>
                      ) : (
                        <>
                          Build Spec Proposal <Send size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
