import { test, expect } from '@fixtures/pages.fixture';
import { logStep } from '@helpers/LogSteps';

test.describe('Navigation & site structure', () => {
  test('TC-01 home page loads with the primary navigation', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ homePage }) => {
    await logStep('Step 01: Open the marketing homepage');
    await homePage.open();
    await homePage.expectLoaded();

    await logStep('Step 02: Confirm the primary navigation is visible');
    await expect(homePage.header.propertiesForSale.first()).toBeVisible();
    await expect(homePage.header.propertiesForRent.first()).toBeVisible();
    await expect(homePage.header.auctions.first()).toBeVisible();
    await expect(homePage.header.services.first()).toBeVisible();
    await expect(homePage.header.help.first()).toBeVisible();
    await expect(homePage.header.loginButton.first()).toBeVisible();
  });

  test('TC-02 Properties for Sale menu links to the buy journeys', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ homePage }) => {
    await logStep('Step 01: Open the homepage and inspect the buy menu');
    await homePage.open();
    const links = await homePage.header.megaMenuLinks(homePage.header.propertiesForSale.first());
    const joined = links.join(' | ');
    expect(joined).toMatch(/Offplan|البيع على الخارطة/i);
    expect(joined).toMatch(/Ready units|وحدات جاهزة/i);
    expect(joined).toMatch(/Lands|أراضي/i);
  });

  test('TC-03 Services menu exposes the service catalogue', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ homePage }) => {
    await logStep('Step 01: Open the homepage and inspect the services menu');
    await homePage.open();
    const links = await homePage.header.megaMenuLinks(homePage.header.services.first());
    const joined = links.join(' | ');
    expect(joined).toMatch(/Eligibility Checker|أهليتك/i);
    expect(joined).toMatch(/Mortgage Calculator|حاسبة/i);
  });

  test('TC-04 Footer exposes the site map', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ homePage, page }) => {
    await logStep('Step 01: Open the homepage and inspect the footer links');
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
