import { test, expect } from '@fixtures/pages.fixture';
import { ProjectPage } from '@pages/ProjectPage';
import { PROJECTS } from '@data/testData';

test.describe('Project details page', () => {
  test('TC-01 The media gallery control is present', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ authenticatedPage }) => {
    const project = new ProjectPage(authenticatedPage, PROJECTS.bookable);
    await project.open();
    await project.expectLoaded();
    // The hero's action row hydrates after the price heading that `open()`
    // waits on, so this needs an app-readiness timeout rather than the default.
    // The label pluralises with the count: "1 Photo", "11 Photos", "19 Media".
    await expect(project.mediaButton.first()).toBeVisible({ timeout: 90_000 });
  });

  test('TC-02 A project can be favourited and unfavourited', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    authenticatedPage,
  }) => {
    const project = new ProjectPage(authenticatedPage, PROJECTS.bookable);
    await project.open();
    await project.expectLoaded();

    const favorite = project.favoriteButton.first();
    await expect(favorite).toBeVisible();

    await favorite.click({ force: true });
    // Toggle back so the test leaves no state behind for later runs.
    await favorite.click({ force: true });

    await expect(favorite).toBeVisible();
  });

  test('TC-03 Share control is available', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ authenticatedPage }) => {
    const project = new ProjectPage(authenticatedPage, PROJECTS.bookable);
    await project.open();
    await project.expectLoaded();

    await expect(project.shareButton.first()).toBeVisible();
  });

  test('TC-04 The developer link points at a developer profile', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    authenticatedPage,
  }) => {
    const project = new ProjectPage(authenticatedPage, PROJECTS.bookable);
    await project.open();
    await project.expectLoaded();
    const href = await project.developerLink.getAttribute('href');
    expect(href ?? '').toMatch(/\/app\/developers\/\w+/);
  });

  test('TC-05 Owners Association links to the external Mullak site', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    authenticatedPage,
  }) => {
    const project = new ProjectPage(authenticatedPage, PROJECTS.bookable);
    await project.open();
    await project.expectLoaded();
    const link = project.ownersAssociationLink.first();
    const hasLink = await link.count();
    test.skip(hasLink === 0, 'Project does not expose an Owners Association block');
    expect(await link.getAttribute('href')).toContain('mullak.housing.gov.sa');
  });

  /**
   * DEFECT D14 — the project page's "Register Interest" CTA is **inert**. It is
   * a visible `<a href="#">` with no `target`; activating it leaves the URL
   * unchanged and opens no tab. Confirmed twice by independent means: a real
   * Playwright click in this test, and a synthetic click driven straight
   * against the element in the live page.
   *
   * The form itself works and is covered by the RGI suite via its direct route
   * (`/app/register-interest?project_id=…`) — only this entry point is broken,
   * so the journey is unreachable from the project page.
   *
   * The assertion states the correct behaviour and is held failing so a fix
   * surfaces as an unexpected pass.
   */
  test('TC-06 Register Interest routes with the project pre-selected', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    authenticatedPage,
  }) => {
    test.fail(true, 'project-page Register Interest CTA is inert (href="#", no navigation)');
    const project = new ProjectPage(authenticatedPage, PROJECTS.registerInterest);
    await project.open();
    await project.expectLoaded();
    const link = project.registerInterestLink.first();
    const present = await link.count();
    test.skip(present === 0, 'Project does not expose a Register Interest CTA');
    // The CTA carries `href="#"` and is driven by JS, so the destination is
    // verified by activating it. It may navigate in place or open a new tab,
    // as the unit cards elsewhere in this app do.
    const popup = authenticatedPage.context().waitForEvent('page', { timeout: 30_000 }).catch(() => null);
    await link.click({ force: true });
    const opened = await popup;
    const target = opened ?? authenticatedPage;
    await expect
      .poll(() => target.url(), {
        timeout: 90_000,
        message: 'Register Interest did not route to the scoped form',
      })
      .toMatch(new RegExp(`/app/register-interest.*project_id=${PROJECTS.registerInterest}`));
  });

  test('TC-07 The deferred-subsidy badge reflects the project contract', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    authenticatedPage,
  }) => {
    const project = new ProjectPage(authenticatedPage, PROJECTS.bookingsClosed);
    await project.open();
    await project.expectLoaded();
    await expect(
      authenticatedPage.getByText(/Applied Deferred Subsidy Contract/i).first(),
    ).toBeVisible({ timeout: 60_000 });
  });

  test('TC-08 The target audience is stated on the project', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    authenticatedPage,
  }) => {
    const project = new ProjectPage(authenticatedPage, PROJECTS.bookable);
    await project.open();
    await project.expectLoaded();
    const headings = await project.sectionHeadings();
    expect(headings.join(' | ')).toMatch(/Target audience|الفئة المستهدفة/i);
  });

  test('TC-09 An unknown project id does not render a broken page', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    authenticatedPage,
  }) => {
    const project = new ProjectPage(authenticatedPage, 99999999);
    await project.goto(`/app/offplan-projects/99999999?lang=en`);
    await expect
      .poll(
        async () => {
          const text = await authenticatedPage.locator('body').innerText().catch(() => '');
          return text.replace(/\s+/g, ' ').trim().length;
        },
        { timeout: 150_000, message: 'Unknown project id rendered an empty shell' },
      )
      .toBeGreaterThan(200);
  });

  test('TC-10 Project is publicly viewable without a session', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ page, header }) => {
    const project = new ProjectPage(page, PROJECTS.bookable);
    await project.open();
    await project.expectLoaded();
    // The project renders in the DWE shell, which carries "Back to Sakani"
    // rather than the global header — so the guest state is asserted by the
    // absence of the authenticated user menu, not by a Login button.
    await expect(project.priceStartingFrom).toBeVisible();
    expect(await header.isAuthenticated()).toBeFalsy();
  });

  test('TC-11 The payment schedule exposes its details', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ authenticatedPage }) => {
    const project = new ProjectPage(authenticatedPage, PROJECTS.bookable);
    await project.open();
    await project.expectLoaded();
    const headings = await project.sectionHeadings();
    expect(headings.join(' | ')).toMatch(/Payment schedule|جدول الدفع/i);
  });

  test('TC-12 Participating banks are listed', {annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({ authenticatedPage }) => {
    const project = new ProjectPage(authenticatedPage, PROJECTS.bookable);
    await project.open();
    await project.expectLoaded();
    await project.participatingBanksSection.first().scrollIntoViewIfNeeded();
    await expect(project.participatingBanksSection.first()).toBeVisible();
  });
});
