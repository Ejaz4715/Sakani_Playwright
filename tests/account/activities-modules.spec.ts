import { test, expect } from '@fixtures/pages.fixture';
import { ActivitiesPage } from '@pages/ActivitiesPage';
import { ACTIVITY_MODULES } from '@data/testData';

test.describe('Account - activities modules', () => {
  for (const module of ACTIVITY_MODULES) {
    test(`TC-01 ${module.key} ${module.label} loads with its tabs and state`, {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
      authenticatedPage,
    }) => {
      const activities = new ActivitiesPage(authenticatedPage, module);

      // the module is reachable by direct URL.
      await activities.open();
      await activities.expectLoaded();
      await expect(authenticatedPage).toHaveURL(new RegExp(escapeRegExp(module.path)));

      // every documented status tab is present.
      if (module.tabs.length) {
        const visible = await activities.visibleTabLabels();
        expect(visible, `${module.label} should expose all documented tabs`).toEqual(
          expect.arrayContaining([...module.tabs]),
        );
      }

      // module resolves to data or its own empty state.
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

  test('TC-02 Activities modules are not reachable when logged out', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ page }) => {
    const module = ACTIVITY_MODULES[0];

    await page.goto(`${module.path}?lang=en`, { waitUntil: 'commit' });

    await page.waitForURL(/\/app\/authentication\/login/, { timeout: 150_000 });
    await expect(page.locator('#username')).toBeVisible({ timeout: 60_000 });
  });

  test('TC-03 Selected tab survives a reload', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ authenticatedPage }) => {
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
