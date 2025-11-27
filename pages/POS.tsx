import React, { useState } from 'react';
import { Product, Sale, SaleItem, User } from '../types';
import { Search, Plus, Trash2, ShoppingCart, CreditCard, Banknote, Lock, ScanLine, Tag } from 'lucide-react';
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
      <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-zinc-900/50 rounded-3xl border border-white/5 m-8 p-12 backdrop-blur-md">
        <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-lg">
          <Lock className="w-8 h-8 text-slate-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Acesso Negado</h2>
        <p>Terminal bloqueado para o perfil: <span className="text-cyan-500 uppercase">{user.role}</span></p>
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
  const tax = cartTotal * 0.08; 

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
    alert(`Transação Aprovada. Recibo emitido.`);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-8 max-w-[1800px] mx-auto">
      {/* Product Grid */}
      <div className="flex-1 flex flex-col bg-zinc-900/40 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-white/5 flex items-center gap-4">
           <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <ScanLine className="w-5 h-5 text-black" />
           </div>
           <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-cyan-400" />
             <input 
               type="text" 
               placeholder="Buscar catálogo..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-white placeholder:text-slate-600 transition-all font-medium"
             />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 content-start custom-scrollbar">
          {filteredProducts.map(product => (
            <button 
              key={product.id} 
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className="flex flex-col items-start p-4 bg-black/40 hover:bg-white/5 border border-white/5 hover:border-cyan-500/30 rounded-2xl transition-all disabled:opacity-30 disabled:cursor-not-allowed group text-left relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-full aspect-square bg-zinc-900 rounded-xl mb-4 flex items-center justify-center text-3xl font-bold text-slate-700 group-hover:text-cyan-500 transition-colors shadow-inner relative z-10">
                {product.name.charAt(0)}
              </div>
              <div className="relative z-10 w-full">
                <h4 className="font-bold text-slate-200 line-clamp-1 text-sm group-hover:text-white transition-colors">{product.name}</h4>
                <div className="flex justify-between w-full mt-2 items-end">
                  <span className="font-mono font-bold text-cyan-400 text-lg">R${Math.floor(product.price)}<span className="text-xs align-top">{(product.price % 1).toFixed(2).substring(1)}</span></span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{product.stock} un</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-full lg:w-[400px] flex flex-col bg-zinc-950 border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden h-full">
        <div className="p-6 bg-zinc-900 border-b border-white/5 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-violet-500"></div>
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-white" />
            <h2 className="font-bold text-xl text-white">Pedido #2901</h2>
          </div>
          <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-mono font-bold text-cyan-300 border border-white/5">{cart.length} ITENS</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
               <div className="w-20 h-20 border-2 border-dashed border-slate-700 rounded-full flex items-center justify-center">
                 <Tag className="w-8 h-8 opacity-50" />
               </div>
               <p className="font-mono text-sm uppercase tracking-widest">Aguardando Itens</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                <div className="flex-1">
                  <p className="font-bold text-slate-200 text-sm mb-1">{item.productName}</p>
                  <p className="text-xs text-cyan-500 font-mono">R${item.priceAtSale.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-black rounded-lg border border-white/10 overflow-hidden">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="px-3 py-1.5 hover:bg-white/10 text-slate-400 transition-colors">-</button>
                    <span className="w-8 text-center text-sm font-bold text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="px-3 py-1.5 hover:bg-white/10 text-slate-400 transition-colors">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="text-slate-600 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-zinc-900 border-t border-white/5 space-y-4">
           <div className="space-y-2 pb-4 border-b border-white/5">
             <div className="flex justify-between text-sm text-slate-400">
               <span>Subtotal</span>
               <span className="font-mono">R${cartTotal.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-sm text-slate-400">
               <span>Taxas (8%)</span>
               <span className="font-mono">R${tax.toFixed(2)}</span>
             </div>
           </div>
           
           <div className="flex justify-between text-2xl font-black text-white items-end">
             <span>TOTAL</span>
             <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">R${(cartTotal + tax).toFixed(2)}</span>
           </div>

           <div className="grid grid-cols-2 gap-4 pt-2">
             <button 
               onClick={() => handleCheckout('CASH')}
               disabled={cart.length === 0}
               className="flex flex-col items-center justify-center py-4 bg-zinc-800 hover:bg-zinc-700 text-green-400 rounded-xl font-bold transition-all disabled:opacity-50 border border-white/5 hover:border-green-500/30"
             >
               <Banknote className="w-5 h-5 mb-1" />
               Espécie
             </button>
             <button 
                onClick={() => handleCheckout('CREDIT')}
                disabled={cart.length === 0}
                className="flex flex-col items-center justify-center py-4 bg-cyan-600 hover:bg-cyan-500 text-black rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(8,145,178,0.2)] disabled:opacity-50"
             >
               <CreditCard className="w-5 h-5 mb-1" />
               Crédito
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default POS;