import { socketClient } from '../api/socket-client'

// Socket event constants
export const SOCKET_EVENTS = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    MESSAGE: 'message',
    NOTIFICATION: 'notification',
    USER_ONLINE: 'user_online',
    USER_OFFLINE: 'user_offline',
    TYPING_START: 'typing_start',
    TYPING_STOP: 'typing_stop',
    MESSAGE_READ: 'message_read'
} as const

// Socket message builders
export const buildSocketMessage = (type: string, payload: any) => ({
    type,
    payload,
    timestamp: Date.now(),
    id: Math.random().toString(36).substr(2, 9)
})

// Socket connection manager
export class SocketManager {
    private static instance: SocketManager
    private reconnectAttempts = 0
    private maxReconnectAttempts = 5

    private constructor() { }

    static getInstance(): SocketManager {
        if (!SocketManager.instance) {
            SocketManager.instance = new SocketManager()
        }
        return SocketManager.instance
    }

    connect() {
        socketClient.connect()
    }

    disconnect() {
        socketClient.disconnect()
    }

    sendMessage(type: string, payload: any) {
        socketClient.send(type, payload)
    }

    onMessage(type: string, callback: (data: any) => void) {
        socketClient.on(type, callback)
    }

    offMessage(type: string, callback: (data: any) => void) {
        socketClient.off(type, callback)
    }

    isConnected(): boolean {
        // This would need to be implemented based on your socket client
        return true // Placeholder
    }

    // Reconnection logic
    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            setTimeout(() => {
                this.connect()
            }, 1000 * this.reconnectAttempts)
        }
    }

    resetReconnectAttempts() {
        this.reconnectAttempts = 0
    }
}

// Export singleton instance
export const socketManager = SocketManager.getInstance()