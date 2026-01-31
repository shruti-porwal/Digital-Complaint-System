import { useState, useEffect } from 'react'
import { adminComplaintApi } from '../../api/services'
import { Card, Button, Loader } from '../../components/common'
import { StatusBadge } from '../../components/complaints/StatusBadge'
import { ComplaintFilters } from '../../components/admin/ComplaintFilters'
import { UpdateStatusModal } from '../../components/admin/UpdateStatusModal'
import { COMPLAINT_STATUSES } from '../../types'
import styles from './AdminDashboard.module.css'

export function AdminDashboard() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ status: '', category: '', search: '' })
  const [selectedComplaint, setSelectedComplaint] = useState(null)

  const loadComplaints = () => {
    setLoading(true)
    adminComplaintApi
      .getAll(filters)
      .then((res) => {
        const data = res?.data
        setComplaints(Array.isArray(data) ? data : [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadComplaints()
  }, [filters])

  const handleStatusUpdated = () => {
    setSelectedComplaint(null)
    loadComplaints()
  }

  const pending = complaints.filter((c) => c.status === 'pending').length
  const inProgress = complaints.filter((c) => c.status === 'in_progress').length
  const resolved = complaints.filter((c) => c.status === 'resolved').length

  if (loading && complaints.length === 0) return <Loader />
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1>Complaint Management</h1>
        <p>View and manage all submitted complaints</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{complaints.length}</div>
          <div className={styles.statLabel}>Total</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{pending}</div>
          <div className={styles.statLabel}>Pending</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{inProgress}</div>
          <div className={styles.statLabel}>In Progress</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{resolved}</div>
          <div className={styles.statLabel}>Resolved</div>
        </div>
      </div>

      <ComplaintFilters filters={filters} onChange={setFilters} />

      {loading ? (
        <div className={styles.loadingOverlay}>Refreshing...</div>
      ) : complaints.length === 0 ? (
        <Card className={styles.empty}>No complaints match your filters.</Card>
      ) : (
        <div className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.title}</strong>
                  </td>
                  <td className={styles.capitalize}>{c.category}</td>
                  <td>
                    <StatusBadge status={c.status} />
                  </td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedComplaint(c)}
                    >
                      Update
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {selectedComplaint && (
        <UpdateStatusModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onSaved={handleStatusUpdated}
        />
      )}
    </div>
  )
}
