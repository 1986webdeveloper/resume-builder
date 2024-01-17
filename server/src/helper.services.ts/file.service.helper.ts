import puppeteer, { PDFOptions } from "puppeteer";
import { HttpError } from "../common/error.service";
import fs from 'fs'
import { handlebars } from "hbs";

export const fileHelperService = new class {
    //#region  generate pdf

    async generatePDF(fileContent: string, fileName: any = null) {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage()
            await page.setContent(fileContent, { waitUntil: 'domcontentloaded', 'timeout': 10000 });
            const pdfOptions: PDFOptions = { format: 'A4' }
            if (fileName) { pdfOptions.path = "./upload/" + fileName }
            const pdfBuffer = await page.pdf(pdfOptions);
            // Close the browser
            await browser.close();
            if (pdfOptions.path)
                return {
                    url: process.env.BASE_URL + "upload/" + fileName
                }
            else
                return { fileContent: pdfBuffer.toString('base64') }
        } catch (error) {
            throw new HttpError("")

        }
    }
    //#endregion

    //#region register handlebars
    async makeDynamicHbsFile(filePath: string, data: any) {
        if (!filePath) throw new HttpError("File path not valid")
        const templateSource = fs.readFileSync(filePath, 'utf8');
        // Compile the template
        const template = handlebars.compile(templateSource);
        // Fill data into the template
        const html = template({ content: data });
        return html;
    }
    //#endregion

    //#region  create resume hbs formate
    async makeDynamicResumeObject(resumeData: any) {
        const filePath = "./files/resume/resume.1.hbs";
        const resumeObj: any = {}
        resumeData.forEach((resume: any) =>
            resumeObj[resume.slug] = resume.data
        )
        const resumeContent: any = await this.makeDynamicHbsFile(filePath, resumeObj)
        // fs.writeFileSync("resume.preview.html", resumeContent)
        return resumeContent

    }
    //#endregion
}
