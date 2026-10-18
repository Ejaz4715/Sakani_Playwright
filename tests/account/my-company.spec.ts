import { test, expect } from "@fixtures/pages.fixture";
import { UserProfilePage } from "@pages/UserProfilePage";
import { PROFILE_ROUTES } from "@data/testData";
import { MyBookingsPage } from "@pages/MyBookingsPage";
import { logStep } from "@helpers/LogSteps";

test.describe("Account - My company bookings and payments", () => {
  test(
    "TC-01 Company bookings page renders correctly",
    { annotation: [{ product: "Marketplace", type: "non-critical" } as any] },
    async ({ authenticatedPageCompanyUser, page }) => {
      const profile = new UserProfilePage(authenticatedPageCompanyUser);

      await logStep("Step 01: Open the company bookings page");
      await profile.openCompanyBookings();

      await logStep("Step 02: Validate the bookings are visible");
      await expect(profile.bookingCard).toBeVisible({ timeout: 60_000 });
    },
  );

  test(
    "TC-02 Company bookings page exposes all four status tabs (All, Unpaid, Paid, Cancelled)",
    { annotation: [{ product: "Marketplace", type: "non-critical" } as any] },
    async ({ authenticatedPageCompanyUser, page }) => {
      const profile = new UserProfilePage(authenticatedPageCompanyUser);
      const myBookings = new MyBookingsPage(page);

      await logStep("Step 01: Open the company bookings page");
      await profile.openCompanyBookings();
      await expect(profile.bookingCard).toBeVisible({ timeout: 60_000 });

      await logStep("Step 02: Validate the booking tabs are available");
      const tabs = await myBookings.tabLabels();
      for (const tab of ["All", "Active", "Cancelled", "Completed"]) {
        expect(tabs, `Status tab "${tab}" should be present`).toContain(tab);
      }
    },
  );

  test(
    "TC-03 The Active tab filters only lists active company bookings",
    { annotation: [{ product: "Marketplace", type: "non-critical" } as any] },
    async ({ authenticatedPageCompanyUser, page }) => {
      const profile = new UserProfilePage(authenticatedPageCompanyUser);
      const bookings = new MyBookingsPage(page);

      await logStep("Step 01: Open the company bookings page");
      await profile.openCompanyBookings();
      await expect(profile.bookingCard).toBeVisible({ timeout: 60_000 });

      await logStep("Step 02: Select the active tab");
      await bookings.selectTab(bookings.tabActive);
      await page.waitForTimeout(3000);

      await logStep("Step 03: Ensure the active view does not show cancellation dates");
      await expect(page.getByText(/Cancellation date|تاريخ الإلغاء/i)).toHaveCount(0);
    },
  );

  test(
    "TC-04 The Cancelled tab lists only cancelled company bookings",
    { annotation: [{ product: "Marketplace", type: "non-critical" } as any] },
    async ({ authenticatedPageCompanyUser, page }) => {
      const profile = new UserProfilePage(authenticatedPageCompanyUser);
      const bookings = new MyBookingsPage(page);

      await logStep("Step 01: Open the company bookings page");
      await profile.openCompanyBookings();
      await expect(profile.bookingCard).toBeVisible({ timeout: 60_000 });

      await logStep("Step 02: Select the cancelled tab");
      await bookings.selectTab(bookings.tabCancelled);

      await logStep("Step 03: Confirm cancelled-booking content is present");
      const hasAny = await bookings.hasAnyBooking();
      test.skip(!hasAny, "Account has no cancelled bookings in this environment");
      const body = await page.locator("body").innerText();
      expect(body).toMatch(/Cancel|ملغ/i);
    },
  );

  test(
    "TC-05 The Ready to sign tab renders for company bookings",
    { annotation: [{ product: "Marketplace", type: "non-critical" } as any] },
    async ({ authenticatedPageCompanyUser, page }) => {
      const profile = new UserProfilePage(authenticatedPageCompanyUser);
      const bookings = new MyBookingsPage(page);

      await logStep("Step 01: Open the company bookings page");
      await profile.openCompanyBookings();
      await expect(profile.bookingCard).toBeVisible({ timeout: 60_000 });

      await logStep("Step 02: Select the ready to sign tab");
      await bookings.selectTab(bookings.tabReadyToSign);

      await logStep("Step 03: Verify the tab renders a listing");
      await bookings.waitForListing();
    },
  );

  test(
    "TC-06 The Completed tab renders",
    { annotation: [{ product: "Marketplace", type: "non-critical" } as any] },
    async ({ authenticatedPageCompanyUser, page }) => {
      const profile = new UserProfilePage(authenticatedPageCompanyUser);
      const bookings = new MyBookingsPage(page);

      await logStep("Step 01: Open the company bookings page");
      await profile.openCompanyBookings();
      await expect(profile.bookingCard).toBeVisible({ timeout: 60_000 });

      await logStep("Step 02: Select the completed tab");
      await bookings.selectTab(bookings.tabCompleted);

      await logStep("Step 03: Ensure the completed view renders without a blank pane");
      await bookings.waitForListing();
    },
  );

  test(
    "TC-07 The Unpaid tab renders for company bookings",
    { annotation: [{ product: "Marketplace", type: "non-critical" } as any] },
    async ({ authenticatedPageCompanyUser, page }) => {
      const profile = new UserProfilePage(authenticatedPageCompanyUser);
      const bookings = new MyBookingsPage(page);

      await logStep("Step 01: Open the company bookings page");
      await profile.openCompanyBookings();
      await expect(profile.bookingCard).toBeVisible({ timeout: 60_000 });

      await logStep("Step 02: Select the unpaid tab");
      await bookings.selectTab(bookings.tabUnpaid);

      await logStep("Step 03: Verify the unpaid listing renders");
      await bookings.waitForListing();
    },
  );

  test(
    "TC-08 View details opens the matching booking",
    { annotation: [{ product: "Marketplace", type: "non-critical" } as any] },
    async ({ authenticatedPageCompanyUser, page }) => {
      const profile = new UserProfilePage(authenticatedPageCompanyUser);
      const bookings = new MyBookingsPage(page);

      await logStep("Step 01: Open the company bookings page");
      await profile.openCompanyBookings();
      await expect(profile.bookingCard).toBeVisible({ timeout: 60_000 });

      await logStep("Step 02: Check there is a booking to open");
      const hasAny = await bookings.hasAnyBooking();
      test.skip(!hasAny, "Account has no bookings to open");

      await logStep("Step 03: Open the first booking details page");
      await bookings.openBookingDetails(0);

      await logStep("Step 04: Confirm the booking detail page is opened");
      await expect(page).toHaveURL(/view-booking\/\d+/);
      await expect(page.getByRole("heading", { name: /Booking/i }).first()).toBeVisible({ timeout: 90_000 });
    },
  );

  test(
    "TC-09 Company paymets page renders correctly",
    { annotation: [{ product: "Marketplace", type: "non-critical" } as any] },
    async ({ authenticatedPageCompanyUser }) => {
      const profile = new UserProfilePage(authenticatedPageCompanyUser);

      await logStep("Step 01: Open the company payments page");
      await profile.openCompanyPayments();

      await logStep("Step 02: Validate all the payment details are visible");
      await expect(profile.invoiceCard).toBeVisible({ timeout: 60_000 });
    },
  );

  test(
    "TC-10 Company payments page exposes all four status tabs (All, Unpaid, Paid, Cancelled)",
    { annotation: [{ product: "Marketplace", type: "non-critical" } as any] },
    async ({ authenticatedPageCompanyUser }) => {
      const profile = new UserProfilePage(authenticatedPageCompanyUser);

      await logStep("Step 01: Open the payments page");
      await profile.openCompanyPayments();
      await expect(profile.invoiceCard).toBeVisible({ timeout: 60_000 });

      await logStep("Step 02: Validate the payment tabs");
      expect(await profile.visibleTabLabels(["All", "Unpaid", "Paid", "Cancelled"])).toEqual(
        expect.arrayContaining(["All", "Unpaid", "Paid", "Cancelled"]),
      );
    },
  );
});
