import { CartItem, CartTotals, FilterState, Product, RepairQuote } from '../types';

export const FREE_SHIPPING_THRESHOLD = 3000;
export const STANDARD_SHIPPING_FEE = 75;

/**
 * Standardize price display in Egyptian / Arab tech commerce with commas and currency label
 */
export function formatPrice(amount: number): string {
  return `${amount.toLocaleString('en-US')} ج.م`;
}

/**
 * Calculates cart totals including items count, subtotal, discount, shipping, and free delivery thresholds.
 */
export function calculateCartTotals(items: CartItem[], promoDiscountPct: number = 0): CartTotals {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  
  const discount = Math.round((subtotal * Math.max(0, Math.min(100, promoDiscountPct))) / 100);
  const isFreeShipping = items.length > 0 && subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = items.length === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const total = Math.max(0, subtotal - discount + shipping);
  const thresholdRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return {
    subtotal,
    discount,
    shipping,
    total,
    itemsCount,
    isFreeShipping,
    thresholdRemaining,
  };
}

/**
 * Estimates trade-in value for an old device based on model, storage, and condition.
 */
export function estimateTradeInValue(params: {
  baseValuation: number;
  condition: 'like_new' | 'good' | 'fair' | 'damaged';
  storageGb: number;
}): { estimatedValue: number; discountCouponCode: string } {
  const { baseValuation, condition, storageGb } = params;

  let conditionMultiplier = 0.5;
  switch (condition) {
    case 'like_new':
      conditionMultiplier = 0.95;
      break;
    case 'good':
      conditionMultiplier = 0.8;
      break;
    case 'fair':
      conditionMultiplier = 0.6;
      break;
    case 'damaged':
      conditionMultiplier = 0.35;
      break;
  }

  // Storage bonus: +5% for 256GB, +10% for 512GB, +15% for 1TB over base 128GB
  let storageBonus = 1.0;
  if (storageGb >= 1024) storageBonus = 1.15;
  else if (storageGb >= 512) storageBonus = 1.1;
  else if (storageGb >= 256) storageBonus = 1.05;

  const estimatedValue = Math.round(baseValuation * conditionMultiplier * storageBonus);
  const discountCouponCode = `TRADEIN-${Math.floor(1000 + Math.random() * 9000)}`;

  return { estimatedValue, discountCouponCode };
}

/**
 * Calculates mobile maintenance / repair quotation.
 */
export function calculateRepairEstimate(
  phoneModel: string,
  serviceType: 'screen' | 'battery' | 'camera' | 'charging_port' | 'back_glass'
): RepairQuote {
  const isApple = /iphone/i.test(phoneModel);
  const isUltra = /ultra|pro max/i.test(phoneModel);

  let baseCost = 450;
  let durationMinutes = 45;
  let warrantyMonths = 6;
  let serviceTitle = 'صيانة عامة';

  switch (serviceType) {
    case 'screen':
      serviceTitle = 'استبدال شاشة أصلية مع الضمان';
      baseCost = isUltra ? 2800 : isApple ? 2200 : 1400;
      durationMinutes = 60;
      warrantyMonths = 12;
      break;
    case 'battery':
      serviceTitle = 'استبدال بطارية أصلية عالية الكفاءة';
      baseCost = isUltra ? 850 : isApple ? 750 : 550;
      durationMinutes = 35;
      warrantyMonths = 6;
      break;
    case 'camera':
      serviceTitle = 'إصلاح / استبدال عدسة الكاميرا وحساس التركيز';
      baseCost = isUltra ? 1600 : isApple ? 1400 : 900;
      durationMinutes = 50;
      warrantyMonths = 6;
      break;
    case 'charging_port':
      serviceTitle = 'استبدال منفذ الشحن Type-C / Lightning وفحص الدائرة';
      baseCost = isApple ? 480 : 380;
      durationMinutes = 30;
      warrantyMonths = 6;
      break;
    case 'back_glass':
      serviceTitle = 'تغيير الظهر الزجاجي بالليزر بدقة المصنع';
      baseCost = isApple ? 900 : 650;
      durationMinutes = 90;
      warrantyMonths = 12;
      break;
  }

  return {
    phoneModel,
    serviceType,
    estimatedCost: baseCost,
    durationMinutes,
    warrantyMonths,
    serviceTitle,
  };
}

/**
 * Filters and sorts products based on search query, brand, category, and price.
 */
export function filterProducts(products: Product[], filters: FilterState): Product[] {
  return products
    .filter((product) => {
      // Category filter
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // Brand filter
      if (filters.brand !== 'all' && product.brand !== filters.brand) {
        return false;
      }

      // In stock
      if (filters.onlyInStock && !product.inStock) {
        return false;
      }

      // Price filter
      if (filters.minPrice !== undefined && product.basePrice < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && product.basePrice > filters.maxPrice) {
        return false;
      }

      // Search term
      if (filters.search && filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchName = product.name.toLowerCase().includes(query);
        const matchNameEn = product.nameEn.toLowerCase().includes(query);
        const matchBrand = product.brand.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        if (!matchName && !matchNameEn && !matchBrand && !matchDesc) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.basePrice - b.basePrice;
        case 'price-desc':
          return b.basePrice - a.basePrice;
        case 'rating':
          return b.rating - a.rating;
        case 'featured':
        default:
          return (b.badge ? 1 : 0) - (a.badge ? 1 : 0);
      }
    });
}

/**
 * Generate human-readable order number.
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-4);
  const randomPart = Math.floor(100 + Math.random() * 900);
  return `MF-${timestamp}-${randomPart}`;
}

/**
 * Formats a clean WhatsApp order link for immediate messaging.
 */
export function generateWhatsAppMessage(
  orderNumber: string,
  customerName: string,
  phone: string,
  city: string,
  address: string,
  items: CartItem[],
  total: number,
  deliveryMethod: string
): string {
  const itemsText = items
    .map(
      (item, i) =>
        `${i + 1}. ${item.name} (${item.selectedStorage}) - لون: ${item.selectedColor.name} [الكمية: ${item.quantity}]`
    )
    .join('\n');

  const message = `مرحباً ممدوح فون، أريد تأكيد طلب الشراء التالي:
رقم الطلب: ${orderNumber}
الاسم: ${customerName}
رقم الهاتف: ${phone}
طريقة الاستلام: ${deliveryMethod === 'delivery' ? `توصيل منزلي (${city} - ${address})` : 'استلام من الفرع الرئيسي'}

المنتجات المطلوبة:
${itemsText}

المبلغ الإجمالي المستحق: ${formatPrice(total)}
برجاء التأكيد وتحديد موعد الاستلام. شكراً لكم!`;

  return encodeURIComponent(message);
}
