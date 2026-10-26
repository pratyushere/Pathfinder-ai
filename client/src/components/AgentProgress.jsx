export default function AgentProgress({ steps, currentIndex }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "24px 0",
      }}
    >
      {steps.map((step, i) => {
        const isActive = i === currentIndex;
        const isDone = i < currentIndex;
        return (
          <div
            key={i}
            className="animate-fade-in-up"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              opacity: i <= currentIndex ? 1 : 0.3,
              transition: "opacity 0.4s ease",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.85rem",
                fontWeight: 700,
                background: isDone
                  ? "var(--gradient-success)"
                  : isActive
                  ? "var(--gradient-primary)"
                  : "rgba(255,255,255,0.05)",
                border: isDone || isActive ? "none" : "1px solid rgba(255,255,255,0.15)",
                color: isDone || isActive ? "white" : "rgba(255,255,255,0.3)",
                flexShrink: 0,
              }}
            >
              {isDone ? "✓" : i + 1}
            </div>
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: isActive ? "#a5b4fc" : undefined,
                }}
              >
                {step.label}
              </div>
              {isActive && step.description && (
                <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: 2 }}>
                  {step.description}
                </div>
              )}
            </div>
            {isActive && (
              <div
                className="animate-spin"
                style={{
                  width: 18,
                  height: 18,
                  border: "2px solid rgba(102,126,234,0.2)",
                  borderTopColor: "#667eea",
                  borderRadius: "50%",
                  marginLeft: "auto",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
