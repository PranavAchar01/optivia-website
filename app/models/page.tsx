'use client';

import { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline/next';
import SiteNav from '@/components/SiteNav';

const SAMPLES = [
  { prompt: 'Summarize this paragraph in one sentence.', tier: 'Haiku',  badge: '#4ade80', desc: 'Fast · $0.00025 / 1k tokens' },
  { prompt: 'Refactor this React component for readability.', tier: 'Sonnet', badge: '#00A0AE', desc: 'Balanced · $0.003 / 1k tokens' },
  { prompt: 'Design a fault-tolerant distributed cache.', tier: 'Opus',   badge: '#a78bfa', desc: 'Complex · $0.015 / 1k tokens' },
  { prompt: 'What does this variable name mean?', tier: 'Haiku',  badge: '#4ade80', desc: 'Fast · $0.00025 / 1k tokens' },
  { prompt: 'Write integration tests for this service.', tier: 'Sonnet', badge: '#00A0AE', desc: 'Balanced · $0.003 / 1k tokens' },
];

type Phase = 'typing' | 'routing' | 'result';

export default function ArchitecturePage() {
  const [idx, setIdx]         = useState(0);
  const [phase, setPhase]     = useState<Phase>('typing');
  const [chars, setChars]     = useState(0);

  const sample = SAMPLES[idx];

  // reset on new sample
  useEffect(() => {
    setPhase('typing');
    setChars(0);
  }, [idx]);

  useEffect(() => {
    if (phase === 'typing') {
      if (chars < sample.prompt.length) {
        const t = setTimeout(() => setChars(c => c + 1), 32);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase('routing'), 550);
      return () => clearTimeout(t);
    }
    if (phase === 'routing') {
      const t = setTimeout(() => setPhase('result'), 1100);
      return () => clearTimeout(t);
    }
    if (phase === 'result') {
      const t = setTimeout(() => setIdx(i => (i + 1) % SAMPLES.length), 2800);
      return () => clearTimeout(t);
    }
  }, [phase, chars, sample.prompt.length]);

  return (
    <main style={{ position: 'relative', width: '100%', height: '100%' }}>
      <SiteNav />

      {/* Spline background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <Spline scene="https://prod.spline.design/oZgVPSMtvgTBGXv2/scene.splinecode" />
      </div>

      {/* Dark gradient so left-side text is always readable */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        background: 'linear-gradient(100deg, rgba(8,8,8,0.92) 42%, rgba(8,8,8,0.3) 70%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 5%',
        paddingTop: '72px',
        maxWidth: '580px',
        gap: '2rem',
        pointerEvents: 'none',
      }}>

        {/* Heading block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 'clamp(2rem, 3vw, 3rem)',
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            margin: 0,
          }}>
            The right model<br />for every request.
          </h1>
          <p style={{
            fontFamily: 'var(--font-fraunces)',
            fontWeight: 300,
            fontSize: '0.95rem',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.65,
            margin: 0,
            maxWidth: '38ch',
          }}>
            Optivia inspects each prompt and routes it to Haiku, Sonnet, or Opus — cutting cost without touching quality.
          </p>
        </div>

        {/* Live routing demo */}
        <div style={{
          background: 'rgba(255,255,255,0.035)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}>
          {/* Terminal header strip */}
          <div style={{
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            padding: '0.55rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            {['#ff5f57','#febc2e','#28c840'].map(c => (
              <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.7 }} />
            ))}
            <span style={{
              marginLeft: '0.5rem',
              fontFamily: 'var(--font-chakra-petch)',
              fontSize: '0.6rem',
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.25)',
              textTransform: 'uppercase',
            }}>optivia router</span>
          </div>

          {/* Body */}
          <div style={{ padding: '1.1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

            {/* Prompt line */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{
                fontFamily: 'var(--font-geist-mono)',
                fontSize: '0.7rem',
                color: '#00A0AE',
                paddingTop: '1px',
                flexShrink: 0,
              }}>›</span>
              <span style={{
                fontFamily: 'var(--font-geist-mono)',
                fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.8)',
                lineHeight: 1.5,
                minHeight: '1.5em',
              }}>
                {sample.prompt.slice(0, chars)}
                {phase === 'typing' && (
                  <span style={{ display: 'inline-block', width: '2px', height: '1em', background: '#00A0AE', marginLeft: '1px', verticalAlign: 'text-bottom', animation: 'blink 0.75s step-end infinite' }} />
                )}
              </span>
            </div>

            {/* Routing line */}
            {(phase === 'routing' || phase === 'result') && (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.2)',
                  flexShrink: 0,
                }}>·</span>
                {phase === 'routing' ? (
                  <span style={{
                    fontFamily: 'var(--font-geist-mono)',
                    fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.35)',
                    animation: 'pulse 1s ease-in-out infinite',
                  }}>
                    analyzing request···
                  </span>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      background: sample.badge,
                      color: '#000',
                      fontFamily: 'var(--font-syne)',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      letterSpacing: '0.06em',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '3px',
                    }}>
                      {sample.tier}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-fraunces)',
                      fontSize: '0.78rem',
                      color: 'rgba(255,255,255,0.38)',
                    }}>
                      {sample.desc}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tier legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {[
            { name: 'Haiku',  color: '#4ade80', label: 'Simple, fast, cheap' },
            { name: 'Sonnet', color: '#00A0AE', label: 'Balanced quality & cost' },
            { name: 'Opus',   color: '#a78bfa', label: 'Complex reasoning, best quality' },
          ].map((tier, i) => (
            <div key={tier.name} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              opacity: phase === 'result' && SAMPLES[idx].tier === tier.name ? 1 : 0.45,
              transition: 'opacity 0.4s ease',
            }}>
              <div style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: tier.color,
                flexShrink: 0,
                boxShadow: phase === 'result' && SAMPLES[idx].tier === tier.name ? `0 0 8px ${tier.color}` : 'none',
                transition: 'box-shadow 0.4s ease',
              }} />
              <span style={{
                fontFamily: 'var(--font-chakra-petch)',
                fontWeight: 600,
                fontSize: '0.72rem',
                color: '#fff',
                letterSpacing: '0.06em',
                minWidth: '52px',
              }}>{tier.name}</span>
              <span style={{
                fontFamily: 'var(--font-fraunces)',
                fontSize: '0.78rem',
                color: 'rgba(255,255,255,0.45)',
              }}>{tier.label}</span>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
