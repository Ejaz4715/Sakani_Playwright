import { expect, Page } from "@playwright/test";
import { ResaleOfUnitsObjects } from '@objects/ResaleOfUnitsObjects';
import { BookingCancellationObjects } from '@objects/BookingCancellationObjects';
import fs from "fs";
import path from "path";



export class ResaleOfUnitsPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    //Enter project name
    async fillProjectName(projectName: string) {
        const projectNameInputfield = this.page.locator(
            ResaleOfUnitsObjects.projectNameInputfield.xpath
        );
        await expect(projectNameInputfield).toBeVisible({ timeout: 90000 });
        await projectNameInputfield.fill(projectName);
    }

    //Click on search button
    async clickProjectSearchButton() {
        const projectSearchButton = this.page.getByRole(
            ResaleOfUnitsObjects.projectSearchButton.role, {
            name: ResaleOfUnitsObjects.projectSearchButton.name
        }
        );
        await expect(projectSearchButton).toBeVisible({ timeout: 90000 });
        await projectSearchButton.click();
    }

    //Click on the searched project result
    async clickSearchedProjectResult(projectName: string) {
        const searchedProjectResult = this.page.getByRole(
            ResaleOfUnitsObjects.searchedProjectResult.role, {
            name: projectName,
            exact: ResaleOfUnitsObjects.searchedProjectResult.exact
        }
        );
        await expect(searchedProjectResult).toBeVisible({ timeout: 90000 });
        await searchedProjectResult.click();
    }

    //Click on resale settings tab menu
    async clickOnResaleSettingTab() {
        const resaleSettingsTab = this.page.getByText(
            ResaleOfUnitsObjects.resaleSettingTab.text
        )
        await this.page.waitForTimeout(9000);
        await expect(resaleSettingsTab).toBeVisible({ timeout: 90000 });
        await resaleSettingsTab.click();
    }

    //Switch on use general resale settings
    async clickOnuseGeneralResaleSettingsSwitch() {
        const useGeneralResaleSettingsSwitch = this.page.getByRole(
            ResaleOfUnitsObjects.useGeneralResaleSettingsSwitch.role, {
            name: ResaleOfUnitsObjects.useGeneralResaleSettingsSwitch.name
        }
        );

        await expect(useGeneralResaleSettingsSwitch).toBeVisible({ timeout: 90000 });
        await useGeneralResaleSettingsSwitch.click();
    }

    //Select relase fee type - percentage
    async selectResaleFeeType() {
        const resaleFeeTypeDropdownList = this.page.locator(
            ResaleOfUnitsObjects.resaleFeeTypeDropdownList.xpath
        );
        const resaleFeeTypeOption = this.page.getByRole(
            ResaleOfUnitsObjects.resaleTypeOption.role, {
            name: ResaleOfUnitsObjects.resaleTypeOption.name
        }
        );
        await expect(resaleFeeTypeDropdownList).toBeVisible({ timeout: 90000 });
        await resaleFeeTypeDropdownList.click();

        await expect(resaleFeeTypeOption).toBeVisible({ timeout: 90000 });
        await resaleFeeTypeOption.click();

    }

    //Enter resale fee value
    async fillResaleFeeValue(value: number) {
        const resaleFeeValueInputfield = this.page.locator(
            ResaleOfUnitsObjects.resaleFeeValueInputfield.xpath
        );

        await expect(resaleFeeValueInputfield).toBeVisible({ timeout: 90000 });
        await resaleFeeValueInputfield.fill(String(value));
    }
    //Click on save button
    async clickOnSaveButton() {
        const saveButton = this.page.getByRole(
            ResaleOfUnitsObjects.saveButton.role, {
            name: ResaleOfUnitsObjects.saveButton.name
        }

        );
        await expect(saveButton).toBeVisible({ timeout: 90000 });
        await saveButton.click();
    }
    //Validate the exsitence of toast message
    async verifyTheToastMessage() {
        const toastMessage = this.page.getByText(
            ResaleOfUnitsObjects.toastMessage.text
        )
        await expect(toastMessage).toBeVisible({ timeout: 120000 });
    }

    //Validate the buyer is added by existence of the toast message
    async verifyBuyerAddedToastMessage() {
        const toastMessageBuyer = this.page.getByText(
            ResaleOfUnitsObjects.toastMessageBuyer.text
        );

        await expect(toastMessageBuyer).toBeVisible({ timeout: 120000 });
    }



    //Click on resale of units button

    async clickOnResaleOfUnitsButton() {
        const resaleOfUnitsButton = this.page.locator(
            ResaleOfUnitsObjects.resaleOfUnitsButton.xpath
        );

        await expect(resaleOfUnitsButton).toBeVisible({ timeout: 150000 });
        await resaleOfUnitsButton.click();
    }

    //Select assign to buyer radio button option 
    async clickOnAssignToBuyerOption() {
        const assignToBuyerOption = this.page.getByText(
            ResaleOfUnitsObjects.assignToBuyerOption.text
        );

        await expect(assignToBuyerOption).toBeVisible({ timeout: 90000 });
        await assignToBuyerOption.click();
    }
    //Select assign without buyer radio button option
    async clickOnAssignWithoutBuyerOption() {
        const assignWithoutBuyerOption = this.page.getByText(
            ResaleOfUnitsObjects.assignWithoutBuyerOption.text
        );

        await expect(assignWithoutBuyerOption).toBeVisible({ timeout: 90000 });
        await assignWithoutBuyerOption.click();
    }

    //Enter buyer id
    async fillBuyerIdInputfield(buyerId: string) {
        const buyerIdInputfield = this.page.locator(
            ResaleOfUnitsObjects.buyerIdInputfield.xpath
        );

        await expect(buyerIdInputfield).toBeVisible({ timeout: 90000 });
        await buyerIdInputfield.fill(buyerId);
    }


    //Enter buyer date of birth

    async fillBuyerDobInputfield(buyerDob: string) {
        const buyerDobInputfield = this.page.locator(
            ResaleOfUnitsObjects.buyerDobInputfield.xpath
        );

        await expect(buyerDobInputfield).toBeVisible({ timeout: 90000 });
        await buyerDobInputfield.fill(buyerDob);
    }

    //Select from calender - Hijri
    async selectBuyerDobFromHijriCalendar(buyerDob: string) {
        if (!/^\d{8}$/.test(buyerDob)) {
            throw new Error(
                `buyerDOB must use DDMMYYYY format, for example 08041414. Received: ${buyerDob}`
            );
        }

        const day = Number(buyerDob.slice(0, 2));
        const month = Number(buyerDob.slice(2, 4));
        const year = Number(buyerDob.slice(4, 8));
        const hijriMonths = [
            "محرم",
            "صفر",
            "ربيع الأول",
            "ربيع الآخر",
            "جمادى الأولى",
            "جمادى الآخرة",
            "رجب",
            "شعبان",
            "رمضان",
            "شوال",
            "ذو القعدة",
            "ذو الحجة",
        ];
        const monthName = hijriMonths[month - 1];

        if (!monthName) {
            throw new Error(`Hijri month must be between 1 and 12. Received: ${month}`);
        }

        const yearSelect = this.page.locator('select[title="Select year"]:visible');
        await expect(yearSelect).toBeVisible({ timeout: 90000 });
        await yearSelect.selectOption(String(year));

        const monthSelect = this.page.locator('select[title="Select month"]:visible');
        await expect(monthSelect).toBeVisible({ timeout: 90000 });
        await monthSelect.selectOption(String(month - 1));

        const dayCell = this.page.getByText(String(day), { exact: true }).last();
        await expect(dayCell).toBeVisible({ timeout: 90000 });
        await dayCell.click();
    }

    //Click on verify button

    async clickOnVerifyButton() {
        const verifyButton = this.page.locator(
            ResaleOfUnitsObjects.verifyButton.xpath

        );

        await expect(verifyButton).toBeVisible({ timeout: 90000 });
        await verifyButton.click();
    }

    //Click on next to financial button
    async clickOnNextToFinancialInfoButton() {
        const nextToFinancialInfoButton = this.page.getByRole(
            ResaleOfUnitsObjects.nextToFinancialInfoButton.role,
            { name: ResaleOfUnitsObjects.nextToFinancialInfoButton.name }
        );

        await expect(nextToFinancialInfoButton).toBeVisible({ timeout: 90000 });
        await nextToFinancialInfoButton.click();
    }

    //Select resale reason - financial reason
    async selectResaleReason() {
        const resaleReasonDropdownList = this.page.locator(
            ResaleOfUnitsObjects.resaleReasonDropdownList.xpath
        );
        const resaleReasonOption = this.page.getByRole(
            ResaleOfUnitsObjects.resalReasonOption.role,
            { name: ResaleOfUnitsObjects.resalReasonOption.name }
        );

        await expect(resaleReasonDropdownList).toBeVisible({ timeout: 90000 });
        await resaleReasonDropdownList.click();
        await expect(resaleReasonOption).toBeVisible({ timeout: 90000 });
        await resaleReasonOption.click();
    }

    //Enter resale reason deatails
    async fillResaleReasonDetails(details: string) {
        const resaleReasonDetailsTextarea = this.page.locator(
            ResaleOfUnitsObjects.resaleReasonDetailsTextarea.xpath
        );

        await expect(resaleReasonDetailsTextarea).toBeVisible({ timeout: 90000 });
        await resaleReasonDetailsTextarea.fill(details);
    }

    //Enter waiver amount
    async fillWaiverAmount(amount: number) {
        const waiverAmountInputfield = this.page.locator(
            ResaleOfUnitsObjects.waiverAmountInputfield.xpath
        );

        await expect(waiverAmountInputfield).toBeVisible({ timeout: 90000 });
        await waiverAmountInputfield.fill(String(amount));
    }

    //Select payment method - cash
    async selectPaymentMethod() {
        const paymentMethodDropdownList = this.page.locator(
            ResaleOfUnitsObjects.paymentMethodDropdownList.xpath
        );
        const paymentMethodOption = this.page.getByRole(
            ResaleOfUnitsObjects.paymentMethodOption.role,
            { name: ResaleOfUnitsObjects.paymentMethodOption.name }
        );

        await expect(paymentMethodDropdownList).toBeVisible({ timeout: 90000 });
        await paymentMethodDropdownList.click();
        await expect(paymentMethodOption).toBeVisible({ timeout: 90000 });
        await paymentMethodOption.click();
    }

    //Enter proce amount
    async fillPriceAmountInputfield(priceAmount: number) {
        const priceAmountInputfield = this.page.locator(
            ResaleOfUnitsObjects.priceAmountInpufield.xpath
        );

        await expect(priceAmountInputfield).toBeVisible({ timeout: 90000 });
        await priceAmountInputfield.fill(String(priceAmount));
    }

    //Enter price amount percentage
    async fillPriceAmountPercentageInputfield(priceAmountPercentage: number) {
        const priceAmountPercentageInputfield = this.page.locator(
            ResaleOfUnitsObjects.priceAmountPercentageInputfield.xpath
        );

        await expect(priceAmountPercentageInputfield).toBeVisible({ timeout: 90000 });
        await priceAmountPercentageInputfield.fill(String(priceAmountPercentage));
    }

    //Enter completion percengate
    async fillCompletionPercentageInputfield(completionPercentage: number) {
        const completionPercentageInputfield = this.page.locator(
            ResaleOfUnitsObjects.complectionPercentageInputfield.xpath
        );

        await expect(completionPercentageInputfield).toBeVisible({ timeout: 90000 });
        await completionPercentageInputfield.fill(String(completionPercentage));
    }
    //Select status - unpaid
    async selectStatus() {
        const statusDropdownList = this.page.locator(
            ResaleOfUnitsObjects.statusDropdownList.xpath
        );
        const statusOption = this.page.getByRole(
            ResaleOfUnitsObjects.statusOption.role,
            { name: ResaleOfUnitsObjects.statusOption.name }
        );

        await expect(statusDropdownList).toBeVisible({ timeout: 90000 });
        await statusDropdownList.click();
        await expect(statusOption).toBeVisible({ timeout: 90000 });
        await statusOption.click();
    }

    //Click on add installment button
    async clickOnAddInstallmentButton() {
        const addInstallmentButton = this.page.locator(
            ResaleOfUnitsObjects.addInstallmentButton.xpath
        );

        await expect(addInstallmentButton).toBeVisible({ timeout: 90000 });
        await addInstallmentButton.click();
    }

    //Check on disclamer waiver
    async clickOnDisclaimerWaiverCheckbox() {
        const disclaimerWaiverCheckbox = this.page.getByRole(
            ResaleOfUnitsObjects.desclaimerWaiverChecbox.role,
            { name: ResaleOfUnitsObjects.desclaimerWaiverChecbox.name }
        );

        await expect(disclaimerWaiverCheckbox).toBeVisible({ timeout: 90000 });
        await disclaimerWaiverCheckbox.click();
    }

    ///Click on submit button
    async clickOnSubmitButton() {
        const submitButton = this.page.getByRole(
            ResaleOfUnitsObjects.submitButton.role,
            { name: ResaleOfUnitsObjects.submitButton.name }
        );

        await expect(submitButton).toBeVisible({ timeout: 90000 });
        await submitButton.click();
    }

    //Get request/reference number and save it
    async getAndSaveRequestNumber(): Promise<string> {
        const requestNumberElement = this.page.locator(
            ResaleOfUnitsObjects.requestNumber.xpath
        );

        await expect(requestNumberElement).toBeVisible({ timeout: 90000 });
        const requestText = await requestNumberElement.innerText();
        const requestNumber = requestText.match(/#([\d-]+)/)?.[1];

        if (!requestNumber) {
            throw new Error(`Could not extract request number from: ${requestText}`);
        }

        const dataFilePath = path.resolve(
            process.cwd(),
            "src/data/payment-system-test-data.json"
        );
        const paymentSystemData = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
        paymentSystemData["resale-of-units"].requestNumber = requestNumber;
        fs.writeFileSync(
            dataFilePath,
            JSON.stringify(paymentSystemData, null, 2) + "\n",
            "utf8"
        );

        return requestNumber;
    }

    //Click on resale request side menu
    async clickOnResaleRequestSideMenu() {
        const resaleRequestSideMenu = this.page.getByRole(
            ResaleOfUnitsObjects.resaleRequestSideMenu.role,
            { name: ResaleOfUnitsObjects.resaleRequestSideMenu.name }
        );

        await expect(resaleRequestSideMenu).toBeVisible({ timeout: 90000 });
        await resaleRequestSideMenu.click();
    }

    //Select serch by - reference nubmer
    async selectSearchByReference() {
        const searchByDropdownList = this.page.locator(
            ResaleOfUnitsObjects.searchByDropdownList.xpath
        );
        const searchedByOption = this.page.getByRole(
            ResaleOfUnitsObjects.searchedByOption.role,
            { name: ResaleOfUnitsObjects.searchedByOption.name }
        );

        await expect(searchByDropdownList).toBeVisible({ timeout: 90000 });
        await searchByDropdownList.click();
        await expect(searchedByOption).toBeVisible({ timeout: 90000 });
        await searchedByOption.click();
    }

    //Enter request/reference number
    async fillRequestNumberInputfield(requestNumber: string) {
        const requestNumberInputfield = this.page.getByRole(
            ResaleOfUnitsObjects.requestNumberInputfield.role,
            { name: ResaleOfUnitsObjects.requestNumberInputfield.name }
        );

        await expect(requestNumberInputfield).toBeVisible({ timeout: 90000 });
        await requestNumberInputfield.fill(requestNumber);
    }

    //Click on view details button
    async clickOnViewDetailsButton() {
        const viewDetailsButton = this.page.getByRole(
            ResaleOfUnitsObjects.viewDetailsButton.role,
            { name: ResaleOfUnitsObjects.viewDetailsButton.name }
        );
        await this.page.waitForTimeout(5000);
        await expect(viewDetailsButton).toBeVisible({ timeout: 90000 });
        await viewDetailsButton.click();
    }

    //Click on approve button
    async clickOnApproveButton() {
        const approveButton = this.page.getByRole(
            ResaleOfUnitsObjects.approveButton.role,
            { name: ResaleOfUnitsObjects.approveButton.name }
        );

        await expect(approveButton).toBeVisible({ timeout: 90000 });
        await approveButton.click();
    }
    //Click on send button
    async clickOnSendButton() {
        const sendButton = this.page.getByRole(
            ResaleOfUnitsObjects.sendButton.role,
            { name: ResaleOfUnitsObjects.sendButton.name }
        );

        await expect(sendButton).toBeVisible({ timeout: 90000 });
        await sendButton.click();
    }
    //Validate the request is approved
    async verifyTheRequestisApproved() {
        const partnerApprovalToastMessage = this.page.locator(
            ResaleOfUnitsObjects.toastMessagePartener.xpath
        );

        await expect(partnerApprovalToastMessage).toBeVisible({ timeout: 120000 });
    }

    //Navigate to my booking > click on resale requests > select waition to sign contract tab option
    async openWaitingToSignContract() {

        const userProfileButton = this.page.locator(
            BookingCancellationObjects.userProfileButton,
        );
        await userProfileButton.click();

        const myBookingsLink = this.page.getByText(
            BookingCancellationObjects.myBookingsLink.text,
        );
        await myBookingsLink.click();
        const resaleRequestsButton = this.page.getByText(
            ResaleOfUnitsObjects.resaleRequestsButton.text
        );
        const buyingRequestSwitchTab = this.page.getByText(
            ResaleOfUnitsObjects.buyingRequestSwitchTab.text
        );
        const waitingtoSignContractTab = this.page.getByRole(
            ResaleOfUnitsObjects.waitingtoSignContractTab.role,
            { name: ResaleOfUnitsObjects.waitingtoSignContractTab.name }
        );

        await expect(resaleRequestsButton).toBeVisible({ timeout: 90000 });
        await resaleRequestsButton.click();
        await expect(buyingRequestSwitchTab).toBeVisible({ timeout: 90000 });
        await buyingRequestSwitchTab.click();
        await expect(waitingtoSignContractTab).toBeVisible({ timeout: 90000 });
        await waitingtoSignContractTab.click();
    }

    //Click on confirm booking button
    async clickOnConfirmBookingButton() {
        const confirmBookingButton = this.page.getByRole(
            ResaleOfUnitsObjects.confirmBookingButton.role,
            { name: ResaleOfUnitsObjects.confirmBookingButton.name }
        );

        await expect(confirmBookingButton).toBeVisible({ timeout: 90000 });
        await confirmBookingButton.click();
    }
    //Click on approve sale contract button

    async clickOnApproveSaleContractButton() {
        const approveSaleContractButton = this.page.getByRole(
            ResaleOfUnitsObjects.approveSaleContractButton.role,
            { name: ResaleOfUnitsObjects.approveSaleContractButton.name }
        );

        await expect(approveSaleContractButton).toBeVisible({ timeout: 90000 });
        await approveSaleContractButton.click();
    }
    //Click on view button
    async clickOnViewButton() {
        const viewButton = this.page.getByRole(
            ResaleOfUnitsObjects.viewButton.role,
            { name: ResaleOfUnitsObjects.viewButton.name }
        );

        await expect(viewButton).toBeVisible({ timeout: 90000 });
        await viewButton.click();
    }

    //Enter otp
    async enterOTP(otp = ["1", "2", "3", "4"]) {
        await this.page.waitForTimeout(12000);
        const otpInputs = this.page.getByRole("textbox");
        for (let index = 0; index < otp.length; index++) {
            await otpInputs.nth(index).fill(otp[index]);
        }
    }
    //Validate the waiver fees is paid
    async verifyWaiverFeesSuccessfullyPaidMessage() {
        const waiverFeesSuccessfullyPaidMessage = this.page.getByText(
            ResaleOfUnitsObjects.waiverFeesSuccessfullyPaidMessage.text
        );

        await expect(waiverFeesSuccessfullyPaidMessage).toBeVisible({ timeout: 120000 });
    }


    //Enter request/reference number - in admin

    async fillRequestNumberInputfieldAdmin(requestNumber: string) {
        const requestNumberInputfieldAdmin = this.page.locator(
            ResaleOfUnitsObjects.requestNumberInputfieldِAdmin.xpath
        );

        await expect(requestNumberInputfieldAdmin).toBeVisible({ timeout: 90000 });
        await requestNumberInputfieldAdmin.fill(requestNumber);
    }


    //Click on search button
    async clickOnSearchButton() {
        const searchButton = this.page.locator(
            ResaleOfUnitsObjects.searchButton.xpath
        );

        await expect(searchButton).toBeVisible({ timeout: 90000 });
        await searchButton.click();
    }

    //Select the searched result - in admin
    async clickOnSearchedResult() {
        const searchedResult = this.page.locator(
            ResaleOfUnitsObjects.searchedResult.xpath
        );
        await this.page.waitForTimeout(5000);
        await expect(searchedResult).toBeVisible({ timeout: 90000 });
        await searchedResult.click();
    }

    //Click on add buyer button - in admin
    async clickOnAddBuyerButton() {
        const addBuyerButton = this.page.getByRole(
            ResaleOfUnitsObjects.addBuyerButton.role,
            { name: ResaleOfUnitsObjects.addBuyerButton.name }
        );

        await expect(addBuyerButton).toBeVisible({ timeout: 90000 });
        await addBuyerButton.click();
    }


    //Enter buyer id - in admin

    async fillBuyerIDInputfield(buyerId: string) {
        const buyerIDInputfield = this.page.locator(
            ResaleOfUnitsObjects.buyerIDInputfield.xpath
        );

        await expect(buyerIDInputfield).toBeVisible({ timeout: 90000 });
        await buyerIDInputfield.fill(buyerId);
    }

    //Click on buyer date of birth button
    async clickOnBuyerDobInputButton() {
        const buyerDobInputfieldButton = this.page.locator(
            ResaleOfUnitsObjects.buyerDobInputfieldButton.xpath
        );

        await expect(buyerDobInputfieldButton).toBeVisible({ timeout: 90000 });
        await buyerDobInputfieldButton.click();
    }
    //Click on verify from buyer button
    async clickOnVerifyFromBuyerButton() {
        const verifyFromBuyerButton = this.page.locator(
            ResaleOfUnitsObjects.verifyFromBuyerButton.xpath
        );

        await expect(verifyFromBuyerButton).toBeVisible({ timeout: 90000 });
        await verifyFromBuyerButton.click();
    }
    //Select buyer source - seller option
    async selectBuyerSource() {
        const buyerSourceDropdownList = this.page.locator(
            ResaleOfUnitsObjects.buyerSourceDropdownList.xpath
        );
        const buyerSourceOption = this.page.getByRole(
            ResaleOfUnitsObjects.buyerSourceOption.role,
            { name: ResaleOfUnitsObjects.buyerSourceOption.name }
        );

        await expect(buyerSourceDropdownList).toBeVisible({ timeout: 90000 });
        await buyerSourceDropdownList.click();
        await expect(buyerSourceOption).toBeVisible({ timeout: 90000 });
        await buyerSourceOption.click();
    }

    //Click on save button
    async clickOnSaveBuyerButton() {
        const saveBuyerButton = this.page.locator(
            ResaleOfUnitsObjects.saveBuyerButton.xpath
        );

        await expect(saveBuyerButton).toBeVisible({ timeout: 90000 });
        await saveBuyerButton.click();
    }

}