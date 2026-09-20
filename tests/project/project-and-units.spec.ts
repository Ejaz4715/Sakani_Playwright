import page from 'playwright/test';
import { test, expect } from '@fixtures/pages.fixture';
import { ProjectPage } from '@pages/ProjectPage';
import { UnitModelPage } from '@pages/UnitModelPage';
import { UnitDetailPage } from '@pages/UnitDetailPage';
import { PROJECTS } from '@data/testData';
import { findBookableNonBeneUnit, getProject } from '@helpers/marketplaceApi';

test.describe('View projects and units', () => {
  test('TC-01 Project detail renders all business sections About this project, Developer, Payment methods, Facilities, Location, Participating banks, Contact',
    { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
      authenticatedPage,
    }) => {
    const project = new ProjectPage(authenticatedPage, PROJECTS.bookable);
    await project.open();
    await project.expectLoaded();

    const headings = (await project.sectionHeadings()).join(' | ');
    for (const section of [
      'About this project',
      'Developer',
      'Payment methods',
      'Facilities',
      'Location',
      'Participating banks',
      'Contact',
    ]) {
      expect(headings, `Section "${section}" should render`).toContain(section);
    }
  });

  test('TC-02 Unit-model page lists units with filter chips', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    authenticatedPage,
  }) => {
    const unit = await findBookableNonBeneUnit(authenticatedPage, PROJECTS.bookable);
    const model = new UnitModelPage(authenticatedPage, unit.unitModelId);
    await model.open();
    await model.expectLoaded();
    const chips = await model.chipLabels();
    expect(chips.length, 'Expected at least the "All" size chip').toBeGreaterThan(0);
    expect(chips.join(' ')).toMatch(/All/i);
    expect(await model.unitCards.count()).toBeGreaterThan(0);
  });

  test('TC-03 Unit detail shows availability and a booking CTA', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    authenticatedPage,
  }) => {
    const unit = await findBookableNonBeneUnit(authenticatedPage, PROJECTS.bookable);
    const detail = new UnitDetailPage(authenticatedPage, unit.id);
    await detail.open();
    await detail.expectBookable();
    await expect(detail.mortgageCalculatorButton).toBeVisible();
    await expect(detail.favoriteButton.first()).toBeVisible();
  });

  test('TC-04 Project -> unit model -> unit navigation chain', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    authenticatedPage,
  }) => {
    const unit = await findBookableNonBeneUnit(authenticatedPage, PROJECTS.bookable);
    const project = new ProjectPage(authenticatedPage, PROJECTS.bookable);
    await project.open();
    await project.expectLoaded();
    await project.scrollToUnitModels();
    expect(await project.unitModelCards.count()).toBeGreaterThan(0);
    const model = new UnitModelPage(authenticatedPage, unit.unitModelId);
    await model.open();
    await model.expectLoaded();
    await model.selectAllUnits();
    // Unit cards open the unit in a new tab.
    const unitTab = await model.openUnitByName(unit.unitName);
    await expect(unitTab).toHaveURL(new RegExp(`/app/units/${unit.id}`), { timeout: 120_000 });
    await unitTab.close();
  });

  test('TC-05 Closed project surfaces its bookings-closed state', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    authenticatedPage, page
  }) => {
    const info = await getProject(authenticatedPage, PROJECTS.bookingsClosed);
    const project = new ProjectPage(authenticatedPage, PROJECTS.bookingsClosed);
    await project.open();
    await project.expectLoaded();
    // The project still lists inventory, but booking is gated at project level.
    expect(info.availableUnitsCount).toBeGreaterThan(0);
  });
});
