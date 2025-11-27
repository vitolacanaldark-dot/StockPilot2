
import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Search, Bell, Menu, Settings, Check, Info, AlertTriangle, Moon, Sun } from 'lucide-react';
import { User as UserType } from '../types';
import { ROLE_PERMISSIONS, MOCK_NOTIFICATIONS } from '../constants';

interface LayoutProps {
  user: UserType;
  onLogout: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, isDark, onToggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  
  const permissions = ROLE_PERMISSIONS[user.role];

  const navItems = [
    { name: 'Painel', path: '/', icon: LayoutDashboard, allowed: permissions.canViewFinancials || permissions.canManageInventory },
    { name: 'Estoque', path: '/inventory', icon: Package, allowed: true },
    { name: 'PDV / Caixa', path: '/pos', icon: ShoppingCart, allowed: permissions.canSell },
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
      case 'ALERT': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'SUCCESS': return <Check className="w-5 h-5 text-green-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-200">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm z-20 transition-colors">
        <div className="p-6 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Package className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">StockPilot</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          {navItems.filter(i => i.allowed).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Industry & Role Badge */}
        <div className="p-4 mx-4 mb-4 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl text-white shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              {user.role === 'OWNER' ? 'Proprietário' : user.role === 'MANAGER' ? 'Gerente' : user.role === 'CASHIER' ? 'Caixa' : 'Visitante'}
            </span>
            {user.plan.includes('VIP') && (
               <span className="bg-amber-400/20 text-amber-200 text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm border border-amber-400/30">VIP</span>
            )}
          </div>
          <p className="text-sm font-medium mb-3">Edição {user.industry || 'Geral'}</p>
          <div className="w-full bg-white/20 h-1.5 rounded-full mb-2 overflow-hidden">
            <div className="bg-indigo-400 h-full w-[75%]"></div>
          </div>
          <p className="text-xs text-indigo-200">75% da cota usada</p>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 w-full px-4 py-2 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 px-6 py-4 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -ml-2 text-slate-600 dark:text-slate-300">
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-lg text-slate-800 dark:text-white">StockPilot</span>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar produtos, pedidos ou ajuda..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-200 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-4">
             {/* Theme Toggle */}
             <button
               onClick={onToggleTheme}
               className="p-2 text-slate-400 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
               title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
             >
               {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`relative p-2 transition-colors rounded-full ${isNotificationsOpen ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200'}`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                   <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                     <h3 className="font-semibold text-slate-800 dark:text-white">Notificações</h3>
                     {unreadCount > 0 && (
                       <button onClick={markAllRead} className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium">
                         Marcar todas como lidas
                       </button>
                     )}
                   </div>
                   <div className="max-h-96 overflow-y-auto">
                     {notifications.length === 0 ? (
                       <div className="p-8 text-center text-slate-400 text-sm">Nenhuma notificação recente.</div>
                     ) : (
                       notifications.map(n => (
                         <div 
                           key={n.id} 
                           onClick={() => markAsRead(n.id)}
                           className={`p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors flex gap-3 ${!n.read ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
                         >
                            <div className={`mt-1 flex-shrink-0 ${!n.read ? 'opacity-100' : 'opacity-50'}`}>
                              {getNotificationIcon(n.type)}
                            </div>
                            <div>
                              <p className={`text-sm ${!n.read ? 'font-semibold text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>{n.title}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">{new Date(n.date).toLocaleDateString()} às {new Date(n.date).getHours()}:{new Date(n.date).getMinutes()}</p>
                            </div>
                         </div>
                       ))
                     )}
                   </div>
                </div>
              )}
            </div>

            <div 
              className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/settings')}
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-800 dark:text-white">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                   {user.role === 'OWNER' ? 'Proprietário' : user.role === 'MANAGER' ? 'Gerente' : user.role === 'CASHIER' ? 'Caixa' : 'Visitante'}
                </p>
              </div>
              <img src={user.avatarUrl} alt="User" className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 object-cover" />
            </div>
          </div>
        </header>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
           <div className="absolute top-[60px] left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl z-50 md:hidden p-4">
              <nav className="flex flex-col space-y-2">
              {navItems.filter(i => i.allowed).map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </NavLink>
              ))}
              <button 
                onClick={onLogout}
                className="flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 rounded-lg mt-2 border-t border-slate-100 dark:border-slate-800"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
              </nav>
           </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8 relative" onClick={() => {
            if (isNotificationsOpen) setIsNotificationsOpen(false);
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
