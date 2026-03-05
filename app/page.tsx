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
  MessageCircle,
  ChevronRight,
  Globe,
  Code2,
  Cpu
} from 'lucide-react';
import Image from 'next/image';
import BriefingForm from '@/components/BriefingForm';
import ChatWidget from '@/components/ChatWidget';

export default function LandingPage() {
  const [portfolio, setPortfolio] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/public/data')
      .then(res => res.json())
      .then(data => setPortfolio(data.portfolio || []));
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] nex-gradient">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00f5d4] rounded-xl flex items-center justify-center text-black">
              <Zap size={22} fill="currentColor" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tighter">GusDev</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
            <a href="#servico" className="hover:text-[#00f5d4] transition-colors">Soluções</a>
            <a href="#portfolio" className="hover:text-[#00f5d4] transition-colors">Cases</a>
            <a href="#incluido" className="hover:text-[#00f5d4] transition-colors">Tecnologia</a>
            <a href="#briefing" className="nex-button-primary px-8 py-3 rounded-full text-xs">Começar Projeto</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="briefing" className="pt-40 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-start">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-[#00f5d4]">
              <span className="w-2 h-2 rounded-full bg-[#00f5d4] animate-pulse" />
              Desde 2024 conectando negócios
            </div>
            <h1 className="font-display text-7xl md:text-8xl font-bold tracking-tight leading-[0.85]">
              Sites de <br /> <span className="text-[#00f5d4]">escala</span> <br /> enterprise.
            </h1>
            <p className="text-xl text-white/60 max-w-lg leading-relaxed font-light">
              Plataforma de criação acelerada para landing pages e sistemas web. Infraestrutura carrier-grade para quem busca performance e conversão.
            </p>
            
            <div className="grid grid-cols-2 gap-10 pt-6">
              <div>
                <p className="text-4xl font-display font-bold text-[#00f5d4]">99.9%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">Uptime Garantido</p>
              </div>
              <div>
                <p className="text-4xl font-display font-bold text-[#00f5d4]">24h</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">Tempo de Entrega</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <a href="#servico" className="nex-button-secondary px-8 py-4 rounded-full text-sm font-bold">Conheça as soluções</a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-[#00f5d4]/5 blur-3xl rounded-full pointer-events-none" />
            <BriefingForm />
          </motion.div>
        </div>
      </section>

      {/* Conformidade / Logos */}
      <div className="border-y border-white/5 bg-white/[0.02] py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 opacity-30 grayscale contrast-125">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase"><Shield size={16} /> LGPD Compliance</div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase"><Globe size={16} /> Global CDN</div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase"><Cpu size={16} /> AI Powered</div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase"><Code2 size={16} /> Clean Code</div>
        </div>
      </div>

      {/* Features Grid */}
      <section id="servico" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00f5d4]">Soluções</p>
            <h2 className="font-display text-5xl md:text-6xl font-bold tracking-tight">Canais digitais em escala <br /> para operações exigentes</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: Smartphone, 
                title: 'Mobile First', 
                desc: 'Sites otimizados para a palma da mão, garantindo que nenhum lead seja perdido no mobile.' 
              },
              { 
                icon: Zap, 
                title: 'Performance', 
                desc: 'Carregamento instantâneo. Usamos as tecnologias mais modernas para garantir velocidade máxima.' 
              },
              { 
                icon: Search, 
                title: 'SEO Enterprise', 
                desc: 'Estrutura técnica projetada para o Google, colocando sua marca no topo das buscas.' 
              },
              { 
                icon: Layout, 
                title: 'Design UI/UX', 
                desc: 'Interfaces intuitivas que guiam o usuário até a conversão final de forma natural.' 
              },
              { 
                icon: Code2, 
                title: 'Código Limpo', 
                desc: 'Desenvolvimento seguindo as melhores práticas, facilitando futuras expansões.' 
              },
              { 
                icon: Shield, 
                title: 'Segurança', 
                desc: 'Proteção total de dados e certificados SSL inclusos em todos os nossos projetos.' 
              },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="nex-card p-10 rounded-3xl space-y-6"
              >
                <div className="w-12 h-12 bg-[#00f5d4]/10 rounded-xl flex items-center justify-center text-[#00f5d4]">
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio / Cases */}
      <section id="portfolio" className="py-32 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00f5d4]">Casos de Uso</p>
              <h2 className="font-display text-5xl md:text-6xl font-bold tracking-tight">Soluções que transformam <br /> a operação digital</h2>
            </div>
            <a href="#briefing" className="group flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#00f5d4]">
              Ver todos os cases <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolio.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group nex-card rounded-[2rem] overflow-hidden"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image 
                    src={item.thumb} 
                    alt={item.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
                </div>
                <div className="p-8 space-y-4 relative">
                  <h4 className="text-xl font-bold">{item.title}</h4>
                  <a href={item.link} target="_blank" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#00f5d4] hover:text-white transition-colors">
                    Explorar Projeto <ArrowRight size={14} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / CTA */}
      <section id="incluido" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="nex-card p-16 md:p-24 rounded-[3rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[#00f5d4]/5 blur-[120px] pointer-events-none" />
            
            <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
              <div className="space-y-10">
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00f5d4]">Pronto para escalar?</p>
                  <h2 className="font-display text-6xl md:text-7xl font-bold tracking-tight leading-[0.9]">
                    Sua operação <br /> <span className="text-[#00f5d4]">digital</span> começa <br /> aqui.
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {[
                    'Design Exclusivo',
                    'Entrega em 24h',
                    'Suporte Premium',
                    'Otimização SEO',
                    'Botão WhatsApp',
                    'Hospedagem Inclusa'
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-white/60">
                      <div className="w-5 h-5 rounded-full bg-[#00f5d4]/10 flex items-center justify-center text-[#00f5d4]">
                        <Check size={12} />
                      </div>
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 p-12 rounded-[2.5rem] backdrop-blur-xl text-center space-y-8">
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40 line-through">De R$ 1.800,00</p>
                  <p className="text-7xl font-display font-bold text-white">R$ 500</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00f5d4]">Pagamento Único</p>
                </div>
                <p className="text-sm text-white/50 leading-relaxed">
                  Oferta limitada para as próximas 3 vagas. Garanta agora sua presença digital profissional com quem entende de escala.
                </p>
                <a href="#briefing" className="nex-button-primary block w-full py-5 rounded-2xl text-center text-lg">
                  Garantir minha vaga
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-2 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00f5d4] rounded-lg flex items-center justify-center text-black">
                  <Zap size={18} fill="currentColor" />
                </div>
                <span className="font-display font-bold text-xl tracking-tighter">GusDev</span>
              </div>
              <p className="text-white/40 text-sm max-w-sm leading-relaxed">
                Transformando a comunicação digital da sua empresa com tecnologia de ponta e design focado em resultados reais.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Links</h4>
              <ul className="space-y-4 text-sm font-medium text-white/60">
                <li><a href="#servico" className="hover:text-[#00f5d4] transition-colors">Soluções</a></li>
                <li><a href="#portfolio" className="hover:text-[#00f5d4] transition-colors">Cases</a></li>
                <li><a href="#incluido" className="hover:text-[#00f5d4] transition-colors">Tecnologia</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Contato</h4>
              <ul className="space-y-4 text-sm font-medium text-white/60">
                <li><a href="mailto:contato@gusdev.com.br" className="hover:text-[#00f5d4] transition-colors">contato@gusdev.com.br</a></li>
                <li><a href="/admin" className="hover:text-[#00f5d4] transition-colors uppercase tracking-widest text-[10px]">Painel Admin</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/20">
            <p>© 2026 GusDev - Todos os direitos reservados.</p>
            <div className="flex gap-10">
              <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            </div>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
