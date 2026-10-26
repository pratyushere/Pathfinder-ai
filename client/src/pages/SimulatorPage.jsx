import { useApp } from "../context/AppContext";
import { HiArrowRight, HiArrowLeft } from "react-icons/hi";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend,
} from "recharts";

const METRIC_MAP = {
  High: 3,
  Medium: 2,
  Low: 1,
};

export default function SimulatorPage() {
  const { careers, chosenCareer, verifiedSkills, update } = useApp();
  const careersList = careers?.careers || [];

  // Build comparison data
  const comparisonMetrics = [
    "Skills Match",
    "Skill Gap",
    "6-Month Effort",
    "Job Demand",
    "Growth Potential",
  ];

  function getMetricValue(career, metric) {
    switch (metric) {
      case "Skills Match":
        return Math.round(career.matchPercentage / 100 * 3);
      case "Skill Gap":
        return career.skillGaps ? Math.max(1, 4 - Math.ceil(career.skillGaps.length / 2)) : 2;
      case "6-Month Effort": {
        const effort = (career.effortLevel || "").toLowerCase();
        if (effort.includes("high") || effort.includes("significant")) return 1;
        if (effort.includes("low") || effort.includes("minimal")) return 3;
        return 2;
      }
      case "Job Demand":
        return METRIC_MAP[career.demandLevel] || 2;
      case "Growth Potential": {
        const growth = (career.growthPotential || "").toLowerCase();
        if (growth.includes("high") || growth.includes("excellent") || growth.includes("strong")) return 3;
        if (growth.includes("low") || growth.includes("limited")) return 1;
        return 2;
      }
      default:
        return 2;
    }
  }

  const radarData = comparisonMetrics.map((metric) => {
    const row = { metric };
    careersList.forEach((c, i) => {
      row[`career${i}`] = getMetricValue(c, metric);
    });
    return row;
  });

  const COLORS = ["#667eea", "#f5576c", "#38ef7d"];

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 24px 80px" }}>
      <div className="animate-fade-in-up">
        <h2
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "1.8rem",
            fontWeight: 700,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          🔮 Future Simulator
        </h2>
        <p style={{ color: "#94a3b8", textAlign: "center", marginBottom: 36, fontSize: "0.95rem" }}>
          Compare all 3 career paths side by side. Pick the one that excites you most.
        </p>
      </div>

      {/* Radar Chart */}
      <div className="glass-card animate-fade-in-up animate-delay-1" style={{ padding: 24, marginBottom: 28, opacity: 0 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 16, textAlign: "center" }}>
          Career Comparison Radar
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 3]} tick={false} axisLine={false} />
            {careersList.map((c, i) => (
              <Radar
                key={i}
                name={c.title}
                dataKey={`career${i}`}
                stroke={COLORS[i]}
                fill={COLORS[i]}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            ))}
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Side-by-side table */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${careersList.length}, 1fr)`,
          gap: 16,
          marginBottom: 28,
        }}
      >
        {careersList.map((career, idx) => {
          const isChosen = chosenCareer?.title === career.title;
          return (
            <div
              key={idx}
              className={`glass-card animate-fade-in-up ${isChosen ? "pulse-glow" : ""}`}
              style={{
                padding: 24,
                border: isChosen ? "2px solid #667eea" : undefined,
                animationDelay: `${idx * 0.1 + 0.2}s`,
                opacity: 0,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: COLORS[idx],
                  marginBottom: 12,
                }}
              />
              <h3 style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: 12 }}>
                {career.title}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>
                    Skills Needed
                  </div>
                  <div style={{ fontSize: "0.88rem" }}>
                    {career.requiredSkills?.join(", ")}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>
                    Skill Gap
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {career.skillGaps?.map((s, i) => (
                      <span
                        key={i}
                        style={{
                          padding: "2px 8px",
                          borderRadius: 6,
                          background: "rgba(245, 87, 108, 0.1)",
                          color: "#f5576c",
                          fontSize: "0.78rem",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                    {(!career.skillGaps || career.skillGaps.length === 0) && (
                      <span style={{ fontSize: "0.82rem", color: "#38ef7d" }}>No gaps!</span>
                    )}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>
                    6-Month Effort
                  </div>
                  <div style={{ fontSize: "0.85rem" }}>{career.effortLevel}</div>
                </div>

                <div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>
                    Job Demand
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: career.demandLevel === "High" ? "#38ef7d" : career.demandLevel === "Medium" ? "#f7b733" : "#f5576c",
                    }}
                  >
                    {career.demandLevel}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>
                    Growth
                  </div>
                  <div style={{ fontSize: "0.85rem" }}>{career.growthPotential}</div>
                </div>

                <div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>
                    Salary Range
                  </div>
                  <div style={{ fontWeight: 600, color: "#38ef7d" }}>{career.salaryRange}</div>
                </div>
              </div>

              <button
                className={isChosen ? "btn-primary" : "btn-secondary"}
                style={{ width: "100%", justifyContent: "center", marginTop: 20 }}
                onClick={() => update({ chosenCareer: career })}
              >
                {isChosen ? "✓ Selected" : "Choose This Path"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <button className="btn-ghost" onClick={() => update({ currentStep: "careers" })}>
          <HiArrowLeft size={16} /> Back to Careers
        </button>
        <button
          className="btn-primary"
          disabled={!chosenCareer}
          onClick={() => update({ currentStep: "roadmap" })}
        >
          Generate Learning Roadmap <HiArrowRight />
        </button>
      </div>
    </div>
  );
}
