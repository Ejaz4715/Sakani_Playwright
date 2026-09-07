# Sakani (pre-production) — Full Functional Test Design

**Application:** https://pre-sakani.housingapps.sa
**Phase:** manual test design only — no automation code produced or changed in this phase.
**Test identity:** national ID `1000011485` — beneficiary `42942`, non-beneficiary, `not_eligible`.

## How to read this document

- Every scenario below is **new**. The 39 already-automated cases (`AUTH-01…11`, `MKT-01…08`,
  `PRJ-01…15`, `BOOK-01…14`, `PROF-00…02`, `NAV-01…08`) are **not repeated**; they are listed in
  [exploration-report.md](exploration-report.md) and referenced only in the gap analysis.
- New IDs use module-specific prefixes that cannot collide with the automated set.
- **Type:** Positive · Negative · Validation · Boundary · Empty-State · Navigation · Session ·
  Security · Business-Rule · Error-Handling · Loading · UI/UX · Localization · Accessibility · Edge
- **Priority:** P0 critical · P1 high · P2 medium · P3 low
- Rows marked **(unverified)** describe a control that was observed but whose behaviour was not
  exercised during exploration; treat the expected result as the specification to confirm.

## Standing preconditions

Unless a row says otherwise:

- **PRE-A** — Chromium at 1440×900. Below ~1400px the marketplace toolbar collapses to icon-only
  buttons, which changes locators and some assertions.
- **PRE-B** — Language pinned with `?lang=en` or `?lang=ar`. The header language toggle does not
  reliably switch locale.
- **PRE-C** — Cookie-consent modal dismissed. Until dismissed it intercepts every pointer event.
- **PRE-D** — "Authenticated" means logged in as the test identity via Nafath (auto-approves in
  pre-production in ~10–15 s).
- **PRE-E** — `/app/*` views need 10–16 s to settle; assertions must wait, not poll instantly.

---

# 1. Authentication, Session & Authorization — `SEC`

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| SEC-01 | Identifier accepted as national ID | On login page | `1000011485` | Enter ID → Continue | Flow advances to Nafath modal | Positive | P0 |
| SEC-02 | Identifier accepted as mobile number | On login page | Registered mobile `0512344424` | Enter mobile → Continue | Same Nafath modal appears; account resolved | Positive | P1 |
| SEC-03 | Identifier accepted as email | On login page | `1000011483@test-sakani.housingapps.sa` | Enter email → Continue | Nafath modal appears | Positive | P1 |
| SEC-04 | ID shorter than 10 digits | On login page | `123456789` | Enter → attempt Continue | Blocked: button disabled or validation message; no network call | Validation | P1 |
| SEC-05 | ID longer than 10 digits | On login page | `100001148599` | Enter → observe field | Input capped at 10 or validation error | Boundary | P1 |
| SEC-06 | ID with letters/symbols | On login page | `10000!!485`, `abcdefghij` | Enter → attempt Continue | Rejected; no Nafath modal | Negative | P1 |
| SEC-07 | Leading/trailing whitespace trimmed | On login page | `" 1000011485 "` | Paste → Continue | Value trimmed and accepted | Validation | P2 |
| SEC-08 | Arabic-Indic digits | On login page | `١٠٠٠٠١١٤٨٥` | Enter → Continue | Either normalised and accepted, or a clear validation error (define expected) | Edge | P2 |
| SEC-09 | Whitespace-only identifier | On login page | `"    "` | Enter spaces | Continue stays disabled | Validation | P2 |
| SEC-10 | Nafath modal shows the submitted ID read-only | Identifier submitted | `1000011485` | Inspect modal field | Field pre-filled with submitted ID; not silently editable to another identity | Security | P1 |
| SEC-11 | Editing ID inside the Nafath modal | Identifier submitted | Change to `1119880209` | Edit field → Continue | Either blocked, or the new identity is validated server-side — must never authenticate the original ID | Security | P0 |
| SEC-12 | Cancel/close the Nafath modal | Nafath modal open | — | Close modal | Returns to identifier step; no session created | Navigation | P1 |
| SEC-13 | Nafath challenge number is displayed | Nafath initiated | — | Read push screen | A 1–3 digit number is shown with instructions | Positive | P1 |
| SEC-14 | Nafath request expires | Nafath initiated | Wait past expiry (~5 min) | Do not approve; wait | Timeout state with a retry affordance; no session created | Negative | P1 |
| SEC-15 | Repeat Continue clicks during Nafath | Nafath initiated | — | Click Continue repeatedly | Only one Nafath request raised; no duplicate `iam` calls | Duplicate-Action | P1 |
| SEC-16 | Direct access to protected route as guest | Logged out | `/app/user-profile/my-activities/my-bookings/listing` | Open URL | Redirect to login; after auth, land on the requested page | Security | P0 |
| SEC-17 | Deep-link to a booking of another user | Authenticated | `view-booking/<foreign id>` | Open URL | Access denied / not found — never another beneficiary's data | Security | P0 |
| SEC-18 | Session persists across refresh | Authenticated | — | F5 on `/app/marketplace` | Still authenticated; header shows the user | Session | P0 |
| SEC-19 | Session persists in a new tab | Authenticated | — | Open `/app/marketplace` in new tab | Authenticated in the new tab | Session | P1 |
| SEC-20 | Logout clears session everywhere | Authenticated, 2 tabs | — | Logout in tab 1 → act in tab 2 | Tab 2 is unauthenticated on next protected action | Session | P0 |
| SEC-21 | Back button after logout | Just logged out | — | Browser Back to a protected page | Not served from cache as authenticated; redirected to login | Security | P0 |
| SEC-22 | Session expiry mid-journey | Authenticated, booking summary open | Expire/clear token | Click Confirm Booking | Graceful redirect to login with a clear message; no partial booking | Session | P0 |
| SEC-23 | Login while already authenticated | Authenticated | — | Open `/app/authentication/login` | Redirect to marketplace or a signed-in state — not a second session | Session | P2 |
| SEC-24 | reCAPTCHA challenge appears | Untrusted IP | — | Submit identifier | Interactive challenge is solvable and the flow resumes after solving | Error-Handling | P2 |
| SEC-25 | Login with unregistered but valid-format ID | On login page | `1111111111` | Enter → Continue | Clear "not registered" style error; no Nafath | Negative | P1 |
| SEC-26 | Terms/Privacy links on login open correctly | On login page | — | Click Terms of Use, Privacy Policy | `/terms` and `/housing-subsidy-policy` open and render | Navigation | P3 |
| SEC-27 | Browser Back during Nafath push | Nafath push screen | — | Press Back | Returns to identifier step cleanly; no orphaned pending request | Navigation | P2 |
| SEC-28 | Rapid repeated login submissions | On login page | `1000011485` ×5 | Press Enter 5× quickly | Single auth flow; no duplicate sessions or rate-limit error page | Duplicate-Action | P2 |

# 2. Global Shell, Cookies & Chrome — `SHL`

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| SHL-01 | Accept cookies persists across sessions | Fresh profile | — | Accept → close browser → reopen | Modal does not reappear | Positive | P2 |
| SHL-02 | Reject cookies keeps site usable | Fresh profile | — | Click reject | Modal closes; browsing and search still work | Negative | P2 |
| SHL-03 | Cookie modal blocks interaction until dismissed | Fresh profile | — | Try clicking nav behind modal | Clicks intercepted by the static backdrop | UI/UX | P2 |
| SHL-04 | Cookie modal variant on Angular routes | Fresh profile | `/app/authentication/login` | Load page | `ngb-modal-window.cookie-modal` variant shown and dismissible | UI/UX | P3 |
| SHL-05 | DGA government banner expands | Any page | — | Click "How you know?" | Panel expands showing `.sa`/HTTPS assurances and registration no. `20250428955` | UI/UX | P3 |
| SHL-06 | Sakani Assistant chat opens | Any page | — | Click chat bubble | Chat iframe opens, is closable, and does not block the page | UI/UX | P2 |
| SHL-07 | Accessibility widget toggles | Any page | — | Open accessibility tool | Options apply (contrast, text size) and are reversible | Accessibility | P2 |
| SHL-08 | Marketplace coach-mark dismissal | First marketplace visit | — | Close "Find more Sakani products" tooltip | Tooltip closes and does not reappear in the same session | UI/UX | P2 |
| SHL-09 | Coach-mark does not block chips | Marketplace loaded | — | Click a chip beneath the tooltip | Chip is reachable, or tooltip auto-dismisses on interaction | UI/UX | P2 |
| SHL-10 | Header search opens global search | Any page | — | Click header Search | Global search surface opens and accepts a query | Navigation | P2 |
| SHL-11 | Sticky header on scroll | Long page | — | Scroll down | Header stays usable; mega-menus still open correctly | UI/UX | P3 |
| SHL-12 | Footer links open correct targets | Any page | — | Click each footer link | All 12 resolve; external ones open appropriately | Navigation | P3 |
| SHL-13 | 404 handling | — | `/app/this-does-not-exist` | Open URL | Friendly not-found page with a route back, not a blank shell | Error-Handling | P1 |
| SHL-14 | Offline / API outage banner | Authenticated | Block `mainIntermediaryApi` | Load marketplace | Error state with retry; not an infinite skeleton | Error-Handling | P1 |
| SHL-15 | Slow bundle loading state | Throttled network | — | Load `/app/marketplace` | Skeleton/spinner shown; no interactive controls before hydration | Loading | P1 |

# 3. Navigation & Mega-Menus — `NVX`

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| NVX-01 | Properties for Rent menu items route correctly | Home | — | Open menu → click Apartment / Villa / Floor | `/app/marketplace?marketplace_purpose=rent&unit_types=<type>` with the filter pre-applied | Navigation | P1 |
| NVX-02 | Offplan / Ready units / Lands routes | Home | — | Click each under Properties for Sale | `product_types=units_under_construction / readymade_units / lands` applied | Navigation | P1 |
| NVX-03 | Services menu — all 12 destinations | Home | — | Click each item | Each service landing page loads with its own breadcrumb | Navigation | P2 |
| NVX-04 | Developers list from menu | Home | — | Click "Developers list" | `/app/developers` loads with the directory | Navigation | P2 |
| NVX-05 | Publish your units → external Digitar | Home | — | Click "Publish your units" | Opens `digitar.sakani.sa` (new tab expected) | External | P2 |
| NVX-06 | Rental Indicators external report | Home | — | Click Rental Indicators | `/reports-and-data/rental-units` loads | Navigation | P3 |
| NVX-07 | Real Estate Indicators external | Footer | — | Click | Opens `rei.rega.gov.sa` in a new tab | External | P3 |
| NVX-08 | Auctions entry point | Home | — | Click Auctions | Auctions surface loads (menu had no href — confirm destination) **(unverified)** | Navigation | P1 |
| NVX-09 | Help entry point | Home | — | Click Help | Help/support surface loads **(unverified)** | Navigation | P2 |
| NVX-10 | Mega-menu closes on outside click | Menu open | — | Click page body | Panel closes and does not intercept the click target | UI/UX | P2 |
| NVX-11 | Mega-menu keyboard access | Home | — | Tab to nav item, press Enter/Arrow | Panel opens and items are reachable by keyboard | Accessibility | P2 |
| NVX-12 | Breadcrumbs on deep pages | Project/unit page | — | Inspect breadcrumb | Home → Marketplace → Project (→ Unit) and each hop navigates back correctly | Navigation | P2 |
| NVX-13 | "Back to Sakani" from DWE shell | Project page | — | Click Back to Sakani | Returns to `/app` retaining the session | Navigation | P2 |
| NVX-14 | "Go to NHC Marketplace" from unit page | Unit page | — | Click link | Opens `nhc.sakani.sa` | External | P2 |

# 4. Home Page & Hero Search — `HOM`

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| HOM-01 | Hero tab switch changes search context | Home | — | Switch Offplan → Ready units → Rental units | Filter set and submitted purpose change per tab | Positive | P1 |
| HOM-02 | Hero search with a city | Home | `Riyadh` | Type city → Search | Navigates to marketplace with the location applied | Positive | P1 |
| HOM-03 | Hero search with empty city | Home | — | Click Search with everything blank | Either blocked with a hint, or default listing opens (define expected) | Validation | P2 |
| HOM-04 | Hero unit-type filter | Home | Villa | Select unit type → Search | Marketplace opens with `unit_types=villa` | Positive | P2 |
| HOM-05 | Hero price-range filter | Home | 100000–500000 | Set range → Search | Price filter carried into marketplace URL | Positive | P2 |
| HOM-06 | Hero rooms filter | Home | 3 | Select rooms → Search | Rooms filter applied | Positive | P2 |
| HOM-07 | "Search with AI" entry | Home | Free text | Click AI search → enter a natural query | AI search surface responds with relevant results **(unverified)** | Positive | P1 |
| HOM-08 | AI search with nonsense input | Home | `asdkjhasd` | Submit | Graceful no-results/clarification, not an error page | Negative | P2 |
| HOM-09 | Personalised services selector | Home | — | Switch Broker / Developer / Self-build / Buyer / Tenant | Content panel changes per persona | Positive | P2 |
| HOM-10 | Khuzam destination "Explore more" | Home | — | Click | Destination page opens with unit and area statistics | Navigation | P2 |
| HOM-11 | Best-selling carousel navigation | Home | — | Use next/prev and dots | Slides advance, loop correctly, and cards are clickable | UI/UX | P3 |
| HOM-12 | Best-selling card opens the unit | Home | — | Click a card | Correct unit/project detail opens | Navigation | P2 |
| HOM-13 | Deferred-subsidy iframe renders | Home | — | Scroll to section | Embedded `/app/marketplace/deferred-subsidy-projects` renders and is interactive | Positive | P2 |
| HOM-14 | Deferred-subsidy "Explore more projects" | Home | — | Click CTA | Marketplace opens filtered to deferred subsidy | Navigation | P2 |
| HOM-15 | App-download links | Home | — | Click store badges | Correct store URLs open | External | P3 |
| HOM-16 | "Rate your experience" side tab | Home | — | Open the side rating tab | Feedback widget opens and can be closed without submitting | UI/UX | P3 |
| HOM-17 | Digitar "Join now" CTA | Home | — | Click | `digitar.sakani.sa` opens | External | P3 |

# 5. Marketplace — Search — `SRCH`

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| SRCH-01 | Suggestions grouped by type | Marketplace | `Riyadh` | Type term | Groups shown (Location, Property) with a "Show more results" affordance | Positive | P1 |
| SRCH-02 | Selecting a location suggestion filters results | Marketplace | `Riyadh, KSA` | Pick suggestion | Result count and map viewport update to that location | Positive | P0 |
| SRCH-03 | Enter alone does not search | Marketplace | `Riyadh` | Type then press Enter without selecting | **Known behaviour:** nothing applies. Confirm whether this is intended UX | Negative | P1 |
| SRCH-04 | "Show more results" expands the list | Marketplace | `Riyadh` | Click Show more results | Additional suggestions render | Positive | P2 |
| SRCH-05 | Search by project name | Marketplace | `Interactive Map 25May` | Type project name | Project appears under a project/property group and opens correctly | Positive | P1 |
| SRCH-06 | Search by developer/company | Marketplace | `Automation Testing Company Riyadh` | Type company name | Company suggestion appears | Positive | P2 |
| SRCH-07 | Search by neighbourhood | Marketplace | `Al Muruj` | Type | Neighbourhood suggestion appears and filters | Positive | P2 |
| SRCH-08 | Arabic search term | Marketplace `lang=ar` | `الرياض` | Type | Arabic suggestions returned | Localization | P1 |
| SRCH-09 | No-match search term | Marketplace | `zzzzzzzz` | Type | Empty-suggestion state, no spinner hang, no error | Empty-State | P1 |
| SRCH-10 | Single-character query | Marketplace | `R` | Type | Either min-length guard or sensible suggestions; no unbounded result set | Boundary | P2 |
| SRCH-11 | Very long query | Marketplace | 300-char string | Paste | Input capped or handled; no crash or 500 | Boundary | P2 |
| SRCH-12 | Special characters / injection-like input | Marketplace | `<script>alert(1)</script>`, `%%%` | Type | Escaped safely; no script execution, no server error | Security | P1 |
| SRCH-13 | Clearing search restores default listing | Search applied | — | Clear the input | Results revert to the default listing | Positive | P1 |
| SRCH-14 | Search term survives refresh | Search applied | `Riyadh` | F5 | Location filter persists via the URL | Session | P1 |
| SRCH-15 | Rapid typing debounce | Marketplace | Type quickly | Observe network | Requests debounced; no request storm | Loading | P2 |
| SRCH-16 | Search combined with active filters | Filters applied | `Riyadh` + Villa | Apply both | Both constraints applied together, not one replacing the other | Positive | P0 |

# 6. Marketplace — Filters — `FLT`

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| FLT-01 | Eligibility = Beneficiary | Marketplace | — | Select Beneficiary → Apply | Only beneficiary-segment inventory listed | Business-Rule | P0 |
| FLT-02 | Eligibility = All | Marketplace | — | Select All → Apply | Both segments listed | Business-Rule | P1 |
| FLT-03 | Payment option = Deferred Subsidy | Marketplace | — | Select → Apply | Only projects with a deferred-subsidy contract listed | Business-Rule | P1 |
| FLT-04 | Construction status = Readymade Units | Marketplace | — | Select → Apply | `product_types=readymade_units` and results match | Positive | P1 |
| FLT-05 | Construction status = Lands | Marketplace | — | Select → Apply | Land products only; unit-specific chips (rooms/baths) hidden or disabled | Positive | P1 |
| FLT-06 | Project status = Bookings Open | Marketplace | — | Select → Apply | Only bookable projects; each opened project shows an active booking CTA | Business-Rule | P0 |
| FLT-07 | Project status = Available Soon | Marketplace | — | Select → Apply | Only not-yet-bookable projects | Business-Rule | P1 |
| FLT-08 | Project status = Last few units left | Marketplace | — | Select → Apply | Low-inventory projects flagged consistently on cards | Business-Rule | P2 |
| FLT-09 | Property type multi-select | Marketplace | Apartment + Villa | Select both → Apply | Union of both types returned | Positive | P1 |
| FLT-10 | Price min only | Marketplace | min 500000 | Apply | All results ≥ 500,000 | Boundary | P1 |
| FLT-11 | Price max only | Marketplace | max 200000 | Apply | All results ≤ 200,000 | Boundary | P1 |
| FLT-12 | Price min > max | Marketplace | min 900000, max 100000 | Apply | Validation error or auto-swap; never a silent empty list | Validation | P1 |
| FLT-13 | Price = 0 | Marketplace | min 0, max 0 | Apply | Handled gracefully; defined empty or all-results behaviour | Boundary | P2 |
| FLT-14 | Negative price | Marketplace | -1000 | Type | Rejected by the input | Validation | P2 |
| FLT-15 | Non-numeric price | Marketplace | `abc` | Type | Rejected / stripped | Validation | P2 |
| FLT-16 | Very large price | Marketplace | 999,999,999,999 | Apply | No overflow; empty state handled | Boundary | P2 |
| FLT-17 | Area range min/max | Marketplace | 100–200 m² | Apply | Results within range | Boundary | P1 |
| FLT-18 | Area min > max | Marketplace | 500–100 | Apply | Validation or swap | Validation | P2 |
| FLT-19 | Rooms = 1 (lower bound) | Marketplace | 1 | Apply | Only 1-bedroom results | Boundary | P1 |
| FLT-20 | Rooms = +6 (upper bound) | Marketplace | +6 | Apply | Results with 6 or more bedrooms | Boundary | P1 |
| FLT-21 | Rooms multi-select | Marketplace | 2 + 3 | Apply | Union returned | Positive | P2 |
| FLT-22 | Bathrooms bounds | Marketplace | 1 and +6 | Apply each | Correct filtering at both ends | Boundary | P2 |
| FLT-23 | Combination: eligibility + type + price + rooms | Marketplace | Non-bene + Villa + 100k–1M + 4 | Apply all | All constraints applied simultaneously; count consistent with the list | Positive | P0 |
| FLT-24 | Impossible combination → empty state | Marketplace | Land + 6 bedrooms + 0–1 SAR | Apply | Explicit "no results" state with a way to clear filters | Empty-State | P1 |
| FLT-25 | Clear resets every group | Filters applied | — | Open panel → Clear | All groups reset, price/area inputs emptied | Positive | P1 |
| FLT-26 | Clear without Apply | Filters applied | — | Clear then close panel without Apply | Prior filters remain until Apply is pressed (define expected) | UI/UX | P2 |
| FLT-27 | Close panel with X discards edits | Panel open with edits | — | Close panel | Edits discarded; previous result set unchanged | Cancel-Behaviour | P2 |
| FLT-28 | Filters persist after refresh | Filters applied | — | F5 | Filters restored from the URL | Session | P1 |
| FLT-29 | Filters persist on Back from a project | Filters applied | — | Open a project → Back | Filtered list restored, not reset to default | Session | P0 |
| FLT-30 | Filter state reflected in URL | Filters applied | — | Inspect URL | Shareable URL reproduces the same result set in a new tab | Positive | P1 |
| FLT-31 | Quick chip mirrors panel state | Marketplace | Property type | Set via chip, open panel | Panel shows the same selection (no divergence) | UI/UX | P1 |
| FLT-32 | Applied-filter count badge | Filters applied | 3 filters | Observe Filter button | Badge/indicator reflects the number applied | UI/UX | P2 |
| FLT-33 | "For you" chip uses stored preferences | Authenticated | — | Enable For you | Results align with the profile's preferred type/price/rooms | Business-Rule | P1 |
| FLT-34 | "Register Interested" chip | Authenticated | — | Enable chip | Only projects the user registered interest in are listed | Business-Rule | P2 |
| FLT-35 | Map-bounds filtering | Marketplace | — | Pan/zoom the map | `coordinates=[...]` polygon updates and results follow the viewport | Positive | P1 |
| FLT-36 | Map bounds + filters together | Filters applied | — | Pan map | Both constraints combine | Positive | P2 |
| FLT-37 | Filter with zero inventory segment | Non-bene account | Beneficiary-only project set | Apply | Segment rule respected; no bookable beneficiary-only unit exposed as bookable | Business-Rule | P0 |

# 7. Marketplace — Sorting, Listing & Map — `LST`

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| LST-01 | Sort Price high→low is correct | Results present | — | Apply sort | Prices descend across the visible list | Positive | P1 |
| LST-02 | Sort Price low→high is correct | Results present | — | Apply sort | Prices ascend | Positive | P1 |
| LST-03 | Sort Newest / Oldest first | Results present | — | Apply each | Publish-date order matches the label | Positive | P2 |
| LST-04 | Sort "Most popular" | Results present | — | Apply | Ordering follows views/popularity signal | Positive | P2 |
| LST-05 | Sort persists with filters | Filters applied | Price low→high | Apply both | Sort preserved after filtering | Positive | P1 |
| LST-06 | Sort persists after refresh | Sort applied | — | F5 | `sort=` retained in URL | Session | P2 |
| LST-07 | Sort resets to Recommended on Clear | Sort applied | — | Clear filters | Defined default restored | UI/UX | P3 |
| LST-08 | Sort modal Close discards | Modal open | — | Close with X | No sort change applied | Cancel-Behaviour | P2 |
| LST-09 | Result count matches listing | Results present | — | Compare "N Projects" with card count/pagination | Count is accurate | Positive | P1 |
| LST-10 | Units tab shows unit models | Marketplace | — | Switch to Units | Header reads "N Unit Models"; cards are model collections | Positive | P1 |
| LST-11 | Pagination / infinite scroll loads more | Many results | — | Scroll or page forward | More cards load without duplicates | Positive | P1 |
| LST-12 | Card badges are accurate | Results present | — | Inspect badges | "Available soon", "N units left", "Promoted" match project state | Business-Rule | P1 |
| LST-13 | Favorite from a card | Authenticated | — | Click heart on a card | Marked favourite; appears under Favorites; toggle removes it | Positive | P1 |
| LST-14 | Favorite as guest | Logged out | — | Click heart | Prompts login rather than silently failing | Security | P2 |
| LST-15 | Map pin cluster expands | Map visible | — | Click a numbered cluster | Zooms/expands to individual pins | Positive | P2 |
| LST-16 | Map pin ↔ card highlighting | Map visible | — | Hover/click a pin | Corresponding card is highlighted or scrolled into view | UI/UX | P2 |
| LST-17 | View map / list toggle | Marketplace | — | Toggle | Layout switches and results stay consistent | UI/UX | P2 |
| LST-18 | "Find my location" control | Map visible | Deny then allow geolocation | Click control | Denied → graceful message; allowed → map centres on the user | Error-Handling | P2 |
| LST-19 | Map zoom in/out limits | Map visible | — | Zoom to both extremes | No crash; results update sensibly at each level | Boundary | P3 |
| LST-20 | Empty result set on the map | Impossible filters | — | Apply | Map shows no pins with a matching empty-state message | Empty-State | P1 |
| LST-21 | Rent purpose listing | — | `marketplace_purpose=rent` | Load | "Rental Units" heading; rent-specific chips (no Register Interested) | Positive | P1 |
| LST-22 | Lands purpose listing | — | `product_types=lands` | Load | Land chips only; rooms/baths not offered | Positive | P1 |
| LST-23 | Compare units | Unit pages | 2–3 units | Add to Compare | Comparison view shows the selected units side by side **(unverified)** | Positive | P1 |
| LST-24 | Compare limit exceeded | Compare in use | 4+ units | Add beyond the limit | Clear limit message | Boundary | P2 |
| LST-25 | Insights & trends widget | Marketplace | — | Read widget | Avg price and monthly reservations render with MoM deltas | Positive | P3 |
| LST-26 | NHC destination card opens external site | Marketplace | — | Click a destination | `pre-sakani-nhc.housingapps.sa/mega-project/<id>` opens | External | P2 |

# 8. Project Detail — `PDP`

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| PDP-01 | Media gallery opens and navigates | Project page | Project 1187 (19 media) | Open gallery | Images/videos browse; counter accurate; closes cleanly | Positive | P2 |
| PDP-02 | 360° view loads | Project with 360 | — | Click 360 view | Viewer loads and is interactive | Positive | P2 |
| PDP-03 | Favorite a project | Authenticated | — | Click Favorite | Persists after refresh; appears in Favorites → Projects | Positive | P1 |
| PDP-04 | Share project | Project page | — | Click Share | Share options/copy-link produce a URL that reopens the same project | Positive | P2 |
| PDP-05 | Brochure download/preview | Project with brochure | — | Click Brochure | File opens or downloads; Arabic variant available | Positive | P2 |
| PDP-06 | Masterplan document | Project/unit with masterplan | — | Click View file | Document opens | Positive | P2 |
| PDP-07 | Developer link | Project page | — | Click developer | `/app/developers/<cr>` opens with matching developer | Navigation | P2 |
| PDP-08 | Get directions | Project page | — | Click | External maps opens at the project coordinates | External | P2 |
| PDP-09 | Call developer | Project page | — | Click Call | `tel:` handler triggered | External | P3 |
| PDP-10 | WhatsApp developer | Project page | — | Click WhatsApp | WhatsApp target opens | External | P3 |
| PDP-11 | Transactions table content | Project page | — | Inspect | Date/price/area rows render; sorting/paging if offered | Positive | P2 |
| PDP-12 | Demographics widget | Project page | — | Inspect | Bayanat-powered age/community data renders; failure degrades gracefully | Error-Handling | P3 |
| PDP-13 | Payment schedule "View details" | Project with schedule | — | Click | Modal/panel shows phases, number of payments, duration | Positive | P1 |
| PDP-14 | Participating banks "See more" | Project page | — | Click | Full bank list expands; each "Online lending" entry routes correctly | Positive | P2 |
| PDP-15 | Owners Association external link | Project page | — | Click "click here" | `mullak.housing.gov.sa` opens | External | P3 |
| PDP-16 | Housing assistance packages empty state | Project 1441 | — | Inspect section | "No have data yet" shown rather than a broken block | Empty-State | P2 |
| PDP-17 | Register Interest CTA from project | Project page | — | Click "Register Interest" | `/app/register-interest?project_id=<id>` opens with the project pre-selected | Navigation | P1 |
| PDP-18 | Project with zero available units | Such a project | — | Open | Unit-models section shows an empty state; no bookable CTA | Empty-State | P1 |
| PDP-19 | Bookings-closed project messaging | Project 1187 | — | Open | "This project is not taking bookings yet!" is displayed prominently | Business-Rule | P0 |
| PDP-20 | Deferred subsidy badge accuracy | Project 1187 | — | Inspect | "Applied Deferred Subsidy Contract (5% - 95%)" matches project config | Business-Rule | P1 |
| PDP-21 | Target audience field | Various projects | — | Inspect | "For All" / segment-specific value matches the project's target segments | Business-Rule | P1 |
| PDP-22 | Direct URL to an invalid project id | — | `/app/offplan-projects/99999999` | Open | Not-found state, not a blank shell or stack trace | Error-Handling | P1 |
| PDP-23 | Project page as guest | Logged out | — | Open project | Public content visible; booking CTA routes to login | Security | P1 |
| PDP-24 | Refresh preserves scroll/section | Project page | — | Scroll to Units → F5 | Page reloads without error (scroll restoration optional) | Session | P3 |

# 9. Unit Model & Unit Detail — `UMD` / `UDP`

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| UMD-01 | Size-band chips filter units | Model 2036 | All 394 / Small 383 / Average 9 / Big 2 | Click each chip | Counts match the rendered list | Positive | P1 |
| UMD-02 | Chip counts sum to All | Model 2036 | — | Compare | Band counts reconcile with the All count | Boundary | P2 |
| UMD-03 | Pagination across unit pages | Model 792 (69 units) | — | Page 1→Last | No duplicates or gaps; First/Last behave | Positive | P1 |
| UMD-04 | Sort within a unit model | Model page | — | Apply sort | Ordering applies to units | Positive | P2 |
| UMD-05 | Filter within a unit model | Model page | — | Apply filter | Subset returned with an accurate count | Positive | P2 |
| UMD-06 | Unit model with a single unit | Model 581 ("All 1") | — | Open | Single card renders; pagination hidden | Boundary | P2 |
| UMD-07 | Invalid unit-model id | — | `/app/unit-models/99999999` | Open | Not-found state | Error-Handling | P2 |
| UDP-01 | Unit attributes render completely | Unit 135553 | — | Inspect | Type, baths, beds, area, city, front, region, corner, block (+deed where present) | Positive | P1 |
| UDP-02 | Price excludes VAT labelling | Unit page | — | Inspect | "Excl. VAT" shown next to the price | Business-Rule | P1 |
| UDP-03 | Beneficiary vs non-beneficiary price | Unit with both | — | Inspect | Subsidised and non-subsidised prices both shown and correctly labelled | Business-Rule | P0 |
| UDP-04 | Favorite a unit | Authenticated | — | Click Favorite | Persists; appears in Favorites → Units | Positive | P1 |
| UDP-05 | Compare from unit page | Authenticated | — | Click Compare | Unit added to comparison | Positive | P2 |
| UDP-06 | Mortgage Calculator CTA | Unit page | — | Click | `/app/mortgage-page` opens, ideally pre-filled with the unit price | Navigation | P1 |
| UDP-07 | "More units in <city>" carousel | Unit page | — | Browse | Related units load and open correctly | Positive | P2 |
| UDP-08 | Booked/sold unit state | A non-available unit | — | Open | Status reflects booked/sold; booking CTA disabled or absent | Business-Rule | P0 |
| UDP-09 | Unit belonging to a closed project | Unit 132976 | — | Open | "Bookings closed" state shown. **Defect:** CTA still enabled and 403 is silent | Negative | P0 |
| UDP-10 | Invalid unit id | — | `/app/units/99999999` | Open | Not-found state | Error-Handling | P2 |
| UDP-11 | Unit page as guest | Logged out | — | Open | Public content renders; Book routes to login with return URL | Security | P0 |
| UDP-12 | Views counter increments | Unit page | — | Reload a few times | Counter behaves sanely (no wild inflation) | Edge | P3 |

# 10. Booking — Start & Preconditions — `BST`

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| BST-01 | Loading state during precondition check | Authenticated, bookable unit | — | Click Book a unit | Spinner/disabled CTA while the 202 + CQRS check runs | Loading | P1 |
| BST-02 | Double-click Book | Authenticated | — | Click Book twice fast | Only one `start_booking` request; no duplicate reservation | Duplicate-Action | P0 |
| BST-03 | Book while another booking session is active | Active session | — | Start a second booking elsewhere | Blocked or the previous session is released cleanly | Business-Rule | P1 |
| BST-04 | Precondition failure messaging | Blocked account | — | Click Book | Human-readable reason, not a silent no-op | Error-Handling | P0 |
| BST-05 | 403 on a closed project shows an error | Unit in project 1187 | — | Click Book | **Currently fails:** nothing is shown. Expected: explicit error toast/modal | Error-Handling | P0 |
| BST-06 | Unit taken between listing and booking | Concurrency | Two sessions | Book the same unit from both | Second attempt fails with a clear "no longer available" message | Edge | P1 |
| BST-07 | Beneficiary-only unit blocked for non-bene | Non-bene account | Beneficiary-segment unit | Attempt booking | Blocked by segment rule with explanation | Business-Rule | P0 |
| BST-08 | Booking with an unpaid prior booking fee | `number_unpaid_bookings > 0` | — | Attempt booking | Blocked/redirected to settle the outstanding fee | Business-Rule | P1 |
| BST-09 | "Return to project" from the block modal | Block modal shown | — | Click Return to project | Navigates back to the project page; modal closes | Navigation | P1 |
| BST-10 | Dismiss the block modal without acting | Block modal shown | — | Close with X / Esc | Modal closes; user stays on the unit page; no booking created | Cancel-Behaviour | P1 |
| BST-11 | CQRS polling timeout | Slow backend | — | Start booking | Timeout surfaces an error with retry, not an infinite spinner | Error-Handling | P1 |
| BST-12 | Network drop during start_booking | Authenticated | Kill network mid-call | Click Book | Error state and safe retry; no orphaned reservation | Error-Handling | P1 |

# 11. Booking — Summary & Confirmation — `BSM`

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| BSM-01 | Summary data matches the selected unit | Summary reached | Unit 156428 | Compare fields | Project, developer, block, building, apartment, floor all match | Positive | P0 |
| BSM-02 | Both price variants displayed | Summary reached | — | Inspect | Non-subsidised and subsidised prices shown and labelled | Business-Rule | P0 |
| BSM-03 | Step indicator shows 1 / 3 | Summary reached | — | Inspect | Progress indicator correct | UI/UX | P2 |
| BSM-04 | Back from summary releases the reservation | Summary reached | — | Click Back | Returns to the unit; the soft reservation is released or clearly retained (define) | Business-Rule | P0 |
| BSM-05 | Refresh on the summary page | Summary reached | — | F5 | Summary re-renders from server state, or redirects safely — never a blank page | Session | P1 |
| BSM-06 | Direct URL to booking-summary without a reservation | Authenticated | Open the URL directly | Navigate | Redirect to marketplace/unit; no orphan summary | Security | P1 |
| BSM-07 | Double-click Confirm Booking | Summary reached | — | Click Confirm twice | Exactly one booking created | Duplicate-Action | P0 |
| BSM-08 | Confirm disabled while submitting | Summary reached | — | Click Confirm | Button disables/shows progress until the response returns | Loading | P1 |
| BSM-09 | Reservation hold expiry | Summary reached | Wait past the hold window | Then Confirm | Clear expiry message and safe restart | Edge | P1 |
| BSM-10 | Confirm after the unit was taken | Concurrency | — | Confirm | Fails gracefully with an explanatory message | Error-Handling | P1 |
| BSM-11 | Session expires before Confirm | Summary reached | Clear token | Confirm | Redirect to login; no partial booking | Session | P0 |
| BSM-12 | Backend 500 on create booking | Summary reached | Force error | Confirm | Error surfaced; user can retry without losing the reservation | Error-Handling | P1 |

# 12. Booking — Success & Post-State — `BSC`

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| BSC-01 | Success message content | Booking created | Booking 21619 | Read page | "Success! Your booking has been placed, please complete you booking details to avoid cancellation." *(note the copy typo "complete you")* | Positive | P0 |
| BSC-02 | Copy defect — "complete you booking" | Booking created | — | Read message | **Defect:** should read "complete your booking" | UI/UX | P2 |
| BSC-03 | Feedback survey opens automatically | Booking created | — | Observe | "Tell us about your impression" modal appears with Send disabled | UI/UX | P2 |
| BSC-04 | Send disabled until a rating is given | Survey open | — | Inspect Send | Disabled until a satisfaction option is chosen | Validation | P2 |
| BSC-05 | Submit the survey | Survey open | Rating + comment | Choose rating → Send | Confirmation; survey does not reappear for the same booking | Positive | P2 |
| BSC-06 | Close the survey without submitting | Survey open | — | Click Close | Modal closes; success page remains usable | Cancel-Behaviour | P2 |
| BSC-07 | Booking appears in My Bookings → Active | Booking created | — | Open My Bookings | New booking listed with correct unit code and date | Positive | P0 |
| BSC-08 | Booking notification generated | Booking created | — | Open Notifications | "Congrats! The unit has been successfully booked." present; unread count increments | Positive | P1 |
| BSC-09 | Unit no longer bookable after booking | Booking created | Same unit | Reopen the unit | Status is no longer "available" for others | Business-Rule | P0 |
| BSC-10 | Refresh the success page | Booking created | — | F5 | Success state re-renders for that booking id | Session | P2 |
| BSC-11 | Revisit the success URL later | Booking created | — | Reopen URL | Still valid or redirects to booking detail — never an error | Session | P2 |
| BSC-12 | Success page for another user's booking | Authenticated | Foreign booking id | Open URL | Access denied | Security | P0 |
| BSC-13 | Booking status is `price_quotation` | Booking created | — | Check My Bookings/API | Initial status and `sale_contract_status: initial` | Business-Rule | P1 |

# 13. Booking Completion — Payment Method — `BPM`

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| BPM-01 | Save&continue disabled initially | Payment step open | — | Inspect | Disabled until both method and schedule are selected | Validation | P0 |
| BPM-02 | Method only → still disabled | Payment step | Cash | Select Cash only | Still disabled | Validation | P0 |
| BPM-03 | Schedule only → still disabled | Payment step | Fixed Cash 1 | Select schedule only | Still disabled | Validation | P1 |
| BPM-04 | Both selected → enabled | Payment step | Cash + Fixed Cash 1 | Select both | Enabled | Positive | P0 |
| BPM-05 | Only Cash offered to an ineligible account | Non-bene, not eligible | — | Inspect methods | Cash only; no lending option | Business-Rule | P0 |
| BPM-06 | Lending offered to an eligible account | Eligible account | — | Inspect methods | Lending/mortgage option present | Business-Rule | P1 |
| BPM-07 | Fixed schedules listed | Payment step | 21 fixed | Inspect | Each shows name, number of payments, unit price, duration | Positive | P1 |
| BPM-08 | Flexible schedules listed | Payment step | ~20 flexible | Inspect | Rendered with correct payment counts | Positive | P1 |
| BPM-09 | Schedule "View details" | Payment step | Any schedule | Click View details | Breakdown of instalments shown; closable | Positive | P1 |
| BPM-10 | Schedule price differs from unit price | Payment step | Payment 12 (SAR 210,000) | Compare | Price differences are explained (premium/discount), not silently inconsistent | Business-Rule | P1 |
| BPM-11 | Switching schedule updates the selection | Payment step | Two schedules | Select A then B | Only B selected (radio semantics) | Positive | P2 |
| BPM-12 | Selection persists on Back and return | Payment step | Cash + schedule | Select → Back → return | Selection retained or clearly reset (define expected) | Session | P1 |
| BPM-13 | Refresh loses/keeps selection | Payment step | — | F5 | Defined behaviour; no crash | Session | P2 |
| BPM-14 | Save&continue advances to contract | Payment step | Cash + fixed | Click Save&continue | Contract-signing stage opens; booking detail reflects the chosen method | Positive | P0 |
| BPM-15 | Double-click Save&continue | Payment step | — | Click twice | Single submission | Duplicate-Action | P1 |
| BPM-16 | "Booking details" side button | Payment step | — | Click | Booking summary panel opens without losing the selection | Navigation | P2 |
| BPM-17 | Empty schedule list | Project without schedules | — | Open payment step | Empty state with guidance, not a blank list | Empty-State | P1 |
| BPM-18 | Direct URL to complete-booking for a foreign booking | Authenticated | Foreign id | Open URL | Access denied | Security | P0 |

# 14. Booking Completion — Contract & Cancellation — `BCT` / `BCN`

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| BCT-01 | Contract stage renders | Payment method saved | — | Reach stage 2 | Contract/annex documents presented **(unverified)** | Positive | P0 |
| BCT-02 | Contract document preview | Contract stage | — | Open document | Contract renders/downloads | Positive | P1 |
| BCT-03 | Sign without reading/accepting | Contract stage | — | Attempt sign | Blocked until required acknowledgements are ticked | Validation | P0 |
| BCT-04 | Successful signature | Contract stage | — | Complete signing | Status moves to signed; My Bookings reflects it; "Ready to sign" tab clears | Positive | P0 |
| BCT-05 | Signature expiry window | Contract stage | Past `signing_expiration_date` | Attempt sign | Expiry handled with a clear message | Business-Rule | P1 |
| BCT-06 | Abandon and resume signing | Contract stage | — | Leave → return via My Bookings | Resumes at the same stage | Session | P1 |
| BCT-07 | Booking-fee project requires payment first | Project 2358 | — | Complete booking | Invoice/SADAD step appears before contract; `refund_fee_status` tracked | Business-Rule | P0 |
| BCT-08 | Unpaid invoice appears in Payments | Fee booking | — | Open Payments and transactions | Entry under Unpaid with invoice preview | Positive | P1 |
| BCN-01 | Cancel booking confirmation prompt | Active booking | — | Click Cancel booking | Confirmation dialog with clear consequences | Positive | P0 |
| BCN-02 | Dismiss the cancel prompt | Prompt shown | — | Choose No/Close | Booking remains active | Cancel-Behaviour | P0 |
| BCN-03 | Confirm cancellation | Active booking | — | Confirm | Status becomes Cancelled with a cancellation date; unit returns to inventory | Positive | P0 |
| BCN-04 | Cancellation frees the project rule | Cancelled booking | Same project | Attempt a new booking | Allowed again (one-per-project counter decremented) | Business-Rule | P0 |
| BCN-05 | Cancel a paid booking → refund path | Paid booking | — | Cancel | Refund status recorded (`refund_fee_status`/amount) | Business-Rule | P1 |
| BCN-06 | Cancel twice | Cancelled booking | — | Attempt cancel again | Action unavailable; no duplicate cancellation | Duplicate-Action | P1 |
| BCN-07 | Cancellation reason capture | Cancel flow | — | Inspect | Reason captured if required by the flow | Positive | P2 |

# 15. My Bookings — `MBK`

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| MBK-01 | Cancelled tab content | Authenticated | — | Open Cancelled | Only cancelled bookings, each with a cancellation date | Positive | P1 |
| MBK-02 | Completed tab content | Authenticated | — | Open Completed | Only completed bookings | Positive | P1 |
| MBK-03 | Unpaid tab content | Fee booking exists | — | Open Unpaid | Bookings with outstanding fees and their amounts | Business-Rule | P1 |
| MBK-04 | Ready to sign tab | Contract pending | — | Open tab | Bookings awaiting signature, with a direct action | Business-Rule | P1 |
| MBK-05 | Tab counts vs rows | Authenticated | — | Compare each tab | Row counts consistent; All = sum of states | Boundary | P2 |
| MBK-06 | Empty tab state | Tab with no data | — | Open | Explicit empty message, not a blank area | Empty-State | P1 |
| MBK-07 | Booking card fields | Authenticated | — | Inspect a card | Product type, unit type, unit code, date, fee (when applicable) all present | Positive | P1 |
| MBK-08 | Booking-fee note | Fee booking | — | Read card | "Refundable upon completion, terms apply" note shown with the amount | Business-Rule | P2 |
| MBK-09 | Select-all checkbox | Listing | — | Toggle | Selects visible rows; bulk action (if any) behaves | UI/UX | P2 |
| MBK-10 | Pagination | >20 bookings | — | Page through | Correct paging; no duplicates | Positive | P2 |
| MBK-11 | View details opens the right booking | Listing | — | Click View details on row N | Detail page matches row N's unit code | Positive | P1 |
| MBK-12 | Deep link to a booking detail | Authenticated | Own booking id | Open URL | Detail renders directly | Navigation | P2 |
| MBK-13 | Back from detail preserves the tab | Active tab selected | — | Open detail → Back | Returns to the same tab, not All | Session | P2 |
| MBK-14 | Land-product booking display | Land booking | — | Inspect | Shows "Plot code" instead of unit code | Business-Rule | P2 |
| MBK-15 | Inherited bookings section | Account with inherit data | — | Open | Inherit-bookings state handled (currently empty) | Empty-State | P3 |

# 16. Account — Dashboard, My Information, Wallet — `DSH` / `MYI` / `WAL`

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| DSH-01 | Dashboard greeting and summary | Authenticated | — | Open `/app/user-profile/dashboard/overview` | Personalised greeting and account overview render | Positive | P1 |
| DSH-02 | "Start service" CTA | Dashboard | — | Click | Routes to the service catalogue//relevant journey | Navigation | P2 |
| DSH-03 | Dashboard for a new account | Fresh account | — | Open | Onboarding/empty guidance rather than blank widgets | Empty-State | P2 |
| MYI-01 | Profile fields render | Authenticated | — | Open `/app/user-profile/my-information` | Name, ID (masked), mobile, email, DOB shown | Positive | P1 |
| MYI-02 | National ID is masked | Authenticated | — | Inspect | ID not exposed in full in the UI | Security | P0 |
| MYI-03 | Verify Email flow | Unverified email | — | Click Verify Email | Verification sent; success feedback; state updates | Positive | P1 |
| MYI-04 | Verify Email repeated quickly | Unverified email | — | Click twice | Rate-limited/no duplicate spam | Duplicate-Action | P2 |
| MYI-05 | Update contact information — valid | Authenticated | New mobile/email | Update → save | Saved; likely OTP-verified; reflected after refresh | Positive | P0 |
| MYI-06 | Update contact — invalid email | Authenticated | `abc@`, `a b@c.com` | Save | Validation error; not saved | Validation | P1 |
| MYI-07 | Update contact — invalid mobile | Authenticated | `12345`, `+1555…` | Save | Rejected; Saudi format enforced | Validation | P1 |
| MYI-08 | Update contact — empty required field | Authenticated | Clear mobile | Save | Mandatory-field error | Validation | P1 |
| MYI-09 | Update contact — OTP wrong code | OTP requested | `000000` | Submit | Rejected with retry counter | Negative | P1 |
| MYI-10 | Update contact — OTP resend/expiry | OTP requested | Wait then resend | Resend | New code issued; old code invalid | Boundary | P1 |
| MYI-11 | Cancel contact update | Edit open | — | Cancel | No change persisted | Cancel-Behaviour | P2 |
| MYI-12 | Duplicate email/mobile of another user | Authenticated | Existing value | Save | Uniqueness enforced with a clear message | Negative | P1 |
| WAL-01 | Wallet balance displays | Authenticated | SR827,670 | Open `/app/user-profile/my-wallet` | Balance rendered and formatted | Positive | P1 |
| WAL-02 | Transactions list and paging | Wallet | 5 pages | Page through | Rows render with type/date/amount; paging works | Positive | P1 |
| WAL-03 | Bank account tab | Wallet | — | Open tab | Bank details shown or an add-account prompt | Positive | P1 |
| WAL-04 | Add/edit bank account — IBAN validation | Bank tab | Invalid IBAN | Save | Rejected with a format message | Validation | P0 |
| WAL-05 | IBAN boundary length | Bank tab | 23 and 25 chars | Save | Only a valid Saudi IBAN length accepted | Boundary | P1 |
| WAL-06 | Withdraw — happy path | Positive balance, bank set | Valid amount | Withdraw → confirm | Request created; balance/transaction updated; confirmation shown | Positive | P0 |
| WAL-07 | Withdraw more than balance | Wallet | balance+1 | Submit | Rejected with an insufficient-funds message | Boundary | P0 |
| WAL-08 | Withdraw zero / negative | Wallet | 0, -100 | Submit | Rejected | Validation | P1 |
| WAL-09 | Withdraw with no bank account | No bank account | — | Withdraw | Prompted to add a bank account first | Business-Rule | P1 |
| WAL-10 | Withdraw double submit | Withdraw form | — | Submit twice | One request only | Duplicate-Action | P1 |
| WAL-11 | Empty wallet state | Zero balance/no transactions | — | Open | Empty state message | Empty-State | P2 |

# 17. Account — Financial Advisory, Payments, Favorites, Preferences — `FAD` / `PAY` / `FAV` / `PRF`

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| FAD-01 | Overview tab renders financial profile | Authenticated | — | Open `/app/user-profile/personal-financials` | Salary, obligations, bank, purchase power shown | Positive | P1 |
| FAD-02 | Financing Requests tab | Authenticated | — | Open tab | Requests listed or an empty state | Positive | P1 |
| FAD-03 | Update my financial information — valid | Authenticated | Salary 25000, obligations 0 | Update → save | Saved; purchase power recalculated | Positive | P0 |
| FAD-04 | Salary zero / negative | Update form | 0, -1 | Save | Rejected | Boundary | P1 |
| FAD-05 | Extremely large salary | Update form | 900,000,000 | Save | Accepted or capped consistently (profile already holds a huge value — confirm intent) | Boundary | P2 |
| FAD-06 | Obligations exceed income | Update form | income 5000, obligations 9000 | Save | Business rule enforced or a warning shown | Business-Rule | P1 |
| FAD-07 | Mandatory fields blank | Update form | — | Save empty | Field-level required errors | Validation | P1 |
| FAD-08 | Cancel the update | Update form | — | Cancel | No change persisted | Cancel-Behaviour | P2 |
| FAD-09 | Purchase power reflected in marketplace "For you" | Updated financials | — | Enable For you | Recommendations reflect the new purchase power | Business-Rule | P2 |
| PAY-01 | All / Unpaid / Paid / Cancelled tabs | Authenticated | — | Open each tab | Correct subsets; empty tabs show a message | Positive | P1 |
| PAY-02 | Preview invoice | Unpaid item | — | Click Preview invoice | Invoice opens with correct amount and reference | Positive | P1 |
| PAY-03 | Preview receipt | Paid item | — | Click Preview receipt | Receipt renders | Positive | P1 |
| PAY-04 | Pagination | Many transactions | — | Page through | Consistent paging; disabled First/Prev on page 1 | Boundary | P2 |
| PAY-05 | Pay an unpaid invoice | Unpaid item | — | Initiate payment | Redirect to the payment provider; on return the status updates | Positive | P0 |
| PAY-06 | Abandon payment mid-flow | Payment started | — | Cancel at the provider | Returns with the invoice still Unpaid; no double charge | Error-Handling | P0 |
| PAY-07 | Invoice expiry | Expired invoice | — | Attempt payment | Blocked with an expiry message | Business-Rule | P1 |
| FAV-01 | Favorites tabs | Authenticated | — | Open Favorites | Tabs All, Destinations, Projects, Units, Services | Positive | P1 |
| FAV-02 | Favourited project appears | Project favourited | — | Open Projects tab | Project listed | Positive | P1 |
| FAV-03 | Favourited unit appears | Unit favourited | — | Open Units tab | Unit listed | Positive | P1 |
| FAV-04 | Remove from favourites | Item favourited | — | Unfavourite | Removed immediately and after refresh | Positive | P1 |
| FAV-05 | Favourite persists across sessions | Item favourited | — | Logout/login | Still favourited | Session | P2 |
| FAV-06 | Empty favourites state | No favourites | — | Open | Empty-state message with a CTA to browse | Empty-State | P1 |
| FAV-07 | Favourite a delisted item | Favourited then removed from sale | — | Open Favorites | Item shown as unavailable, not a broken card | Edge | P2 |
| PRF-01 | Registered interests tabs | Authenticated | — | Open `/app/user-profile/preferences/registered-interests` | Tabs All, Destinations, Projects, Developers, Brokers | Positive | P1 |
| PRF-02 | Empty registered interests | None registered | — | Open | "Explore Marketplace to find what suit your need" CTA shown | Empty-State | P1 |
| PRF-03 | CTA routes to marketplace | Empty state | — | Click CTA | Marketplace opens | Navigation | P2 |
| PRF-04 | Registered interest appears after submitting | Interest submitted | — | Open Projects tab | The project is listed | Positive | P1 |
| PRF-05 | Remove a registered interest | Interest exists | — | Remove | Removed and persisted | Positive | P2 |

# 18. Activities Modules — `ACT`

Shared pattern: each module is a tabbed listing with an empty state. Repeat **ACT-G01…G05** per module.

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| ACT-G01 | Each status tab filters correctly | Authenticated | Per module | Open each tab | Rows match the tab's status only | Positive | P1 |
| ACT-G02 | Empty state per tab | No data | — | Open tab | Module-specific empty message renders | Empty-State | P1 |
| ACT-G03 | Deep link to the module URL | Authenticated | Module URL | Open directly | Loads with the default tab | Navigation | P2 |
| ACT-G04 | Refresh preserves the tab | Tab selected | — | F5 | Same tab active or a defined default | Session | P2 |
| ACT-G05 | Guest access to the module | Logged out | Module URL | Open | Redirect to login | Security | P0 |

Module-specific cases:

| ID | Module | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|---|
| AFA-01 | Financial applications | Banner "There is active cancelled applications" | Authenticated | — | Open module | Message is accurate and actionable (currently reads oddly — confirm copy) | UI/UX | P2 |
| AFA-02 | Financial applications | Application detail opens | Application exists | — | Open a row | Detail with status history | Positive | P1 |
| APD-01 | Purchased deals | Empty state + CTA | No deals | — | Open | "You don't have any Purchased deals" + "Deals Marketplace" button | Empty-State | P1 |
| APD-02 | Purchased deals | CTA routes to deals marketplace | Empty state | — | Click | Deals marketplace opens | Navigation | P2 |
| AWL-01 | Waiting list | Empty state | No subscription | — | Open | "You don't have any active waiting list subscription." | Empty-State | P1 |
| AWL-02 | Waiting list | Join a project waiting list | Project with waiting list | — | Subscribe | Subscription created and listed under Active | Positive | P1 |
| AWL-03 | Waiting list | Duplicate subscription | Already subscribed | — | Subscribe again | Blocked with a message | Duplicate-Action | P1 |
| AWL-04 | Waiting list | Cancel subscription | Active subscription | — | Cancel | Moves to Cancelled | Positive | P2 |
| AHD-01 | Housing designs (activities) | Request listed with View details | Request exists | — | Open | Detail renders | Positive | P1 |
| AHD-02 | Housing designs | Completed tab | Completed request | — | Open tab | Only completed items | Positive | P2 |
| AVT-01 | Real estate tax | Two sub-tabs render | Authenticated | — | Open | "Real estate tax incurred service" and "Inquiring about a certificate" | Positive | P1 |
| AVT-02 | Real estate tax | Certificate inquiry by number | Authenticated | Valid/invalid certificate no. | Submit each | Valid → details; invalid → clear not-found error | Negative | P1 |
| ACC-01 | Certified contractors | Empty state | No contractors | — | Open | "No Active Certified Contractors Found" | Empty-State | P1 |
| ACC-02 | Certified contractors | Request a contractor service | Eligible | — | Start request | Request created **(unverified)** | Positive | P1 |
| ACV-01 | Conveyance | Empty state | No requests | — | Open | "No conveyance requests yet" | Empty-State | P1 |
| ACV-02 | Conveyance | Create request happy path | Eligible booking | — | Click Create request → complete | Request created, appears under Under review | Positive | P0 |
| ACV-03 | Conveyance | Create request without eligibility | Ineligible | — | Click Create request | Blocked with the reason | Business-Rule | P1 |
| ACV-04 | Conveyance | Mandatory fields in the request form | Form open | — | Submit empty | Field-level errors | Validation | P1 |
| ACV-05 | Conveyance | Rejected request shows a reason | Rejected request | — | Open Rejected tab | Rejection reason visible | Positive | P2 |
| AOL-01 | Online lending | Start Online Lending | Authenticated | — | Click Start Online Lending | Lending journey starts (bank selection) | Positive | P0 |
| AOL-02 | Online lending | Cancel the request | Active request | — | Click Cancel the request | Confirmation then status → Cancelled | Positive | P1 |
| AOL-03 | Online lending | Cancel confirmation dismissal | Prompt shown | — | Dismiss | Request stays active | Cancel-Behaviour | P1 |
| AOL-04 | Online lending | Duplicate active request | Active request | — | Start another | Blocked or the existing one is resumed | Duplicate-Action | P1 |
| AAU-01 | My auctions | Auction listing tabs | Authenticated | — | Open All/Active/Closed | Correct subsets | Positive | P1 |
| AAU-02 | My auctions | View auction | Auction exists | — | Click View auction | Auction detail opens with bid history | Positive | P1 |
| AAU-03 | My auctions | Bid below the minimum increment | Active auction | Low bid | Submit | Rejected with the minimum stated | Boundary | P1 |
| AAU-04 | My auctions | Bid after the auction closes | Closed auction | — | Attempt bid | Blocked | Business-Rule | P1 |
| AFZ-01 | Farz certificate | Empty state | No requests | — | Open | "No farz certificate requests yet" | Empty-State | P1 |
| AFZ-02 | Farz certificate | Request a certificate | Eligible unit | — | Submit request | Request created under Pending | Positive | P1 |
| AFZ-03 | Farz certificate | Expired tab | Expired request | — | Open tab | Expired items listed with dates | Positive | P2 |
| AUD-01 | Units delivery | Empty state | No requests | — | Open | "You don't have any unit delivery requests yet" | Empty-State | P1 |
| AUD-02 | Units delivery | Accept a delivery | Pending delivery | — | Accept | Status → Accepted; developer notified | Positive | P0 |
| AUD-03 | Units delivery | Reject a delivery with a reason | Pending delivery | Reason text | Reject | Status → Rejected with the reason stored | Positive | P1 |
| AUD-04 | Units delivery | Reject without a reason | Pending delivery | — | Submit blank | Mandatory reason enforced | Validation | P1 |
| ARR-01 | Rental requests | Empty state | No requests | — | Open | "No Rental Requests Found" | Empty-State | P1 |
| ARR-02 | Rental requests | Incomplete request resume | Incomplete request | — | Open | Journey resumes from the saved step | Session | P1 |
| ARR-03 | Rental requests | Approved/Rejected states | Such requests | — | Open tabs | Correct statuses with reasons | Positive | P2 |
| ARS-01 | Resale requests | Sell / Buy toggle | Authenticated | — | Toggle | Sub-tab sets differ appropriately | Positive | P1 |
| ARS-02 | Resale requests | All 10 status tabs filter | Authenticated | — | Open each | Correct subsets for Pending Developer Approval, Returned Back, Under Study, Waiting for Buyer Info, Waiting for Contract Upload, Waiting for Contract Signature, Completed, Rejected, Cancelled | Positive | P1 |
| ARS-03 | Resale requests | Create a resell request | Eligible unit | — | Start from `/services/resell-units` | Request created under Pending Developer Approval | Positive | P0 |
| ARS-04 | Resale requests | Resell an ineligible unit | Ineligible unit | — | Attempt | Blocked with the business reason | Business-Rule | P1 |
| ARS-05 | Resale requests | Upload contract — invalid file type | Waiting for Contract Upload | `.exe` | Upload | Rejected with allowed formats stated | Validation | P1 |
| ARS-06 | Resale requests | Upload contract — oversize file | Waiting for Contract Upload | >max MB | Upload | Rejected with the size limit stated | Boundary | P1 |
| ARS-07 | Resale requests | Buyer info validation | Waiting for Buyer Info | Invalid ID | Submit | Validation errors | Validation | P1 |

# 19. Register Interest — `RGI`

Form fields observed: **Name**, **ID Number**, **Mobile Number** (`+966 5########`), **Email**, plus a
Preferred Destinations block (City / Destinations / Projects). Submit is disabled until valid.

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| RGI-01 | Form opens pre-scoped to the project | Project page | project_id 2896 | Click Register Interest | Form opens with the project pre-selected under Preferred Destinations | Positive | P1 |
| RGI-02 | Submit disabled when empty | Form open | — | Inspect | "Register Your Interest" disabled | Validation | P0 |
| RGI-03 | Happy path submit | Form open | Name `أحمد التجريبي`, ID `1000011485`, mobile `512345678`, email `test.user@example.com` | Fill all → submit | Success confirmation; lead recorded; appears under Registered interests | Positive | P0 |
| RGI-04 | Name missing | Form open | Blank name | Submit | Mandatory error; submit stays disabled | Validation | P1 |
| RGI-05 | Name with digits/symbols | Form open | `1234`, `@@@` | Enter | Rejected or sanitised per rule | Validation | P2 |
| RGI-06 | Name max length | Form open | 300 chars | Enter | Capped or validation error | Boundary | P2 |
| RGI-07 | ID Number invalid length | Form open | `12345` | Submit | Validation error | Validation | P1 |
| RGI-08 | ID Number non-numeric | Form open | `abcdefghij` | Enter | Rejected | Validation | P1 |
| RGI-09 | Mobile wrong prefix | Form open | `412345678` | Submit | Saudi mobile format enforced (must start 5) | Validation | P1 |
| RGI-10 | Mobile too short / too long | Form open | `51234`, `5123456789012` | Submit | Boundary validation | Boundary | P1 |
| RGI-11 | Email invalid formats | Form open | `abc`, `a@`, `a@b`, `a b@c.com` | Submit | Validation error each time | Validation | P1 |
| RGI-12 | Email optional | Form open | Leave blank | Submit | Accepted if email is optional (confirm rule) | Validation | P2 |
| RGI-13 | City selection required | Form open | No city | Submit | Blocked if city is mandatory | Validation | P1 |
| RGI-14 | Multiple destinations/projects | Form open | 2+ projects | Select several | All captured in the payload | Positive | P2 |
| RGI-15 | Back button discards | Form filled | — | Click Back | Returns to the project; data not submitted | Cancel-Behaviour | P2 |
| RGI-16 | Duplicate interest for the same project | Interest already registered | Same data | Submit again | Duplicate prevented or de-duplicated | Duplicate-Action | P1 |
| RGI-17 | Captcha challenge on submit | Untrusted IP | — | Submit | Turnstile/reCAPTCHA appears; on solving, submission completes | Error-Handling | P1 |
| RGI-18 | Captcha failure | Forced failure | — | Submit | Server rejects with `invalid_recaptcha`; user-facing error shown, not a silent failure | Error-Handling | P1 |
| RGI-19 | Guest submission | Logged out | Valid data | Submit | Allowed without login | Positive | P1 |
| RGI-20 | Prefill for an authenticated user | Authenticated | — | Open form | Name/ID/mobile pre-filled from the profile | Positive | P2 |
| RGI-21 | Double submit | Form valid | — | Click submit twice | Single lead created | Duplicate-Action | P1 |
| RGI-22 | Invalid project_id in URL | — | `project_id=99999999` | Open | Graceful error, not a broken form | Error-Handling | P2 |
| RGI-23 | Missing project_id | — | `/app/register-interest` | Open | Form still usable with manual project selection, or a clear prompt | Edge | P2 |

# 20. Eligibility Check Wizard — `ELG`

4 steps observed: **1 Terms and Conditions → 2 Acknowledgement → 3 Verify Information → 4 Financial Advisory**.

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| ELG-01 | Wizard opens from the service page | Service page | — | Click Get started | `/app/eligibility/check` opens at step 1 with a 4-step indicator | Navigation | P1 |
| ELG-02 | Continue disabled until terms accepted | Step 1 | — | Inspect | "Agree on the terms and conditions" disabled | Validation | P0 |
| ELG-03 | Accepting terms enables Continue | Step 1 | — | Tick `#agreeTermsConditions` | Button enables | Positive | P0 |
| ELG-04 | Unticking disables again | Step 1 | — | Tick then untick | Button disables | Validation | P1 |
| ELG-05 | Step 2 Acknowledgement | Step 1 done | — | Continue | Acknowledgement content with its own confirmation | Positive | P1 |
| ELG-06 | Step 3 Verify Information | Step 2 done | — | Continue | Profile data presented for verification; editable where allowed | Positive | P0 |
| ELG-07 | Verify Information with missing data | Incomplete profile | — | Reach step 3 | Prompts to complete the missing fields | Validation | P1 |
| ELG-08 | Step 4 Financial Advisory | Step 3 done | Salary/obligations | Complete | Financial data captured and the check submitted | Positive | P0 |
| ELG-09 | Final eligibility result | Wizard completed | — | Submit | Result shown (eligible/ineligible) with reasons; profile `eligible_status` updates | Business-Rule | P0 |
| ELG-10 | Ineligible outcome messaging | Test identity (`INELIGIBLE`) | — | Complete | Clear reasons and next steps; appeal path if any | Business-Rule | P0 |
| ELG-11 | Back navigation between steps | Any step >1 | — | Click Back | Returns a step with data retained | Navigation | P1 |
| ELG-12 | Abandon and resume | Mid-wizard | — | Leave → return | Resumes at the same step or restarts cleanly (define) | Session | P1 |
| ELG-13 | Refresh mid-wizard | Mid-wizard | — | F5 | State preserved or a safe restart; never a broken step | Session | P1 |
| ELG-14 | Deep link to a later step | Authenticated | Step-3 URL | Open directly | Redirected to the first incomplete step | Security | P1 |
| ELG-15 | Re-run the check when already assessed | Assessed account | — | Start again | Allowed with a re-assessment, or blocked with the current status | Business-Rule | P1 |
| ELG-16 | Guest access | Logged out | — | Open the wizard | Redirect to login | Security | P0 |
| ELG-17 | Open appeal blocks a re-check | `has_open_appeal: true` | — | Start | Blocked with the appeal status | Business-Rule | P1 |

# 21. Mortgage Calculator — `MTG`

Fields: **Property Price\*** (SR), **Monthly Income\*** (SR), **Monthly Liabilities** (SR, optional),
**Financing Term\*** (Years), **Annual Interest Rate\*** (%), **Down Payment Percentage\*** (%),
**Is this your first home?\*** (Yes/No), **Are you a beneficiary?\*** (Yes/No). Actions: **Calculate
Your Mortgage**, **Clear**.

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| MTG-01 | Happy path calculation | Calculator open | 800000 / 25000 / 2000 / 20y / 4% / 10% / first=Yes / bene=No | Fill → Calculate | Monthly instalment, total cost and affordability displayed | Positive | P0 |
| MTG-02 | Calculate with all fields empty | Calculator open | — | Click Calculate | Required-field errors on every mandatory field; no result | Validation | P0 |
| MTG-03 | Each mandatory field individually blank | Calculator open | Omit one at a time | Calculate | Specific error for the omitted field | Validation | P1 |
| MTG-04 | Monthly Liabilities optional | Calculator open | Leave blank, rest valid | Calculate | Calculation succeeds | Validation | P1 |
| MTG-05 | Property price = 0 | Calculator open | 0 | Calculate | Rejected or a clearly defined zero-case result | Boundary | P1 |
| MTG-06 | Negative values | Calculator open | -100000 | Enter | Rejected by the input | Validation | P1 |
| MTG-07 | Non-numeric input | Calculator open | `abc`, `1e5` | Enter | Stripped/rejected | Validation | P1 |
| MTG-08 | Very large property price | Calculator open | 999,999,999 | Calculate | No overflow; sensible or capped result | Boundary | P2 |
| MTG-09 | Financing term = 1 year (min) | Calculator open | 1 | Calculate | Valid result | Boundary | P1 |
| MTG-10 | Financing term above the max | Calculator open | 50, 100 | Calculate | Capped or rejected with the allowed range | Boundary | P1 |
| MTG-11 | Financing term = 0 | Calculator open | 0 | Calculate | Rejected (no division by zero) | Boundary | P0 |
| MTG-12 | Interest rate = 0% | Calculator open | 0 | Calculate | Valid interest-free calculation | Boundary | P1 |
| MTG-13 | Interest rate = 100% / >100% | Calculator open | 100, 150 | Calculate | Capped or rejected | Boundary | P1 |
| MTG-14 | Interest rate decimals | Calculator open | 3.75 | Calculate | Decimals accepted and used | Boundary | P2 |
| MTG-15 | Down payment 0% | Calculator open | 0 | Calculate | Valid or a stated minimum enforced | Boundary | P1 |
| MTG-16 | Down payment 100% | Calculator open | 100 | Calculate | Zero financing case handled without error | Boundary | P1 |
| MTG-17 | Down payment >100% | Calculator open | 150 | Calculate | Rejected | Validation | P1 |
| MTG-18 | Liabilities exceed income | Calculator open | income 5000, liabilities 9000 | Calculate | Affordability warning / non-qualifying result, not a crash | Business-Rule | P1 |
| MTG-19 | Beneficiary = Yes changes the result | Calculator open | Same inputs, toggle beneficiary | Calculate twice | Subsidy applied when Yes; results differ meaningfully | Business-Rule | P0 |
| MTG-20 | First home = No changes the result | Calculator open | Toggle first home | Calculate twice | Result reflects the rule | Business-Rule | P1 |
| MTG-21 | Radio groups are mandatory | Calculator open | Leave both unset | Calculate | Required errors on both groups | Validation | P1 |
| MTG-22 | Clear resets everything | Filled form | — | Click Clear | All inputs, radios and the result reset | Positive | P1 |
| MTG-23 | Clear then Calculate | Cleared form | — | Calculate | Required-field errors again | Validation | P2 |
| MTG-24 | Recalculate with changed inputs | Result shown | Change price | Calculate | Result updates, not appended | Positive | P1 |
| MTG-25 | Thousand separators / formatting | Calculator open | 1000000 | Enter | Formatted as SR 1,000,000 and parsed correctly | UI/UX | P2 |
| MTG-26 | Result persists on refresh | Result shown | — | F5 | Defined behaviour (reset is acceptable); no error | Session | P3 |
| MTG-27 | Calculator as a guest | Logged out | Valid data | Calculate | Works without login (confirm) | Positive | P2 |
| MTG-28 | Entry from a unit page pre-fills price | Unit page | — | Click Mortgage Calculator | Property price pre-filled with the unit price | Positive | P1 |

# 22. Housing Designs Catalogue — `HDS`

Filters observed: rooms (2/3/4/5+), bathrooms (1/3+), price Min/Max, `landWidth`, `landLength`,
`frontStreetWidth`, plus a checkbox.

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| HDS-01 | Catalogue loads with designs | — | — | Open `/app/housing-designs` | "Available designs" grid renders | Positive | P1 |
| HDS-02 | Filter by rooms | Catalogue | 3 | Select | Only 3-room designs | Positive | P1 |
| HDS-03 | Rooms upper bound | Catalogue | 5+ | Select | Designs with 5 or more rooms | Boundary | P1 |
| HDS-04 | Filter by bathrooms | Catalogue | 1, 3+ | Select each | Correct subsets | Boundary | P2 |
| HDS-05 | Price min/max | Catalogue | Min 10000 Max 50000 | Apply | Designs within range | Boundary | P1 |
| HDS-06 | Price min > max | Catalogue | 50000 / 10000 | Apply | Validation or swap | Validation | P1 |
| HDS-07 | Land width valid | Catalogue | 20 | Enter | Filter applies | Positive | P1 |
| HDS-08 | Land width zero / negative | Catalogue | 0, -5 | Enter | Rejected | Boundary | P1 |
| HDS-09 | Land width non-numeric | Catalogue | `abc` | Enter | Rejected | Validation | P1 |
| HDS-10 | Land length bounds | Catalogue | 1 and 9999 | Apply | Handled without error | Boundary | P2 |
| HDS-11 | Front street width | Catalogue | 15 | Apply | Filter applies | Positive | P2 |
| HDS-12 | Dimension combination with no matches | Catalogue | 1×1 land | Apply | Empty state with a clear message | Empty-State | P1 |
| HDS-13 | Checkbox filter behaviour | Catalogue | — | Toggle | Result set changes and the label matches the effect | Positive | P2 |
| HDS-14 | Clear/reset filters | Filters applied | — | Reset | Full catalogue restored | Positive | P1 |
| HDS-15 | Open a design detail | Catalogue | — | Click a design | Detail with plans, area, rooms, price | Positive | P1 |
| HDS-16 | Request/purchase a design | Design detail | — | Start request | Request created and listed under Activities → Housing designs | Positive | P0 |
| HDS-17 | Request a design as a guest | Logged out | — | Attempt | Redirect to login | Security | P1 |
| HDS-18 | Filters persist on Back from a detail | Filters applied | — | Open detail → Back | Filters retained | Session | P2 |

# 23. Developers Directory — `DEV`

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| DEV-01 | Directory loads with developer cards | — | — | Open `/app/developers` | Cards with name, service type and location | Positive | P1 |
| DEV-02 | Search by developer name | Directory | `أجزالا` | Type in "Search name/location" | Matching developers returned | Positive | P1 |
| DEV-03 | Search by location | Directory | `المجمعة` | Type | Location matches returned | Positive | P1 |
| DEV-04 | Search no match | Directory | `zzzzzz` | Type | Empty state message | Empty-State | P1 |
| DEV-05 | Search special characters | Directory | `<>%$` | Type | Handled safely | Security | P2 |
| DEV-06 | Sort by | Directory | — | Change sort | Ordering changes accordingly | Positive | P2 |
| DEV-07 | Open a developer profile | Directory | — | Click a card | `/app/developers/<cr>` with projects, licence and contact | Positive | P1 |
| DEV-08 | Developer with no projects | Such a developer | — | Open profile | Empty state, not a broken section | Empty-State | P2 |
| DEV-09 | Licence badge accuracy | Developer profile | — | Inspect | "Licensed" badge matches the developer record | Business-Rule | P2 |
| DEV-10 | Invalid CR number in URL | — | `/app/developers/000` | Open | Not-found state | Error-Handling | P2 |
| DEV-11 | Clear the search | Search applied | — | Clear input | Full directory restored | Positive | P2 |
| DEV-12 | Pagination / lazy loading | Many developers | — | Scroll/page | More load without duplicates | Positive | P2 |

# 24. Sakani Offers / Vouchers — `VCH`

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| VCH-01 | Offers page loads | — | — | Open `/app/promotion-vouchers` | Offer cards with discount percentages | Positive | P1 |
| VCH-02 | Open an offer detail | Offers page | 35% off | Click an offer | Terms, validity and vendor shown | Positive | P1 |
| VCH-03 | Redeem a voucher | Authenticated, eligible | — | Redeem | Voucher code issued; marked used | Positive | P0 |
| VCH-04 | Redeem as a guest | Logged out | — | Redeem | Redirect to login | Security | P1 |
| VCH-05 | Redeem twice | Redeemed voucher | — | Redeem again | Blocked with "already redeemed" | Duplicate-Action | P1 |
| VCH-06 | Expired voucher | Expired offer | — | Attempt redeem | Blocked with an expiry message | Business-Rule | P1 |
| VCH-07 | Ineligible user redeem | Ineligible account | — | Attempt | Blocked with the eligibility reason | Business-Rule | P1 |
| VCH-08 | "Join as a Vendor" CTA | Offers page | — | Click Join us | Vendor onboarding opens | Navigation | P2 |
| VCH-09 | No offers available | Empty catalogue | — | Open | Empty state | Empty-State | P2 |

# 25. Service Landing Pages, FAQs & Contact — `SVC` / `FAQ` / `CNT`

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| SVC-01 | Each landing page renders its tabs | — | 12 services | Open each | Registration/Service Steps, Features and Conditions/Terms tabs render | Positive | P2 |
| SVC-02 | Tab switching keeps content in sync | Service page | — | Switch tabs | Correct panel per tab | UI/UX | P2 |
| SVC-03 | "Get started" routes correctly | Service page | Each service | Click | Correct app journey opens (verified for mortgage → `/app/mortgage-page`, eligibility → `/app/eligibility/check`) | Navigation | P1 |
| SVC-04 | Get started as a guest | Logged out | Authenticated service | Click | Redirect to login and return afterwards | Security | P1 |
| SVC-05 | FAQ accordion on the service page | Service page | — | Expand items | Answers expand/collapse | UI/UX | P3 |
| SVC-06 | "Was this helpful?" Yes/No | Service page | — | Click Yes then No | Feedback recorded once; UI acknowledges | UI/UX | P3 |
| SVC-07 | Related services links | Service page | — | Click each | Correct service pages open | Navigation | P3 |
| SVC-08 | Breadcrumb navigation | Service page | — | Click Home / Services | Correct destinations | Navigation | P3 |
| FAQ-01 | FAQ list and pagination | — | 11 pages | Open `/support-and-help/faqs`, page through | Questions render; paging works; no duplicates | Positive | P2 |
| FAQ-02 | Search button disabled when empty | FAQ page | — | Inspect | Search disabled until text is entered | Validation | P2 |
| FAQ-03 | FAQ keyword search | FAQ page | `support` | Search | Relevant questions returned | Positive | P1 |
| FAQ-04 | FAQ search no match | FAQ page | `zzzzzz` | Search | Empty state | Empty-State | P1 |
| FAQ-05 | Category filter | FAQ page | Any category | Select | Only that category's questions | Positive | P2 |
| FAQ-06 | Expand/collapse an answer | FAQ page | — | Click a question | Answer toggles | UI/UX | P3 |
| FAQ-07 | Search + category combined | FAQ page | Both | Apply | Both constraints honoured | Positive | P2 |
| CNT-01 | Send disabled until valid | Contact page | — | Inspect | "Send" disabled | Validation | P1 |
| CNT-02 | Happy path submission | Contact page | Type, national ID, name, subject, message | Fill → Send | Success confirmation with a ticket reference | Positive | P0 |
| CNT-03 | Missing mandatory fields | Contact page | Omit each in turn | Send | Field-level errors | Validation | P1 |
| CNT-04 | Invalid national ID | Contact page | `123` | Send | Validation error | Validation | P1 |
| CNT-05 | Message max length | Contact page | 5000+ chars | Enter | Capped with a counter or a clear error | Boundary | P2 |
| CNT-06 | Message with HTML/script | Contact page | `<script>alert(1)</script>` | Send | Escaped safely | Security | P1 |
| CNT-07 | Request-type dropdown drives sub-fields | Contact page | Different types | Change type | Dependent fields update | Positive | P1 |
| CNT-08 | Double submit | Valid form | — | Send twice | One ticket only | Duplicate-Action | P1 |
| CNT-09 | Prefill for an authenticated user | Authenticated | — | Open | Name/national ID pre-filled | Positive | P2 |
| CNT-10 | Attachment upload (if offered) | Contact page | Invalid type / oversize | Upload | Rejected with limits stated | Validation | P2 |

# 26. Localization, RTL/LTR & Accessibility — `I18N` / `A11Y`

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| I18N-01 | Header language toggle | Any page | — | Click English / عربي | **Defect:** locale does not switch. Expected: language changes and persists | Localization | P1 |
| I18N-02 | `?lang=ar` renders RTL | — | `?lang=ar` | Load | `dir=rtl` layout; text right-aligned; controls mirrored | Localization | P1 |
| I18N-03 | `?lang=en` renders LTR | — | `?lang=en` | Load | LTR layout | Localization | P1 |
| I18N-04 | Page title localisation | — | `?lang=en` | Inspect `<title>` | **Defect:** title stays `سكني` on several pages in English | Localization | P2 |
| I18N-05 | Language persists across navigation | `lang=en` | — | Navigate several pages | Language retained without re-adding the parameter | Localization | P1 |
| I18N-06 | Language persists after login | `lang=en` | — | Log in | Post-login pages stay English | Localization | P1 |
| I18N-07 | Arabic numerals and currency | `lang=ar` | Prices | Inspect | Consistent numeral system and SAR formatting | Localization | P2 |
| I18N-08 | Dates localised | `lang=ar` | Booking dates | Inspect | Correct locale/calendar formatting | Localization | P2 |
| I18N-09 | Mixed-direction content | `lang=ar` | English project names | Inspect | Latin names render correctly inside RTL without breaking layout | Localization | P2 |
| I18N-10 | Untranslated strings | `lang=ar` | All modules | Sweep | No English leakage in Arabic UI (and vice-versa) | Localization | P2 |
| I18N-11 | RTL mirroring of controls | `lang=ar` | Carousels, steppers, pagination | Inspect | Next/Prev and step order mirrored correctly | Localization | P1 |
| I18N-12 | Form validation messages localised | `lang=ar` | Invalid input | Submit | Arabic error messages | Localization | P1 |
| A11Y-01 | Keyboard-only booking journey | Authenticated | — | Tab through unit → Book | All controls reachable; focus visible | Accessibility | P1 |
| A11Y-02 | Role-less clickable cards | Marketplace | — | Tab to a project card | **Defect risk:** cards are `div`s with no role/name — not keyboard operable | Accessibility | P1 |
| A11Y-03 | Filter chips keyboard access | Marketplace | — | Tab to chips | Operable via keyboard | Accessibility | P1 |
| A11Y-04 | Modal focus trap | Any modal | — | Open modal, Tab | Focus stays inside; Esc closes; focus returns to the trigger | Accessibility | P1 |
| A11Y-05 | Form labels and errors announced | Any form | Screen reader | Submit invalid | Labels and errors are programmatically associated | Accessibility | P1 |
| A11Y-06 | Colour contrast | All pages | — | Audit | Meets WCAG AA | Accessibility | P2 |
| A11Y-07 | Images have alt text | Project/unit media | — | Audit | Meaningful alternatives | Accessibility | P2 |
| A11Y-08 | Zoom to 200% | Any page | — | Zoom | No content loss or overlap | Accessibility | P2 |

# 27. Cross-Cutting Behaviour — `XCT`

| ID | Scenario | Preconditions | Test Data | Steps | Expected Result | Type | Pri |
|---|---|---|---|---|---|---|---|
| XCT-01 | Browser Back through a multi-step booking | Booking in progress | — | Back repeatedly | Each step degrades safely; no orphaned reservation or duplicate booking | Navigation | P0 |
| XCT-02 | Browser Forward after Back | After Back | — | Forward | Returns without resubmitting anything | Navigation | P1 |
| XCT-03 | Refresh on every major page | All modules | — | F5 on each | No blank shells; state restored or a safe redirect | Session | P1 |
| XCT-04 | Deep link every module URL | Authenticated | All discovered URLs | Open each directly | Correct page loads with its default state | Navigation | P1 |
| XCT-05 | Duplicate tabs with conflicting actions | Authenticated | Two tabs | Book in tab 1, then act in tab 2 | Tab 2 reflects the new state or fails safely | Edge | P1 |
| XCT-06 | Responsive breakpoint 1280px | — | 1280×720 | Load marketplace | Toolbar collapses to icons; all functions still reachable | UI/UX | P1 |
| XCT-07 | Mobile viewport | — | 390×844 | Sweep key journeys | Mobile layout usable; hamburger nav works | UI/UX | P1 |
| XCT-08 | Tablet viewport | — | 768×1024 | Sweep | Layout intact | UI/UX | P2 |
| XCT-09 | Slow 3G behaviour | Throttled | — | Load and act | Skeletons and disabled controls; no double submissions | Loading | P1 |
| XCT-10 | API 500 on a listing | Forced error | — | Load marketplace | Error state with retry | Error-Handling | P1 |
| XCT-11 | API 401 mid-session | Forced | — | Any action | Redirect to login with a message | Session | P0 |
| XCT-12 | Browser back to a cached authenticated page after logout | Logged out | — | Back | No sensitive data served from cache | Security | P0 |
| XCT-13 | Copy/paste a filtered URL to another browser | Filters applied | — | Open in a clean browser | Public parts reproduce; authenticated parts require login | Navigation | P2 |
| XCT-14 | Long session idle then act | Idle 30+ min | — | Perform an action | Either still valid or a clean re-auth prompt | Session | P1 |
| XCT-15 | Concurrent same-account sessions | Two browsers | — | Act in both | State stays consistent; no corruption | Edge | P2 |

---

# 28. Second Review — Coverage Gap Analysis

A re-sweep of the application against **both** the 39 automated cases and the new design above.

## 28.1 Modules with no automated coverage at all

| Module | Automated | New design | Gap status |
|---|---|---|---|
| Eligibility Check wizard | 0 | ELG-01…17 | **Was a total blind spot** — a P0 journey with zero coverage before this pass |
| Mortgage Calculator | 0 | MTG-01…28 | **Total blind spot** — richest validation/boundary surface in the app |
| Register Interest | 0 | RGI-01…23 | Total blind spot; also the second captcha-protected flow |
| Wallet (balance, bank, withdraw) | 0 | WAL-01…11 | Total blind spot; involves money movement |
| Payments & transactions | 0 | PAY-01…07 | Total blind spot; invoice/refund logic |
| Financial Advisory | 0 | FAD-01…09 | Total blind spot; drives purchase power |
| My Information / contact update | 0 | MYI-01…12 | Total blind spot; OTP-dependent |
| Favorites | 0 | FAV-01…07 | Total blind spot |
| Preferences / Registered interests | 0 | PRF-01…05 | Total blind spot |
| 13 Activities modules | 0 | ACT-G01…G05 + AFA…ARS | Total blind spot |
| Housing Designs catalogue | 0 | HDS-01…18 | Total blind spot |
| Developers directory | 0 | DEV-01…12 | Total blind spot |
| Vouchers / Offers | 0 | VCH-01…09 | Total blind spot |
| FAQs / Contact Us | 0 | FAQ + CNT | Total blind spot |
| Auctions | 0 | AAU-01…04, NVX-08 | Entry point never resolved — **still unverified** |
| Booking completion (payment + contract) | 1 partial (BOOK-12) | BPM + BCT | Contract stage never reached |
| Booking cancellation | 0 | BCN-01…07 | Deliberately untested (destructive) |

## 28.2 Coverage types missing from the automated set

| Dimension | Automated | New design |
|---|---|---|
| Boundary values | none | 40+ cases (price, area, rooms, term, rate, down payment, IBAN, land dimensions, message length) |
| Mandatory-field validation | 2 (login only) | 30+ across every form |
| Invalid input / injection | 0 | SRCH-12, CNT-06, DEV-05, MTG-07, RGI-05…11 |
| Empty states | 0 | 20+ (each Activities tab, favorites, search, filters, wallet, vouchers) |
| Duplicate actions / double submit | 0 | 12 cases (BST-02, BSM-07, BPM-15, RGI-21, CNT-08, WAL-10, MYI-04, AWL-03, BCN-06, SEC-15, SEC-28, VCH-05) |
| Cancel / close / dismiss | 0 | 10 cases |
| Back / Forward / refresh | 0 | XCT-01…03, FLT-28/29, BSM-05, ELG-11…13, MBK-13 |
| Session & authorization | 0 | SEC-16…23, XCT-11/12, BSC-12, BPM-18 |
| Error handling / service failure | 0 | SHL-13/14, BST-11/12, BSM-12, PAY-06, XCT-10 |
| Loading states | 0 | SHL-15, BST-01, BSM-08, XCT-09 |
| Localization & RTL | 0 | I18N-01…12 |
| Accessibility | 0 | A11Y-01…08 |
| Responsive breakpoints | implicit only | XCT-06…08 |
| Concurrency | 0 | BST-06, BSM-10, XCT-05, XCT-15 |

## 28.3 Functionality discovered but still unexercised

These were seen in the UI and are covered by design above, but their behaviour was **never observed**
— the expected results are specifications to confirm, not verified facts:

1. **Auctions** — the nav item resolves to no href; the module's entry point is unknown.
2. **Contract-signing stage** (booking step 2 of 2) — never reached.
3. **AI search** on the home hero — never submitted.
4. **Compare units** — control seen on unit pages; comparison view never opened.
5. **Waiting-list subscription** — no project exposing the join CTA was found.
6. **Withdraw** from the wallet — balance SR 827,670 is available but no withdrawal attempted.
7. **Payment of a booking fee** — project 2358 carries an unpaid SAR 8,855 fee; the payment
   provider hand-off was never followed.
8. **OTP flows** for contact-detail updates.
9. **Deferred-subsidy project journey** — the home iframe was seen but not entered.
10. **Metaverse / AMFM / News / Rental indicators** — link targets only.

## 28.4 Defects and copy issues found during this exploration pass

| # | Finding | Where | Severity |
|---|---|---|---|
| D6 | Success copy reads "please complete **you** booking details" | Booking success page | Low (copy) |
| D7 | Financial applications banner reads "There is active cancelled applications." | Activities → Financial applications | Low (copy/grammar) |
| D8 | Marketplace coach-mark tooltip overlays the quick-filter chips and does not auto-close | Marketplace | Medium (UX) |
| D9 | Result cards and filter chips are role-less `div`s with no accessible name | Marketplace, unit lists | Medium (a11y) |
| D10 | `<title>` remains `سكني` on English service pages | `/en/services/*` | Low |

Carried forward from the first pass: **D1** (silent 403 on closed-project booking — highest
severity), **D2** (language toggle inert), **D3** (View units CTA outside the viewport), **D4**
(Enter does not apply marketplace search), **D5** (role-less clickable cards).

## 28.5 Totals

Counted from the tables above, by prefix.

| Group | Prefixes | New cases |
|---|---|---|
| Authentication, session & authorization | `SEC` | 28 |
| Global shell & cookies | `SHL` | 15 |
| Navigation & mega-menus | `NVX` | 14 |
| Home page & hero search | `HOM` | 17 |
| Marketplace — search | `SRCH` | 16 |
| Marketplace — filters | `FLT` | 37 |
| Marketplace — sorting, listing & map | `LST` | 26 |
| Project detail | `PDP` | 24 |
| Unit model & unit detail | `UMD` 7 + `UDP` 12 | 19 |
| Booking — start & preconditions | `BST` | 12 |
| Booking — summary & confirmation | `BSM` | 12 |
| Booking — success & post-state | `BSC` | 13 |
| Booking completion — payment method | `BPM` | 18 |
| Booking — contract & cancellation | `BCT` 8 + `BCN` 7 | 15 |
| My bookings | `MBK` | 15 |
| Dashboard / My information / Wallet | `DSH` 3 + `MYI` 12 + `WAL` 11 | 26 |
| Advisory / Payments / Favorites / Preferences | `FAD` 9 + `PAY` 7 + `FAV` 7 + `PRF` 5 | 28 |
| Activities — generic pattern | `ACT-G01…G05` | 5 |
| Activities — module-specific | `AFA` `APD` `AWL` `AHD` `AVT` `ACC` `ACV` `AOL` `AAU` `AFZ` `AUD` `ARR` `ARS` | 44 |
| Register Interest | `RGI` | 23 |
| Eligibility wizard | `ELG` | 17 |
| Mortgage calculator | `MTG` | 28 |
| Housing designs | `HDS` | 18 |
| Developers directory | `DEV` | 12 |
| Vouchers / Offers | `VCH` | 9 |
| Service pages / FAQ / Contact | `SVC` 8 + `FAQ` 7 + `CNT` 10 | 25 |
| Localization & accessibility | `I18N` 12 + `A11Y` 8 | 20 |
| Cross-cutting behaviour | `XCT` | 15 |
| **New cases written** | | **551** |

**Effective execution count.** `ACT-G01…G05` are a generic pattern to be instantiated against each
of the 13 Activities modules. Counting those instantiations instead of the 5 templates:

| | Count |
|---|---|
| New cases written | 551 |
| Generic pattern expanded (5 templates → 5 × 13 modules) | +60 |
| **New cases when executed** | **611** |
| Previously automated | 39 |
| **Combined coverage** | **650** |

## 28.6 Recommended automation order for the next phase

1. **P0 business rules and money paths** — BPM, BCT, BCN, WAL-06/07, PAY-05/06, ELG-09/10.
2. **P0 security/session** — SEC-16/17/21/22, BSC-12, BPM-18, XCT-11/12.
3. **High-yield validation suites** — MTG (pure client-side, fast, no state change), RGI, CNT.
4. **Empty states and Activities tabs** — cheap, stable, high count.
5. **Filters and boundaries** — FLT, LST, SRCH.
6. **Localization and accessibility** — I18N, A11Y (needs an axe-style tooling decision first).

Deliberately **last**: destructive flows (BCN cancellation, withdrawals, real payments) — these need
a disposable account and a reset strategy before they can run repeatedly.
