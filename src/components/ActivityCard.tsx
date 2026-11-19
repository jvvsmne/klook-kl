import { Heart, Star } from 'lucide-react';
import { Activity, CurrencyCode, formatPrice } from '../data/klookActivities';
import { ResilientImage } from './ResilientImage';

interface ActivityCardProps {
  activity: Activity;
  currency: CurrencyCode;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onSelect: (activity: Activity) => void;
}

function formatReviewCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return String(count);
}

export function ActivityCard({
  activity,
  currency,
  isWishlisted,
  onToggleWishlist,
  onSelect,
}: ActivityCardProps) {
  return (
    <article
      className="group flex flex-col bg-white rounded-xl border border-[#E8EAED] overflow-hidden transition-[transform,box-shadow,border-color] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(30,32,34,0.08)] hover:border-[#D5D9DF]"
    >
      {/* 4:3 Image Header */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F7F8FA]">
        <button
          type="button"
          onClick={() => onSelect(activity)}
          className="block w-full h-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FF5B00]"
          aria-label={`View details for ${activity.title}`}
        >
          <ResilientImage
            src={activity.image}
            alt={activity.imageAlt}
            fallbackTitle={activity.title}
            className="w-full h-full object-cover transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
        </button>

        {/* Wishlist Action (>= 40px touch target) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(activity.id);
          }}
          aria-label={
            isWishlisted
              ? `Remove ${activity.title} from saved activities`
              : `Save ${activity.title} to wishlist`
          }
          aria-pressed={isWishlisted}
          className="absolute top-2.5 right-2.5 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#1E2022] shadow-xs transition-transform duration-150 hover:scale-105 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B00]"
        >
          <Heart
            className={`w-[18px] h-[18px] transition-colors ${
              isWishlisted ? 'fill-[#FF5B00] text-[#FF5B00]' : 'text-[#4B5563]'
            }`}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4">
        {/* Quiet 1-line unboxed metadata kicker */}
        <div className="flex items-center gap-1.5 text-xs text-[#6B7280] truncate mb-1.5">
          <span className="font-medium text-[#4B5563]">{activity.categoryLabel}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{activity.location}</span>
          {activity.instantConfirmation && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-[#0F766E] font-medium shrink-0">Instant confirmation</span>
            </>
          )}
        </div>

        {/* Title */}
        <button
          type="button"
          onClick={() => onSelect(activity)}
          className="text-left focus-visible:outline-none focus-visible:underline"
        >
          <h3 className="font-display text-[15.5px] leading-[1.38] font-semibold text-[#1E2022] line-clamp-2 min-h-[43px] group-hover:text-[#FF5B00] transition-colors">
            {activity.title}
          </h3>
        </button>

        {/* Rating & Bookings */}
        <div className="mt-2.5 flex items-center gap-1.5 text-[13px] text-[#6B7280] tabular-nums">
          <Star
            className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B] shrink-0"
            aria-hidden="true"
          />
          <span className="font-semibold text-[#1E2022]">{activity.rating.toFixed(1)}</span>
          <span>({formatReviewCount(activity.reviewsCount)})</span>
          <span aria-hidden="true">·</span>
          <span>{activity.bookedLabel}</span>
        </div>

        {/* Flexibility line */}
        <div className="mt-1.5 mb-3.5 text-xs text-[#6B7280] truncate">
          {activity.freeCancellation ? 'Free cancellation' : 'Fixed date booking'}
          <span aria-hidden="true" className="mx-1.5">·</span>
          <span>{activity.durationLabel}</span>
        </div>

        {/* Price & Action Footer */}
        <div className="mt-auto pt-3.5 border-t border-[#F1F3F5] flex items-end justify-between gap-3">
          <div className="min-w-0">
            {activity.originalPriceSgd && (
              <div className="text-xs text-[#8C939D] line-through tabular-nums leading-tight">
                {formatPrice(activity.originalPriceSgd, currency)}
              </div>
            )}
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xs text-[#6B7280]">From</span>
              <span className="text-[17px] font-bold text-[#1E2022] tabular-nums tracking-tight">
                {formatPrice(activity.priceSgd, currency)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelect(activity)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#FF5B00] rounded-lg hover:bg-[#E04F00] active:scale-[0.98] transition-[background-color,transform] duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF5B00]"
          >
            Select
          </button>
        </div>
      </div>
    </article>
  );
}
