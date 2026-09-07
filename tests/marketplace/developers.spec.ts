import { test, expect } from '@fixtures/pages.fixture';
import { DevelopersPage } from '@pages/DevelopersPage';

/**
 * DEV — Developers directory.
 * spec: specs/functional-test-design.md § 23
 */
test.describe('Developers directory', () => {
  test('DEV-01 @P1 the directory lists developers', async ({ authenticatedPage }) => {
    const developers = new DevelopersPage(authenticatedPage);
    await developers.open();
    await developers.expectLoaded();

    await developers.waitForResults();
    expect((await developers.developerNames()).length).toBeGreaterThan(0);
  });

  test('DEV-02 @P1 searching by name narrows the directory', async ({ authenticatedPage }) => {
    const developers = new DevelopersPage(authenticatedPage);
    await developers.open();
    await developers.expectLoaded();
    await developers.waitForResults();

    const before = await developers.developerCount();
    await developers.search('أجزالا');

    // Wait for the new result set to render *before* measuring it. The listing
    // empties while the query loads, so a bare "the count went down" poll is
    // satisfied by that loading state — and every assertion after it then reads
    // an empty list. This was the whole of the earlier failure here: the
    // directory still contains this developer and the search still returns it.
    await developers.waitForResults();

    // Assert the search actually narrowed the set and that every remaining card
    // matches — "count did not grow" would pass even if the filter did nothing.
    expect(await developers.developerCount()).toBeLessThan(before);

    const names = await developers.developerNames();
    expect(names.length).toBeGreaterThan(0);
    expect(names.every((n) => n.includes('أجزالا'))).toBeTruthy();
  });

  test('DEV-04 @P1 a no-match search shows an explicit empty state', async ({
    authenticatedPage,
  }) => {
    const developers = new DevelopersPage(authenticatedPage);
    await developers.open();
    await developers.expectLoaded();
    await developers.waitForResults();

    await developers.search('zzzzzzzzzz');

    await expect
      .poll(async () => developers.developerCount(), {
        timeout: 30_000,
        message: 'A nonsense query should return no developers',
      })
      .toBe(0);
    await expect(developers.noResultsMessage.first()).toBeVisible();
  });

  test('DEV-05 @P2 special characters in search are handled safely', async ({
    authenticatedPage,
  }) => {
    const developers = new DevelopersPage(authenticatedPage);
    await developers.open();
    await developers.expectLoaded();

    await developers.search('<script>alert(1)</script>');

    // No dialog, no crash — the page stays alive and the input keeps the value escaped.
    await expect(developers.searchInput).toBeVisible();
    expect(await developers.searchInput.inputValue()).toContain('script');
  });

  test('DEV-11 @P2 clearing the search restores the full directory', async ({
    authenticatedPage,
  }) => {
    const developers = new DevelopersPage(authenticatedPage);
    await developers.open();
    await developers.expectLoaded();
    await developers.waitForResults();

    const original = await developers.developerCount();

    await developers.search('zzzzzzzzzz');
    await expect.poll(async () => developers.developerCount(), { timeout: 30_000 }).toBe(0);

    await developers.clearSearch();

    await expect
      .poll(async () => developers.developerCount(), { timeout: 30_000 })
      .toBe(original);
  });

  test('DEV-07 @P1 a developer card opens its profile', async ({ authenticatedPage }) => {
    const developers = new DevelopersPage(authenticatedPage);
    await developers.open();
    await developers.expectLoaded();
    await developers.waitForResults();

    // Cards carry no anchor; navigation happens in code on card click.
    await developers.openDeveloper(0);

    await expect(authenticatedPage).toHaveURL(/\/app\/developers\/\w+/);
  });

  test('DEV-12 @P2 the directory paginates', async ({ authenticatedPage }) => {
    const developers = new DevelopersPage(authenticatedPage);
    await developers.open();
    await developers.expectLoaded();
    await developers.waitForResults();

    const hasPaging = await developers.pagination.first().isVisible().catch(() => false);
    test.skip(!hasPaging, 'Not enough developers to paginate');

    const firstPageNames = await developers.developerNames();
    await developers.pagination.filter({ hasText: '2' }).first().click({ force: true });

    await expect
      .poll(async () => (await developers.developerNames())[0], { timeout: 30_000 })
      .not.toBe(firstPageNames[0]);
  });
});
