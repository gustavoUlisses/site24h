'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Clock, 
  Shield, 
  Check, 
  ArrowRight, 
  Star, 
  Zap,
  Layout,
  Smartphone,
  Search,
  MessageCircle
} from 'lucide-react';
import Image from 'next/image';
import BriefingForm from '@/components/BriefingForm';
import ChatWidget from '@/components/ChatWidget';

export default function LandingPage() {
  const [portfolio, setPortfolio] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/data')
      .then(res => res.json())
      .then(data => setPortfolio(data.portfolio || []));
  }, []);

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      {/* Header */}
      <nav className="fixed top-0 w-full z-40 glass border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
              <Zap size={20} />
            </div>
            <span className="font-black text-xl tracking-tighter">GusDev</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-500">
            <a href="#servico" className="hover:text-black transition-colors">Serviço</a>
            <a href="#portfolio" className="hover:text-black transition-colors">Portfólio</a>
            <a href="#incluido" className="hover:text-black transition-colors">O que inclui</a>
            <a href="#briefing" className="bg-black text-white px-6 py-3 rounded-full hover:scale-105 transition-transform">Começar Agora</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="briefing" className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest">
              <Clock size={14} /> Entrega em até 24 Horas
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9]">
              SEU SITE <br /> <span className="text-slate-300">PRONTO EM</span> <br /> RECORDE.
            </h1>
            <p className="text-xl text-slate-500 max-w-lg leading-relaxed">
              Design moderno, alta conversão e performance extrema. Tudo o que seu negócio precisa para dominar a internet por um preço justo.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-slate-100">
                    <Image src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" width={48} height={48} referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex text-yellow-400 mb-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="font-bold">+500 clientes satisfeitos</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <BriefingForm />
          </motion.div>
        </div>
      </section>

      {/* Stats / Why Us */}
      <section id="servico" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-black border border-black/5">
                <Clock size={28} />
              </div>
              <h3 className="text-2xl font-bold">Entrega em 24h</h3>
              <p className="text-slate-500">Tempo é dinheiro. Nosso fluxo otimizado com I.A permite entregar sites profissionais em tempo recorde.</p>
            </div>
            <div className="space-y-4">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-black border border-black/5">
                <Layout size={28} />
              </div>
              <h3 className="text-2xl font-bold">Design Moderno</h3>
              <p className="text-slate-500">Nada de templates genéricos. Criamos interfaces que respiram sua marca e atraem seu cliente ideal.</p>
            </div>
            <div className="space-y-4">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-black border border-black/5">
                <Shield size={28} />
              </div>
              <h3 className="text-2xl font-bold">Valor Único R$500</h3>
              <p className="text-slate-500">Transparência total. Sem taxas escondidas para sua Landing Page profissional de alta performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight">VEJA COMO PODE <br /> FICAR SEU SITE</h2>
              <p className="text-slate-500 max-w-md">Projetos reais entregues para clientes que decidiram profissionalizar sua presença digital.</p>
            </div>
            <a href="#briefing" className="group flex items-center gap-2 font-bold uppercase tracking-widest text-sm">
              Quero um site assim <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolio.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100"
              >
                <Image 
                  src={item.thumb} 
                  alt={item.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                  <h4 className="text-white font-bold text-xl mb-2">{item.title}</h4>
                  <a href={item.link} target="_blank" className="text-white/70 text-sm flex items-center gap-2 hover:text-white transition-colors">
                    Ver Projeto <ArrowRight size={14} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section id="incluido" className="py-24 bg-black text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <Zap size={800} className="text-white" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl md:text-7xl font-black tracking-tight">TUDO O QUE <br /> ESTÁ INCLUSO</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { icon: Smartphone, text: 'Site 100% Responsivo' },
                  { icon: Zap, text: 'Performance Extrema' },
                  { icon: Search, text: 'Otimizado para Google' },
                  { icon: MessageCircle, text: 'Botão de WhatsApp' },
                  { icon: Shield, text: 'Hospedagem Grátis (1 mês)' },
                  { icon: Star, text: 'Design Exclusivo' },
                  { icon: Rocket, text: 'Lançamento em 24h' },
                  { icon: Check, text: 'Suporte Dedicado' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <item.icon className="text-emerald-400" size={20} />
                    <span className="font-bold text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass p-12 rounded-[3rem] border-white/10 text-black bg-white">
              <div className="inline-flex px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                Oferta Especial Limitada
              </div>
              <h3 className="text-4xl font-black mb-4">DE R$ 1.800 POR</h3>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-6xl font-black">R$ 500</span>
                <span className="text-slate-400 font-bold">/único</span>
              </div>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Aproveite nossa tecnologia de ponta para ter um site profissional pelo preço de um jantar. Válido apenas para as próximas 5 vagas da semana.
              </p>
              <a href="#briefing" className="block w-full bg-black text-white py-5 rounded-2xl text-center font-bold text-lg hover:scale-[1.02] transition-transform">
                GARANTIR MINHA VAGA
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
              <Zap size={16} />
            </div>
            <span className="font-black text-lg tracking-tighter">GusDev</span>
          </div>
          <p className="text-slate-400 text-sm">© 2026 GusDev - Todos os direitos reservados.</p>
          <div className="flex gap-6 text-slate-400">
            <a href="/admin" className="hover:text-black transition-colors text-xs font-bold uppercase tracking-widest">Admin</a>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
