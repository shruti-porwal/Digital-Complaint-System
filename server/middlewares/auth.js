import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'
import { User } from '../models/User.js'

/**
 * Verify JWT and attach req.user. Does not reject if no token (for optional auth).
 */
export function optionalAuth(req, res, next) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return next()
  try {
    const payload = jwt.verify(token, config.jwtSecret)
    const user = User.findById(payload.sub)
    if (user) req.user = user
  } catch (_) {}
  next()
}

/**
 * Require valid JWT. Responds 401 if missing or invalid.
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' })
  }
  try {
    const payload = jwt.verify(token, config.jwtSecret)
    const user = User.findById(payload.sub)
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
