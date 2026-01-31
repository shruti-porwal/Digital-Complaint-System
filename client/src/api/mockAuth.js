/**
 * Mock auth for development when backend is unavailable.
 * Set VITE_USE_MOCK_AUTH=true to enable.
 */
export function useMockLogin(email, password) {
  const isAdmin = email?.toLowerCase().includes('admin')
  return {
    token: 'mock-token',
    user: {
      id: '1',
      email,
      name: email?.split('@')[0] || 'User',
      role: isAdmin ? 'admin' : 'user',
    },
  }
}
