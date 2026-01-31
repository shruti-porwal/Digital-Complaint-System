import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/common'
import styles from './NotificationsPage.module.css'

// Mock notifications - replace with API in production
const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Complaint submitted', message: 'Your complaint "Network connectivity issues" has been received.', type: 'success', date: new Date().toISOString(), read: false, complaintId: 'mock-1' },
  { id: '2', title: 'Status update', message: 'Complaint "Billing discrepancy" is now In Progress.', type: 'info', date: new Date(Date.now() - 86400000).toISOString(), read: true, complaintId: 'mock-2' },
  { id: '3', title: 'Resolved', message: 'Your complaint has been resolved. Thank you for your patience.', type: 'success', date: new Date(Date.now() - 172800000).toISOString(), read: true },
]

function getTimeAgo(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now - d
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString()
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    setNotifications(MOCK_NOTIFICATIONS)
  }, [])

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1>Notifications</h1>
        <p>{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</p>
      </div>

      {notifications.length === 0 ? (
        <Card className={styles.empty}>
          <p>No notifications yet.</p>
          <p className={styles.emptySub}>Updates about your complaints will appear here.</p>
        </Card>
      ) : (
        <div className={styles.list}>
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={`${styles.item} ${!n.read ? styles.unread : ''} ${n.complaintId ? styles.clickable : ''}`}
              onClick={() => n.complaintId && markAsRead(n.id)}
            >
              <div className={styles.itemHeader}>
                <span className={styles[`type-${n.type}`]}>{n.type}</span>
                <span className={styles.time}>{getTimeAgo(n.date)}</span>
              </div>
              <h3>{n.title}</h3>
              <p>{n.message}</p>
              {n.complaintId && (
                <Link to={`/home/complaints/${n.complaintId}`} className={styles.link}>
                  View complaint →
                </Link>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
