
import React, { useMemo, useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Product, Sale, User } from '../types';
import { DollarSign, AlertTriangle, TrendingUp, Package, Sparkles, Lock, Lightbulb, TrendingDown, Minus, ArrowRight, ExternalLink } from 'lucide-react';
import { generateInventoryInsights } from '../services/geminiService';
import { ROLE_PERMISSIONS, DASHBOARD_TIPS, MARKET_NEWS } from '../constants';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ products, sales, user }) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  
  const permissions = ROLE_PERMISSIONS[user.role];
  const canViewFinancials = permissions.canViewFinancials;

  // Rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % DASHBOARD_TIPS.length);
    }, 10000); // Rotate every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Computed Stats
  const today = new Date().toISOString().split('T')[0];
  const todaysSales = sales.filter(s => s.date.startsWith(today));
  const totalRevenue = todaysSales.reduce((sum, s) => sum + s.total, 0);
  const lowStockItems = products.filter(p => p.stock <= p.minStock);
  
  // Data for Charts
  const salesByProduct = useMemo(() => {
    const map: Record<string, number> = {};
    sales.forEach(s => {
      s.items.forEach(item => {
        map[item.productName] = (map[item.productName] || 0) + item.quantity;
      });
    });
    return Object.keys(map).map(name => ({ name, quantity: map[name] })).slice(0, 5);
  }, [sales]);

  const salesTrend = useMemo(() => {
    // Mock trend data for demo visuals (real logic would group sales by date)
    return [
        { day: 'Seg', val: 400 },
        { day: 'Ter', val: 300 },
        { day: 'Qua', val: 550 },
        { day: 'Qui', val: 450 },
        { day: 'Sex', val: 700 },
        { day: 'Sáb', val: 890 },
        { day: 'Dom', val: totalRevenue || 120 }
    ];
  }, [totalRevenue]);

  const handleGenerateInsights = async () => {
    setLoadingAi(true);
    const insight = await generateInventoryInsights(products, sales);
    setAiInsight(insight);
    setLoadingAi(false);
  };

  const KPICard = ({ title, value, sub, icon: Icon, color, hidden = false }: any) => {
    if (hidden) {
      return (
        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center h-32 relative overflow-hidden group transition-colors">
           <div className="absolute inset-0 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
              <Lock className="w-6 h-6 mb-2" />
              <span className="text-xs font-medium uppercase tracking-widest">Restrito</span>
           </div>
           <div className="blur-sm opacity-50 w-full">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-200">---</h3>
           </div>
        </div>
      );
    }
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-start justify-between hover:shadow-md transition-all">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">{value}</h3>
          <p className={`text-xs mt-2 font-medium ${sub.includes('+') ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}`}>{sub}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    )
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Visão Geral</h1>
           <p className="text-slate-500 dark:text-slate-400 text-sm">Bem-vindo de volta, aqui está o resumo de hoje.</p>
        </div>
        
        {permissions.canManageUsers && (
          <button 
            onClick={handleGenerateInsights}
            disabled={loadingAi}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/30 transition-all disabled:opacity-70"
          >
            {loadingAi ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"/> : <Sparkles className="w-4 h-4" />}
            <span>{loadingAi ? 'Analisando Dados...' : 'Perguntar à IA StockPilot'}</span>
          </button>
        )}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Receita Hoje" 
          value={`R$${totalRevenue.toFixed(2)}`} 
          sub="+12% desde ontem"
          icon={DollarSign}
          color="bg-green-500"
          hidden={!canViewFinancials}
        />
        <KPICard 
          title="Alertas de Baixo Estoque" 
          value={lowStockItems.length} 
          sub={lowStockItems.length > 0 ? "Requer atenção" : "Estoque saudável"}
          icon={AlertTriangle}
          color={lowStockItems.length > 0 ? "bg-red-500" : "bg-slate-400"}
        />
        <KPICard 
          title="Total de Transações" 
          value={todaysSales.length} 
          sub="+5% volume"
          icon={TrendingUp}
          color="bg-blue-500"
          hidden={!canViewFinancials && !permissions.canSell}
        />
        <KPICard 
          title="Total de SKUs" 
          value={products.length} 
          sub="2 novos esta semana"
          icon={Package}
          color="bg-indigo-500"
        />
      </div>

      {/* AI Insight Section */}
      {aiInsight && (
        <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/40 dark:to-slate-900 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-indigo-900 dark:text-indigo-200">Análise Inteligente StockPilot</h3>
          </div>
          <div className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300">
             <div className="whitespace-pre-line leading-relaxed">{aiInsight}</div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm relative transition-colors">
          {!canViewFinancials && (
             <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                   <Lock className="w-5 h-5" />
                   <span className="font-medium">Dados financeiros restritos para seu cargo</span>
                </div>
             </div>
          )}
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Tendência de Receita (Semana)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-700" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} prefix="R$" />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} 
                  cursor={{stroke: '#cbd5e1'}}
                />
                <Area type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Itens Mais Vendidos</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByProduct} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" className="dark:stroke-slate-700" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fill: '#475569', fontSize: 11}} className="dark:fill-slate-400" />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="quantity" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive Footer Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Tips Section */}
        <div className="bg-[#1e1b4b] dark:bg-slate-900 rounded-2xl p-6 relative overflow-hidden text-white flex flex-col justify-between min-h-[220px] transition-colors border border-transparent dark:border-slate-700">
           {/* Background Decorations */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
           <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-xl -ml-10 -mb-10"></div>
           
           <div className="relative z-10">
             <div className="flex items-center gap-2 mb-4 text-amber-300">
               <Lightbulb className="w-5 h-5 fill-current" />
               <span className="font-bold tracking-wide text-xs uppercase">Dica do Especialista</span>
             </div>
             
             <div className="min-h-[100px] transition-all duration-500">
               <h3 className="text-xl font-medium leading-relaxed mb-2">"{DASHBOARD_TIPS[currentTipIndex].text}"</h3>
               <span className="inline-block px-2 py-1 bg-white/10 rounded text-xs font-semibold text-indigo-200">
                 {DASHBOARD_TIPS[currentTipIndex].category}
               </span>
             </div>
           </div>

           <div className="flex items-center justify-between mt-4 relative z-10 border-t border-white/10 pt-4">
             <div className="flex gap-1">
               {DASHBOARD_TIPS.map((_, idx) => (
                 <div 
                   key={idx} 
                   className={`h-1 rounded-full transition-all duration-300 ${idx === currentTipIndex ? 'w-6 bg-amber-400' : 'w-2 bg-white/20'}`}
                 />
               ))}
             </div>
             <button onClick={() => setCurrentTipIndex((prev) => (prev + 1) % DASHBOARD_TIPS.length)} className="text-xs hover:text-amber-300 transition-colors flex items-center gap-1">
               Próxima Dica <ArrowRight className="w-3 h-3" />
             </button>
           </div>
        </div>

        {/* Market News Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
               <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
               <h3 className="font-bold text-slate-800 dark:text-white">Mercado em Tempo Real</h3>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full animate-pulse">
               <span className="w-1.5 h-1.5 bg-red-600 dark:bg-red-500 rounded-full"></span> AO VIVO
            </span>
          </div>

          <div className="space-y-4">
             {MARKET_NEWS.map((news, idx) => (
               <div key={idx} className="flex items-start gap-3 pb-3 border-b border-slate-50 dark:border-slate-700 last:border-0 last:pb-0">
                  <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded flex items-center justify-center ${
                    news.trend === 'up' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 
                    news.trend === 'down' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 
                    'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                    {news.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : news.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-tight hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                      {news.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">{news.source}</span>
                      <span className="text-[10px] text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{news.time}</span>
                    </div>
                  </div>
                  <button className="text-slate-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400">
                    <ExternalLink className="w-3 h-3" />
                  </button>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
