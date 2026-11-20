import React from 'react';

interface ConfettiBurstProps {
  burstKey: number;
}

const COLORS = ['#EA580C', '#2563EB', '#059669', '#D97706', '#E11D48'];

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({ burstKey }) => {
  if (burstKey === 0) return null;

  const pieces = Array.from({ length: 24 }, (_, idx) => ({
    id: `${burstKey}-${idx}`,
    left: `${(idx * 4.1 + (idx % 3) * 2.3) % 98}%`,
    delay: `${(idx % 6) * 0.04}s`,
    color: COLORS[idx % COLORS.length],
  }));

  return (
    <div
      key={burstKey}
      className="fixed inset-0 pointer-events-none overflow-hidden z-50"
      aria-hidden="true"
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 w-2.5 h-2.5 rounded-sm animate-confetti"
          style={{
            left: p.left,
            backgroundColor: p.color,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
};
