import { useEffect, useState } from 'react';
import { CheckCircle2, Minus, Plus, ShoppingBag, Tag, Trash2, X } from 'lucide-react';
import { Activity, CurrencyCode, PackageOption, formatPrice } from '../data/klookActivities';
import { ResilientImage } from './ResilientImage';

export interface BagItem {
  key: string;
  activity: Activity;
  selectedPackage: PackageOption;
  date: string;
  quantity: number;
}

interface BookingBagDrawerProps {
  isOpen: boolean;
  items: BagItem[];
  currency: CurrencyCode;
  onClose: () => void;
  onUpdateQuantity: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onClearBag: () => void;
}

interface ConfirmedReceipt {
  reference: string;
  travelerName: string;
  travelerEmail: string;
  totalFormatted: string;
  itemCount: number;
}

export function BookingBagDrawer({
  isOpen,
  items,
  currency,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearBag,
}: BookingBagDrawerProps) {
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [travelerName, setTravelerName] = useState('');
  const [travelerEmail, setTravelerEmail] = useState('');
  const [travelerPhone, setTravelerPhone] = useState('');
  const [confirmedReceipt, setConfirmedReceipt] = useState<ConfirmedReceipt | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtotalSgd = items.reduce(
    (sum, item) => sum + item.selectedPackage.priceSgd * item.quantity,
    0
  );
  const discountSgd = promoApplied ? subtotalSgd * 0.1 : 0;
  const finalTotalSgd = Math.max(0, subtotalSgd - discountSgd);

  const handleApplyPromo = () => {
    const normalized = promoInput.trim().toUpperCase();
    if (normalized === 'KL10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoApplied(false);
      setPromoError('Try code KL10 for 10% off Kuala Lumpur attractions.');
    }
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    const refNumber = `KL-${Math.floor(100000 + Math.random() * 900000)}`;
    const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
    setConfirmedReceipt({
      reference: refNumber,
      travelerName: travelerName.trim() || 'Guest Traveler',
      travelerEmail: travelerEmail.trim(),
      totalFormatted: formatPrice(finalTotalSgd, currency),
      itemCount: totalCount,
    });
    onClearBag();
    setPromoApplied(false);
    setPromoInput('');
  };

  const handleCloseDrawer = () => {
    setConfirmedReceipt(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Booking bag"
      onClick={handleCloseDrawer}
    >
      <aside
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8EAED]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#FF5B00]" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-[#1E2022]">
              Booking bag
            </h2>
            {items.length > 0 && (
              <span className="text-xs font-medium text-[#6B7280] tabular-nums">
                ({items.reduce((s, i) => s + i.quantity, 0)} tickets)
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleCloseDrawer}
            aria-label="Close booking bag"
            className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center text-[#4B5563] hover:bg-[#F3F4F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B00]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {confirmedReceipt ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#ECFDF5] flex items-center justify-center text-[#059669]">
                <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#059669]">
                  Instant confirmation complete
                </div>
                <h3 className="font-display text-xl font-bold text-[#1E2022] mt-1">
                  Booking #{confirmedReceipt.reference} Confirmed
                </h3>
                <p className="text-sm text-[#4B5563] mt-2">
                  E-vouchers for {confirmedReceipt.itemCount} ticket(s) have been issued to{' '}
                  <span className="font-medium text-[#1E2022]">
                    {confirmedReceipt.travelerEmail}
                  </span>
                  .
                </p>
              </div>
              <div className="bg-[#F7F8FA] border border-[#E8EAED] rounded-xl p-4 text-left text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Lead traveler</span>
                  <span className="font-medium text-[#1E2022]">
                    {confirmedReceipt.travelerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Total paid</span>
                  <span className="font-bold text-[#1E2022] tabular-nums">
                    {confirmedReceipt.totalFormatted}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Voucher format</span>
                  <span className="font-medium text-[#0F766E]">Mobile QR e-ticket</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="w-full py-3 px-4 rounded-xl bg-[#FF5B00] text-white font-semibold text-sm hover:bg-[#E04F00] transition-colors"
              >
                Continue exploring Kuala Lumpur
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-14 h-14 rounded-full bg-[#F7F8FA] flex items-center justify-center text-[#9CA3AF] mb-4">
                <ShoppingBag className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-display text-base font-semibold text-[#1E2022]">
                Your booking bag is empty
              </h3>
              <p className="text-sm text-[#6B7280] mt-1.5 max-w-[260px]">
                Select any Kuala Lumpur attraction, tour, or pass to lock in instant e-tickets.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Items */}
              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={item.key}
                    className="flex gap-3.5 p-3 rounded-xl border border-[#E8EAED] bg-white"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F7F8FA] shrink-0">
                      <ResilientImage
                        src={item.activity.image}
                        alt={item.activity.imageAlt}
                        fallbackTitle={item.activity.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display text-sm font-semibold text-[#1E2022] line-clamp-2 leading-snug">
                          {item.activity.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.key)}
                          aria-label={`Remove ${item.activity.title}`}
                          className="text-[#9CA3AF] hover:text-[#DC2626] p-1 -mr-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                      <div className="text-xs text-[#6B7280] mt-1 truncate">
                        {item.selectedPackage.name}
                      </div>
                      <div className="text-xs text-[#6B7280] mt-0.5 tabular-nums">
                        Date: {item.date}
                      </div>
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.key, -1)}
                            aria-label="Decrease ticket count"
                            className="w-7 h-7 rounded border border-[#D1D5DB] flex items-center justify-center text-[#1E2022] hover:bg-[#F3F4F6]"
                          >
                            <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <span className="text-xs font-semibold tabular-nums w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.key, 1)}
                            aria-label="Increase ticket count"
                            className="w-7 h-7 rounded border border-[#D1D5DB] flex items-center justify-center text-[#1E2022] hover:bg-[#F3F4F6]"
                          >
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-[#1E2022] tabular-nums">
                          {formatPrice(item.selectedPackage.priceSgd * item.quantity, currency)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Promo Code */}
              <div className="pt-3 border-t border-[#E8EAED]">
                <label
                  htmlFor="klook-promo-input"
                  className="block text-xs font-semibold text-[#1E2022] mb-1.5"
                >
                  Promo code (try KL10)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag
                      className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      id="klook-promo-input"
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Enter promo code"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-[#D1D5DB] rounded-lg focus:outline-none focus:border-[#FF5B00]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#D1D5DB] text-[#1E2022] hover:bg-[#F3F4F6] whitespace-nowrap shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-xs text-[#0F766E] mt-1.5 font-medium">
                    Code KL10 applied: 10% destination discount active.
                  </p>
                )}
                {promoError && (
                  <p className="text-xs text-[#B45309] mt-1.5">{promoError}</p>
                )}
              </div>

              {/* Traveler Checkout Info */}
              <form
                id="checkout-form"
                onSubmit={handleConfirmBooking}
                className="pt-3 border-t border-[#E8EAED] space-y-3"
              >
                <div className="text-xs font-semibold text-[#1E2022]">
                  Lead traveler details (for QR e-vouchers)
                </div>
                <input
                  type="text"
                  required
                  value={travelerName}
                  onChange={(e) => setTravelerName(e.target.value)}
                  placeholder="Full name (as on passport)"
                  className="w-full px-3 py-2 text-sm border border-[#D1D5DB] rounded-lg focus:outline-none focus:border-[#FF5B00]"
                />
                <input
                  type="email"
                  required
                  value={travelerEmail}
                  onChange={(e) => setTravelerEmail(e.target.value)}
                  placeholder="Email address for e-tickets"
                  className="w-full px-3 py-2 text-sm border border-[#D1D5DB] rounded-lg focus:outline-none focus:border-[#FF5B00]"
                />
                <input
                  type="tel"
                  required
                  value={travelerPhone}
                  onChange={(e) => setTravelerPhone(e.target.value)}
                  placeholder="Mobile number (e.g. +65 9123 4567)"
                  className="w-full px-3 py-2 text-sm border border-[#D1D5DB] rounded-lg focus:outline-none focus:border-[#FF5B00]"
                />
              </form>
            </div>
          )}
        </div>

        {/* Sticky Checkout Footer */}
        {items.length > 0 && !confirmedReceipt && (
          <div className="border-t border-[#E8EAED] p-5 bg-[#F7F8FA] space-y-3 shrink-0">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-[#4B5563]">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatPrice(subtotalSgd, currency)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-[#0F766E]">
                  <span>Promo (KL10)</span>
                  <span className="tabular-nums">-{formatPrice(discountSgd, currency)}</span>
                </div>
              )}
              <div className="flex justify-between pt-1.5 border-t border-[#E5E7EB] font-bold text-[#1E2022] text-base">
                <span>Total</span>
                <span className="tabular-nums text-[#FF5B00]">
                  {formatPrice(finalTotalSgd, currency)}
                </span>
              </div>
            </div>
            <button
              type="submit"
              form="checkout-form"
              className="w-full py-3 px-4 rounded-xl bg-[#FF5B00] text-white font-semibold text-sm hover:bg-[#E04F00] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF5B00]"
            >
              Confirm booking
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
