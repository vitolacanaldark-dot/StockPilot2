import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, Smartphone, ChevronDown, Cpu, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.OWNER);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      if (step === 'email') {
        setStep('otp');
      } else {
        onLogin(selectedRole);
      }
    }, 1500);
  };

  const handleSocialLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onLogin(UserRole.OWNER);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-black text-slate-200 overflow-hidden relative selection:bg-cyan-500/30">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-violet-900/10 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[100px]"></div>
         {/* Grid effect */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>
      </div>

      {/* Left Side - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 items-center justify-center p-12">
        <div className="relative max-w-xl">
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
             <span className="text-xs font-mono text-cyan-300 tracking-widest uppercase">Sistema Operacional v2.0</span>
          </div>
          
          <h1 className="text-6xl font-black text-white mb-6 leading-tight tracking-tight">
            Gestão <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">Inteligente</span><br/>do Futuro.
          </h1>
          
          <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-md">
            O StockPilot utiliza IA neural para prever demandas e otimizar seu estoque em tempo real. Bem-vindo à nova era do varejo.
          </p>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl hover:border-cyan-500/30 transition-colors group">
                <Cpu className="w-8 h-8 text-cyan-500 mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-white mb-1">IA Preditiva</h3>
                <p className="text-sm text-slate-500">Análise de dados em tempo real para decisões instantâneas.</p>
             </div>
             <div className="p-6 bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl hover:border-violet-500/30 transition-colors group">
                <ShieldCheck className="w-8 h-8 text-violet-500 mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-white mb-1">Segurança Militar</h3>
                <p className="text-sm text-slate-500">Criptografia de ponta a ponta e controle de acesso biométrico.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="max-w-md w-full bg-zinc-950/80 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
          {/* Top border glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
          
          <div className="mb-8">
             <div className="w-14 h-14 bg-gradient-to-tr from-cyan-900/30 to-violet-900/30 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
               <Cpu className="w-7 h-7 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
             </div>
             <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Identificação</h2>
             <p className="text-slate-500">Acesse o terminal de comando.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 'email' ? (
              <div className="space-y-5">
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">E-mail Corporativo</label>
                   <div className="relative group">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
                     <input 
                       type="email" 
                       required
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-white/10 rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder:text-slate-700 outline-none transition-all"
                       placeholder="agente@stockpilot.co"
                     />
                   </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nível de Acesso (Demo)</label>
                    <div className="relative group">
                      <select 
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                        className="w-full appearance-none pl-4 pr-10 py-3.5 bg-black/50 border border-white/10 rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-white outline-none transition-all cursor-pointer hover:bg-white/5"
                      >
                        <option value={UserRole.OWNER}>Comandante (Owner)</option>
                        <option value={UserRole.MANAGER}>Oficial (Manager)</option>
                        <option value={UserRole.CASHIER}>Operador (Cashier)</option>
                        <option value={UserRole.VIEWER}>Observador (Viewer)</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 pointer-events-none group-hover:text-cyan-400 transition-colors" />
                    </div>
                 </div>

                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2 group relative overflow-hidden"
                 >
                   <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                   {loading ? (
                     <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                   ) : (
                     <>
                       <span className="relative z-10">Autenticar</span>
                       <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                     </>
                   )}
                 </button>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                 <div className="text-center">
                   <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                      <Mail className="w-8 h-8 text-cyan-400" />
                   </div>
                   <p className="text-sm text-slate-400">Token enviado para <span className="font-semibold text-white">{email}</span></p>
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center block">Código de Segurança</label>
                   <div className="relative">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                     <input 
                       type="text" 
                       required
                       className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-white/10 rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-center text-xl font-mono tracking-[0.5em] text-cyan-400 font-bold outline-none transition-all placeholder:text-slate-800"
                       placeholder="••••••"
                       defaultValue="123456" 
                     />
                   </div>
                 </div>
                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] cursor-pointer"
                 >
                   {loading ? 'Validando...' : 'Confirmar Acesso'}
                 </button>
                 <button type="button" onClick={() => setStep('email')} className="w-full text-xs text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-widest font-bold">
                   Voltar
                 </button>
              </div>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-white/5">
             <div className="grid grid-cols-2 gap-4">
               <button 
                 type="button"
                 onClick={handleSocialLogin}
                 className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl transition-all font-medium text-slate-300 text-sm group"
                >
                 <svg className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24"><path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#fff" d="M5.84 14.17c-.22-.66-.35-1.36-.35-2.17s.13-1.51.35-2.17V7.01H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.99l3.66-2.82z"/><path fill="#fff" d="M12 4.81c1.6 0 3.03.55 4.15 1.62l3.11-3.11C17.45 1.57 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.01l3.66 2.82c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                 Google
               </button>
               <button 
                 type="button"
                 onClick={handleSocialLogin}
                 className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl transition-all font-medium text-slate-300 text-sm group"
                >
                 <Smartphone className="w-5 h-5 text-green-500 opacity-70 group-hover:opacity-100 transition-opacity" />
                 WhatsApp
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;