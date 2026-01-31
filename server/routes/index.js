import { Router } from 'express'
import authRoutes from './auth.js'
import complaintRoutes from './complaints.js'
import adminRoutes from './admin.js'
import { chatbotController } from '../controllers/chatbotController.js'
import { optionalAuth } from '../middlewares/auth.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/complaints', complaintRoutes)
router.use('/admin', adminRoutes)
router.post('/chatbot/message', optionalAuth, chatbotController.message)

export default router
