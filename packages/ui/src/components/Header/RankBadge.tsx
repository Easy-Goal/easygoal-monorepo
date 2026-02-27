import React from "react";

export const RANK_CONFIG: Record<string, { emoji: string; color: string; label: string }> = {
  bronze:   { emoji: "🥉", color: "#CD7F32", label: "Bronze" },
  silver:   { emoji: "🥈", color: "#C0C0C0", label: "Prata" },
  gold:     { emoji: "🥇", color: "#FFD700", label: "Ouro" },
  platinum: { emoji: "⭐", color: "#E5E4E2", label: "Platina" },
  diamond:  { emoji: "💎", color: "#B9F2FF", label: "Diamante" },
};

interface RankBadgeProps {
  rankName: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const SIZE_STYLES = {
  sm: { padding: "2px 6px", gap: 2, fontSize: 11 },
  md: { padding: "4px 8px", gap: 4, fontSize: 12 },
  lg: { padding: "6px 12px", gap: 6, fontSize: 14 },
};

export function RankBadge({ rankName, size = "sm", showLabel = true, className }: RankBadgeProps) {
  const config = RANK_CONFIG[rankName] ?? RANK_CONFIG.bronze;
  const s = SIZE_STYLES[size];

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        borderRadius: 999,
        border: `1px solid ${config.color}55`,
        backgroundColor: `${config.color}22`,
        color: config.color,
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 500,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
      title={config.label}
    >
      <span>{config.emoji}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
