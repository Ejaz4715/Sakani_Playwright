import { expect, Page } from "@playwright/test";
import ExcelJS from "exceljs";
import { UpdateUnitsObjects } from "@objects/UpdateUnitsObjects";

export class UpdateUnitsPage {
  constructor(private readonly page: Page) {}

  async clickUnitDetailsTab()  {
    await this.page.getByRole(UpdateUnitsObjects.unitDetailsTab.role, {
      name: UpdateUnitsObjects.unitDetailsTab.name,
    }).click();
  }

  async selectUnitCodeSearchCriteria(){
    await this.page
      .locator(UpdateUnitsObjects.unitSearchCriteria).click();
    await this.page
      .getByRole(UpdateUnitsObjects.optionsList.role, {
        name: UpdateUnitsObjects.optionsList.name,
      })
      .getByText(UpdateUnitsObjects.unitCodeOption.text)
      .click();
  }

  async fillUnitCode(unitCode: string)  {
    await this.page.getByRole(UpdateUnitsObjects.unitCodeInput.role).fill(unitCode);
  }

  async clickSearchButton()  {
    await this.page.getByRole(UpdateUnitsObjects.searchButton.role, {
      name: UpdateUnitsObjects.searchButton.name,
    }).click();
  }

  async getUnitStatus() {
    const statusCell = this.page
      .locator(UpdateUnitsObjects.unitRows)
      .first()
      .locator("datatable-body-cell")
      .nth(4);
    await expect(statusCell).toBeVisible();
    return (await statusCell.innerText()).trim();
  }

  async clickUpdateUnitStatusLink()  {
    await this.page.getByRole(UpdateUnitsObjects.updateUnitStatusLink.role, {
      name: UpdateUnitsObjects.updateUnitStatusLink.name,
    }).click();
  }

  async clickPilotLaunchButton()  {
    await this.page.getByRole(UpdateUnitsObjects.pilotLaunchButton.role, {
      name: UpdateUnitsObjects.pilotLaunchButton.name,
    }).click();
  }

  async updateWorkbookStatus(
    workbookPath: string,
    unitStatus: string,
    projectCode: string,
    productCode: string,
  ): Promise<"active" | "inactive"> {
    return this.updateNewUnitStatus(workbookPath, unitStatus, projectCode, productCode);
  }

  async uploadWorkbook(workbookPath: string)  {
    await this.page.locator(UpdateUnitsObjects.uploadInput).setInputFiles(workbookPath);
  }

  async verifyUploadedFile(fileName: string)  {
    await expect(
      this.page.getByText(fileName, { exact: true }),
    ).toBeVisible({ timeout: 12000 });
  }

  async clickAnalyzeFileButton()  {
    await this.page.getByRole(UpdateUnitsObjects.analyzeFileButton.role, {
      name: UpdateUnitsObjects.analyzeFileButton.name,
    }).click();
  }

  async clickFirstAnalysisResult()  {
    this.page.waitForTimeout(3000);
    await this.page.locator(UpdateUnitsObjects.firstAnalysisResult).click();
  }

  async clickApproveButton()  {
    await this.page.getByRole(UpdateUnitsObjects.approveButton.role, {
      name: UpdateUnitsObjects.approveButton.name,
    }).click();
  }

  async clickConfirmationDialog()  {
    await this.page.getByRole(UpdateUnitsObjects.confirmationDialog.role).click();
  }

  async verifyApprovalSuccessMessage()  {
    await expect(
      this.page.getByText(UpdateUnitsObjects.approvalSuccessMessage),
    ).toBeVisible({ timeout: 12000 });
  }

  async clickSuccessCheckmark()  {
    await this.page.locator(UpdateUnitsObjects.successCheckmark).click();
  }

  async clickConfirmYesButton()  {
    await this.page.getByRole(UpdateUnitsObjects.confirmYesButton.role, {
      name: UpdateUnitsObjects.confirmYesButton.name,
    }).click();
  }

  async expectUnitStatus(expectedStatus: string)  {
    await expect(this.page.locator(UpdateUnitsObjects.unitRows).first()
      .locator("datatable-body-cell").nth(4)).toHaveText(expectedStatus);
  }

  async vrifyTheUnitStatusIsBooked(expectedStatus: string) {
    await expect(this.page.locator(UpdateUnitsObjects.unitRows).first()
      .locator("datatable-body-cell").nth(5)).toHaveText(expectedStatus);
  }


  async verifyTheUpdateIsRejected() {
    const errorMessage = this.page.locator(UpdateUnitsObjects.UpdaterejectedMessage);
    await expect(errorMessage, "The message is not available");
  }

  async updateNewUnitStatus(
    workbookPath: string,
    unitStatus: string,
    projectCode: string,
    productCode: string,
  ): Promise<"active" | "inactive"> {
    const status = unitStatus.trim().toLowerCase();
    const normalizedStatus =
      status === "غير نشط" ? "inactive" : status === "نشط" ? "active" : status;

    if (normalizedStatus !== "active" && normalizedStatus !== "inactive") {
      throw new Error(`Cannot update unit status to unsupported value: "${unitStatus}"`);
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(workbookPath);
    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error(`No worksheets found in workbook: ${workbookPath}`);
    }

    const headerRow = worksheet.getRow(1);
    const columns: Record<string, number> = {};
    for (let column = 1; column <= headerRow.cellCount; column++) {
      const header = String(headerRow.getCell(column).value ?? "").trim();
      if (["Project Code", "Product Code", "New Unit Status"].includes(header)) {
        columns[header] = column;
      }
    }

    for (const header of ["Project Code", "Product Code", "New Unit Status"]) {
      if (!columns[header]) {
        throw new Error(`Column "${header}" was not found in worksheet "${worksheet.name}"`);
      }
    }

    let updatedRows = 0;
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === headerRow.number) return;
      let hasData = false;
      row.eachCell({ includeEmpty: false }, (cell) => {
        const value = cell.value;
        if (value !== undefined && value !== null && String(value).trim() !== "") {
          hasData = true;
        }
      });

      if (!hasData) return;

      row.getCell(columns["Project Code"]).value = projectCode;
      row.getCell(columns["Product Code"]).value = productCode;
      row.getCell(columns["New Unit Status"]).value = normalizedStatus;
      updatedRows++;
    });

    if (updatedRows === 0) {
      throw new Error(`No data rows found in worksheet "${worksheet.name}"`);
    }

    for (let rowNumber = 1; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.style = {};
      });
      const rowModel = row.model;
      if (rowModel) {
        row.model = { ...rowModel, style: {} };
      }
    }
    for (let columnNumber = 1; columnNumber <= worksheet.columnCount; columnNumber++) {
      worksheet.getColumn(columnNumber).style = {};
    }

    await workbook.xlsx.writeFile(workbookPath);
    return normalizedStatus;
  }
}