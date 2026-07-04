interface Props {
  goodId: string;
  size?: number;
}

export function GoodIcon({ goodId, size = 28 }: Props) {
  const s = size;
  const half = s / 2;

  const icons: Record<string, React.ReactNode> = {
    dates: (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <ellipse cx={half} cy={s * 0.55} rx={s * 0.35} ry={s * 0.4} fill="#8B4513" />
        <ellipse cx={half} cy={s * 0.55} rx={s * 0.35} ry={s * 0.4} fill="url(#dt)" opacity={0.5} />
        <line x1={half} y1={s * 0.15} x2={half} y2={s * 0.35} stroke="#5D4037" strokeWidth={2} strokeLinecap="round" />
        <ellipse cx={s * 0.35} cy={s * 0.5} rx={s * 0.08} ry={s * 0.12} fill="#A0522D" />
        <ellipse cx={s * 0.5} cy={s * 0.55} rx={s * 0.08} ry={s * 0.12} fill="#A0522D" />
        <ellipse cx={s * 0.65} cy={s * 0.5} rx={s * 0.08} ry={s * 0.12} fill="#A0522D" />
        <defs><linearGradient id="dt"><stop offset="0" stopColor="#D2691E" /><stop offset="1" stopColor="#8B4513" /></linearGradient></defs>
      </svg>
    ),
    wheat: (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M ${half} ${s * 0.85} Q ${half + (i - 1) * s * 0.1} ${s * 0.5} ${half + (i - 1) * s * 0.12} ${s * 0.2}`}
            fill="none" stroke="#FFD700" strokeWidth={2} strokeLinecap="round" />
        ))}
        <ellipse cx={half} cy={s * 0.18} rx={s * 0.12} ry={s * 0.04} fill="#FFD700" />
        <ellipse cx={s * 0.38} cy={s * 0.2} rx={s * 0.08} ry={s * 0.03} fill="#FFD700" />
        <ellipse cx={s * 0.62} cy={s * 0.2} rx={s * 0.08} ry={s * 0.03} fill="#FFD700" />
        <ellipse cx={half - s * 0.05} cy={s * 0.85} rx={s * 0.1} ry={s * 0.04} fill="#8B4513" />
      </svg>
    ),
    cloth: (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <rect x={s * 0.15} y={s * 0.1} width={s * 0.7} height={s * 0.8} rx={s * 0.05} fill="#9C27B0" opacity={0.7} />
        <rect x={s * 0.2} y={s * 0.15} width={s * 0.25} height={s * 0.25} rx={2} fill="#CE93D8" opacity={0.6} />
        <rect x={s * 0.55} y={s * 0.15} width={s * 0.25} height={s * 0.25} rx={2} fill="#CE93D8" opacity={0.6} />
        <rect x={s * 0.2} y={s * 0.55} width={s * 0.25} height={s * 0.25} rx={2} fill="#CE93D8" opacity={0.6} />
        <rect x={s * 0.55} y={s * 0.55} width={s * 0.25} height={s * 0.25} rx={2} fill="#CE93D8" opacity={0.6} />
      </svg>
    ),
    perfume: (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <rect x={s * 0.3} y={s * 0.25} width={s * 0.4} height={s * 0.6} rx={s * 0.04} fill="#4CAF50" opacity={0.8} />
        <rect x={s * 0.35} y={s * 0.15} width={s * 0.3} height={s * 0.15} rx={s * 0.02} fill="#388E3C" />
        <circle cx={half} cy={s * 0.55} r={s * 0.04} fill="#FFD700" />
        <line x1={half} y1={s * 0.6} x2={half} y2={s * 0.75} stroke="#2E7D32" strokeWidth={1.5} />
        <path d={`M ${s * 0.25} ${s * 0.05} Q ${half} ${s * 0} ${s * 0.75} ${s * 0.05}`} fill="none" stroke="#81C784" strokeWidth={1} opacity={0.6} />
        <path d={`M ${s * 0.3} ${s * 0} Q ${half} ${s * -0.03} ${s * 0.7} ${s * 0}`} fill="none" stroke="#A5D6A7" strokeWidth={0.8} opacity={0.4} />
      </svg>
    ),
    spices: (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <ellipse cx={half} cy={s * 0.45} rx={s * 0.35} ry={s * 0.35} fill="#795548" opacity={0.3} />
        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * Math.PI * 2;
          const r = s * 0.12;
          const cx = half + Math.cos(angle) * r;
          const cy = s * 0.45 + Math.sin(angle) * r;
          return <circle key={i} cx={cx} cy={cy} r={s * 0.03} fill={["#D32F2F", "#FF9800", "#4CAF50", "#FFD700"][i]} opacity={0.7} />;
        })}
      </svg>
    ),
    iron: (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <rect x={s * 0.2} y={s * 0.6} width={s * 0.6} height={s * 0.15} rx={s * 0.03} fill="#607D8B" />
        <rect x={s * 0.15} y={s * 0.3} width={s * 0.15} height={s * 0.35} rx={2} fill="#78909C" />
        <rect x={s * 0.7} y={s * 0.3} width={s * 0.15} height={s * 0.35} rx={2} fill="#78909C" />
        <rect x={s * 0.25} y={s * 0.2} width={s * 0.5} height={s * 0.15} rx={s * 0.02} fill="#90A4AE" />
        <circle cx={s * 0.3} cy={s * 0.45} r={s * 0.04} fill="#B0BEC5" />
        <circle cx={s * 0.5} cy={s * 0.45} r={s * 0.04} fill="#B0BEC5" />
        <circle cx={s * 0.7} cy={s * 0.45} r={s * 0.04} fill="#B0BEC5" />
      </svg>
    ),
    olive: (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <ellipse cx={half} cy={s * 0.5} rx={s * 0.3} ry={s * 0.38} fill="#33691E" />
        <circle cx={s * 0.45} cy={s * 0.5} r={s * 0.15} fill="#4CAF50" opacity={0.5} />
        <circle cx={s * 0.55} cy={s * 0.5} r={s * 0.15} fill="#4CAF50" opacity={0.5} />
        <line x1={half} y1={s * 0.12} x2={half} y2={s * 0.3} stroke="#558B2F" strokeWidth={2} strokeLinecap="round" />
        <ellipse cx={half} cy={s * 0.12} rx={s * 0.08} ry={s * 0.04} fill="#33691E" />
      </svg>
    ),
    wool: (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <ellipse cx={half} cy={s * 0.5} rx={s * 0.35} ry={s * 0.3} fill="#E0E0E0" />
        <circle cx={s * 0.35} cy={s * 0.4} r={s * 0.08} fill="#EEEEEE" />
        <circle cx={s * 0.5} cy={s * 0.35} r={s * 0.08} fill="#EEEEEE" />
        <circle cx={s * 0.65} cy={s * 0.4} r={s * 0.08} fill="#EEEEEE" />
        <circle cx={s * 0.35} cy={s * 0.55} r={s * 0.08} fill="#EEEEEE" />
        <circle cx={s * 0.65} cy={s * 0.55} r={s * 0.08} fill="#EEEEEE" />
        <circle cx={half} cy={s * 0.6} r={s * 0.08} fill="#EEEEEE" />
      </svg>
    ),
  };

  return icons[goodId] || <span style={{ fontSize: size * 0.7 }}>📦</span>;
}
