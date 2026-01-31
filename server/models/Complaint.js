import { db } from '../config/database.js'

const STATUSES = ['pending', 'in_progress', 'resolved', 'rejected']
const CATEGORIES = ['technical', 'billing', 'service', 'other']

export const Complaint = {
  create({ title, description, category, userId, attachments }) {
    const id = crypto.randomUUID()
    const categoryOk = CATEGORIES.includes(category) ? category : 'other'
    const attachmentsJson = attachments ? JSON.stringify(attachments) : null
    db.prepare(
      `INSERT INTO complaints (id, title, description, category, user_id, attachments_json)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(id, title, description, categoryOk, userId, attachmentsJson)
    return this.findById(id)
  },

  findById(id) {
    const row = db.prepare('SELECT * FROM complaints WHERE id = ?').get(id)
    return row ? rowToComplaint(row) : null
  },

  findByUserId(userId) {
    const rows = db
      .prepare('SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC')
      .all(userId)
    return rows.map(rowToComplaint)
  },

  findAll(filters = {}) {
    let sql = 'SELECT * FROM complaints WHERE 1=1'
    const params = []
    if (filters.status) {
      sql += ' AND status = ?'
      params.push(filters.status)
    }
    if (filters.category) {
      sql += ' AND category = ?'
      params.push(filters.category)
    }
    if (filters.search) {
      sql += ' AND (title LIKE ? OR description LIKE ?)'
      const term = `%${filters.search}%`
      params.push(term, term)
    }
    sql += ' ORDER BY created_at DESC'
    const rows = params.length ? db.prepare(sql).all(...params) : db.prepare(sql).all()
    return rows.map(rowToComplaint)
  },

  updateStatus(id, status, adminNotes) {
    if (!STATUSES.includes(status)) return null
    const now = new Date().toISOString()
    const result = db
      .prepare(
        'UPDATE complaints SET status = ?, admin_notes = COALESCE(?, admin_notes), updated_at = ? WHERE id = ?'
      )
      .run(status, adminNotes ?? null, now, id)
    if (result.changes === 0) return null
    return this.findById(id)
  },
}

function rowToComplaint(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    status: row.status,
    userId: row.user_id,
    adminNotes: row.admin_notes ?? undefined,
    attachments: row.attachments_json ? JSON.parse(row.attachments_json) : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
