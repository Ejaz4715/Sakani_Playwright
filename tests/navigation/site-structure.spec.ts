import { test, expect } from '@fixtures/pages.fixture';

/**
 * NAV — public shell: home page, mega-menu navigation and the footer sitemap.
 * spec: specs/exploration-report.md  (TC-NAV)
 */
test.describe('Navigation & site structure', () => {
  test('TC-01 home page loads with the primary navigation', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ homePage }) => {
    await homePage.open();
    await homePage.expectLoaded();
    await expect(homePage.header.propertiesForSale.first()).toBeVisible();
    await expect(homePage.header.propertiesForRent.first()).toBeVisible();
    await expect(homePage.header.auctions.first()).toBeVisible();
    await expect(homePage.header.services.first()).toBeVisible();
    await expect(homePage.header.help.first()).toBeVisible();
    await expect(homePage.header.loginButton.first()).toBeVisible();
  });

  test('TC-02 Properties for Sale menu links to the buy journeys', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ homePage }) => {
    await homePage.open();
    const links = await homePage.header.megaMenuLinks(homePage.header.propertiesForSale.first());
    const joined = links.join(' | ');
    expect(joined).toMatch(/Offplan|البيع على الخارطة/i);
    expect(joined).toMatch(/Ready units|وحدات جاهزة/i);
    expect(joined).toMatch(/Lands|أراضي/i);
  });

  test('TC-03 Services menu exposes the service catalogue', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ homePage }) => {
    await homePage.open();
    const links = await homePage.header.megaMenuLinks(homePage.header.services.first());
    const joined = links.join(' | ');
    expect(joined).toMatch(/Eligibility Checker|أهليتك/i);
    expect(joined).toMatch(/Mortgage Calculator|حاسبة/i);
  });

  test('TC-04 Footer exposes the site map', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ homePage, page }) => {
    await homePage.open();
    for (const [label, href] of [
      ['Marketplace', '/app/marketplace'],
      ['Housing Designs', '/app/housing-designs'],
      ['Sakani Offers', '/app/promotion-vouchers'],
      ['Contact Us', '/support-and-help/contact-us'],
    ] as const) {
      await expect(page.locator(`footer a[href="${href}"]`), `Footer link ${label}`).toHaveCount(1);
    }
  });
});
