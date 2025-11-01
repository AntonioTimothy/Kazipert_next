import { env } from '@/lib/env';

export interface SmsSendOptions {
    to: string;
    message: string;
}

export interface SmsResponse {
    success: boolean;
    messageId?: string;
    error?: string;
    debugOtp?: string;
    provider?: 'africastalking' | 'twilio' | 'development';
}

export class SmsService {
    private africastalkingApiKey: string;
    private africastalkingUsername: string;
    private africastalkingSenderId: string;
    private twilioAccountSid: string;
    private twilioAuthToken: string;
    private twilioSenderId: string;

    // Country codes
    private readonly KENYA_PREFIX = '+254';
    private readonly OMAN_PREFIX = '+968';

    // Approved sandbox test numbers for Africa's Talking
    private readonly SANDBOX_NUMBERS = [
        '+254711082000', '+254711082001', '+254711082002', '+254711082003', '+254711082004',
        '+254711082005', '+254711082006', '+254711082007', '+254711082008', '+254711082009'
    ];

    constructor() {
        this.africastalkingApiKey = env.AFRICASTALKING_API_KEY;
        this.africastalkingUsername = env.AFRICASTALKING_USERNAME;
        this.africastalkingSenderId = env.AFRICASTALKING_SENDER_ID;
        this.twilioAccountSid = env.TWILIO_ACCOUNT_SID;
        this.twilioAuthToken = env.TWILIO_AUTH_TOKEN;
        this.twilioSenderId = 'Martstec';

        console.log('📱 SMS Service initialized:', {
            africastalking: this.africastalkingUsername ? 'Configured' : 'Missing',
            twilio: this.twilioAccountSid ? 'Configured' : 'Missing'
        });
    }

    async sendSms(options: SmsSendOptions): Promise<SmsResponse> {
        try {
            const normalizedNumber = this.normalizePhoneNumber(options.to);
            const country = this.detectCountry(normalizedNumber);

            console.log('🌍 SMS Routing Decision:', {
                original: options.to,
                normalized: normalizedNumber,
                country: country
            });

            // Route based on country
            if (country === 'oman') {
                console.log('🟢 Routing to Twilio for Oman number');
                return await this.sendViaTwilio(normalizedNumber, options.message);
            } else if (country === 'kenya') {
                console.log('🟠 Routing to Africa\'s Talking for Kenya number');
                return await this.sendViaAfricaTalking(normalizedNumber, options.message);
            } else {
                console.log('🔴 Unsupported country - using development fallback');
                return this.developmentFallback(options.message, `Unsupported country for number: ${normalizedNumber}`);
            }

        } catch (error: any) {
            console.error('💥 SMS sending error:', error);
            return this.developmentFallback(options.message, error.message);
        }
    }

    private async sendViaAfricaTalking(phone: string, message: string): Promise<SmsResponse> {
        try {
            console.log('Sending SMS via Africa\'s Talking to:', phone);

            // Check if we're in sandbox mode
            const isSandbox = this.africastalkingUsername === 'sandbox';

            if (isSandbox && !this.isApprovedSandboxNumber(phone)) {
                return this.developmentFallback(
                    message,
                    `Phone number not approved for sandbox. Use: ${this.SANDBOX_NUMBERS.slice(0, 3).join(', ')}`
                );
            }

            const baseUrl = isSandbox
                ? 'https://api.sandbox.africastalking.com/version1'
                : 'https://api.africastalking.com/version1';

            const formData = new URLSearchParams();
            formData.append('username', this.africastalkingUsername);
            formData.append('to', phone);
            formData.append('message', message);

            // Only include from if we have a valid sender ID
            if (this.africastalkingSenderId && this.africastalkingSenderId.trim() !== '') {
                formData.append('from', this.africastalkingSenderId);
            }

            const url = `${baseUrl}/messaging`;

            console.log('Africa\'s Talking API Request:', {
                url,
                to: phone,
                senderId: this.africastalkingSenderId
            });

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'apiKey': this.africastalkingApiKey,
                },
                body: formData.toString(),
            });

            console.log('Africa\'s Talking API Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Africa\'s Talking API error response:', errorText);
                throw new Error(`Africa's Talking error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('Africa\'s Talking API success response:', data);

            // Africa's Talking response structure
            if (data.SMSMessageData && data.SMSMessageData.Recipients) {
                const recipient = data.SMSMessageData.Recipients[0];
                if (recipient.status === 'Success') {
                    console.log('✅ Africa\'s Talking SMS sent successfully to Kenya');
                    return {
                        success: true,
                        messageId: recipient.messageId,
                        provider: 'africastalking'
                    };
                } else {
                    throw new Error(`SMS failed: ${recipient.status} - ${recipient.message}`);
                }
            }

            throw new Error('Invalid response from Africa\'s Talking API');
        } catch (error: any) {
            console.error('Africa\'s Talking error:', error);
            return this.developmentFallback(message, `Africa's Talking: ${error.message}`);
        }
    }

    private async sendViaTwilio(phone: string, message: string): Promise<SmsResponse> {
        try {
            console.log('🚀 Sending SMS via Twilio to:', phone);

            // Use HTTPS request directly (as in your test)
            const https = require("https");
            const querystring = require("querystring");

            const postData = querystring.stringify({
                From: this.twilioSenderId,
                To: phone,
                Body: message
            });

            const options = {
                hostname: "api.twilio.com",
                port: 443,
                path: `/2010-04-01/Accounts/${this.twilioAccountSid}/Messages.json`,
                method: "POST",
                auth: `${this.twilioAccountSid}:${this.twilioAuthToken}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Content-Length": Buffer.byteLength(postData),
                },
            };

            return new Promise((resolve, reject) => {
                const req = https.request(options, (res: any) => {
                    let data = "";
                    res.on("data", (chunk: string) => (data += chunk));
                    res.on("end", () => {
                        console.log("Twilio Response Status:", res.statusCode);

                        if (res.statusCode === 201) {
                            const responseData = JSON.parse(data);
                            console.log('✅ Twilio SMS sent successfully to Oman');
                            resolve({
                                success: true,
                                messageId: responseData.sid,
                                provider: 'twilio'
                            });
                        } else {
                            const errorData = JSON.parse(data);
                            console.error('❌ Twilio API error response:', errorData);
                            reject(new Error(`Twilio error: ${errorData.message || 'Unknown error'}`));
                        }
                    });
                });

                req.on("error", (e: any) => {
                    console.error("❌ Twilio request error:", e.message);
                    reject(e);
                });

                req.write(postData);
                req.end();
            });

        } catch (error: any) {
            console.error('❌ Twilio SMS error:', error);

            // Handle specific Twilio error codes
            let errorMessage = 'Failed to send SMS via Twilio';

            if (error.message.includes('21408')) {
                errorMessage = 'Sender ID not approved for destination country';
            } else if (error.message.includes('21211')) {
                errorMessage = 'Invalid phone number format';
            } else if (error.message.includes('21608')) {
                errorMessage = 'SMS not enabled for this region';
            }

            return {
                success: false,
                error: errorMessage,
                provider: 'twilio'
            };
        }
    }

    async sendOtp(phoneNumber: string, otp: string): Promise<SmsResponse> {
        const message = `Your Kazipert verification code is: ${otp}. This code expires in 10 minutes.`;

        return this.sendSms({
            to: phoneNumber,
            message: message,
        });
    }

    private normalizePhoneNumber(phone: string): string {
        // Remove any non-digit characters except +
        let normalized = phone.replace(/[^\d+]/g, '');

        // Ensure it starts with + for E.164 format
        if (!normalized.startsWith('+')) {
            // If it starts with 0, replace with +254
            if (normalized.startsWith('0')) {
                normalized = '+254' + normalized.substring(1);
            }
            // If it starts with country code without +
            else if (normalized.startsWith('254')) {
                normalized = '+' + normalized;
            }
            // If it starts with Oman code without +
            else if (normalized.startsWith('968')) {
                normalized = '+' + normalized;
            }
            // Default to Kenya with +
            else {
                normalized = '+254' + normalized;
            }
        }

        // Final cleanup
        normalized = normalized.replace(/\s/g, '');

        console.log('📞 Normalized phone number:', { original: phone, normalized });
        return normalized;
    }

    private detectCountry(phone: string): 'kenya' | 'oman' | 'other' {
        if (phone.startsWith(this.KENYA_PREFIX)) {
            return 'kenya';
        } else if (phone.startsWith(this.OMAN_PREFIX)) {
            return 'oman';
        } else {
            return 'other';
        }
    }

    private isApprovedSandboxNumber(phone: string): boolean {
        return this.SANDBOX_NUMBERS.includes(phone);
    }

    private developmentFallback(message: string, error: string): SmsResponse {
        // Always return success in development with debug OTP
        if (process.env.NODE_ENV === 'development') {
            const otp = this.extractOtpFromMessage(message);
            console.log(`🔧 DEVELOPMENT MODE - OTP: ${otp}`);
            console.log(`🔧 Actual SMS failed: ${error}`);
            return {
                success: true,
                messageId: `DEV_${Date.now()}`,
                debugOtp: otp,
                provider: 'development'
            };
        }

        // In production, return actual error
        return {
            success: false,
            error: error,
        };
    }

    private extractOtpFromMessage(message: string): string {
        const otpMatch = message.match(/\b\d{4,6}\b/);
        return otpMatch ? otpMatch[0] : '123456';
    }

    // Utility methods
    getSandboxTestNumbers(): string[] {
        return this.SANDBOX_NUMBERS;
    }

    validatePhoneNumber(phone: string): { isValid: boolean; normalized?: string; error?: string } {
        try {
            const normalized = this.normalizePhoneNumber(phone);
            const country = this.detectCountry(normalized);

            const isValid = country !== 'other';

            return {
                isValid,
                normalized: isValid ? normalized : undefined,
                error: isValid ? undefined : 'Unsupported country. Only Kenya (+254) and Oman (+968) numbers are supported.'
            };
        } catch (error) {
            return {
                isValid: false,
                error: 'Failed to validate phone number'
            };
        }
    }
}

export const smsService = new SmsService();