import React, { useState } from 'react';
import { User, PlanTier, UserRole } from '../types';
import { Save, User as UserIcon, Building2, CreditCard, Shield, Lock, Star, ChevronRight, Cpu } from 'lucide-react';

interface SettingsProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    companyName: user.companyName || ''
  });
  const [successMsg, setSuccessMsg] = useState('');

  const isVip = user.plan.includes('VIP');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ ...user, ...formData });
    setSuccessMsg('Dados sincronizados com sucesso.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const PlanCard = () => (
    <div className="bg-gradient-to-br from-zinc-900 to-black text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl border border-white/10 group">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      
      {/* Neon border glow */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-cyan-400 text-xs font-mono uppercase tracking-widest mb-2">Plano Ativo</p>
            <h3 className="text-3xl font-black tracking-tight">{user.plan === PlanTier.FREE ? 'BASIC' : user.plan === PlanTier.STANDARD ? 'STANDARD' : 'VIP NICHE'}</h3>
          </div>
          {isVip ? (
            <div className="bg-amber-500/10 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Star className="w-3 h-3 fill-current" /> ELITE
            </div>
          ) : (
            <span className="bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-xs font-bold border border-white/5">GRATUITO</span>
          )}
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <CheckIcon /> Acesso ao Terminal e Database
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
             <CheckIcon /> {isVip ? 'Multi-Operadores (Ilimitado)' : 'Até 3 Operadores'}
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
             <CheckIcon /> {isVip ? 'IA Neural Preditiva v2.0' : 'Relatórios Estáticos'}
          </div>
        </div>

        {!isVip && (
          <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            Solicitar Acesso VIP
          </button>
        )}
      </div>
      
      {/* Decorative Circles */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-violet-500/10 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );

  const CheckIcon = () => (
    <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
      <div className="w-1.5 h-2.5 border-r-2 border-b-2 border-cyan-400 rotate-45 mb-0.5"></div>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto pb-12">
      <div className="mb-10 flex items-center gap-4">
        <div className="p-3 bg-zinc-900 rounded-xl border border-white/10">
           <SettingsIcon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Configurações do Sistema</h1>
          <p className="text-slate-400 text-sm mt-1">Gerencie parâmetros de conta e segurança.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Form */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Personal Info */}
          <div className="bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/5 p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
              <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20">
                <UserIcon className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-xl text-white">Dados do Operador</h2>
            </div>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nome Completo</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-white outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">E-mail</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-white outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contato</label>
                  <input 
                    type="text" 
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-white outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nível de Acesso</label>
                  <input 
                    type="text" 
                    value={user.role}
                    disabled
                    className="w-full px-4 py-3 bg-white/5 border border-white/5 text-slate-400 rounded-xl cursor-not-allowed uppercase font-mono tracking-wide"
                  />
                </div>
              </div>
              
              <div className="pt-6 flex items-center justify-between">
                {successMsg && (
                  <div className="flex items-center gap-2 text-green-400 text-sm font-bold bg-green-400/10 px-3 py-1 rounded-full animate-in fade-in">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    {successMsg}
                  </div>
                )}
                <div className="flex-1"></div>
                <button type="submit" className="flex items-center gap-2 bg-white text-black hover:bg-slate-200 px-8 py-3 rounded-xl font-bold shadow-lg transition-all">
                  <Save className="w-4 h-4" /> Salvar
                </button>
              </div>
            </form>
          </div>

          {/* Company Info */}
          <div className="bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/5 p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
               <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400 border border-violet-500/20">
                 <Building2 className="w-5 h-5" />
               </div>
               <div>
                 <h2 className="font-bold text-xl text-white">Entidade Corporativa</h2>
               </div>
            </div>
            
            <div className="space-y-6">
               <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Razão Social</label>
                  <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-white outline-none transition-all"
                  />
               </div>
               <div className="bg-black/30 p-6 rounded-2xl border border-dashed border-white/10 flex items-center gap-4 hover:border-cyan-500/30 transition-colors cursor-pointer group">
                  <div className="p-3 bg-zinc-900 rounded-xl text-slate-400 group-hover:text-cyan-400 transition-colors">
                    {isVip ? <Building2 className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors">Identidade Visual</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {isVip ? 'Upload de assets para branding do sistema.' : 'Recurso bloqueado para nível BASIC.'}
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column - Plan & Security */}
        <div className="space-y-8">
          <PlanCard />

          <div className="bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/5 p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-white">Segurança</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full flex justify-between items-center p-4 bg-black/40 hover:bg-white/5 border border-white/5 hover:border-cyan-500/30 rounded-xl group transition-all text-left">
                <span className="text-sm font-medium text-slate-300 group-hover:text-white">Redefinir Credenciais</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
              </button>
              <button className="w-full flex justify-between items-center p-4 bg-black/40 hover:bg-white/5 border border-white/5 hover:border-cyan-500/30 rounded-xl group transition-all text-left">
                 <div>
                   <span className="block text-sm font-medium text-slate-300 group-hover:text-white">Autenticação Biométrica</span>
                   <span className="text-[10px] text-cyan-500 uppercase font-bold tracking-wider">Recomendado</span>
                 </div>
                 <div className="w-10 h-6 bg-zinc-800 rounded-full relative border border-white/10">
                   <div className="w-4 h-4 bg-slate-500 rounded-full absolute left-1 top-1"></div>
                 </div>
              </button>
            </div>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/5 p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-5 h-5 text-slate-400" />
              <h3 className="font-bold text-white">Faturamento</h3>
            </div>
            <div className="flex items-center gap-4 p-4 bg-black/40 rounded-xl border border-white/5 mb-4">
               <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full opacity-80 -mr-1"></div>
                  <div className="w-3 h-3 bg-orange-500 rounded-full opacity-80"></div>
               </div>
               <span className="font-mono text-slate-300">•••• 8821</span>
            </div>
            <button className="text-xs text-cyan-400 font-bold hover:text-cyan-300 uppercase tracking-wider">Atualizar Método</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper icon
function SettingsIcon(props: any) {
  return <Cpu {...props} />
}

export default Settings;