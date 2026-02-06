export const chartTooltipProps = {
  contentStyle: {
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "8px 10px",
    boxShadow: "0 12px 30px -20px rgba(0,0,0,0.45)",
    color: "var(--text)",
  },
  labelStyle: {
    color: "var(--text-muted)",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  itemStyle: {
    color: "var(--text)",
    fontSize: 12,
  },
  cursor: { stroke: "var(--border)", strokeWidth: 1, strokeDasharray: "4 4" },
} as const;
