import { BarChart } from "./BarChart";
import { DonutChart } from "./DonutChart";

interface Props {
  completed: number;
  total: number;
  stages: { title: string; icon: string; done: boolean }[];
  lang: "ar" | "en";
}

export function GameProgressCharts({ completed, total, stages, lang }: Props) {
  const pct = Math.round((completed / total) * 100);

  return (
    <div style={{
      background: "var(--card-bg)", borderRadius: "var(--radius)",
      padding: "0.75rem", border: "1px solid var(--border)",
      margin: "0.75rem 0",
    }}>
      <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--green-primary)", margin: "0 0 0.5rem 0", textAlign: "center" }}>
        📊 {lang === "ar" ? "إحصائيات التقدم" : "Progress Stats"}
      </h3>

      {/* Progress bar */}
      <div style={{ marginBottom: "0.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.25rem" }}>
          <span style={{ color: "var(--text-light)" }}>{completed}/{total}</span>
          <span style={{ fontWeight: 700, color: "var(--green-primary)" }}>{pct}%</span>
        </div>
        <div style={{ height: 8, background: "var(--progress-bg)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: "linear-gradient(90deg, var(--green-light), var(--gold))",
            borderRadius: 4, transition: "width 0.6s",
          }} />
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
        <DonutChart
          slices={[
            { label: lang === "ar" ? "مكتمل" : "Done", value: completed, color: "#1b6b3e" },
            { label: lang === "ar" ? "متبقي" : "Remaining", value: total - completed, color: "#bdc3c7" },
          ]}
          size={90}
          thickness={18}
          lang={lang}
        />
        <div style={{ flex: 1, minWidth: 140 }}>
          <BarChart
            items={stages.map((s) => ({
              label: s.icon,
              value: s.done ? 100 : 0,
              color: s.done ? "#1b6b3e" : "#e0e0e0",
            }))}
            height={100}
            barWidth={16}
            showLabels={false}
          />
        </div>
      </div>
    </div>
  );
}
