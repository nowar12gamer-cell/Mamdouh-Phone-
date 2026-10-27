export type Brand = 'all' | 'Apple' | 'Samsung' | 'Xiaomi' | 'Google' | 'Accessories';

export interface ProductVariant {
  storage: string;
  priceDelta: number; // relative to base price
}

export interface ColorOption {
  name: string;
  nameEn: string;
  hex: string;
}

export interface ProductSpec {
  screen: string;
  processor: string;
  ram: string;
  battery: string;
  mainCamera: string;
  selfieCamera: string;
  network: string;
  os: string;
}

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  brand: 'Apple' | 'Samsung' | 'Xiaomi' | 'Google' | 'Accessories';
  category: 'smartphones' | 'accessories';
  basePrice: number;
  oldPrice?: number;
  badge?: string; // e.g. "الأكثر مبيعاً" or "جديد"
  image: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  warranty: string;
  description: string;
  colors: ColorOption[];
  storageVariants: ProductVariant[];
  specs?: ProductSpec;
}

export interface CartItem {
  id: string; // unique item id based on product id + storage + color
  productId: string;
  name: string;
  nameEn: string;
  price: number;
  image: string;
  selectedColor: ColorOption;
  selectedStorage: string;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  itemsCount: number;
  isFreeShipping: boolean;
  thresholdRemaining: number;
}

export interface FilterState {
  brand: Brand;
  search: string;
  category: 'all' | 'smartphones' | 'accessories';
  maxPrice?: number;
  minPrice?: number;
  onlyInStock: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
}

export interface TradeInOption {
  brand: string;
  model: string;
  baseValuation: number;
}

export interface RepairQuote {
  phoneModel: string;
  serviceType: 'screen' | 'battery' | 'camera' | 'charging_port' | 'back_glass';
  estimatedCost: number;
  durationMinutes: number;
  warrantyMonths: number;
  serviceTitle: string;
}

export interface CustomerOrder {
  customerName: string;
  phone: string;
  city: string;
  address: string;
  deliveryMethod: 'delivery' | 'pickup';
  paymentMethod: 'cod' | 'card_on_delivery' | 'instapay';
  notes?: string;
  items: CartItem[];
  totals: CartTotals;
  orderNumber: string;
  createdAt: string;
}
