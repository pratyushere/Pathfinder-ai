import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { api } from "../services/api";
import AgentProgress from "../components/AgentProgress";
import Disclaimer from "../components/Disclaimer";
import { SkeletonCard } from "../components/Skeletons";
import { HiArrowRight, HiTrendingUp, HiCurrencyRupee, HiStar, HiBriefcase } from "react-icons/hi";

export default function CareersPage() {
  const { profile, verifiedSkills, update, careers } = useApp();
  const [loading, setLoading] = useState(!careers);
  const [error, setError] = useState(null);
  const [careerData, setCareerData] = useState(careers);

  useEffect(() => {
    if (careers) return;
    let cancelled = false;

    async function fetchCareers() {
      try {
        const result = await api.recommendCareers(profile, verifiedSkills);
        if (cancelled) return;
        setCareerData(result);
        update({ careers: result });
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCareers();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line

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
            🤖 Career Recommender Agent
          </h2>
          <p style={{ color: "#94a3b8", marginBottom: 16, fontSize: "0.9rem" }}>
            Analyzing your verified skills and finding the best career matches...
          </p>
          <AgentProgress
            currentIndex={0}
            steps={[
              { label: "Career Recommender Agent", description: "Matching skills to career paths..." },
            ]}
          />
        </div>
      </div>
    );
  }

  const careersList = careerData?.careers || [];

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 24px 80px" }}>
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
          🎯 Your Career Matches
        </h2>
        <p
          style={{
            color: "#94a3b8",
            textAlign: "center",
            marginBottom: 32,
            fontSize: "0.95rem",
          }}
        >
          Based on your verified skills, here are 3 personalized career paths.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          marginBottom: 24,
        }}
      >
        {careersList.map((career, idx) => (
          <div
            key={idx}
            className="glass-card career-card animate-fade-in-up"
            style={{
              padding: 28,
              display: "flex",
              flexDirection: "column",
              animationDelay: `${idx * 0.15}s`,
              opacity: 0,
            }}
          >
            {/* Match Badge */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: 16,
              }}
            >
              <h3 style={{ fontWeight: 700, fontSize: "1.15rem", flex: 1 }}>{career.title}</h3>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  background:
                    career.matchPercentage >= 80
                      ? "rgba(56, 239, 125, 0.12)"
                      : career.matchPercentage >= 60
                      ? "rgba(247, 183, 51, 0.12)"
                      : "rgba(245, 87, 108, 0.12)",
                  color:
                    career.matchPercentage >= 80
                      ? "#38ef7d"
                      : career.matchPercentage >= 60
                      ? "#f7b733"
                      : "#f5576c",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  flexShrink: 0,
                }}
              >
                {career.matchPercentage}%
              </div>
            </div>

            <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: 16 }}>
              {career.whyItFits}
            </p>

            {/* Salary */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
                fontSize: "0.88rem",
              }}
            >
              <HiCurrencyRupee size={16} color="#38ef7d" />
              <span style={{ fontWeight: 600 }}>{career.salaryRange}</span>
            </div>

            {/* Demand */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
                fontSize: "0.88rem",
              }}
            >
              <HiTrendingUp size={16} color="#667eea" />
              <span>Demand: <strong>{career.demandLevel}</strong></span>
            </div>

            {/* Entry Roles */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: "0.78rem", color: "#64748b", textTransform: "uppercase", marginBottom: 6 }}>
                <HiBriefcase size={12} style={{ display: "inline", verticalAlign: "middle" }} /> Entry Roles
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {career.entryLevelRoles?.map((role, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "3px 10px",
                      borderRadius: 6,
                      background: "rgba(102,126,234,0.1)",
                      fontSize: "0.78rem",
                    }}
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: "0.78rem", color: "#64748b", textTransform: "uppercase", marginBottom: 6 }}>
                <HiStar size={12} style={{ display: "inline", verticalAlign: "middle" }} /> Required Skills
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {career.requiredSkills?.map((skill, i) => (
                  <span
                    key={i}
                    className="chip"
                    style={{
                      padding: "3px 10px",
                      fontSize: "0.78rem",
                      cursor: "default",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* India Specific */}
            {career.indiaSpecific && (
              <div
                style={{
                  padding: 12,
                  borderRadius: 10,
                  background: "rgba(102, 126, 234, 0.06)",
                  border: "1px solid rgba(102, 126, 234, 0.12)",
                  fontSize: "0.82rem",
                  color: "#a5b4fc",
                  marginBottom: 16,
                }}
              >
                🇮🇳 {career.indiaSpecific}
              </div>
            )}

            <div style={{ flex: 1 }} />

            <button
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
              onClick={() => {
                update({ chosenCareer: career, currentStep: "simulator" });
              }}
            >
              Explore This Path <HiArrowRight />
            </button>
          </div>
        ))}
      </div>

      <Disclaimer />
    </div>
  );
}
