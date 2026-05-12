'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SiteNav from '@/components/SiteNav';

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });

type Sample = {
  prompt: string;
  model: 'Haiku' | 'Sonnet' | 'Opus';
  modelBadge: string;
  mode: 'Standard' | 'Thinking';
  modeBadge: string;
  agents?: { role: string; desc: string }[];
};

const SAMPLES: Sample[] = [
  {
    prompt: 'What is the capital of France?',
    model: 'Haiku', modelBadge: '#4ade80',
    mode: 'Standard', modeBadge: '#60a5fa',
  },
  {
    prompt: 'Refactor this React component for readability.',
    model: 'Sonnet', modelBadge: '#00A0AE',
    mode: 'Standard', modeBadge: '#60a5fa',
  },
  {
    prompt: 'Design a fault-tolerant distributed cache.',
    model: 'Opus', modelBadge: '#a78bfa',
    mode: 'Thinking', modeBadge: '#f59e0b',
    agents: [
      { role: 'architect',    desc: 'system design & consistency trade-offs' },
      { role: 'critic',       desc: 'failure mode & edge case analysis' },
      { role: 'synthesizer',  desc: 'final implementation plan' },
    ],
  },
  {
    prompt: 'List the top 5 Python web frameworks.',
    model: 'Haiku', modelBadge: '#4ade80',
    mode: 'Standard', modeBadge: '#60a5fa',
  },
  {
    prompt: 'Architect a self-healing microservice mesh.',
    model: 'Opus', modelBadge: '#a78bfa',
    mode: 'Thinking', modeBadge: '#f59e0b',
    agents: [
      { role: 'planner',     desc: 'topology & service orchestration' },
      { role: 'resilience',  desc: 'fault detection & recovery loops' },
      { role: 'reviewer',    desc: 'security & observability audit' },
      { role: 'synthesizer', desc: 'final architecture spec' },
    ],
  },
  {
    prompt: 'Write unit tests for the auth module.',
    model: 'Sonnet', modelBadge: '#00A0AE',
    mode: 'Standard', modeBadge: '#60a5fa',
  },
];

type Phase = 'typing' | 'analyzing' | 'model' | 'mode' | 'fleet' | 'agents' | 'done';

const MONO: React.CSSProperties = { fontFamily: 'var(--font-geist-mono)' };

function Badge({ color, children }: { color: string; children: string }) {
  return (
    <span style={{
      background: color, color: '#000',
      fontFamily: 'var(--font-syne)', fontWeight: 700,
      fontSize: '0.7rem', letterSpacing: '0.06em',
      padding: '0.18rem 0.6rem', borderRadius: '4px',
      display: 'inline-block',
    }}>{children}</span>
  );
}

function Line({ dim = false, children }: { dim?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
      <span style={{ ...MONO, fontSize: '0.65rem', color: dim ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.35)', flexShrink: 0, paddingTop: '2px' }}>·</span>
      <span style={{ ...MONO, fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
        {children}
      </span>
    </div>
  );
}

function AgentLine({ role, desc, visible }: { role: string; desc: string; visible: boolean }) {
  return (
    <div style={{
      display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
      paddingLeft: '1.5rem',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(4px)',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
    }}>
      <span style={{ ...MONO, fontSize: '0.65rem', color: '#a78bfa', flexShrink: 0, paddingTop: '2px' }}>↳</span>
      <span style={{ ...MONO, fontSize: '0.8rem', lineHeight: 1.5 }}>
        <span style={{ color: '#ffffff', fontWeight: 600 }}>{role}</span>
        <span style={{ color: 'rgba(255,255,255,0.35)' }}> — {desc}</span>
      </span>
    </div>
  );
}

export default function ArchitecturePage() {
  const [idx, setIdx]           = useState(0);
  const [phase, setPhase]       = useState<Phase>('typing');
  const [chars, setChars]       = useState(0);
  const [agentCount, setAgentCount] = useState(0);

  const sample = SAMPLES[idx];
  const isComplex = !!sample.agents;

  // reset on new sample
  useEffect(() => {
    setPhase('typing');
    setChars(0);
    setAgentCount(0);
  }, [idx]);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      if (chars < sample.prompt.length) {
        t = setTimeout(() => setChars(c => c + 1), 28);
      } else {
        t = setTimeout(() => setPhase('analyzing'), 400);
      }
    } else if (phase === 'analyzing') {
      t = setTimeout(() => setPhase('model'), 950);
    } else if (phase === 'model') {
      t = setTimeout(() => setPhase('mode'), 550);
    } else if (phase === 'mode') {
      t = setTimeout(() => setPhase(isComplex ? 'fleet' : 'done'), 600);
    } else if (phase === 'fleet') {
      t = setTimeout(() => setPhase('agents'), 850);
    } else if (phase === 'agents') {
      const total = sample.agents?.length ?? 0;
      if (agentCount < total) {
        t = setTimeout(() => setAgentCount(c => c + 1), 380);
      } else {
        t = setTimeout(() => setPhase('done'), 3200);
      }
    } else if (phase === 'done') {
      t = setTimeout(() => setIdx(i => (i + 1) % SAMPLES.length), isComplex ? 200 : 2200);
    }

    return () => clearTimeout(t);
  }, [phase, chars, agentCount, sample, isComplex]);

  return (
    <main style={{ position: 'relative', width: '100%', height: '100%', background: '#080808' }}>
      <Spline scene="https://prod.spline.design/oZgVPSMtvgTBGXv2/scene.splinecode" />
      <SiteNav />

      <div style={{
        position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(8,8,8,0.88) 0%, rgba(8,8,8,0.75) 25%, rgba(8,8,8,0.0) 55%)',
      }} />

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

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', width: '100%', marginTop: '1rem' }} />

        {/* Content row */}
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start', marginTop: '1.75rem' }}>

          {/* Subtitle */}
          <p style={{
            fontFamily: 'var(--font-fraunces)', fontWeight: 300,
            fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.7, margin: 0, maxWidth: '22ch', flexShrink: 0,
          }}>
            Optivia picks the model, the reasoning mode, and the agent configuration — all from a single API call.
          </p>

          {/* Single combined terminal */}
          <div style={{
            flex: '1 1 0',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: '10px',
            overflow: 'hidden',
            transition: 'all 0.4s ease',
          }}>
            {/* Title bar */}
            <div style={{
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              padding: '0.5rem 1rem',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}>
              {['#ff5f57','#febc2e','#28c840'].map(c => (
                <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.7 }} />
              ))}
              <span style={{
                marginLeft: '0.5rem',
                fontFamily: 'var(--font-chakra-petch)',
                fontSize: '0.58rem', letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase',
              }}>optivia router</span>

              {/* Live model+mode badges in title bar once resolved */}
              {(phase === 'model' || phase === 'mode' || phase === 'fleet' || phase === 'agents' || phase === 'done') && (
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  {(phase === 'mode' || phase === 'fleet' || phase === 'agents' || phase === 'done') && (
                    <Badge color={sample.modelBadge}>{sample.model}</Badge>
                  )}
                  {(phase === 'fleet' || phase === 'agents' || phase === 'done') && (
                    <Badge color={sample.modeBadge}>{sample.mode}</Badge>
                  )}
                </div>
              )}
            </div>

            {/* Body */}
            <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>

              {/* Prompt */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ ...MONO, fontSize: '0.68rem', color: '#00A0AE', flexShrink: 0, paddingTop: '2px' }}>›</span>
                <span style={{ ...MONO, fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
                  {sample.prompt.slice(0, chars)}
                  {phase === 'typing' && (
                    <span style={{ display: 'inline-block', width: '2px', height: '1em', background: '#00A0AE', marginLeft: '1px', verticalAlign: 'text-bottom', animation: 'blink 0.75s step-end infinite' }} />
                  )}
                </span>
              </div>

              {/* Analyzing */}
              {phase === 'analyzing' && (
                <Line><span style={{ animation: 'pulse 1s ease-in-out infinite' }}>analyzing request···</span></Line>
              )}

              {/* Model */}
              {(phase === 'model' || phase === 'mode' || phase === 'fleet' || phase === 'agents' || phase === 'done') && (
                <Line>
                  model <Badge color={sample.modelBadge}>{sample.model}</Badge>
                  <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: '0.5rem' }}>
                    {sample.model === 'Haiku' ? '· fast · low cost' : sample.model === 'Sonnet' ? '· balanced quality' : '· best reasoning'}
                  </span>
                </Line>
              )}

              {/* Mode */}
              {(phase === 'mode' || phase === 'fleet' || phase === 'agents' || phase === 'done') && (
                <Line>
                  mode{'  '}<Badge color={sample.modeBadge}>{sample.mode}</Badge>
                  <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: '0.5rem' }}>
                    {sample.mode === 'Standard' ? '· direct response' : '· extended reasoning enabled'}
                  </span>
                </Line>
              )}

              {/* Fleet header */}
              {(phase === 'fleet' || phase === 'agents' || phase === 'done') && isComplex && (
                <Line>
                  {phase === 'fleet'
                    ? <span style={{ animation: 'pulse 1s ease-in-out infinite' }}>configuring agent fleet···</span>
                    : 'agent fleet ready'
                  }
                </Line>
              )}

              {/* Agents */}
              {(phase === 'agents' || phase === 'done') && isComplex && sample.agents?.map((agent, i) => (
                <AgentLine key={agent.role} role={agent.role} desc={agent.desc} visible={i < agentCount} />
              ))}

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
