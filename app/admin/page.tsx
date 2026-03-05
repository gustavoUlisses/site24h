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
  Zap
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100"
        >
          <div className="flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
              <LayoutDashboard size={20} />
            </div>
            <span className="font-black text-xl tracking-tighter">GusDev Admin</span>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-black"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
              />
            </div>
            <button className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:scale-[1.02] transition-transform">
              Entrar no Painel
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-8 flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
            <LayoutDashboard size={16} />
          </div>
          <span className="font-black text-lg tracking-tighter">GusDev</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'briefings', label: 'Briefings', icon: Briefcase },
            { id: 'portfolio', label: 'Portfólio', icon: LayoutDashboard },
            { id: 'chat', label: 'Chat Suporte', icon: MessageSquare },
            { id: 'settings', label: 'Configurações', icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === item.id ? 'bg-black text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => { localStorage.removeItem('admin_token'); setIsLoggedIn(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight capitalize">{activeTab}</h1>
            <p className="text-slate-500">Gerencie seu negócio de criação de sites.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Sistema Online
            </div>
          </div>
        </header>

        {activeTab === 'briefings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: 'Total', value: data.briefings.length, icon: Briefcase, color: 'blue' },
                { label: 'Aguardando', value: data.briefings.filter((b: any) => b.status === 'a pagar').length, icon: Clock, color: 'amber' },
                { label: 'Em Produção', value: data.briefings.filter((b: any) => b.status === 'desenvolvendo').length, icon: Zap, color: 'indigo' },
                { label: 'Entregues', value: data.briefings.filter((b: any) => b.status === 'entregue').length, icon: CheckCircle2, color: 'emerald' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-4`}>
                    <stat.icon size={20} />
                  </div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-black">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Cliente / Empresa</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Tipo / Estilo</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Data</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.briefings.map((b: any) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold">{b.companyName}</p>
                        <p className="text-xs text-slate-400">{b.businessType}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium">{b.siteType}</p>
                        <p className="text-xs text-slate-400 capitalize">{b.style}</p>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={b.status}
                          onChange={(e) => updateStatus(b.id, e.target.value)}
                          className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border-none outline-none cursor-pointer ${
                            b.status === 'entregue' ? 'bg-emerald-100 text-emerald-700' :
                            b.status === 'desenvolvendo' ? 'bg-indigo-100 text-indigo-700' :
                            b.status === 'a pagar' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <option value="a pagar">A Pagar</option>
                          <option value="pago">Pago</option>
                          <option value="desenvolvendo">Desenvolvendo</option>
                          <option value="aguardando cliente">Aguardando Cliente</option>
                          <option value="entregue">Entregue</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedBriefing(b)}
                          className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          <ChevronRight size={18} />
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
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm sticky top-10">
                <h3 className="text-xl font-bold mb-6">Adicionar Projeto</h3>
                <form onSubmit={addPortfolio} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase tracking-widest text-slate-400">Título</label>
                    <input name="title" required className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase tracking-widest text-slate-400">Link</label>
                    <input name="link" required className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase tracking-widest text-slate-400">Thumbnail URL</label>
                    <input name="thumb" required className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-black" />
                  </div>
                  <button className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                    <Plus size={18} /> Adicionar
                  </button>
                </form>
              </div>
            </div>
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              {data.portfolio.map((p: any) => (
                <div key={p.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group">
                  <div className="aspect-video relative bg-slate-100">
                    <Image 
                      src={p.thumb} 
                      alt={p.title} 
                      fill 
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      onClick={() => deletePortfolio(p.id)}
                      className="absolute top-4 right-4 p-2 bg-white/90 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold mb-1">{p.title}</h4>
                    <a href={p.link} target="_blank" className="text-xs text-slate-400 flex items-center gap-1 hover:text-black">
                      {p.link} <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="h-[600px] bg-white rounded-[2rem] border border-slate-100 shadow-sm flex overflow-hidden">
            <div className="w-80 border-r border-slate-100 flex flex-col">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold">Conversas Ativas</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                {/* List of unique users who sent messages */}
                {Array.from(new Set(messages.map(m => m.userId))).map(uid => (
                  <button
                    key={uid}
                    onClick={() => setActiveChatUser(uid)}
                    className={`w-full p-6 text-left border-b border-slate-50 hover:bg-slate-50 transition-colors ${activeChatUser === uid ? 'bg-slate-50 border-l-4 border-l-black' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{uid}</p>
                        <p className="text-xs text-slate-400 truncate w-40">
                          {messages.filter(m => m.userId === uid).slice(-1)[0]?.text}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 flex flex-col bg-slate-50/30">
              {activeChatUser ? (
                <>
                  <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <h3 className="font-bold">{activeChatUser}</h3>
                    </div>
                  </div>
                  <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.filter(m => m.userId === activeChatUser).map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${msg.sender === 'admin' ? 'bg-black text-white rounded-tr-none' : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'}`}>
                          {msg.text}
                          <p className={`text-[10px] mt-1 ${msg.sender === 'admin' ? 'text-white/50' : 'text-slate-400'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={sendAdminMessage} className="p-6 bg-white border-t border-slate-100 flex gap-4">
                    <input 
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      placeholder="Digite sua resposta..."
                      className="flex-1 p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-black"
                    />
                    <button className="bg-black text-white px-8 rounded-2xl font-bold flex items-center gap-2">
                      <Send size={18} /> Enviar
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-4">
                  <MessageSquare size={48} className="opacity-20" />
                  <p>Selecione uma conversa para começar</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-2xl font-bold mb-8">Configurações do Sistema</h3>
            <form onSubmit={updateSettings} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Link de Afiliado (Hospedagem)</label>
                <input 
                  name="affiliateLink"
                  defaultValue={data.settings.affiliateLink}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-black"
                  placeholder="https://..."
                />
                <p className="text-xs text-slate-400 mt-2">Este link será exibido no formulário de briefing quando o cliente não tiver hospedagem.</p>
              </div>
              <button className="bg-black text-white px-8 py-4 rounded-2xl font-bold hover:scale-[1.02] transition-transform">
                Salvar Alterações
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
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-2xl font-black">{selectedBriefing.companyName}</h2>
                  <p className="text-slate-500">Detalhes do Briefing #{selectedBriefing.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedBriefing(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <Trash2 size={24} className="text-slate-400" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <section>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Informações Básicas</h4>
                    <div className="grid gap-4">
                      <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-xs text-slate-400 mb-1">Ramo de Atuação</p>
                        <p className="font-bold">{selectedBriefing.businessType}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl">
                          <p className="text-xs text-slate-400 mb-1">Tipo de Site</p>
                          <p className="font-bold">{selectedBriefing.siteType}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl">
                          <p className="text-xs text-slate-400 mb-1">Estilo Visual</p>
                          <p className="font-bold capitalize">{selectedBriefing.style}</p>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Conteúdo e Serviços</h4>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-sm leading-relaxed">{selectedBriefing.services || 'Nenhum serviço descrito.'}</p>
                    </div>
                  </section>
                  <section>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Contato e Redes</h4>
                    <div className="grid gap-4">
                      <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-400 mb-1">WhatsApp</p>
                          <p className="font-bold">{selectedBriefing.whatsapp}</p>
                        </div>
                        <a href={`https://wa.me/${selectedBriefing.whatsapp.replace(/\D/g,'')}`} target="_blank" className="p-2 bg-emerald-500 text-white rounded-xl">
                          <MessageSquare size={16} />
                        </a>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-xs text-slate-400 mb-1">Redes Sociais</p>
                        <p className="font-bold">{selectedBriefing.socialMedia}</p>
                      </div>
                    </div>
                  </section>
                </div>
                <div className="space-y-8">
                  <section>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Arquivos e Uploads</h4>
                    <div className="grid gap-4">
                      {selectedBriefing.files.map((file: any, i: number) => (
                        <div key={i} className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                              <Download size={18} />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-bold truncate w-40">{file.originalname}</p>
                              <p className="text-[10px] text-slate-400 uppercase">{file.fieldname}</p>
                            </div>
                          </div>
                          <a 
                            href={file.url} 
                            download 
                            className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-transform"
                          >
                            Baixar
                          </a>
                        </div>
                      ))}
                      {selectedBriefing.files.length === 0 && (
                        <p className="text-sm text-slate-400 italic">Nenhum arquivo enviado.</p>
                      )}
                    </div>
                  </section>
                  <section>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Infraestrutura</h4>
                    <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Hospedagem:</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${selectedBriefing.hasHosting === 'sim' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {selectedBriefing.hasHosting === 'sim' ? 'SIM' : 'NÃO'}
                        </span>
                      </div>
                    </div>
                  </section>
                  <section>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Observações</h4>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-sm italic text-slate-600">&quot;{selectedBriefing.observations || 'Sem observações.'}&quot;</p>
                    </div>
                  </section>
                </div>
              </div>
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                <button 
                  onClick={() => setSelectedBriefing(null)}
                  className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  Fechar
                </button>
                <button 
                  onClick={() => updateStatus(selectedBriefing.id, 'desenvolvendo')}
                  className="bg-black text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform"
                >
                  Iniciar Desenvolvimento
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
