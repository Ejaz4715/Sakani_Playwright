import type { Page } from "@playwright/test";
const path = require("path");

const { LoginPage } = require(
  path.join(process.cwd(), "src", "pages", "LoginPage")
);
const { MarketplaceLandingPage } = require(
  path.join(process.cwd(), "src", "pages", "MarketplaceLandingPage"),
);
const { ProjectDetailsPage } = require(
  path.join(process.cwd(), "src", "pages", "ProjectDetailsPage"),
);
const { ProjectUnitsPage } = require(
  path.join(process.cwd(), "src", "pages", "ProjectUnitsPage"),
);
const { UnitDetailsPage } = require(
  path.join(process.cwd(), "src", "pages", "UnitDetailsPage"),
);
const { UnitBookingPage } = require(
  path.join(process.cwd(), "src", "pages", "UnitBookingPage"),
);
const { PaymentGatewayPage } = require(
  path.join(process.cwd(), "src", "pages", "PaymentGatewayPage"),
);
const { BookingCancellationPage } = require(
  path.join(process.cwd(), "src", "pages", "BookingCancellationPage"),
);
const { AuctionPage } = require(
  path.join(process.cwd(), "src", "pages", "AuctionPage"),
);
const { AdminProjectPage } = require(
  path.join(process.cwd(), "src", "pages", "AdminProjectPage"),
);
const { DeveloperProjectPage } = require(
  path.join(process.cwd(), "src", "pages", "DeveloperProjectPage"),
);
const { PaymentConfirmationPage } = require(
  path.join(process.cwd(), "src", "pages", "PaymentConfirmationPage"),
);

class WebApp {
  page: Page;
  loginPage: InstanceType<typeof LoginPage>;
  marketplaceLandingPage: InstanceType<typeof MarketplaceLandingPage>;
  projectDetailsPage: InstanceType<typeof ProjectDetailsPage>;
  projectUnitsPage: InstanceType<typeof ProjectUnitsPage>;
  unitDetailsPage: InstanceType<typeof UnitDetailsPage>;
  unitBookingPage: InstanceType<typeof UnitBookingPage>;
  paymentGatewayPage: InstanceType<typeof PaymentGatewayPage>;
  paymentConfirmationPage: InstanceType<typeof PaymentConfirmationPage>;
  bookingCancellationPage: InstanceType<typeof BookingCancellationPage>;
  developerProjectPage: InstanceType<typeof DeveloperProjectPage>;
  auctionPage: InstanceType<typeof AuctionPage>;
  adminProjectPage: InstanceType<typeof AdminProjectPage>;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.marketplaceLandingPage = new MarketplaceLandingPage(page);
    this.projectDetailsPage = new ProjectDetailsPage(page);
    this.projectUnitsPage = new ProjectUnitsPage(page);
    this.unitDetailsPage = new UnitDetailsPage(page);
    this.unitBookingPage = new UnitBookingPage(page);
    this.paymentGatewayPage = new PaymentGatewayPage(page);
    this.paymentConfirmationPage = new PaymentConfirmationPage(page);
    this.bookingCancellationPage = new BookingCancellationPage(page);
    this.developerProjectPage = new DeveloperProjectPage(page);
    this.auctionPage = new AuctionPage(page);
    this.adminProjectPage = new AdminProjectPage(page);
  }
}

module.exports = { WebApp };
