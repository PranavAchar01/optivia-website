import Image from 'next/image';

export default function SiteNav() {
  return (
    <nav style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 20,
      display: 'flex',
      alignItems: 'center',
      padding: '0 2.5rem',
      height: '72px',
      background: 'rgba(0,0,0,0.35)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: '3px',
        background: '#00A0AE',
      }} />
      <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: 48, height: 48, overflow: 'hidden', flexShrink: 0 }}>
          <Image
            src="/logo.jpg"
            alt="Optivia logo"
            width={120}
            height={120}
            style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%', mixBlendMode: 'screen' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <span style={{
            fontFamily: 'var(--font-chakra-petch)',
            fontWeight: 700,
            fontSize: '1.4rem',
            color: '#ffffff',
            letterSpacing: '0.06em',
            lineHeight: 1,
          }}>
            OPTIVIA
          </span>
          <span style={{
            fontFamily: 'var(--font-fraunces)',
            fontWeight: 300,
            fontSize: '0.65rem',
            color: '#00A0AE',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            lineHeight: 1,
          }}>
            Intelligent Routing
          </span>
        </div>
      </a>
    </nav>
  );
}
