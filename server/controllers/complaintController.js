import { complaintService } from '../services/complaintService.js'

export const complaintController = {
  create(req, res) {
    const { title, description, category, attachments } = req.body
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' })
    }
    const complaint = complaintService.create(
      { title, description, category, attachments },
      req.user.id
    )
    res.status(201).json(complaint)
  },

  getMyComplaints(req, res) {
    const complaints = complaintService.getMyComplaints(req.user.id)
    res.json(complaints)
  },

  getById(req, res) {
    const complaint = complaintService.getById(req.params.id, req.user.id, req.user.role === 'admin')
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' })
    }
    res.json(complaint)
  },
}
