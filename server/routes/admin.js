import { Router } from 'express'
import { adminController } from '../controllers/adminController.js'
import { analyticsController } from '../controllers/analyticsController.js'
import { reportsController } from '../controllers/reportsController.js'
import { requireAuth } from '../middlewares/auth.js'
import { authorize } from '../middlewares/authorize.js'

const router = Router()

router.use(requireAuth, authorize('admin'))

router.get('/complaints', adminController.getAllComplaints)
router.patch('/complaints/:id', adminController.updateStatus)
router.get('/analytics/stats', analyticsController.getStats)
router.get('/reports/export', reportsController.exportReport)

export default router
