import SiteNav from '@/components/SiteNav';

export default function ArchitecturePage() {
  return (
    <main style={{ position: 'relative', width: '100%', height: '100%' }}>
      <SiteNav />
      {/* Grid + radial glow background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        background: [
          'linear-gradient(rgba(0,160,174,0.045) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(0,160,174,0.045) 1px, transparent 1px)',
          'radial-gradient(ellipse 65% 55% at 68% 105%, rgba(0,160,174,0.18) 0%, transparent 65%)',
          '#080808',
        ].join(', '),
        backgroundSize: '48px 48px, 48px 48px, 100% 100%, 100% 100%',
      }} />

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
          <h1 style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 'clamp(1.8rem, 2.6vw, 2.8rem)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: '#ffffff',
          }}>
            The right model for every request.
          </h1>
        </div>


      </div>
    </main>
  );
}
