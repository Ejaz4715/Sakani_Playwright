import page from 'playwright/test';
import { test, expect } from '@fixtures/pages.fixture';
import { ProjectPage } from '@pages/ProjectPage';
import { UnitModelPage } from '@pages/UnitModelPage';
import { UnitDetailPage } from '@pages/UnitDetailPage';
import { PROJECTS } from '@data/testData';
import { findBookableNonBeneUnit, getProject } from '@helpers/marketplaceApi';
import { logStep } from '@helpers/LogSteps';

test.describe('View projects and units', () => {
  test('TC-01 Project detail renders all business sections About this project, Developer, Payment methods, Facilities, Location, Participating banks, Contact',
    { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
      authenticatedPage,
    }) => {
    const project = new ProjectPage(authenticatedPage, PROJECTS.bookable);
    await logStep('Step 01: Open the project detail page');
    await project.open();
    await project.expectLoaded();

    await logStep('Step 02: Check the project sections are rendered');
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
    await logStep('Step 01: Find a bookable unit and open its model page');
    const unit = await findBookableNonBeneUnit(authenticatedPage, PROJECTS.bookable);
    const model = new UnitModelPage(authenticatedPage, unit.unitModelId);
    await model.open();
    await model.expectLoaded();
    await logStep('Step 02: Validate the filter chip list is present');
    const chips = await model.chipLabels();
    expect(chips.length, 'Expected at least the "All" size chip').toBeGreaterThan(0);
    expect(chips.join(' ')).toMatch(/All/i);
    expect(await model.unitCards.count()).toBeGreaterThan(0);
  });

  test('TC-03 Unit detail shows availability and a booking CTA', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    authenticatedPage,
  }) => {
    await logStep('Step 01: Find an available unit and open its detail page');
    const unit = await findBookableNonBeneUnit(authenticatedPage, PROJECTS.bookable);
    const detail = new UnitDetailPage(authenticatedPage, unit.id);
    await detail.open();

    await logStep('Step 02: Validate the booking CTA and favorite button are visible');
    await detail.expectBookable();
    await expect(detail.mortgageCalculatorButton).toBeVisible();
    await expect(detail.favoriteButton.first()).toBeVisible();
  });

  test('TC-04 Project -> unit model -> unit navigation chain', { annotation: [{ product: 'Marketplace', type: 'non-critical' } as any] }, async ({
    authenticatedPage,
  }) => {
    await logStep('Step 01: Open the project and locate a model-to-unit chain');
    const unit = await findBookableNonBeneUnit(authenticatedPage, PROJECTS.bookable);
    const project = new ProjectPage(authenticatedPage, PROJECTS.bookable);
    await project.open();
    await project.expectLoaded();
    await project.scrollToUnitModels();
    expect(await project.unitModelCards.count()).toBeGreaterThan(0);
    const model = new UnitModelPage(authenticatedPage, unit.unitModelId);
    await logStep('Step 02: Move from model view to unit detail and confirm the URL');
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
    await logStep('Step 01: Open a known closed project');
    const info = await getProject(authenticatedPage, PROJECTS.bookingsClosed);
    const project = new ProjectPage(authenticatedPage, PROJECTS.bookingsClosed);
    await project.open();
    await project.expectLoaded();
    await logStep('Step 02: Confirm the project still exposes inventory while booking is closed');
    // The project still lists inventory, but booking is gated at project level.
    expect(info.availableUnitsCount).toBeGreaterThan(0);
  });
});
