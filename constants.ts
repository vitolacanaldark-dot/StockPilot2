
import { Product, Sale, User, UserRole, PlanTier, IndustryTemplate, Notification } from "./types";

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Rivera',
  email: 'alex@stockpilot.co',
  role: UserRole.OWNER,
  plan: PlanTier.VIP_NICHE,
  avatarUrl: 'https://picsum.photos/id/64/200/200',
  industry: undefined, // Undefined to trigger onboarding flow for demo
  companyName: 'Rivera Comércio'
};

export const ROLE_PERMISSIONS = {
  [UserRole.OWNER]: { canManageInventory: true, canViewFinancials: true, canSell: true, canManageUsers: true },
  [UserRole.MANAGER]: { canManageInventory: true, canViewFinancials: true, canSell: true, canManageUsers: false },
  [UserRole.CASHIER]: { canManageInventory: false, canViewFinancials: false, canSell: true, canManageUsers: false },
  [UserRole.VIEWER]: { canManageInventory: false, canViewFinancials: false, canSell: false, canManageUsers: false },
};

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', sku: 'SP-001', name: 'Chá Matcha Orgânico', category: 'Bebidas', cost: 12.50, price: 28.00, stock: 45, minStock: 10, unit: 'lata', supplier: 'TeaCo' },
  { id: 'p2', sku: 'SP-002', name: 'Caneca Cerâmica - Branca', category: 'Cozinha', cost: 3.20, price: 12.99, stock: 8, minStock: 15, unit: 'un', supplier: 'Ceramix' },
  { id: 'p3', sku: 'SP-003', name: 'Batedor de Bambu', category: 'Cozinha', cost: 5.00, price: 15.50, stock: 22, minStock: 5, unit: 'un', supplier: 'Bamboozled' },
];

export const INITIAL_SALES: Sale[] = [
  { 
    id: 's1', 
    date: new Date(Date.now() - 86400000).toISOString(), 
    total: 55.99, 
    paymentMethod: 'CREDIT', 
    items: [{ productId: 'p1', productName: 'Chá Matcha Orgânico', quantity: 2, priceAtSale: 28.00 }] 
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Estoque Baixo', message: 'O produto "Caneca Cerâmica" atingiu o nível mínimo.', type: 'ALERT', read: false, date: new Date().toISOString() },
  { id: 'n2', title: 'Meta Diária Atingida', message: 'Parabéns! Você superou a meta de vendas de ontem.', type: 'SUCCESS', read: false, date: new Date(Date.now() - 86400000).toISOString() },
  { id: 'n3', title: 'Novo Fornecedor', message: 'Cadastro do fornecedor "TeaCo" aprovado.', type: 'INFO', read: true, date: new Date(Date.now() - 172800000).toISOString() },
];

export const INDUSTRY_TEMPLATES: IndustryTemplate[] = [
  {
    id: 'retail_fashion',
    name: 'Varejo de Moda',
    description: 'Perfeito para boutiques de roupas, sapatarias e lojas de acessórios.',
    categories: ['Partes de Cima', 'Partes de Baixo', 'Acessórios', 'Sapatos', 'Casacos'],
    iconName: 'Shirt',
    initialProducts: [
      { id: 'temp_f1', sku: 'F-001', name: 'Camiseta Algodão Gola C', category: 'Partes de Cima', cost: 25.00, price: 89.90, stock: 50, minStock: 10, unit: 'un', supplier: 'FashionWholesale' },
      { id: 'temp_f2', sku: 'F-002', name: 'Calça Jeans Slim Fit', category: 'Partes de Baixo', cost: 60.00, price: 199.90, stock: 30, minStock: 5, unit: 'un', supplier: 'DenimCo' },
    ]
  },
  {
    id: 'restaurant',
    name: 'Restaurante & Café',
    description: 'Otimizado para ingredientes, perecíveis e itens do cardápio.',
    categories: ['Hortifruti', 'Carnes', 'Laticínios', 'Bebidas', 'Mercearia'],
    iconName: 'Coffee',
    initialProducts: [
      { id: 'temp_r1', sku: 'R-001', name: 'Grãos de Café Espresso (1kg)', category: 'Bebidas', cost: 45.00, price: 0, stock: 10, minStock: 3, unit: 'pct', supplier: 'LocalRoast' },
      { id: 'temp_r2', sku: 'R-002', name: 'Abacates', category: 'Hortifruti', cost: 3.50, price: 0, stock: 40, minStock: 10, unit: 'un', supplier: 'FreshFarm' },
    ]
  },
  {
    id: 'salon',
    name: 'Salão & Spa',
    description: 'Rastreie uso interno e produtos de revenda para beleza.',
    categories: ['Cabelo', 'Pele', 'Tinturas', 'Ferramentas', 'Varejo'],
    iconName: 'Scissors',
    initialProducts: [
      { id: 'temp_s1', sku: 'S-001', name: 'Shampoo (Profissional 1L)', category: 'Cabelo', cost: 65.00, price: 0, stock: 6, minStock: 2, unit: 'frasco', supplier: 'BeautySupply' },
      { id: 'temp_s2', sku: 'S-002', name: 'Sérum Óleo de Argan', category: 'Varejo', cost: 30.00, price: 89.90, stock: 12, minStock: 4, unit: 'frasco', supplier: 'LuxeBeauty' },
    ]
  },
  {
    id: 'auto',
    name: 'Oficina Mecânica',
    description: 'Gerencie peças, fluidos e suprimentos de forma eficiente.',
    categories: ['Filtros', 'Fluidos', 'Freios', 'Pneus', 'Ferramentas'],
    iconName: 'Wrench',
    initialProducts: [
      { id: 'temp_a1', sku: 'A-001', name: 'Óleo Sintético 5W-30', category: 'Fluidos', cost: 22.00, price: 55.00, stock: 100, minStock: 20, unit: 'l', supplier: 'AutoPartsInc' },
      { id: 'temp_a2', sku: 'A-002', name: 'Filtro de Óleo Tipo B', category: 'Filtros', cost: 12.00, price: 35.00, stock: 15, minStock: 5, unit: 'un', supplier: 'AutoPartsInc' },
    ]
  }
];

export const DASHBOARD_TIPS = [
  { category: 'Gestão', text: 'Analise a Curva ABC: 20% dos seus produtos geram 80% do lucro. Mantenha esses itens sempre em estoque.' },
  { category: 'Finanças', text: 'Reduza custos ocultos revisando contratos de fornecedores a cada 6 meses.' },
  { category: 'Estoque', text: 'Implemente o método PEPS (Primeiro a Entrar, Primeiro a Sair) para evitar perdas por validade.' },
  { category: 'Vendas', text: 'Treine sua equipe para oferecer produtos complementares (cross-sell) no checkout.' },
  { category: 'Marketing', text: 'Produtos parados há mais de 90 dias? Crie uma promoção relâmpago para liberar capital de giro.' },
];

export const MARKET_NEWS = [
  { title: 'Alta nos combustíveis impacta fretes', source: 'LogísticaBR', time: '2h atrás', trend: 'down' },
  { title: 'Demanda por produtos sustentáveis cresce 15%', source: 'VarejoNews', time: '4h atrás', trend: 'up' },
  { title: 'Fornecedores de eletrônicos normalizam prazos', source: 'TechSupply', time: '6h atrás', trend: 'neutral' },
  { title: 'Nova regulamentação fiscal para MEI em 2025', source: 'Portal Contábil', time: '1d atrás', trend: 'neutral' },
  { title: 'Inflação do setor de alimentos desacelera', source: 'Economia Hoje', time: '1d atrás', trend: 'up' },
];