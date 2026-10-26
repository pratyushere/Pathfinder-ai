const RAW_BASE = (import.meta.env.VITE_API_URL || "/api").trim();
const API_BASE = RAW_BASE.endsWith("/api")
  ? RAW_BASE.replace(/\/+$/, "")
  : RAW_BASE.startsWith("http")
  ? `${RAW_BASE.replace(/\/+$/, "")}/api`
  : "/api";


async function request(endpoint, data) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Network error" }));
    throw new Error(err.error || "Something went wrong");
  }
  return res.json();
}

export const api = {
  analyzeProfile: (profile) => request("/analyze-profile", profile),
  generateQuiz: (skill, degree) => request("/generate-quiz", { skill, degree }),
  evaluateQuiz: (quizData, userAnswers) => request("/evaluate-quiz", { quizData, userAnswers }),
  recommendCareers: (profile, verifiedSkills) => request("/recommend-careers", { profile, verifiedSkills }),
  generateRoadmap: (profile, chosenCareer, verifiedSkills) => request("/generate-roadmap", { profile, chosenCareer, verifiedSkills }),
  adaptRoadmap: (profile, currentRoadmap, weekNumber, feedback, completedWeeks) =>
    request("/adapt-roadmap", { profile, currentRoadmap, weekNumber, feedback, completedWeeks }),
};
