// stores/api/socket-client.ts
class SocketClient {
    private socket: WebSocket | null = null
    private reconnectAttempts = 0
    private maxReconnectAttempts = 5
    private listeners: Map<string, Function[]> = new Map()

    connect() {
        if (this.socket?.readyState === WebSocket.OPEN) return

        try {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
            const wsUrl = `${protocol}//${window.location.host}/api/ws`

            this.socket = new WebSocket(wsUrl)

            this.socket.onopen = () => {
                console.log('WebSocket connected')
                this.reconnectAttempts = 0
                this.emit('connection', { status: 'connected' })
            }

            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    this.emit(data.type, data.payload)
                } catch (error) {
                    console.error('Failed to parse WebSocket message:', error)
                }
            }

            this.socket.onclose = () => {
                console.log('WebSocket disconnected')
                this.attemptReconnect()
            }

            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error)
            }

        } catch (error) {
            console.error('Failed to connect WebSocket:', error)
        }
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            setTimeout(() => this.connect(), 1000 * this.reconnectAttempts)
        }
    }

    on(event: string, callback: Function) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, [])
        }
        this.listeners.get(event)!.push(callback)
    }

    off(event: string, callback: Function) {
        const eventListeners = this.listeners.get(event)
        if (eventListeners) {
            const index = eventListeners.indexOf(callback)
            if (index > -1) {
                eventListeners.splice(index, 1)
            }
        }
    }

    private emit(event: string, data: any) {
        const eventListeners = this.listeners.get(event)
        if (eventListeners) {
            eventListeners.forEach(callback => callback(data))
        }
    }

    send(type: string, payload: any) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type, payload }))
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close()
            this.socket = null
        }
        this.listeners.clear()
    }
}

export const socketClient = new SocketClient()