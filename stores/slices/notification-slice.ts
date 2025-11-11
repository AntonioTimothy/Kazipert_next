import { StateCreator } from 'zustand'
import { Notification, NotificationState } from '../types'

export const createNotificationSlice: StateCreator<NotificationState> = (set, get) => ({
    notifications: [],
    unreadCount: 0,

    fetchNotifications: async () => {
        try {
            // Mock data - replace with actual API call
            const mockNotifications: Notification[] = [
                {
                    id: '1',
                    title: 'Welcome to Kazipert!',
                    message: 'Start exploring your new dashboard',
                    type: 'info',
                    read: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: '2',
                    title: 'Profile Incomplete',
                    message: 'Complete your profile to get better job matches',
                    type: 'warning',
                    read: false,
                    createdAt: new Date(Date.now() - 3600000).toISOString()
                },
                {
                    id: '3',
                    title: 'New Job Match',
                    message: 'We found 5 new jobs that match your skills',
                    type: 'success',
                    read: true,
                    createdAt: new Date(Date.now() - 7200000).toISOString()
                }
            ]

            const unreadCount = mockNotifications.filter(n => !n.read).length
            set({ notifications: mockNotifications, unreadCount })
        } catch (error) {
            console.error('Failed to fetch notifications:', error)
        }
    },

    markNotificationAsRead: async (notificationId: string) => {
        set(state => {
            const updatedNotifications = state.notifications.map(n =>
                n.id === notificationId ? { ...n, read: true } : n
            )
            const unreadCount = updatedNotifications.filter(n => !n.read).length
            return { notifications: updatedNotifications, unreadCount }
        })

        // In a real app, you'd also call an API to mark as read
        try {
            // await fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' })
        } catch (error) {
            console.error('Failed to mark notification as read:', error)
            // Revert on error
            set(state => {
                const revertedNotifications = state.notifications.map(n =>
                    n.id === notificationId ? { ...n, read: false } : n
                )
                const unreadCount = revertedNotifications.filter(n => !n.read).length
                return { notifications: revertedNotifications, unreadCount }
            })
        }
    },

    addNotification: (notificationData) => {
        const newNotification: Notification = {
            id: Date.now().toString(),
            read: false,
            createdAt: new Date().toISOString(),
            ...notificationData
        }

        set(state => ({
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1
        }))
    },

    clearNotifications: () => {
        set({ notifications: [], unreadCount: 0 })
    }
})