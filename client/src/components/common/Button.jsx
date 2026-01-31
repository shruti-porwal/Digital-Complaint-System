export function Button({ children, variant = 'primary', loading, ...props }) {
  return (
    <button
      className={`btn btn-${variant}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <span className="btn-spinner" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  )
}
