
import React, { useState } from 'react';
import { Product, User } from '../types';
import { Plus, Search, Filter, AlertCircle, ScanLine, Edit2, X, Camera, Lock } from 'lucide-react';
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
    setFormData(prev => ({ ...prev, sku: 'SCAN-' + Math.floor(Math.random() * 10000), name: 'Item Escaneado Exemplo' }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gestão de Estoque</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Gerencie produtos, rastreie lotes e ajuste o estoque.</p>
        </div>
        
        {/* Permission Check for Actions */}
        {canManage && (
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setIsScannerOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors"
            >
              <ScanLine className="w-4 h-4" />
              Escanear
            </button>
            <button 
              onClick={() => openModal()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Adicionar Item
            </button>
          </div>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 items-center transition-colors">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Buscar por SKU, Nome ou Fornecedor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
        <button className="flex items-center gap-2 text-slate-600 dark:text-slate-300 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-sm font-medium w-full sm:w-auto justify-center">
          <Filter className="w-4 h-4" />
          Filtros
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Produto</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Estoque</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Preço</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Status</th>
                {canManage && <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                        {product.name.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{product.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{product.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">{product.sku}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-slate-700 dark:text-slate-300">{product.stock}</td>
                  <td className="px-6 py-4 text-sm text-right text-slate-600 dark:text-slate-400">R${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                     {product.stock <= product.minStock ? (
                       <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                         <AlertCircle className="w-3 h-3" /> Estoque Baixo
                       </span>
                     ) : (
                       <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                         Em Estoque
                       </span>
                     )}
                  </td>
                  {canManage && (
                    <td className="px-6 py-4">
                      <button onClick={() => openModal(product)} className="p-2 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors">
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
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            Nenhum produto encontrado correspondente à sua pesquisa.
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && canManage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Produto</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SKU / Código de Barras</label>
                <input 
                  type="text" 
                  required
                  value={formData.sku}
                  onChange={e => setFormData({...formData, sku: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoria</label>
                <input 
                  type="text" 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fornecedor</label>
                <input 
                  type="text" 
                  value={formData.supplier}
                  onChange={e => setFormData({...formData, supplier: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preço de Custo (R$)</label>
                <input 
                  type="number" 
                  min="0" step="0.01"
                  value={formData.cost}
                  onChange={e => setFormData({...formData, cost: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preço de Venda (R$)</label>
                <input 
                  type="number" 
                  min="0" step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Estoque Atual</label>
                <input 
                  type="number" 
                  min="0"
                  value={formData.stock}
                  onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Alerta de Mínimo</label>
                <input 
                  type="number" 
                  min="0"
                  value={formData.minStock}
                  onChange={e => setFormData({...formData, minStock: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                />
              </div>
              
              <div className="sm:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-5 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md transition-colors">Salvar Produto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Scanner Modal (Simulated) */}
      {isScannerOpen && canManage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4">
           <div className="relative w-full max-w-sm aspect-[3/4] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
              {/* Camera Preview Simulation */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10"></div>
              <div className="absolute inset-0 flex items-center justify-center z-0">
                 <Camera className="w-16 h-16 text-slate-700 animate-pulse" />
                 <p className="absolute bottom-20 text-slate-400 text-sm">Câmera Ativa</p>
              </div>
              
              {/* Overlay UI */}
              <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center">
                 <button onClick={closeModal} className="p-2 bg-black/40 rounded-full text-white backdrop-blur-md"><X className="w-5 h-5"/></button>
                 <span className="text-white font-medium text-sm bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">Escanear Código</span>
              </div>
              
              {/* Scan Frame */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-40 border-2 border-green-500 rounded-lg z-20 flex items-center justify-center">
                 <div className="w-full h-0.5 bg-red-500 animate-[ping_1.5s_ease-in-out_infinite] opacity-50"></div>
              </div>
              
              <div className="absolute bottom-6 left-0 right-0 px-6 z-20">
                 <button onClick={simulateScan} className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold shadow-lg">Capturar / Digitar Manualmente</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
