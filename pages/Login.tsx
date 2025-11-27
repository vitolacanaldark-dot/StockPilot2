
import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, Smartphone, ChevronDown } from 'lucide-react';
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
    <div className="min-h-screen flex bg-white dark:bg-slate-900 transition-colors">
      {/* Left Side - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1e1b4b] overflow-hidden items-center justify-center">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
           <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[100px] animate-pulse"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[80px]"></div>
        </div>
        
        <div className="relative z-10 max-w-lg px-12 text-center">
          <div className="mb-8 inline-block p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl">
             <div className="flex gap-4 items-end mb-2 h-32 w-64 mx-auto items-center justify-center">
                 {/* CSS Mockup of Charts */}
                 <div className="w-8 bg-indigo-500/50 h-12 rounded-t-sm"></div>
                 <div className="w-8 bg-indigo-500/70 h-20 rounded-t-sm"></div>
                 <div className="w-8 bg-indigo-500 h-28 rounded-t-sm shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                 <div className="w-8 bg-indigo-500/70 h-16 rounded-t-sm"></div>
                 <div className="w-8 bg-indigo-500/40 h-10 rounded-t-sm"></div>
             </div>
             <p className="text-indigo-200 text-sm font-mono mt-2">Otimização de Estoque Ativa</p>
          </div>
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">Domine seu Estoque.<br/>Maximize seus Lucros.</h1>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Junte-se a mais de 15.000 varejistas que usam o StockPilot para prever demanda, automatizar reposição e crescer mais rápido.
          </p>
          
          <div className="mt-12 flex items-center justify-center gap-8">
            <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                 <img key={i} src={`https://picsum.photos/id/${i+50}/100/100`} className="w-10 h-10 rounded-full border-2 border-[#1e1b4b]" alt="User" />
               ))}
            </div>
            <p className="text-white font-medium">Confiado por líderes do setor</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="max-w-md w-full">
          <div className="mb-10">
             <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
               <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
               </svg>
             </div>
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Bem-vindo de volta</h2>
             <p className="text-slate-500 dark:text-slate-400">Insira seus dados para acessar seu espaço de trabalho.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 'email' ? (
              <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mail Profissional</label>
                   <div className="relative">
                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                     <input 
                       type="email" 
                       required
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                       placeholder="voce@empresa.com"
                     />
                   </div>
                 </div>

                 {/* Role Selector for Demo */}
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Selecione o Cargo (Modo Demo)</label>
                    <div className="relative">
                      <select 
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                        className="w-full appearance-none pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                      >
                        <option value={UserRole.OWNER}>Proprietário (Acesso Total + Configuração)</option>
                        <option value={UserRole.MANAGER}>Gerente (Acesso Total)</option>
                        <option value={UserRole.CASHIER}>Caixa (Apenas PDV)</option>
                        <option value={UserRole.VIEWER}>Visitante (Apenas Leitura)</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                    </div>
                 </div>

                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 group cursor-pointer"
                 >
                   {loading ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : (
                     <>
                       Continuar com E-mail
                       <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                     </>
                   )}
                 </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="text-center mb-6">
                   <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                   </div>
                   <p className="text-sm text-slate-600 dark:text-slate-300">Enviamos um código mágico para <span className="font-semibold text-slate-900 dark:text-white">{email}</span></p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Digite o Código</label>
                   <div className="relative">
                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                     <input 
                       type="text" 
                       required
                       className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:border-transparent transition-all outline-none tracking-widest text-center text-lg font-bold text-slate-900 dark:text-white"
                       placeholder="• • • • • •"
                       defaultValue="123456" 
                     />
                   </div>
                 </div>
                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 cursor-pointer"
                 >
                   {loading ? 'Verificando...' : 'Acessar Painel'}
                 </button>
                 <button type="button" onClick={() => setStep('email')} className="w-full text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
                   Usar outro e-mail
                 </button>
              </div>
            )}
          </form>

          <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800">
             <div className="flex items-center justify-between mb-6">
               <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></span>
               <span className="px-4 text-xs font-semibold text-slate-400 uppercase">Ou continue com</span>
               <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></span>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <button 
                 type="button"
                 onClick={handleSocialLogin}
                 className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-slate-700 dark:text-slate-300 text-sm cursor-pointer"
                >
                 <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.17c-.22-.66-.35-1.36-.35-2.17s.13-1.51.35-2.17V7.01H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.99l3.66-2.82z"/><path fill="#EA4335" d="M12 4.81c1.6 0 3.03.55 4.15 1.62l3.11-3.11C17.45 1.57 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.01l3.66 2.82c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                 Google
               </button>
               <button 
                 type="button"
                 onClick={handleSocialLogin}
                 className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-slate-700 dark:text-slate-300 text-sm cursor-pointer"
                >
                 <Smartphone className="w-5 h-5 text-green-600" />
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
