// hooks/useOnboarding.ts (client-side example)
'use client'

export const useOnboarding = () => {
    const saveProgress = async (currentStep: number, data: any) => {
        try {
            const response = await fetch('/api/onboarding/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentStep, data }),
            })

            if (!response.ok) {
                throw new Error('Failed to save progress')
            }

            return await response.json()
        } catch (error) {
            console.error('Error saving progress:', error)
            throw error
        }
    }

    const fetchProgress = async () => {
        try {
            const response = await fetch('/api/onboarding/progress')

            if (!response.ok) {
                throw new Error('Failed to fetch progress')
            }

            return await response.json()
        } catch (error) {
            console.error('Error fetching progress:', error)
            throw error
        }
    }

    return { saveProgress, fetchProgress }
}