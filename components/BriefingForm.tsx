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
      <div className="text-center py-20 px-6 glass rounded-3xl border border-black/5 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} />
        </div>
        <h2 className="text-3xl font-bold mb-4">Briefing Recebido!</h2>
        <p className="text-slate-600 mb-8">
          Excelente! Já recebemos suas informações. Em instantes entraremos em contato via WhatsApp para confirmar os detalhes e iniciar a criação do seu site.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
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
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Passo {currentStep + 1} de {STEPS.length}
          </span>
          <span className="text-xs font-bold text-black">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-black"
          />
        </div>
      </div>

      <div className="glass rounded-3xl border border-black/5 p-8 shadow-xl relative overflow-hidden">
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
              <div className="space-y-6">
                <div className="inline-flex p-3 bg-black text-white rounded-2xl mb-4">
                  <Info size={24} />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Vamos criar seu site incrível?</h2>
                <p className="text-slate-600 leading-relaxed">
                  Para entregarmos seu site em até 24h, precisamos de algumas informações estratégicas. Fique tranquilo, é rápido e direto ao ponto.
                </p>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-4 items-start">
                  <AlertCircle className="text-slate-400 shrink-0" size={20} />
                  <p className="text-sm text-slate-500 italic">
                    &quot;A psicologia por trás de um bom site começa com um briefing bem feito. Vamos nessa?&quot;
                  </p>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Dados da Empresa</h2>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Nome da Empresa</label>
                    <input 
                      type="text" 
                      value={formData.companyName}
                      onChange={e => updateFormData('companyName', e.target.value)}
                      placeholder="Ex: GusDev Solutions"
                      className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Ramo de Atuação</label>
                    <input 
                      type="text" 
                      value={formData.businessType}
                      onChange={e => updateFormData('businessType', e.target.value)}
                      placeholder="Ex: Advocacia, Petshop, Consultoria..."
                      className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Tipo de Site</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => updateFormData('siteType', 'landing-page')}
                        className={`p-4 rounded-2xl border-2 transition-all text-left ${formData.siteType === 'landing-page' ? 'border-black bg-black text-white' : 'border-slate-100 bg-slate-50 hover:border-slate-300'}`}
                      >
                        <div className="font-bold mb-1">Landing Page</div>
                        <div className="text-xs opacity-70">Página única de conversão</div>
                      </button>
                      <button 
                        onClick={() => updateFormData('siteType', 'multi-page')}
                        className={`p-4 rounded-2xl border-2 transition-all text-left ${formData.siteType === 'multi-page' ? 'border-black bg-black text-white' : 'border-slate-100 bg-slate-50 hover:border-slate-300'}`}
                      >
                        <div className="font-bold mb-1">Multipáginas</div>
                        <div className="text-xs opacity-70">Várias páginas (Home, Sobre, etc)</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Estilo Visual</h2>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Qual estilo mais te agrada?</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['Moderno', 'Minimalista', 'Corporativo', 'Criativo'].map(s => (
                        <button 
                          key={s}
                          onClick={() => updateFormData('style', s.toLowerCase())}
                          className={`p-4 rounded-2xl border-2 transition-all ${formData.style === s.toLowerCase() ? 'border-black bg-black text-white' : 'border-slate-100 bg-slate-50 hover:border-slate-300'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Logo e Fotos da Empresa</label>
                    <div {...getRootProps()} className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-black transition-colors cursor-pointer bg-slate-50">
                      <input {...getInputProps()} />
                      <Upload className="mx-auto mb-2 text-slate-400" />
                      <p className="text-sm text-slate-500">Arraste sua logo e fotos ou clique para selecionar</p>
                      {files.assets && <p className="mt-2 text-xs font-bold text-emerald-600">{files.assets.length} arquivos selecionados</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Conteúdo do Site</h2>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Serviços/Produtos (Descreva brevemente)</label>
                    <textarea 
                      value={formData.services}
                      onChange={e => updateFormData('services', e.target.value)}
                      className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 h-24 outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Redes Sociais e WhatsApp</label>
                    <input 
                      type="text" 
                      value={formData.whatsapp}
                      onChange={e => updateFormData('whatsapp', e.target.value)}
                      placeholder="WhatsApp (com DDD)"
                      className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-2 outline-none focus:ring-2 focus:ring-black"
                    />
                    <input 
                      type="text" 
                      value={formData.socialMedia}
                      onChange={e => updateFormData('socialMedia', e.target.value)}
                      placeholder="Instagram, Facebook, LinkedIn..."
                      className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Horário e Endereço</label>
                    <input 
                      type="text" 
                      value={formData.address}
                      onChange={e => updateFormData('address', e.target.value)}
                      placeholder="Endereço completo (ou 'Online')"
                      className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-2 outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Hospedagem e Domínio</h2>
                <div className="grid gap-6">
                  <div className="space-y-4">
                    <p className="text-sm font-semibold">Você já possui domínio e hospedagem?</p>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => updateFormData('hasHosting', 'sim')}
                        className={`flex-1 p-4 rounded-2xl border-2 transition-all ${formData.hasHosting === 'sim' ? 'border-black bg-black text-white' : 'border-slate-100 bg-slate-50'}`}
                      >
                        Sim, já tenho
                      </button>
                      <button 
                        onClick={() => updateFormData('hasHosting', 'nao')}
                        className={`flex-1 p-4 rounded-2xl border-2 transition-all ${formData.hasHosting === 'nao' ? 'border-black bg-black text-white' : 'border-slate-100 bg-slate-50'}`}
                      >
                        Não tenho
                      </button>
                    </div>
                  </div>

                  {formData.hasHosting === 'nao' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100"
                    >
                      <h4 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                        <CheckCircle2 size={18} /> Recomendação Especial
                      </h4>
                      <p className="text-sm text-emerald-700 mb-4">
                        Para garantir a entrega em 24h e performance máxima, recomendamos contratar a HostGator através do nosso link de parceiro (você ganha desconto!).
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <a 
                          href="https://www.hostgator.com.br/afiliados" 
                          target="_blank" 
                          className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors"
                        >
                          Contratar com Desconto
                        </a>
                        <button 
                          onClick={() => updateFormData('hasHosting', 'ajuda')}
                          className="bg-white text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl text-sm font-bold"
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
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Condições e Finalização</h2>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                    <p className="text-sm text-slate-600">Entrega em até 24h úteis após confirmação do pagamento e envio de todos os dados.</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                    <p className="text-sm text-slate-600">Valor fixo de R$500 para Landing Pages (página única).</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                    <p className="text-sm text-slate-600">Suporte via WhatsApp incluso por 30 dias.</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Observações Extras</label>
                  <textarea 
                    value={formData.observations}
                    onChange={e => updateFormData('observations', e.target.value)}
                    placeholder="Algo mais que precisamos saber?"
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 h-24 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-10 flex justify-between items-center">
          <button 
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-black transition-colors disabled:opacity-0"
          >
            <ChevronLeft size={18} /> Voltar
          </button>
          
          {currentStep === STEPS.length - 1 ? (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-black text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Enviar Briefing'}
            </button>
          ) : (
            <button 
              onClick={nextStep}
              className="bg-black text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
            >
              Próximo Passo <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
