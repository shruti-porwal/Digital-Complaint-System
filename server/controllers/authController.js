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

  register(req, res) {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' })
    }

    const result = authService.register(name, email, password)
    if (!result.success) {
      return res.status(400).json({ message: result.message })
    }
    res.status(201).json({ user: result.user, token: result.token })
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
