'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SiteNav from '@/components/SiteNav';

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });

type ModelSample = { prompt: string; tier: string; badge: string; desc: string };
type ModeSample  = { prompt: string; mode: string; badge: string; desc: string };
type AnySample   = { prompt: string; badge: string; desc: string; [key: string]: string };

// Terminal 1 — model routing
const MODEL_SAMPLES: ModelSample[] = [
  { prompt: 'Summarize this paragraph in one sentence.', tier: 'Haiku',  badge: '#4ade80', desc: 'Fast · $0.00025 / 1k tokens' },
  { prompt: 'Refactor this React component for readability.', tier: 'Sonnet', badge: '#00A0AE', desc: 'Balanced · $0.003 / 1k tokens' },
  { prompt: 'Design a fault-tolerant distributed cache.', tier: 'Opus',   badge: '#a78bfa', desc: 'Complex · $0.015 / 1k tokens' },
  { prompt: 'What does this variable name mean?',          tier: 'Haiku',  badge: '#4ade80', desc: 'Fast · $0.00025 / 1k tokens' },
  { prompt: 'Write integration tests for this service.',   tier: 'Sonnet', badge: '#00A0AE', desc: 'Balanced · $0.003 / 1k tokens' },
];

// Terminal 2 — thinking mode selection
const MODE_SAMPLES: ModeSample[] = [
  { prompt: 'What is the capital of France?',                   mode: 'Standard',  badge: '#60a5fa', desc: 'Direct response · no overhead' },
  { prompt: 'Find the flaw in this distributed lock design.',   mode: 'Thinking',  badge: '#f59e0b', desc: 'Extended reasoning · step-by-step' },
  { prompt: 'Translate this sentence to Spanish.',              mode: 'Standard',  badge: '#60a5fa', desc: 'Direct response · no overhead' },
  { prompt: 'Optimise this O(n³) graph traversal algorithm.',   mode: 'Thinking',  badge: '#f59e0b', desc: 'Extended reasoning · trace paths' },
  { prompt: 'List the top 5 Python web frameworks.',            mode: 'Standard',  badge: '#60a5fa', desc: 'Direct response · no overhead' },
];

type Phase = 'typing' | 'routing' | 'result';

function useTerminal(samples: AnySample[], offset = 0) {
  const [idx, setIdx]     = useState(offset % samples.length);
  const [phase, setPhase] = useState<Phase>('typing');
  const [chars, setChars] = useState(0);
  const sample = samples[idx];

  useEffect(() => { setPhase('typing'); setChars(0); }, [idx]);

  useEffect(() => {
    if (phase === 'typing') {
      if (chars < sample.prompt.length) {
        const t = setTimeout(() => setChars(c => c + 1), 30);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase('routing'), 500);
      return () => clearTimeout(t);
    }
    if (phase === 'routing') {
      const t = setTimeout(() => setPhase('result'), 1000);
      return () => clearTimeout(t);
    }
    if (phase === 'result') {
      const t = setTimeout(() => setIdx(i => (i + 1) % samples.length), 2600);
      return () => clearTimeout(t);
    }
  }, [phase, chars, sample.prompt.length, samples.length]);

  return { idx, phase, chars, sample };
}

function Terminal({
  label,
  accentColor,
  phase,
  chars,
  sample,
  legendItems,
  activeKey,
}: {
  label: string;
  accentColor: string;
  phase: Phase;
  chars: number;
  sample: AnySample;
  legendItems: { name: string; color: string; label: string }[];
  activeKey: string;
}) {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
      {/* Terminal card */}
      <div style={{
        flex: '1 1 0',
        background: 'rgba(255,255,255,0.035)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: '10px',
        overflow: 'hidden',
      }}>
        {/* Title bar */}
        <div style={{
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '0.5rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          {['#ff5f57','#febc2e','#28c840'].map(c => (
            <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.7 }} />
          ))}
          <span style={{
            marginLeft: '0.5rem',
            fontFamily: 'var(--font-chakra-petch)',
            fontSize: '0.58rem',
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.22)',
            textTransform: 'uppercase',
          }}>{label}</span>
        </div>

        {/* Body */}
        <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '68px' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '0.68rem', color: accentColor, paddingTop: '1px', flexShrink: 0 }}>›</span>
            <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, minHeight: '1.4em' }}>
              {sample.prompt.slice(0, chars)}
              {phase === 'typing' && (
                <span style={{ display: 'inline-block', width: '2px', height: '1em', background: accentColor, marginLeft: '1px', verticalAlign: 'text-bottom', animation: 'blink 0.75s step-end infinite' }} />
              )}
            </span>
          </div>

          {(phase === 'routing' || phase === 'result') && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.18)', flexShrink: 0 }}>·</span>
              {phase === 'routing' ? (
                <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.32)', animation: 'pulse 1s ease-in-out infinite' }}>
                  analyzing···
                </span>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <span style={{
                    background: sample.badge, color: '#000',
                    fontFamily: 'var(--font-syne)', fontWeight: 700,
                    fontSize: '0.72rem', letterSpacing: '0.05em',
                    padding: '0.2rem 0.65rem', borderRadius: '4px',
                  }}>{activeKey}</span>
                  <span style={{ fontFamily: 'var(--font-fraunces)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.36)' }}>
                    {sample.desc}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexShrink: 0, paddingTop: '0.25rem' }}>
        {legendItems.map(item => (
          <div key={item.name} style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            opacity: activeKey === item.name ? 1 : 0.38,
            transition: 'opacity 0.4s ease',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%', background: item.color, flexShrink: 0,
              boxShadow: activeKey === item.name ? `0 0 8px ${item.color}` : 'none',
              transition: 'box-shadow 0.4s ease',
            }} />
            <span style={{ fontFamily: 'var(--font-chakra-petch)', fontWeight: 600, fontSize: '0.7rem', color: '#fff', letterSpacing: '0.06em', minWidth: '56px' }}>{item.name}</span>
            <span style={{ fontFamily: 'var(--font-fraunces)', fontSize: '0.76rem', color: 'rgba(255,255,255,0.38)' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ArchitecturePage() {
  const t1 = useTerminal(MODEL_SAMPLES as AnySample[], 0);
  const t2 = useTerminal(MODE_SAMPLES as AnySample[], 2);

  return (
    <main style={{ position: 'relative', width: '100%', height: '100%', background: '#080808' }}>
      <Spline scene="https://prod.spline.design/oZgVPSMtvgTBGXv2/scene.splinecode" />
      <SiteNav />

      {/* Gradient */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(8,8,8,0.85) 0%, rgba(8,8,8,0.72) 22%, rgba(8,8,8,0.0) 52%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none',
        display: 'flex', flexDirection: 'column',
        padding: '80px 4% 0 4%',
      }}>
        {/* Heading */}
        <h1 style={{
          fontFamily: 'var(--font-syne)', fontWeight: 800,
          fontSize: '3.8vw', lineHeight: 1.0, letterSpacing: '-0.03em',
          color: '#ffffff', margin: 0,
        }}>
          The right model for every request.
        </h1>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', width: '100%', marginTop: '1rem' }} />

        {/* Row: subtitle + both terminals stacked + (legends embedded in Terminal) */}
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start', marginTop: '1.75rem' }}>

          {/* Left: subtitle */}
          <p style={{
            fontFamily: 'var(--font-fraunces)', fontWeight: 300,
            fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.7, margin: 0, maxWidth: '22ch', flexShrink: 0,
          }}>
            Optivia inspects each prompt and routes it to the right model, in the right mode — automatically.
          </p>

          {/* Right: two terminals stacked */}
          <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <Terminal
              label="model router"
              accentColor="#00A0AE"
              phase={t1.phase}
              chars={t1.chars}
              sample={t1.sample}
              activeKey={t1.phase === 'result' ? t1.sample.tier : ''}
              legendItems={[
                { name: 'Haiku',  color: '#4ade80', label: 'Simple, fast, cheap' },
                { name: 'Sonnet', color: '#00A0AE', label: 'Balanced quality & cost' },
                { name: 'Opus',   color: '#a78bfa', label: 'Complex reasoning' },
              ]}
            />
            <Terminal
              label="mode selector"
              accentColor="#f59e0b"
              phase={t2.phase}
              chars={t2.chars}
              sample={t2.sample}
              activeKey={t2.phase === 'result' ? t2.sample.mode : ''}
              legendItems={[
                { name: 'Standard', color: '#60a5fa', label: 'Direct, no overhead' },
                { name: 'Thinking', color: '#f59e0b', label: 'Extended reasoning' },
              ]}
            />
          </div>

        </div>
      </div>
    </main>
  );
}
