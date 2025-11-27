import React, { useMemo, useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Product, Sale, User } from '../types';
import { DollarSign, AlertTriangle, TrendingUp, Package, Sparkles, Lock, Lightbulb, TrendingDown, Minus, ArrowRight, ExternalLink, Activity } from 'lucide-react';
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
    // Mock trend data for demo visuals
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

  const KPICard = ({ title, value, sub, icon: Icon, color, hidden = false, glowColor }: any) => {
    if (hidden) {
      return (
        <div className="bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 flex items-center justify-center h-32 relative overflow-hidden group">
           <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 z-10">
              <Lock className="w-6 h-6 mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Acesso Restrito</span>
           </div>
           {/* Scanline effect */}
           <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] bg-[length:100%_4px] animate-[scan_2s_linear_infinite] pointer-events-none opacity-20"></div>
        </div>
      );
    }
    return (
      <div className={`bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 flex items-start justify-between hover:bg-zinc-900/80 transition-all group relative overflow-hidden`}>
        {/* Glow effect on hover */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${glowColor} opacity-0 group-hover:opacity-20 blur transition duration-500`}></div>
        <div className="relative z-10">
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
          <p className={`text-xs mt-2 font-medium ${sub.includes('+') ? 'text-green-400' : 'text-slate-500'}`}>{sub}</p>
        </div>
        <div className={`p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors relative z-10`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    )
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <Activity className="text-cyan-500 w-6 h-6" />
             Painel de Controle
           </h1>
           <p className="text-slate-400 text-sm mt-1">Resumo operacional em tempo real.</p>
        </div>
        
        {permissions.canManageUsers && (
          <button 
            onClick={handleGenerateInsights}
            disabled={loadingAi}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-400 px-6 py-3 rounded-xl transition-all disabled:opacity-50 group backdrop-blur-md"
          >
            {loadingAi ? <div className="w-4 h-4 border-2 border-cyan-400/50 border-t-cyan-400 rounded-full animate-spin"/> : <Sparkles className="w-4 h-4 group-hover:text-cyan-300 group-hover:scale-110 transition-all" />}
            <span className="font-medium tracking-wide">Iniciar IA Neural</span>
          </button>
        )}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Receita (24h)" 
          value={`R$${totalRevenue.toFixed(2)}`} 
          sub="+12% projetado"
          icon={DollarSign}
          glowColor="from-green-500 to-emerald-500"
          hidden={!canViewFinancials}
        />
        <KPICard 
          title="Alertas Críticos" 
          value={lowStockItems.length} 
          sub={lowStockItems.length > 0 ? "Requer intervenção" : "Estável"}
          icon={AlertTriangle}
          glowColor="from-red-500 to-orange-500"
          color={lowStockItems.length > 0 ? "text-red-500" : "text-slate-400"}
        />
        <KPICard 
          title="Volume Vendas" 
          value={todaysSales.length} 
          sub="+5% vs média"
          icon={TrendingUp}
          glowColor="from-cyan-500 to-blue-500"
          hidden={!canViewFinancials && !permissions.canSell}
        />
        <KPICard 
          title="Total SKUs" 
          value={products.length} 
          sub="Catálogo ativo"
          icon={Package}
          glowColor="from-violet-500 to-purple-500"
        />
      </div>

      {/* AI Insight Section */}
      {aiInsight && (
        <div className="bg-gradient-to-r from-violet-900/20 to-cyan-900/20 p-8 rounded-2xl border border-white/10 relative overflow-hidden animate-in fade-in slide-in-from-top-4">
          <div className="absolute top-0 right-0 p-4 opacity-20">
             <Sparkles className="w-24 h-24 text-white" />
          </div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-2 h-8 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
            <h3 className="text-xl font-bold text-white">Análise Neural StockPilot</h3>
          </div>
          <div className="prose prose-invert prose-sm max-w-none text-slate-300 relative z-10">
             <div className="whitespace-pre-line leading-relaxed font-light">{aiInsight}</div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 relative shadow-xl overflow-hidden">
          {!canViewFinancials && (
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="bg-zinc-900 p-4 rounded-xl border border-white/10 flex items-center gap-3 text-slate-400">
                   <Lock className="w-5 h-5" />
                   <span className="font-mono text-sm uppercase">Dados Criptografados</span>
                </div>
             </div>
          )}
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
            Fluxo de Receita
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} prefix="R$" />
                <Tooltip 
                  contentStyle={{backgroundColor: '#09090b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', color: '#fff'}} 
                  itemStyle={{color: '#22d3ee'}}
                  cursor={{stroke: 'rgba(34,211,238,0.3)', strokeWidth: 1}}
                />
                <Area type="monotone" dataKey="val" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" activeDot={{r: 6, fill: '#fff', stroke: '#06b6d4', strokeWidth: 2}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 relative shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
             <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
             Top Performance
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByProduct} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} />
                <Tooltip 
                   cursor={{fill: 'rgba(255,255,255,0.05)'}}
                   contentStyle={{backgroundColor: '#09090b', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff'}} 
                />
                <Bar dataKey="quantity" radius={[0, 4, 4, 0]} barSize={24}>
                  {salesByProduct.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8b5cf6' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive Footer Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* Tips Section - Cyberpunk Style */}
        <div className="bg-black border border-cyan-500/20 rounded-2xl p-8 relative overflow-hidden group">
           {/* Moving gradient background */}
           <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-violet-900/20 opacity-50 group-hover:opacity-70 transition-opacity duration-1000"></div>
           
           <div className="relative z-10 flex flex-col justify-between h-full min-h-[200px]">
             <div className="flex items-center gap-3 text-cyan-400 mb-6">
               <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <Lightbulb className="w-5 h-5" />
               </div>
               <span className="font-mono text-xs font-bold uppercase tracking-widest">Database Estratégico</span>
             </div>
             
             <div className="flex-1 transition-all duration-500 flex items-center">
               <h3 className="text-2xl font-light text-white leading-snug">"{DASHBOARD_TIPS[currentTipIndex].text}"</h3>
             </div>
             
             <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-xs font-mono text-cyan-300 bg-cyan-900/30 px-2 py-1 rounded">
                   CMD: {DASHBOARD_TIPS[currentTipIndex].category.toUpperCase()}
                </span>
                <button onClick={() => setCurrentTipIndex((prev) => (prev + 1) % DASHBOARD_TIPS.length)} className="text-xs hover:text-white text-slate-400 transition-colors flex items-center gap-2 font-mono uppercase tracking-wider">
                  Próximo <ArrowRight className="w-3 h-3" />
                </button>
             </div>
           </div>
        </div>

        {/* Market News Section */}
        <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/5 p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <h3 className="font-bold text-white tracking-wide">Mercado Global</h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500">FEED_V1.0</span>
          </div>

          <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
             {MARKET_NEWS.map((news, idx) => (
               <div key={idx} className="flex items-start gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0 group">
                  <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border border-white/5 ${
                    news.trend === 'up' ? 'bg-green-500/10 text-green-500' : 
                    news.trend === 'down' ? 'bg-red-500/10 text-red-500' : 
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {news.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : news.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-300 leading-snug group-hover:text-cyan-400 transition-colors cursor-pointer">
                      {news.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{news.source}</span>
                      <span className="text-[10px] text-slate-600 font-mono">{news.time}</span>
                    </div>
                  </div>
                  <button className="text-slate-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                    <ExternalLink className="w-4 h-4" />
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