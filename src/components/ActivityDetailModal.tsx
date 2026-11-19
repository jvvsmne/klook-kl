import { useEffect, useState } from 'react';
import { Calendar, Check, Clock, MapPin, Minus, Plus, ShieldCheck, Star, X } from 'lucide-react';
import {
  Activity,
  CurrencyCode,
  PackageOption,
  formatPrice,
} from '../data/klookActivities';
import { ResilientImage } from './ResilientImage';

export interface BookingSelectionPayload {
  activity: Activity;
  selectedPackage: PackageOption;
  date: string;
  quantity: number;
}

interface ActivityDetailModalProps {
  activity: Activity | null;
  currency: CurrencyCode;
  onClose: () => void;
  onAddToBag: (payload: BookingSelectionPayload) => void;
}

function getDefaultDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

export function ActivityDetailModal({
  activity,
  currency,
  onClose,
  onAddToBag,
}: ActivityDetailModalProps) {
  const [selectedPkgId, setSelectedPkgId] = useState<string>('');
  const [date, setDate] = useState<string>(getDefaultDate);
  const [quantity, setQuantity] = useState<number>(2);

  useEffect(() => {
    if (activity && activity.packages.length > 0) {
      setSelectedPkgId(activity.packages[0].id);
      setQuantity(2);
      setDate(getDefaultDate());
    }
  }, [activity]);

  useEffect(() => {
    if (!activity) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activity, onClose]);

  if (!activity) return null;

  const selectedPackage =
    activity.packages.find((pkg) => pkg.id === selectedPkgId) ?? activity.packages[0];
  const totalSgd = selectedPackage.priceSgd * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToBag({
      activity,
      selectedPackage,
      date,
      quantity,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-[2px] p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="activity-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8EAED] shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#6B7280] truncate pr-4">
            <span className="font-semibold text-[#FF5B00]">{activity.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{activity.location}</span>
            <span aria-hidden="true">·</span>
            <span>{activity.bookedLabel}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close activity details"
            className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#1E2022] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B00]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Two-Column PDP Layout */}
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
            {/* Left Details Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#F7F8FA]">
                <ResilientImage
                  src={activity.image}
                  alt={activity.imageAlt}
                  fallbackTitle={activity.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h2
                  id="activity-modal-title"
                  className="font-display text-2xl font-bold text-[#1E2022] leading-snug"
                >
                  {activity.title}
                </h2>

                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#4B5563] tabular-nums">
                  <span className="inline-flex items-center gap-1 font-semibold text-[#1E2022]">
                    <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" aria-hidden="true" />
                    {activity.rating.toFixed(1)}
                    <span className="font-normal text-[#6B7280]">
                      ({activity.reviewsCount.toLocaleString()} reviews)
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#6B7280]" aria-hidden="true" />
                    {activity.location}, Kuala Lumpur
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#6B7280]" aria-hidden="true" />
                    {activity.durationLabel}
                  </span>
                </div>

                <p className="mt-4 text-[15px] leading-relaxed text-[#374151]">
                  {activity.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8EAED]">
                <h3 className="font-display text-base font-semibold text-[#1E2022] mb-3">
                  Experience highlights
                </h3>
                <ul className="space-y-2 text-sm text-[#374151]">
                  {activity.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#FF5B00] mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#E8EAED]">
                <h3 className="font-display text-base font-semibold text-[#1E2022] mb-3">
                  What’s included &amp; redemption
                </h3>
                <ul className="space-y-2 text-sm text-[#374151] mb-3">
                  {activity.included.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#0F766E] mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-[#6B7280] bg-[#F7F8FA] rounded-lg p-3 border border-[#E8EAED]">
                  {activity.redemptionInfo}
                </p>
              </div>
            </div>

            {/* Right Contiguous Purchase Module */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handleSubmit}
                className="lg:sticky lg:top-0 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl p-5 space-y-5"
              >
                <div>
                  <div className="text-xs font-medium text-[#6B7280]">Selected package price</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display text-2xl font-bold text-[#1E2022] tabular-nums">
                      {formatPrice(selectedPackage.priceSgd, currency)}
                    </span>
                    {selectedPackage.originalPriceSgd && (
                      <span className="text-sm text-[#8C939D] line-through tabular-nums">
                        {formatPrice(selectedPackage.originalPriceSgd, currency)}
                      </span>
                    )}
                    <span className="text-xs text-[#6B7280]">/ person</span>
                  </div>
                </div>

                {/* Package Options */}
                <div>
                  <label className="block text-xs font-semibold text-[#1E2022] mb-2">
                    Select package option
                  </label>
                  <div className="space-y-2">
                    {activity.packages.map((pkg) => {
                      const active = pkg.id === selectedPackage.id;
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setSelectedPkgId(pkg.id)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B00] ${
                            active
                              ? 'bg-white border-[#FF5B00] ring-1 ring-[#FF5B00]'
                              : 'bg-white border-[#E5E7EB] hover:border-[#C4C9D2]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-semibold text-[#1E2022] leading-snug">
                              {pkg.name}
                            </span>
                            <span className="text-sm font-bold text-[#FF5B00] tabular-nums shrink-0">
                              {formatPrice(pkg.priceSgd, currency)}
                            </span>
                          </div>
                          <div className="text-xs text-[#6B7280] mt-1">{pkg.subtitle}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date Picker */}
                <div>
                  <label
                    htmlFor="booking-date-input"
                    className="block text-xs font-semibold text-[#1E2022] mb-1.5"
                  >
                    Participation date
                  </label>
                  <div className="relative">
                    <Calendar
                      className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      id="booking-date-input"
                      type="date"
                      value={date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-[#D1D5DB] rounded-lg text-[#1E2022] tabular-nums focus:outline-none focus:border-[#FF5B00] focus:ring-1 focus:ring-[#FF5B00]"
                    />
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5">
                  <div>
                    <div className="text-sm font-semibold text-[#1E2022]">Travelers</div>
                    <div className="text-xs text-[#6B7280]">Quantity</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="w-9 h-9 rounded-lg border border-[#D1D5DB] flex items-center justify-center text-[#1E2022] hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B00]"
                    >
                      <Minus className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-[#1E2022] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(12, q + 1))}
                      disabled={quantity >= 12}
                      aria-label="Increase quantity"
                      className="w-9 h-9 rounded-lg border border-[#D1D5DB] flex items-center justify-center text-[#1E2022] hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B00]"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Subtotal & CTA */}
                <div className="pt-3 border-t border-[#E5E7EB] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#4B5563]">Total</span>
                    <span className="font-display text-xl font-bold text-[#1E2022] tabular-nums">
                      {formatPrice(totalSgd, currency)}
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-[#FF5B00] text-white font-semibold text-sm hover:bg-[#E04F00] active:scale-[0.99] transition-[background-color,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF5B00]"
                  >
                    Add to booking bag
                  </button>
                  <p className="text-[11px] text-center text-[#6B7280]">
                    {activity.instantConfirmation
                      ? 'Instant e-voucher confirmation upon checkout'
                      : 'Confirmed within 24 hours'}
                    {' · '}
                    {activity.freeCancellation
                      ? 'Free cancellation up to 24h prior'
                      : 'Non-refundable timed slot'}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
