import { useState } from 'react'
import { Button } from '../common'
import styles from './ReportProblemModal.module.css'

export function ReportProblemModal({ onClose }) {
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    setSubmitted(true)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Report a Problem</h3>
          <button onClick={onClose} aria-label="Close">×</button>
        </div>
        {submitted ? (
          <div className={styles.success}>
            <p>Thank you! Your feedback has been recorded. We&apos;ll look into it shortly.</p>
            <Button onClick={onClose}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className={styles.desc}>Having trouble with the complaint portal? Describe the issue below.</p>
            <textarea
              className="form-textarea"
              placeholder="E.g. Cannot submit form, page not loading, wrong status shown..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
            <div className={styles.actions}>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!message.trim()}>
                Submit
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
