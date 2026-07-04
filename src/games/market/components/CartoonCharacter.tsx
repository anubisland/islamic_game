interface Props {
  type: "elder" | "trader" | "woman" | "youth" | "bedouin";
  size?: number;
}

const skinTones = {
  light: "#f5d0b0", medium: "#d4a574", dark: "#8d5524",
};

export function CartoonCharacter({ type, size = 60 }: Props) {
  const s = size;
  const half = s / 2;
  const skin = type === "bedouin" ? skinTones.dark : type === "youth" ? skinTones.light : skinTones.medium;

  return (
    <svg width={s} height={s * 1.2} viewBox={`0 0 ${s} ${s * 1.2}`} style={{ flexShrink: 0 }}>
      {/* Hair/Headwear */}
      {type === "elder" && (
        <>
          {/* White hair */}
          <ellipse cx={half} cy={s * 0.1} rx={half * 1.1} ry={s * 0.12} fill="#e0e0e0" />
          <rect x={s * 0.1} y={s * 0.05} width={s * 0.8} height={s * 0.1} rx={s * 0.05} fill="#e0e0e0" />
          {/* Beard */}
          <ellipse cx={half} cy={s * 0.65} rx={half * 0.5} ry={s * 0.2} fill="#d0d0d0" />
        </>
      )}
      {type === "trader" && (
        <>
          {/* Turban */}
          <ellipse cx={half} cy={s * 0.12} rx={half * 0.9} ry={s * 0.15} fill="#8B4513" />
          <rect x={s * 0.15} y={s * 0.02} width={s * 0.7} height={s * 0.12} rx={s * 0.04} fill="#A0522D" />
          <path d={`M ${s * 0.7} ${s * 0.05} Q ${s * 0.85} ${s * 0.02} ${s * 0.75} ${s * 0.15}`} fill="none" stroke="#FFD700" strokeWidth={1.5} />
        </>
      )}
      {type === "woman" && (
        <>
          {/* Hijab */}
          <ellipse cx={half} cy={s * 0.08} rx={half * 1.2} ry={s * 0.14} fill="#1565C0" />
          <path d={`M ${s * 0.05} ${s * 0.08} Q ${s * 0} ${s * 0.3} ${s * 0.08} ${s * 0.55}`} fill="#1565C0" />
          <path d={`M ${s * 0.95} ${s * 0.08} Q ${s} ${s * 0.3} ${s * 0.92} ${s * 0.55}`} fill="#1565C0" />
        </>
      )}
      {type === "youth" && (
        <>
          {/* Modern cap */}
          <ellipse cx={half} cy={s * 0.1} rx={half * 0.7} ry={s * 0.12} fill="#2E7D32" />
        </>
      )}
      {type === "bedouin" && (
        <>
          {/* Keffiyeh */}
          <ellipse cx={half} cy={s * 0.1} rx={half * 1.15} ry={s * 0.13} fill="#8B4513" />
          <path d={`M ${s * 0.85} ${s * 0.02} L ${s * 0.75} ${s * 0.25}`} stroke="#8B4513" strokeWidth={2} fill="none" />
          <path d={`M ${s * 0.15} ${s * 0.02} L ${s * 0.25} ${s * 0.25}`} stroke="#8B4513" strokeWidth={2} fill="none" />
        </>
      )}

      {/* Face */}
      <ellipse cx={half} cy={s * 0.3} rx={half * 0.65} ry={s * 0.3} fill={skin} />

      {/* Eyes */}
      {type === "elder" ? (
        <>
          <circle cx={s * 0.32} cy={s * 0.26} r={s * 0.04} fill="#333" />
          <circle cx={s * 0.68} cy={s * 0.26} r={s * 0.04} fill="#333" />
        </>
      ) : (
        <>
          <ellipse cx={s * 0.33} cy={s * 0.26} rx={s * 0.045} ry={s * 0.055} fill="#333" />
          <ellipse cx={s * 0.67} cy={s * 0.26} rx={s * 0.045} ry={s * 0.055} fill="#333" />
          {/* Eye shine */}
          <circle cx={s * 0.35} cy={s * 0.24} r={s * 0.015} fill="#fff" />
          <circle cx={s * 0.69} cy={s * 0.24} r={s * 0.015} fill="#fff" />
        </>
      )}

      {/* Nose */}
      {type === "elder" ? (
        <ellipse cx={half} cy={s * 0.34} rx={s * 0.04} ry={s * 0.06} fill={skinTones.light} />
      ) : (
        <ellipse cx={half} cy={s * 0.35} rx={s * 0.035} ry={s * 0.05} fill={skinTones.light} />
      )}

      {/* Mouth */}
      {type === "youth" ? (
        <path d={`M ${s * 0.32} ${s * 0.42} Q ${half} ${s * 0.52} ${s * 0.68} ${s * 0.42}`} fill="none" stroke="#c0392b" strokeWidth={1.5} strokeLinecap="round" />
      ) : type === "elder" ? (
        <path d={`M ${s * 0.32} ${s * 0.4} Q ${half} ${s * 0.46} ${s * 0.68} ${s * 0.4}`} fill="none" stroke="#666" strokeWidth={1.2} strokeLinecap="round" />
      ) : (
        <path d={`M ${s * 0.33} ${s * 0.4} Q ${half} ${s * 0.48} ${s * 0.67} ${s * 0.4}`} fill="none" stroke="#c0392b" strokeWidth={1.5} strokeLinecap="round" />
      )}

      {/* Eyebrows */}
      {type === "elder" && (
        <>
          <path d={`M ${s * 0.25} ${s * 0.18} Q ${s * 0.32} ${s * 0.15} ${s * 0.38} ${s * 0.18}`} fill="none" stroke="#999" strokeWidth={1.5} />
          <path d={`M ${s * 0.75} ${s * 0.18} Q ${s * 0.68} ${s * 0.15} ${s * 0.62} ${s * 0.18}`} fill="none" stroke="#999" strokeWidth={1.5} />
        </>
      )}

      {/* Body hint */}
      <rect x={s * 0.2} y={s * 0.58} width={s * 0.6} height={s * 0.35} rx={s * 0.08}
        fill={type === "woman" ? "#1565C0" : type === "trader" ? "#8B4513" : type === "bedouin" ? "#5D4037" : type === "elder" ? "#78909C" : "#4CAF50"}
        opacity={0.6}
      />
    </svg>
  );
}
