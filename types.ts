
export enum UserRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  CASHIER = 'CASHIER',
  VIEWER = 'VIEWER'
}

export enum PlanTier {
  FREE = 'FREE',
  STANDARD = 'STANDARD',
  VIP_NICHE = 'VIP_NICHE',
  VIP_ENTERPRISE = 'VIP_ENTERPRISE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: PlanTier;
  industry?: string;
  avatarUrl?: string;
  phone?: string;
  companyName?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  cost: number;
  price: number;
  stock: number;
  minStock: number;
  unit: string;
  lastRestockDate?: string;
  supplier?: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  priceAtSale: number;
}

export interface Sale {
  id: string;
  date: string;
  total: number;
  items: SaleItem[];
  paymentMethod: 'CREDIT' | 'DEBIT' | 'CASH' | 'PIX';
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
}

export interface DashboardStats {
  totalSalesToday: number;
  totalRevenueToday: number;
  lowStockCount: number;
  topSellingProduct: string;
}

export interface IndustryTemplate {
  id: string;
  name: string;
  description: string;
  categories: string[];
  initialProducts: Product[];
  iconName: string; // Using string to reference Lucide icons dynamically or mapped
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'ALERT' | 'INFO' | 'SUCCESS';
  read: boolean;
  date: string;
}
