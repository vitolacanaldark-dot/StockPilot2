import React from 'react';
import { IndustryTemplate } from '../types';
import { INDUSTRY_TEMPLATES } from '../constants';
import { CheckCircle2, ShoppingBag, Coffee, Scissors, Wrench, LogOut } from 'lucide-react';

interface OnboardingProps {
  onSelect: (template: IndustryTemplate) => void;
  onLogout: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onSelect, onLogout }) => {
  const getIcon = (name: string) => {
    switch(name) {
      case 'Shirt': return <ShoppingBag className="w-8 h-8 text-cyan-400" />;
      case 'Coffee': return <Coffee className="w-8 h-8 text-amber-500" />;
      case 'Scissors': return <Scissors className="w-8 h-8 text-pink-500" />;
      case 'Wrench': return <Wrench className="w-8 h-8 text-slate-300" />;
      default: return <ShoppingBag className="w-8 h-8 text-cyan-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background FX */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 via-cyan-500 to-violet-600"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 pointer-events-none"></div>

      {/* Logout Escape Hatch */}
      <div className="absolute top-8 right-8 z-50">
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-slate-500 hover:text-red-400 px-4 py-2 rounded-full bg-zinc-900 border border-white/10 hover:border-red-500/30 transition-colors text-sm font-medium backdrop-blur-md"
        >
          <LogOut className="w-4 h-4" />
          Abortar Configuração
        </button>
      </div>

      <div className="max-w-5xl w-full relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-white mb-6 tracking-tight">Inicialização do Sistema</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Selecione o módulo operacional que melhor se adapta à sua infraestrutura.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INDUSTRY_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template)}
              className="group relative flex items-start gap-8 p-8 bg-zinc-900/40 backdrop-blur-md rounded-3xl border border-white/5 hover:border-cyan-500/50 hover:bg-zinc-900/80 transition-all text-left cursor-pointer w-full overflow-hidden"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex-shrink-0 w-20 h-20 bg-black rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-cyan-500/30 shadow-lg relative z-10 transition-colors">
                {getIcon(template.iconName)}
              </div>
              
              <div className="relative z-10 flex-1">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {template.name}
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  {template.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {template.categories.slice(0, 3).map((cat, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/5 text-slate-300 text-xs font-mono font-bold rounded-full group-hover:border-cyan-500/20 transition-colors">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110">
                <CheckCircle2 className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;