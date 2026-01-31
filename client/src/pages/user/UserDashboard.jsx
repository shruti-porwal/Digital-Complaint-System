import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { complaintApi } from '../../api/services'
import { subscribeComplaintUpdates } from '../../api/socket'
import { useAuth } from '../../context/AuthContext'
import { Card, Button, Loader } from '../../components/common'
import { StatusBadge } from '../../components/complaints/StatusBadge'
import { TrackingSearch } from '../../components/dashboard/TrackingSearch'
import { ReportProblemModal } from '../../components/dashboard/ReportProblemModal'
import { IconSubmit, IconTrack, IconReport, IconChevron } from '../../components/icons/Icons'
import styles from './UserDashboard.module.css'

export function UserDashboard() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showReportModal, setShowReportModal] = useState(false)

  const pending = complaints.filter((c) => c.status === 'pending').length
  const inProgress = complaints.filter((c) => c.status === 'in_progress').length
  const resolved = complaints.filter((c) => c.status === 'resolved').length

  const loadComplaints = () => {
    setLoading(true)
    complaintApi
      .getMyComplaints()
      .then((res) => {
        const data = res?.data
        setComplaints(Array.isArray(data) ? data : [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadComplaints()
  }, [])

  useEffect(() => {
    if (!user?.id) return
    const disconnect = subscribeComplaintUpdates({ userId: user.id }, () => {
      loadComplaints()
    })
    return disconnect
  }, [user?.id])

  if (loading && complaints.length === 0) return <Loader />
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1>Home</h1>
        <p>Manage your complaints and track their status</p>
      </div>

      <div className={styles.actions}>
        <Link to="/home/submit" className={styles.actionCard}>
          <div className={styles.actionCardHeader}>
            <span className={styles.actionIcon}><IconSubmit /></span>
            <h3>Submit Complaint</h3>
          </div>
          <p>File a new complaint with details and attachments</p>
        </Link>
        <div className={styles.actionCard}>
          <div className={styles.actionCardHeader}>
            <span className={styles.actionIcon}><IconTrack /></span>
            <h3>Track Complaint</h3>
          </div>
          <TrackingSearch onFound={() => loadComplaints()} />
        </div>
        <button
          type="button"
          className={styles.actionCard}
          onClick={() => setShowReportModal(true)}
        >
          <div className={styles.actionCardHeader}>
            <span className={styles.actionIcon}><IconReport /></span>
            <h3>Report a Problem</h3>
          </div>
          <p>Having issues with this portal? Let us know</p>
        </button>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>My Complaints</h2>
          <Link to="/home/submit">
            <Button>+ New Complaint</Button>
          </Link>
        </div>

        {complaints.length === 0 ? (
          <Card className={styles.empty}>
            <p>You haven&apos;t submitted any complaints yet.</p>
            <Link to="/home/submit">
              <Button>Submit your first complaint</Button>
            </Link>
          </Card>
        ) : (
          <div className={styles.list}>
            {complaints.map((c) => (
              <Card key={c.id} className={styles.item}>
                <div className={styles.itemHead}>
                  <h3>{c.title}</h3>
                  <StatusBadge status={c.status} />
                </div>
                <p className={styles.meta}>
                  <span className={styles.category}>{c.category}</span>
                  <span>ID: {c.id}</span>
                </p>
                <p className={styles.desc}>{c.description?.slice(0, 100)}...</p>
                <Link to={`/home/complaints/${c.id}`} className={styles.link}>
                  View details <IconChevron />
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>

      {showReportModal && (
        <ReportProblemModal onClose={() => setShowReportModal(false)} />
      )}
    </div>
  )
}
