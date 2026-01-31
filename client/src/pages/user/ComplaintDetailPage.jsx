import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { complaintApi } from '../../api/services'
import { Card, Loader } from '../../components/common'
import { StatusBadge } from '../../components/complaints/StatusBadge'
import { StatusTimeline } from '../../components/complaints/StatusTimeline'
import styles from './ComplaintDetailPage.module.css'

export function ComplaintDetailPage() {
  const { id } = useParams()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    complaintApi
      .getById(id)
      .then((res) => setComplaint(res?.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader />
  if (error || !complaint)
    return (
      <div className={styles.page}>
        <div className={styles.error}>{error || 'Complaint not found'}</div>
        <Link to="/home">← Back to Home</Link>
      </div>
    )

  return (
    <div className={styles.page}>
      <Link to="/home" className={styles.back}>
        ← Back to Home
      </Link>

      <Card className={styles.trackingCard}>
        <h3>Status Tracking</h3>
        <StatusTimeline status={complaint.status} />
        <p className={styles.complaintId}>Complaint ID: {complaint.id}</p>
      </Card>

      <Card>
        <div className={styles.header}>
          <h2>{complaint.title}</h2>
          <StatusBadge status={complaint.status} />
        </div>
        <div className={styles.meta}>
          <span>Category: {complaint.category}</span>
          <span>Submitted: {new Date(complaint.createdAt).toLocaleDateString()}</span>
        </div>
        <p className={styles.description}>{complaint.description}</p>
        {complaint.attachments?.length > 0 && (
          <div className={styles.attachments}>
            <h4>Attachments</h4>
            <ul>
              {complaint.attachments.map((a, i) => (
                <li key={i}>{typeof a === 'object' ? a.name : a}</li>
              ))}
            </ul>
          </div>
        )}
        {complaint.adminNotes && (
          <div className={styles.adminNotes}>
            <h4>Admin notes</h4>
            <p>{complaint.adminNotes}</p>
          </div>
        )}
      </Card>
    </div>
  )
}
