import { Resend } from 'resend';
import { env } from '@/lib/env';

export interface EmailSendOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export interface EmailResponse {
    success: boolean;
    messageId?: string;
    error?: string;
}

export class EmailService {
    private resend: Resend;

    constructor() {
        this.resend = new Resend(env.RESEND_API_KEY);
    }

    async sendEmail(options: EmailSendOptions): Promise<EmailResponse> {
        try {
            console.log('Sending email to:', options.to);

            const result = await this.resend.emails.send({
                from: 'Kazipert <onboarding@kazipert.com>',
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
            });

            if (result.error) {
                throw new Error(result.error.message);
            }

            console.log('Email sent successfully:', result.data?.id);

            return {
                success: true,
                messageId: result.data?.id,
            };
        } catch (error: any) {
            console.error('Email sending error:', error);
            return {
                success: false,
                error: error.message || 'Failed to send email',
            };
        }
    }

    async sendOtpEmail(email: string, otp: string): Promise<EmailResponse> {
        const subject = 'Your Kazipert Verification Code';
        const html = this.generateOtpEmailHtml(otp);
        const text = `Your Kazipert verification code is: ${otp}. This code expires in 10 minutes.`;

        return this.sendEmail({
            to: email,
            subject,
            html,
            text,
        });
    }

    private generateOtpEmailHtml(otp: string): string {
        return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Kazipert — Your OTP</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 20px !important; }
      .hero { padding: 28px 18px !important; }
      .otp { font-size: 30px !important; letter-spacing: 6px !important; }
      .btn { width: 100% !important; display: block !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f6f8; padding:30px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" class="container" style="width:600px; max-width:600px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 18px rgba(25, 41, 73, 0.08);">
          
          <tr>
            <td style="padding:22px 28px; text-align:left; background: linear-gradient(90deg,#0ea5a4,#087f7d);">
              <div style="font-family:Inter, Arial, sans-serif; font-weight:700; font-size:20px; color:white;">
                Kazipert
              </div>
            </td>
          </tr>

          <tr>
            <td class="hero" style="padding:34px 28px 18px; text-align:center;">
              <div style="font-family:Inter, Arial, sans-serif; color:#102a43; font-size:20px; font-weight:700; margin-bottom:8px;">
                Your verification code
              </div>
              <div style="font-family:Inter, Arial, sans-serif; color:#425466; font-size:14px; line-height:1.4; margin-bottom:20px;">
                Use the 4-digit code below to verify your account. This code will expire in <strong>10 minutes</strong>.
              </div>

              <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 22px;">
                <tr>
                  <td style="background:#f7f9fb; border-radius:10px; padding:18px 26px;">
                    <div class="otp" style="font-family: 'Courier New', Courier, monospace; font-size:36px; letter-spacing:8px; color:#0b7285; font-weight:700;">
                      ${otp}
                    </div>
                  </td>
                </tr>
              </table>

              <a href="https://kazipert.com" class="btn" style="text-decoration:none; display:inline-block; font-family:Inter, Arial, sans-serif; padding:12px 20px; border-radius:8px; background:linear-gradient(90deg,#0ea5a4,#087f7d); color:white; font-weight:600;">
                Visit Kazipert
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 28px 22px;">
              <div style="font-family:Inter, Arial, sans-serif; color:#60708a; font-size:13px; line-height:1.5;">
                If you didn't request this code, you can safely ignore this email. For security reasons, do not share this code with anyone.
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 28px 18px;">
              <hr style="border:none; height:1px; background:#eef3f6; margin:0;">
            </td>
          </tr>

          <tr>
            <td style="padding:14px 28px 28px; background-color:#fbfdfe;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-family:Inter, Arial, sans-serif; color:#93a4b8; font-size:12px;">
                    Kazipert • <a href="https://kazipert.com" style="color:#0b7285; text-decoration:none;">kazipert.com</a><br>
                    © ${new Date().getFullYear()} Kazipert. All rights reserved.
                  </td>
                  <td align="right" style="font-family:Inter, Arial, sans-serif; color:#93a4b8; font-size:12px;">
                    Need help? <a href="mailto:support@kazipert.com" style="color:#0b7285; text-decoration:none;">support@kazipert.com</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
    }
}

export const emailService = new EmailService();