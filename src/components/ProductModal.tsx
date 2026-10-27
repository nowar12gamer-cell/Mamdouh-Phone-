import { useState } from 'react';
import { X, ShieldCheck, Truck, Check, Plus, Minus, ArrowLeftRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { ColorOption, Product, ProductVariant } from '../types';
import { formatPrice } from '../utils/shopLogic';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, color: ColorOption, quantity: number) => void;
  onToggleCompare: (product: Product) => void;
  isCompared: boolean;
  onOpenCart?: () => void;
}

export function ProductModal({
  product,
  onClose,
  onAddToCart,
  onToggleCompare,
  isCompared,
  onOpenCart,
}: ProductModalProps) {
  if (!product) return null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.storageVariants[0] || { storage: 'القياسي', priceDelta: 0 }
  );
  const [selectedColor, setSelectedColor] = useState<ColorOption>(
    product.colors[0] || { name: 'افتراضي', nameEn: 'Default', hex: '#888' }
  );
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const currentPrice = product.basePrice + selectedVariant.priceDelta;

  const handleAddToCart = () => {
    onAddToCart(product, selectedVariant, selectedColor, quantity);
    setAddedAnimation(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-title"
    >
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="إغلاق تفاصيل المنتج"
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-slate-800/90 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-800">
          
          {/* Gallery / Left Side (5 cols) */}
          <div className="md:col-span-5 p-6 bg-[#0f141f] flex flex-col items-center justify-center">
            <div className="w-full aspect-square relative rounded-xl bg-slate-900/50 p-6 flex items-center justify-center border border-slate-800/80">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
              {product.badge && (
                <span className="absolute top-3 right-3 text-xs font-semibold text-cyan-300 bg-cyan-950/90 border border-cyan-800 px-2 py-0.5 rounded">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Quick guarantees */}
            <div className="w-full mt-6 space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{product.warranty}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>توصيل فوري خلال 24 ساعة مع فحص واستلام باليد</span>
              </div>
            </div>

            {product.specs && (
              <button
                onClick={() => onToggleCompare(product)}
                className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-colors cursor-pointer ${
                  isCompared
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>{isCompared ? 'تمت إضافة الجهاز للمقارنة' : 'إضافة إلى مقارنة المواصفات'}</span>
              </button>
            )}
          </div>

          {/* Details & Purchase / Right Side (7 cols) */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Brand */}
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold mb-2">
                <span>{product.brand}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">كود الموديل: {product.id}</span>
              </div>

              {/* Title */}
              <h2 id="product-title" className="text-2xl font-bold text-white mb-3">
                {product.name}
              </h2>

              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Storage Variant Selection */}
              {product.storageVariants.length > 0 && (
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    سعة التخزين:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.storageVariants.map((variant) => {
                      const isSelected = selectedVariant.storage === variant.storage;
                      return (
                        <button
                          key={variant.storage}
                          type="button"
                          onClick={() => setSelectedVariant(variant)}
                          className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          {variant.storage}
                          {variant.priceDelta > 0 && ` (+${formatPrice(variant.priceDelta)})`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-300">اللون المختار:</span>
                    <span className="text-cyan-400 font-medium">{selectedColor.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor.name === color.name;
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          aria-label={`اختيار لون ${color.name}`}
                          className={`relative w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                            isSelected ? 'scale-115 border-cyan-400 ring-2 ring-cyan-500/30' : 'border-slate-600'
                          }`}
                          style={{ backgroundColor: color.hex }}
                        >
                          {isSelected && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white drop-shadow" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Technical Specs Table if available */}
              {product.specs && (
                <div className="mb-6 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-slate-200 mb-2.5">المواصفات التقنية الرئيسية:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-800/60 p-2 rounded border border-slate-750">
                      <span className="text-slate-400 block text-[10px]">المعالج</span>
                      <span className="text-slate-200 font-medium">{product.specs.processor}</span>
                    </div>
                    <div className="bg-slate-800/60 p-2 rounded border border-slate-750">
                      <span className="text-slate-400 block text-[10px]">الشاشة</span>
                      <span className="text-slate-200 font-medium">{product.specs.screen}</span>
                    </div>
                    <div className="bg-slate-800/60 p-2 rounded border border-slate-750">
                      <span className="text-slate-400 block text-[10px]">البطارية والشحن</span>
                      <span className="text-slate-200 font-medium">{product.specs.battery}</span>
                    </div>
                    <div className="bg-slate-800/60 p-2 rounded border border-slate-750">
                      <span className="text-slate-400 block text-[10px]">الكاميرا الرئيسية</span>
                      <span className="text-slate-200 font-medium">{product.specs.mainCamera}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions & Price */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-slate-400">السعر الإجمالي:</div>
                  <div className="text-2xl font-black text-white font-mono tabular-nums">
                    {formatPrice(currentPrice * quantity)}
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2 text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer"
                    aria-label="تقليل الكمية"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold font-mono tabular-nums text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-slate-400 hover:text-white cursor-pointer"
                    aria-label="زيادة الكمية"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {addedAnimation ? (
                <div className="flex gap-2">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
                  >
                    متابعة التسوق
                  </button>
                  {onOpenCart && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenCart();
                      }}
                      className="flex-1 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-lg shadow-cyan-600/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>عرض سلة المشتريات</span>
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-600/25 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>إضافة إلى سلة الشراء ({quantity})</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
