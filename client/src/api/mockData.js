/**
 * Mock data store for demo when backend is unavailable.
 * Persists in localStorage for session continuity.
 */

const STORAGE_KEY = 'complaint_mock_data'

function getStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { complaints: [] }
  } catch {
    return { complaints: [] }
  }
}

function saveStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function getMockComplaints(userId) {
  const store = getStore()
  return store.complaints.filter((c) => c.userId === userId)
}

export function getMockComplaintById(id, userId) {
  const store = getStore()
  const c = store.complaints.find((c) => c.id === id)
  return c && (c.userId === userId || !userId) ? c : null
}

export function addMockComplaint(data, userId) {
  const store = getStore()
  const complaint = {
    id: `mock-${Date.now()}`,
    ...data,
    status: 'pending',
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  store.complaints.push(complaint)
  saveStore(store)
  return complaint
}

export function getMockAllComplaints(filters = {}) {
  let list = [...(getStore().complaints || [])]
  if (filters.status) list = list.filter((c) => c.status === filters.status)
  if (filters.category) list = list.filter((c) => c.category === filters.category)
  if (filters.search) {
    const q = filters.search.toLowerCase()
    list = list.filter((c) => c.title?.toLowerCase().includes(q))
  }
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function updateMockComplaintStatus(id, status, adminNotes) {
  const store = getStore()
  const idx = store.complaints.findIndex((c) => c.id === id)
  if (idx === -1) return null
  store.complaints[idx] = {
    ...store.complaints[idx],
    status,
    adminNotes: adminNotes ?? store.complaints[idx].adminNotes,
    updatedAt: new Date().toISOString(),
  }
  saveStore(store)
  return store.complaints[idx]
}
