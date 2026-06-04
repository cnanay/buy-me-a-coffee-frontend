const COLORS = ['#f59e0b', '#d97706', '#b45309', '#fbbf24', '#92400e', '#fcd34d'];

// Deterministic pseudo-random in [0,1) — pure (unlike Math.random), so it's
// safe to call during render and keeps the linter happy. Good enough to
// scatter confetti convincingly.
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// Pieces are fully deterministic, so compute them once at module load.
const PIECES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  left: rand(i) * 100,
  delay: rand(i + 100) * 0.3,
  duration: 2.2 + rand(i + 200) * 1.3,
  color: COLORS[i % COLORS.length],
}));

/**
 * A lightweight, dependency-free confetti burst. Pieces animate purely via CSS,
 * so there is no effect/state churn — the parent mounts it when a tip succeeds
 * and unmounts it afterwards.
 */
export function Confetti() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50">
      {PIECES.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
