export interface FlavorVariant {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Flavor {
  id: string;
  name: string;
  image: string;
  variants: FlavorVariant[];
}

export interface Brand {
  id: string;
  name: string;
  image: string;
  flavors: Flavor[];
}

export interface BillingItem {
  flavorId: string;
  flavorName: string;
  variantId: string;
  variantName: string;
  quantity: number;
  price: number;
  total: number;
  brandId: string;
  brandName: string;
  brandImage: string;
}

export interface BillingState {
  items: BillingItem[];
  totalAmount: number;
}

export interface BillingHistory {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: BillingItem[];
  totalAmount: number;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: {
    name: string;
    quantity: number;
    revenue: number;
  }[];
} 