'use client'

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '2.5rem 2rem',
        background: 'var(--bg)',
      }}
    >
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ maxWidth: 1400, margin: '0 auto' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: '0.75rem',
            fontWeight: 300,
            color: 'rgba(242,240,236,0.45)',
          }}
        >
          &copy; {new Date().getFullYear()} Ebgueny PJ
        </span>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/EbguenyPJ"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: '0.75rem',
              fontWeight: 400,
              color: 'rgba(242,240,236,0.5)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-green)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(242,240,236,0.5)' }}
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/ebgueny"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: '0.75rem',
              fontWeight: 400,
              color: 'rgba(242,240,236,0.5)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-green)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(242,240,236,0.5)' }}
          >
            LinkedIn
          </a>
        </div>

        <span
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: '0.65rem',
            fontWeight: 300,
            color: 'rgba(242,240,236,0.3)',
            letterSpacing: '0.04em',
          }}
        >
          Built with Next.js & Framer Motion. Deployed on Vercel.
        </span>
      </div>
    </footer>
  )
}
