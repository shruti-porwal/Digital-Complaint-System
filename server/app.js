import express from 'express'
import cors from 'cors'
import { config } from './config/index.js'
import routes from './routes/index.js'

const app = express()

app.use(cors({ origin: config.corsOrigin, credentials: true, methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'] }))
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({
    service: 'Digital Complaint Management System – API',
    message: 'Use the frontend app (e.g. http://localhost:3000) or call API at /api',
    health: '/api/health',
    auth: '/api/auth/login',
  })
})

app.get('/api', (_req, res) => {
  res.json({ status: 'ok', service: 'digital-complaint-api', health: '/api/health' })
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'digital-complaint-api' })
})

app.use('/api', routes)

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ message: err.message || 'Internal server error' })
})

export default app
