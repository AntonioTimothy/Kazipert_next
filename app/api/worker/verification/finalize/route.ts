// app/api/verification/finalize/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Helper function to get user from request (similar to your working example)
async function getUserFromRequest(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('access_token')?.value

        console.log('🔐 VERIFICATION API - Access token from cookies:', !!accessToken)

        if (!accessToken) {
            console.log('❌ VERIFICATION API - No access token found in cookies')
            return null
        }

        const decoded = verifyAccessToken(accessToken)
        console.log('🔐 VERIFICATION API - Token decoded:', !!decoded)

        if (!decoded) {
            console.log('❌ VERIFICATION API - Invalid or expired token')
            return null
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                profile: true,
                kycDetails: true,
                onboardingProgress: true
            }
        })

        console.log('🔐 VERIFICATION API - User found:', user?.email, 'Role:', user?.role)
        return user
    } catch (error) {
        console.error('❌ VERIFICATION API - Error getting user from request:', error)
        return null
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log('✅ VERIFICATION FINALIZE API - POST request received')
        const user = await getUserFromRequest(request)

        if (!user) {
            console.log('❌ VERIFICATION FINALIZE API - Unauthorized: No user found')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { sessionId, formData, paymentData } = body

        console.log('📝 VERIFICATION FINALIZE API - Request body parsed')
        console.log('Session ID:', sessionId)
        console.log('Payment Data:', paymentData)
        console.log('Form Data keys:', Object.keys(formData || {}))

        console.log('📝 VERIFICATION FINALIZE API - Finalizing verification for user:', user.email)

        // Update user as verified and set profile picture
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                verified: true,
                onboardingCompleted: true,
                fullName: formData.fullName,
                firstName: formData.fullName?.split(' ')[0],
                lastName: formData.fullName?.split(' ').slice(1).join(' '),
                gender: formData.gender,
                profile: {
                    upsert: {
                        create: {
                            avatar: formData.selfiePath
                        },
                        update: {
                            avatar: formData.selfiePath
                        }
                    }
                }
            },
            include: {
                profile: true // Include profile in the response
            }
        })

        // Create or update KYC details
        await prisma.kycDetails.upsert({
            where: { userId: user.id },
            update: {
                dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
                county: formData.county,
                physicalAddress: formData.physicalAddress,
                idNumber: formData.idNumber,
                idVerified: true,
                faceVerified: true,
                paymentVerified: true,
                paymentStatus: 'completed',
                mpesaNumber: paymentData?.mpesaNumber,
                transactionCode: paymentData?.transactionCode,
            },
            create: {
                userId: user.id,
                dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
                county: formData.county,
                physicalAddress: formData.physicalAddress,
                idNumber: formData.idNumber,
                idVerified: true,
                faceVerified: true,
                paymentVerified: true,
                paymentStatus: 'completed',
                mpesaNumber: paymentData?.mpesaNumber,
                transactionCode: paymentData?.transactionCode,
            }
        })

        // Mark onboarding as completed
        await prisma.onboardingProgress.update({
            where: { userId: user.id },
            data: {
                completed: true,
                currentStep: 7,
                completedSteps: [1, 2, 3, 4, 5, 6, 7],
                data: {
                    ...formData,
                    finalizedAt: new Date().toISOString(),
                    verified: true
                }
            }
        })

        console.log('✅ VERIFICATION FINALIZE API - Verification completed successfully for user:', user.email)

        return NextResponse.json({
            success: true,
            user: updatedUser,
            message: 'Verification completed successfully'
        })
    } catch (error) {
        console.error('❌ VERIFICATION FINALIZE API - Error finalizing verification:', error)
        return NextResponse.json(
            { error: 'Failed to finalize verification' },
            { status: 500 }
        )
    }
}