import Spline from '@splinetool/react-spline/next';
import SiteNav from '@/components/SiteNav';

export default function Home() {
  return (
    <main style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Spline scene="https://prod.spline.design/OTmSgEcHc41O9qNq/scene.splinecode" />

      <SiteNav />

      {/* Text overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: '18% 4%',
        pointerEvents: 'none',
      }}>
        <p style={{
          fontSize: '0.75rem',
          fontWeight: 400,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#00A0AE',
          marginBottom: '1.25rem',
          fontFamily: 'var(--font-fraunces)',
        }}>
          Intelligent Routing · Claude Code
        </p>

        <h1 style={{
          fontSize: 'clamp(1.8rem, 3vw, 3.25rem)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          color: '#ffffff',
          maxWidth: '14ch',
          marginBottom: '1.5rem',
          fontFamily: 'var(--font-syne)',
        }}>
          Intelligent Model Routing for Claude Code
        </h1>

        <p style={{
          fontSize: 'clamp(0.85rem, 1.1vw, 0.975rem)',
          color: 'rgba(255,255,255,0.7)',
          maxWidth: '42ch',
          lineHeight: 1.65,
          marginBottom: '2.5rem',
          fontFamily: 'var(--font-fraunces)',
        }}>
          Optimize cost, quality, and performance with Optivia&apos;s layered routing architecture — intelligently selecting between Haiku, Sonnet, and Opus on every request.
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          pointerEvents: 'auto',
        }}>
          <a href="/models" className="btn-primary">
            View Architecture
          </a>
          <a href="/docs" className="btn-secondary">
            Read the Docs
          </a>
        </div>
      </div>
    </main>
  );
}
