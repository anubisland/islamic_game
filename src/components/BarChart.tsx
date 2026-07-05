interface BarItem {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
}

interface Props {
  items: BarItem[];
  height?: number;
  barWidth?: number;
  showLabels?: boolean;
}

export function BarChart({ items, height = 180, barWidth = 30, showLabels = true }: Props) {
  const globalMax = Math.max(...items.map((i) => i.value), 1);
  const chartWidth = Math.max(items.length * (barWidth + 16) + 40, 200);
  const pad = { top: 12, bottom: showLabels ? 28 : 12, left: 4, right: 4 };
  const innerH = height - pad.top - pad.bottom;
  const colors = ["#1b6b3e", "#27ae60", "#d4a02b", "#e67e22", "#2196F3", "#9C27B0", "#e53935", "#00ACC1", "#FF9800", "#4CAF50"];

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${chartWidth} ${height}`} style={{ maxWidth: "100%" }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
        const y = pad.top + innerH * (1 - frac);
        return (
          <g key={frac}>
            <line x1={pad.left} y1={y} x2={chartWidth - pad.right} y2={y} stroke="#e0e0e0" strokeWidth={0.5} />
            <text x={chartWidth - pad.right + 4} y={y + 3} fontSize={9} fill="#999">
              {Math.round(frac * globalMax)}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {items.map((item, i) => {
        const max = item.maxValue || globalMax;
        const barH = (item.value / max) * innerH;
        const x = pad.left + i * (barWidth + 16) + 8;
        const y = pad.top + innerH - barH;
        const color = item.color || colors[i % colors.length];
        return (
          <g key={i}>
            <rect x={x} y={pad.top + innerH} width={barWidth} height={0} rx={4} fill={color} opacity={0.85}>
              <animate attributeName="height" from="0" to={barH} dur="0.5s" fill="freeze" />
              <animate attributeName="y" from={pad.top + innerH} to={y} dur="0.5s" fill="freeze" />
            </rect>
            {showLabels && (
              <text x={x + barWidth / 2} y={pad.top + innerH + 16} fontSize={9} fill="#666" textAnchor="middle">
                {item.label.length > 6 ? item.label.slice(0, 5) + ".." : item.label}
              </text>
            )}
            <text x={x + barWidth / 2} y={y - 4} fontSize={10} fill="#333" textAnchor="middle" fontWeight={600}>
              {Math.round(item.value)}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}
