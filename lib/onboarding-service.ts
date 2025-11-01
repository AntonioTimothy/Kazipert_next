// lib/onboarding-service.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Define types for better TypeScript support
interface OnboardingData {
    personalInfo: {
        dateOfBirth: string
        county: string
        physicalAddress: string
    }
    kycDetails: {
        idNumber: string
        passportNumber: string
        passportIssueDate: string
        passportExpiryDate: string
        kraPin: string
        maritalStatus: string
        hasChildren: string
        numberOfChildren: number
        workedAbroad: string
        countriesWorked: string[]
        workExperience: string
        skills: string[]
        languages: {
            english: string
            swahili: string
            arabic: string
        }
    }
    documents: {
        profilePicture: string | null
        idDocumentFront: string | null
        idDocumentBack: string | null
        passportDocument: string | null
        kraDocument: string | null
        goodConductUrl: string | null
        educationCertUrl: string | null
        workCertUrl: string | null
        medicalDocument: string | null
    }
    verification: {
        faceVerified: boolean
        medicalVerified: boolean
        paymentVerified: boolean
    }
    payment: {
        mpesaNumber: string
        payLater: boolean
    }
    terms: {
        accuracy: boolean
        terms: boolean
        consent: boolean
    }
}

interface OnboardingProgress {
    userId: string
    currentStep: number
    completed: boolean
    data: OnboardingData
    createdAt?: Date
    updatedAt?: Date
}

// Initial data structure to avoid duplication
const initialOnboardingData: OnboardingData = {
    personalInfo: {
        dateOfBirth: "",
        county: "",
        physicalAddress: ""
    },
    kycDetails: {
        idNumber: "",
        passportNumber: "",
        passportIssueDate: "",
        passportExpiryDate: "",
        kraPin: "",
        maritalStatus: "",
        hasChildren: "",
        numberOfChildren: 0,
        workedAbroad: "",
        countriesWorked: [],
        workExperience: "",
        skills: [],
        languages: {
            english: "",
            swahili: "",
            arabic: ""
        }
    },
    documents: {
        profilePicture: null,
        idDocumentFront: null,
        idDocumentBack: null,
        passportDocument: null,
        kraDocument: null,
        goodConductUrl: null,
        educationCertUrl: null,
        workCertUrl: null,
        medicalDocument: null
    },
    verification: {
        faceVerified: false,
        medicalVerified: false,
        paymentVerified: false
    },
    payment: {
        mpesaNumber: "",
        payLater: false
    },
    terms: {
        accuracy: false,
        terms: false,
        consent: false
    }
}

export async function fetchOnboardingProgress(userId: string): Promise<OnboardingProgress> {
    try {
        // Fetch onboarding progress with error handling and timeout
        const progress = await prisma.onboardingProgress.findUnique({
            where: { userId }
        })

        if (!progress) {
            console.log(`No existing progress found for user ${userId}, creating initial record`)

            // Create initial progress record
            const newProgress = await prisma.onboardingProgress.create({
                data: {
                    userId,
                    currentStep: 1,
                    completed: false,
                    data: initialOnboardingData
                }
            })

            return newProgress as OnboardingProgress
        }

        console.log(`Retrieved onboarding progress for user ${userId}, step: ${progress.currentStep}`)
        return progress as OnboardingProgress

    } catch (error) {
        console.error('Failed to fetch onboarding progress from database:', error)

        // Return comprehensive fallback data without database interaction
        return {
            userId,
            currentStep: 1,
            completed: false,
            data: initialOnboardingData,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    }
}

export async function saveOnboardingProgress(
    userId: string,
    currentStep: number,
    data: Partial<OnboardingData>
): Promise<{ success: boolean; progress?: OnboardingProgress; error?: string }> {
    try {
        // Validate current step
        if (currentStep < 1 || currentStep > 8) {
            return {
                success: false,
                error: 'Invalid step number. Must be between 1 and 8.'
            }
        }

        // Get existing progress to merge data
        const existingProgress = await prisma.onboardingProgress.findUnique({
            where: { userId }
        })

        const existingData = existingProgress?.data as OnboardingData || initialOnboardingData

        // Deep merge the existing data with new data
        const mergedData = deepMergeData(existingData, data)

        // Save onboarding progress with all data in the JSON field
        const progress = await prisma.onboardingProgress.upsert({
            where: { userId },
            update: {
                currentStep,
                data: mergedData,
                completed: currentStep === 8, // Mark as completed if it's the last step
                updatedAt: new Date()
            },
            create: {
                userId,
                currentStep,
                data: mergedData,
                completed: currentStep === 8
            }
        })

        console.log(`Successfully saved onboarding progress for user ${userId}, step: ${currentStep}`)

        return {
            success: true,
            progress: progress as OnboardingProgress
        }

    } catch (error) {
        console.error('Failed to save onboarding progress:', error)

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to save progress'
        }
    }
}

// Helper function to deep merge onboarding data
function deepMergeData(existing: OnboardingData, updates: Partial<OnboardingData>): OnboardingData {
    const result = { ...existing }

    for (const key in updates) {
        if (updates[key as keyof OnboardingData] !== undefined) {
            const existingValue = existing[key as keyof OnboardingData]
            const updateValue = updates[key as keyof OnboardingData]

            if (typeof existingValue === 'object' && existingValue !== null &&
                typeof updateValue === 'object' && updateValue !== null) {
                // Recursively merge nested objects
                result[key as keyof OnboardingData] = {
                    ...existingValue as any,
                    ...updateValue as any
                } as any
            } else {
                // Assign primitive values or replace entire objects
                result[key as keyof OnboardingData] = updateValue as any
            }
        }
    }

    return result
}

// Additional utility functions for specific operations

export async function updateOnboardingStep(
    userId: string,
    currentStep: number
): Promise<{ success: boolean; error?: string }> {
    try {
        await prisma.onboardingProgress.update({
            where: { userId },
            data: {
                currentStep,
                completed: currentStep === 8,
                updatedAt: new Date()
            }
        })

        return { success: true }
    } catch (error) {
        console.error('Failed to update onboarding step:', error)
        return {
            success: false,
            error: 'Failed to update step'
        }
    }
}

export async function markOnboardingComplete(
    userId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await prisma.onboardingProgress.update({
            where: { userId },
            data: {
                completed: true,
                currentStep: 8,
                updatedAt: new Date()
            }
        })

        console.log(`Marked onboarding as complete for user ${userId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to mark onboarding as complete:', error)
        return {
            success: false,
            error: 'Failed to mark onboarding as complete'
        }
    }
}

export async function resetOnboardingProgress(
    userId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await prisma.onboardingProgress.update({
            where: { userId },
            data: {
                currentStep: 1,
                completed: false,
                data: initialOnboardingData,
                updatedAt: new Date()
            }
        })

        console.log(`Reset onboarding progress for user ${userId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to reset onboarding progress:', error)
        return {
            success: false,
            error: 'Failed to reset onboarding progress'
        }
    }
}

export async function getOnboardingStatus(
    userId: string
): Promise<{ currentStep: number; completed: boolean; progressPercentage: number }> {
    try {
        const progress = await prisma.onboardingProgress.findUnique({
            where: { userId },
            select: { currentStep: true, completed: true }
        })

        if (!progress) {
            return { currentStep: 1, completed: false, progressPercentage: 0 }
        }

        const progressPercentage = Math.round(((progress.currentStep - 1) / 7) * 100)

        return {
            currentStep: progress.currentStep,
            completed: progress.completed,
            progressPercentage
        }
    } catch (error) {
        console.error('Failed to get onboarding status:', error)
        return { currentStep: 1, completed: false, progressPercentage: 0 }
    }
}