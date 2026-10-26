import { useApp } from "../context/AppContext";
import { HiArrowRight, HiLightningBolt, HiAcademicCap, HiChartBar, HiClipboardCheck } from "react-icons/hi";

const features = [
  {
    icon: <HiClipboardCheck size={28} />,
    title: "Skill Verification",
    desc: "AI-generated quizzes verify your actual skill levels — no more guessing.",
    gradient: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  {
    icon: <HiLightningBolt size={28} />,
    title: "Smart Career Matching",
    desc: "Get 3 personalized career paths based on verified skills, not self-claims.",
    gradient: "linear-gradient(135deg, #f093fb, #f5576c)",
  },
  {
    icon: <HiChartBar size={28} />,
    title: "Future Simulator",
    desc: "Compare careers side-by-side: demand, salary, skill gaps, and growth.",
    gradient: "linear-gradient(135deg, #11998e, #38ef7d)",
  },
  {
    icon: <HiAcademicCap size={28} />,
    title: "Adaptive Roadmap",
    desc: "Week-by-week learning plan with free resources that adapts to your pace.",
    gradient: "linear-gradient(135deg, #fc4a1a, #f7b733)",
  },
];

export default function LandingPage() {
  const { update, profile } = useApp();

  return (
    <div>
      {/* Hero */}
      <section
        className="hero-bg"
        style={{
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "60px 24px",
        }}
      >
        <div style={{ maxWidth: 720, position: "relative", zIndex: 1 }}>
          <div
            className="animate-fade-in-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              borderRadius: 99,
              background: "rgba(102, 126, 234, 0.12)",
              border: "1px solid rgba(102, 126, 234, 0.25)",
              fontSize: "0.85rem",
              fontWeight: 500,
              color: "#a5b4fc",
              marginBottom: 28,
            }}
          >
            🤖 Powered by AI Agents
          </div>

          <h1
            className="animate-fade-in-up animate-delay-1"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: 20,
              background: "linear-gradient(135deg, #ffffff 30%, #a5b4fc 70%, #c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Discover Your Perfect
            <br />
            Career Path
          </h1>

          <p
            className="animate-fade-in-up animate-delay-2"
            style={{
              fontSize: "1.15rem",
              color: "#94a3b8",
              lineHeight: 1.7,
              marginBottom: 36,
              maxWidth: 560,
              margin: "0 auto 36px",
            }}
          >
            AI-powered career guidance built for Indian college students. Verify your skills,
            explore personalized career paths, and get a week-by-week roadmap to your dream job.
          </p>

          <div
            className="animate-fade-in-up animate-delay-3"
            style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
          >
            <button
              className="btn-primary pulse-glow"
              style={{ padding: "14px 36px", fontSize: "1rem" }}
              onClick={() => update({ currentStep: profile ? "dashboard" : "profile" })}
            >
              {profile ? "Continue to Dashboard" : "Get Started"} <HiArrowRight />
            </button>
            {profile && (
              <button
                className="btn-secondary"
                onClick={() => update({ currentStep: "profile" })}
              >
                Start Fresh
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <h2
          style={{
            textAlign: "center",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          How It Works
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "1rem",
            marginBottom: 48,
          }}
        >
          Five AI agents work together to analyze, verify, recommend, and guide you.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 24,
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="glass-card animate-fade-in-up"
              style={{
                padding: 28,
                animationDelay: `${i * 0.1}s`,
                opacity: 0,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: f.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  marginBottom: 18,
                }}
              >
                {f.icon}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>
                {f.title}
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Flow diagram */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 24px 80px",
          textAlign: "center",
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          {["📝 Profile", "🧪 Verify", "🎯 Careers", "🔮 Simulate", "🗺️ Roadmap", "📈 Track"].map(
            (step, i, arr) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    padding: "8px 18px",
                    borderRadius: 10,
                    background: "rgba(102, 126, 234, 0.1)",
                    border: "1px solid rgba(102, 126, 234, 0.2)",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  {step}
                </div>
                {i < arr.length - 1 && (
                  <span style={{ color: "#667eea", fontSize: "1.2rem" }}>→</span>
                )}
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
