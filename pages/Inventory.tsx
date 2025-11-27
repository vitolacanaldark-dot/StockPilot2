import React, { useState } from 'react';
import { Product, User } from '../types';
import { Plus, Search, Filter, AlertCircle, ScanLine, Edit2, X, Camera, Lock, ChevronDown, Package } from 'lucide-react';
import { ROLE_PERMISSIONS } from '../constants';

interface InventoryProps {
  products: Product[];
  onAdd: (p: Product) => void;
  onUpdate: (p: Product) => void;
  user: User;
}

const Inventory: React.FC<InventoryProps> = ({ products, onAdd, onUpdate, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const permissions = ROLE_PERMISSIONS[user.role];
  const canManage = permissions.canManageInventory;

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    sku: '', name: '', category: '', cost: 0, price: 0, stock: 0, minStock: 5, unit: 'un', supplier: ''
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdate({ ...editingProduct, ...formData } as Product);
    } else {
      onAdd({ ...formData, id: `p${Date.now()}` } as Product);
    }
    closeModal();
  };

  const openModal = (product?: Product) => {
    if (!canManage) return; 
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({ sku: '', name: '', category: '', cost: 0, price: 0, stock: 0, minStock: 5, unit: 'un', supplier: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsScannerOpen(false);
    setEditingProduct(null);
  };

  const simulateScan = () => {
    if (!canManage) return;
    setIsScannerOpen(false);
    openModal();
    setFormData(prev => ({ ...prev, sku: 'SCAN-' + Math.floor(Math.random() * 10000), name: 'Item Capturado' }));
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
             <Package className="text-violet-500 w-8 h-8" />
             Matriz de Estoque
          </h1>
          <p className="text-slate-400 text-sm mt-1">Gerenciamento centralizado de SKUs.</p>
        </div>
        
        {/* Permission Check for Actions */}
        {canManage && (
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setIsScannerOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-slate-200 border border-white/10 px-6 py-3 rounded-xl font-medium transition-colors group"
            >
              <ScanLine className="w-4 h-4 group-hover:text-cyan-400" />
              Scanner
            </button>
            <button 
              onClick={() => openModal()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-black px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(8,145,178,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
            >
              <Plus className="w-4 h-4" />
              Novo Item
            </button>
          </div>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-zinc-900/50 backdrop-blur-md p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row gap-4 items-center shadow-lg">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-cyan-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar ID, Nome ou Fornecedor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none placeholder:text-slate-600 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 text-slate-300 bg-white/5 px-4 py-2.5 hover:bg-white/10 rounded-lg text-sm font-medium w-full sm:w-auto justify-center border border-white/5 transition-colors">
          <Filter className="w-4 h-4" />
          Filtrar Dados
        </button>
      </div>

      {/* Table */}
      <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/50 border-b border-white/10">
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Produto</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">SKU</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Categoria</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Qtd</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Preço</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Estado</th>
                {canManage && <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-cyan-400 font-bold text-sm border border-white/5 shadow-inner">
                        {product.name.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-200 group-hover:text-white transition-colors">{product.name}</p>
                        <p className="text-xs text-slate-600 font-mono">{product.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-400 tracking-wider">{product.sku}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/5 text-slate-300 border border-white/5">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-mono font-bold text-slate-300">{product.stock}</td>
                  <td className="px-6 py-4 text-sm text-right font-mono text-cyan-400">R${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                     {product.stock <= product.minStock ? (
                       <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 rounded-full border border-red-500/20">
                         <span className="relative flex h-2 w-2">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                         </span>
                         <span className="text-[10px] font-bold uppercase tracking-wider">Crítico</span>
                       </div>
                     ) : (
                       <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
                         <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                         <span className="text-[10px] font-bold uppercase tracking-wider">OK</span>
                       </div>
                     )}
                  </td>
                  {canManage && (
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => openModal(product)} className="p-2 hover:bg-cyan-500/10 text-slate-500 hover:text-cyan-400 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
               <Package className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-500">Nenhum registro encontrado no banco de dados.</p>
          </div>
        )}
      </div>

      {/* Edit/Add Modal - Cyberpunk Style */}
      {isModalOpen && canManage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Top neon line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-violet-500"></div>
            
            <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
              <h2 className="text-xl font-bold text-white tracking-wide">{editingProduct ? 'Editar Registro' : 'Novo Registro'}</h2>
              <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nome do Produto</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-white outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">SKU</label>
                <input 
                  type="text" 
                  required
                  value={formData.sku}
                  onChange={e => setFormData({...formData, sku: e.target.value})}
                  className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-white outline-none transition-all font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Categoria</label>
                <input 
                  type="text" 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-white outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fornecedor</label>
                <input 
                  type="text" 
                  value={formData.supplier}
                  onChange={e => setFormData({...formData, supplier: e.target.value})}
                  className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-white outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Custo (R$)</label>
                <input 
                  type="number" 
                  min="0" step="0.01"
                  value={formData.cost}
                  onChange={e => setFormData({...formData, cost: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-white outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Venda (R$)</label>
                <input 
                  type="number" 
                  min="0" step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-white outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estoque Atual</label>
                <input 
                  type="number" 
                  min="0"
                  value={formData.stock}
                  onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-white outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Min. Alerta</label>
                <input 
                  type="number" 
                  min="0"
                  value={formData.minStock}
                  onChange={e => setFormData({...formData, minStock: parseInt(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-white outline-none transition-all"
                />
              </div>
              
              <div className="sm:col-span-2 pt-6 border-t border-white/5 flex justify-end gap-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 text-slate-400 hover:text-white rounded-xl font-bold transition-colors">Cancelar</button>
                <button type="submit" className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-black rounded-xl font-bold shadow-[0_0_20px_rgba(8,145,178,0.3)] transition-all">Salvar Dados</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scanner Modal - HUD Style */}
      {isScannerOpen && canManage && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95" onClick={closeModal}></div>
           
           <div className="relative w-full max-w-sm aspect-[3/4] bg-black rounded-3xl overflow-hidden border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
              <div className="absolute inset-0 z-0">
                 {/* Grid Overlay */}
                 <div className="w-full h-full bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center z-10">
                 <Camera className="w-12 h-12 text-cyan-500/50 animate-pulse" />
              </div>
              
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-center">
                 <button onClick={closeModal} className="p-2 bg-black/50 rounded-full text-white border border-white/10"><X className="w-5 h-5"/></button>
                 <span className="text-cyan-400 font-mono text-xs bg-cyan-900/20 border border-cyan-500/30 px-3 py-1 rounded-full uppercase tracking-widest">Scanner Ativo</span>
              </div>
              
              {/* Target Reticle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 z-20 pointer-events-none">
                 <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500"></div>
                 <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500"></div>
                 <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500"></div>
                 <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500"></div>
                 <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500/50 animate-scan-y"></div>
              </div>
              
              <div className="absolute bottom-8 left-0 right-0 px-8 z-20">
                 <button onClick={simulateScan} className="w-full bg-cyan-600 hover:bg-cyan-500 text-black py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">Capturar Código</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;