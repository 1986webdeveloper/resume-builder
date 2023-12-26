import puppeteer, { PDFOptions } from "puppeteer";
import { HttpError } from "../common/error.service";

export const fileHelperService = new class {
    //#region  generate pdf

    async generatePDF(fileContent: string, fileName: any = null) {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage()
            await page.setContent(fileContent, { waitUntil: 'domcontentloaded', 'timeout': 10000 });
            const pdfOptions: PDFOptions = { format: 'A4' }
            if (fileName) pdfOptions.path = fileName
            const pdfBuffer = await page.pdf(pdfOptions);
            // Close the browser
            await browser.close();
            return pdfBuffer.toString('base64')
        } catch (error) {
            throw new HttpError("")

        }
    }
}
