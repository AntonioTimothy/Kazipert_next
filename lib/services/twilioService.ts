import { env } from '@/lib/env';

export interface WhatsAppSendOptions {
    to: string;
    contentVariables: Record<string, string>;
}

export interface WhatsAppResponse {
    success: boolean;
    messageId?: string;
    error?: string;
}

export class TwilioService {
    private accountSid: string;
    private authToken: string;
    private fromNumber: string;
    private toNumber: string;
    private contentSid: string;
    private baseUrl: string;

    constructor() {
        this.accountSid = env.TWILIO_ACCOUNT_SID;
        this.authToken = env.TWILIO_AUTH_TOKEN;
        this.fromNumber = env.TWILIO_WHATSAPP_FROM;
        this.toNumber = env.TWILIO_WHATSAPP_TO;
        this.contentSid = env.TWILIO_CONTENT_SID;
        this.baseUrl = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}`;
    }

    async sendWhatsAppOtp(otp: string): Promise<WhatsAppResponse> {
        try {
            console.log('Sending WhatsApp OTP via Twilio to:', this.toNumber);

            const contentVariables = {
                "1": otp // Dynamic OTP value
            };

            const formData = new URLSearchParams();
            formData.append('To', this.toNumber);
            formData.append('From', this.fromNumber);
            formData.append('ContentSid', this.contentSid);
            formData.append('ContentVariables', JSON.stringify(contentVariables));

            const url = `${this.baseUrl}/Messages.json`;

            console.log('Twilio API Request:', {
                to: this.toNumber,
                from: this.fromNumber,
                contentSid: this.contentSid,
                contentVariables
            });

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64'),
                },
                body: formData.toString(),
            });

            console.log('Twilio API Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Twilio API error response:', errorText);
                throw new Error(`Twilio API error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('Twilio API success response:', data);

            return {
                success: true,
                messageId: data.sid,
            };
        } catch (error: any) {
            console.error('Twilio WhatsApp sending error:', error);
            return {
                success: false,
                error: error.message || 'Failed to send WhatsApp message',
            };
        }
    }

    // Alternative method using direct message (without template)
    async sendDirectWhatsAppOtp(otp: string): Promise<WhatsAppResponse> {
        try {
            console.log('Sending direct WhatsApp OTP via Twilio to:', this.toNumber);

            const message = `Your Kazipert verification code is: ${otp}. This code expires in 10 minutes.`;

            const formData = new URLSearchParams();
            formData.append('To', this.toNumber);
            formData.append('From', this.fromNumber);
            formData.append('Body', message);

            const url = `${this.baseUrl}/Messages.json`;

            console.log('Twilio Direct API Request:', {
                to: this.toNumber,
                from: this.fromNumber,
                message: message
            });

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64'),
                },
                body: formData.toString(),
            });

            console.log('Twilio Direct API Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Twilio Direct API error response:', errorText);
                throw new Error(`Twilio Direct API error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('Twilio Direct API success response:', data);

            return {
                success: true,
                messageId: data.sid,
            };
        } catch (error: any) {
            console.error('Twilio Direct WhatsApp sending error:', error);
            return {
                success: false,
                error: error.message || 'Failed to send WhatsApp message',
            };
        }
    }

    // Verify Twilio credentials
    async verifyCredentials(): Promise<{ valid: boolean; error?: string }> {
        try {
            const url = `${this.baseUrl}/Balance.json`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64'),
                },
            });

            if (response.ok) {
                return { valid: true };
            } else {
                return {
                    valid: false,
                    error: `Twilio API returned ${response.status}`
                };
            }
        } catch (error: any) {
            return {
                valid: false,
                error: error.message
            };
        }
    }
}

export const twilioService = new TwilioService();