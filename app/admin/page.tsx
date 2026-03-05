'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Download, 
  Trash2, 
  Plus,
  MessageSquare,
  Send,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  ChevronRight,
  ChevronDown,
  Zap,
  X
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';

import Image from 'next/image';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('admin_token');
    }
    return false;
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('briefings');
  const [data, setData] = useState<any>({ briefings: [], portfolio: [], settings: { affiliateLink: '' } });
  const [selectedBriefing, setSelectedBriefing] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeChatUser, setActiveChatUser] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    const res = await fetch('/api/admin/data');
    const d = await res.json();
    setData(d);
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    }

    const socket = io();
    socketRef.current = socket;

    socket.on('admin_notification', (msg) => {
      // In a real app, show a toast or notification
      console.log('New message from user:', msg);
    });

    socket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, activeChatUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const d = await res.json();
    if (d.success) {
      localStorage.setItem('admin_token', d.token);
      setIsLoggedIn(true);
      fetchData();
    } else {
      alert(d.message);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/briefing/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchData();
  };

  const addPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const item = Object.fromEntries(formData.entries());
    await fetch('/api/admin/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    fetchData();
    form.reset();
  };

  const deletePortfolio = async (id: string) => {
    await fetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const updateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const settings = Object.fromEntries(formData.entries());
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    fetchData();
    alert('Configurações salvas!');
  };

  const sendAdminMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChatUser || !socketRef.current) return;

    const msgData = {
      sender: 'admin',
      userId: activeChatUser,
      text: chatInput,
    };

    socketRef.current.emit('send_message', msgData);
    setChatInput('');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 nex-gradient">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md nex-card p-10 rounded-[2.5rem] shadow-2xl border border-white/10 backdrop-blur-xl"
        >
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-[#00f5d4]/10 rounded-2xl flex items-center justify-center text-[#00f5d4] mb-4">
              <Zap size={32} />
            </div>
            <h1 className="font-display font-bold text-2xl tracking-tight">Nexbox Admin</h1>
            <p className="text-white/30 text-xs uppercase tracking-[0.2em] font-bold mt-2">Acesso Restrito</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">E-mail de Acesso</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/10 outline-none focus:border-[#00f5d4] transition-all text-white placeholder:text-white/20"
                placeholder="admin@nexbox.com.br"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/10 outline-none focus:border-[#00f5d4] transition-all text-white placeholder:text-white/20"
                placeholder="••••••••"
              />
            </div>
            <button className="nex-button-primary w-full py-5 rounded-2xl font-bold">
              Entrar no Sistema
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex text-white font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col">
        <div className="p-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00f5d4]/10 rounded-xl flex items-center justify-center text-[#00f5d4]">
            <Zap size={20} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Nexbox</span>
        </div>
        
        <nav className="flex-1 px-6 space-y-2">
          {[
            { id: 'briefings', label: 'Briefings', icon: Briefcase },
            { id: 'portfolio', label: 'Portfólio', icon: LayoutDashboard },
            { id: 'chat', label: 'Chat Suporte', icon: MessageSquare },
            { id: 'settings', label: 'Configurações', icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-[#00f5d4] text-black shadow-[0_0_20px_rgba(0,245,212,0.3)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={() => { localStorage.removeItem('admin_token'); setIsLoggedIn(false); }}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={20} />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display font-bold tracking-tight capitalize">{activeTab}</h1>
            <p className="text-white/30 mt-2 font-light">Gerencie sua operação com alta performance.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#00f5d4] animate-pulse" />
              Sistemas Operacionais
            </div>
          </div>
        </header>

        {activeTab === 'briefings' && (
          <div className="space-y-10">
            <div className="grid grid-cols-4 gap-8">
              {[
                { label: 'Total Projetos', value: data.briefings.length, icon: Briefcase, color: '#00f5d4' },
                { label: 'Aguardando', value: data.briefings.filter((b: any) => b.status === 'a pagar').length, icon: Clock, color: '#f59e0b' },
                { label: 'Em Produção', value: data.briefings.filter((b: any) => b.status === 'desenvolvendo').length, icon: Zap, color: '#6366f1' },
                { label: 'Finalizados', value: data.briefings.filter((b: any) => b.status === 'entregue').length, icon: CheckCircle2, color: '#10b981' },
              ].map((stat, i) => (
                <div key={i} className="nex-card p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                    <stat.icon size={24} />
                  </div>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                  <p className="text-4xl font-display font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="nex-card rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden backdrop-blur-xl">
              <table className="w-full text-left">
                <thead className="bg-white/[0.02] border-b border-white/5">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Cliente / Empresa</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Tipo / Estilo</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Status Operacional</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Data</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.briefings.map((b: any) => (
                    <tr key={b.id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="px-8 py-6">
                        <p className="font-bold text-white/90">{b.companyName}</p>
                        <p className="text-xs text-white/30 mt-1">{b.businessType}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-medium text-white/70">{b.siteType}</p>
                        <p className="text-[10px] text-[#00f5d4] uppercase tracking-widest mt-1">{b.style}</p>
                      </td>
                      <td className="px-8 py-6">
                        <select 
                          value={b.status}
                          onChange={(e) => updateStatus(b.id, e.target.value)}
                          className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl border-none outline-none cursor-pointer transition-all ${
                            b.status === 'entregue' ? 'bg-[#10b981]/10 text-[#10b981]' :
                            b.status === 'desenvolvendo' ? 'bg-[#6366f1]/10 text-[#6366f1]' :
                            b.status === 'a pagar' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' :
                            'bg-white/5 text-white/40'
                          }`}
                        >
                          <option value="a pagar">A Pagar</option>
                          <option value="pago">Pago</option>
                          <option value="desenvolvendo">Desenvolvendo</option>
                          <option value="aguardando cliente">Aguardando Cliente</option>
                          <option value="entregue">Entregue</option>
                        </select>
                      </td>
                      <td className="px-8 py-6 text-sm text-white/30">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => setSelectedBriefing(b)}
                          className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/30 hover:text-[#00f5d4] hover:bg-[#00f5d4]/10 transition-all"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <div className="nex-card p-10 rounded-[2.5rem] border border-white/5 shadow-xl sticky top-12">
                <h3 className="text-2xl font-display font-bold mb-8">Novo Projeto</h3>
                <form onSubmit={addPortfolio} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Título do Case</label>
                    <input name="title" required className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/10 outline-none focus:border-[#00f5d4] transition-all text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">URL do Site</label>
                    <input name="link" required className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/10 outline-none focus:border-[#00f5d4] transition-all text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Thumbnail (URL)</label>
                    <input name="thumb" required className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/10 outline-none focus:border-[#00f5d4] transition-all text-white" />
                  </div>
                  <button className="nex-button-primary w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3">
                    <Plus size={20} /> Publicar Projeto
                  </button>
                </form>
              </div>
            </div>
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
              {data.portfolio.map((p: any) => (
                <div key={p.id} className="nex-card rounded-[2.5rem] border border-white/5 shadow-xl overflow-hidden group">
                  <div className="aspect-video relative bg-white/5">
                    <Image 
                      src={p.thumb} 
                      alt={p.title} 
                      fill 
                      className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <button 
                      onClick={() => deletePortfolio(p.id)}
                      className="absolute top-6 right-6 w-10 h-10 bg-red-500/20 text-red-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl backdrop-blur-md flex items-center justify-center hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="p-8">
                    <h4 className="font-display font-bold text-lg mb-2">{p.title}</h4>
                    <a href={p.link} target="_blank" className="text-[10px] text-[#00f5d4] uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity">
                      Ver Projeto Online <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="h-[700px] nex-card rounded-[2.5rem] border border-white/5 shadow-2xl flex overflow-hidden backdrop-blur-xl">
            <div className="w-96 border-r border-white/5 flex flex-col bg-white/[0.01]">
              <div className="p-8 border-b border-white/5">
                <h3 className="font-display font-bold text-xl">Conversas</h3>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-1">Atendimento em tempo real</p>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {Array.from(new Set(messages.map(m => m.userId))).map(uid => (
                  <button
                    key={uid}
                    onClick={() => setActiveChatUser(uid)}
                    className={`w-full p-8 text-left border-b border-white/[0.02] hover:bg-white/[0.02] transition-all relative ${activeChatUser === uid ? 'bg-white/[0.03]' : ''}`}
                  >
                    {activeChatUser === uid && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00f5d4]" />}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/30">
                        <User size={24} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-white/90">{uid}</p>
                        <p className="text-xs text-white/30 truncate mt-1">
                          {messages.filter(m => m.userId === uid).slice(-1)[0]?.text}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 flex flex-col bg-[#050505]">
              {activeChatUser ? (
                <>
                  <div className="p-8 bg-white/[0.01] border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#00f5d4]/10 flex items-center justify-center text-[#00f5d4]">
                        <User size={24} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg">{activeChatUser}</h3>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4] animate-pulse" />
                          <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Sessão Ativa</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                    {messages.filter(m => m.userId === activeChatUser).map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-5 rounded-2xl text-sm ${msg.sender === 'admin' ? 'bg-[#00f5d4] text-black font-medium rounded-tr-none' : 'bg-white/5 text-white/80 rounded-tl-none border border-white/5'}`}>
                          {msg.text}
                          <p className={`text-[9px] mt-2 opacity-50 ${msg.sender === 'admin' ? 'text-black/60' : 'text-white/40'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={sendAdminMessage} className="p-8 bg-white/[0.01] border-t border-white/5 flex gap-4">
                    <div className="relative flex-1">
                      <input 
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        placeholder="Digite sua resposta estratégica..."
                        className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/10 outline-none focus:border-[#00f5d4] transition-all text-white"
                      />
                    </div>
                    <button className="nex-button-primary px-10 rounded-2xl font-bold flex items-center gap-3">
                      <Send size={20} /> Enviar
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-white/10 flex-col gap-6">
                  <div className="w-24 h-24 rounded-[2rem] bg-white/[0.02] flex items-center justify-center border border-white/5">
                    <MessageSquare size={48} />
                  </div>
                  <p className="text-xs uppercase tracking-[0.3em] font-bold">Selecione um canal de atendimento</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-3xl nex-card p-12 rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-xl">
            <h3 className="text-3xl font-display font-bold mb-10">Configurações Globais</h3>
            <form onSubmit={updateSettings} className="space-y-8">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Link de Afiliado (Hospedagem)</label>
                <input 
                  name="affiliateLink"
                  defaultValue={data.settings.affiliateLink}
                  className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/10 outline-none focus:border-[#00f5d4] transition-all text-white"
                  placeholder="https://hostgator.com.br/..."
                />
                <p className="text-xs text-white/20 mt-3 leading-relaxed">Este link será injetado dinamicamente no formulário de briefing para usuários sem infraestrutura própria.</p>
              </div>
              <button className="nex-button-primary px-10 py-5 rounded-2xl font-bold">
                Salvar Configurações
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Briefing Detail Modal */}
      <AnimatePresence>
        {selectedBriefing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#0a0a0a] w-full max-w-5xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-white/10"
            >
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div>
                  <h2 className="text-3xl font-display font-bold tracking-tight">{selectedBriefing.companyName}</h2>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold mt-1">Briefing ID: {selectedBriefing.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedBriefing(null)}
                  className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 grid md:grid-cols-2 gap-12 custom-scrollbar">
                <div className="space-y-10">
                  <section>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00f5d4] mb-6">Informações Estratégicas</h4>
                    <div className="grid gap-6">
                      <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-2">Ramo de Atuação</p>
                        <p className="font-bold text-white/90">{selectedBriefing.businessType}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                          <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-2">Tipo de Site</p>
                          <p className="font-bold text-white/90">{selectedBriefing.siteType}</p>
                        </div>
                        <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                          <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-2">Estilo Visual</p>
                          <p className="font-bold text-[#00f5d4] uppercase tracking-widest">{selectedBriefing.style}</p>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00f5d4] mb-6">Serviços e Diferenciais</h4>
                    <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5">
                      <p className="text-sm leading-relaxed text-white/60 italic">&quot;{selectedBriefing.services || 'Nenhum serviço descrito.'}&quot;</p>
                    </div>
                  </section>
                  <section>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00f5d4] mb-6">Canais de Contato</h4>
                    <div className="grid gap-6">
                      <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-2">WhatsApp</p>
                          <p className="font-bold text-white/90">{selectedBriefing.whatsapp}</p>
                        </div>
                        <a href={`https://wa.me/${selectedBriefing.whatsapp.replace(/\D/g,'')}`} target="_blank" className="w-12 h-12 bg-[#00f5d4] text-black rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                          <MessageSquare size={20} />
                        </a>
                      </div>
                      <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-2">Presença Digital</p>
                        <p className="font-bold text-white/90">{selectedBriefing.socialMedia}</p>
                      </div>
                    </div>
                  </section>
                </div>
                <div className="space-y-10">
                  <section>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00f5d4] mb-6">Ativos e Uploads</h4>
                    <div className="grid gap-4">
                      {selectedBriefing.files.map((file: any, i: number) => (
                        <div key={i} className="bg-white/[0.02] p-6 rounded-2xl flex items-center justify-between border border-white/5 hover:border-[#00f5d4]/30 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white/30 border border-white/5">
                              <Download size={20} />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-bold text-white/90 truncate w-48">{file.originalname}</p>
                              <p className="text-[9px] text-[#00f5d4] uppercase tracking-widest font-bold mt-1">{file.fieldname}</p>
                            </div>
                          </div>
                          <a 
                            href={file.url} 
                            download 
                            className="bg-white/5 text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#00f5d4] hover:text-black transition-all"
                          >
                            Baixar
                          </a>
                        </div>
                      ))}
                      {selectedBriefing.files.length === 0 && (
                        <div className="bg-white/[0.01] p-8 rounded-3xl border border-dashed border-white/10 text-center">
                          <p className="text-xs text-white/20 uppercase tracking-widest font-bold">Nenhum arquivo anexado</p>
                        </div>
                      )}
                    </div>
                  </section>
                  <section>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00f5d4] mb-6">Infraestrutura</h4>
                    <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-white/60">Hospedagem e Domínio:</span>
                        <span className={`text-[10px] font-bold px-4 py-2 rounded-xl uppercase tracking-widest ${selectedBriefing.hasHosting === 'sim' ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-red-500/10 text-red-400'}`}>
                          {selectedBriefing.hasHosting === 'sim' ? 'Possui' : 'Não Possui'}
                        </span>
                      </div>
                    </div>
                  </section>
                  <section>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00f5d4] mb-6">Observações do Cliente</h4>
                    <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5">
                      <p className="text-sm italic text-white/40 leading-relaxed">&quot;{selectedBriefing.observations || 'Sem observações adicionais.'}&quot;</p>
                    </div>
                  </section>
                </div>
              </div>
              <div className="p-10 bg-white/[0.02] border-t border-white/5 flex justify-end gap-6">
                <button 
                  onClick={() => setSelectedBriefing(null)}
                  className="px-10 py-5 rounded-2xl font-bold text-white/30 hover:text-white transition-colors"
                >
                  Fechar Detalhes
                </button>
                <button 
                  onClick={() => updateStatus(selectedBriefing.id, 'desenvolvendo')}
                  className="nex-button-primary px-10 py-5 rounded-2xl font-bold"
                >
                  Iniciar Produção
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
