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
  debugOtp?: string;
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

  async sendPasswordResetOtpEmail(email: string, otp: string): Promise<EmailResponse> {
    const subject = 'Reset Your Kazipert Password';
    const html = this.generatePasswordResetOtpEmailHtml(otp);
    const text = `Your Kazipert password reset code is: ${otp}. This code expires in 10 minutes.`;

    const result = await this.sendEmail({
      to: email,
      subject,
      html,
      text,
    });

    // Include debug OTP in development
    if (process.env.NODE_ENV === 'development') {
      return {
        ...result,
        debugOtp: otp
      };
    }

    return result;
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
            <td style="padding:22px 28px; text-align:left; background: linear-gradient(90deg,#FFD700,#FFA500);">
              <div style="font-family:Inter, Arial, sans-serif; font-weight:700; font-size:20px; color:#1a202c;">
                Kazipert
              </div>
            </td>
          </tr>

          <tr>
            <td class="hero" style="padding:34px 28px 18px; text-align:center;">
              <div style="font-family:Inter, Arial, sans-serif; color:#1a202c; font-size:20px; font-weight:700; margin-bottom:8px;">
                Your verification code
              </div>
              <div style="font-family:Inter, Arial, sans-serif; color:#4a5568; font-size:14px; line-height:1.4; margin-bottom:20px;">
                Use the 4-digit code below to verify your account. This code will expire in <strong>10 minutes</strong>.
              </div>

              <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 22px;">
                <tr>
                  <td style="background:#fefce8; border:2px solid #fef08a; border-radius:10px; padding:18px 26px;">
                    <div class="otp" style="font-family: 'Courier New', Courier, monospace; font-size:36px; letter-spacing:8px; color:#ca8a04; font-weight:700;">
                      ${otp}
                    </div>
                  </td>
                </tr>
              </table>

              <a href="https://kazipert.com" class="btn" style="text-decoration:none; display:inline-block; font-family:Inter, Arial, sans-serif; padding:12px 20px; border-radius:8px; background:linear-gradient(90deg,#FFD700,#FFA500); color:#1a202c; font-weight:600;">
                Visit Kazipert
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 28px 22px;">
              <div style="font-family:Inter, Arial, sans-serif; color:#718096; font-size:13px; line-height:1.5;">
                If you didn't request this code, you can safely ignore this email. For security reasons, do not share this code with anyone.
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 28px 18px;">
              <hr style="border:none; height:1px; background:#e2e8f0; margin:0;">
            </td>
          </tr>

          <tr>
            <td style="padding:14px 28px 28px; background-color:#f8fafc;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-family:Inter, Arial, sans-serif; color:#718096; font-size:12px;">
                    Kazipert • <a href="https://kazipert.com" style="color:#d97706; text-decoration:none;">kazipert.com</a><br>
                    © ${new Date().getFullYear()} Kazipert. All rights reserved.
                  </td>
                  <td align="right" style="font-family:Inter, Arial, sans-serif; color:#718096; font-size:12px;">
                    Need help? <a href="mailto:support@kazipert.com" style="color:#d97706; text-decoration:none;">support@kazipert.com</a>
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

  private generatePasswordResetOtpEmailHtml(otp: string): string {
    return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Kazipert — Reset Your Password</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 20px !important; }
      .hero { padding: 28px 18px !important; }
      .otp { font-size: 30px !important; letter-spacing: 6px !important; }
      .btn { width: 100% !important; display: block !important; }
      .security-note { padding: 15px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#fefce8;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#fefce8; padding:30px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" class="container" style="width:600px; max-width:600px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 25px rgba(251, 191, 36, 0.15); border:1px solid #fef08a;">
          
          <!-- Header with Kazipert branding -->
          <tr>
            <td style="padding:24px 32px; text-align:left; background: linear-gradient(135deg,#FFD700 0%,#FFA500 100%);">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <div style="font-family:Inter, Arial, sans-serif; font-weight:800; font-size:24px; color:#1a202c; letter-spacing:-0.5px;">
                      Kazipert
                    </div>
                  </td>
                  <td align="right">
                    <div style="font-family:Inter, Arial, sans-serif; font-weight:600; font-size:14px; color:#1a202c; background:rgba(255,255,255,0.2); padding:6px 12px; border-radius:20px;">
                      Security Code
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td class="hero" style="padding:40px 32px 24px; text-align:center; background:linear-gradient(180deg, #ffffff 0%, #fefce8 100%);">
              
              <!-- Icon -->
              <div style="width:80px; height:80px; background:linear-gradient(135deg,#fef08a,#fde047); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px;">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#1a202c" stroke-width="2"/>
                  <path d="M12 16V12" stroke="#1a202c" stroke-width="2" stroke-linecap="round"/>
                  <path d="M12 8H12.01" stroke="#1a202c" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>

              <!-- Title -->
              <div style="font-family:Inter, Arial, sans-serif; color:#1a202c; font-size:28px; font-weight:800; margin-bottom:12px; letter-spacing:-0.5px;">
                Reset Your Password
              </div>

              <!-- Description -->
              <div style="font-family:Inter, Arial, sans-serif; color:#4a5568; font-size:16px; line-height:1.6; margin-bottom:32px; max-width:480px; margin-left:auto; margin-right:auto;">
                Enter the verification code below to reset your Kazipert account password. This code will expire in <strong style="color:#d97706;">10 minutes</strong>.
              </div>

              <!-- OTP Code -->
              <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 32px;">
                <tr>
                  <td style="background:linear-gradient(135deg,#fefce8,#fef9c3); border:3px solid #fef08a; border-radius:16px; padding:24px 32px; box-shadow:0 4px 12px rgba(251, 191, 36, 0.2);">
                    <div class="otp" style="font-family: 'Courier New', Courier, monospace; font-size:42px; letter-spacing:12px; color:#ca8a04; font-weight:800; text-shadow:0 2px 4px rgba(251, 191, 36, 0.3);">
                      ${otp}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Action Button -->
              <a href="https://kazipert.com/login" class="btn" style="text-decoration:none; display:inline-block; font-family:Inter, Arial, sans-serif; padding:16px 32px; border-radius:12px; background:linear-gradient(135deg,#FFD700,#FFA500); color:#1a202c; font-weight:700; font-size:16px; box-shadow:0 4px 12px rgba(251, 191, 36, 0.4); transition:all 0.3s ease;">
                Reset Password Now
              </a>

            </td>
          </tr>

          <!-- Security Note -->
          <tr>
            <td class="security-note" style="padding:24px 32px; background:#fef9c3; border-top:1px solid #fef08a;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-family:Inter, Arial, sans-serif; color:#854d0e; font-size:14px; line-height:1.5;">
                    <strong>🔒 Security Notice:</strong> This code was requested for your account security. If you didn't request a password reset, please ignore this email and ensure your account is secure.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Additional Info -->
          <tr>
            <td style="padding: 24px 32px;">
              <div style="font-family:Inter, Arial, sans-serif; color:#718096; font-size:14px; line-height:1.6; text-align:center;">
                <strong>Having trouble?</strong> The code can be entered on the password reset page. Make sure to use it within 10 minutes.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0 32px 24px;">
              <hr style="border:none; height:1px; background:#e2e8f0; margin:0 0 24px 0;">
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-family:Inter, Arial, sans-serif; color:#a0aec0; font-size:12px; line-height:1.4;">
                    <strong>Kazipert</strong><br>
                    Your trusted partner for global employment opportunities<br>
                    <a href="https://kazipert.com" style="color:#d97706; text-decoration:none; font-weight:600;">kazipert.com</a>
                  </td>
                  <td align="right" style="font-family:Inter, Arial, sans-serif; color:#a0aec0; font-size:12px; line-height:1.4;">
                    <strong>Need help?</strong><br>
                    <a href="mailto:support@kazipert.com" style="color:#d97706; text-decoration:none;">support@kazipert.com</a><br>
                    <a href="https://kazipert.com/help" style="color:#d97706; text-decoration:none;">Help Center</a>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:16px; font-family:Inter, Arial, sans-serif; color:#cbd5e0; font-size:11px; text-align:center;">
                    © ${new Date().getFullYear()} Kazipert. All rights reserved. | Protecting your privacy and security
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