import { useApp } from "../context/AppContext";
import { HiSun, HiMoon, HiHome, HiRefresh } from "react-icons/hi";

export default function Navbar() {
  const { darkMode, update, currentStep, resetAll } = useApp();

  return (
    <nav className="navbar">
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => update({ currentStep: "landing" })}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "var(--gradient-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
            }}
          >
            🧭
          </div>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: "1.2rem",
              background: "linear-gradient(135deg, #667eea, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            PathFinder AI
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {currentStep !== "landing" && (
            <>
              <button
                className="btn-ghost"
                onClick={() => update({ currentStep: "landing" })}
                title="Home"
              >
                <HiHome size={18} />
              </button>
              {(currentStep === "dashboard" || currentStep === "roadmap") && (
                <button className="btn-ghost" onClick={() => update({ currentStep: "dashboard" })} title="Dashboard">
                  Dashboard
                </button>
              )}
            </>
          )}
          <button
            className="btn-ghost"
            onClick={() => update({ darkMode: !darkMode })}
            title={darkMode ? "Light mode" : "Dark mode"}
            style={{ fontSize: "1.1rem" }}
          >
            {darkMode ? <HiSun size={20} /> : <HiMoon size={20} />}
          </button>
          {currentStep !== "landing" && (
            <button
              className="btn-ghost"
              onClick={() => {
                if (window.confirm("Start over? This will clear all your data.")) resetAll();
              }}
              title="Start over"
              style={{ color: "#f5576c" }}
            >
              <HiRefresh size={18} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
