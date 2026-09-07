import { Page, Locator, expect } from '@playwright/test';
import { BasePage, APP_READY_TIMEOUT } from './BasePage';

/**
 * Off-plan project detail — `/app/offplan-projects/<id>`
 *
 * Rendered inside the developer-experience (DWE) shell, so the header differs
 * from the main app: it carries "Back to Sakani" instead of the global nav.
 *
 * Long single-column page whose sections were verified live: hero + price,
 * About, Developer, Payment methods, Brochure, Units in project, Facilities,
 * Location map, Insights & trends (transactions), Demographics, Housing
 * assistance packages, Payment schedule, Participating banks, Owners
 * Association, Contact, and the Project Unit Models grid.
 */
export class ProjectPage extends BasePage {
  protected readonly path: string;
  readonly projectId: number;

  readonly title: Locator;
  readonly priceStartingFrom: Locator;
  readonly favoriteButton: Locator;
  readonly shareButton: Locator;
  readonly mediaButton: Locator;
  readonly view360Button: Locator;
  readonly registerInterestLink: Locator;
  readonly viewUnitsButton: Locator;
  readonly developerLink: Locator;
  readonly ownersAssociationLink: Locator;

  readonly aboutSection: Locator;
  readonly facilitiesSection: Locator;
  readonly locationSection: Locator;
  readonly transactionsSection: Locator;
  readonly participatingBanksSection: Locator;
  readonly unitModelsSection: Locator;
  readonly unitModelCards: Locator;

  constructor(page: Page, projectId: number) {
    super(page);
    this.projectId = projectId;
    this.path = `/app/offplan-projects/${projectId}`;

    this.title = page.getByRole('heading').first();
    this.priceStartingFrom = page.getByRole('heading', { name: /Prices start from|تبدأ الأسعار من/i });
    this.favoriteButton = page.getByRole('button', { name: /Favorite|المفضلة/i });
    this.shareButton = page.getByRole('button', { name: /Share|مشاركة/i });
    // Label varies by project and pluralises with the count:
    // "19 Media", "11 Photos", "1 Photo".
    this.mediaButton = page.getByRole('button', { name: /\d+\s*(Media|Photos?)|وسائط|صور/i });
    this.view360Button = page.getByRole('button', { name: /360 view/i });
    // Rendered as a link on some projects and a button on others.
    this.registerInterestLink = page
      .getByRole('link', { name: /Register Interest|سجل اهتمامك/i })
      .or(page.getByRole('button', { name: /Register Interest|سجل اهتمامك/i }));
    this.viewUnitsButton = page.getByRole('button', { name: /View units|عرض الوحدات/i });
    this.developerLink = page.locator('a[href*="/app/developers/"]').first();
    this.ownersAssociationLink = page.locator('a[href*="mullak.housing.gov.sa"]');

    this.aboutSection = page.getByRole('heading', { name: /About this project|عن المشروع/i });
    this.facilitiesSection = page.getByRole('heading', { name: /^Facilities$|المرافق/i });
    this.locationSection = page.getByRole('heading', { name: /^Location$|الموقع/i });
    this.transactionsSection = page.getByRole('heading', { name: /Transactions|الصفقات/i });
    this.participatingBanksSection = page.getByRole('heading', { name: /Participating banks/i });
    this.unitModelsSection = page.getByRole('heading', { name: /Project Unit Models|نماذج وحدات/i });
    // `app-marketplace-card` is the *marketplace listing* card and never renders
    // on a project page, so it matched nothing here. The project page's unit
    // models are `app-marketplace-unit-model-card` — a third member of the same
    // family, alongside the unit-model page's `app-marketplace-unit-card`.
    this.unitModelCards = page.locator('app-marketplace-unit-model-card');
  }

  /**
   * Readiness anchor for the project page.
   *
   * Deliberately **not** the "Prices start from" heading: that block is absent
   * on projects that hide their pricing, which made `open()` burn its full
   * retry budget (150s + reload + 150s) before failing. The hero action row
   * (Favorite / Share) renders on every project, so it is the dependable
   * signal, with the price heading accepted as an alternative.
   */
  private get readyAnchor(): Locator {
    // `.first()` must be applied **after** `.or()`: `a.first().or(b.first())`
    // unions the two sets and still resolves to two elements, which trips
    // Playwright's strict mode on any assertion.
    return this.favoriteButton.or(this.priceStartingFrom).first();
  }

  async open(): Promise<void> {
    await this.gotoUntilReady(this.readyAnchor);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/Sakani|سكني/, { timeout: APP_READY_TIMEOUT });
    await expect(this.readyAnchor).toBeVisible({ timeout: APP_READY_TIMEOUT });
  }

  /** Every section heading rendered on the page — used to assert completeness. */
  async sectionHeadings(): Promise<string[]> {
    return this.page.evaluate(() =>
      [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        })
        .map((e) => (e.textContent ?? '').replace(/\s+/g, ' ').trim())
        .filter(Boolean),
    );
  }

  /**
   * "This project is not taking bookings yet!" — the project-level gate.
   * Corresponds to `bookable: false` on `/mainIntermediaryApi/v4/projects/<id>`.
   */
  async isBookingsClosed(): Promise<boolean> {
    return this.page
      .getByText(/not taking bookings yet|Bookings closed/i)
      .first()
      .isVisible()
      .catch(() => false);
  }

  /**
   * Scroll the unit-models grid into view.
   *
   * The "View units" CTA is a fixed-position element that Chromium can paint
   * outside the coordinate viewport on this layout, so clicking it throws
   * "Element is outside of the viewport". Scrolling to the section directly is
   * the reliable equivalent.
   */
  async scrollToUnitModels(): Promise<void> {
    await this.unitModelsSection.scrollIntoViewIfNeeded();
    await expect(this.unitModelCards.first()).toBeVisible({ timeout: 60_000 });
  }

  async openUnitModel(index = 0): Promise<Page> {
    await this.scrollToUnitModels();
    const popup = this.page.context().waitForEvent('page', { timeout: 60_000 });
    await this.unitModelCards.nth(index).click({ force: true });
    return popup;
  }
}
