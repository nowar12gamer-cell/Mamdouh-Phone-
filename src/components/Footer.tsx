import { Phone, MapPin, Clock, ShieldCheck, RefreshCw, Send } from 'lucide-react';
import { STORE_BRANCHES } from '../data/products';

export function Footer() {
  return (
    <footer className="bg-[#070a0f] border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          
          {/* Brand info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm">
                MP
              </div>
              <span className="text-lg font-black text-white">ممدوح فون | Mamdouh Phone</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              ممدوح فون - وجهتك الموثوقة الأولى لشراء الهواتف الذكية الأصلية من كبرى الشركات العالمية، مع ضمان محلي معتمد، تجربة معاينة 3D تفاعلية، وأقوى برامج الاستبدال الفوري.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://wa.me/201012345678"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-200 flex items-center gap-2 text-xs font-semibold transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>واتساب المبيعات</span>
              </a>
              <a
                href="tel:01012345678"
                className="px-3 py-2 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-200 flex items-center gap-2 text-xs font-semibold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>الخط الساخن</span>
              </a>
            </div>
          </div>

          {/* Branches (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>فروعنا ومراكز الخدمة المعتمدة</span>
            </h4>
            <div className="space-y-3">
              {STORE_BRANCHES.map((b) => (
                <div key={b.name} className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-white font-semibold text-xs mb-1">{b.name}</div>
                  <div className="text-slate-400 text-[11px] mb-1">{b.address}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{b.hours}</span>
                    </span>
                    <span dir="ltr">{b.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantees & Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white mb-2">سياسات وخدمات المتجر</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ضمان استبدال خلال 14 يوماً ضد عيوب الصناعة</span>
              </li>
              <li className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>تثمين واستبدال الهاتف القديم ودفع الفرق</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>فحص الأجهزة الأصلية بالرقم التسلسلي (IMEI)</span>
              </li>
              <li className="text-slate-500 pt-2 text-[11px]">
                جميع الأجهزة المباعة لدينا جديدة تماماً بتغليف المصنع الأصلي مع فاتورة ضريبية رسمية.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} ممدوح فون لتجارة وتوزيع الهواتف الذكية.
          </div>
          <div className="flex items-center gap-4">
            <span>سجل تجاري رقم 84920</span>
            <span aria-hidden="true">·</span>
            <span>بطاقة ضريبية معتمدة</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
