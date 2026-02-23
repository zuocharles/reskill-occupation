import Link from 'next/link'

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '24px',
    }}>
      <h1 style={{
        fontFamily: "'Libre Baskerville', serif",
        fontSize: '2.5rem',
        color: '#5C5248',
      }}>
        Reskill Occupation
      </h1>
      <p style={{ color: '#8D837A', fontSize: '1.1rem' }}>
        See how AI transforms your career skills
      </p>
      <Link
        href="/onboarding"
        className="btn-primary"
        style={{ padding: '14px 40px', fontSize: '14px' }}
      >
        Start Reskill Flow
      </Link>
    </div>
  )
}
