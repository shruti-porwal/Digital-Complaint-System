import { authService } from '../services/authService.js'

export const authController = {
  login(req, res) {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }
    const result = authService.login(email, password)
    if (!result.success) {
      return res.status(401).json({ message: result.message })
    }
    res.json({ user: result.user, token: result.token })
  },

  logout(_req, res) {
    res.json({ message: 'Logged out' })
  },

  me(req, res) {
    const user = authService.getProfile(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  },
}
