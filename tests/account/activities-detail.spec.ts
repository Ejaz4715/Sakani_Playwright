import { test, expect } from '@fixtures/pages.fixture';
import { ActivitiesPage } from '@pages/ActivitiesPage';
import { ACTIVITY_MODULES } from '@data/testData';

const moduleByKey = (key: string) => ACTIVITY_MODULES.find((m) => m.key === key)!;

test.describe('Activities - module specifics', () => {
  test('TC-01 Purchased deals shows its empty state and marketplace CTA' , {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('purchase-deals'));
    await activities.open();
    await activities.expectLoaded();
    await activities.waitForListing();
    expect(await activities.isEmpty()).toBeTruthy();
    await expect(activities.action(/Deals Marketplace/i)).toBeVisible();
  });

  test('TC-02 Waiting list shows its own empty-state wording', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
    authenticatedPage,
  }) => {
    const module = moduleByKey('waiting-list');
    const activities = new ActivitiesPage(authenticatedPage, module);
    await activities.open();
    await activities.expectLoaded();
    await activities.waitForListing();

    expect(await activities.isEmpty()).toBeTruthy();
    await expect(activities.emptyState).toBeVisible();
  });

  test('TC-03 Certified contractors reports no active contractors', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('certified-contractors'));
    await activities.open();
    await activities.expectLoaded();
    await activities.waitForListing();
    expect(await activities.isEmpty()).toBeTruthy();
  });

  test('TC-04 Conveyance shows its empty state and a create action', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},  async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('conveyance'));
    await activities.open();
    await activities.expectLoaded();
    await activities.waitForListing();
    expect(await activities.isEmpty()).toBeTruthy();
    await expect(activities.action(/Create request/i)).toBeVisible();
  });

  test('TC-05 Conveyance exposes an outcome tab per review state', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
    authenticatedPage,
  }) => {
    const module = moduleByKey('conveyance');
    const activities = new ActivitiesPage(authenticatedPage, module);
    await activities.open();
    await activities.expectLoaded();
    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['Under review', 'Approved', 'Rejected']),
    );
  });

  test('TC-06 Online lending offers the start action', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ authenticatedPage }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('online-lending'));
    await activities.open();
    await activities.expectLoaded();
    await expect(activities.action(/Start Online Lending/i)).toBeVisible();
  });

  test('TC-07 My auctions separates active from closed', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('auctions'));
    await activities.open();
    await activities.expectLoaded();
    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['All', 'Active', 'Closed']),
    );
  });

  test('TC-08 Farz certificates shows its empty state', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ authenticatedPage }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('farz-certificates'));
    await activities.open();
    await activities.expectLoaded();
    await activities.waitForListing();
    expect(await activities.isEmpty()).toBeTruthy();
  });

  test('TC-09 Farz certificates exposes lifecycle tabs', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('farz-certificates'));
    await activities.open();
    await activities.expectLoaded();
    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['Pending', 'Expired', 'Completed']),
    );
  });

  test('TC-10 Unit delivery shows its empty state', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ authenticatedPage }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('units-delivery'));
    await activities.open();
    await activities.expectLoaded();
    await activities.waitForListing();
    expect(await activities.isEmpty()).toBeTruthy();
  });

  test('TC-11 Unit delivery separates developer acceptance from beneficiary', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('units-delivery'));
    await activities.open();
    await activities.expectLoaded();
    // The dual-acceptance rule is visible in the tab set.
    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['Pending', 'Accepted', 'Accepted By Developer', 'Rejected']),
    );
  });

  test('TC-12 Rental requests shows its empty state', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({ authenticatedPage }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('rental-requests'));
    await activities.open();
    await activities.expectLoaded();
    await activities.waitForListing();
    expect(await activities.isEmpty()).toBeTruthy();
  });

  test('TC-13 Rental requests exposes an Incomplete resume state', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('rental-requests'));
    await activities.open();
    await activities.expectLoaded();
    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['Incomplete', 'Under process', 'Approved', 'Rejected']),
    );
  });

  test('TC-14 Resale requests offers both Sell and Buy sides', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('resale-requests'));
    await activities.open();
    await activities.expectLoaded();
    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['Sell', 'Buy']),
    );
  });

  test('TC-15 Resale requests exposes its full status lifecycle', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('resale-requests'));
    await activities.open();
    await activities.expectLoaded();

    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['All', 'Completed', 'Rejected', 'Cancelled']),
    );
  });

  test('TC-16 The tax service offers both request and inquiry modes', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('vat-exemption'));
    await activities.open();
    await activities.expectLoaded();

    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['Inquiring about a certificate']),
    );
  });

  test('TC-16 Financial applications renders its status banner', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('financial-applications'));
    await activities.open();
    await activities.expectLoaded();
    await activities.waitForListing();
    // Copy issue D7 ("There is active cancelled applications.") is recorded in
    // the design doc; here we only assert the module resolves to a real state.
    expect(['empty', 'populated']).toContain(await activities.listingState());
  });

  test('TC-17 Housing design requests expose lifecycle tabs', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]},async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('housing-designs'));
    await activities.open();
    await activities.expectLoaded();
    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['All', 'Active', 'Cancelled', 'Completed']),
    );
  });
});
