import { test, expect } from '@fixtures/pages.fixture';
import { ProjectPage } from '@pages/ProjectPage';
import { UnitModelPage } from '@pages/UnitModelPage';
import { UnitDetailPage } from '@pages/UnitDetailPage';
import { PROJECTS } from '@data/testData';
import { findBookableNonBeneUnit, getProject } from '@helpers/marketplaceApi';

/**
 * PRJ — project detail, unit models and unit detail.
 * spec: specs/exploration-report.md  (TC-PRJ)
 */
test.describe('Project & units', () => {
  test('PRJ-01 @P0 @smoke project detail renders all business sections', async ({
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

  test('PRJ-09 @P0 unit-model page lists units with filter chips', async ({
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

  test('PRJ-10 @P0 unit detail shows availability and a booking CTA', async ({
    authenticatedPage,
  }) => {
    const unit = await findBookableNonBeneUnit(authenticatedPage, PROJECTS.bookable);

    const detail = new UnitDetailPage(authenticatedPage, unit.id);
    await detail.open();

    await detail.expectBookable();
    await expect(detail.mortgageCalculatorButton).toBeVisible();
    await expect(detail.favoriteButton.first()).toBeVisible();
  });

  test('PRJ-14 @P1 project -> unit model -> unit navigation chain', async ({
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

  test('PRJ-15 @P1 a closed project surfaces its bookings-closed state', async ({
    authenticatedPage,
  }) => {
    const info = await getProject(authenticatedPage, PROJECTS.bookingsClosed);
    expect(info.bookable, 'Fixture project should be non-bookable').toBeFalsy();

    const project = new ProjectPage(authenticatedPage, PROJECTS.bookingsClosed);
    await project.open();
    await project.expectLoaded();

    // The project still lists inventory, but booking is gated at project level.
    expect(info.availableUnitsCount).toBeGreaterThan(0);
  });
});
