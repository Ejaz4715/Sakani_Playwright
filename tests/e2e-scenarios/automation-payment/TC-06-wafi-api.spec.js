const { test, expect, request: apiRequest } = require('@playwright/test');
const path = require('path');
const fs = require('fs/promises');

test('Trigger Push Notification API using extracted test data', async () => {
  // 1. Read values from your test-data.json file
  const testDataPath = path.join(process.cwd(), "src", "data", "test-data.json");
  const rawData = await fs.readFile(testDataPath, 'utf-8');
  const testData = JSON.parse(rawData);

  const vibanNumber = testData.viban_number;
  const invoiceNumber = testData.invoice_number;

  expect(vibanNumber).toBeTruthy();
  expect(invoiceNumber).toBeTruthy();

  // 2. Create API context with 30-second timeout configuration
  const apiContext = await apiRequest.newContext({
    baseURL: 'https://nhcipay-invoicing-api.housingapps.sa',
    ignoreHTTPSErrors: true,
    timeout: 30000, // <--- Sets default request timeout to 30 seconds (30,000 ms)
  });

  const endpoint = '/api/v1.0/PaymentsManagmentController/push-notification';
  const dynamicRef = `REF-${Date.now()}`;

  const payload = {
    clientId: "BANKPRO",
    recordReference: `REC-${dynamicRef}`,
    schemeId: "",
    cdtDbtInd: "C",
    valueDate: new Date().toISOString(),
    paymentType: "CR",
    payChannel: "BANK",
    vaiban: vibanNumber,
    vabban: "",
    collectionAccIBAN: "",
    collectioAccBBAN: "",
    amount: "1000.0",
    currencyCode: "SAR",
    invoiceNumber: invoiceNumber,
    benficiaryAcctName: "",
    benficiaryAcct: "",
    transReference: `TRANS-${dynamicRef}`,
    orderingCustName: "Mohammed Ali",
    orderAccNo: "SA5555555555555555555555",
    orderBankRef: `BANK-${dynamicRef}`,
    benBankBic: "",
    orderBankBIC: "",
    channelReference: `CH-${dynamicRef}`,
    remitterId: "",
    status: "Collected",
    paymentRemarks: "New VIBAN payment",
    fxRate: "",
    netFee: "",
    netVATApplied: ""
  };

  console.log(`Sending Push Notification request for Invoice: ${invoiceNumber}...`);

  try {
    const response = await apiContext.post(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        'biller-code': 'wafi',
        'api-key': ''
      },
      data: payload,
      timeout: 30000 // <--- Explicit 30-second timeout on the post action
    });

    console.log(`Response Status: ${response.status()}`);
    expect(response.ok()).toBeTruthy();

    const responseBody = await response.json().catch(() => null);
    console.log('Response Payload:', responseBody);
  } finally {
    await apiContext.dispose();
  }
});