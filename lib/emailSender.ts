import nodemailer from 'nodemailer';
import type { SentMessageInfo } from 'nodemailer';

// For development we use Ethereal. Replace with real SMTP in production.
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.ETHEREAL_USER || 'your_ethereal_user',
        pass: process.env.ETHEREAL_PASS || 'your_ethereal_pass',
    },
});

/**
 * Sends an email with the contract PDF attached.
 * @param to - Recipient email address.
 * @param subject - Email subject.
 * @param text - Plain‑text body.
 * @param pdfBuffer - Buffer containing the generated PDF.
 */
export async function sendContractEmail(
    to: string,
    subject: string,
    text: string,
    pdfBuffer: Buffer
): Promise<SentMessageInfo> {
    const mailOptions = {
        from: 'no-reply@kazipert.com',
        to,
        subject,
        text,
        attachments: [
            {
                filename: 'contract.pdf',
                content: pdfBuffer,
                contentType: 'application/pdf',
            },
        ],
    };

    return transporter.sendMail(mailOptions);
}
