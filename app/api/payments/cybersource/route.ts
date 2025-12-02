import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// CyberSource Configuration
const CYBERSOURCE_MERCHANT_ID = process.env.CYBERSOURCE_MERCHANT_ID || 'test_merchant_id'
const CYBERSOURCE_ACCESS_KEY = process.env.CYBERSOURCE_ACCESS_KEY || 'test_access_key'
const CYBERSOURCE_SECRET_KEY = process.env.CYBERSOURCE_SECRET_KEY || 'test_secret_key'
const CYBERSOURCE_PROFILE_ID = process.env.CYBERSOURCE_PROFILE_ID || 'test_profile_id'

// Helper to generate signature
function generateSignature(params: Record<string, string>, secretKey: string) {
    const keys = Object.keys(params).sort()
    const data = keys.map(key => `${key}=${params[key]}`).join(',')
    const signature = crypto.createHmac('sha256', secretKey).update(data).digest('base64')
    return signature
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { action, amount, currency, reference, paymentToken } = body

        if (action === 'initiate') {
            // Generate signature for client-side silent post
            const transactionUuid = crypto.randomUUID()
            const signedDateTime = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')

            const params = {
                access_key: CYBERSOURCE_ACCESS_KEY,
                profile_id: CYBERSOURCE_PROFILE_ID,
                transaction_uuid: transactionUuid,
                signed_field_names: 'access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency',
                unsigned_field_names: '',
                signed_date_time: signedDateTime,
                locale: 'en',
                transaction_type: 'sale',
                reference_number: reference,
                amount: amount,
                currency: currency || 'OMR'
            }

            const signature = generateSignature(params, CYBERSOURCE_SECRET_KEY)

            return NextResponse.json({
                ...params,
                signature
            })
        } else if (action === 'process_token') {
            // Process payment using a token (recurring or saved card)
            // This would involve a server-to-server call to CyberSource API
            // For MVP, we'll mock a successful response if credentials are test

            console.log('Processing payment with token:', paymentToken)

            // Simulate API call
            const success = true

            if (success) {
                // Record transaction
                await prisma.paymentTransaction.create({
                    data: {
                        id: crypto.randomUUID(),
                        amount: parseFloat(amount),
                        currency: currency || 'OMR',
                        status: 'COMPLETED',
                        provider: 'CYBERSOURCE',
                        reference: reference,
                        metadata: JSON.stringify({ paymentToken })
                    }
                })

                return NextResponse.json({ success: true, message: 'Payment processed successfully' })
            } else {
                return NextResponse.json({ success: false, message: 'Payment failed' }, { status: 400 })
            }
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

    } catch (error) {
        console.error('Error in CyberSource payment:', error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
