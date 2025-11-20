// lib/verification.ts - UPDATED TO MATCH YOUR API
export async function getOnboardingProgress(userId: string): Promise<any> {
    try {
        const response = await fetch(`/api/onboarding/progress?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch onboarding progress');
        return await response.json();
    } catch (error) {
        console.error('Error getting onboarding progress:', error);
        // Return default progress if fetch fails
        return {
            currentStep: 1,
            completed: false,
            data: {},
            completedSteps: [1]
        };
    }
}

export async function updateOnboardingProgress(
    userId: string,
    step: number,
    data: any,
    completedSteps?: number[]
): Promise<any> {
    try {
        const response = await fetch('/api/onboarding/progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                step,
                data,
                completedSteps
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update onboarding progress');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating onboarding progress:', error);
        throw error;
    }
}

export async function createSession(): Promise<string> {
    try {
        // Generate a unique session ID
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return sessionId;
    } catch (error) {
        console.error('Error creating session:', error);
        throw error;
    }
}

export async function finalizeVerification(
    sessionId: string,
    formData: any,
    paymentData: any
): Promise<{ success: boolean; user?: any; message?: string }> {
    try {
        const response = await fetch('/api/verification/finalize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionId,
                formData,
                paymentData
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to finalize verification');
        }

        return await response.json();
    } catch (error) {
        console.error('Error finalizing verification:', error);
        throw error;
    }
}

export async function uploadVerificationFile(
    file: File,
    fileType: 'idFront' | 'idBack' | 'selfie',
    userId: string
): Promise<{ success: boolean; fileUrl?: string }> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileType', fileType);
        formData.append('userId', userId);

        const response = await fetch('/api/verification/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload file');
        }

        return await response.json();
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

// Add your existing verification functions
export async function uploadIdFront(file: File, sessionId: string): Promise<any> {
    try {
        // Your existing implementation
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sessionId', sessionId);

        const response = await fetch('/api/verification/id-front', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload ID front');
        }

        return await response.json();
    } catch (error) {
        console.error('Error uploading ID front:', error);
        throw error;
    }
}

export async function uploadIdBack(file: File, sessionId: string): Promise<any> {
    try {
        // Your existing implementation
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sessionId', sessionId);

        const response = await fetch('/api/verification/id-back', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload ID back');
        }

        return await response.json();
    } catch (error) {
        console.error('Error uploading ID back:', error);
        throw error;
    }
}

export async function verifySelfie(selfieFile: File, idFrontFile: File, sessionId: string): Promise<any> {
    try {
        // Your existing implementation
        const formData = new FormData();
        formData.append('selfie', selfieFile);
        formData.append('idFront', idFrontFile);
        formData.append('sessionId', sessionId);

        const response = await fetch('/api/verification/verify-selfie', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to verify selfie');
        }

        return await response.json();
    } catch (error) {
        console.error('Error verifying selfie:', error);
        throw error;
    }
}

export async function processPayment(phoneNumber: string, amount: number): Promise<any> {
    try {
        // Your existing implementation
        const response = await fetch('/api/payment/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber,
                amount
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to process payment');
        }

        return await response.json();
    } catch (error) {
        console.error('Error processing payment:', error);
        throw error;
    }
}