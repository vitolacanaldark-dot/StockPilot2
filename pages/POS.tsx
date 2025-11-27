
import React, { useState } from 'react';
import { Product, Sale, SaleItem, User } from '../types';
import { Search, Plus, Trash2, ShoppingCart, CreditCard, Banknote, Lock } from 'lucide-react';
import { ROLE_PERMISSIONS } from '../constants';

interface POSProps {
  products: Product[];
  onCompleteSale: (sale: Sale) => void;
  user: User;
}

const POS: React.FC<POSProps> = ({ products, onCompleteSale, user }) => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [search, setSearch] = useState('');
  
  const permissions = ROLE_PERMISSIONS[user.role];
  const canSell = permissions.canSell;

  if (!canSell) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 m-8 p-12">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Acesso Restrito</h2>
        <p>Seu cargo atual ({user.role}) não tem permissão para acessar o terminal PDV.</p>
      </div>
    );
  }

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId: product.id, productName: product.name, quantity: 1, priceAtSale: product.price }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.priceAtSale * item.quantity), 0);
  const tax = cartTotal * 0.08; // 8% tax example

  const handleCheckout = (method: Sale['paymentMethod']) => {
    if (cart.length === 0) return;
    
    const sale: Sale = {
      id: `s${Date.now()}`,
      date: new Date().toISOString(),
      total: cartTotal + tax,
      items: cart,
      paymentMethod: method
    };
    
    onCompleteSale(sale);
    setCart([]);
    alert(`Venda concluída com sucesso! Recibo enviado.`);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col lg:flex-row gap-6">
      {/* Product Grid */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
             <input 
               type="text" 
               placeholder="Buscar produtos para adicionar..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
             />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 content-start">
          {filteredProducts.map(product => (
            <button 
              key={product.id} 
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className="flex flex-col items-start p-4 bg-slate-50 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group text-left"
            >
              <div className="w-full aspect-square bg-white dark:bg-slate-800 rounded-lg mb-3 flex items-center justify-center text-2xl font-bold text-slate-300 dark:text-slate-600 group-hover:text-indigo-300 dark:group-hover:text-indigo-500">
                {product.name.charAt(0)}
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 text-sm h-10">{product.name}</h4>
              <div className="flex justify-between w-full mt-2 items-center">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">R${product.price}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{product.stock} restantes</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-full lg:w-96 flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden transition-colors">
        <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <h2 className="font-bold text-lg">Venda Atual</h2>
          </div>
          <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-medium">{cart.length} itens</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-2">
               <ShoppingCart className="w-12 h-12 opacity-20" />
               <p>Carrinho vazio</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="flex-1">
                  <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">{item.productName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">R${item.priceAtSale} / un</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">-</button>
                    <span className="w-8 text-center text-sm font-semibold text-slate-800 dark:text-slate-200">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-200 dark:border-slate-700 space-y-3">
           <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
             <span>Subtotal</span>
             <span>R${cartTotal.toFixed(2)}</span>
           </div>
           <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
             <span>Impostos (8%)</span>
             <span>R${tax.toFixed(2)}</span>
           </div>
           <div className="flex justify-between text-xl font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
             <span>Total</span>
             <span>R${(cartTotal + tax).toFixed(2)}</span>
           </div>

           <div className="grid grid-cols-2 gap-3 pt-4">
             <button 
               onClick={() => handleCheckout('CASH')}
               disabled={cart.length === 0}
               className="flex flex-col items-center justify-center py-3 px-4 bg-green-100 hover:bg-green-200 text-green-800 rounded-xl font-medium transition-colors disabled:opacity-50"
             >
               <Banknote className="w-5 h-5 mb-1" />
               Dinheiro
             </button>
             <button 
                onClick={() => handleCheckout('CREDIT')}
                disabled={cart.length === 0}
                className="flex flex-col items-center justify-center py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50"
             >
               <CreditCard className="w-5 h-5 mb-1" />
               Cartão
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
