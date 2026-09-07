# Sakani (pre-production) — Application Exploration Report

**Application under test:** https://pre-sakani.housingapps.sa
**Test identity:** national ID `1000011485` — beneficiary `42942`, *ALSHAIKHA محمد حسين حامد اليامي*
**Explored:** live, with a real browser, authenticated end to end.

Everything below was observed directly. API paths, status codes, message copy and business
rules are transcribed from the running system, not inferred.

---

## 1. Application structure

Two rendering stacks behind one origin:

| Layer | Stack | Routes |
|---|---|---|
| Marketing / content | Rails (Phusion Passenger) | `/`, `/services/*`, `/news`, `/terms`, `/support-and-help/*` |
| Product application | Angular SPA | `/app/*` |

Three additional shells appear inside `/app/*`, each with its own header:

- **Sakani shell** — global nav (marketplace, account portal)
- **DWE shell** — project pages; header shows *Back to Sakani*, links `pre-sakani-dwe.sakani.sa`
- **NHC shell** — unit pages; header shows *Go to NHC Marketplace*, links `nhc.sakani.sa`

RTL Arabic is the default (`steam-locale=ar`). English is reachable only via `?lang=en` —
the header `English` control does not switch locale.

### Main pages

| Area | Route |
|---|---|
| Home | `/` |
| Login | `/app/authentication/login` |
| Marketplace | `/app/marketplace` |
| Project detail | `/app/offplan-projects/<id>` |
| Unit model | `/app/unit-models/<id>` |
| Unit detail | `/app/units/<id>` |
| Booking summary | `/app/booking/v2/offplan/booking-summary` |
| Booking success | `/app/booking/v2/offplan/success/<bookingId>` |
| My bookings | `/app/user-profile/my-activities/my-bookings/listing` |
| Booking detail | `/app/user-profile/my-activities/my-bookings/view-booking/<id>` |
| Complete booking | `.../view-booking/<id>/complete-booking` |
| Register interest | `/app/register-interest?project_id=<id>` |
| Developers | `/app/developers`, `/app/developers/<crNumber>` |
| Housing designs | `/app/housing-designs` |
| Offers / vouchers | `/app/promotion-vouchers` |

### Navigation

**Properties for Sale** — Offplan · Ready units · Lands · Online lending · Mortgage calculator ·
Real estate tax exemption · Financial advisory · Developers list · Publish your units *(external:
`digitar.sakani.sa`)*

**Properties for Rent** — Apartment · Villa · Floor · Rental Indicators · Publish your units

**Services** (12) — Eligibility Checker · Real estate tax exemption · Financial advisory ·
Conveyance Service · Farz certificate · Online lending · Mortgage Calculator · Resell Offplan Units ·
Sakani News · Asset and Facility Management · Sakani Offers · Sakani Metaverse

**Footer** — Marketplace · Housing Designs · Metaverse · Offers · News · Real Estate Indicators
*(external: `rei.rega.gov.sa`)* · Rental Indicators · Privacy/Terms · Executive Regulations ·
Help · FAQs · Contact Us

### Account portal (authenticated)

User menu: Profile management · Notifications *(7 unread)* · Wallet · My bookings · Favorites ·
Help & support · Logout

Portal sidebar: Dashboard · My information · My Wallet · Financial Advisory · **Activities**
(Bookings, Financial applications, Purchased deals, Waiting list management, Housing designs,
Real estate tax incurred service, Certified contractor services, Conveyance service, Online
lending requests, My auctions, Farz Certificate, Units Delivery, Rental requests, Resale
Requests) · Preferences · Payment and transactions · Favorites

### External integrations

Nafath (national SSO) · Google reCAPTCHA + Cloudflare Turnstile · ArcGIS / Google Maps ·
Bayanat (demographics) · Mullak (`mullak.housing.gov.sa`) · Digitar · NHC mega-projects
(`pre-sakani-nhc.housingapps.sa`) · Sprinklr chat · Hotjar / UXCam / WebEngage / GA4 · Ejar

---

## 2. Search, filters and sorting

**Search** — one input (*City, Region, Neighborhood, Project, or Street*) with autocomplete over
cities, regions, projects and developer companies. **Enter alone does not apply the search**; a
suggestion must be selected.

**Sort** (modal, 6 options) — Recommended · Most popular · Date added: Newest first · Date added:
Oldest first · Price: High to low · Price: Low to high

**Filter panel**

| Group | Values |
|---|---|
| Price range | Minimum / Maximum |
| Eligibility type | All · Beneficiary · Non-beneficiary |
| Payment options | All · Deferred Subsidy |
| Construction Status | Under construction · Readymade Units · Lands |
| Project Status | Bookings Open · Available Soon · Last few units left |
| Property type | Apartment · Townhouse · Villa · Land |
| Property specification | Area/size min & max |
| Rooms / Bath rooms | 1 · 2 · 3 · 4 · 5 · +6 |

Actions: **Clear** / **Apply**. Quick chips above results: For you · Register Interested ·
Under construction · Property type · Price · Bedrooms.

Listing requests carry the caller's segment:
`/marketplaceApi/search/v3/location?filter[marketplace_purpose]=buy&filter[product_types]=…&filter[user_type]=non_beneficiary`

---

## 3. Critical business paths

### 3.1 Login (Nafath) — **executed successfully**

1. `/app/authentication/login` → `#username`, Continue disabled while empty
2. Enter `1000011485`, submit → `POST /captchaApi/grecaptcha/validate` **200**
3. `POST /authApi/api/v4/beneficiary_session/check` **200**
4. Modal *"Login with nafath"* with ID pre-filled → Continue
5. `POST /authApi/api/v4/iam` **202** → *"Open nafath App"* + challenge number (observed **37**)
6. `POST /authApi/api/v4/iam/check` **202** (polling)
7. `POST /authApi/api/v4/iam/login` **200** — **auto-approved in pre-production, ~10-15s total**
8. `GET /mainIntermediaryApi/v4/beneficiary/me` **200** → redirect `/app/marketplace`

### 3.2 Booking — **executed successfully, booking `21619` created**

1. Unit page shows *Bookings open* + **Book a unit**
2. `POST /mainIntermediaryApi/v4/bookings/offplans/<projectId>/start_booking` **202**
3. `GET /sakani-queries-service/cqrs-res?topic=booking_precondition_and_generate_token_check_completed`
4. `POST /mainIntermediaryApi/v4/units/reserve` **202**
5. `GET /sakani-queries-service/cqrs-res?topic=reserve_unit_completed`
6. → `/app/booking/v2/offplan/booking-summary` (step **1 / 3**), **Confirm Booking**
7. `POST /mainIntermediaryApi/v4/bookings/offplans` **200**
8. → `/app/booking/v2/offplan/success/21619?activeOffplanComprehensive=true`
   **"Success! Your booking has been placed, please complete you booking details to avoid cancellation."**
   plus a satisfaction-survey modal and a **Complete booking** CTA
9. Notification created: EN *"Congrats! The unit has been successfully booked."* /
   AR *"تهانينا! تم حجز الوحدة بنجاح"*

### 3.3 Booking completion — **reached the payment step**

`Complete booking` → booking detail `view-booking/21619` (titled `Booking 01-01-0504-999-165`),
showing *Steps to complete your booking*: **Payment method** → **Sign contract**, plus
**Cancel booking**.

`Select Payment Method` → `.../complete-booking`:

- Payment method: **Cash** only (`#cashRadio`) for this ineligible, non-beneficiary account
- Payment Schedule: 21 `fixed_payment_schedule___<id>` + ~20 `flexible_payment_schedule___<id>`
- **Save&continue** stays **disabled** until *both* a method and a schedule are chosen
- Supporting calls: `banks_by_project_code?project_code=01-01-0504`,
  `all_payment_schedules?filter[project_id]=2896&filter[schedule_type]=cash&filter[booking_id]=21619`

---

## 4. Business rules discovered

1. **One active booking per project.** Blocking modal:
   *"Sorry, you will not be able to book more than one unit in this project."* + **Return to project**.
   Enforced at the CQRS precondition stage, before any summary. Source of truth:
   `beneficiary/me.number_of_active_bookings_by_project` (observed `{"01-01-0317": 1, "02-01-0064": 1}`).
2. **Segment gating.** Units carry `target_segments` (`beneficiary`, `non_bene`, `company`). The
   fixture account has `is_non_beneficiary: true` and may only book `non_bene` inventory.
3. **Project-level gate.** `/mainIntermediaryApi/v4/projects/<id>.bookable` — when `false`,
   `start_booking` returns **403** and the page shows *"This project is not taking bookings yet!"*,
   even though units are listed as available.
4. **Booking fee.** `has_booking_fee` decides whether a payment/invoice step exists
   (project 2358 carries `booking_fee_include_tax: 8855.0`, `refund_fee_status: unpaid`).
5. **Booking lifecycle.** Created as `status: price_quotation`, `sale_contract_status: initial`;
   completion requires payment method then contract signing.
6. **Cancellation frees the project** — previously cancelled projects became re-bookable.
7. **Eligibility drives payment options.** `eligible_status: not_eligible` /
   `family_category: INELIGIBLE` ⇒ Cash only, no lending.
8. **Guest booking** redirects to login preserving the unit in `returnUrl`.

### Fixture account snapshot

| Field | Value |
|---|---|
| `is_non_beneficiary` | `true` |
| `eligible_status` / `family_category` | `not_eligible` / `INELIGIBLE` |
| `active` / `allocation_status` | `false` / `unallocated` |
| `finished_onboarding` | `false` |
| `purchase_power` | 1,537,619 |
| `number_of_active_bookings_by_project` | `{"01-01-0317": 1, "02-01-0064": 1}` |

### Project fixtures

| Id | Code | bookable | non-bene available | Role |
|---|---|---|---|---|
| 2896 | 01-01-0504 | ✅ | 406 | booking happy path |
| 1441 | 02-01-0064 | ✅ | 48 | one-booking-per-project block |
| 1187 | 01-01-0108 | ❌ | 278 | 403 project gate |
| 2358 | 01-01-0317 | ✅ | 2 | booking-fee variant |
| 2517 | 09-01-0004 | ✅ | 134 | land-only product |

---

## 5. Defects and environment limitations

| # | Finding | Severity |
|---|---|---|
| D1 | On a non-bookable project the **Book a unit** CTA stays visible and enabled; `start_booking` returns **403** and **no error is shown to the user** — the click silently does nothing | High |
| D2 | Header **English** toggle does not switch locale; only `?lang=en` works. `document.title` stays `سكني` in English | Medium |
| D3 | **View units** CTA renders outside the viewport (`Element is outside of the viewport`) | Medium |
| D4 | Pressing **Enter** in marketplace search does not apply the search | Low |
| D5 | Unit/project cards and filter chips are role-less clickable `div`s — no accessible name or keyboard path | Medium (a11y) |
| B1 | Nafath requires external approval in principle — **not a blocker in pre-production** (auto-approves) | — |
| B2 | Invisible reCAPTCHA/Turnstile passes from a real browser but can challenge by origin IP | Risk |
| B3 | Angular bundle is multi-megabyte; `/app/*` needs 10-16s and occasionally renders a shell without its feature bundle (one reload recovers) | Risk |
| B4 | Booking specs mutate pre-production state and are not idempotent | Process |

---

## 6. Prioritised scenarios

### P0 — Critical
| ID | Scenario | Type |
|---|---|---|
| AUTH-04 | Full Nafath login → marketplace | E2E happy path |
| AUTH-11 | Guest booking redirects to login with `returnUrl` | Critical path |
| BOOK-01 | Book an available unit through to success | E2E happy path |
| BOOK-02 | Second booking in same project refused | Negative |
| BOOK-06 | Non-beneficiary may only book `non_bene` inventory | Critical path |
| MKT-01 | Marketplace loads with results + map | Critical path |
| MKT-03 | Location search returns suggestions | Functional |
| MKT-05 | Filter panel exposes full taxonomy | Functional |
| PRJ-01 | Project detail renders all business sections | Critical path |
| PRJ-09 / PRJ-10 | Unit model listing / unit detail with CTA | Critical path |
| PROF-01 | My bookings lists bookings under status tabs | Critical path |

### P1 — High
AUTH-01/02/03 (form + validation) · AUTH-10 (logout) · BOOK-12 (completion: payment + contract) ·
BOOK-13 (403 on closed project) · BOOK-14 (eligibility on profile) · MKT-02 (tabs) · MKT-04 (sort) ·
MKT-05b/c (apply filters) · MKT-07 (segment in request) · PRJ-14 (navigation chain) ·
PRJ-15 (closed project state) · PROF-00/01b/02 (account menu, tab filter, booking detail) ·
NAV-01/08 (home, login entry) · SVC-03 (register interest)

### P2 — Medium
AUTH-06/07 (invalid identifiers) · AUTH-09 (bot challenge) · MKT-08 (clear filters) ·
MKT-10 (NHC destinations) · MKT-12 (pagination) · NAV-03/05 (mega-menus) · PRJ-03/04/05 (favorite,
media, developer) · SVC-01/02/04-11 (services catalogue) · COOKIE-01/02

### P3 — Low
NAV-06 (footer) · MKT-11 (insights) · PRJ-06/11 · SVC-12/13/14 · Edge cases: zero-result filters,
concurrent unit booking, session expiry mid-journey, RTL/LTR layout parity

---

## 7. Journeys not yet executed

Reached but not completed, and not blocked — simply beyond the session's scope:

- **Booking completion** past the payment step (contract signing, stage 2 of 2)
- **Cancel booking** (destructive; deliberately not exercised)
- **Register Interest** submit (guest lead + captcha)
- Services catalogue: eligibility checker, mortgage calculator, online lending, farz, conveyance,
  resale, auctions, vouchers, housing designs
- Account portal areas other than My Bookings
