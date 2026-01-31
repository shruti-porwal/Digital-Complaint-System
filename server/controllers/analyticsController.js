import { analyticsService } from '../services/analyticsService.js'

export const analyticsController = {
  getStats(req, res) {
    const { fromDate, toDate, status, category } = req.query
    const filters = {}
    if (fromDate) filters.fromDate = fromDate
    if (toDate) filters.toDate = toDate
    if (status) filters.status = status
    if (category) filters.category = category
    const stats = analyticsService.getStats(filters)
    res.json(stats)
  },
}
