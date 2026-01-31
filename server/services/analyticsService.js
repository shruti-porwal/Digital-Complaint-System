import { Complaint } from '../models/Complaint.js'

export const analyticsService = {
  getStats(filters = {}) {
    const byStatus = Complaint.getStatsByStatus(filters)
    const byCategory = Complaint.getStatsByCategory(filters)
    const byDate = Complaint.getStatsByDate(filters)
    const total = Complaint.findAll(filters).length
    const pending = byStatus.find((s) => s.status === 'pending')?.count ?? 0
    const inProgress = byStatus.find((s) => s.status === 'in_progress')?.count ?? 0
    const resolved = byStatus.find((s) => s.status === 'resolved')?.count ?? 0
    const rejected = byStatus.find((s) => s.status === 'rejected')?.count ?? 0
    return {
      total,
      byStatus: { pending, inProgress, resolved, rejected },
      byStatusList: byStatus,
      byCategory,
      byDate,
    }
  },

  getReportData(filters = {}) {
    return Complaint.findAll(filters)
  },
}
