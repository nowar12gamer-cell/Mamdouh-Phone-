import { ShoppingBag, ArrowLeftRight, Wrench, Search, PhoneCall, BadgeCheck, Sparkles } from 'lucide-react';
import { Brand } from '../types';

interface HeaderProps {
  cartCount: number;
  compareCount: number;
  onOpenCart: () => void;
  onOpenCompare: () => void;
  onOpenRepair: () => void;
  onSelectNav: (sectionId: string) => void;
  activeBrand: Brand;
  onSelectBrand: (brand: Brand) => void;
}

export function Header({
  cartCount,
  compareCount,
  onOpenCart,
  onOpenCompare,
  onOpenRepair,
  onSelectNav,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#0b0f17]/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Bar Contract: Zone 1 (Brand) — Zone 2 (4-5 Nav links) — Zone 3 (1 Primary Action group) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Zone with verified badge next to Mamdouh Phone */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 group"
          aria-label="ممدوح فون للصفحة الرئيسية"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/30 transform group-hover:scale-105 transition-transform">
            <span className="font-black text-sm tracking-tighter">MP</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="leading-none text-white font-black text-lg group-hover:text-cyan-300 transition-colors">
                ممدوح فون
              </span>
              {/* Verified Styling Mark */}
              <span
                className="inline-flex items-center justify-center text-cyan-400"
                title="علامة التوثيق والتنسيق الرسمية المعتمدة"
                aria-label="محل معتمد"
              >
                <BadgeCheck className="w-5 h-5 fill-cyan-500/20 text-cyan-400" />
              </span>
            </div>
            <span className="text-[10px] tracking-wider text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
              <span>MAMDOUH PHONE</span>
              <span className="text-cyan-400">· 3D STORE</span>
            </span>
          </div>
        </a>

        {/* Zone 2: 4–5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectNav('smartphones')}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            الهواتف الذكية
          </button>
          <button
            onClick={() => onSelectNav('accessories')}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            الإكسسوارات الأصلية
          </button>
          <button
            onClick={onOpenCompare}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>مقارنة الأجهزة</span>
            {compareCount > 0 && (
              <span className="text-xs bg-cyan-900/60 text-cyan-300 px-1.5 py-0.2 rounded font-mono tabular-nums">
                {compareCount}
              </span>
            )}
          </button>
          <button
            onClick={onOpenRepair}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>مركز الصيانة</span>
          </button>
          <button
            onClick={() => onSelectNav('trade-in')}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            استبدل هاتفك
          </button>
        </nav>

        {/* Zone 3: Primary Action buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="tel:01012345678"
            className="hidden lg:flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors pl-2 border-l border-slate-800"
            aria-label="اتصل بالمحل"
          >
            <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono tabular-nums" dir="ltr">010 1234 5678</span>
          </a>

          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-all cursor-pointer whitespace-nowrap shrink-0"
            aria-label={`سلة المشتريات (${cartCount} منتجات)`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>سلة المشتريات</span>
            <span className="bg-black/40 text-cyan-200 px-1.5 py-0.5 rounded text-[11px] font-mono tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}
