/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowLeftRight, Check, X, Sparkles, Phone, MessageSquare } from 'lucide-react';
import { Brand, CartItem, ColorOption, FilterState, Product, ProductVariant } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { calculateCartTotals, filterProducts } from './utils/shopLogic';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { ComparisonModal } from './components/ComparisonModal';
import { RepairSection } from './components/RepairSection';
import { TradeInModal } from './components/TradeInModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';

export default function App() {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    brand: 'all',
    search: '',
    category: 'all',
    onlyInStock: false,
    sortBy: 'featured',
  });

  // Modals & Drawers
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isTradeInOpen, setIsTradeInOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Comparison list
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoDiscountPct, setPromoDiscountPct] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return filterProducts(products, filters);
  }, [products, filters]);

  // Cart Totals
  const cartTotals = useMemo(() => {
    return calculateCartTotals(cartItems, promoDiscountPct);
  }, [cartItems, promoDiscountPct]);

  // Helper to show brief feedback toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Add item to cart
  const handleAddToCart = (
    product: Product,
    variant: ProductVariant,
    color: ColorOption,
    quantity: number
  ) => {
    const unitPrice = product.basePrice + variant.priceDelta;
    const cartItemId = `${product.id}-${variant.storage}-${color.name}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          nameEn: product.nameEn,
          price: unitPrice,
          image: product.image,
          selectedColor: color,
          selectedStorage: variant.storage,
          quantity,
        },
      ];
    });

    showToast(`تمت إضافة ${product.name} إلى السلة`);
  };

  // Quick add from card (uses first variant & first color)
  const handleQuickAdd = (product: Product) => {
    const variant = product.storageVariants[0] || { storage: 'القياسي', priceDelta: 0 };
    const color = product.colors[0] || { name: 'افتراضي', nameEn: 'Default', hex: '#888' };
    handleAddToCart(product, variant, color, 1);
  };

  // Compare toggles
  const handleToggleCompare = (product: Product) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        showToast('يمكنك مقارنة 3 أجهزة كحد أقصى في وقت واحد');
        return prev;
      }
      showToast(`تمت إضافة ${product.name} للمقارنة`);
      return [...prev, product];
    });
  };

  const handleApplyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'PZ10' || clean.startsWith('TRADEIN-')) {
      setPromoDiscountPct(10);
      return true;
    }
    return false;
  };

  const handleNavClick = (sectionId: string) => {
    if (sectionId === 'smartphones') {
      setFilters((f) => ({ ...f, category: 'smartphones', brand: 'all' }));
      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'accessories') {
      setFilters((f) => ({ ...f, category: 'accessories', brand: 'all' }));
      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'trade-in') {
      setIsTradeInOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl border border-cyan-500/40 shadow-xl shadow-cyan-950/40 flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <Check className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Comparison Tray (if items in compare) */}
      {comparedProducts.length > 0 && (
        <div className="fixed bottom-6 left-6 z-40 bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 rounded-xl p-3 shadow-2xl flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white">
              المقارنة ({comparedProducts.length}/3)
            </span>
          </div>
          <button
            onClick={() => setIsCompareOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors cursor-pointer"
          >
            عرض جدول المقارنة
          </button>
          <button
            onClick={() => setComparedProducts([])}
            aria-label="مسح المقارنة"
            className="text-slate-400 hover:text-rose-400 transition-colors p-1 cursor-pointer"
            title="إفراغ المقارنة"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <Header
        cartCount={cartTotals.itemsCount}
        compareCount={comparedProducts.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenRepair={() => {
          document.getElementById('repair')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onSelectNav={handleNavClick}
        activeBrand={filters.brand}
        onSelectBrand={(brand) => setFilters((f) => ({ ...f, brand }))}
      />

      {/* Hero Section */}
      <Hero
        onExploreClick={() => {
          document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onTradeInClick={() => setIsTradeInOpen(true)}
        onRepairClick={() => {
          document.getElementById('repair')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Catalog Section */}
      <main id="catalog" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* Section title & search bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-white">
              {filters.category === 'accessories' ? 'الإكسسوارات والشواحن الأصلية' : 'أحدث الهواتف الذكية'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              جميع الأجهزة جديدة ومغلقة بتغليف المصنع الأصلي مع فاتورة ضريبية رسمية وضمان معتمد.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث باسم الهاتف، الماركة، أو المواصفة..."
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-750 focus:border-cyan-500 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
            />
            {filters.search && (
              <button
                onClick={() => setFilters((f) => ({ ...f, search: '' }))}
                aria-label="مسح البحث"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
          
          {/* Brand Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'Apple', label: 'آبل (Apple)' },
              { id: 'Samsung', label: 'سامسونج (Samsung)' },
              { id: 'Xiaomi', label: 'شاومي (Xiaomi)' },
              { id: 'Google', label: 'جوجل بيكسل' },
              { id: 'Accessories', label: 'إكسسوارات' },
            ].map((tab) => {
              const isSelected = filters.brand === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilters((f) => ({ ...f, brand: tab.id as Brand }))}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-black shadow-sm font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Quick Controls: Stock filter and Sort */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.onlyInStock}
                onChange={(e) => setFilters((f) => ({ ...f, onlyInStock: e.target.checked }))}
                className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span>المتوفر فورياً فقط</span>
            </label>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">الترتيب:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value as any }))}
                className="bg-slate-900 text-slate-200 border border-slate-750 rounded-lg py-1.5 px-3 text-xs outline-none cursor-pointer"
              >
                <option value="featured">المميز والأحدث</option>
                <option value="price-asc">السعر: من الأقل للأعلى</option>
                <option value="price-desc">السعر: من الأعلى للأقل</option>
                <option value="rating">التقييم الأعلى</option>
              </select>
            </div>
          </div>

        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 p-8">
            <p className="text-base font-bold text-slate-300 mb-2">لا توجد منتجات تطابق معايير البحث الحالية.</p>
            <p className="text-xs text-slate-400 mb-6">جرب مسح البحث أو تغيير التصنيف المختار.</p>
            <button
              onClick={() =>
                setFilters({
                  brand: 'all',
                  search: '',
                  category: 'all',
                  onlyInStock: false,
                  sortBy: 'featured',
                })
              }
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isCompared = comparedProducts.some((p) => p.id === product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickAdd={handleQuickAdd}
                  onOpenDetails={setSelectedProductForModal}
                  onToggleCompare={handleToggleCompare}
                  isCompared={isCompared}
                />
              );
            })}
          </div>
        )}

      </main>

      {/* Repair Section */}
      <RepairSection />

      {/* Footer */}
      <Footer />

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={handleAddToCart}
        onToggleCompare={handleToggleCompare}
        onOpenCart={() => setIsCartOpen(true)}
        isCompared={
          selectedProductForModal
            ? comparedProducts.some((p) => p.id === selectedProductForModal.id)
            : false
        }
      />

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        comparedProducts={comparedProducts}
        onRemove={(id) => setComparedProducts((prev) => prev.filter((p) => p.id !== id))}
        onSelectProductForCompare={(product) => {
          if (!comparedProducts.some((p) => p.id === product.id) && comparedProducts.length < 3) {
            setComparedProducts((prev) => [...prev, product]);
          }
        }}
        availableProducts={products}
        onAddToCart={(p) => {
          handleQuickAdd(p);
          setIsCompareOpen(false);
          setIsCartOpen(true);
        }}
      />

      {/* Trade-In Modal */}
      <TradeInModal
        isOpen={isTradeInOpen}
        onClose={() => setIsTradeInOpen(false)}
        onApplyCoupon={(code) => {
          handleApplyPromoCode(code);
          showToast('تم تطبيق كود خصم الاستبدال بنجاح!');
        }}
      />

      {/* Shopping Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        totals={cartTotals}
        onUpdateQuantity={(itemId, qty) => {
          if (qty <= 0) {
            setCartItems((prev) => prev.filter((item) => item.id !== itemId));
          } else {
            setCartItems((prev) =>
              prev.map((item) => (item.id === itemId ? { ...item, quantity: qty } : item))
            );
          }
        }}
        onRemoveItem={(itemId) => {
          setCartItems((prev) => prev.filter((item) => item.id !== itemId));
        }}
        onClearCart={() => setCartItems([])}
        promoDiscountPct={promoDiscountPct}
        onApplyPromoCode={handleApplyPromoCode}
      />

    </div>
  );
}
