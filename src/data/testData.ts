/**
 * Central test data for the Sakani pre-production suite.
 *
 * Values were verified live against pre-production. Anything marked "mutable"
 * describes inventory that changes over time — those journeys resolve live data
 * through `src/helpers/marketplaceApi.ts` instead of hard-coding a unit.
 */

export const TEST_USER = {
  /** National ID used for Nafath login. Auto-approves in pre-production. */
  nationalId: process.env.SAKANI_NATIONAL_ID ?? '1000011485',
  /** Display name rendered in the header once authenticated. */
  displayName: 'ALSHAIKHA',
  arabicName: 'محمد حسين حامد اليامي',
  beneficiaryId: '42942',
  /** This account is a NON-beneficiary: it may only book `non_bene` inventory. */
  isNonBeneficiary: true,
  eligibleStatus: 'not_eligible',
} as const;

/** UI language. The header toggle is unreliable; always drive language via `?lang=`. */
export const LANG = (process.env.SAKANI_LANG ?? 'en') as 'ar' | 'en';

export const PROJECTS = {
  /** bookable=true, large non-beneficiary inventory, no active booking for TEST_USER. */
  bookable: Number(process.env.BOOKING_PROJECT_ID ?? 2896),
  /** bookable=true but TEST_USER already holds an active booking -> one-per-project block. */
  alreadyBooked: Number(process.env.BOOKED_PROJECT_ID ?? 1441),
  /** bookable=false -> "This project is not taking bookings yet!", start_booking 403. */
  bookingsClosed: Number(process.env.CLOSED_PROJECT_ID ?? 1187),
  /** Off-plan project used for the guest Register Interest journey. */
  registerInterest: 2896,
} as const;

export const SEARCH = {
  city: 'Riyadh',
  noResultsCity: 'zzzzzzzz',
} as const;

/**
 * Marketplace price-filter domain, read off the panel's range sliders.
 *
 * The two text boxes are bound to sliders with `min=1000` / `max=20000000`, so
 * a typed value below the floor is displayed but **clamped** to SAR 1,000 — an
 * "impossible" range like 1-2 therefore still returns results. Boundary tests
 * must stay inside this domain to be meaningful.
 *
 * There is deliberately no hard-coded "empty band" constant here any more. One
 * used to exist (SAR 19M-20M); it was correct, but the test relying on it read
 * the listing once, immediately after applying, and so sampled the *previous*
 * result set — which looked exactly like the band having filled with inventory.
 * Derive an empty band from `ceiling` and poll for the listing to settle.
 */
export const PRICE_FILTER = {
  floor: 1_000,
  ceiling: 20_000_000,
} as const;

/**
 * Register-Interest lead data and the form's verified validation contract.
 *
 * Only **name + mobile** gate the submit button; email, city, destinations and
 * projects are optional. The mobile field is masked to `+966 5########` and
 * requires 13 digits in total, so `512345678` renders as `+966 551234567`.
 */
export const REGISTER_INTEREST_LEAD = {
  name: 'أحمد التجريبي',
  phone: '512345678',
  email: 'test.user@example.com',
  invalidEmails: ['not-an-email', 'a@', 'a b@c.com'],
  shortPhone: '123',
  errors: {
    format: 'The value is invalid or wrong format',
    tooShort: 'Too short. Required length is 13',
  },
} as const;

/** Sort options exposed by the marketplace Sort modal. */
export const SORT_OPTIONS = [
  'Recommended',
  'Most popular',
  'Date added: Newest first',
  'Date added: Oldest first',
  'Price: High to low',
  'Price: Low to high',
] as const;

/** Filter taxonomy verified in the marketplace Filter panel. */
export const FILTERS = {
  eligibilityTypes: ['All', 'Beneficiary', 'Non-beneficiary'],
  paymentOptions: ['All', 'Deferred Subsidy'],
  constructionStatus: ['Under construction', 'Readymade Units', 'Lands'],
  projectStatus: ['Bookings Open', 'Available Soon', 'Last few units left'],
  propertyTypes: ['Apartment', 'Townhouse', 'Villa', 'Land'],
  rooms: ['1', '2', '3', '4', '5', '+6'],
  bathrooms: ['1', '2', '3', '4', '5', '+6'],
} as const;

/**
 * The account portal's Activities modules.
 *
 * Every entry was read off the running application: the route, the heading, the
 * exact status tabs and, where the fixture account has no data, the module's own
 * empty-state copy. `ActivitiesPage` is driven entirely by these descriptors, so
 * adding a module here adds coverage without new page-object code.
 */
export interface ActivityModule {
  key: string;
  label: string;
  path: string;
  heading: RegExp;
  tabs: readonly string[];
  /** Verbatim empty-state text, when the fixture account has no data. */
  emptyText?: string;
  /** Primary action the module exposes, when it has one. */
  action?: string;
}

const ACTIVITIES_ROOT = '/app/user-profile/my-activities';

export const ACTIVITY_MODULES: readonly ActivityModule[] = [
  {
    key: 'financial-applications',
    label: 'Financial applications',
    path: `${ACTIVITIES_ROOT}/financial-applications/listing`,
    heading: /Financial applications/i,
    tabs: ['All', 'Active', 'Cancelled'],
  },
  {
    key: 'purchase-deals',
    label: 'Purchased deals',
    path: `${ACTIVITIES_ROOT}/purchase-deals`,
    heading: /Purchased deals/i,
    tabs: [],
    emptyText: "You don’t have any Purchased deals",
    action: 'Deals Marketplace',
  },
  {
    key: 'waiting-list',
    label: 'Waiting list management',
    path: `${ACTIVITIES_ROOT}/waiting-list`,
    heading: /Waiting list management/i,
    tabs: ['All', 'Active', 'Cancelled'],
    emptyText: "You don't have any active waiting list subscription.",
  },
  {
    key: 'housing-designs',
    label: 'Housing designs',
    path: `${ACTIVITIES_ROOT}/housing-designs/listing`,
    heading: /Housing designs/i,
    tabs: ['All', 'Active', 'Cancelled', 'Completed'],
  },
  {
    key: 'vat-exemption',
    label: 'Real estate tax incurred service',
    path: `${ACTIVITIES_ROOT}/vat-exemption`,
    heading: /Real estate tax incurred service/i,
    tabs: ['Real estate tax incurred service', 'Inquiring about a certificate'],
  },
  {
    key: 'certified-contractors',
    label: 'Certified contractor services',
    path: `${ACTIVITIES_ROOT}/certified-contractors-services/list`,
    heading: /Certified contractor/i,
    tabs: ['Active', 'Completed', 'Cancelled'],
    emptyText: 'No Active Certified Contractors Found',
  },
  {
    key: 'conveyance',
    label: 'Conveyance service',
    path: `${ACTIVITIES_ROOT}/conveyance-services`,
    heading: /Conveyance service/i,
    tabs: ['All', 'Under review', 'Approved', 'Rejected'],
    emptyText: 'No conveyance requests yet',
    action: 'Create request',
  },
  {
    key: 'online-lending',
    label: 'Online lending requests',
    path: `${ACTIVITIES_ROOT}/online-lending-requests`,
    heading: /Online lending requests/i,
    tabs: ['All', 'Active', 'Cancelled'],
    action: 'Start Online Lending',
  },
  {
    key: 'auctions',
    label: 'My auctions',
    path: `${ACTIVITIES_ROOT}/auction/listing`,
    heading: /Auction/i,
    tabs: ['All', 'Active', 'Closed'],
  },
  {
    key: 'farz-certificates',
    label: 'Farz Certificate',
    path: `${ACTIVITIES_ROOT}/farz-certificates`,
    heading: /Farz Certificate requests/i,
    tabs: ['All', 'Pending', 'Expired', 'Completed'],
    emptyText: 'No farz certificate requests yet',
  },
  {
    key: 'units-delivery',
    label: 'Units Delivery',
    path: `${ACTIVITIES_ROOT}/units-delivery`,
    heading: /Unit delivery/i,
    tabs: ['All', 'Pending', 'Accepted', 'Accepted By Developer', 'Rejected'],
    emptyText: "You don't have any unit delivery requests yet",
  },
  {
    key: 'rental-requests',
    label: 'Rental requests',
    path: `${ACTIVITIES_ROOT}/rental-requests`,
    heading: /Rental requests/i,
    tabs: ['All', 'Incomplete', 'Under process', 'Approved', 'Rejected'],
    emptyText: 'No Rental Requests Found',
  },
  {
    key: 'resale-requests',
    label: 'Resale Requests',
    path: `${ACTIVITIES_ROOT}/resale-requests/listing`,
    heading: /Resale Request/i,
    tabs: ['Sell', 'Buy', 'All', 'Completed', 'Rejected', 'Cancelled'],
  },
] as const;

/** Account-portal routes outside the Activities group. */
export const PROFILE_ROUTES = {
  dashboard: '/app/user-profile/dashboard/overview',
  myInformation: '/app/user-profile/my-information',
  wallet: '/app/user-profile/my-wallet',
  financialAdvisory: '/app/user-profile/personal-financials',
  payments: '/app/user-profile/payment-transaction',
  favorites: '/app/user-profile/favorites',
  registeredInterests: '/app/user-profile/preferences/registered-interests',
  myBookings: '/app/user-profile/my-activities/my-bookings/listing',
} as const;

/**
 * Mortgage calculator inputs.
 *
 * `valid` is a realistic, affordable case that always produces a result.
 * The backend enforces a range on Monthly Income — the form reports
 * "The value must be between 2000 and 500000" — which drives the boundary cases.
 */
export const MORTGAGE = {
  valid: {
    propertyPrice: '800000',
    monthlyIncome: '25000',
    monthlyLiabilities: '2000',
    financingTerm: '20',
    interestRate: '4',
    downPayment: '10',
    firstHome: 'yes',
    beneficiary: 'no',
  },
  incomeRange: { min: 2000, max: 500000 },
  errors: {
    required: 'This field is required',
    range: 'The value must be between 2000 and 500000',
  },
} as const;

/** Backend endpoints asserted by the journeys. */
export const API = {
  captcha: '/captchaApi/grecaptcha/validate',
  sessionCheck: '/authApi/api/v4/beneficiary_session/check',
  iamInit: '/authApi/api/v4/iam',
  iamCheck: '/authApi/api/v4/iam/check',
  iamLogin: '/authApi/api/v4/iam/login',
  me: '/mainIntermediaryApi/v4/beneficiary/me',
  project: (id: number) => `/mainIntermediaryApi/v4/projects/${id}`,
  availableUnits: (id: number) => `/marketplaceApi/search/v1/projects/${id}/available-units`,
  startBooking: (id: number) => `/mainIntermediaryApi/v4/bookings/offplans/${id}/start_booking`,
  reserveUnit: '/mainIntermediaryApi/v4/units/reserve',
  createBooking: '/mainIntermediaryApi/v4/bookings/offplans',
  myBookings: '/mainIntermediaryApi/v4/beneficiary/me/bookings',
  cqrs: '/sakani-queries-service/cqrs-res',
} as const;
