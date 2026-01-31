import { complaintService } from '../services/complaintService.js'

export const adminController = {
  getAllComplaints(req, res) {
    const { status, category, search } = req.query
    const filters = {}
    if (status) filters.status = status
    if (category) filters.category = category
    if (search) filters.search = String(search).trim()
    const complaints = complaintService.getAll(filters)
    res.json(complaints)
  },

  updateStatus(req, res) {
    const { id } = req.params
    const { status, adminNotes } = req.body
    if (!status) {
      return res.status(400).json({ message: 'status is required' })
    }
    const complaint = complaintService.updateStatus(id, status, adminNotes)
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' })
    }
    const io = req.app.get('io')
    if (io) {
      io.to(`complaint:${id}`).emit('complaint:updated', complaint)
      io.to(`user:${complaint.userId}`).emit('complaint:updated', complaint)
    }
    res.json(complaint)
  },
}
