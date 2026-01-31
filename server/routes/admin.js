import { Router } from 'express'
import { adminController } from '../controllers/adminController.js'
import { requireAuth } from '../middlewares/auth.js'
import { authorize } from '../middlewares/authorize.js'

const router = Router()

router.use(requireAuth, authorize('admin'))

router.get('/complaints', adminController.getAllComplaints)
router.patch('/complaints/:id', adminController.updateStatus)

export default router
