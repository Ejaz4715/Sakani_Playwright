import {type Page } from "@playwright/test";
import { LoginPage } from '@pages/LoginPage';
import { MarketplaceLandingPage } from '@pages/MarketplaceLandingPage';
import { ProjectDetailsPage } from '@pages/ProjectDetailsPage';
import { ProjectUnitsPage } from '@pages/ProjectUnitsPage';
import { UnitDetailsPage } from '@pages/UnitDetailsPage';
import { UnitBookingPage } from '@pages/UnitBookingPage';
import { PaymentGatewayPage } from '@pages/PaymentGatewayPage';
import { BookingPage } from '@pages/BookingPage';
import { AdminProjectPage } from '@pages/AdminProjectPage';
import { DeveloperProjectPage } from '@pages/DeveloperProjectPage';
import { PaymentConfirmationPage } from '@pages/PaymentConfirmationPage';
import { AuctionPage } from '@pages/AuctionPage';
import { ElectronicAuctionProjectPage } from '@pages/ElectronicAuctionProjectPage';
import { CreateMegaProjectPage } from '@pages/CreateMegaProjectPage';
import { FlexiblePaymentPage } from '@pages/FlexiblePaymentPage';
import { BookingAndSelectPaymentMethodPage } from '@pages/BookingAndSelectPaymentMethodPage';
import { PaymentTrackingPage } from '@pages/PaymentTrackingPage';

export class WebApp {
  page: Page;
  loginPage: InstanceType<typeof LoginPage>;
  marketplaceLandingPage: InstanceType<typeof MarketplaceLandingPage>;
  projectDetailsPage: InstanceType<typeof ProjectDetailsPage>;
  projectUnitsPage: InstanceType<typeof ProjectUnitsPage>;
  unitDetailsPage: InstanceType<typeof UnitDetailsPage>;
  unitBookingPage: InstanceType<typeof UnitBookingPage>;
  paymentGatewayPage: InstanceType<typeof PaymentGatewayPage>;
  paymentConfirmationPage: InstanceType<typeof PaymentConfirmationPage>;
  bookingPage: InstanceType<typeof BookingPage>;
  developerProjectPage: InstanceType<typeof DeveloperProjectPage>;
  auctionPage: InstanceType<typeof AuctionPage>;
  electronicAuctionProjectPage: InstanceType<typeof ElectronicAuctionProjectPage>;
  adminProjectPage: InstanceType<typeof AdminProjectPage>;
  createMegaProjectPage: InstanceType<typeof CreateMegaProjectPage>;
  flexiblePaymentPage: InstanceType<typeof FlexiblePaymentPage>;
  bookingAndSelectPaymentMethodPage: InstanceType<typeof BookingAndSelectPaymentMethodPage>;
  paymentTrackingPage: InstanceType<typeof PaymentTrackingPage>;

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
    this.bookingPage = new BookingPage(page);
    this.developerProjectPage = new DeveloperProjectPage(page);
    this.auctionPage = new AuctionPage(page);
    this.electronicAuctionProjectPage = new ElectronicAuctionProjectPage(page);
    this.adminProjectPage = new AdminProjectPage(page);
    this.createMegaProjectPage = new CreateMegaProjectPage (page);
    this.flexiblePaymentPage = new FlexiblePaymentPage (page);
    this.bookingAndSelectPaymentMethodPage = new BookingAndSelectPaymentMethodPage (page);
    this.paymentTrackingPage = new PaymentTrackingPage (page);
  }
}
