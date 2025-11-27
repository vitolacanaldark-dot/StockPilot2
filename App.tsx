import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import POS from './pages/POS';
import Onboarding from './pages/Onboarding';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import { User, Product, Sale, IndustryTemplate, UserRole } from './types';
import { INITIAL_PRODUCTS, INITIAL_SALES, MOCK_USER } from './constants';

function App() {
  // Global State
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  
  // Theme State - Defaulting to dark for the new design
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const storedUser = localStorage.getItem('stockpilot_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Enforce dark mode on mount for this redesign
    document.documentElement.classList.add('dark');
  }, []);

  // Sync theme changes (though UI is predominantly dark now)
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = (role: UserRole = UserRole.OWNER) => {
    const userToLogin = { ...MOCK_USER, role };
    if (role !== UserRole.OWNER) {
        userToLogin.industry = 'Varejo';
    }
    setUser(userToLogin);
    localStorage.setItem('stockpilot_user', JSON.stringify(userToLogin));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('stockpilot_user');
    setProducts(INITIAL_PRODUCTS);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('stockpilot_user', JSON.stringify(updatedUser));
  };

  const handleIndustrySelect = (template: IndustryTemplate) => {
    if (!user) return;
    const updatedUser = { ...user, industry: template.name };
    setUser(updatedUser);
    localStorage.setItem('stockpilot_user', JSON.stringify(updatedUser));
    setProducts(template.initialProducts);
  };

  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const updateProduct = (updated: Product) => {
    setProducts(products.map(p => p.id === updated.id ? updated : p));
  };

  const addSale = (sale: Sale) => {
    setSales([sale, ...sales]);
    const newProducts = [...products];
    sale.items.forEach(item => {
      const prodIndex = newProducts.findIndex(p => p.id === item.productId);
      if (prodIndex > -1) {
        newProducts[prodIndex].stock -= item.quantity;
      }
    });
    setProducts(newProducts);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
        
        <Route 
          path="/onboarding" 
          element={
            user && !user.industry ? (
              <Onboarding onSelect={handleIndustrySelect} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          } 
        />
        
        <Route path="/" element={user ? (user.industry ? <Layout user={user} onLogout={handleLogout} isDark={theme === 'dark'} onToggleTheme={toggleTheme} /> : <Navigate to="/onboarding" />) : <Navigate to="/login" />}>
          <Route index element={<Dashboard user={user!} products={products} sales={sales} />} />
          <Route path="inventory" element={<Inventory user={user!} products={products} onAdd={addProduct} onUpdate={updateProduct} />} />
          <Route path="pos" element={<POS user={user!} products={products} onCompleteSale={addSale} />} />
          <Route path="settings" element={<Settings user={user!} onUpdateUser={handleUpdateUser} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;