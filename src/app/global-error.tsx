'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: '#f9fafb',
        }}>
          <div style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#fee2e2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
            }}>
              <svg
                width="40"
                height="40"
                fill="none"
                stroke="#dc2626"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h1 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '16px',
            }}>
              Something went wrong
            </h1>

            <p style={{
              color: '#6b7280',
              marginBottom: '32px',
            }}>
              A critical error occurred. Please refresh the page or try again later.
            </p>

            <button
              onClick={() => reset()}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                fontWeight: '500',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
