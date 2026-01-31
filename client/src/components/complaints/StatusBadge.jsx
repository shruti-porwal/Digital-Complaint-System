const STATUS_COLORS = {
  pending: 'status-pending',
  in_progress: 'status-progress',
  resolved: 'status-resolved',
  rejected: 'status-rejected',
}

export function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${STATUS_COLORS[status] || ''}`}>
      {status?.replace('_', ' ')}
    </span>
  )
}
