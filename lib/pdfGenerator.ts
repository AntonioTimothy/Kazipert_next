import puppeteer from 'puppeteer';

/**
 * Generates a PDF buffer from the provided HTML string.
 * @param html - Full HTML markup for the contract.
 * @returns Buffer containing the generated PDF.
 */
export async function generateContractPdf(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return pdfBuffer;
}
