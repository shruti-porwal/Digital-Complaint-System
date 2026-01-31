import { io } from 'socket.io-client'

const getSocketUrl = () => {
  const base = import.meta.env.VITE_API_URL
  if (base && base.startsWith('http')) {
    try {
      return new URL(base).origin
    } catch {
      return window.location.origin
    }
  }
  return window.location.origin
}

/**
 * Connect to backend Socket.io for real-time complaint updates.
 * @param {{ userId?: string, complaintId?: string }} auth - userId and/or complaintId to join rooms
 * @returns {import('socket.io-client').Socket}
 */
export function connectComplaintSocket(auth = {}) {
  const url = getSocketUrl()
  return io(url, {
    path: '/api/socket.io',
    auth: {
      userId: auth.userId || undefined,
      complaintId: auth.complaintId || undefined,
    },
  })
}

/**
 * Subscribe to complaint:updated for a given complaint id or user.
 * Calls onUpdate(complaint) when backend emits.
 * @param {{ userId?: string, complaintId?: string }} auth
 * @param {(complaint: object) => void} onUpdate
 * @returns {() => void} disconnect function
 */
export function subscribeComplaintUpdates(auth, onUpdate) {
  const socket = connectComplaintSocket(auth)
  socket.on('complaint:updated', onUpdate)
  socket.on('connect_error', () => {})
  return () => socket.disconnect()
}
