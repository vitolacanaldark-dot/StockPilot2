
import React, { useState } from 'react';
import { User, PlanTier, UserRole } from '../types';
import { Save, User as UserIcon, Building2, CreditCard, Shield, Lock, Star, ChevronRight } from 'lucide-react';

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
    setSuccessMsg('Perfil atualizado com sucesso!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const PlanCard = () => (
    <div className="bg-gradient-to-br from-slate-900 to-indigo-900 dark:from-slate-800 dark:to-indigo-950 text-white rounded-2xl p-6 relative overflow-hidden shadow-xl">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-indigo-200 text-sm font-medium mb-1">Seu Plano Atual</p>
            <h3 className="text-2xl font-bold">{user.plan === PlanTier.FREE ? 'Gratuito' : user.plan === PlanTier.STANDARD ? 'Padrão' : 'VIP Niche'}</h3>
          </div>
          {isVip ? (
            <span className="bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> VIP ATIVO
            </span>
          ) : (
            <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-xs font-bold">Básico</span>
          )}
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-indigo-100">
            <CheckIcon /> Acesso ao Painel e Inventário
          </div>
          <div className="flex items-center gap-2 text-sm text-indigo-100">
             <CheckIcon /> {isVip ? 'Usuários Ilimitados' : 'Até 3 Usuários'}
          </div>
          <div className="flex items-center gap-2 text-sm text-indigo-100">
             <CheckIcon /> {isVip ? 'IA Preditiva Avançada' : 'Relatórios Básicos'}
          </div>
        </div>

        {!isVip && (
          <button className="w-full bg-amber-400 hover:bg-amber-300 text-amber-900 font-bold py-3 rounded-xl transition-colors">
            Fazer Upgrade para VIP
          </button>
        )}
      </div>
      
      {/* Decorative Circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
    </div>
  );

  const CheckIcon = () => (
    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
      <div className="w-1.5 h-2.5 border-r-2 border-b-2 border-white rotate-45 mb-0.5"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configurações da Conta</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Gerencie seu perfil, preferências e assinatura.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Info */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-colors">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                <UserIcon className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-lg text-slate-800 dark:text-white">Informações Pessoais</h2>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome Completo</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mail</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Telefone / WhatsApp</label>
                  <input 
                    type="text" 
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cargo</label>
                  <input 
                    type="text" 
                    value={user.role}
                    disabled
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-600 border border-slate-200 dark:border-slate-500 text-slate-500 dark:text-slate-300 rounded-lg cursor-not-allowed"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex items-center justify-between">
                {successMsg && <span className="text-green-600 dark:text-green-400 text-sm font-medium animate-in fade-in">{successMsg}</span>}
                <div className="flex-1"></div>
                <button type="submit" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-md transition-all">
                  <Save className="w-4 h-4" /> Salvar Alterações
                </button>
              </div>
            </form>
          </div>

          {/* Company Info */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-colors">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
               <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                 <Building2 className="w-5 h-5" />
               </div>
               <div>
                 <h2 className="font-bold text-lg text-slate-800 dark:text-white">Dados da Empresa</h2>
                 <p className="text-xs text-slate-500 dark:text-slate-400">Usado para emissão de pedidos e recibos.</p>
               </div>
            </div>
            
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome Fantasia</label>
                  <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                  />
               </div>
               <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex items-start gap-3">
                  <div className="p-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">Logo Personalizada</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {isVip ? 'Faça upload da sua marca para personalizar o sistema.' : 'Disponível apenas no plano VIP.'}
                    </p>
                    {isVip ? (
                      <button className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Fazer Upload</button>
                    ) : (
                      <button className="mt-2 text-xs text-slate-400 dark:text-slate-500 font-medium cursor-not-allowed flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Bloqueado
                      </button>
                    )}
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column - Plan & Security */}
        <div className="space-y-6">
          <PlanCard />

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              <h3 className="font-bold text-slate-800 dark:text-white">Segurança</h3>
            </div>
            <div className="space-y-2">
              <button className="w-full flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg group transition-colors text-left">
                <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Alterar Senha</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
              </button>
              <button className="w-full flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg group transition-colors text-left">
                 <div>
                   <span className="block text-sm text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Autenticação de Dois Fatores</span>
                   <span className="text-[10px] text-slate-400">Recomendado</span>
                 </div>
                 <div className="w-8 h-4 bg-slate-200 dark:bg-slate-600 rounded-full relative">
                   <div className="w-4 h-4 bg-white rounded-full shadow-sm absolute left-0 top-0 border border-slate-300 dark:border-slate-500"></div>
                 </div>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              <h3 className="font-bold text-slate-800 dark:text-white">Pagamento</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Próxima cobrança em 12 de Outubro.</p>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-100 dark:border-slate-600 mb-4">
               <div className="w-8 h-5 bg-slate-800 dark:bg-slate-900 rounded flex items-center justify-center text-[8px] text-white font-mono">VISA</div>
               <span className="text-sm font-mono text-slate-600 dark:text-slate-300">•••• 4242</span>
            </div>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Gerenciar método de pagamento</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
