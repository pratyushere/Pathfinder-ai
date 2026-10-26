import { useApp } from "../context/AppContext";
import Disclaimer from "../components/Disclaimer";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import {
  HiUser, HiAcademicCap, HiChartBar, HiClipboardCheck, HiMap, HiArrowRight,
} from "react-icons/hi";

const LEVEL_MAP = { Beginner: 1, Intermediate: 2, Advanced: 3 };
const LEVEL_COLORS = { Beginner: "#f5576c", Intermediate: "#f7b733", Advanced: "#38ef7d" };

export default function DashboardPage() {
  const { profile, verifiedSkills, chosenCareer, roadmap, weekProgress, update } = useApp();

  if (!profile) {
    return (
      <div style={{ maxWidth: 500, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
        <div className="glass-card" style={{ padding: 40 }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🧭</div>
          <h2 style={{ fontWeight: 700, marginBottom: 8 }}>No Profile Yet</h2>
          <p style={{ color: "#94a3b8", marginBottom: 24 }}>Complete your profile to see your dashboard.</p>
          <button className="btn-primary" onClick={() => update({ currentStep: "profile" })}>
            Create Profile <HiArrowRight />
          </button>
        </div>
      </div>
    );
  }

  const completedWeeks = Object.values(weekProgress || {}).filter((v) => v === "Done").length;
  const totalWeeks = roadmap?.weeks?.length || 10;
  const progressPercent = roadmap ? Math.round((completedWeeks / totalWeeks) * 100) : 0;

  // Skills chart
  const skillChartData = verifiedSkills?.map((s) => ({
    skill: s.skill,
    Claimed: 3,
    Verified: LEVEL_MAP[s.verifiedLevel],
    verifiedLevel: s.verifiedLevel,
  })) || [];

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 24px 80px" }}>
      <h2
        className="animate-fade-in-up"
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "1.8rem",
          fontWeight: 700,
          marginBottom: 28,
        }}
      >
        📊 Your Dashboard
      </h2>

      {/* Profile Summary */}
      <div
        className="glass-card animate-fade-in-up animate-delay-1"
        style={{
          padding: 24,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
          opacity: 0,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "var(--gradient-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            flexShrink: 0,
          }}
        >
          <HiUser size={28} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontWeight: 700, fontSize: "1.2rem" }}>{profile.name}</h3>
          <p style={{ color: "#94a3b8", fontSize: "0.88rem" }}>
            {profile.degree} • {profile.year}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {profile.skills.map((s, i) => (
              <span key={i} className="chip" style={{ padding: "2px 10px", fontSize: "0.75rem", cursor: "default" }}>
                {s}
              </span>
            ))}
          </div>
        </div>
        {chosenCareer && (
          <div
            style={{
              padding: "12px 20px",
              borderRadius: 12,
              background: "rgba(102,126,234,0.08)",
              border: "1px solid rgba(102,126,234,0.2)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase" }}>Chosen Path</div>
            <div style={{ fontWeight: 700, color: "#a5b4fc", fontSize: "1rem" }}>{chosenCareer.title}</div>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[
          {
            icon: <HiClipboardCheck size={22} />,
            label: "Skills Verified",
            value: verifiedSkills?.length || 0,
            gradient: "linear-gradient(135deg, #667eea, #764ba2)",
          },
          {
            icon: <HiChartBar size={22} />,
            label: "Roadmap Progress",
            value: `${progressPercent}%`,
            gradient: "linear-gradient(135deg, #11998e, #38ef7d)",
          },
          {
            icon: <HiMap size={22} />,
            label: "Weeks Completed",
            value: `${completedWeeks}/${totalWeeks}`,
            gradient: "linear-gradient(135deg, #f093fb, #f5576c)",
          },
          {
            icon: <HiAcademicCap size={22} />,
            label: "Career Match",
            value: chosenCareer ? `${chosenCareer.matchPercentage}%` : "—",
            gradient: "linear-gradient(135deg, #fc4a1a, #f7b733)",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="glass-card animate-fade-in-up"
            style={{ padding: 20, animationDelay: `${(i + 2) * 0.1}s`, opacity: 0 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: stat.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                {stat.icon}
              </div>
              <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 20,
          marginBottom: 24,
        }}
      >
        {/* Verified Skills Chart */}
        {skillChartData.length > 0 && (
          <div className="glass-card animate-fade-in-up" style={{ padding: 24, animationDelay: "0.5s", opacity: 0 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: "1rem" }}>
              🏆 Claimed vs Verified Skills
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={skillChartData} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="skill" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis
                  domain={[0, 3]}
                  ticks={[1, 2, 3]}
                  tickFormatter={(v) => ["", "Beg", "Int", "Adv"][v]}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value) => ["", "Beginner", "Intermediate", "Advanced"][value]}
                  contentStyle={{
                    background: "rgba(15,15,30,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                  }}
                />
                <Legend />
                <Bar dataKey="Claimed" fill="rgba(102,126,234,0.3)" radius={[6, 6, 0, 0]} name="Self-Claimed" />
                <Bar dataKey="Verified" radius={[6, 6, 0, 0]} name="Verified">
                  {skillChartData.map((entry, idx) => (
                    <Cell key={idx} fill={LEVEL_COLORS[entry.verifiedLevel]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Roadmap Progress */}
        {roadmap && (
          <div className="glass-card animate-fade-in-up" style={{ padding: 24, animationDelay: "0.6s", opacity: 0 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: "1rem" }}>
              📈 Roadmap Progress
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {roadmap.weeks?.map((w, i) => {
                const status = (weekProgress || {})[w.week];
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: "0.78rem", color: "#64748b", width: 40 }}>W{w.week}</span>
                    <div style={{ flex: 1, height: 8, borderRadius: 99, background: "rgba(255,255,255,0.05)" }}>
                      <div
                        style={{
                          width: status === "Done" ? "100%" : "0%",
                          height: "100%",
                          borderRadius: 99,
                          background:
                            status === "Done"
                              ? "var(--gradient-success)"
                              : status === "Too Hard"
                              ? "var(--gradient-warning)"
                              : "transparent",
                          transition: "width 0.5s ease",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "#64748b", width: 60, textAlign: "right" }}>
                      {status || "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: "1rem" }}>⚡ Quick Actions</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {!verifiedSkills?.length && (
            <button className="btn-primary" onClick={() => update({ currentStep: "quiz" })}>
              Start Skill Verification <HiArrowRight />
            </button>
          )}
          {verifiedSkills?.length > 0 && !chosenCareer && (
            <button className="btn-primary" onClick={() => update({ currentStep: "careers" })}>
              Get Career Recommendations <HiArrowRight />
            </button>
          )}
          {chosenCareer && !roadmap && (
            <button className="btn-primary" onClick={() => update({ currentStep: "roadmap" })}>
              Generate Learning Roadmap <HiArrowRight />
            </button>
          )}
          {roadmap && (
            <button className="btn-primary" onClick={() => update({ currentStep: "roadmap" })}>
              Continue Learning Roadmap <HiArrowRight />
            </button>
          )}
          <button className="btn-secondary" onClick={() => update({ currentStep: "profile" })}>
            Update Profile
          </button>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
