import { ShieldCheck, Truck, RefreshCw, Sparkles, ChevronDown, BadgeCheck } from 'lucide-react';
import { Phone3DCanvas } from './Phone3DCanvas';

interface HeroProps {
  onExploreClick: () => void;
  onTradeInClick: () => void;
  onRepairClick: () => void;
}

export function Hero({ onExploreClick, onTradeInClick, onRepairClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-slate-850">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-right">
            
            {/* Subtle clean kicker without pill box */}
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-4 tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ممدوح فون · الموزع المعتمد لأحدث الهواتف الذكية</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">معاينة تفاعلية ثلاثية الأبعاد 3D</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.25] tracking-tight mb-6 text-balance">
              عالم الموبايل بين يديك بتجربة 3D وبأفضل سعر وضمان
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
              في متجر <strong>ممدوح فون</strong> المعتمد، استكشف أحدث هواتف آبل، سامسونج، وشاومي في مساحة ثلاثية الأبعاد تفاعلية، مع ضمان الوكيل المحلي، وخدمة استبدال فوري وصيانة معتمدة لجميع الأعطال.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
              >
                تصفح العروض والمنتجات
              </button>

              <button
                onClick={onTradeInClick}
                className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all cursor-pointer whitespace-nowrap"
              >
                احسب سعر استبدال هاتفك
              </button>

              <button
                onClick={onRepairClick}
                className="px-4 py-3.5 rounded-xl text-slate-400 hover:text-cyan-400 font-medium text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                حجز موعد صيانة فوري
              </button>
            </div>

            {/* Key trust markers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10 pt-8 border-t border-slate-800/80 w-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">ضمان أصلي 100%</h4>
                  <p className="text-[11px] text-slate-400">ضمان وكيل محلي ودولي</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">توصيل فوري سريع</h4>
                  <p className="text-[11px] text-slate-400">شحن مجاني للطلبات فوق 3,000 ج.م</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">استبدال وتقسيط</h4>
                  <p className="text-[11px] text-slate-400">تثمين فوري لأعلى قيمة</p>
                </div>
              </div>
            </div>

          </div>

          {/* 3D Interactive Phone Showcase Column */}
          <div className="lg:col-span-5 relative">
            <Phone3DCanvas onExploreCatalog={onExploreClick} />
          </div>

        </div>
      </div>
    </section>
  );
}
