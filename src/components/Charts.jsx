
import { useEffect, useRef, useState } from "react";

export function SparkBar({ data, color = "#4ade80", height = 40 }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    setProgress(0);
    let t0 = null;
    const dur = 700;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  if (!data.length) return null;

  const max = Math.max(...data.map(d => d.value), 1);
  const w   = 100 / data.length;

  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
      {data.map((d, i) => {
        const bh = (d.value / max) * (height - 4) * progress;
        return (
          <rect
            key={i}
            x={i * w + 0.5} y={height - bh}
            width={w - 1}   height={bh}
            fill={color}
            opacity={i === data.length - 1 ? 1 : 0.35}
            rx="1"
          />
        );
      })}
    </svg>
  );
}


export function DonutChart({ segments, size = 120 }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    setProgress(0);
    let t0 = null;
    const dur = 900;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [segments.map(s => s.value).join(",")]);

  const total = segments.reduce((a, b) => a + b.value, 0);

  if (!total) {
    return <div style={{ width: size, height: size, borderRadius: "50%", background: "#1e293b" }} />;
  }

  const r    = 40;
  const circ = 2 * Math.PI * r;

 
  const startAngle = -90;

  let offset = 0;
  const arcs = segments.map((s, i) => {
    const pct  = (s.value / total) * progress; 
    const dash = pct * circ;
    const gap  = circ - dash;

    const el = (
      <circle
        key={i}
        cx="50" cy="50" r={r}
        fill="none"
        stroke={s.color}
        strokeWidth="16"
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={-(offset) * circ}
        transform={`rotate(${startAngle} 50 50)`}
        style={{ filter: `drop-shadow(0 0 4px ${s.color}66)` }}
      />
    );
    offset += s.value / total;
    return el;
  });


  const opacity = progress;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      {/* Trilha de fundo */}
      <circle cx="50" cy="50" r={r} fill="none" stroke="#1e293b" strokeWidth="16" />
      {arcs}
      {/* Ponto de início */}
      <circle cx="50" cy="10" r="3" fill="#0d1424" transform={`rotate(${startAngle} 50 50)`} style={{ opacity }} />
    </svg>
  );
}
