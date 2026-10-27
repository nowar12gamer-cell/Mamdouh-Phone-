import { Star, ShoppingCart, ArrowLeftRight, Check, Eye } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/shopLogic';

interface ProductCardProps {
  product: Product;
  onQuickAdd: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  isCompared: boolean;
}

export function ProductCard({
  product,
  onQuickAdd,
  onOpenDetails,
  onToggleCompare,
  isCompared,
}: ProductCardProps) {
  return (
    <div className="group relative flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-950/30 transition-all duration-300 transform hover:-translate-y-1.5 overflow-hidden hover:ring-1 hover:ring-cyan-500/20">
      
      {/* Top Media Container (~65% of upper card) */}
      <div className="relative aspect-4/3 w-full bg-[#121722] overflow-hidden flex items-center justify-center p-4">
        
        {/* Subtle Tag if exists */}
        {product.badge && (
          <div className="absolute top-3 right-3 z-10 text-[11px] font-semibold text-cyan-300 bg-cyan-950/80 backdrop-blur-sm border border-cyan-800/60 px-2 py-0.5 rounded">
            {product.badge}
          </div>
        )}

        {/* Compare Toggle Button */}
        {product.specs && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product);
            }}
            aria-label={isCompared ? `إزالة ${product.name} من المقارنة` : `إضافة ${product.name} للمقارنة`}
            className={`absolute top-3 left-3 z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              isCompared
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-750 backdrop-blur-sm'
            }`}
            title="مقارنة المواصفات"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        )}

        {/* Product Image with Fallback */}
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Quick View overlay on hover */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => onOpenDetails(product)}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900/95 text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 shadow-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>عرض المواصفات</span>
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Stock Status */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold tracking-wider uppercase text-cyan-400/90 text-[11px]">
              {product.brand}
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              {product.inStock ? (
                <span className="text-emerald-400 flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>متوفر بالمحل</span>
                </span>
              ) : (
                <span className="text-amber-400">طلب مسبق</span>
              )}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenDetails(product)}
            className="text-base font-bold text-white hover:text-cyan-400 transition-colors line-clamp-1 cursor-pointer mb-2"
          >
            {product.name}
          </h3>

          {/* Short specs line for phones */}
          {product.specs && (
            <p className="text-xs text-slate-400 line-clamp-1 mb-3">
              {product.specs.processor.split('(')[0]} · {product.specs.screen.split('بوصة')[0]}بوصة
            </p>
          )}

          {/* Color preview dots */}
          <div className="flex items-center gap-1.5 mb-4">
            <span className="text-[11px] text-slate-500 ml-1">الألوان:</span>
            {product.colors.map((c, idx) => (
              <span
                key={idx}
                className="w-3.5 h-3.5 rounded-full border border-slate-700 shadow-xs"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="text-lg font-bold text-white font-mono tabular-nums">
              {formatPrice(product.basePrice)}
            </div>
            {product.oldPrice && (
              <div className="text-[11px] text-slate-500 line-through font-mono tabular-nums">
                {formatPrice(product.oldPrice)}
              </div>
            )}
          </div>

          <button
            onClick={() => onQuickAdd(product)}
            aria-label={`إضافة ${product.name} للسلة`}
            className="p-2.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-500/30 transition-all cursor-pointer flex items-center justify-center shrink-0"
            title="إضافة سريعة للسلة"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
