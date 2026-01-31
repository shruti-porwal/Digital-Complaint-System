const STATUS_ORDER = ['pending', 'in_progress', 'resolved', 'rejected']

export function StatusTimeline({ status }) {
  const currentIdx = STATUS_ORDER.indexOf(status) >= 0 ? STATUS_ORDER.indexOf(status) : 0

  return (
    <div className="status-timeline">
      {STATUS_ORDER.map((s, i) => (
        <div
          key={s}
          className={`timeline-step ${i <= currentIdx ? 'done' : ''} ${i === currentIdx ? 'current' : ''}`}
        >
          <div className="timeline-dot" />
          <span className="timeline-label">{s.replace('_', ' ')}</span>
          {i < STATUS_ORDER.length - 1 && <div className="timeline-line" />}
        </div>
      ))}
    </div>
  )
}
