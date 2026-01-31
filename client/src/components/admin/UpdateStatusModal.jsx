import { useState } from 'react'
import { adminComplaintApi } from '../../api/services'
import { Button } from '../common'
import { COMPLAINT_STATUSES } from '../../types'
import styles from './UpdateStatusModal.module.css'

export function UpdateStatusModal({ complaint, onClose, onSaved }) {
  const [status, setStatus] = useState(complaint.status)
  const [adminNotes, setAdminNotes] = useState(complaint.adminNotes || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await adminComplaintApi.updateStatus(complaint.id, status, adminNotes)
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Update Complaint</h3>
          <button className={styles.close} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <p className={styles.title}>{complaint.title}</p>
        <form onSubmit={handleSubmit}>
          {error && <div className={styles.apiError}>{error}</div>}
          <div className="form-group">
            <label>Status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {COMPLAINT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Admin notes</label>
            <textarea
              className="form-textarea"
              placeholder="Internal notes for this complaint..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
            />
          </div>
          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
