import { db } from '../config/database.js'

export const User = {
  findByEmail(email) {
    const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
    return row ? rowToUser(row) : null
  },

  findById(id) {
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
    return row ? rowToUser(row) : null
  },

  create({ email, passwordHash, name, role = 'user' }) {
    const id = crypto.randomUUID()
    db.prepare(
      'INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)'
    ).run(id, email, passwordHash, name, role)
    return this.findById(id)
  },
}

function rowToUser(row) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    createdAt: row.created_at,
  }
}
