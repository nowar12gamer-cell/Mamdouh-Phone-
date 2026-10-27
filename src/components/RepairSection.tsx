import { useState } from 'react';
import { Wrench, Clock, ShieldCheck, CheckCircle2, Phone, Calendar, Send } from 'lucide-react';
import { calculateRepairEstimate, formatPrice } from '../utils/shopLogic';
import { REPAIR_IMAGE, STORE_BRANCHES } from '../data/products';

export function RepairSection() {
  const [selectedBrand, setSelectedBrand] = useState('Apple');
  const [phoneModel, setPhoneModel] = useState('iPhone 15 / 16 Pro');
  const [serviceType, setServiceType] = useState<'screen' | 'battery' | 'camera' | 'charging_port' | 'back_glass'>('screen');
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(STORE_BRANCHES[0].name);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const quote = calculateRepairEstimate(phoneModel, serviceType);

  const phoneModelsByBrand: Record<string, string[]> = {
    Apple: ['iPhone 16 Pro Max', 'iPhone 16 / 16 Plus', 'iPhone 15 Pro / Max', 'iPhone 14 / 13 Pro', 'iPhone 12 / 11'],
    Samsung: ['Galaxy S25 Ultra', 'Galaxy S24 / S24+', 'Galaxy S23 Ultra', 'Galaxy Z Flip / Fold', 'Galaxy A55 / A54'],
    Xiaomi: ['Xiaomi 15 / 15 Pro', 'Xiaomi 14 / 14T Pro', 'POCO F6 Pro', 'Redmi Note 13 Pro+'],
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;
    setBookingConfirmed(true);
  };

  return (
    <section id="repair" className="py-16 lg:py-20 bg-[#090d14] border-t border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-cyan-400 mb-2">
            <Wrench className="w-4 h-4" />
            <span>مركز الصيانة الفورية المعتمد</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            قطع غيار أصلية 100% مع ضمان فوري معتمد
          </h2>
          <p className="text-sm text-slate-400">
            أصلح هاتفك في أقل من ساعة على أيدي مهندسين معتمدين، باستخدام أحدث أجهزة الليزر وفك وتركيب الشاشات والبطاريات.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Repair Calculator (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span>احسب تكلفة صيانة هاتفك فورياً</span>
            </h3>

            {/* Brand tabs */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-400 mb-2">اختر الشركة المصنعة:</label>
              <div className="flex flex-wrap gap-2">
                {['Apple', 'Samsung', 'Xiaomi'].map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => {
                      setSelectedBrand(brand);
                      setPhoneModel(phoneModelsByBrand[brand][0]);
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      selectedBrand === brand
                        ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-850 text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {brand === 'Apple' ? 'آبل (Apple)' : brand === 'Samsung' ? 'سامسونج (Samsung)' : 'شاومي (Xiaomi)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Model select */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-400 mb-2">موديل الهاتف:</label>
              <select
                value={phoneModel}
                onChange={(e) => setPhoneModel(e.target.value)}
                className="w-full bg-slate-800 text-slate-100 border border-slate-700 rounded-lg p-3 text-sm focus:border-cyan-500 outline-none cursor-pointer"
              >
                {phoneModelsByBrand[selectedBrand]?.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Type Selection */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-400 mb-2">نوع العطل المطلوب إصلاحه:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'screen', label: 'تغيير شاشة أصلية' },
                  { id: 'battery', label: 'استبدال بطارية' },
                  { id: 'camera', label: 'إصلاح الكاميرا' },
                  { id: 'charging_port', label: 'منفذ الشحن' },
                  { id: 'back_glass', label: 'الظهر الزجاجي' },
                ].map((srv) => {
                  const isSelected = serviceType === srv.id;
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setServiceType(srv.id as any)}
                      className={`p-3 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500 shadow-sm'
                          : 'bg-slate-850 text-slate-300 border-slate-750 hover:border-slate-700'
                      }`}
                    >
                      {srv.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quote result card */}
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block mb-1">{quote.serviceTitle}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-cyan-400 font-mono tabular-nums">
                    {formatPrice(quote.estimatedCost)}
                  </span>
                  <span className="text-xs text-slate-400">(تقريبي شامل التركيب والضمان)</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-300 border-t sm:border-t-0 sm:border-r border-slate-700 pt-2 sm:pt-0 sm:pr-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>الوقت المتوقع: {quote.durationMinutes} دقيقة</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>الضمان: {quote.warrantyMonths} أشهر</span>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            {!bookingConfirmed ? (
              <form onSubmit={handleBookingSubmit} className="mt-6 pt-6 border-t border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white">احجز موعدك لتفادي الانتظار:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">اسم العميل:</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: أحمد محمود"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">رقم الهاتف (واتساب):</label>
                    <input
                      type="tel"
                      required
                      placeholder="01xxxxxxxxx"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">الفرع المفضل للاستلام:</label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-lg p-2 text-xs outline-none cursor-pointer"
                  >
                    {STORE_BRANCHES.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name} ({b.address})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>تأكيد حجز موعد الصيانة</span>
                </button>
              </form>
            ) : (
              <div className="mt-6 p-5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-right">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>تم تأكيد حجز موعد الصيانة بنجاح!</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  شكراً لك يا <strong>{customerName}</strong>. تم تسجيل موعد إصلاح ({phoneModel} - {quote.serviceTitle}) في {selectedBranch}. مهندس الصيانة في انتظارك مع توفير قطع الغيار الأصلية.
                </p>
                <a
                  href={`https://wa.me/201012345678?text=${encodeURIComponent(
                    `مرحباً ممدوح فون، حجزت موعد صيانة لهاتف ${phoneModel} (${quote.serviceTitle}). الاسم: ${customerName}، الهاتف: ${customerPhone} في ${selectedBranch}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>متابعة تفاصيل الحجز عبر واتساب</span>
                </a>
              </div>
            )}
          </div>

          {/* Workbench Image & Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl overflow-hidden border border-slate-750 bg-slate-900 shadow-xl">
              <img
                src={REPAIR_IMAGE}
                alt="معمل صيانة ممدوح فون المتخصص"
                referrerPolicy="no-referrer"
                className="w-full aspect-16/10 object-cover"
              />
              <div className="p-5">
                <h4 className="text-sm font-bold text-white mb-2">فحص مجاني شامل قبل الإصلاح</h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  يقوم فريقنا بفحص دوائر الشحن، استجابة اللمس، صحة البطارية، وجودة العدسات بدون أي رسوم فحص إذا تمت الصيانة لدينا.
                </p>
                <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-400 border-t border-slate-800 pt-3">
                  <div>
                    <span className="text-cyan-400 font-bold block">أجهزة ليزر دقيقة</span>
                    <span>لفك الزجاج بدون حرارة زائدة</span>
                  </div>
                  <div>
                    <span className="text-cyan-400 font-bold block">شهادة ضمان مكتوبة</span>
                    <span>سارية في جميع فروعنا</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick emergency call */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">تحتاج استشارة فنية فورية؟</span>
                <div className="text-sm font-bold text-white">تحدث مع مسؤول الصيانة مباشرة</div>
              </div>
              <a
                href="tel:01012345678"
                className="px-3.5 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>اتصل الآن</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
