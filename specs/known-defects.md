# Known application defects

Every defect referenced by a `Dnn` marker anywhere in the suite, in one place.

The suite encodes defects in two different ways, and the distinction matters when
you read a run:

- **Held failing** — the test asserts the *correct* behaviour and carries
  `test.fail()`. Playwright runs it, confirms it still fails, and reports it as
  **expected**. A green run is the correct outcome. If Playwright reports an
  *unexpected pass*, the application has been fixed and the marker should be
  removed.
- **Failing** — the test asserts the correct behaviour and is **not** marked, so
  the defect shows up red on every run. Used where the intended behaviour has not
  been confirmed with the product team yet, or where the finding is new.

> Marking a defect `test.fail()` is a product decision, not an automation one. Do
> not add the marker to silence a red test — a red @P0 is the signal that
> something unresolved is outstanding.

---

## Held failing (`test.fail()`)

| Ref | Defect | Test | Location |
|---|---|---|---|
| D2 | The header language toggle does not change the rendered locale. Language must be pinned via `?lang=`. | `I18N-01` | `tests/navigation/localization-a11y.spec.ts` |
| D10 | `<title>` stays Arabic (`سكني`) on English marketing pages. | `I18N-04` | `tests/navigation/localization-a11y.spec.ts` |
| D11 | "Monthly Liabilities" is presented as optional, but leaving it blank silently blocks the calculation — no result and no validation message. | `MTG-04`, `MTG-04b` | `tests/services/mortgage-calculator.spec.ts` |
| D14 | The project-page **Register Interest** CTA is inert (`href="#"`, no navigation). | `PDP-17` | `tests/project/project-detail.spec.ts` |
| D15 | The unit-page **Mortgage Calculator** CTA is inert — no navigation, no new tab. The calculator itself works via its own route. | `UDP-06` | `tests/project/unit-model-and-detail.spec.ts` |
| D16 | The guest **Book a unit** CTA does not route to login; the URL stays on the unit page. The same control works when authenticated. | `UDP-11` | `tests/project/unit-model-and-detail.spec.ts` |
| D17 | Visible home-page images carry neither `alt` nor `aria-hidden`. | `A11Y-07` | `tests/navigation/localization-a11y.spec.ts` |
| D18 | The marketplace filter modal ignores Escape — a `role="dialog"` with a static backdrop, so keyboard users cannot dismiss it. | `A11Y-04` | `tests/navigation/localization-a11y.spec.ts` |

### Marker drift to watch

`A11Y-07`'s marker text says "21 visible images"; the run on 20 Aug 2026 measured
**14**. The application has partly improved. The assertion is still `toBe(0)`, so
the test remains correct — only the count in the marker message is stale.

---

## Failing (asserted, not marked)

Originally the findings from the 20 Aug 2026 full run. They are **not** marked, so
they fail on every run until the application changes or the product team confirms
the behaviour is intended.

Two of the four were re-executed on 23 Aug and both are now resolved. **D20 and
D21 were not re-run** — `BPM-18` lives in the booking-completion journeys, which
create real pre-production data, and `HDS-08`/`HDS-09` are in
`services/catalogues.spec.ts`, which nothing in the 20 Aug repair pass touched.
Their status below is still the 20 Aug result and should be re-confirmed before
being reported onward.

| Ref | Defect | Test | Priority |
|---|---|---|---|
| ~~D19~~ | *My information* renders the beneficiary's national ID in full (`1000011485`) under a "National ID" label, with no masking. **Resolved** — see below. | `MYI-02` | @P0 |
| D20 | A logged-out deep link to `…/view-booking/<id>/complete-booking` is not redirected to login — the URL persists and the public shell renders in place. No booking data is exposed. `SEC-16` confirms the same guard *does* redirect `/user-profile/my-wallet`, so the behaviour is inconsistent between routes. | `BPM-18` | @P0 |
| D21 | The housing-designs **land width** field performs no input validation: `-5` and `abc` are both accepted verbatim and survive in the field's value. | `HDS-08`, `HDS-09` | @P1 |
| ~~D22~~ | The home page overflows horizontally at 200% zoom (720×450 effective viewport), against WCAG 1.4.10 *Reflow*. **Resolved** — see below. | `A11Y-08` | @P2 |

### D22 is resolved (23 Aug 2026)

`A11Y-08` **passed** in the 23 Aug navigation run. Because the test was last
touched on 20 Aug — when the raw `scrollWidth > clientWidth` comparison gained a
32px tolerance for the scrollbar gutter — a pass alone could not distinguish
"the page reflows now" from "it still overflows, by less than the tolerance".

Measured directly at 720×450 to settle it:

```
scrollWidth : 720
clientWidth : 720
overflow    : 0px   (tolerance is 32px)
```

There is no overflow at all, so the tolerance is not what makes the test pass and
the page genuinely reflows. A scan for elements extending past the viewport
returns only `swiper-slide` carousel children, which their container clips with
`overflow: hidden` and which therefore never widen the document.

D22 can be closed. Keep `A11Y-08` — it is the regression guard.

### D19 is resolved (23 Aug 2026)

`MYI-02 @P0` **passed** on 23 Aug. The pass is not an artefact of the page
failing to render: `MYI-01` passed in the same run, and the *My information*
DOM still carries the `National ID / Iqama number` label — it simply no longer
carries the number.

The trace was checked for the weaker explanation, that the value moved into an
`<input value="…">` where `innerText` cannot see it. It did not: the string
`1000011485` appears nowhere in the profile page's DOM, in text or in any
attribute. Its only occurrences in the whole trace are the login step typing it
into `#username`.

D19 can be closed. Keep `MYI-02` — it is the regression guard.

### D16 is asserted twice

`AUTH-11 @P0` asserts the same guest-booking behaviour as `UDP-11`, but is **not**
marked, so D16 currently shows up as both "expected" (UDP-11) and "failed"
(AUTH-11) in the same run. `AUTH-11` additionally asserts that the return URL is
preserved, which `UDP-11` does not — so it is not a pure duplicate.

This is left as-is deliberately, pending the same product decision D16 is waiting
on. Once the intended guest behaviour is confirmed, either:

- mark `AUTH-11` against D16 and keep its return-URL assertion, **or**
- drop `AUTH-11` and fold the return-URL assertion into `UDP-11`.

---

## Related: environment behaviour, not defects

Recorded here so they are not re-filed as application bugs. See the
"Environment behaviours this suite is built around" table in the README.

| Behaviour | Effect on a run |
|---|---|
| `/app/authentication/login` intermittently serves the public marketing shell instead of the login form — `#username` never enters the DOM. | Any test using the `authenticatedPage` fixture fails after ~5 minutes (150s, one reload, 150s). Eight tests hit this in the 20 Aug run, clustering in its back half, which points at pre-production degrading under a long sequence of logins rather than at a bug in the page objects. **Did not reproduce on 23 Aug**: every `authenticatedPage` login in that run's 48 navigation tests completed, most in 30-60s. The 20 Aug cluster is therefore transient environment degradation, not a standing blocker. |
| **`pre-sakani-partners.housingapps.sa` does not exist in DNS.** | **Blocks every logout journey.** Confirmed 23 Aug: the host returns NXDOMAIN from both `8.8.8.8` and `1.1.1.1`, while its sibling `pre-sakani-nhc.housingapps.sa` resolves normally. See below. |
| The Angular bundle can outlive a 90s navigation budget. | `goto` must use `waitUntil: 'commit'`; `domcontentloaded` and `load` both time out. |
| A project page can render its shell — hero, Favorite/Share — while its content sections never arrive. | Produces a *content* assertion failure rather than a readiness failure, so it does not look like a load problem. `PDP-20` failed this way on 23 Aug after `open()` had already spent its reload budget (7.5 min for the test); the same test passed in 1.3 min on an immediate targeted re-run, and the badge it asserts was confirmed present in the page for a guest session. Re-run once before treating a lone content-assertion failure on a project page as a finding. |

### The single-logout host is unpublished — logout journeys cannot pass

`Header.logout()` confirms the "are you sure" modal, at which point the app
navigates `/app/auth/logout?returnUrl=…` → `https://pre-sakani-partners.housingapps.sa/authentication/slo`
→ back to `returnUrl`. That middle hop cannot be reached: the hostname has no DNS
record at all, so Chromium lands on a `chrome-error://` page and the session is
never torn down.

`Header.logout()`'s poll already classifies this precisely — it reports
`navigation-failed` rather than a generic timeout, which is what identified the
cause. The failing URL is visible in the trace's network log for any affected
test.

**Nothing in the suite can fix this**, and it should not be worked around by
clearing cookies instead: these tests exist to assert that the real
single-logout round trip ends the session. Two tests are blocked while the host
stays unpublished:

| Test | Priority | Spec |
|---|---|---|
| `XCT-12` a protected page is not served from cache after logout | @P0 | `tests/navigation/cross-cutting.spec.ts` |
| the logout journey in `tests/auth/login.spec.ts` | — | `tests/auth/login.spec.ts` |

Raise it with whoever owns the pre-production DNS zone; re-run both tests once
the host resolves.
