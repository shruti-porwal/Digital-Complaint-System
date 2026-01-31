import { useState } from 'react'
import { adminReportsApi } from '../../api/services'
import { Card, Button } from '../../components/common'
import { COMPLAINT_CATEGORIES } from '../../types'
import styles from './ReportsPage.module.css'

export function ReportsPage() {
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    status: '',
    category: '',
  })
  const [downloading, setDownloading] = useState(null)

  const handleDownload = (format) => {
    setDownloading(format)
    const params = {}
    if (filters.fromDate) params.fromDate = filters.fromDate
    if (filters.toDate) params.toDate = filters.toDate
    if (filters.status) params.status = filters.status
    if (filters.category) params.category = filters.category
    adminReportsApi
      .downloadReport(format, params)
      .finally(() => setDownloading(null))
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1>Reports</h1>
        <p>Generate and download complaint reports (PDF or Excel)</p>
      </div>

      <Card className={styles.card}>
        <h2 className={styles.cardTitle}>Filter report</h2>
        <div className={styles.filters}>
          <label>
            <span>From date</span>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value }))}
            />
          </label>
          <label>
            <span>To date</span>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value }))}
            />
          </label>
          <label>
            <span>Status</span>
            <select
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <label>
            <span>Category</span>
            <select
              value={filters.category}
              onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
            >
              <option value="">All</option>
              {COMPLAINT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.actions}>
          <Button
            onClick={() => handleDownload('excel')}
            disabled={downloading !== null}
          >
            {downloading === 'excel' ? 'Downloading…' : 'Download Excel'}
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleDownload('pdf')}
            disabled={downloading !== null}
          >
            {downloading === 'pdf' ? 'Downloading…' : 'Download PDF'}
          </Button>
        </div>
      </Card>

      <p className={styles.hint}>
        Reports include all complaints matching the selected filters. Use date range and status/category to narrow results.
      </p>
    </div>
  )
}
