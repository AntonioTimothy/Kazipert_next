// /lib/env.ts
export const env = {
    // Database
    DATABASE_URL: process.env.DATABASE_URL!,

    // Infobip
    INFOBIP_API_KEY: process.env.INFOBIP_API_KEY!,
    INFOBIP_BASE_URL: process.env.INFOBIP_BASE_URL || 'https://api.infobip.com',

    // Email Services
    SMTP_USER: process.env.SMTP_USER!,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD!,
    RESEND_API_KEY: process.env.RESEND_API_KEY!,

    // Authentication
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL!,

    // SMS Services - Africa's Talking
    AFRICASTALKING_API_KEY: process.env.AFRICASTALKING_API_KEY!,
    AFRICASTALKING_USERNAME: process.env.AFRICASTALKING_USERNAME!,
    AFRICASTALKING_SENDER_ID: process.env.AFRICASTALKING_SENDER_ID!,

    // SMS Services - Twilio
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID!,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN!,
    TWILIO_WHATSAPP_FROM: process.env.TWILIO_WHATSAPP_FROM!,
    TWILIO_WHATSAPP_TO: process.env.TWILIO_WHATSAPP_TO!,
    TWILIO_CONTENT_SID: process.env.TWILIO_CONTENT_SID!,
};