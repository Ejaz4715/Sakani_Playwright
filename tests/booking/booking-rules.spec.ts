import { test, expect } from '@fixtures/pages.fixture';
import { UnitDetailPage } from '@pages/UnitDetailPage';
import { PROJECTS, API, TEST_USER } from '@data/testData';
import { logStep } from '@helpers/LogSteps';
import {
  findBookableNonBeneUnit,
  getProject,
  getAvailableUnits,
  getBeneficiary,
  getActiveBookingProjectCodes,
} from '@helpers/marketplaceApi';

const path = require("path");
import { WebApp } from "@base-class/web-app";
const fs = require('fs');

function readTestData() {
  const filePath = path.join(process.cwd(), "src", "data", "test-data.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

test.describe('Booking - business rules', () => {
  
  
  test("TC-01 A non-bookable project rejects does not allow to user to book a unit", {annotation: [{product: 'Marketplace', type: 'non-critical'} as any]}, async ({ page }) => {
  test.setTimeout(0);
  const app = new WebApp(page);
      await logStep('Step 01: Open the non-bookable unit detail page');
      await page.goto("https://pre-sakani.housingapps.sa/app/units/174918");
      await logStep('Step 02: Validate the unavailable-booking message is shown');
      await app.unitDetailsPage.validateUnavailableMessage();
});

  test('TC-02 Non-beneficiary account can only book non-beneficiary projects',{annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage;
    await logStep('Step 01: Read the authenticated profile and available units');
    const me = await getBeneficiary(page);
    expect(me.is_non_beneficiary, 'Fixture account should be a non-beneficiary').toBe(
      TEST_USER.isNonBeneficiary,
    );
    expect(me.decrypted_national_id_number).toBe(TEST_USER.nationalId);
    const units = await getAvailableUnits(page, PROJECTS.bookable);
    expect(units.length).toBeGreaterThan(0);
    // Every unit carries an explicit segment; the journey must pick a non_bene one.
    for (const unit of units) {
      expect(
        unit.targetSegments.length,
        `Unit ${unit.unitName} should declare target segments`,
      ).toBeGreaterThan(0);
    }
    const bookable = await findBookableNonBeneUnit(page, PROJECTS.bookable);
    await logStep('Step 02: Confirm the bookable unit belongs to the non-beneficiary segment');
    expect(bookable.targetSegments).toContain('non_bene');
    expect(bookable.bookingStatus).toBe('available');
  });

  test('TC-03 Eligibility status is reflected on the profile',{annotation: [{ product: 'Marketplace', type: 'non-critical' } as any]} , async ({
    authenticatedPage,
  }) => {
    await logStep('Step 01: Load the authenticated profile and inspect eligibility data');
    const me = await getBeneficiary(authenticatedPage);
    // Drives which products, prices and payment methods the account is offered.
    expect(me.is_non_beneficiary).toBe(true);
    expect(me.purchase_power).toBeGreaterThan(0);
    expect(me.number_of_active_bookings_by_project).toBeDefined();
  });
});
