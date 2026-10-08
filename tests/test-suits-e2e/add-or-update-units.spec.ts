import { test, expect } from '@playwright/test';
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
import { WebApp } from "@base-class/web-app";
import { DataHelper } from '@helpers/DataHelper'
import { logStep } from '@helpers/LogSteps'
import testData from '@data/test-data.json'

test.describe("Add or update units from partners", () => {
    test("TC-01 Add new electronic auction project", { annotation: [{ product: 'Marketplace', type: 'non-critical' }] as any }, async ({ page }) => {

    });

});
