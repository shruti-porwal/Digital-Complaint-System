import { COMPLAINT_STATUSES, COMPLAINT_CATEGORIES } from '../../types'
import styles from './ComplaintFilters.module.css'

export function ComplaintFilters({ filters, onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value })

  return (
    <div className={styles.filters}>
      <input
        type="search"
        placeholder="Search by title..."
        className="form-input"
        value={filters.search || ''}
        onChange={(e) => update('search', e.target.value)}
      />
      <select
        className="form-select"
        value={filters.status || ''}
        onChange={(e) => update('status', e.target.value)}
      >
        <option value="">All statuses</option>
        {COMPLAINT_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.replace('_', ' ')}
          </option>
        ))}
      </select>
      <select
        className="form-select"
        value={filters.category || ''}
        onChange={(e) => update('category', e.target.value)}
      >
        <option value="">All categories</option>
        {COMPLAINT_CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
    </div>
  )
}
