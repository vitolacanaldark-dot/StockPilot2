
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
      case 'Shirt': return <ShoppingBag className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />;
      case 'Coffee': return <Coffee className="w-8 h-8 text-amber-600 dark:text-amber-400" />;
      case 'Scissors': return <Scissors className="w-8 h-8 text-pink-600 dark:text-pink-400" />;
      case 'Wrench': return <Wrench className="w-8 h-8 text-slate-600 dark:text-slate-400" />;
      default: return <ShoppingBag className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative transition-colors">
      {/* Logout Escape Hatch */}
      <div className="absolute top-6 right-6">
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-900 transition-colors shadow-sm text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>

      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Vamos configurar seu espaço</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Selecione seu setor para configurar o StockPilot com as melhores categorias, configurações e produtos de exemplo para o seu negócio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INDUSTRY_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template)}
              className="group relative flex items-start gap-6 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 hover:-translate-y-1 transition-all text-left cursor-pointer w-full"
            >
              <div className="flex-shrink-0 w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                {getIcon(template.iconName)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {template.name}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                  {template.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {template.categories.slice(0, 3).map((cat, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-md">
                      {cat}
                    </span>
                  ))}
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-medium rounded-md">
                    + mais
                  </span>
                </div>
              </div>
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <CheckCircle2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
