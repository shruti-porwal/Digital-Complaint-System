export function Input({ label, error, ...props }) {
  return (
    <div className="form-group">
      {label && <label htmlFor={props.id}>{label}</label>}
      <input
        className={`form-input ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <span className="error">{error}</span>}
    </div>
  )
}
