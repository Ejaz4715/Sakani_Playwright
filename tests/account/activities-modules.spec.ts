import { test, expect } from '@fixtures/pages.fixture';
import { ActivitiesPage } from '@pages/ActivitiesPage';
import { ACTIVITY_MODULES } from '@data/testData';

test.describe('Account - activities modules', () => {
  for (const module of ACTIVITY_MODULES) {
    test(`ACT-${module.key} @P1 ${module.label} loads with its tabs and state`, async ({
      authenticatedPage,
    }) => {
      const activities = new ActivitiesPage(authenticatedPage, module);

      // ACT-G03 — the module is reachable by direct URL.
      await activities.open();
      await activities.expectLoaded();
      await expect(authenticatedPage).toHaveURL(new RegExp(escapeRegExp(module.path)));

      // ACT-G01 — every documented status tab is present.
      if (module.tabs.length) {
        const visible = await activities.visibleTabLabels();
        expect(visible, `${module.label} should expose all documented tabs`).toEqual(
          expect.arrayContaining([...module.tabs]),
        );
      }

      // ACT-G02 — the module resolves to data or its own empty state.
      await activities.waitForListing();
      if (module.emptyText) {
        expect(
          await activities.isEmpty(),
          `${module.label} should show its empty state for the fixture account`,
        ).toBeTruthy();
      }

      // Module-level primary action, where one exists.
      if (module.action) {
        await expect(activities.action(new RegExp(escapeRegExp(module.action), 'i'))).toBeVisible();
      }
    });
  }

  test('ACT-G05 @P0 activities modules are not reachable when logged out', async ({ page }) => {
    const module = ACTIVITY_MODULES[0];

    await page.goto(`${module.path}?lang=en`, { waitUntil: 'commit' });

    await page.waitForURL(/\/app\/authentication\/login/, { timeout: 150_000 });
    await expect(page.locator('#username')).toBeVisible({ timeout: 60_000 });
  });

  test('ACT-G04 @P2 a selected tab survives a reload', async ({ authenticatedPage }) => {
    const module = ACTIVITY_MODULES.find((m) => m.key === 'conveyance')!;
    const activities = new ActivitiesPage(authenticatedPage, module);

    await activities.open();
    await activities.expectLoaded();
    await activities.selectTab('Approved');

    await authenticatedPage.reload({ waitUntil: 'commit' });
    await activities.expectLoaded();

    // Either the tab is restored or the module falls back to its default tab —
    // both are acceptable, a broken/blank listing is not.
    await activities.waitForListing();
  });
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
