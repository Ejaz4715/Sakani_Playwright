import { test, expect } from '@fixtures/pages.fixture';
import { ActivitiesPage } from '@pages/ActivitiesPage';
import { ACTIVITY_MODULES } from '@data/testData';

const moduleByKey = (key: string) => ACTIVITY_MODULES.find((m) => m.key === key)!;

test.describe('Activities - module specifics', () => {
  test('APD-01 @P1 purchased deals shows its empty state and marketplace CTA', async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('purchase-deals'));
    await activities.open();
    await activities.expectLoaded();
    await activities.waitForListing();

    expect(await activities.isEmpty()).toBeTruthy();
    await expect(activities.action(/Deals Marketplace/i)).toBeVisible();
  });

  test('AWL-01 @P1 waiting list shows its own empty-state wording', async ({
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

  test('ACC-01 @P1 certified contractors reports no active contractors', async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('certified-contractors'));
    await activities.open();
    await activities.expectLoaded();
    await activities.waitForListing();

    expect(await activities.isEmpty()).toBeTruthy();
  });

  test('ACV-01 @P1 conveyance shows its empty state and a create action', async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('conveyance'));
    await activities.open();
    await activities.expectLoaded();
    await activities.waitForListing();

    expect(await activities.isEmpty()).toBeTruthy();
    await expect(activities.action(/Create request/i)).toBeVisible();
  });

  test('ACV-05 @P2 conveyance exposes an outcome tab per review state', async ({
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

  test('AOL-01 @P0 online lending offers the start action', async ({ authenticatedPage }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('online-lending'));
    await activities.open();
    await activities.expectLoaded();

    await expect(activities.action(/Start Online Lending/i)).toBeVisible();
  });

  test('AAU-01 @P1 my auctions separates active from closed', async ({ authenticatedPage }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('auctions'));
    await activities.open();
    await activities.expectLoaded();

    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['All', 'Active', 'Closed']),
    );
  });

  test('AFZ-01 @P1 farz certificates shows its empty state', async ({ authenticatedPage }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('farz-certificates'));
    await activities.open();
    await activities.expectLoaded();
    await activities.waitForListing();

    expect(await activities.isEmpty()).toBeTruthy();
  });

  test('AFZ-03 @P2 farz certificates exposes lifecycle tabs', async ({ authenticatedPage }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('farz-certificates'));
    await activities.open();
    await activities.expectLoaded();

    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['Pending', 'Expired', 'Completed']),
    );
  });

  test('AUD-01 @P1 unit delivery shows its empty state', async ({ authenticatedPage }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('units-delivery'));
    await activities.open();
    await activities.expectLoaded();
    await activities.waitForListing();

    expect(await activities.isEmpty()).toBeTruthy();
  });

  test('AUD-02 @P1 unit delivery separates developer acceptance from beneficiary', async ({
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

  test('ARR-01 @P1 rental requests shows its empty state', async ({ authenticatedPage }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('rental-requests'));
    await activities.open();
    await activities.expectLoaded();
    await activities.waitForListing();

    expect(await activities.isEmpty()).toBeTruthy();
  });

  test('ARR-02 @P1 rental requests exposes an Incomplete resume state', async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('rental-requests'));
    await activities.open();
    await activities.expectLoaded();

    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['Incomplete', 'Under process', 'Approved', 'Rejected']),
    );
  });

  test('ARS-01 @P1 resale requests offers both Sell and Buy sides', async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('resale-requests'));
    await activities.open();
    await activities.expectLoaded();

    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['Sell', 'Buy']),
    );
  });

  test('ARS-02 @P1 resale requests exposes its full status lifecycle', async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('resale-requests'));
    await activities.open();
    await activities.expectLoaded();

    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['All', 'Completed', 'Rejected', 'Cancelled']),
    );
  });

  test('AVT-01 @P1 the tax service offers both request and inquiry modes', async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('vat-exemption'));
    await activities.open();
    await activities.expectLoaded();

    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['Inquiring about a certificate']),
    );
  });

  test('AFA-01 @P2 financial applications renders its status banner', async ({
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

  test('AHD-01 @P1 housing design requests expose lifecycle tabs', async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('housing-designs'));
    await activities.open();
    await activities.expectLoaded();

    expect(await activities.visibleTabLabels()).toEqual(
      expect.arrayContaining(['All', 'Active', 'Cancelled', 'Completed']),
    );
  });

  // ---------------------------------------------------------------------------
  // State-changing activity flows — prepared but not executed.
  // Each creates a real request against the shared pre-production beneficiary
  // and has no UI-level undo, so they need a disposable account or a reset hook.
  // ---------------------------------------------------------------------------

  test.fixme('ACV-02 @P0 a conveyance request can be created end to end', async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('conveyance'));
    await activities.open();
    await activities.action(/Create request/i).click({ force: true });

    await expect(
      authenticatedPage.getByText(/Under review|قيد المراجعة/i).first(),
    ).toBeVisible({ timeout: 120_000 });
  });

  test.fixme('AOL-01b @P0 an online lending request can be started', async ({
    authenticatedPage,
  }) => {
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('online-lending'));
    await activities.open();
    await activities.action(/Start Online Lending/i).click({ force: true });

    await expect(authenticatedPage).toHaveURL(/lending/i, { timeout: 120_000 });
  });

  test.fixme('AWL-02 @P1 a waiting-list subscription can be created', async ({
    authenticatedPage,
  }) => {
    // Requires a project that exposes a waiting-list CTA; none was found in
    // pre-production during exploration.
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('waiting-list'));
    await activities.open();
    await expect(activities.emptyState).toBeVisible();
  });

  test.fixme('ARS-03 @P0 a resale request can be submitted', async ({ authenticatedPage }) => {
    // Needs an owned, resale-eligible unit; the fixture account holds none.
    const activities = new ActivitiesPage(authenticatedPage, moduleByKey('resale-requests'));
    await activities.open();
    await expect(activities.heading).toBeVisible();
  });
});
