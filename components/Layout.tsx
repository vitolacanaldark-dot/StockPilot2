import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Search, Bell, Menu, Settings, Check, Info, AlertTriangle, Cpu } from 'lucide-react';
import { User as UserType } from '../types';
import { ROLE_PERMISSIONS, MOCK_NOTIFICATIONS } from '../constants';

interface LayoutProps {
  user: UserType;
  onLogout: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  
  const permissions = ROLE_PERMISSIONS[user.role];

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, allowed: permissions.canViewFinancials || permissions.canManageInventory },
    { name: 'Estoque', path: '/inventory', icon: Package, allowed: true },
    { name: 'PDV', path: '/pos', icon: ShoppingCart, allowed: permissions.canSell },
    { name: 'Configurações', path: '/settings', icon: Settings, allowed: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'ALERT': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'SUCCESS': return <Check className="w-4 h-4 text-cyan-500" />;
      default: return <Info className="w-4 h-4 text-violet-500" />;
    }
  };

  return (
    <div className="flex h-screen bg-black text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Decorative Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-violet-900/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-zinc-950/80 backdrop-blur-xl border-r border-white/5 z-20 relative">
        <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="relative w-10 h-10 flex items-center justify-center">
             <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-40"></div>
             <div className="relative w-10 h-10 bg-gradient-to-tr from-cyan-600 to-violet-600 rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                <Cpu className="text-white w-6 h-6" />
             </div>
          </div>
          <div>
             <span className="text-xl font-bold text-white tracking-wide block leading-none">Stock<span className="text-cyan-400">Pilot</span></span>
             <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase blur-[0.3px]">System v2.0</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-6">
          {navItems.filter(i => i.allowed).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? 'text-white' 
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent border-l-2 border-cyan-400"></div>
                )}
                <item.icon className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'group-hover:text-cyan-200'}`} />
                <span className="relative z-10 font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Role Badge */}
        <div className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-violet-500/10 rounded-full blur-xl -mr-6 -mt-6"></div>
          <div className="flex justify-between items-start mb-2 relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-cyan-400 transition-colors">
              {user.role === 'OWNER' ? 'Proprietário' : user.role === 'MANAGER' ? 'Gerente' : user.role === 'CASHIER' ? 'Caixa' : 'Visitante'}
            </span>
            {user.plan.includes('VIP') && (
               <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] px-2 py-0.5 rounded shadow-[0_0_10px_rgba(6,182,212,0.2)]">VIP</span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-300 mb-3">{user.industry || 'Geral'}</p>
          <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-violet-500 h-full w-[75%] shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
          </div>
        </div>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 text-slate-500 hover:text-red-400 w-full px-4 py-2 transition-colors group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        
        {/* Header */}
        <header className="h-20 px-6 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -ml-2 text-slate-300">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-gradient-to-tr from-cyan-600 to-violet-600 rounded-lg flex items-center justify-center">
                  <Cpu className="text-white w-4 h-4" />
               </div>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-lg relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar comando ou produto..." 
              className="w-full pl-11 pr-4 py-2.5 bg-zinc-900/50 border border-white/5 rounded-full text-sm text-slate-200 focus:bg-zinc-900 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`relative p-2 transition-all duration-300 rounded-full hover:bg-white/5 ${isNotificationsOpen ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-cyan-300'}`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-black shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 top-full mt-4 w-80 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                   <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                     <h3 className="font-semibold text-white text-sm">Notificações</h3>
                     {unreadCount > 0 && (
                       <button onClick={markAllRead} className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">
                         Marcar lidas
                       </button>
                     )}
                   </div>
                   <div className="max-h-80 overflow-y-auto">
                     {notifications.length === 0 ? (
                       <div className="p-8 text-center text-slate-500 text-sm">Sistema atualizado. Nenhuma notificação.</div>
                     ) : (
                       notifications.map(n => (
                         <div 
                           key={n.id} 
                           onClick={() => markAsRead(n.id)}
                           className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors flex gap-3 ${!n.read ? 'bg-cyan-500/5' : ''}`}
                         >
                            <div className={`mt-0.5 flex-shrink-0 ${!n.read ? 'opacity-100' : 'opacity-40'}`}>
                              {getNotificationIcon(n.type)}
                            </div>
                            <div>
                              <p className={`text-sm ${!n.read ? 'font-medium text-slate-200' : 'text-slate-500'}`}>{n.title}</p>
                              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                              <p className="text-[10px] text-slate-600 mt-2 font-mono">{new Date(n.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                         </div>
                       ))
                     )}
                   </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div 
              className="flex items-center gap-3 pl-6 border-l border-white/5 cursor-pointer group"
              onClick={() => navigate('/settings')}
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{user.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide font-bold group-hover:text-cyan-500 transition-colors">
                   {user.role}
                </p>
              </div>
              <div className="relative">
                 <img src={user.avatarUrl} alt="User" className="w-9 h-9 rounded-lg border border-white/10 object-cover group-hover:border-cyan-500/50 transition-colors" />
                 <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-black rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>
                 </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
           <div className="absolute top-[80px] left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-b border-white/10 shadow-2xl z-40 md:hidden p-4 animate-in slide-in-from-top-5">
              <nav className="flex flex-col space-y-2">
              {navItems.filter(i => i.allowed).map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg ${isActive ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400'}`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </NavLink>
              ))}
              <button 
                onClick={onLogout}
                className="flex items-center gap-3 px-4 py-3 text-red-400 rounded-lg mt-2 border-t border-white/10"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
              </nav>
           </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8 relative scroll-smooth" onClick={() => {
            if (isNotificationsOpen) setIsNotificationsOpen(false);
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;