// Wallet & Transactions Service
const API_BASE = '/api'

export const walletService = {
    async getWallet() {
        const response = await fetch(`${API_BASE}/wallet`, {
            credentials: 'include'
        })
        if (!response.ok) throw new Error('Failed to fetch wallet')
        return response.json()
    },

    async updateWallet(amount: number, type: 'CREDIT' | 'DEBIT', description?: string) {
        const response = await fetch(`${API_BASE}/wallet`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, type, description })
        })
        if (!response.ok) throw new Error('Failed to update wallet')
        return response.json()
    }
}

export const transactionService = {
    async getTransactions(type?: 'sent' | 'received' | 'all') {
        const params = type ? `?type=${type}` : ''
        const response = await fetch(`${API_BASE}/transactions${params}`, {
            credentials: 'include'
        })
        if (!response.ok) throw new Error('Failed to fetch transactions')
        return response.json()
    },

    async createTransaction(data: {
        amount: number
        type: string
        receiverId?: string
        description?: string
        reference?: string
        metadata?: any
    }) {
        const response = await fetch(`${API_BASE}/transactions`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('Failed to create transaction')
        return response.json()
    }
}

export const notificationService = {
    async getNotifications(unreadOnly = false) {
        const params = unreadOnly ? '?unreadOnly=true' : ''
        const response = await fetch(`${API_BASE}/notifications${params}`, {
            credentials: 'include'
        })
        if (!response.ok) throw new Error('Failed to fetch notifications')
        return response.json()
    },

    async markAsRead(notificationId?: string, markAllAsRead = false) {
        const response = await fetch(`${API_BASE}/notifications`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notificationId, markAllAsRead })
        })
        if (!response.ok) throw new Error('Failed to mark as read')
        return response.json()
    },

    async createNotification(data: {
        userId: string
        title: string
        message: string
        type: string
        actionUrl?: string
        metadata?: any
    }) {
        const response = await fetch(`${API_BASE}/notifications`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('Failed to create notification')
        return response.json()
    }
}

export const supportService = {
    async getTickets(status?: string) {
        const params = status ? `?status=${status}` : ''
        const response = await fetch(`${API_BASE}/support/tickets${params}`, {
            credentials: 'include'
        })
        if (!response.ok) throw new Error('Failed to fetch tickets')
        return response.json()
    },

    async createTicket(data: {
        subject: string
        description: string
        category: string
        priority?: string
        attachments?: any
    }) {
        const response = await fetch(`${API_BASE}/support/tickets`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('Failed to create ticket')
        return response.json()
    },

    async updateTicket(data: {
        ticketId: string
        status?: string
        priority?: string
        escalationLevel?: string
        assigneeId?: string
    }) {
        const response = await fetch(`${API_BASE}/support/tickets`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('Failed to update ticket')
        return response.json()
    },

    async addMessage(data: {
        ticketId: string
        message: string
        attachments?: any
        isInternal?: boolean
    }) {
        const response = await fetch(`${API_BASE}/support/messages`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('Failed to add message')
        return response.json()
    }
}

export const trainingService = {
    async getClasses() {
        const response = await fetch(`${API_BASE}/training/classes`, {
            credentials: 'include'
        })
        if (!response.ok) throw new Error('Failed to fetch classes')
        return response.json()
    },

    async updateProgress(classId: string, watchedDuration: number, completed = false) {
        const response = await fetch(`${API_BASE}/training/progress`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ classId, watchedDuration, completed })
        })
        if (!response.ok) throw new Error('Failed to update progress')
        return response.json()
    },

    async submitTest(classId: string, answers: number[]) {
        const response = await fetch(`${API_BASE}/training/test`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ classId, answers })
        })
        if (!response.ok) throw new Error('Failed to submit test')
        return response.json()
    }
}
