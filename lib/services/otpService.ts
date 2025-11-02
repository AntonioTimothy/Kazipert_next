import { smsService } from './smsService';

export interface OtpResult {
    success: boolean;
    message?: string;
    error?: string;
    debugOtp?: string;
}

export class OtpService {
    private otpStore = new Map<string, { otp: string; expiresAt: number }>();

    async sendPhoneOtp(phoneNumber: string, otp: string): Promise<OtpResult> {
        try {
            console.log('📞 Sending phone OTP to:', phoneNumber);

            // Validate phone number
            const validation = smsService.validatePhoneNumber(phoneNumber);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: validation.error
                };
            }

            // Generate OTP
            // const otp = this.generateOtp();
            const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

            // Store OTP (in production, use a proper database)
            this.otpStore.set(phoneNumber, { otp, expiresAt });

            // Send SMS
            const smsResult = await smsService.sendOtp(phoneNumber, otp);

            if (!smsResult.success) {
                return {
                    success: false,
                    error: smsResult.error
                };
            }

            const result: OtpResult = {
                success: true,
                message: `Verification code sent to ${phoneNumber}`
            };

            // Include debug OTP in development
            if (process.env.NODE_ENV === 'development' && smsResult.debugOtp) {
                result.debugOtp = smsResult.debugOtp;
            }

            console.log('✅ OTP sent successfully:', {
                phone: phoneNumber,
                provider: smsResult.provider,
                debugOtp: result.debugOtp
            });

            return result;

        } catch (error: any) {
            console.error('❌ OTP sending error:', error);
            return {
                success: false,
                error: 'Failed to send verification code: ' + error.message
            };
        }
    }

    async verifyPhoneOtp(phoneNumber: string, otp: string): Promise<OtpResult> {
        try {
            console.log('🔍 Verifying OTP for:', phoneNumber);

            const stored = this.otpStore.get(phoneNumber);

            if (!stored) {
                return {
                    success: false,
                    error: 'No verification code found. Please request a new one.'
                };
            }

            if (Date.now() > stored.expiresAt) {
                this.otpStore.delete(phoneNumber);
                return {
                    success: false,
                    error: 'Verification code has expired. Please request a new one.'
                };
            }

            if (stored.otp !== otp) {
                return {
                    success: false,
                    error: 'Invalid verification code.'
                };
            }

            // OTP is valid, remove it
            this.otpStore.delete(phoneNumber);

            console.log('✅ OTP verified successfully for:', phoneNumber);
            return {
                success: true,
                message: 'Phone number verified successfully'
            };

        } catch (error: any) {
            console.error('❌ OTP verification error:', error);
            return {
                success: false,
                error: 'Failed to verify code: ' + error.message
            };
        }
    }

    private generateOtp(): string {
        // Generate 6-digit OTP
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    // Cleanup expired OTPs (call this periodically)
    cleanupExpiredOtps(): void {
        const now = Date.now();
        for (const [phone, data] of this.otpStore.entries()) {
            if (now > data.expiresAt) {
                this.otpStore.delete(phone);
            }
        }
    }
}

export const otpService = new OtpService();