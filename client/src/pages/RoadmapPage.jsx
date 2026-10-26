import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { api } from "../services/api";
import AgentProgress from "../components/AgentProgress";
import Disclaimer from "../components/Disclaimer";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  HiArrowRight, HiExternalLink, HiCheckCircle, HiChevronDown, HiChevronUp,
  HiThumbUp, HiThumbDown, HiCheck, HiAdjustments,
} from "react-icons/hi";

const GAP_COLORS = ["#f5576c", "#f7b733", "#667eea", "#38ef7d", "#c084fc", "#f093fb"];

export default function RoadmapPage() {
  const { profile, chosenCareer, verifiedSkills, roadmap, weekProgress, update } = useApp();
  const [loading, setLoading] = useState(!roadmap);
  const [error, setError] = useState(null);
  const [roadmapData, setRoadmapData] = useState(roadmap);
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [adapting, setAdapting] = useState(false);
  const [progress, setProgress] = useState(weekProgress || {});

  useEffect(() => {
    if (roadmap) return;
    let cancelled = false;

    async function fetchRoadmap() {
      try {
        const result = await api.generateRoadmap(profile, chosenCareer, verifiedSkills);
        if (cancelled) return;
        setRoadmapData(result);
        update({ roadmap: result });
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRoadmap();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line

  const completedCount = Object.values(progress).filter((v) => v === "Done").length;
  const totalWeeks = roadmapData?.weeks?.length || 10;
  const progressPercent = Math.round((completedCount / totalWeeks) * 100);

  async function handleWeekFeedback(weekNum, feedback) {
    const newProgress = { ...progress, [weekNum]: feedback };
    setProgress(newProgress);
    update({ weekProgress: newProgress });

    if (feedback === "Too Hard" || feedback === "Too Easy") {
      setAdapting(true);
      try {
        const completedWeeks = Object.entries(newProgress)
          .filter(([, v]) => v === "Done")
          .map(([k]) => parseInt(k));

        const result = await api.adaptRoadmap(
          profile,
          roadmapData,
          weekNum,
          feedback,
          completedWeeks
        );

        // Merge adapted weeks into roadmap
        if (result.adjustedWeeks) {
          const updatedWeeks = roadmapData.weeks.map((w) => {
            const adjusted = result.adjustedWeeks.find((aw) => aw.week === w.week);
            return adjusted || w;
          });
          const newRoadmap = { ...roadmapData, weeks: updatedWeeks };
          setRoadmapData(newRoadmap);
          update({ roadmap: newRoadmap });
        }
      } catch (err) {
        console.error("Adaptation failed:", err);
      } finally {
        setAdapting(false);
      }
    }
  }

  if (error) {
    return (
      <div style={{ maxWidth: 600, margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
        <div className="glass-card" style={{ padding: 32 }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>😵</div>
          <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Oops!</h2>
          <p style={{ color: "#94a3b8", marginBottom: 24 }}>{error}</p>
          <button className="btn-primary" onClick={() => { setError(null); setLoading(true); }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 500, margin: "80px auto", padding: "0 24px" }}>
        <div className="glass-card" style={{ padding: 32 }}>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "1.4rem",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            🤖 Roadmap Planner Agent
          </h2>
          <p style={{ color: "#94a3b8", marginBottom: 16, fontSize: "0.9rem" }}>
            Building your personalized week-by-week learning plan...
          </p>
          <AgentProgress
            currentIndex={0}
            steps={[
              { label: "Roadmap Planner Agent", description: "Creating your personalized learning path..." },
            ]}
          />
        </div>
      </div>
    );
  }

  const weeks = roadmapData?.weeks || [];
  const gap = roadmapData?.skillGapAnalysis;
  const projects = roadmapData?.portfolioProjects || [];

  // Skill gap chart data
  const gapChartData =
    gap?.gaps?.map((g, i) => ({
      skill: g,
      level: 1,
      color: GAP_COLORS[i % GAP_COLORS.length],
    })) || [];

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 24px 80px" }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ textAlign: "center", marginBottom: 32 }}>
        <h2
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "1.8rem",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          🗺️ Your Learning Roadmap
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
          {roadmapData?.careerTitle} — {totalWeeks} weeks to job-ready
        </p>
      </div>

      {/* Overall Progress */}
      <div className="glass-card animate-fade-in-up animate-delay-1" style={{ padding: 24, marginBottom: 24, opacity: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontWeight: 600 }}>Overall Progress</span>
          <span style={{ fontWeight: 700, color: "#a5b4fc" }}>{progressPercent}%</span>
        </div>
        <div className="progress-bar" style={{ height: 12 }}>
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: 8 }}>
          {completedCount} of {totalWeeks} weeks completed
        </p>
      </div>

      {/* Skill Gap */}
      {gap && (
        <div className="glass-card animate-fade-in-up animate-delay-2" style={{ padding: 24, marginBottom: 24, opacity: 0 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>📊 Skill Gap Analysis</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", marginBottom: 6 }}>
                You Have
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {gap.current?.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "3px 10px",
                      borderRadius: 6,
                      background: "rgba(56, 239, 125, 0.1)",
                      color: "#38ef7d",
                      fontSize: "0.8rem",
                    }}
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", marginBottom: 6 }}>
                Need to Learn
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {gap.gaps?.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "3px 10px",
                      borderRadius: 6,
                      background: "rgba(245, 87, 108, 0.1)",
                      color: "#f5576c",
                      fontSize: "0.8rem",
                    }}
                  >
                    ✗ {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {gapChartData.length > 0 && (
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={gapChartData} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="skill" tick={{ fill: "#94a3b8", fontSize: 12 }} width={120} />
                <Bar dataKey="level" radius={[0, 8, 8, 0]}>
                  {gapChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* Adapting indicator */}
      {adapting && (
        <div
          className="glass-card animate-fade-in-up"
          style={{
            padding: 16,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "1px solid rgba(102, 126, 234, 0.3)",
          }}
        >
          <div
            className="animate-spin"
            style={{
              width: 20,
              height: 20,
              border: "2px solid rgba(102,126,234,0.2)",
              borderTopColor: "#667eea",
              borderRadius: "50%",
            }}
          />
          <span style={{ fontWeight: 500 }}>
            <HiAdjustments size={16} style={{ display: "inline", verticalAlign: "middle" }} /> Feedback Agent is adapting your roadmap...
          </span>
        </div>
      )}

      {/* Timeline */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 20 }}>📅 Week-by-Week Plan</h3>

        {weeks.map((week, idx) => {
          const status = progress[week.week];
          const isExpanded = expandedWeek === week.week;
          const isDone = status === "Done";

          return (
            <div key={idx} className="timeline-item" style={{ marginBottom: 20 }}>
              <div className={`timeline-dot ${isDone ? "completed" : idx === completedCount ? "current" : ""}`}>
                {isDone && <HiCheck size={12} color="white" />}
              </div>

              <div
                className="glass-card"
                style={{
                  padding: 0,
                  overflow: "hidden",
                  opacity: isDone ? 0.7 : 1,
                }}
              >
                {/* Header - clickable */}
                <div
                  style={{
                    padding: "16px 20px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => setExpandedWeek(isExpanded ? null : week.week)}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                      Week {week.week}: {week.title}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: 2 }}>
                      {week.topics?.join(" · ")} • ~{week.estimatedHours}h
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {status && (
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 6,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          background:
                            status === "Done"
                              ? "rgba(56,239,125,0.12)"
                              : status === "Too Hard"
                              ? "rgba(245,87,108,0.12)"
                              : "rgba(247,183,51,0.12)",
                          color:
                            status === "Done" ? "#38ef7d" : status === "Too Hard" ? "#f5576c" : "#f7b733",
                        }}
                      >
                        {status}
                      </span>
                    )}
                    {isExpanded ? <HiChevronUp size={18} /> : <HiChevronDown size={18} />}
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div
                    className="animate-fade-in-up"
                    style={{
                      padding: "0 20px 20px",
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    {/* Task */}
                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", marginBottom: 6 }}>
                        🎯 This Week's Task
                      </div>
                      <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "#e2e8f0" }}>
                        {week.task}
                      </p>
                    </div>

                    {/* Resources */}
                    {week.resources && (
                      <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", marginBottom: 6 }}>
                          📚 Resources
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {week.resources.map((r, i) => (
                            <a
                              key={i}
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "8px 12px",
                                borderRadius: 8,
                                background: "rgba(102,126,234,0.06)",
                                color: "#a5b4fc",
                                textDecoration: "none",
                                fontSize: "0.85rem",
                                transition: "background 0.2s ease",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(102,126,234,0.12)")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(102,126,234,0.06)")}
                            >
                              <span>{r.name}</span>
                              <span
                                style={{
                                  fontSize: "0.72rem",
                                  padding: "2px 6px",
                                  borderRadius: 4,
                                  background: "rgba(255,255,255,0.05)",
                                  color: "#94a3b8",
                                }}
                              >
                                {r.platform}
                              </span>
                              <HiExternalLink size={14} style={{ marginLeft: "auto" }} />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Feedback buttons */}
                    {!isDone && (
                      <div style={{ marginTop: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          className="btn-primary"
                          style={{ padding: "8px 20px", fontSize: "0.85rem" }}
                          onClick={() => handleWeekFeedback(week.week, "Done")}
                        >
                          <HiCheckCircle size={16} /> Mark Done
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                          onClick={() => handleWeekFeedback(week.week, "Too Hard")}
                        >
                          <HiThumbDown size={14} /> Too Hard
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                          onClick={() => handleWeekFeedback(week.week, "Too Easy")}
                        >
                          <HiThumbUp size={14} /> Too Easy
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Portfolio Projects */}
      {projects.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>🚀 Portfolio Projects</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 16,
            }}
          >
            {projects.map((p, i) => (
              <div key={i} className="glass-card" style={{ padding: 20 }}>
                <h4 style={{ fontWeight: 700, marginBottom: 8, fontSize: "1rem" }}>{p.title}</h4>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: 12 }}>
                  {p.description}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                  {p.skills?.map((s, j) => (
                    <span key={j} className="chip" style={{ padding: "2px 8px", fontSize: "0.72rem", cursor: "default" }}>
                      {s}
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#64748b" }}>
                  <span>Difficulty: {p.difficulty}</span>
                  <span>~{p.estimatedDays} days</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <button className="btn-ghost" onClick={() => update({ currentStep: "simulator" })}>
          ← Back to Simulator
        </button>
        <button className="btn-primary" onClick={() => update({ currentStep: "dashboard" })}>
          Go to Dashboard <HiArrowRight />
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <Disclaimer />
      </div>
    </div>
  );
}
