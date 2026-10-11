import type { Download, Page } from '@playwright/test';
import ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';

export class ExcelUtils {
    static waitForExcelDownload(page: Page): Promise<Download> {
        return page.waitForEvent('download');
    }

    static async saveExcelDownload(download: Download, filePath: string): Promise<void> {
        await download.saveAs(filePath);
    }

    /**
 * Searches for a row matching a search constraint and returns the target cell's value.
 */
    static getExcelCellValue(
        filePath: string,
        sheetName: string,
        searchColumn: string,
        searchValue: any,
        targetColumn: string
    ): string | null {
        const workbook = XLSX.readFile(filePath);
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
            throw new Error(`Sheet '${sheetName}' not found in the workbook.`);
        }

        const rows: any[] = XLSX.utils.sheet_to_json(worksheet);

        for (let row of rows) {
            if (row[searchColumn] === searchValue) {
                return String(row[targetColumn]); // Return the value of the target column
            }
        }

        console.log(`No matching row found for '${searchColumn}' = '${searchValue}'.`);
        return null;
    }

    /**
     * Reads an Excel file, searches for a row matching a search constraint in a specific column,
     * retrieves a value from another column in that row, updates it, and saves the file.
     * 
     * @param filePath Path to the Excel file
     * @param sheetName Name of the sheet to read
     * @param searchColumn The column name or index to search in (e.g., 'A' or 'Category')
     * @param searchValue The value to look for
     * @param targetColumn The column name or index whose value you want to retrieve and update
     * @param newValue The new value to set
     */
    static async updateExcelCell(
        filePath: string,
        sheetName: string,
        searchColumn: string,
        searchValue: any,
        updates: Record<string, any>
    ): Promise<void> {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(sheetName);
        if (!worksheet) {
            throw new Error(`Sheet '${sheetName}' not found in the workbook.`);
        }

        const headerRow = worksheet.getRow(1);
        const findColumnIndex = (columnName: string): number => {
            for (let columnIndex = 1; columnIndex <= worksheet.columnCount; columnIndex++) {
                if (headerRow.getCell(columnIndex).text.trim() === columnName) {
                    return columnIndex;
                }
            }

            throw new Error(`Column '${columnName}' not found in sheet '${sheetName}'.`);
        }

        const searchColumnIndex = findColumnIndex(searchColumn);
        const updateColumns = Object.entries(updates)
            .filter(([, value]) => value !== undefined && value !== null)
            .map(([columnName, value]) => ({
                columnIndex: findColumnIndex(columnName),
                value,
            }));

        let matchingRow: ExcelJS.Row | undefined;
        for (let rowIndex = 2; rowIndex <= worksheet.rowCount; rowIndex++) {
            const row = worksheet.getRow(rowIndex);
            if (row.getCell(searchColumnIndex).text.trim() === String(searchValue).trim()) {
                matchingRow = row;
                break;
            }
        }

        if (!matchingRow) {
            throw new Error(`No row found where '${searchColumn}' equals '${searchValue}'.`);
        }

        for (const { columnIndex, value } of updateColumns) {
            const parsedValue =
                typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))
                    ? Number(value)
                    : value;
            matchingRow.getCell(columnIndex).value = parsedValue;
        }

        for (let rowIndex = 1; rowIndex <= worksheet.rowCount; rowIndex++) {
            const row = worksheet.getRow(rowIndex);
            for (let columnIndex = 1; columnIndex <= worksheet.columnCount; columnIndex++) {
                row.getCell(columnIndex).style = {};
            }
        }
        for (let columnIndex = 1; columnIndex <= worksheet.columnCount; columnIndex++) {
            worksheet.getColumn(columnIndex).style = {};
        }

        await workbook.xlsx.writeFile(filePath);
    }

}
