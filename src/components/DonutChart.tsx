interface Slice {
  label: string;
  value: number;
  color: string;
}

interface Props {
  slices: Slice[];
  size?: number;
  thickness?: number;
  lang?: "ar" | "en";
}

export function DonutChart({ slices, size = 160, thickness = 30, lang = "ar" }: Props) {
  const total = slices.reduce((s, sl) => s + sl.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - thickness) / 2;
  const dir = lang === "ar" ? -1 : 1;

  let cumulative = -Math.PI / 2;
  const paths = slices.map((sl) => {
    const frac = sl.value / total;
    const angle = frac * Math.PI * 2;
    const start = cumulative;
    const end = cumulative + angle;

    const x1 = cx + r * Math.cos(start) * dir;
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end) * dir;
    const y2 = cy + r * Math.sin(end);
    const large = frac > 0.5 ? 1 : 0;

    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} ${dir > 0 ? 1 : 0} ${x2} ${y2} Z`;

    cumulative = end;
    return { d, color: sl.color, label: sl.label, value: sl.value, percent: Math.round(frac * 100) };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      {paths.map((p, i) => (
        <g key={i}>
          <path d={p.d} fill={p.color} opacity={0.85}>
            <animate attributeName="opacity" from="0" to="0.85" dur="0.4s" begin={`${i * 0.1}s`} fill="freeze" />
          </path>
        </g>
      ))}
      {/* Center hole */}
      <circle cx={cx} cy={cy} r={r - thickness} fill="var(--bg)" />
      {/* Center text */}
      <text x={cx} y={cy - 4} fontSize={size * 0.14} fontWeight={700} fill="var(--text)" textAnchor="middle">
        {total}
      </text>
      <text x={cx} y={cy + 12} fontSize={size * 0.07} fill="var(--text-light)" textAnchor="middle">
        {lang === "ar" ? "إجمالي" : "Total"}
      </text>
    </svg>
  );
}
