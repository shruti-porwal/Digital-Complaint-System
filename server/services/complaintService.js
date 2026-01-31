import { Complaint } from '../models/Complaint.js'

export const complaintService = {
  create(data, userId) {
    return Complaint.create({
      title: data.title,
      description: data.description,
      category: data.category || 'other',
      userId,
      attachments: data.attachments,
    })
  },

  getMyComplaints(userId) {
    return Complaint.findByUserId(userId)
  },

  getById(id, userId, isAdmin = false) {
    const c = Complaint.findById(id)
    if (!c) return null
    if (!isAdmin && c.userId !== userId) return null
    return c
  },

  getAll(filters) {
    return Complaint.findAll(filters)
  },

  updateStatus(id, status, adminNotes) {
    return Complaint.updateStatus(id, status, adminNotes)
  },
}
