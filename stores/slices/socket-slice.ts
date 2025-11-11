import { StateCreator } from 'zustand'
import { SocketState } from '../types'
import { socketClient } from '../api/socket-client'

export const createSocketSlice: StateCreator<SocketState> = (set, get) => ({
    socket: {
        isConnected: false,
        lastMessage: null,
        onlineUsers: [],
        connectionId: undefined
    },

    connectSocket: () => {
        socketClient.connect()

        socketClient.on('connection', (data: any) => {
            set({
                socket: {
                    ...get().socket,
                    isConnected: true,
                    connectionId: data.connectionId
                }
            })
        })

        socketClient.on('user_online', (data: any) => {
            set(state => ({
                socket: {
                    ...state.socket,
                    onlineUsers: [...state.socket.onlineUsers, data.userId]
                }
            }))
        })

        socketClient.on('user_offline', (data: any) => {
            set(state => ({
                socket: {
                    ...state.socket,
                    onlineUsers: state.socket.onlineUsers.filter(id => id !== data.userId)
                }
            }))
        })

        socketClient.on('notification', (data: any) => {
            // Add notification to store
            const { addNotification } = get() as any
            if (addNotification) {
                addNotification({
                    title: data.title,
                    message: data.message,
                    type: data.type || 'info'
                })
            }

            set(state => ({
                socket: {
                    ...state.socket,
                    lastMessage: data
                }
            }))
        })

        socketClient.on('disconnect', () => {
            set({
                socket: {
                    isConnected: false,
                    lastMessage: null,
                    onlineUsers: [],
                    connectionId: undefined
                }
            })
        })
    },

    disconnectSocket: () => {
        socketClient.disconnect()
        set({
            socket: {
                isConnected: false,
                lastMessage: null,
                onlineUsers: [],
                connectionId: undefined
            }
        })
    },

    sendSocketMessage: (message: any) => {
        if (get().socket.isConnected) {
            socketClient.send('message', message)
        } else {
            console.warn('Socket not connected')
        }
    }
})