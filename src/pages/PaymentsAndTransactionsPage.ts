import { expect, type Page, type Response } from '@playwright/test';
import { access, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { PaymentsAndTransactionsObjects } from '@objects/PaymentsAndTransactionsObjects';

export class PaymentsAndTransactionsPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async clickPaymentHistoryLink(): Promise<void> {
        const paymentHistoryLink = this.page.locator(
            PaymentsAndTransactionsObjects.paymentHistoryLink.xpath
        );
        await expect(paymentHistoryLink).toBeVisible();
        await paymentHistoryLink.click();
    }

    async clearDownloadsFolder(downloadDirectory: string): Promise<void> {
        await mkdir(downloadDirectory, { recursive: true });
        const existingEntries = await readdir(downloadDirectory);
        await Promise.all(existingEntries.map(entry =>
            rm(`${downloadDirectory}/${entry}`, { recursive: true, force: true })
        ));
        expect(await readdir(downloadDirectory)).toHaveLength(0);
    }

    waitForPdfResponse(): Promise<Response> {
        return this.page.waitForResponse(response => {
            const contentType = response.headers()['content-type'] ?? '';
            return response.ok() && contentType.toLowerCase().includes('application/pdf');
        });
    }

    async clickInvoicePreviewButton(): Promise<void> {
        const invoicePreviewButton = this.page.locator(
            PaymentsAndTransactionsObjects.invoicePreviewButton.xpath
        );
        await expect(invoicePreviewButton).toBeVisible();
        await invoicePreviewButton.click();
    }

    async savePdfResponse(response: Response, filePath: string): Promise<void> {
        const pdfContents = await response.body();
        expect(pdfContents.subarray(0, 4).toString()).toBe('%PDF');
        await writeFile(filePath, pdfContents);
    }

    async verifySavedFile(filePath: string, downloadDirectory: string): Promise<void> {
        await access(filePath);
        const fileName = filePath.split(/[\\/]/).pop();
        expect(await readdir(downloadDirectory)).toContain(fileName);
    }
}