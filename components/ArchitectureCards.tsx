'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const stages = [
  {
    number: '01',
    label: 'Getting started',
    title: 'Smart model selection',
    description: 'Optivia starts by choosing the best model for each request and tracking what works. This helps the system improve over time without adding extra work for your team.',
  },
  {
    number: '02',
    label: 'Learning phase',
    title: 'Learns from real usage',
    description: 'As more requests flow through Optivia, it learns which models perform best for different tasks. That means better results, lower cost, and smarter decisions with every update.',
  },
  {
    number: '03',
    label: 'At scale',
    title: 'Fast, reliable production',
    description: 'In production, Optivia routes requests instantly, reuses what it has already learned, and adds safeguards to keep everything running smoothly. It works quietly in the background so teams get speed and reliability at scale.',
  },
];

type Ripple = { id: number; x: number; y: number };

function RippleButton({ onClick }: { onClick: () => void }) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const { left, top } = btn.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const id = Date.now();
    setRipples(r => [...r, { id, x, y }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
    onClick();
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#000000',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '12px',
        padding: '0.75rem 1.4rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        width: '100%',
        marginTop: '2rem',
      }}
    >
      {/* Ripples */}
      <AnimatePresence>
        {ripples.map(rp => (
          <motion.span
            key={rp.id}
            initial={{ width: 0, height: 0, opacity: 0.35, x: rp.x, y: rp.y }}
            animate={{ width: 400, height: 400, opacity: 0, x: rp.x - 200, y: rp.y - 200 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              background: 'rgba(0,160,174,0.3)',
              pointerEvents: 'none',
            }}
          />
        ))}
      </AnimatePresence>

      <span style={{
        fontFamily: 'var(--font-fraunces)',
        fontStyle: 'italic',
        fontWeight: 400,
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.7)',
        position: 'relative',
        zIndex: 1,
        flex: 1,
        textAlign: 'left',
      }}>
        Learn more
      </span>
      <span style={{
        fontFamily: 'var(--font-chakra-petch)',
        fontSize: '0.65rem',
        color: '#00A0AE',
        position: 'relative',
        zIndex: 1,
      }}>
        →
      </span>
    </button>
  );
}

function Card({ stage, index }: { stage: typeof stages[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [gloss, setGloss] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setRotateY((x - 0.5) * 18);
    setRotateX((0.5 - y) * 18);
    setGloss({ x: x * 100, y: y * 100, opacity: 0.12 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGloss(g => ({ ...g, opacity: 0 }));
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ perspective: 800 }}
      >
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          animate={{ rotateX, rotateY }}
          transition={{ type: 'spring', stiffness: 300, damping: 28, mass: 0.5 }}
          style={{
            background: 'linear-gradient(145deg, #2a2a2e 0%, #111113 60%, #000000 100%)',
            borderRadius: '30px',
            padding: '42px 42px 48px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            transformStyle: 'preserve-3d',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)',
            cursor: 'default',
            willChange: 'transform',
            height: '280px',
          }}
        >
          {/* Gloss sheen */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '30px',
            background: `radial-gradient(circle at ${gloss.x}% ${gloss.y}%, rgba(255,255,255,${gloss.opacity}) 0%, transparent 65%)`,
            pointerEvents: 'none',
            zIndex: 1,
          }} />

          {/* Top edge highlight */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)',
            pointerEvents: 'none',
            zIndex: 1,
          }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{
                fontFamily: 'var(--font-fraunces)',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: '1.08rem',
                color: '#00A0AE',
                letterSpacing: '0.02em',
              }}>
                {stage.label}
              </span>
              <span style={{
                fontFamily: 'var(--font-chakra-petch)',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.2)',
              }}>
                {stage.number}
              </span>
            </div>

            <h3 style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: '1.875rem',
              letterSpacing: '-0.02em',
              color: '#ffffff',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
            }}>
              {stage.title}
            </h3>

            <p style={{
              fontFamily: 'var(--font-fraunces)',
              fontWeight: 400,
              fontSize: '1.1rem',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.75,
            }}>
              {stage.description}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Ripple button — only under card 01 */}
      {index === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <RippleButton onClick={() => router.push('/how-it-works')} />
        </motion.div>
      )}
    </div>
  );
}

export default function ArchitectureCards() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1.5rem',
      alignItems: 'start',
      gridAutoRows: 'min-content',
    }}>
      {stages.map((stage, i) => (
        <Card key={stage.number} stage={stage} index={i} />
      ))}
    </div>
  );
}
