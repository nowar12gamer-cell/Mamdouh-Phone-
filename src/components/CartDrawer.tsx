import { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, CheckCircle2, ShieldCheck, Tag, ExternalLink } from 'lucide-react';
import { CartItem, CartTotals, CustomerOrder } from '../types';
import { generateOrderNumber, generateWhatsAppMessage, formatPrice } from '../utils/shopLogic';
import { STORE_BRANCHES } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totals: CartTotals;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  promoDiscountPct: number;
  onApplyPromoCode: (code: string) => boolean;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  totals,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  promoDiscountPct,
  onApplyPromoCode,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmation'>('cart');
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // Checkout form fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('القاهرة');
  const [address, setAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedPickupBranch, setSelectedPickupBranch] = useState(STORE_BRANCHES[0].name);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card_on_delivery' | 'instapay'>('cod');
  const [notes, setNotes] = useState('');

  const [completedOrder, setCompletedOrder] = useState<CustomerOrder | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = onApplyPromoCode(promoInput.trim());
    if (success) {
      setPromoMessage('تم تفعيل الخصم بنجاح بنسبة 10%!');
    } else {
      setPromoMessage('كود الخصم غير صالح أو منتهي');
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) return;
    if (deliveryMethod === 'delivery' && !address) return;

    const orderNum = generateOrderNumber();
    const order: CustomerOrder = {
      customerName,
      phone,
      city: deliveryMethod === 'delivery' ? city : selectedPickupBranch,
      address: deliveryMethod === 'delivery' ? address : 'استلام ذاتي من الفرع',
      deliveryMethod,
      paymentMethod,
      notes,
      items,
      totals,
      orderNumber: orderNum,
      createdAt: new Date().toLocaleTimeString('ar-EG'),
    };

    setCompletedOrder(order);
    setStep('confirmation');
    onClearCart();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-xs flex justify-end"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-heading"
    >
      <div
        className="w-full max-w-lg bg-slate-900 h-full flex flex-col border-r sm:border-l border-slate-800 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            <h2 id="cart-heading" className="text-lg font-bold text-white">
              {step === 'cart'
                ? `سلة المشتريات (${totals.itemsCount})`
                : step === 'checkout'
                ? 'إتمام تفاصيل الطلب والتوصيل'
                : 'تم تأكيد طلبك بنجاح!'}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق سلة المشتريات"
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Notice */}
        {step !== 'confirmation' && (
          <div className="bg-slate-850 px-4 py-2.5 border-b border-slate-800">
            {totals.isFreeShipping ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <Truck className="w-4 h-4 shrink-0" />
                <span>تهانينا! طلبيتك مؤهلة للشحن المجاني السريع.</span>
              </div>
            ) : (
              <div className="text-xs text-slate-300">
                <span>أضف منتجات بقيمة </span>
                <span className="font-bold text-cyan-400 font-mono tabular-nums">
                  {totals.thresholdRemaining.toLocaleString('ar-EG')} ج.م
                </span>
                <span> للحصول على شحن مجاني فوري!</span>
              </div>
            )}
          </div>
        )}

        {/* Body View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {step === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-200 mb-1">سلتك فارغة حالياً</h3>
                  <p className="text-xs text-slate-400 max-w-xs mb-6">
                    استكشف أحدث الهواتف الذكية والإكسسوارات الأصلية وأضف ما يعجبك.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold cursor-pointer transition-colors"
                  >
                    تصفح منتجات المحل
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-850 border border-slate-750 flex items-center gap-3"
                    >
                      <div className="w-16 h-16 rounded-lg bg-slate-800 p-1 flex items-center justify-center shrink-0 border border-slate-700">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate mb-1">{item.name}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                          <span>{item.selectedStorage}</span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block border border-slate-600"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            <span>{item.selectedColor.name}</span>
                          </span>
                        </div>
                        <div className="text-xs font-bold text-cyan-400 font-mono tabular-nums">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>

                      {/* Quantity Steppers & Delete */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`حذف ${item.name} من السلة`}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center bg-slate-800 border border-slate-700 rounded-md">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-slate-400 hover:text-white cursor-pointer"
                            aria-label="تقليل"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold font-mono text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-slate-400 hover:text-white cursor-pointer"
                            aria-label="زيادة"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Promo Code Box */}
                  <form onSubmit={handleApplyPromo} className="pt-3">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">كود الخصم أو قسيمة الاستبدال:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="مثال: PZ10"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white uppercase outline-none focus:border-cyan-500 font-mono"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        تطبيق
                      </button>
                    </div>
                    {promoMessage && (
                      <p className={`text-[11px] mt-1.5 ${promoDiscountPct > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {promoMessage}
                      </p>
                    )}
                  </form>
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">طريقة الاستلام:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`py-2 px-3 rounded-lg border font-semibold text-center cursor-pointer transition-all ${
                      deliveryMethod === 'delivery'
                        ? 'bg-cyan-500 text-black border-cyan-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    توصيل للمنزل
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`py-2 px-3 rounded-lg border font-semibold text-center cursor-pointer transition-all ${
                      deliveryMethod === 'pickup'
                        ? 'bg-cyan-500 text-black border-cyan-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    استلام من الفرع
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="checkout-name" className="block font-semibold text-slate-300 mb-1">الاسم الكامل:</label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  placeholder="محمد أحمد علي"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label htmlFor="checkout-phone" className="block font-semibold text-slate-300 mb-1">رقم الهاتف (واتساب):</label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  placeholder="01xxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              {deliveryMethod === 'delivery' ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">المحافظة / المدينة:</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 outline-none cursor-pointer"
                      >
                        <option value="القاهرة">القاهرة</option>
                        <option value="الجيزة">الجيزة</option>
                        <option value="الإسكندرية">الإسكندرية</option>
                        <option value="القليوبية">القليوبية</option>
                        <option value="الشرقية">الشرقية</option>
                        <option value="الدقهلية">الدقهلية</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">المنطقة:</label>
                      <input
                        type="text"
                        placeholder="مدينة نصر / المعادي..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="checkout-address" className="block font-semibold text-slate-300 mb-1">العنوان بالتفصيل (اسم الشارع، رقم العمارة، الشقة):</label>
                    <textarea
                      id="checkout-address"
                      required
                      rows={2}
                      placeholder="شارع عباس العقاد، عمارة 15، الدور الرابع..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">اختر الفرع للاستلام:</label>
                  <select
                    value={selectedPickupBranch}
                    onChange={(e) => setSelectedPickupBranch(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 outline-none cursor-pointer"
                  >
                    {STORE_BRANCHES.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name} - {b.address}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Payment Method */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">طريقة الدفع:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'cod', label: 'دفع عند الاستلام كاش' },
                    { id: 'card_on_delivery', label: 'فيزا عند الاستلام' },
                    { id: 'instapay', label: 'إنستاباي / فودافون كاش' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentMethod(p.id as any)}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        paymentMethod === p.id
                          ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500 font-bold'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {step === 'confirmation' && completedOrder && (
            <div className="text-right py-4 space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-300">
                <div className="flex items-center gap-2 font-bold text-sm mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>تم تأكيد طلبك بنجاح!</span>
                </div>
                <p className="text-xs text-slate-300">
                  رقم الطلب الخاص بك هو:{' '}
                  <span className="font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                    {completedOrder.orderNumber}
                  </span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 text-xs space-y-2">
                <h4 className="font-bold text-white mb-2">ملخص بيانات العميل:</h4>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">الاسم:</span>
                  <span>{completedOrder.customerName}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">رقم الهاتف:</span>
                  <span className="font-mono" dir="ltr">{completedOrder.phone}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">طريقة الاستلام:</span>
                  <span>
                    {completedOrder.deliveryMethod === 'delivery'
                      ? `توصيل منزلي (${completedOrder.city} - ${completedOrder.address})`
                      : `استلام من (${completedOrder.city})`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">طريقة الدفع:</span>
                  <span>
                    {completedOrder.paymentMethod === 'cod'
                      ? 'نقداً عند الاستلام'
                      : completedOrder.paymentMethod === 'card_on_delivery'
                      ? 'بطاقة دفع عند الاستلام'
                      : 'محفظة إلكترونية / إنستاباي'}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-750 flex justify-between font-bold text-white">
                  <span>المبلغ الإجمالي المستحق:</span>
                  <span className="font-mono text-cyan-400">
                    {formatPrice(completedOrder.totals.total)}
                  </span>
                </div>
              </div>

              {/* Direct WhatsApp link */}
              <a
                href={`https://wa.me/201012345678?text=${generateWhatsAppMessage(
                  completedOrder.orderNumber,
                  completedOrder.customerName,
                  completedOrder.phone,
                  completedOrder.city,
                  completedOrder.address,
                  completedOrder.items,
                  completedOrder.totals.total,
                  completedOrder.deliveryMethod
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition-all cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>إرسال تفاصيل الفاتورة عبر واتساب المحل</span>
              </a>

              <button
                onClick={() => {
                  setStep('cart');
                  onClose();
                }}
                className="w-full py-2.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                العودة للتسوق
              </button>
            </div>
          )}
        </div>

        {/* Footer Summary / Actions */}
        {step !== 'confirmation' && items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#0f141f]">
            {/* Price lines */}
            <div className="space-y-1.5 text-xs text-slate-400 mb-3">
              <div className="flex justify-between">
                <span>إجمالي المنتجات:</span>
                <span className="font-mono font-medium text-slate-200 tabular-nums">
                  {formatPrice(totals.subtotal)}
                </span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>خصم كود الترويج ({promoDiscountPct}%):</span>
                  <span className="font-mono tabular-nums">
                    -{formatPrice(totals.discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>مصاريف الشحن والتوصيل:</span>
                <span className="font-mono font-medium text-slate-200 tabular-nums">
                  {totals.shipping === 0 ? 'مجاناً' : formatPrice(totals.shipping)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                <span>المجموع النهائي:</span>
                <span className="font-mono text-cyan-400 tabular-nums">
                  {formatPrice(totals.total)}
                </span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>متابعة إتمام الطلب</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-750 cursor-pointer"
                >
                  رجوع
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-600/25 transition-all cursor-pointer text-center"
                >
                  تأكيد وإرسال الطلب الآن
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
