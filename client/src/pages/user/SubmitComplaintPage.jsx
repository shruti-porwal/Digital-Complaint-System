import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { complaintApi } from '../../api/services'
import { Card, Input, Button } from '../../components/common'
import { COMPLAINT_CATEGORIES } from '../../types'
import styles from './SubmitComplaintPage.module.css'

export function SubmitComplaintPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('technical')
  const [files, setFiles] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const navigate = useNavigate()

  const validate = () => {
    const err = {}
    if (!title.trim()) err.title = 'Title is required'
    else if (title.trim().length < 5) err.title = 'Title must be at least 5 characters'
    if (!description.trim()) err.description = 'Description is required'
    else if (description.trim().length < 20)
      err.description = 'Please provide more details (min 20 chars)'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || [])
    setFiles((prev) => [...prev, ...selected].slice(0, 5))
  }

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validate()) return

    setLoading(true)
    try {
      const payload = { title, description, category }
      if (files.length > 0) {
        payload.attachments = files.map((f) => ({ name: f.name, size: f.size }))
      }
      const { data } = await complaintApi.create(payload)
      navigate(`/home/complaints/${data.id}`)
    } catch (err) {
      setError(err.message || 'Failed to submit complaint')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <Card>
        <h2>Submit a Complaint</h2>
        <p className={styles.subtitle}>Include all relevant details and attachments</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.apiError}>{error}</div>}
          <Input
            label="Title"
            placeholder="Brief summary of your complaint"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
          />
          <div className="form-group">
            <label>Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {COMPLAINT_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              className={`form-textarea ${errors.description ? 'input-error' : ''}`}
              placeholder="Describe your issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && (
              <span className="error">{errors.description}</span>
            )}
          </div>
          <div className="form-group">
            <label>Attachments (optional)</label>
            <div className={styles.uploadArea} onClick={() => fileInputRef.current?.click()}>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
              <span className={styles.uploadText}>
                Click to upload or drag files here (PDF, images, docs)
              </span>
            </div>
            {files.length > 0 && (
              <ul className={styles.fileList}>
                {files.map((f, i) => (
                  <li key={i}>
                    <span>{f.name}</span>
                    <button type="button" onClick={() => removeFile(i)} aria-label="Remove">
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Submit Complaint
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
