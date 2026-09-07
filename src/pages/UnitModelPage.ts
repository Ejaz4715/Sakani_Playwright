import { Page, Locator, expect } from '@playwright/test';
import { BasePage, APP_READY_TIMEOUT } from './BasePage';

/**
 * Unit-model listing — `/app/unit-models/<id>`
 *
 * Shows every unit belonging to one model, with size-band filter chips
 * ("All 69", "Small 383", "Average 9", "Big 2"), Sort by, Filter and
 * pagination. The chips are clickable containers without a semantic role, so
 * they are addressed with a component-scoped class selector.
 */
export class UnitModelPage extends BasePage {
  protected readonly path: string;
  readonly modelId: string;

  readonly heading: Locator;
  readonly priceRange: Locator;
  readonly filterChips: Locator;
  readonly allUnitsChip: Locator;
  readonly sortByButton: Locator;
  readonly filterButton: Locator;
  readonly unitCards: Locator;
  readonly pagination: Locator;

  constructor(page: Page, modelId: string) {
    super(page);
    this.modelId = modelId;
    this.path = `/app/unit-models/${modelId}`;

    this.heading = page.getByRole('heading', { name: /for sale in|معروضة للبيع/i });
    this.priceRange = page.getByRole('heading', { name: /SAR/ });
    this.filterChips = page.locator('.unit-chip');
    this.allUnitsChip = this.filterChips.filter({ hasText: /^\s*(All|الكل)\s*\d*\s*$/ }).first();
    this.sortByButton = page
      .getByText('Sort by', { exact: true })
      .or(page.getByText('ترتيب حسب', { exact: true }))
      .first();
    this.filterButton = page
      .getByText('Filter', { exact: true })
      .or(page.getByText('تصفية', { exact: true }))
      .last();
    this.unitCards = page.locator('app-marketplace-unit-card');
    this.pagination = page.getByRole('link', { name: /^(First|Last|\d+)$/ });
  }

  async open(): Promise<void> {
    await this.gotoUntilReady(this.unitCards.first());
  }

  async expectLoaded(): Promise<void> {
    await expect(this.unitCards.first()).toBeVisible({ timeout: APP_READY_TIMEOUT });
    await expect(this.allUnitsChip).toBeVisible({ timeout: 30_000 });
  }

  async chipLabels(): Promise<string[]> {
    return this.filterChips.evaluateAll((els) =>
      els.map((e) => (e.textContent ?? '').replace(/\s+/g, ' ').trim()).filter(Boolean),
    );
  }

  /** Select the "All" size band and wait for the chip to become the active one. */
  async selectAllUnits(): Promise<void> {
    await this.allUnitsChip.click({ force: true });
    await expect(this.allUnitsChip).toHaveClass(/selected|active/, { timeout: 30_000 });
  }

  /** Select a size band by its label prefix, e.g. "Small". */
  async selectChip(label: string): Promise<void> {
    const chip = this.filterChips.filter({ hasText: new RegExp(`^\\s*${label}`, 'i') }).first();
    await chip.click({ force: true });
    await expect(chip).toHaveClass(/selected|active/, { timeout: 30_000 });
  }

  /** The count rendered inside a chip label, e.g. "All 69" -> 69. */
  async chipCount(label: string): Promise<number> {
    const chip = this.filterChips.filter({ hasText: new RegExp(`^\\s*${label}`, 'i') }).first();
    const text = (await chip.innerText()).replace(/\s+/g, ' ');
    return Number((text.match(/\d+/) ?? ['0'])[0]);
  }

  async unitCount(): Promise<number> {
    return this.unitCards.count();
  }

  /**
   * Open a unit by its name. Unit cards lack a link role; the `.unit-details`
   * panel inside the card is the interactive surface the app actually uses,
   * and it opens the unit in a new tab.
   */
  async openUnitByName(unitName: string): Promise<Page> {
    const card = this.unitCards.filter({ hasText: unitName }).first();
    await expect(card, `Expected a unit card for "${unitName}"`).toBeVisible({ timeout: 60_000 });
    await card.scrollIntoViewIfNeeded();

    const popup = this.page.context().waitForEvent('page', { timeout: 60_000 });
    await card.locator('.unit-details').first().click({ force: true });
    return popup;
  }
}
