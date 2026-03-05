'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  Globe, 
  Layout, 
  Palette, 
  Info,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const STEPS = [
  { id: 'intro', title: 'Começar', icon: Info },
  { id: 'company', title: 'Empresa', icon: Globe },
  { id: 'style', title: 'Estilo', icon: Palette },
  { id: 'content', title: 'Conteúdo', icon: Layout },
  { id: 'hosting', title: 'Hospedagem', icon: Globe },
  { id: 'finish', title: 'Finalizar', icon: CheckCircle2 },
];

export default function BriefingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    companyName: '',
    businessType: '',
    siteType: 'landing-page',
    style: 'moderno',
    services: '',
    testimonials: '',
    socialMedia: '',
    address: '',
    hours: '',
    whatsapp: '',
    observations: '',
    hasSite: 'nao',
    hasHosting: 'nao',
    hasDomain: 'nao',
  });
  const [files, setFiles] = useState<Record<string, File[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [affiliateLink, setAffiliateLink] = useState('https://www.hostgator.com.br/afiliados');

  React.useEffect(() => {
    fetch('/api/public/data')
      .then(res => res.json())
      .then(data => {
        if (data.settings?.affiliateLink) {
          setAffiliateLink(data.settings.affiliateLink);
        }
      });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop: (f) => onDrop(f, 'assets') 
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const onDrop = (acceptedFiles: File[], field: string) => {
    setFiles(prev => ({ ...prev, [field]: acceptedFiles }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('data', JSON.stringify(formData));
      
      Object.entries(files).forEach(([field, fileList]) => {
        fileList.forEach(file => {
          data.append(field, file);
        });
      });

      const res = await fetch('/api/briefing', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  if (submitted) {
    return (
      <div className="text-center py-20 px-6 nex-card rounded-3xl border border-white/5 max-w-2xl mx-auto backdrop-blur-xl">
        <div className="w-20 h-20 bg-[#00f5d4]/10 text-[#00f5d4] rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} />
        </div>
        <h2 className="text-3xl font-display font-bold mb-4">Briefing Recebido!</h2>
        <p className="text-white/50 mb-8">
          Excelente! Já recebemos suas informações. Em instantes entraremos em contato via WhatsApp para confirmar os detalhes e iniciar a criação do seu site.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="nex-button-primary px-8 py-3 rounded-full font-semibold"
        >
          Voltar ao Início
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
            Fase {currentStep + 1} de {STEPS.length}
          </span>
          <span className="text-[10px] font-bold text-[#00f5d4]">{Math.round(progress)}%</span>
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-[#00f5d4]"
          />
        </div>
      </div>

      <div className="nex-card rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step Content */}
            {currentStep === 0 && (
              <div className="space-y-8">
                <div className="inline-flex p-4 bg-[#00f5d4]/10 text-[#00f5d4] rounded-2xl">
                  <Info size={28} />
                </div>
                <h2 className="text-4xl font-display font-bold tracking-tight">Vamos escalar sua <br /> presença digital?</h2>
                <p className="text-white/50 leading-relaxed font-light text-lg">
                  Para entregarmos seu site em até 24h, precisamos de algumas informações estratégicas. Fique tranquilo, é rápido e direto ao ponto.
                </p>
                <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/5 flex gap-4 items-start">
                  <AlertCircle className="text-[#00f5d4] shrink-0" size={20} />
                  <p className="text-sm text-white/40 italic">
                    &quot;A psicologia por trás de um bom site começa com um briefing bem feito. Vamos nessa?&quot;
                  </p>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-8">
                <h2 className="text-3xl font-display font-bold">Dados da Empresa</h2>
                <div className="grid gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Nome da Empresa</label>
                    <input 
                      type="text" 
                      value={formData.companyName}
                      onChange={e => updateFormData('companyName', e.target.value)}
                      placeholder="Ex: Nexbox Solutions"
                      className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-[#00f5d4] focus:ring-1 focus:ring-[#00f5d4] outline-none transition-all text-white placeholder:text-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Ramo de Atuação</label>
                    <input 
                      type="text" 
                      value={formData.businessType}
                      onChange={e => updateFormData('businessType', e.target.value)}
                      placeholder="Ex: Advocacia, Petshop, Consultoria..."
                      className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-[#00f5d4] focus:ring-1 focus:ring-[#00f5d4] outline-none transition-all text-white placeholder:text-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Tipo de Site</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => updateFormData('siteType', 'landing-page')}
                        className={`p-5 rounded-2xl border-2 transition-all text-left ${formData.siteType === 'landing-page' ? 'border-[#00f5d4] bg-[#00f5d4]/10 text-[#00f5d4]' : 'border-white/5 bg-white/[0.02] hover:border-white/20'}`}
                      >
                        <div className="font-bold mb-1">Landing Page</div>
                        <div className="text-[10px] opacity-70 uppercase tracking-widest">Página única</div>
                      </button>
                      <button 
                        onClick={() => updateFormData('siteType', 'multi-page')}
                        className={`p-5 rounded-2xl border-2 transition-all text-left ${formData.siteType === 'multi-page' ? 'border-[#00f5d4] bg-[#00f5d4]/10 text-[#00f5d4]' : 'border-white/5 bg-white/[0.02] hover:border-white/20'}`}
                      >
                        <div className="font-bold mb-1">Multipáginas</div>
                        <div className="text-[10px] opacity-70 uppercase tracking-widest">Várias páginas</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <h2 className="text-3xl font-display font-bold">Estilo Visual</h2>
                <div className="grid gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Qual estilo mais te agrada?</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['Moderno', 'Minimalista', 'Corporativo', 'Criativo'].map(s => (
                        <button 
                          key={s}
                          onClick={() => updateFormData('style', s.toLowerCase())}
                          className={`p-5 rounded-2xl border-2 transition-all ${formData.style === s.toLowerCase() ? 'border-[#00f5d4] bg-[#00f5d4]/10 text-[#00f5d4]' : 'border-white/5 bg-white/[0.02] hover:border-white/20'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Logo e Fotos da Empresa</label>
                    <div {...getRootProps()} className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:border-[#00f5d4] transition-colors cursor-pointer bg-white/[0.02]">
                      <input {...getInputProps()} />
                      <Upload className="mx-auto mb-3 text-white/20" />
                      <p className="text-sm text-white/40">Arraste sua logo e fotos ou clique para selecionar</p>
                      {files.assets && <p className="mt-3 text-xs font-bold text-[#00f5d4]">{files.assets.length} arquivos selecionados</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                <h2 className="text-3xl font-display font-bold">Conteúdo do Site</h2>
                <div className="grid gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Serviços/Produtos</label>
                    <textarea 
                      value={formData.services}
                      onChange={e => updateFormData('services', e.target.value)}
                      className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/10 h-32 outline-none focus:border-[#00f5d4] focus:ring-1 focus:ring-[#00f5d4] text-white placeholder:text-white/20"
                      placeholder="Descreva brevemente o que você oferece..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Redes Sociais e WhatsApp</label>
                    <div className="grid gap-4">
                      <input 
                        type="text" 
                        value={formData.whatsapp}
                        onChange={e => updateFormData('whatsapp', e.target.value)}
                        placeholder="WhatsApp (com DDD)"
                        className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/10 outline-none focus:border-[#00f5d4] focus:ring-1 focus:ring-[#00f5d4] text-white placeholder:text-white/20"
                      />
                      <input 
                        type="text" 
                        value={formData.socialMedia}
                        onChange={e => updateFormData('socialMedia', e.target.value)}
                        placeholder="Instagram, Facebook, LinkedIn..."
                        className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/10 outline-none focus:border-[#00f5d4] focus:ring-1 focus:ring-[#00f5d4] text-white placeholder:text-white/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-8">
                <h2 className="text-3xl font-display font-bold">Hospedagem e Domínio</h2>
                <div className="grid gap-8">
                  <div className="space-y-4">
                    <p className="text-sm font-bold uppercase tracking-widest text-white/30">Você já possui domínio e hospedagem?</p>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => updateFormData('hasHosting', 'sim')}
                        className={`flex-1 p-5 rounded-2xl border-2 transition-all ${formData.hasHosting === 'sim' ? 'border-[#00f5d4] bg-[#00f5d4]/10 text-[#00f5d4]' : 'border-white/5 bg-white/[0.02]'}`}
                      >
                        Sim, já tenho
                      </button>
                      <button 
                        onClick={() => updateFormData('hasHosting', 'nao')}
                        className={`flex-1 p-5 rounded-2xl border-2 transition-all ${formData.hasHosting === 'nao' ? 'border-[#00f5d4] bg-[#00f5d4]/10 text-[#00f5d4]' : 'border-white/5 bg-white/[0.02]'}`}
                      >
                        Não tenho
                      </button>
                    </div>
                  </div>

                  {formData.hasHosting === 'nao' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-[#00f5d4]/5 p-8 rounded-[2rem] border border-[#00f5d4]/20"
                    >
                      <h4 className="font-bold text-[#00f5d4] mb-3 flex items-center gap-2">
                        <CheckCircle2 size={20} /> Recomendação Estratégica
                      </h4>
                      <p className="text-sm text-white/60 mb-6 leading-relaxed">
                        Para garantir a entrega em 24h e performance carrier-grade, recomendamos contratar a HostGator através do nosso link de parceiro.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <a 
                          href={affiliateLink} 
                          target="_blank" 
                          className="nex-button-primary px-6 py-3 rounded-xl text-xs"
                        >
                          Contratar com Desconto
                        </a>
                        <button 
                          onClick={() => updateFormData('hasHosting', 'ajuda')}
                          className="bg-white/5 text-white border border-white/10 px-6 py-3 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors"
                        >
                          Quero ajuda com isso
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-8">
                <h2 className="text-3xl font-display font-bold">Condições e Finalização</h2>
                <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 space-y-6">
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#00f5d4]/10 flex items-center justify-center text-[#00f5d4] shrink-0">
                      <Check size={14} />
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed">Entrega em até 24h úteis após confirmação do pagamento e envio de todos os dados.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#00f5d4]/10 flex items-center justify-center text-[#00f5d4] shrink-0">
                      <Check size={14} />
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed">Valor fixo de R$500 para Landing Pages (página única).</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#00f5d4]/10 flex items-center justify-center text-[#00f5d4] shrink-0">
                      <Check size={14} />
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed">Infraestrutura otimizada para escala e conversão.</p>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Observações Extras</label>
                  <textarea 
                    value={formData.observations}
                    onChange={e => updateFormData('observations', e.target.value)}
                    placeholder="Algo mais que precisamos saber?"
                    className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/10 h-32 outline-none focus:border-[#00f5d4] focus:ring-1 focus:ring-[#00f5d4] text-white placeholder:text-white/20"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-12 flex justify-between items-center">
          <button 
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors disabled:opacity-0"
          >
            <ChevronLeft size={18} /> Voltar
          </button>
          
          {currentStep === STEPS.length - 1 ? (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="nex-button-primary px-10 py-5 rounded-2xl flex items-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Finalizar e Enviar'}
            </button>
          ) : (
            <button 
              onClick={nextStep}
              className="nex-button-primary px-10 py-5 rounded-2xl flex items-center gap-3"
            >
              Próximo Passo <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
