import { apiClient } from './client'
import {
  getMockComplaints,
  getMockComplaintById,
  addMockComplaint,
  getMockAllComplaints,
  updateMockComplaintStatus,
} from './mockData'

function getUserId() {
  try {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u).id : null
  } catch {
    return null
  }
}

// Auth
export const authApi = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  logout: () => apiClient.post('/auth/logout'),
  me: () => apiClient.get('/auth/me'),
}

// Complaints (user) – fallback to mock when API fails
export const complaintApi = {
  create: (data) =>
    apiClient
      .post('/complaints', data)
      .then((r) => r)
      .catch(() => {
        const c = addMockComplaint(data, getUserId())
        return { data: c }
      }),
  getMyComplaints: () =>
    apiClient
      .get('/complaints/me')
      .then((r) => ({ data: Array.isArray(r.data) ? r.data : r.data?.complaints ?? [] }))
      .catch(() => ({ data: getMockComplaints(getUserId()) })),
  getById: (id) =>
    apiClient
      .get(`/complaints/${id}`)
      .then((r) => r)
      .catch(() => {
        const c = getMockComplaintById(id, getUserId())
        return c ? { data: c } : Promise.reject(new Error('Complaint not found'))
      }),
}

// Complaints (admin) – fallback to mock when API fails
export const adminComplaintApi = {
  getAll: (params) =>
    apiClient
      .get('/admin/complaints', { params })
      .then((r) => ({ data: Array.isArray(r.data) ? r.data : r.data?.complaints ?? [] }))
      .catch(() => ({ data: getMockAllComplaints(params || {}) })),
  updateStatus: (id, status, adminNotes) =>
    apiClient
      .patch(`/admin/complaints/${id}`, { status, adminNotes })
      .then((r) => r)
      .catch(() => {
        const c = updateMockComplaintStatus(id, status, adminNotes)
        return c ? { data: c } : Promise.reject(new Error('Complaint not found'))
      }),
}

// Admin – Analytics
export const adminAnalyticsApi = {
  getStats: (params) => apiClient.get('/admin/analytics/stats', { params }).then((r) => r.data),
}

// Admin – Reports (download with auth token)
export const adminReportsApi = {
  downloadReport: (format, params = {}) =>
    apiClient
      .get('/admin/reports/export', { params: { format, ...params }, responseType: 'blob' })
      .then((res) => {
        const ext = format === 'pdf' ? 'pdf' : 'xlsx'
        const name = `complaints-report-${Date.now()}.${ext}`
        const url = URL.createObjectURL(new Blob([res.data]))
        const a = document.createElement('a')
        a.href = url
        a.download = name
        a.click()
        URL.revokeObjectURL(url)
      }),
}

// Chatbot (mock/stub – replace with real API)
export const chatbotApi = {
  sendMessage: (message) =>
    apiClient.post('/chatbot/message', { message }).catch(() => ({
      data: {
        reply: 'I can help you with complaint submission, tracking, and FAQs. What would you like to know?',
      },
    })),
}
