import { X, Trash2, Plus, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/shopLogic';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedProducts: Product[];
  onRemove: (productId: string) => void;
  onSelectProductForCompare: (product: Product) => void;
  availableProducts: Product[];
  onAddToCart: (product: Product) => void;
}

export function ComparisonModal({
  isOpen,
  onClose,
  comparedProducts,
  onRemove,
  onAddToCart,
  availableProducts,
  onSelectProductForCompare,
}: ComparisonModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-heading"
    >
      <div
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl p-6 sm:p-8 my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6">
          <div>
            <h2 id="compare-heading" className="text-xl sm:text-2xl font-bold text-white">
              مقارنة مواصفات الهواتف الذكية
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              قارن بين المعالج، دقة الكاميرات، سعة البطارية، والأسعار جنباً إلى جنب لتحديد اختيارك الأمثل.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق المقارنة"
            className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {comparedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm mb-4">لم تقم بإضافة أي هاتف إلى جدول المقارنة بعد.</p>
            <div className="flex flex-wrap justify-center gap-3">
              {availableProducts.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectProductForCompare(p)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>إضافة {p.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="py-4 px-3 text-xs font-bold text-slate-400 w-36">المواصفة / الجهاز</th>
                  {comparedProducts.map((p) => (
                    <th key={p.id} className="py-4 px-3 w-64 align-top">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-slate-800/80 rounded-xl p-2 mb-2 flex items-center justify-center border border-slate-750">
                          <img
                            src={p.image}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <h4 className="text-sm font-bold text-white line-clamp-2 mb-1">{p.name}</h4>
                        <div className="text-xs font-mono font-bold text-cyan-400 tabular-nums mb-3">
                          {formatPrice(p.basePrice)}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onAddToCart(p)}
                            className="px-3 py-1.5 rounded-md bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>شراء</span>
                          </button>
                          <button
                            onClick={() => onRemove(p.id)}
                            aria-label={`إزالة ${p.name}`}
                            className="p-1.5 rounded-md bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 border border-slate-700 cursor-pointer"
                            title="إزالة من المقارنة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                  {comparedProducts.length < 3 && (
                    <th className="py-4 px-3 w-48 text-center align-middle">
                      <div className="border border-dashed border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center">
                        <span className="text-xs text-slate-400 mb-2">أضف جهازاً آخر</span>
                        <select
                          onChange={(e) => {
                            const p = availableProducts.find((item) => item.id === e.target.value);
                            if (p) onSelectProductForCompare(p);
                            e.target.value = '';
                          }}
                          className="w-full text-xs bg-slate-800 text-slate-200 border border-slate-700 rounded p-1.5 cursor-pointer"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            اختر هاتف...
                          </option>
                          {availableProducts
                            .filter((p) => p.specs && !comparedProducts.some((c) => c.id === p.id))
                            .map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-400 bg-slate-850/40">المعالج</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="py-3 px-3 text-slate-200">
                      {p.specs?.processor || '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-400 bg-slate-850/40">الشاشة</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="py-3 px-3 text-slate-200">
                      {p.specs?.screen || '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-400 bg-slate-850/40">الرام والذاكرة</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="py-3 px-3 text-slate-200">
                      {p.specs?.ram || '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-400 bg-slate-850/40">الكاميرا الخلفية</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="py-3 px-3 text-slate-200">
                      {p.specs?.mainCamera || '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-400 bg-slate-850/40">البطارية وسرعة الشحن</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="py-3 px-3 text-slate-200">
                      {p.specs?.battery || '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-400 bg-slate-850/40">نظام التشغيل</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="py-3 px-3 text-slate-200">
                      {p.specs?.os || '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-400 bg-slate-850/40">الضمان المعتمد</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="py-3 px-3 text-slate-300">
                      {p.warranty}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
