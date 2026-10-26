import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { api } from "../services/api";
import AgentProgress from "../components/AgentProgress";
import { SkeletonQuiz } from "../components/Skeletons";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from "recharts";
import { HiArrowRight, HiCheckCircle, HiXCircle } from "react-icons/hi";

const LEVEL_MAP = { Beginner: 1, Intermediate: 2, Advanced: 3 };
const LEVEL_COLORS = { Beginner: "#f5576c", Intermediate: "#f7b733", Advanced: "#38ef7d" };

export default function QuizPage() {
  const { profile, update, quizzes, quizResults, verifiedSkills, profileAnalysis } = useApp();
  const [phase, setPhase] = useState("analyzing"); // analyzing, quizzing, results
  const [agentStep, setAgentStep] = useState(0);
  const [skillsToVerify, setSkillsToVerify] = useState([]);
  const [currentSkillIdx, setCurrentSkillIdx] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [allResults, setAllResults] = useState([]);
  const [error, setError] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  // Phase 1: Analyze profile + generate first quiz IN PARALLEL
  useEffect(() => {
    if (phase !== "analyzing") return;
    let cancelled = false;

    async function analyze() {
      try {
        if (!profile?.skills?.length) {
          update({ currentStep: "profile" });
          return;
        }

        // Strictly use the student's claimed skills in the exact order entered
        const targetSkills = profile.skills.slice(0, 3);
        setSkillsToVerify(targetSkills);
        setAgentStep(0);

        // Run BOTH in parallel: profile analysis (background) + first quiz for targetSkills[0]
        const [analysis, firstQuiz] = await Promise.all([
          api.analyzeProfile(profile).catch((err) => {
            console.warn("Profile analysis failed (non-blocking):", err);
            return null; // Non-critical, don't block the quiz
          }),
          api.generateQuiz(targetSkills[0], profile.degree || "General"),
        ]);

        if (cancelled) return;

        // Store profile analysis for career recommender, but NEVER mutate skillsToVerify
        // Mutating skillsToVerify causes the active quiz topic to desynchronize from the displayed skill!
        if (analysis) {
          update({ profileAnalysis: analysis });
        }

        if (firstQuiz) {
          firstQuiz.skill = targetSkills[0];
        }

        setAgentStep(1);
        setCurrentQuiz(firstQuiz);
        setCurrentSkillIdx(0);
        setPhase("quizzing");
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }

    analyze();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line

  async function loadQuiz(skill, idx) {
    setLoadingQuiz(true);
    setCurrentSkillIdx(idx);
    setCurrentQuiz(null); // Unmount previous quiz immediately so old questions are never displayed
    setCurrentQIdx(0);
    setAnswers({});
    setShowExplanation(false);
    try {
      const quiz = await api.generateQuiz(skill, profile?.degree || "General");
      quiz.skill = skill;
      setCurrentQuiz(quiz);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingQuiz(false);
    }
  }

  function selectAnswer(questionIdx, answer) {
    if (showExplanation) return;
    setAnswers((prev) => ({ ...prev, [questionIdx]: answer }));
  }

  async function submitQuestion() {
    if (!showExplanation) {
      setShowExplanation(true);
      return;
    }

    // Move to next question
    if (currentQIdx < currentQuiz.questions.length - 1) {
      setCurrentQIdx(currentQIdx + 1);
      setShowExplanation(false);
    } else {
      // Quiz complete - evaluate
      const answerArray = currentQuiz.questions.map((_, i) => answers[i] || null);
      const result = await api.evaluateQuiz(currentQuiz, answerArray);
      result.skill = currentQuiz.skill || skillsToVerify[currentSkillIdx];

      const newResults = [...allResults, result];
      setAllResults(newResults);

      // Next skill or show results
      if (currentSkillIdx < skillsToVerify.length - 1) {
        const nextIdx = currentSkillIdx + 1;
        const nextSkill = skillsToVerify[nextIdx];
        await loadQuiz(nextSkill, nextIdx);
        setShowExplanation(false);
      } else {
        update({ verifiedSkills: newResults });
        setPhase("results");
      }
    }
  }

  if (error) {
    return (
      <div style={{ maxWidth: 600, margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
        <div className="glass-card" style={{ padding: 32 }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>😵</div>
          <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ color: "#94a3b8", marginBottom: 24 }}>{error}</p>
          <button className="btn-primary" onClick={() => { setError(null); setPhase("analyzing"); }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Phase 1: Analyzing
  if (phase === "analyzing") {
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
            🤖 AI Agents at Work
          </h2>
          <p style={{ color: "#94a3b8", marginBottom: 16, fontSize: "0.9rem" }}>
            Analyzing your profile and preparing skill verification...
          </p>
          <AgentProgress
            currentIndex={agentStep}
            steps={[
              { label: "Profile Analyzer Agent", description: "Understanding your background and strengths..." },
              { label: "Quiz Generator Agent", description: "Creating personalized skill assessments..." },
            ]}
          />
        </div>
      </div>
    );
  }

  // Phase 3: Results
  if (phase === "results") {
    const chartData = allResults.map((r) => ({
      skill: r.skill,
      Claimed: 3,
      Verified: LEVEL_MAP[r.verifiedLevel],
      verifiedLevel: r.verifiedLevel,
      score: r.correctAnswers,
    }));

    return (
      <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 24px 80px" }}>
        <div className="glass-card animate-fade-in-up" style={{ padding: 32, marginBottom: 24 }}>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            🏆 Skill Verification Results
          </h2>
          <p style={{ color: "#94a3b8", marginBottom: 28, fontSize: "0.9rem" }}>
            Here's how your claimed skills compare to your verified levels.
          </p>

          {/* Chart */}
          <div style={{ marginBottom: 32 }}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="skill" tick={{ fill: "#94a3b8", fontSize: 13 }} />
                <YAxis
                  domain={[0, 3]}
                  ticks={[1, 2, 3]}
                  tickFormatter={(v) => ["", "Beginner", "Intermediate", "Advanced"][v]}
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
                <Bar dataKey="Verified" radius={[6, 6, 0, 0]} name="Verified Level">
                  {chartData.map((entry, idx) => (
                    <Cell key={idx} fill={LEVEL_COLORS[entry.verifiedLevel]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {allResults.map((r, i) => (
              <div
                key={i}
                className="glass-card"
                style={{
                  padding: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{r.skill}</div>
                  <div style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                    {r.correctAnswers}/5 correct
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase" }}>Claimed</div>
                    <div style={{ fontWeight: 600, color: "rgba(102,126,234,0.7)" }}>Advanced</div>
                  </div>
                  <div style={{ fontSize: "1.2rem", color: "#64748b" }}>→</div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase" }}>Verified</div>
                    <div style={{ fontWeight: 700, color: LEVEL_COLORS[r.verifiedLevel] }}>
                      {r.verifiedLevel}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn-primary"
          style={{ width: "100%", justifyContent: "center", padding: "14px 0" }}
          onClick={() => update({ currentStep: "careers" })}
        >
          Get Career Recommendations <HiArrowRight />
        </button>
      </div>
    );
  }

  // Phase 2: Quizzing
  const q = currentQuiz?.questions?.[currentQIdx];

  return (
    <div style={{ maxWidth: 650, margin: "40px auto", padding: "0 24px 80px" }}>
      {/* Skill Progress */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 24,
          alignItems: "center",
        }}
      >
        {skillsToVerify.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <div
              style={{
                flex: 1,
                height: 6,
                borderRadius: 99,
                background:
                  i < currentSkillIdx
                    ? "var(--gradient-success)"
                    : i === currentSkillIdx
                    ? "var(--gradient-primary)"
                    : "rgba(255,255,255,0.08)",
              }}
            />
            <span style={{ fontSize: "0.72rem", color: "#94a3b8", whiteSpace: "nowrap" }}>
              {s}
            </span>
          </div>
        ))}
      </div>

      <div className="glass-card animate-fade-in-up" style={{ padding: 32 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.3rem" }}>
              {currentQuiz?.skill || skillsToVerify[currentSkillIdx]} Quiz
            </h2>
            <p style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
              Question {currentQIdx + 1} of {currentQuiz?.questions?.length || 5} • Skill {currentSkillIdx + 1} of {skillsToVerify.length} ({skillsToVerify[currentSkillIdx]})
            </p>
          </div>
          {q && (
            <span
              style={{
                padding: "4px 12px",
                borderRadius: 8,
                fontSize: "0.78rem",
                fontWeight: 600,
                background:
                  q.difficulty === "Easy"
                    ? "rgba(56, 239, 125, 0.12)"
                    : q.difficulty === "Medium"
                    ? "rgba(247, 183, 51, 0.12)"
                    : "rgba(245, 87, 108, 0.12)",
                color:
                  q.difficulty === "Easy" ? "#38ef7d" : q.difficulty === "Medium" ? "#f7b733" : "#f5576c",
              }}
            >
              {q.difficulty}
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="progress-bar" style={{ marginBottom: 24 }}>
          <div
            className="progress-bar-fill"
            style={{
              width: `${((currentQIdx + (showExplanation ? 1 : 0)) / (currentQuiz?.questions?.length || 5)) * 100}%`,
            }}
          />
        </div>

        {loadingQuiz ? (
          <SkeletonQuiz />
        ) : q ? (
          <div>
            <p style={{ fontSize: "1.05rem", fontWeight: 500, lineHeight: 1.6, marginBottom: 20 }}>
              {q.question}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Object.entries(q.options).map(([key, value]) => {
                let className = "quiz-option";
                if (showExplanation) {
                  if (key === q.correctAnswer) className += " correct";
                  else if (key === answers[currentQIdx]) className += " incorrect";
                } else if (answers[currentQIdx] === key) {
                  className += " selected";
                }
                return (
                  <div
                    key={key}
                    className={className}
                    onClick={() => selectAnswer(currentQIdx, key)}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        border: "1.5px solid rgba(255,255,255,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        flexShrink: 0,
                      }}
                    >
                      {key}
                    </div>
                    <span style={{ fontSize: "0.92rem" }}>{value}</span>
                    {showExplanation && key === q.correctAnswer && (
                      <HiCheckCircle size={20} color="#38ef7d" style={{ marginLeft: "auto" }} />
                    )}
                    {showExplanation && key === answers[currentQIdx] && key !== q.correctAnswer && (
                      <HiXCircle size={20} color="#f5576c" style={{ marginLeft: "auto" }} />
                    )}
                  </div>
                );
              })}
            </div>

            {showExplanation && (
              <div
                className="animate-fade-in-up"
                style={{
                  marginTop: 16,
                  padding: 16,
                  borderRadius: 12,
                  background: "rgba(102, 126, 234, 0.08)",
                  border: "1px solid rgba(102, 126, 234, 0.2)",
                  fontSize: "0.88rem",
                  lineHeight: 1.6,
                }}
              >
                💡 {q.explanation}
              </div>
            )}

            <button
              className="btn-primary"
              style={{ marginTop: 24, width: "100%", justifyContent: "center" }}
              disabled={answers[currentQIdx] === undefined}
              onClick={submitQuestion}
            >
              {!showExplanation
                ? "Check Answer"
                : currentQIdx < currentQuiz.questions.length - 1
                ? "Next Question"
                : currentSkillIdx < skillsToVerify.length - 1
                ? `Next Skill: ${skillsToVerify[currentSkillIdx + 1]}`
                : "See Results"}
              <HiArrowRight />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
