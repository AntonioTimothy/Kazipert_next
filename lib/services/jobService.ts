const API_BASE = '/api'

export interface JobFormData {
    // Basic Information
    title: string
    type: string
    category: string
    description: string
    status: string

    // Household Details
    residenceType: string
    bedrooms: number
    bathrooms: number
    totalFloors: number
    hasGarden: boolean
    hasPool: boolean
    squareMeters?: number

    // Family Details
    familyMembers: number
    childrenCount: number
    childrenAges: string[]
    elderlyCare: boolean
    specialNeeds: boolean
    pets: string[]

    // Job Requirements
    duties: string[]
    experienceRequired: string
    languageRequirements: string[]
    workingHours: string
    overtimeRequired: boolean
    accommodation: string
    meals: string
    vacationDays: number

    // Benefits & Certifications
    benefits: string[]
    certifications: string[]
    skills: string[]

    // Compensation & Location
    salary: number
    salaryCurrency: string
    location?: string
    city: string
    availableFrom?: string
    interviewRequired: boolean

    // Additional Settings
    emergencySupport: boolean
    autoSalaryCalculation: boolean

    // Dynamic Data
    questionnaire?: any
    salaryBreakdown?: any
}

// Helper function to get auth config
function getAuthConfig(method: string = 'GET', body?: any): RequestInit {
    const config: RequestInit = {
        method,
        credentials: 'include' as RequestCredentials,
        headers: {
            'Content-Type': 'application/json',
        }
    }

    if (body) {
        config.body = JSON.stringify(body)
    }

    return config
}

// Enhanced error handler
async function handleResponse(response: Response) {
    if (!response.ok) {
        const errorText = await response.text()
        console.error(`API Error (${response.status}):`, errorText)

        if (response.status === 401) {
            // Clear invalid session and redirect to login
            sessionStorage.removeItem('user')
            localStorage.removeItem('user')
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
            throw new Error('Authentication required. Please login again.')
        }

        if (response.status === 403) {
            throw new Error('You do not have permission to perform this action.')
        }

        if (response.status === 404) {
            throw new Error('Resource not found.')
        }

        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }
    return response.json()
}

export const jobService = {
    // Jobs
    async getJobs(params: { role: 'employer' | 'employee'; status?: string; page?: number; limit?: number }) {
        const queryParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value.toString())
            }
        })

        const response = await fetch(`${API_BASE}/jobs?${queryParams}`,
            getAuthConfig('GET')
        )

        return handleResponse(response)
    },

    async getJob(id: string) {
        const response = await fetch(`${API_BASE}/jobs/${id}`,
            getAuthConfig('GET')
        )

        return handleResponse(response)
    },

    async createJob(data: JobFormData) {
        console.log('Creating job with data:', data)

        const response = await fetch(`${API_BASE}/jobs`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })

        return handleResponse(response)
    },

    async updateJob(id: string, data: Partial<JobFormData>) {
        // Filter and map data to match Prisma schema
        const updateData: any = {}
        
        if (data.title) updateData.title = data.title
        if (data.description) updateData.description = data.description
        if (data.location) updateData.location = data.location
        if (data.city) updateData.city = data.city
        if (data.salary) updateData.salary = data.salary
        if (data.salaryCurrency) updateData.salaryCurrency = data.salaryCurrency
        if (data.category) updateData.category = data.category
        
        // Map status values to match JobStatus enum
        if (data.status) {
            const statusMap: { [key: string]: string } = {
                'OPEN': 'ACTIVE',
                'CLOSED': 'CLOSED',
                'PAUSED': 'PAUSED'
            }
            updateData.status = statusMap[data.status] || data.status
        }

        const response = await fetch(`${API_BASE}/jobs/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        })

        return handleResponse(response)
    },

    async deleteJob(id: string) {
        const response = await fetch(`${API_BASE}/jobs/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        return handleResponse(response)
    },

    // Applications
    async getApplications(params: { role: 'employer' | 'employee'; status?: string }) {
        const queryParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value.toString())
            }
        })

        const response = await fetch(`${API_BASE}/applications?${queryParams}`,
            getAuthConfig('GET')
        )

        return handleResponse(response)
    },

    async createApplication(jobId: string, coverLetter?: string, isDraft: boolean = false) {
        const response = await fetch(`${API_BASE}/applications`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jobId,
                coverLetter,
                isDraft
            })
        })

        return handleResponse(response)
    },

    // Saved Jobs
    async getSavedJobs() {
        const response = await fetch(`${API_BASE}/saved-jobs`,
            getAuthConfig('GET')
        )

        return handleResponse(response)
    },

    async saveJob(jobId: string) {
        const response = await fetch(`${API_BASE}/saved-jobs`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jobId,
                action: 'save'
            })
        })

        return handleResponse(response)
    },

    async unsaveJob(jobId: string) {
        const response = await fetch(`${API_BASE}/saved-jobs`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jobId,
                action: 'unsave'
            })
        })

        return handleResponse(response)
    },

    // Utility methods for debugging
    async checkAuth() {
        try {
            const response = await fetch(`${API_BASE}/auth/verify`, {
                method: 'GET',
                credentials: 'include'
            })
            return response.ok
        } catch (error) {
            console.error('Auth check failed:', error)
            return false
        }
    },

    // Get current user info from session
    getCurrentUser() {
        try {
            const userData = sessionStorage.getItem('user') || localStorage.getItem('user')
            return userData ? JSON.parse(userData) : null
        } catch (error) {
            console.error('Error getting current user:', error)
            return null
        }
    },

    // Application Management
    async updateApplication(applicationId: string, data: { status?: string }) {
        const response = await fetch(`${API_BASE}/applications/${applicationId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })

        return handleResponse(response)
    },

    async getApplication(applicationId: string) {
        const response = await fetch(`${API_BASE}/applications/${applicationId}`,
            getAuthConfig('GET')
        )

        return handleResponse(response)
    },

    // Send message in application
    async sendApplicationMessage(applicationId: string, message: string) {
        const response = await fetch(`${API_BASE}/applications/${applicationId}/messages`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        })

        return handleResponse(response)
    },

    // Contract and document management
    async uploadDocument(applicationId: string, documentType: string, file: File) {
        const formData = new FormData()
        formData.append('document', file)
        formData.append('documentType', documentType)

        const response = await fetch(`${API_BASE}/applications/${applicationId}/documents`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        })

        return handleResponse(response)
    },

    async generateContract(applicationId: string) {
        const response = await fetch(`${API_BASE}/applications/${applicationId}/contract`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        return handleResponse(response)
    },
    // Application Progress Management
    async updateApplicationStep(applicationId: string, step: string, data?: any) {
        const response = await fetch(`${API_BASE}/applications/${applicationId}/step`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ step, ...data })
        })

        return handleResponse(response)
    },

    async uploadMedicalDocument(applicationId: string, file: File) {
        const formData = new FormData()
        formData.append('medicalDocument', file)
        formData.append('type', 'medical')

        const response = await fetch(`${API_BASE}/applications/${applicationId}/medical`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        })

        return handleResponse(response)
    },

    async uploadFlightTicket(applicationId: string, file: File, flightDetails: any) {
        const formData = new FormData()
        formData.append('flightTicket', file)
        formData.append('flightDetails', JSON.stringify(flightDetails))

        const response = await fetch(`${API_BASE}/applications/${applicationId}/flight-ticket`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        })

        return handleResponse(response)
    },

    async getApplicationProgress(applicationId: string) {
        const response = await fetch(`${API_BASE}/applications/${applicationId}/progress`,
            getAuthConfig('GET')
        )

        return handleResponse(response)
    },

    // Employer specific methods
    async getJobApplications(jobId: string) {
        const response = await fetch(`${API_BASE}/jobs/${jobId}/applications`,
            getAuthConfig('GET')
        )

        return handleResponse(response)
    },

    async shortlistApplication(applicationId: string) {
        return this.updateApplicationStep(applicationId, 'SHORTLISTED')
    },

    async scheduleInterview(applicationId: string, interviewDate: string, notes?: string) {
        return this.updateApplicationStep(applicationId, 'INTERVIEW_SCHEDULED', {
            interviewDate,
            interviewNotes: notes
        })
    },

    async requestMedical(applicationId: string) {
        return this.updateApplicationStep(applicationId, 'MEDICAL_REQUESTED')
    },

    async sendContract(applicationId: string, contractUrl: string) {
        return this.updateApplicationStep(applicationId, 'CONTRACT_SENT', {
            contractUrl
        })
    },

    // Get jobs posted by employer
    async getEmployerJobs(employerId: string) {
        const response = await fetch(`${API_BASE}/jobs/employer/${employerId}`,
            getAuthConfig('GET')
        )

        return handleResponse(response)
    }
}