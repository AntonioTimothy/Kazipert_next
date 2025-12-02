// lib/verification.ts - UPDATED
let currentSessionId: string | null = null;

export async function createSession(): Promise<string> {
    try {
        console.log('📞 Creating session...');

        const response = await fetch('/api/verification/create-session', {
            method: 'POST',
        });

        console.log('📨 Response status:', response);

        if (!response.ok) {
            console.log('📨 Response status:', response);

            // throw new Error(`Failed to create session: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Session created:', data.sessionId);
        currentSessionId = data.sessionId;
        return currentSessionId;
    } catch (error) {
        console.error('❌ Error creating session:', error);
        throw error;
    }
}

export async function getCurrentSessionId(): Promise<string> {
    if (currentSessionId) {
        return currentSessionId;
    }
    return await createSession();
}

// lib/verification.ts - SIMPLE AND RELIABLE
export async function uploadIdFront(imageFile: File, sessionId: string): Promise<any> {
    try {
        console.log('📁 Uploading ID Front...');

        const formData = new FormData();
        formData.append('sessionId', sessionId);
        formData.append('idFront', imageFile);

        const response = await fetch('/api/verification/upload-id-front', {
            method: 'POST',
            body: formData,
        });

        console.log('📨 Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed: ${errorText}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
}

export async function uploadIdBack(imageFile: File, sessionId: string): Promise<any> {
    try {
        console.log('📁 Uploading ID Back...');

        const formData = new FormData();
        formData.append('sessionId', sessionId);
        formData.append('idBack', imageFile);

        const response = await fetch('/api/verification/upload-id-back', {
            method: 'POST',
            body: formData,
        });

        console.log('📨 Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed: ${errorText}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
}

export async function verifySelfie(selfieFile: File, idFrontFile: File, sessionId: string): Promise<any> {
    try {
        console.log('📁 Verifying selfie...');

        const formData = new FormData();
        formData.append('sessionId', sessionId);
        formData.append('selfie', selfieFile);
        formData.append('idFront', idFrontFile);

        const response = await fetch('/api/verification/verify-face', {
            method: 'POST',
            body: formData,
        });

        console.log('📨 Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Verification failed: ${errorText}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Verification error:', error);
        throw error;
    }
}



export async function getOnboardingProgress(userId: string) {
    try {
        const response = await fetch(`/api/onboarding/progress?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch onboarding progress');
        return await response.json();
    } catch (error) {
        console.error('Error getting onboarding progress:', error);
        return null;
    }
}

export async function updateOnboardingProgress(userId: string, step: number, data: any, completedSteps?: number[]) {
    try {
        const response = await fetch('/api/onboarding/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                step,
                data,
                completedSteps: completedSteps || Array.from({ length: step }, (_, i) => i + 1)
            }),
        });

        if (!response.ok) throw new Error('Failed to update onboarding progress');
        return await response.json();
    } catch (error) {
        console.error('Error updating onboarding progress:', error);
        throw error;
    }
}

// lib/verification.ts - UPDATED
export async function finalizeVerification(
    sessionId: string,
    formData: any,
    paymentData: any
): Promise<{ success: boolean; user?: any; message?: string }> {
    try {
        const response = await fetch('/api/worker/verification/finalize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                sessionId,
                formData,
                paymentData
            }),
        })

        if (!response.ok) {
            throw new Error('Failed to finalize verification')
        }

        return await response.json()
    } catch (error) {
        console.error('Error finalizing verification:', error)
        throw error
    }
}

export async function uploadVerificationFile(
    file: File,
    fileType: 'idFront' | 'idBack' | 'selfie',
    userId: string
): Promise<{ success: boolean; fileUrl?: string }> {
    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('fileType', fileType)
        formData.append('userId', userId)

        const response = await fetch('/api/worker/verification/upload', {
            method: 'POST',
            credentials: 'include',
            body: formData,
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Upload failed with status:', response.status, 'Response:', errorText)
            throw new Error(`Failed to upload file: ${errorText}`)
        }

        return await response.json()
    } catch (error) {
        console.error('Error uploading file:', error)
        throw error
    }
}




export async function processPayment(phoneNumber: string, amount: number) {
    try {
        const response = await fetch('/api/payment/mpesa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phoneNumber,
                amount,
                accountReference: 'VERIFICATION_FEE',
            }),
        });

        if (!response.ok) throw new Error('Payment failed');
        return await response.json();
    } catch (error) {
        console.error('Error processing payment:', error);
        throw error;
    }
}

export function clearSession() {
    currentSessionId = null;
    console.log('🧹 Session cleared');
}