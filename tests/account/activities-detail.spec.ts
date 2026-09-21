import { test, expect } from '@fixtures/pages.fixture';
import { ActivitiesPage } from '@pages/ActivitiesPage';
import { ACTIVITY_MODULES } from '@data/testData';
import { logStep } from '@helpers/LogSteps';

const moduleByKey = (key: string) => ACTIVITY_MODULES.find((m) => m.key === key)!;

test.describe('Activities - module specifics', () => {
  test('TC-01 Purchased deals shows its empty state and marketplace CTA', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('purchase-deals'));

    await logStep('Step 01: Open the Purchased deals activities page');
    await activities.open();
    await activities.expectLoaded();

    await logStep('Step 02: Wait for the listing to render');
    await activities.waitForListing();

    await logStep('Step 03: Verify the empty state and Marketplace CTA');
    expect(await activities.isEmpty()).toBeTruthy();
    await expect(activities.action(/Deals Marketplace/i)).toBeVisible();
  });

  test('TC-02 Waiting list shows its own empty-state wording', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({
    authenticatedPage,
  }) => {
    const module = moduleByKey('waiting-list');
    const activities = new ActivitiesPage(authenticatedPage, module);

    await logStep('Step 01: Open the Waiting list activities page');
    await activities.open();
    await activities.expectLoaded();

    await logStep('Step 02: Wait for the waiting list to render');
    await activities.waitForListing();

    await logStep('Step 03: Verify the empty-state wording is visible');
    expect(await activities.isEmpty()).toBeTruthy();
    await expect(activities.emptyState).toBeVisible();
  });

  test('TC-03 Certified contractors reports no active contractors', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('certified-contractors'));

    await logStep('Step 01: Open the Certified contractors activities page');
    await activities.open();
    await activities.expectLoaded();

    await logStep('Step 02: Wait for the list to load');
    await activities.waitForListing();

    await logStep('Step 03: Verify the module shows no active contractors');
    expect(await activities.isEmpty()).toBeTruthy();
  });

  test('TC-04 Conveyance shows its empty state and a create action', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('conveyance'));

    await logStep('Step 01: Open the Conveyance activities page');
    await activities.open();
    await activities.expectLoaded();

    await logStep('Step 02: Wait for the conveyance list to render');
    await activities.waitForListing();

    await logStep('Step 03: Verify empty state and Create request action');
    expect(await activities.isEmpty()).toBeTruthy();
    await expect(activities.action(/Create request/i)).toBeVisible();
  });

  test('TC-05 Conveyance exposes an outcome tab per review state', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({
    authenticatedPage,
  }) => {
    const module = moduleByKey('conveyance');
    const activities = new ActivitiesPage(authenticatedPage, module);

    await logStep('Step 01: Open the Conveyance module');
    await activities.open();
    await activities.expectLoaded();

    await logStep('Step 02: Validate the review outcome tabs');
    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['Under review', 'Approved', 'Rejected']),
    );
  });

  test('TC-06 Online lending offers the start action', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ authenticatedPage }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('online-lending'));

    await logStep('Step 01: Open the Online lending activities page');
    await activities.open();
    await activities.expectLoaded();

    await logStep('Step 02: Verify the Start Online Lending action is visible');
    await expect(activities.action(/Start Online Lending/i)).toBeVisible();
  });

  test('TC-07 My auctions separates active from closed', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ authenticatedPage }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('auctions'));

    await logStep('Step 01: Open the My auctions module');
    await activities.open();
    await activities.expectLoaded();

    await logStep('Step 02: Confirm active and closed tabs are available');
    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['All', 'Active', 'Closed']),
    );
  });

  test('TC-08 Farz certificates shows its empty state', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ authenticatedPage }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('farz-certificates'));

    await logStep('Step 01: Open the Farz certificates module');
    await activities.open();
    await activities.expectLoaded();

    await logStep('Step 02: Wait for the list to render');
    await activities.waitForListing();

    await logStep('Step 03: Verify the empty state is shown');
    expect(await activities.isEmpty()).toBeTruthy();
  });

  test('TC-09 Farz certificates exposes lifecycle tabs', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ authenticatedPage }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('farz-certificates'));

    await logStep('Step 01: Open the Farz certificates page');
    await activities.open();
    await activities.expectLoaded();

    await logStep('Step 02: Check the certificate lifecycle tabs');
    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['Pending', 'Expired', 'Completed']),
    );
  });

  test('TC-10 Unit delivery shows its empty state', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ authenticatedPage }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('units-delivery'));

    await logStep('Step 01: Open the Unit delivery page');
    await activities.open();
    await activities.expectLoaded();

    await logStep('Step 02: Wait for the list to load');
    await activities.waitForListing();

    await logStep('Step 03: Verify the empty state is displayed');
    expect(await activities.isEmpty()).toBeTruthy();
  });

  test('TC-11 Unit delivery separates developer acceptance from beneficiary', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('units-delivery'));

    await logStep('Step 01: Open the Unit delivery module');
    await activities.open();
    await activities.expectLoaded();

    await logStep('Step 02: Verify developer and beneficiary acceptance tabs are present');
    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['Pending', 'Accepted', 'Accepted By Developer', 'Rejected']),
    );
  });

  test('TC-12 Rental requests shows its empty state', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ authenticatedPage }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('rental-requests'));

    await logStep('Step 01: Open the Rental requests page');
    await activities.open();
    await activities.expectLoaded();

    await logStep('Step 02: Wait for the rental request list to render');
    await activities.waitForListing();

    await logStep('Step 03: Verify the empty state is shown');
    expect(await activities.isEmpty()).toBeTruthy();
  });

  test('TC-13 Rental requests exposes an Incomplete resume state', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('rental-requests'));

    await logStep('Step 01: Open the Rental requests module');
    await activities.open();
    await activities.expectLoaded();

    await logStep('Step 02: Validate the incomplete and lifecycle tabs');
    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['Incomplete', 'Under process', 'Approved', 'Rejected']),
    );
  });

  test('TC-14 Resale requests offers both Sell and Buy sides', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('resale-requests'));

    await logStep('Step 01: Open the Resale requests module');
    await activities.open();
    await activities.expectLoaded();

    await logStep('Step 02: Confirm the Sell and Buy tabs are visible');
    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['Sell', 'Buy']),
    );
  });

  test('TC-15 Resale requests exposes its full status lifecycle', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('resale-requests'));

    await logStep('Step 01: Open the Resale requests module');
    await activities.open();
    await activities.expectLoaded();

    await logStep('Step 02: Validate the full lifecycle tabs');
    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['All', 'Completed', 'Rejected', 'Cancelled']),
    );
  });

  test('TC-16 The tax service offers both request and inquiry modes', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('vat-exemption'));

    await logStep('Step 01: Open the Tax service module');
    await activities.open();
    await activities.expectLoaded();

    await logStep('Step 02: Confirm inquiry mode is present');
    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['Inquiring about a certificate']),
    );
  });

  test('TC-16 Financial applications renders its status banner', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('financial-applications'));

    await logStep('Step 01: Open the Financial applications page');
    await activities.open();
    await activities.expectLoaded();

    await logStep('Step 02: Wait for the status list to settle');
    await activities.waitForListing();

    await logStep('Step 03: Validate the module resolves to a real status state');
    expect(['empty', 'populated']).toContain(await activities.listingState());
  });

  test('TC-17 Housing design requests expose lifecycle tabs', { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('housing-designs'));

    await logStep('Step 01: Open the Housing design requests page');
    await activities.open();
    await activities.expectLoaded();

    await logStep('Step 02: Validate the lifecycle tabs for housing design requests');
    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['All', 'Active', 'Cancelled', 'Completed']),
    );
  });
});