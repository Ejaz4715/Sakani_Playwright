# Sakani Playwright Test Workspace

Presentation notes based on the current workspace configuration and Playwright
test discovery.

## 1. Suite and test-case count

| Measure | Count |
|---|---:|
| Spec files under `tests/` | 47 |
| Spec files currently containing Playwright-discovered tests | 42 |
| Playwright-discovered test cases | **343** |
| End-to-end journey spec files in `tests/test-suits-e2e/` | 7 |
| Cases in those end-to-end journey specs | **39** |

The other 304 discovered cases are in feature-focused spec files. Five files
present in the workspace do not contribute tests to the current discovery
listing. Counts can change as tests are added, removed, or enabled.

Discovered test cases by folder:

| Test area | Cases |
|---|---:|
| Services | 70 |
| Account | 63 |
| Payment systems | 46 |
| Navigation | 41 |
| Partners | 30 |
| Project | 30 |
| Authentication | 15 |
| Payment (additional booking flow) | 6 |
| Booking | 3 |
| End-to-end journeys | 39 |
| **Total** | **343** |

> **Counting note:** “Suite” can refer to a spec file or a Playwright
> `test.describe` group. This workspace has 47 spec files under `tests/`, but
> Playwright’s `--list` currently reports 343 cases across 42 files with
> discovered tests. The seven files in `test-suits-e2e` are the dedicated
> end-to-end journey files.

## 2. Test-case approach

- The suite uses Playwright with TypeScript for browser-based end-to-end and
  feature testing.
- Tests are organized by product area and workflow, including authentication,
  projects, bookings, payments, account features, navigation, and services.
- `test.describe` groups related scenarios; test titles commonly include a
  `TC-##` identifier to make cases recognizable in console and report output.
- Journey specs cover connected user flows, such as auction booking and payment
  tracking, while feature specs focus on individual behaviors and rules.
- Reusable fixtures, page objects, helpers, browser interactions, and
  Playwright assertions are used across the tests.
- If a scenario depends on data or UI that is not present in the environment,
  some cases use a reasoned skip rather than reporting that condition as a
  product failure.
- The configured browser project is Chromium. Tests run serially with one
  worker; the configuration captures traces, screenshots, and video.

## 3. How reporting works

The runner configuration in [`playwright.config.ts`](./playwright.config.ts)
produces multiple forms of output for a test run:

1. **HTML report** — Playwright’s interactive report; `npm run report` opens it.
2. **Console list** — immediate run progress and results.
3. **JSON results** — current results at `test-results/results.json`.
4. **Timestamped JSON history** — each run is saved under
   `report-dashboard/test-reports-history/`.
5. **Execution artifacts** — trace, screenshot, and video capture are enabled
   in the Playwright configuration.

The custom dashboard pipeline is available as `npm run post-test`:

1. [`merge-results.js`](./report-dashboard/merge-results.js) reads the
   timestamped history files, sorts them by run start time, and merges cases
   using a test ID (or file-and-title key) so later results update earlier
   entries.
2. It writes the merged dataset to `test-results/results.json`.
3. [`generate-dashboard.js`](./report-dashboard/generate-dashboard.js) reads
   that JSON and generates `report-dashboard/dashboard.html`.
4. The pipeline opens the dashboard.

The dashboard summarizes pass, fail, and skipped cases; duration; product,
environment, and suite scope; and case-level results. Its **Health Check** view
uses the full set of cases, while **Readiness** filters to cases identified as
critical by their annotations.

## 4. How test data is handled

- Shared data such as test-user configuration, project IDs, language, search
  terms, and filter choices is centralized in
  [`src/data/testData.ts`](./src/data/testData.ts).
- Environment-specific values can be supplied through environment variables;
  `.env` values are loaded by the Playwright configuration. Credentials and
  identifiers should be managed through environment configuration rather than
  copied into presentation materials.
- Marketplace inventory can change between runs. The helpers in
  [`src/helpers/marketplaceApi.ts`](./src/helpers/marketplaceApi.ts) query the
  application API in the browser session and locate currently available units
  that meet the account’s eligibility requirements.
- Some payment-tracking journeys read and update
  `src/data/test-data.json`, for example to retain generated project details
  for later steps. [`DataHelper`](./src/helpers/DataHelper.ts) provides
  JSON-backed read and update helpers.
- The single-worker configuration means these tests execute sequentially,
  which is relevant when cases share or update test data.

## 5. How cases are categorized with annotations

Cases are grouped and labeled at several levels:

- **Folder/spec file:** the main feature area or end-to-end journey.
- **`test.describe` title:** the named group of related cases.
- **Test title:** often includes a `TC-##` identifier and a short scenario
  description.
- **Playwright annotations:** the end-to-end journey cases carry product
  metadata (currently `Marketplace` or `Gov Support`) and a `critical` type.
  The dashboard uses product metadata for grouping and the critical marker for
  its Readiness view.

Formal product/critical annotations are concentrated in the seven
end-to-end journey spec files; most feature-focused cases are categorized by
their folder and describe title instead. The dashboard also contains handling
for environment metadata and priority-style tags, but those are not applied
consistently across all specs.

## Reproduce the case count

From the repository root, run:

```powershell
.\node_modules\.bin\playwright.cmd test --list
```

The final line reports the discovered case and file totals. The current
workspace discovery result is **343 tests in 42 files**.
