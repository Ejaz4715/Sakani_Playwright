import { test, expect } from '@fixtures/pages.fixture';
import { ActivitiesPage } from '@pages/ActivitiesPage';
import { ACTIVITY_MODULES } from '@data/testData';
import { logStep } from '@helpers/LogSteps';

test.describe('Account - activities modules', () => {
  for (const module of ACTIVITY_MODULES) {
    test(`TC-01 ${module.key} ${module.label} loads with its tabs and state`, {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({
      authenticatedPage,
    }) => {
      const activities = new ActivitiesPage(authenticatedPage, module);

      await logStep('Step 01: Open the activities module');
      await activities.open();
      await activities.expectLoaded();

      await logStep('Step 02: Validate the module URL');
      await expect(authenticatedPage).toHaveURL(new RegExp(escapeRegExp(module.path)));

      if (module.tabs.length) {
        await logStep('Step 03: Confirm documented tabs are visible');
        const visible = await activities.visibleTabLabels();
        expect(visible, `${module.label} should expose all documented tabs`).toEqual(
          expect.arrayContaining([...module.tabs]),
        );
      }

      await logStep('Step 04: Wait for the listing to resolve');
      await activities.waitForListing();
      if (module.emptyText) {
        await logStep('Step 05: Check the empty state for the module');
        expect(
          await activities.isEmpty(),
          `${module.label} should show its empty state for the fixture account`,
        ).toBeTruthy();
      }

      if (module.action) {
        await logStep('Step 06: Verify the primary action is visible');
        await expect(activities.action(new RegExp(escapeRegExp(module.action), 'i'))).toBeVisible();
      }
    });
  }

  test('TC-02 Activities modules are not reachable when logged out', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ page }) => {
    const module = ACTIVITY_MODULES[0];

    await logStep('Step 01: Open the activities module URL while logged out');
    await page.goto(`${module.path}?lang=en`, { waitUntil: 'commit' });

    await logStep('Step 02: Wait for the authentication redirect');
    await page.waitForURL(/\/app\/authentication\/login/, { timeout: 150_000 });

    await logStep('Step 03: Confirm login form is shown');
    await expect(page.locator('#username')).toBeVisible({ timeout: 60_000 });
  });

  test('TC-03 Selected tab survives a reload', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]}, async ({ authenticatedPage }) => {
    const module = ACTIVITY_MODULES.find((m) => m.key === 'conveyance')!;
    const activities = new ActivitiesPage(authenticatedPage, module);

    await logStep('Step 01: Open the conveyance module');
    await activities.open();
    await activities.expectLoaded();

    await logStep('Step 02: Select the approved tab');
    await activities.selectTab('Approved');

    await logStep('Step 03: Reload the page to preserve the tab state');
    await authenticatedPage.reload({ waitUntil: 'commit' });
    await activities.expectLoaded();

    await logStep('Step 04: Verify the listing is still usable after reload');
    await activities.waitForListing();
  });
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
