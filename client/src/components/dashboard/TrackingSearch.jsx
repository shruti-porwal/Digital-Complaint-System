import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { complaintApi } from '../../api/services'
import { Button } from '../common'
import styles from './TrackingSearch.module.css'

export function TrackingSearch({ onFound }) {
  const [id, setId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e?.preventDefault()
    if (!id.trim()) return
    setError('')
    setLoading(true)
    try {
      const { data } = await complaintApi.getById(id.trim())
      if (data) {
        navigate(`/home/complaints/${data.id}`)
        onFound?.()
      }
    } catch (err) {
      setError('Complaint not found. Check the ID and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSearch} className={styles.form}>
      <input
        type="text"
        placeholder="Enter complaint ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="form-input"
      />
      <Button type="submit" loading={loading} className={styles.btn}>
        Track
      </Button>
      {error && <span className={styles.err}>{error}</span>}
    </form>
  )
}
