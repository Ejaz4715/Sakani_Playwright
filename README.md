# Sakani E2E — Playwright + TypeScript (POM)

End-to-end suite for the **Sakani customer portal**, pre-production:
`https://pre-sakani.housingapps.sa`

Built from a live exploration of the application. Every selector, business rule and API
assertion in this repo was verified against the running system — see
[`specs/exploration-report.md`](specs/exploration-report.md).

---

## Quick start

```bash
npm install
npx playwright install chromium
cp .env.example .env      # then edit if needed

npm test                  # everything, chromium
npm run test:smoke        # @smoke only
npm run test:critical     # @P0 only
npm run test:headed       # watch it run
npm run report            # open the HTML report
```

## Layout

```
.
├── playwright.config.ts        # timeouts tuned for a heavy government Angular SPA
├── .mcp.json                   # Playwright MCP servers
├── .claude/agents/             # planner / generator / healer subagents
├── src/
│   ├── data/testData.ts        # users, project ids, filter taxonomy, API paths
│   ├── fixtures/               # page-object fixtures + authenticatedPage
│   ├── helpers/                # live-inventory + beneficiary API helpers
│   └── pages/                  # Page Object Model
│       └── components/         # CookieConsent, Header
├── tests/
│   ├── auth/                   # login, Nafath, validation
│   ├── marketplace/            # browse, search, sort, filters, developers
│   ├── project/                # project → unit model → unit
│   ├── booking/                # booking E2E + business rules
│   ├── account/                # my bookings, profile pages, activities modules
│   ├── services/               # mortgage calculator, eligibility wizard
│   └── navigation/             # public shell, mega-menus, footer
└── specs/                      # test plans, exploration report, test design
```

## Conventions

- **Page Object Model.** Selectors live in `src/pages`, never in a spec.
- Specs import the fixture, not Playwright directly:
  ```ts
  import { test, expect } from '@fixtures/pages.fixture';
  ```
- Anything behind login uses the `authenticatedPage` fixture.
- Test titles are `<ID> @<priority> <description>` so `--grep` selection works.
- Path aliases: `@pages/*`, `@components/*`, `@fixtures/*`, `@helpers/*`, `@data/*`.
- **Never hard-code a unit id.** Pre-production inventory changes; resolve it live via
  `@helpers/marketplaceApi`.

## Environment behaviours this suite is built around

| Behaviour | Why it matters |
|---|---|
| Angular bundle is multi-megabyte | `/app/*` views need 10-16s; `APP_READY_TIMEOUT` is 150s and `goto` uses `commit` |
| Shell sometimes renders without its feature bundle | `gotoUntilReady` reloads once |
| Cookie modal intercepts all clicks | Auto-dismissed by a locator handler in the fixture |
| Header `English` toggle does not switch locale | Language is always pinned via `?lang=` |
| Login is Nafath-based | **Auto-approves in pre-production (~10-15s)** — no phone needed |
| Invisible reCAPTCHA on login | Passes in a real browser; can challenge from untrusted IPs |
| Booking is asynchronous (CQRS) | `start_booking` returns 202; wait for navigation or modal, not the POST |
| Fixed CTAs can render outside the viewport | `Book a unit` / `View units` are activated with the keyboard |

## Business rules encoded in the suite

1. **One active booking per project.** A second attempt is blocked with
   *"Sorry, you will not be able to book more than one unit in this project."*
2. **Segment gating.** Units carry `target_segments`; the fixture account is a
   **non-beneficiary** and may only book `non_bene` inventory. Listings are scoped with
   `filter[user_type]=non_beneficiary`.
3. **Project-level gate.** `bookable: false` ⇒ `start_booking` returns **403** even though
   units are listed and the CTA is enabled.
4. **Booking fee.** `has_booking_fee` decides whether a payment step exists.
5. **Completion is a separate journey.** A booking is created in `price_quotation` state and
   must then be completed: payment method → sign contract.

## Test data

`src/data/testData.ts`. The fixture account (`1000011485`) is a non-beneficiary with
`eligible_status: not_eligible` and pre-existing bookings, which is exactly what makes the
negative rules testable.

Project roles:

| Constant | Id | Role |
|---|---|---|
| `PROJECTS.bookable` | 2896 | bookable, large non-beneficiary inventory |
| `PROJECTS.alreadyBooked` | 1441 | exercises the one-booking-per-project block |
| `PROJECTS.bookingsClosed` | 1187 | exercises the 403 project gate |

> Booking specs **create real pre-production data**. They guard themselves with
> `test.skip` when a precondition no longer holds, but they are not idempotent — cancel
> bookings between full runs, or repoint `BOOKING_PROJECT_ID`.

## Known application defects encoded in the suite

**The full register is [`specs/known-defects.md`](specs/known-defects.md)** — every `Dnn` marker
referenced anywhere in the suite, in one place.

Defects are encoded two ways:

- **Held failing** (`test.fail()`) — the test asserts the *correct* behaviour and Playwright
  confirms it still fails, reporting it as **expected**. An unexpected *pass* is the signal the
  app was fixed and the marker should be removed.
- **Failing** (unmarked) — asserted and red on every run, used where the intended behaviour is
  not yet confirmed with the product team.

> Adding `test.fail()` is a product decision, not an automation one. Never add it to silence a
> red test.

| Ref | Defect | Where | Status |
|---|---|---|---|
| D2 | Header language toggle does not change the rendered locale | `I18N-01` | held failing |
| D10 | `<title>` stays Arabic (`سكني`) on English pages | `I18N-04` | held failing |
| D11 | "Monthly Liabilities" is presented as optional but leaving it blank silently blocks the calculation — no result and no validation message | `MTG-04`, `MTG-04b` | held failing |
| D14 | Project-page Register Interest CTA is inert | `PDP-17` | held failing |
| D15 | Unit-page Mortgage Calculator CTA is inert | `UDP-06` | held failing |
| D16 | Guest booking CTA does not route to login | `UDP-11`, `AUTH-11` | held failing / **also asserted unmarked** |
| D17 | Visible images carry neither `alt` nor `aria-hidden` | `A11Y-07` | held failing |
| D18 | Filter modal ignores Escape (static backdrop) | `A11Y-04` | held failing |
| D19 | National ID rendered in full on *My information* | `MYI-02` | **resolved** 23 Aug — `MYI-02` passes |
| D20 | Logged-out deep link to the booking-completion wizard is not redirected | `BPM-18` | **failing** @P0 |
| D21 | Housing-designs land-width field accepts `-5` and `abc` | `HDS-08`, `HDS-09` | **failing** @P1 |
| D22 | Home page overflows horizontally at 200% zoom (WCAG 1.4.10) | `A11Y-08` | **resolved** 23 Aug — measured 0px overflow |

> D20 and D21 were last executed on 20 Aug and have **not** been re-run since;
> their status above is that run's. D19 and D22 were re-executed on 23 Aug.

Other defects found during exploration are documented in
[specs/functional-test-design.md § 28.4](specs/functional-test-design.md) and are not yet asserted.

## Claude Code integration

`.mcp.json` registers the Playwright MCP servers, and `.claude/agents/` provides three
subagents:

| Agent | Use it to |
|---|---|
| `playwright-test-planner` | Explore a module in a browser and write `specs/<area>-test-plan.md` |
| `playwright-test-generator` | Turn a plan item into a POM-compliant spec |
| `playwright-test-healer` | Diagnose and repair a failing spec at the right layer |
