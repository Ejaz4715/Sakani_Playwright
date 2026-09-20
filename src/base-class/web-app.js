const path = require("path");
const { LoginPage } = require(path.join(process.cwd(), "src", "Pages", "LoginPage"));
const { MarketplaceLandingPage } = require(
  path.join(process.cwd(), "src", "Pages", "MarketplaceLandingPage"),
);
const { ProjectDetailsPage } = require(
  path.join(process.cwd(), "src", "Pages", "ProjectDetailsPage"),
);
const { ProjectUnitsPage } = require(
  path.join(process.cwd(), "src", "Pages", "ProjectUnitsPage"),
);
const { UnitDetailsPage } = require(
  path.join(process.cwd(), "src", "Pages", "UnitDetailsPage"),
);
const { UnitBookingPage } = require(
  path.join(process.cwd(), "src", "Pages", "UnitBookingPage"),
);
const { PaymentGatewayPage } = require(
  path.join(process.cwd(), "src", "Pages", "PaymentGatewayPage"),
);
const { PaymentConfirmationPage } = require(
  path.join(process.cwd(), "src", "Pages", "PaymentConfirmationPage"),
);
const { BookingCancellationPage } = require(
  path.join(process.cwd(), "src", "Pages", "BookingCancellationPage"),
);
const { DeveloperProjectPage } = require(
  path.join(process.cwd(), "src", "Pages", "Developer", "DeveloperProjectPage"),
);
const { AuctionPage } = require(
  path.join(process.cwd(), "src", "Pages", "AuctionPage"),
);
const { AdminProjectPage } = require(
  path.join(process.cwd(), "src", "Pages", "AdminProjectPage"),
);
const { CreateMegaProjectPage } = require(
  path.join(process.cwd(), "src", "pages", "CreateMegaProjectPage"),
);

const { FlexiblePaymentPage } = require(
  path.join(process.cwd(), "src", "pages","Developer", "FlexiblePaymentPage"),
);

const { BookingAndSelectPaymentMethodPage } = require(
  path.join(process.cwd(), "src", "pages", "BookingAndSelectPaymentMethodPage"),
);
const { PaymentTrackingPage} = require(
  path.join(process.cwd(), "src", "pages", "PaymentTrackingPage"),
);


class WebApp {
constructor(page) {
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
    this.createMegaProjectPage = new CreateMegaProjectPage (page);
    this.flexiblePaymentPage = new FlexiblePaymentPage (page);
    this.bookingAndSelectPaymentMethodPage = new BookingAndSelectPaymentMethodPage (page);
    this.paymentTrackingPage = new PaymentTrackingPage (page);
  }
}

module.exports = { WebApp };
