import { test, expect } from '@playwright/test';
const path = require("path");
import testData from '@data/test-data.json';
import { DataHelper } from '@helpers/DataHelper'

test.describe("MOH land full booking journey", () => {
  test("TC-0555", { annotation: [{ product: "Gov Support", type: "critical" }] as any }, async ({ page }) => {

    const data = testData.services['moh-land-booking-journey'];
    const environment = testData.environments;

    DataHelper.updateServiceData("moh-land-booking-journey","Name","qqqqqqqqq");

    const name = testData.services['moh-land-booking-journey'].Name;

    console.log("The name is ---------" + name)
  });


  test("TC-0666", { annotation: [{ product: "Gov Support", type: "critical" }] as any }, async ({ page }) => {
    const readServiceData = () => DataHelper.readData().services["moh-land-booking-journey"];
    const serviceData = readServiceData();
    const name = serviceData.Name;
    console.log("The name is ---------" + name)
  });
});
