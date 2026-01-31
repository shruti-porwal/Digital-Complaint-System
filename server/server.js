import http from 'http'
import { Server } from 'socket.io'
import { config } from './config/index.js'
import { initDatabase } from './config/database.js'
import app from './app.js'

initDatabase()

const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: config.corsOrigin },
  path: '/api/socket.io',
})

app.set('io', io)

io.on('connection', (socket) => {
  const userId = socket.handshake.auth?.userId
  const complaintId = socket.handshake.auth?.complaintId
  if (userId) {
    socket.join(`user:${userId}`)
  }
  if (complaintId) {
    socket.join(`complaint:${complaintId}`)
  }
})

const PORT = config.port

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\nPort ${PORT} is already in use.`)
    console.error('To free it on Windows, run:  netstat -ano | findstr :' + PORT)
    console.error('Then:  taskkill /PID <PID> /F')
    console.error('Or use another port:  set PORT=5001 && npm run server\n')
    process.exit(1)
  }
  throw err
})

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  console.log(`API base: http://localhost:${PORT}/api`)
  console.log('Demo: admin@example.com / admin123  |  user@example.com / user123')
})
