import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCartTotals,
  estimateTradeInValue,
  calculateRepairEstimate,
  filterProducts,
  generateOrderNumber,
  formatPrice,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE
} from './shopLogic';
import { CartItem, Product, FilterState } from '../types';

test('formatPrice formats amounts with comma separators and currency label', () => {
  assert.equal(formatPrice(68500), '68,500 ج.م');
  assert.equal(formatPrice(1200), '1,200 ج.م');
});

test('calculateCartTotals calculates subtotal, discounts and applies shipping thresholds correctly', () => {
  const mockItems: CartItem[] = [
    {
      id: 'item-1',
      productId: 'p-1',
      name: 'iPhone 16 Pro Max',
      nameEn: 'iPhone 16 Pro Max',
      price: 2000,
      image: '/test.jpg',
      selectedColor: { name: 'تيتانيوم طبيعي', nameEn: 'Natural Titanium', hex: '#8a8885' },
      selectedStorage: '256GB',
      quantity: 1,
    },
  ];

  // Under threshold (2000 < 3000): should have shipping fee
  const totals1 = calculateCartTotals(mockItems, 0);
  assert.equal(totals1.subtotal, 2000);
  assert.equal(totals1.isFreeShipping, false);
  assert.equal(totals1.shipping, STANDARD_SHIPPING_FEE);
  assert.equal(totals1.total, 2000 + STANDARD_SHIPPING_FEE);
  assert.equal(totals1.thresholdRemaining, 1000);

  // Above threshold (4000 >= 3000): free shipping
  const mockItemsAbove: CartItem[] = [
    ...mockItems,
    {
      id: 'item-2',
      productId: 'p-2',
      name: 'AirPods Pro 2',
      nameEn: 'AirPods Pro 2',
      price: 2000,
      image: '/test2.jpg',
      selectedColor: { name: 'أبيض', nameEn: 'White', hex: '#ffffff' },
      selectedStorage: 'قياسي',
      quantity: 1,
    },
  ];

  const totals2 = calculateCartTotals(mockItemsAbove, 10); // 10% discount
  assert.equal(totals2.subtotal, 4000);
  assert.equal(totals2.discount, 400);
  assert.equal(totals2.isFreeShipping, true);
  assert.equal(totals2.shipping, 0);
  assert.equal(totals2.total, 3600);
  assert.equal(totals2.thresholdRemaining, 0);
});

test('estimateTradeInValue applies condition and storage multipliers', () => {
  const resultLikeNew = estimateTradeInValue({
    baseValuation: 10000,
    condition: 'like_new',
    storageGb: 256,
  });
  // 10000 * 0.95 * 1.05 = 9975
  assert.equal(resultLikeNew.estimatedValue, 9975);
  assert.match(resultLikeNew.discountCouponCode, /^TRADEIN-\d{4}$/);

  const resultDamaged = estimateTradeInValue({
    baseValuation: 10000,
    condition: 'damaged',
    storageGb: 128,
  });
  // 10000 * 0.35 * 1.0 = 3500
  assert.equal(resultDamaged.estimatedValue, 3500);
});

test('calculateRepairEstimate returns sensible estimates and warranty periods', () => {
  const screenQuote = calculateRepairEstimate('iPhone 16 Pro Max', 'screen');
  assert.equal(screenQuote.warrantyMonths, 12);
  assert.ok(screenQuote.estimatedCost > 0);
  assert.equal(screenQuote.durationMinutes, 60);

  const batteryQuote = calculateRepairEstimate('Galaxy S24', 'battery');
  assert.equal(batteryQuote.warrantyMonths, 6);
  assert.ok(batteryQuote.estimatedCost > 0);
});

test('filterProducts filters by brand, category, in-stock and search term', () => {
  const sampleProducts: Product[] = [
    {
      id: '1',
      name: 'آبل ايفون 16 برو',
      nameEn: 'Apple iPhone 16 Pro',
      brand: 'Apple',
      category: 'smartphones',
      basePrice: 55000,
      image: '/img1.jpg',
      rating: 4.9,
      reviewsCount: 42,
      inStock: true,
      warranty: 'ضمان سنة',
      description: 'هاتف ذكي قوي',
      colors: [],
      storageVariants: [],
    },
    {
      id: '2',
      name: 'سامسونج جالاكسي S25 الترا',
      nameEn: 'Samsung Galaxy S25 Ultra',
      brand: 'Samsung',
      category: 'smartphones',
      basePrice: 52000,
      image: '/img2.jpg',
      rating: 4.8,
      reviewsCount: 30,
      inStock: false,
      warranty: 'ضمان سنتين',
      description: 'هاتف سامسونج الترا',
      colors: [],
      storageVariants: [],
    },
  ];

  const brandFiltered = filterProducts(sampleProducts, {
    brand: 'Samsung',
    search: '',
    category: 'all',
    onlyInStock: false,
    sortBy: 'featured',
  });
  assert.equal(brandFiltered.length, 1);
  assert.equal(brandFiltered[0].id, '2');

  const stockFiltered = filterProducts(sampleProducts, {
    brand: 'all',
    search: '',
    category: 'all',
    onlyInStock: true,
    sortBy: 'featured',
  });
  assert.equal(stockFiltered.length, 1);
  assert.equal(stockFiltered[0].id, '1');

  const searchFiltered = filterProducts(sampleProducts, {
    brand: 'all',
    search: 'galaxy',
    category: 'all',
    onlyInStock: false,
    sortBy: 'featured',
  });
  assert.equal(searchFiltered.length, 1);
  assert.equal(searchFiltered[0].id, '2');
});

test('generateOrderNumber returns unique format MF-xxxx-xxx', () => {
  const orderNum = generateOrderNumber();
  assert.match(orderNum, /^MF-\d{4}-\d{3}$/);
});
