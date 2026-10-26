export function SkeletonCard({ lines = 3, height }) {
  return (
    <div
      className="glass-card"
      style={{ padding: 24, height: height || "auto" }}
    >
      <div
        className="skeleton"
        style={{ width: "60%", height: 20, marginBottom: 16 }}
      />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            width: `${85 - i * 10}%`,
            height: 14,
            marginBottom: 10,
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonQuiz() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="skeleton" style={{ width: "100%", height: 60 }} />
      {[1, 2, 3, 4].map((i) => (
        <div className="skeleton" key={i} style={{ width: "100%", height: 48 }} />
      ))}
    </div>
  );
}
