import Spline from '@splinetool/react-spline/next';
import RippleBackground from '@/components/RippleBackground';
import SiteNav from '@/components/SiteNav';

export default function ArchitecturePage() {
  return (
    <main style={{ position: 'relative', width: '100%', height: '100%' }}>
      <SiteNav />
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <Spline scene="https://prod.spline.design/oZgVPSMtvgTBGXv2/scene.splinecode" />
      </div>

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: '22%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: '100px 5% 0 5%',
        zIndex: 10,
        pointerEvents: 'none',
        gap: '2rem',
      }}>

        {/* Headline */}
        <div>
          <p style={{
            fontFamily: 'var(--font-fraunces)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: '0.75rem',
            color: '#00A0AE',
            letterSpacing: '0.05em',
            marginBottom: '0.6rem',
          }}>
            How Optivia works
          </p>
          <h1 style={{
            fontFamily: 'var(--font-fraunces)',
            fontWeight: 700,
            fontSize: 'clamp(1.8rem, 2.6vw, 2.8rem)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: '#ffffff',
          }}>
            The right model,{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 400, color: 'rgba(255,255,255,0.45)' }}>
              every single time.
            </span>
          </h1>
        </div>


      </div>
    </main>
  );
}
