import { useState } from 'react';
import { X, RefreshCw, Check, ArrowRight, Sparkles, Copy } from 'lucide-react';
import { estimateTradeInValue, formatPrice } from '../utils/shopLogic';
import { TRADE_IN_DEVICES } from '../data/products';

interface TradeInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCoupon: (code: string) => void;
}

export function TradeInModal({ isOpen, onClose, onApplyCoupon }: TradeInModalProps) {
  if (!isOpen) return null;

  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(256);
  const [selectedCondition, setSelectedCondition] = useState<'like_new' | 'good' | 'fair' | 'damaged'>('good');
  const [copied, setCopied] = useState(false);

  const currentDevice = TRADE_IN_DEVICES[selectedDeviceIndex] || TRADE_IN_DEVICES[0];

  const { estimatedValue, discountCouponCode } = estimateTradeInValue({
    baseValuation: currentDevice.baseValuation,
    condition: selectedCondition,
    storageGb: selectedStorage,
  });

  const handleCopyAndApply = () => {
    onApplyCoupon('PZ10'); // applies active promo discount
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tradein-heading"
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl p-6 sm:p-8 my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="إغلاق حاسبة الاستبدال"
          className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 text-cyan-400 text-xs font-semibold mb-2">
          <RefreshCw className="w-4 h-4" />
          <span>برنامج ممدوح فون للاستبدال الفوري 3D</span>
        </div>
        <h2 id="tradein-heading" className="text-xl sm:text-2xl font-bold text-white mb-2">
          احسب القيمة التقديرية لهاتفك القديم
        </h2>
        <p className="text-xs text-slate-300 mb-6 leading-relaxed">
          استبدل هاتفك الحالي بأحدث الهواتف الذكية وادفع الفرق فقط، أو احصل على قيمته نقداً فور الفحص بالفرع.
        </p>

        {/* Step 1: Select Device */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">هاتفك الحالي:</label>
            <select
              value={selectedDeviceIndex}
              onChange={(e) => setSelectedDeviceIndex(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 outline-none cursor-pointer"
            >
              {TRADE_IN_DEVICES.map((dev, idx) => (
                <option key={idx} value={idx}>
                  {dev.brand} {dev.model}
                </option>
              ))}
            </select>
          </div>

          {/* Storage */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">مساحة التخزين:</label>
            <div className="grid grid-cols-4 gap-2">
              {[128, 256, 512, 1024].map((gb) => (
                <button
                  key={gb}
                  type="button"
                  onClick={() => setSelectedStorage(gb)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    selectedStorage === gb
                      ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {gb >= 1024 ? '1 TB' : `${gb} GB`}
                </button>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">حالة الجهاز الفعلية:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'like_new', label: 'كأنه جديد', desc: 'بدون أي خدوش' },
                { id: 'good', label: 'جيد جداً', desc: 'استعمال خفيف' },
                { id: 'fair', label: 'مقبول', desc: 'خدوش سطحية' },
                { id: 'damaged', label: 'يحتاج صيانة', desc: 'كسر أو عطل' },
              ].map((c) => {
                const isSelected = selectedCondition === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCondition(c.id as any)}
                    className={`p-2.5 text-right rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500 shadow-sm'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xs font-bold">{c.label}</div>
                    <div className="text-[10px] text-slate-400">{c.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Valuation Result Box */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-slate-850 to-slate-800 border border-slate-700 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-400 block">القيمة التقديرية لاستبدال هذا الجهاز:</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                  {formatPrice(estimatedValue)}
                </span>
              </div>
            </div>
            
            <div className="text-right text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-750">
              <span className="text-emerald-400 font-bold block">✓ تقييم مبدئي فوري</span>
              <span>تخصم من قيمة أي هاتف جديد فور الفحص في الفرع</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleCopyAndApply}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>تم تفعيل كود الخصم في السلة!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>استخدم قسيمة الاستبدال للشراء الآن</span>
              </>
            )}
          </button>

          <a
            href={`https://wa.me/201012345678?text=${encodeURIComponent(
              `مرحباً ممدوح فون، أريد الاستفسار عن استبدال هاتفي (${currentDevice.brand} ${currentDevice.model} - ${selectedStorage}GB بحالة ${selectedCondition}) بقيمة تقديرية ${formatPrice(estimatedValue)}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors cursor-pointer text-center"
          >
            تأكيد التثمين عبر واتساب
          </a>
        </div>
      </div>
    </div>
  );
}
