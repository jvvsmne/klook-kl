import { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Heart,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  ACTIVITIES,
  Activity,
  CATEGORY_TABS,
  CURRENCY_CONFIG,
  CategoryId,
  CurrencyCode,
  DurationBucket,
  HERO_IMAGE,
  KL_FAQS,
  formatPrice,
} from './data/klookActivities';
import { ActivityCard } from './components/ActivityCard';
import { ActivityDetailModal, BookingSelectionPayload } from './components/ActivityDetailModal';
import { BagItem, BookingBagDrawer } from './components/BookingBagDrawer';
import { ResilientImage } from './components/ResilientImage';

type SortOption = 'popular' | 'rating' | 'price-asc' | 'price-desc';
type PriceFilter = 'all' | 'under-20' | '20-40' | 'over-40';

export default function App() {
  const [currency, setCurrency] = useState<CurrencyCode>('SGD');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [durationFilter, setDurationFilter] = useState<DurationBucket | 'all'>('all');
  const [onlyInstant, setOnlyInstant] = useState(false);
  const [onlyFreeCancel, setOnlyFreeCancel] = useState(false);
  const [onlySkipLine, setOnlySkipLine] = useState(false);
  const [minRating48, setMinRating48] = useState(false);
  const [onlySaved, setOnlySaved] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [wishlistIds, setWishlistIds] = useState<string[]>(['petronas-twin-towers']);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [bagItems, setBagItems] = useState<BagItem[]>([]);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    activeCategory !== 'all' ||
    priceFilter !== 'all' ||
    durationFilter !== 'all' ||
    onlyInstant ||
    onlyFreeCancel ||
    onlySkipLine ||
    minRating48 ||
    onlySaved;

  const resetAllFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setPriceFilter('all');
    setDurationFilter('all');
    setOnlyInstant(false);
    setOnlyFreeCancel(false);
    setOnlySkipLine(false);
    setMinRating48(false);
    setOnlySaved(false);
  };

  const toggleWishlist = (id: string) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddToBag = (payload: BookingSelectionPayload) => {
    const key = `${payload.activity.id}__${payload.selectedPackage.id}__${payload.date}`;
    setBagItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + payload.quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          key,
          activity: payload.activity,
          selectedPackage: payload.selectedPackage,
          date: payload.date,
          quantity: payload.quantity,
        },
      ];
    });
    setSelectedActivity(null);
    setToastMessage(`Added ${payload.activity.title} to booking bag`);
    window.setTimeout(() => {
      setToastMessage((current) =>
        current === `Added ${payload.activity.title} to booking bag` ? null : current
      );
    }, 4000);
  };

  const handleUpdateBagQuantity = (key: string, delta: number) => {
    setBagItems((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveBagItem = (key: string) => {
    setBagItems((prev) => prev.filter((item) => item.key !== key));
  };

  const filteredActivities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = ACTIVITIES.filter((act) => {
      if (activeCategory !== 'all' && act.category !== activeCategory) return false;
      if (onlySaved && !wishlistIds.includes(act.id)) return false;
      if (onlyInstant && !act.instantConfirmation) return false;
      if (onlyFreeCancel && !act.freeCancellation) return false;
      if (onlySkipLine && !act.skipTheLine) return false;
      if (minRating48 && act.rating < 4.8) return false;
      if (durationFilter !== 'all' && act.duration !== durationFilter) return false;

      if (priceFilter === 'under-20' && act.priceSgd >= 20) return false;
      if (priceFilter === '20-40' && (act.priceSgd < 20 || act.priceSgd > 40)) return false;
      if (priceFilter === 'over-40' && act.priceSgd <= 40) return false;

      if (q) {
        const searchable =
          `${act.title} ${act.categoryLabel} ${act.location} ${act.summary}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }

      return true;
    });

    const sorted = [...list];
    if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
    } else if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.priceSgd - b.priceSgd);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.priceSgd - a.priceSgd);
    } else {
      sorted.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }
    return sorted;
  }, [
    searchQuery,
    activeCategory,
    onlySaved,
    wishlistIds,
    onlyInstant,
    onlyFreeCancel,
    onlySkipLine,
    minRating48,
    durationFilter,
    priceFilter,
    sortBy,
  ]);

  const totalBagCount = bagItems.reduce((sum, item) => sum + item.quantity, 0);

  const navigateCategoryFromHeader = (cat: CategoryId) => {
    setActiveCategory(cat);
    setOnlySaved(false);
    const el = document.getElementById('kl-activities-catalog');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#1E2022]">
      {/* Strict 3-Zone Top Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E8EAED]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              resetAllFilters();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-display text-2xl font-extrabold tracking-tight text-[#FF5B00] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B00] rounded"
          >
            klook
          </a>

          {/* Zone 2: 4 Concise Single-Line Nav Links */}
          <nav
            aria-label="Primary categories"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4B5563]"
          >
            <button
              type="button"
              onClick={() => navigateCategoryFromHeader('all')}
              className="hover:text-[#FF5B00] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Things to do
            </button>
            <button
              type="button"
              onClick={() => navigateCategoryFromHeader('theme-parks')}
              className="hover:text-[#FF5B00] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Theme parks
            </button>
            <button
              type="button"
              onClick={() => navigateCategoryFromHeader('day-trips')}
              className="hover:text-[#FF5B00] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Day trips
            </button>
            <a
              href="#kl-travel-guide"
              className="hover:text-[#FF5B00] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Travel guide
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setIsBagOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF5B00] text-white text-sm font-semibold hover:bg-[#E04F00] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF5B00]"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span>Booking bag</span>
              {totalBagCount > 0 && (
                <span className="tabular-nums font-bold">({totalBagCount})</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* Breadcrumb & Hero Section */}
        <section className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-5 pb-6">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-4 overflow-x-auto no-scrollbar whitespace-nowrap"
          >
            <button
              type="button"
              onClick={resetAllFilters}
              className="hover:text-[#1E2022] transition-colors"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Malaysia</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Kuala Lumpur</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="font-medium text-[#1E2022]">Things to do</span>
          </nav>

          {/* Destination Hero Banner */}
          <div className="relative rounded-2xl overflow-hidden bg-[#1E2022] min-h-[300px] sm:min-h-[340px] flex flex-col justify-end">
            <ResilientImage
              src={HERO_IMAGE}
              alt="Twilight skyline of Kuala Lumpur featuring the Petronas Twin Towers and KL Tower"
              fallbackTitle="Kuala Lumpur Skyline"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15"
              aria-hidden="true"
            />

            <div className="relative z-10 p-6 sm:p-9 space-y-5">
              <div className="max-w-2xl">
                <p className="text-xs sm:text-sm font-medium text-white/85 mb-1.5">
                  Malaysia · Destination Guide
                </p>
                <h1 className="font-display text-[clamp(1.85rem,3.6vw,2.85rem)] font-bold text-white leading-[1.15] text-balance">
                  Things to do in Kuala Lumpur
                </h1>
                <p className="mt-2 text-sm sm:text-base text-white/90 leading-relaxed max-w-xl">
                  Explore skip-the-line observation decks, vibrant limestone caves, multi-park family thrills, and curated day trips across Malaysia’s capital.
                </p>
              </div>

              {/* Search & Currency Bar */}
              <div className="flex flex-col md:flex-row md:items-center gap-3 pt-1">
                <div className="relative flex-1 max-w-xl">
                  <Search
                    className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Petronas Towers, Batu Caves, Aquaria, or Genting..."
                    aria-label="Search activities in Kuala Lumpur"
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-white text-sm text-[#1E2022] placeholder:text-[#6B7280] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF5B00]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6]"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>

                {/* Currency Switcher */}
                <div
                  role="group"
                  aria-label="Select display currency"
                  className="inline-flex items-center p-1 rounded-xl bg-white/95 shadow-sm self-start md:self-auto shrink-0"
                >
                  {(['SGD', 'MYR', 'USD'] as CurrencyCode[]).map((code) => {
                    const active = currency === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setCurrency(code)}
                        aria-pressed={active}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-[#FF5B00] text-white'
                            : 'text-[#4B5563] hover:text-[#1E2022]'
                        }`}
                      >
                        {code} ({CURRENCY_CONFIG[code].symbol})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Tabs & Marketplace Grid */}
        <section
          id="kl-activities-catalog"
          className="max-w-[1240px] mx-auto px-4 sm:px-6 pb-14"
        >
          {/* Horizontal Category Tabs */}
          <div className="border-b border-[#E8EAED] mb-6">
            <div
              role="tablist"
              aria-label="Activity categories"
              className="flex items-center gap-6 overflow-x-auto no-scrollbar"
            >
              {CATEGORY_TABS.map((tab) => {
                const active = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`relative py-3.5 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:text-[#FF5B00] ${
                      active
                        ? 'text-[#FF5B00]'
                        : 'text-[#4B5563] hover:text-[#1E2022]'
                    }`}
                  >
                    {tab.label}
                    {active && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FF5B00] rounded-full"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            {/* Mobile Filter Trigger */}
            <div className="flex items-center justify-between lg:hidden">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen((v) => !v)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#D1D5DB] text-sm font-medium text-[#1E2022] bg-white"
              >
                <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
                <span>{mobileFiltersOpen ? 'Hide filters' : 'Filters'}</span>
              </button>
              <span className="text-sm text-[#6B7280] tabular-nums">
                {filteredActivities.length} activities
              </span>
            </div>

            {/* Left Filter Sidebar */}
            <aside
              aria-label="Filter activities"
              className={`w-full lg:w-[248px] shrink-0 space-y-6 ${
                mobileFiltersOpen ? 'block' : 'hidden lg:block'
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-bold text-[#1E2022]">
                  Filters
                </h2>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-xs font-semibold text-[#FF5B00] hover:underline"
                  >
                    Reset all
                  </button>
                )}
              </div>

              {/* Price Bucket */}
              <div className="pt-4 border-t border-[#E8EAED] space-y-2.5">
                <div className="text-xs font-semibold text-[#1E2022]">Price range</div>
                {(
                  [
                    { id: 'all', label: 'All prices' },
                    { id: 'under-20', label: `Under ${formatPrice(20, currency)}` },
                    {
                      id: '20-40',
                      label: `${formatPrice(20, currency)} – ${formatPrice(40, currency)}`,
                    },
                    { id: 'over-40', label: `${formatPrice(40, currency)}+` },
                  ] as const
                ).map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-2.5 text-sm text-[#374151] cursor-pointer py-0.5"
                  >
                    <input
                      type="radio"
                      name="kl-price-filter"
                      checked={priceFilter === option.id}
                      onChange={() => setPriceFilter(option.id)}
                      className="w-4 h-4 accent-[#FF5B00]"
                    />
                    <span className="tabular-nums">{option.label}</span>
                  </label>
                ))}
              </div>

              {/* Confirmation & Perks */}
              <div className="pt-4 border-t border-[#E8EAED] space-y-2.5">
                <div className="text-xs font-semibold text-[#1E2022]">
                  Booking flexibility
                </div>
                <label className="flex items-center gap-2.5 text-sm text-[#374151] cursor-pointer py-0.5">
                  <input
                    type="checkbox"
                    checked={onlyInstant}
                    onChange={(e) => setOnlyInstant(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#FF5B00]"
                  />
                  <span>Instant confirmation</span>
                </label>
                <label className="flex items-center gap-2.5 text-sm text-[#374151] cursor-pointer py-0.5">
                  <input
                    type="checkbox"
                    checked={onlyFreeCancel}
                    onChange={(e) => setOnlyFreeCancel(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#FF5B00]"
                  />
                  <span>Free cancellation</span>
                </label>
                <label className="flex items-center gap-2.5 text-sm text-[#374151] cursor-pointer py-0.5">
                  <input
                    type="checkbox"
                    checked={onlySkipLine}
                    onChange={(e) => setOnlySkipLine(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#FF5B00]"
                  />
                  <span>Skip-the-line QR entry</span>
                </label>
              </div>

              {/* Duration */}
              <div className="pt-4 border-t border-[#E8EAED] space-y-2.5">
                <div className="text-xs font-semibold text-[#1E2022]">Duration</div>
                {(
                  [
                    { id: 'all', label: 'Any duration' },
                    { id: 'under-3h', label: 'Under 3 hours' },
                    { id: 'half-day', label: 'Half day (3–5 hrs)' },
                    { id: 'full-day', label: 'Full day (6+ hrs)' },
                  ] as const
                ).map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2.5 text-sm text-[#374151] cursor-pointer py-0.5"
                  >
                    <input
                      type="radio"
                      name="kl-duration-filter"
                      checked={durationFilter === item.id}
                      onChange={() => setDurationFilter(item.id)}
                      className="w-4 h-4 accent-[#FF5B00]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>

              {/* Rating */}
              <div className="pt-4 border-t border-[#E8EAED] space-y-2.5">
                <div className="text-xs font-semibold text-[#1E2022]">Guest rating</div>
                <label className="flex items-center gap-2.5 text-sm text-[#374151] cursor-pointer py-0.5">
                  <input
                    type="checkbox"
                    checked={minRating48}
                    onChange={(e) => setMinRating48(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#FF5B00]"
                  />
                  <span>4.8 stars &amp; above</span>
                </label>
              </div>
            </aside>

            {/* Right Results Grid */}
            <div className="flex-1 min-w-0">
              {/* Results Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <div className="text-sm text-[#4B5563]">
                  <span className="font-semibold text-[#1E2022] tabular-nums">
                    {filteredActivities.length}
                  </span>{' '}
                  {filteredActivities.length === 1 ? 'activity' : 'activities'} in Kuala Lumpur
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setOnlySaved((v) => !v)}
                    aria-pressed={onlySaved}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      onlySaved
                        ? 'border-[#FF5B00] bg-[#FFF5F0] text-[#FF5B00]'
                        : 'border-[#D1D5DB] bg-white text-[#374151] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        onlySaved ? 'fill-[#FF5B00] text-[#FF5B00]' : ''
                      }`}
                      aria-hidden="true"
                    />
                    <span className="tabular-nums">Saved ({wishlistIds.length})</span>
                  </button>

                  <div className="relative">
                    <label htmlFor="kl-sort-select" className="sr-only">
                      Sort activities
                    </label>
                    <select
                      id="kl-sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold rounded-lg border border-[#D1D5DB] bg-white text-[#1E2022] focus:outline-none focus:border-[#FF5B00]"
                    >
                      <option value="popular">Sort: Most popular</option>
                      <option value="rating">Sort: Highest rated</option>
                      <option value="price-asc">Sort: Price low to high</option>
                      <option value="price-desc">Sort: Price high to low</option>
                    </select>
                    <ChevronDown
                      className="w-3.5 h-3.5 text-[#6B7280] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>

              {/* 3-Column Card Grid or Empty State */}
              {filteredActivities.length === 0 ? (
                <div className="border border-[#E8EAED] rounded-2xl bg-[#F7F8FA] py-14 px-6 text-center">
                  <h3 className="font-display text-lg font-semibold text-[#1E2022]">
                    No Kuala Lumpur activities match your filters
                  </h3>
                  <p className="text-sm text-[#6B7280] mt-1.5 max-w-md mx-auto">
                    Try clearing one or more filters or broadening your search term to explore all attractions and day tours.
                  </p>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="mt-5 px-5 py-2.5 rounded-lg bg-[#FF5B00] text-white text-sm font-semibold hover:bg-[#E04F00] transition-colors"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredActivities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      currency={currency}
                      isWishlisted={wishlistIds.includes(activity.id)}
                      onToggleWishlist={toggleWishlist}
                      onSelect={setSelectedActivity}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Kuala Lumpur Travel Essentials & FAQ Section */}
        <section
          id="kl-travel-guide"
          className="bg-[#F7F8FA] border-t border-[#E8EAED] py-14"
        >
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-12">
            {/* Editorial Tips */}
            <div>
              <h2 className="font-display text-2xl font-bold text-[#1E2022] mb-6">
                Kuala Lumpur travel essentials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-[#E8EAED] p-6">
                  <h3 className="font-display text-base font-semibold text-[#1E2022]">
                    01. Plan landmark slots early
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">
                    Petronas Twin Towers Skybridge slots operate in timed 15-minute windows and close on Mondays. Book 3–5 days ahead for sunset entry.
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-[#E8EAED] p-6">
                  <h3 className="font-display text-base font-semibold text-[#1E2022]">
                    02. Airport &amp; rail transit
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">
                    Skip highway traffic between KLIA and KL Sentral on the 28-minute KLIA Ekspres train, then connect effortlessly via the LRT Kelana Jaya line to KLCC.
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-[#E8EAED] p-6">
                  <h3 className="font-display text-base font-semibold text-[#1E2022]">
                    03. Temple &amp; highland weather
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">
                    Pack modest knee-covering attire for Batu Caves and bring a light jacket when riding the Awana SkyWay up to cool 18°C Genting Highlands.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div>
              <h2 className="font-display text-2xl font-bold text-[#1E2022] mb-5">
                Frequently asked questions
              </h2>
              <div className="bg-white rounded-xl border border-[#E8EAED] divide-y divide-[#E8EAED]">
                {KL_FAQS.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={faq.question}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#FAFAFA] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FF5B00]"
                      >
                        <span className="font-display text-[15px] font-semibold text-[#1E2022]">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#6B7280] shrink-0 transition-transform duration-150 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 text-sm leading-relaxed text-[#4B5563]">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-[#E8EAED] py-8">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#6B7280]">
          <div className="flex items-center gap-3">
            <span className="font-display text-base font-extrabold text-[#FF5B00]">
              klook
            </span>
            <span>Kuala Lumpur Travel &amp; Attractions</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => navigateCategoryFromHeader('attractions')}
              className="hover:text-[#1E2022] transition-colors"
            >
              Attractions
            </button>
            <button
              type="button"
              onClick={() => navigateCategoryFromHeader('tours')}
              className="hover:text-[#1E2022] transition-colors"
            >
              Tours
            </button>
            <button
              type="button"
              onClick={() => navigateCategoryFromHeader('transport')}
              className="hover:text-[#1E2022] transition-colors"
            >
              KLIA Ekspres
            </button>
            <span>Display currency: {currency}</span>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3 bg-[#1E2022] text-white px-4 py-3 rounded-xl shadow-lg text-sm">
          <span className="truncate max-w-[260px]">{toastMessage}</span>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setIsBagOpen(true);
            }}
            className="text-[#FF8533] font-semibold hover:underline whitespace-nowrap shrink-0"
          >
            View bag
          </button>
        </div>
      )}

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        currency={currency}
        onClose={() => setSelectedActivity(null)}
        onAddToBag={handleAddToBag}
      />

      {/* Booking Bag Drawer */}
      <BookingBagDrawer
        isOpen={isBagOpen}
        items={bagItems}
        currency={currency}
        onClose={() => setIsBagOpen(false)}
        onUpdateQuantity={handleUpdateBagQuantity}
        onRemoveItem={handleRemoveBagItem}
        onClearBag={() => setBagItems([])}
      />
    </div>
  );
}
