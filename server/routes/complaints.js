import { Router } from 'express'
import { complaintController } from '../controllers/complaintController.js'
import { requireAuth } from '../middlewares/auth.js'
import { authorize } from '../middlewares/authorize.js'

const router = Router()

router.use(requireAuth, authorize('user', 'admin'))

router.post('/', complaintController.create)
router.get('/me', complaintController.getMyComplaints)
router.get('/:id', complaintController.getById)

export default router
