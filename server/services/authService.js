import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'
import { db } from '../config/database.js'
import { User } from '../models/User.js'

export const authService = {
  login(email, password) {
    const user = User.findByEmail(email)
    if (!user) {
      return { success: false, message: 'Invalid email or password' }
    }
    const row = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(user.id)
    const ok = bcrypt.compareSync(password, row.password_hash)
    if (!ok) {
      return { success: false, message: 'Invalid email or password' }
    }
    const token = jwt.sign({ sub: user.id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn })
    return { success: true, user, token }
  },

  register(name, email, password) {
    const existingUser = User.findByEmail(email)
    if (existingUser) {
      return { success: false, message: 'Email already registered' }
    }
    const passwordHash = bcrypt.hashSync(password, 10)
    const newUser = User.create({ email, passwordHash, name, role: 'user' })
    const token = jwt.sign({ sub: newUser.id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn })
    return { success: true, user: newUser, token }
  },

  getProfile(userId) {
    return User.findById(userId) || null
  },
}
