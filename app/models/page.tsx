'use client';

import { useState, useEffect, useRef, memo } from 'react';
import dynamic from 'next/dynamic';
import SiteNav from '@/components/SiteNav';

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });

// ─── types ────────────────────────────────────────────────────────────────────

type OutputLine = {
  label: string;
  value: string;
  valueColor?: string;       // colour the whole value
  highlight?: string;        // substring to highlight in teal
  indent?: boolean;          // ↳ sub-line
  pulse?: boolean;           // animated "···" suffix while it's the last line
  delay: number;             // ms after previous line appears
};

type Sample = {
  prompt: string;
  lines: OutputLine[];
  holdMs: number;
};

// ─── samples — every scenario maps directly to the LangGraph node sequence ────

const SAMPLES: Sample[] = [
  // 1. TRIVIAL → Haiku 4.5  (no clarify, fastest path)
  {
    prompt: 'Rename variable \'x\' to \'itemCount\' throughout this file.',
    holdMs: 2200,
    lines: [
      { label: 'cache_lookup',  value: 'miss',                                           delay: 420  },
      { label: 'fast_intent',   value: 'TRIVIAL · conf 0.96',   highlight: 'TRIVIAL',   delay: 340  },
      { label: 'classify',      value: 'complexity 0.06 · risk 0.02 · scope 0.14',       delay: 480  },
      { label: 'clarify',       value: 'skip — ambiguity 0.19 < 0.60',                   delay: 280  },
      { label: 'synthesize',    value: '124 tokens · preamble cached',                   delay: 520  },
      { label: 'route',         value: 'Haiku 4.5 · complexity 0.06 < 0.30',  highlight: 'Haiku 4.5', valueColor: '#4ade80', delay: 320 },
      { label: 'dispatch',      value: 'executing via Claude Code···', pulse: true,       delay: 280  },
    ],
  },

  // 2. CACHE HIT — short-circuit, no classification needed
  {
    prompt: 'What does the --no-verify flag skip in git commit?',
    holdMs: 2000,
    lines: [
      { label: 'cache_lookup',  value: 'HIT · similarity 0.97', valueColor: '#4ade80',  delay: 350  },
      { label: 'replay',        value: 'cached master prompt + routing decision',         delay: 280  },
      { label: 'route',         value: 'Haiku 4.5 · from cache', highlight: 'Haiku 4.5', valueColor: '#4ade80', delay: 240 },
      { label: 'dispatch',      value: 'executing via Claude Code···', pulse: true,       delay: 260  },
    ],
  },

  // 3. DEBUG → Sonnet 4.6  (mid-complexity, no clarify)
  {
    prompt: 'Fix the race condition in my Express auth middleware.',
    holdMs: 2400,
    lines: [
      { label: 'cache_lookup',  value: 'miss',                                                    delay: 400 },
      { label: 'fast_intent',   value: 'DEBUG · conf 0.89',       highlight: 'DEBUG',             delay: 360 },
      { label: 'classify',      value: 'complexity 0.54 · risk 0.63 · scope 0.41',                delay: 500 },
      { label: 'clarify',       value: 'skip — ambiguity 0.38 < 0.60',                            delay: 270 },
      { label: 'synthesize',    value: '891 tokens · preamble cached',                            delay: 560 },
      { label: 'route',         value: 'Sonnet 4.6 · complexity in [0.30, 0.70)', highlight: 'Sonnet 4.6', valueColor: '#00A0AE', delay: 320 },
      { label: 'dispatch',      value: 'executing via Claude Code···', pulse: true,                delay: 280 },
    ],
  },

  // 4. NEW_CODE → Opus 4.6 + clarifications + extended thinking
  {
    prompt: 'Build a distributed rate limiter with Redis and Lua scripting.',
    holdMs: 3000,
    lines: [
      { label: 'cache_lookup',  value: 'miss',                                                    delay: 400 },
      { label: 'fast_intent',   value: 'NEW_CODE · conf 0.82',    highlight: 'NEW_CODE',          delay: 360 },
      { label: 'classify',      value: 'complexity 0.84 · risk 0.72 · ambiguity 0.71',            delay: 520 },
      { label: 'clarify',       value: 'ambiguity 0.71 ≥ 0.60 — generating questions···', pulse: true, delay: 310 },
      { label: '?',             value: 'Consistency model: strong or eventual?', indent: true,    delay: 820 },
      { label: '?',             value: 'Target RPS and p99 latency budget?',     indent: true,    delay: 420 },
      { label: 'synthesize',    value: '1,247 tokens · preamble cached',                          delay: 640 },
      { label: 'route',         value: 'Opus 4.6 · complexity 0.84 ≥ 0.70', highlight: 'Opus 4.6', valueColor: '#a78bfa', delay: 340 },
      { label: 'thinking',      value: 'extended reasoning enabled', valueColor: '#f59e0b',        delay: 280 },
      { label: 'dispatch',      value: 'executing via Claude Code···', pulse: true,                delay: 280 },
    ],
  },

  // 5. LONG → Opus 4.6 + clarify + thinking + subagent decomposition
  {
    prompt: 'Migrate the entire payments API from REST to GraphQL.',
    holdMs: 3400,
    lines: [
      { label: 'cache_lookup',  value: 'miss',                                                           delay: 400 },
      { label: 'fast_intent',   value: 'LONG · conf 0.77',            highlight: 'LONG',                delay: 360 },
      { label: 'classify',      value: 'complexity 0.91 · risk 0.85 · scope 0.94 · dependency 0.88',    delay: 540 },
      { label: 'clarify',       value: 'scope 0.94 ≥ 0.70 — generating questions···', pulse: true,      delay: 310 },
      { label: '?',             value: 'Which services are in scope: payments only or auth + notifications?', indent: true, delay: 880 },
      { label: 'synthesize',    value: '2,104 tokens · preamble cached',                                 delay: 680 },
      { label: 'route',         value: 'Opus 4.6 · complexity 0.91 + risk 0.85', highlight: 'Opus 4.6', valueColor: '#a78bfa', delay: 340 },
      { label: 'thinking',      value: 'extended reasoning enabled', valueColor: '#f59e0b',               delay: 260 },
      { label: 'subagents',     value: 'scope 0.94 → decomposing into 4 agents···', pulse: true,         delay: 320 },
      { label: '↳',             value: 'planner        dependency graph & migration topology', indent: true, delay: 500 },
      { label: '↳',             value: 'schema-builder  GraphQL schema + resolver generation', indent: true, delay: 380 },
      { label: '↳',             value: 'verifier        integration test coverage',            indent: true, delay: 380 },
      { label: '↳',             value: 'synthesizer     final diff + migration runbook',       indent: true, delay: 380 },
      { label: 'dispatch',      value: 'executing via Claude Code···', pulse: true,                       delay: 300 },
    ],
  },
];

// ─── sub-components ───────────────────────────────────────────────────────────

const MONO: React.CSSProperties = { fontFamily: 'var(--font-geist-mono)' };
const LABEL_W = '88px';

const Terminal = memo(() => {
  const [idx, setIdx]         = useState(0);
  const [chars, setChars]     = useState(0);
  const [typing, setTyping]   = useState(true);
  const [reveal, setReveal]   = useState(0);   // how many lines shown
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const sample = SAMPLES[idx];

  // reset on new sample
  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setChars(0);
    setTyping(true);
    setReveal(0);
  }, [idx]);

  // effect 1: typing — increments chars, then flips typing→false
  useEffect(() => {
    if (!typing) return;
    if (chars < sample.prompt.length) {
      const t = setTimeout(() => setChars(c => c + 1), 26);
      return () => clearTimeout(t);
    }
    setTyping(false);
  }, [typing, chars, sample.prompt.length]);

  // effect 2: once typing is done, schedule reveals (separate so cleanup doesn't cancel them)
  useEffect(() => {
    if (typing) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    let acc = 0;
    sample.lines.forEach((line, i) => {
      acc += line.delay;
      const t = setTimeout(() => setReveal(i + 1), acc);
      timers.current.push(t);
    });
    const holdT = setTimeout(
      () => setIdx(n => (n + 1) % SAMPLES.length),
      acc + sample.holdMs,
    );
    timers.current.push(holdT);
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, [typing]); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleLines = sample.lines.slice(0, reveal);

  return (
    <div style={{
      flex: '1 1 0', background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.09)', borderRadius: '10px', overflow: 'hidden',
    }}>
      {/* Title bar */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
      }}>
        {['#ff5f57','#febc2e','#28c840'].map(c => (
          <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.7 }} />
        ))}
        <span style={{ marginLeft: '0.5rem', fontFamily: 'var(--font-chakra-petch)', fontSize: '0.58rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>
          optivia · langgraph engine
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>

        {/* Prompt */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
          <span style={{ ...MONO, fontSize: '0.65rem', color: '#00A0AE', flexShrink: 0, paddingTop: '2px', width: LABEL_W, textAlign: 'right' }}>›</span>
          <span style={{ ...MONO, fontSize: '0.88rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1.5 }}>
            {sample.prompt.slice(0, chars)}
            {typing && (
              <span style={{ display: 'inline-block', width: '2px', height: '1em', background: '#00A0AE', marginLeft: '1px', verticalAlign: 'text-bottom', animation: 'blink 0.75s step-end infinite' }} />
            )}
          </span>
        </div>

        {/* Output lines */}
        {visibleLines.map((line, i) => {
          const isLast   = i === visibleLines.length - 1;
          const isIndent = line.indent || line.label === '↳' || line.label === '?';
          const showPulse = isLast && line.pulse;

          return (
            <div key={i} style={{
              display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
              paddingLeft: isIndent ? '1.5rem' : 0,
              opacity: 1,
              animation: 'fadeSlideIn 0.2s ease',
            }}>
              {/* Label */}
              <span style={{
                ...MONO, fontSize: '0.65rem', flexShrink: 0, paddingTop: '2px',
                width: isIndent ? 'auto' : LABEL_W,
                textAlign: isIndent ? 'left' : 'right',
                color: line.label === '?' ? '#f59e0b'
                     : line.label === '↳' ? '#a78bfa'
                     : 'rgba(255,255,255,0.28)',
              }}>
                {isIndent ? (line.label === '↳' ? '↳' : '?') : `${line.label}`}
              </span>

              {/* Value */}
              <span style={{
                ...MONO, fontSize: '0.82rem', lineHeight: 1.5,
                color: line.valueColor ?? 'rgba(255,255,255,0.52)',
              }}>
                {line.highlight ? (
                  <>
                    <span style={{ color: line.valueColor ?? '#fff', fontWeight: 600 }}>{line.highlight}</span>
                    {line.value.slice(line.highlight.length)}
                  </>
                ) : line.value}
                {showPulse && <span style={{ animation: 'pulse 1s ease-in-out infinite', color: 'rgba(255,255,255,0.35)' }}> ···</span>}
              </span>
            </div>
          );
        })}

      </div>
    </div>
  );
});

Terminal.displayName = 'Terminal';

const SplineBackground = memo(() => (
  <Spline scene="https://prod.spline.design/oZgVPSMtvgTBGXv2/scene.splinecode" />
));

SplineBackground.displayName = 'SplineBackground';

export default function ArchitecturePage() {
  return (
    <main style={{ position: 'relative', width: '100%', height: '100%', background: '#080808' }}>
      <SplineBackground />
      <SiteNav />

      <div style={{
        position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(8,8,8,0.90) 0%, rgba(8,8,8,0.76) 26%, rgba(8,8,8,0.0) 58%)',
      }} />

      <div style={{
        position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none',
        display: 'flex', flexDirection: 'column', padding: '80px 4% 0 4%',
      }}>
        {/* Heading */}
        <h1 style={{
          fontFamily: 'var(--font-syne)', fontWeight: 800,
          fontSize: '3.8vw', lineHeight: 1.0, letterSpacing: '-0.03em',
          color: '#fff', margin: 0,
        }}>
          The right model for every request.
        </h1>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', width: '100%', marginTop: '1rem' }} />

        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start', marginTop: '1.75rem' }}>
          {/* Subtitle */}
          <p style={{
            fontFamily: 'var(--font-fraunces)', fontWeight: 300, fontSize: '0.875rem',
            color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, margin: 0,
            maxWidth: '22ch', flexShrink: 0,
          }}>
            Optivia intercepts every prompt, runs it through the full classification and routing pipeline, and dispatches the optimised master prompt to Claude Code.
          </p>

          {/* Terminal */}
          <Terminal />
        </div>
      </div>
    </main>
  );
}
