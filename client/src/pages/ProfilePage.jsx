import { useState } from "react";
import { useApp } from "../context/AppContext";
import { HiArrowRight, HiArrowLeft, HiX } from "react-icons/hi";

const INTEREST_OPTIONS = [
  // Tech
  "Data Science",
  "Web Development",
  "AI / Machine Learning",
  "Mobile Development",
  "UI/UX Design",
  "Cybersecurity",
  "Cloud & DevOps",
  "Game Development",
  // Commerce & Finance
  "Finance & Banking",
  "Chartered Accountancy (CA)",
  "Stock Market & Trading",
  "Accounting & Taxation",
  // Arts & Humanities
  "Journalism & Media",
  "Content Writing & Blogging",
  "Public Policy & Governance",
  "Psychology & Counseling",
  "Teaching & Education",
  // Law
  "Corporate Law",
  "Civil Services (UPSC/SSC)",
  // Management
  "Management & MBA",
  "Human Resources (HR)",
  "Consulting",
  "Product Management",
  "Entrepreneurship",
  // Design & Creative
  "Graphic & Visual Design",
  "Fashion & Interior Design",
  "Film & Video Production",
  // Science & Research
  "Research & Academia",
  "GATE / PSU",
  "Healthcare & Pharma",
  // General
  "Digital Marketing",
  "Freelancing",
  "Social Work & NGOs",
];

const WORK_STYLES = [
  "Corporate (9-to-5, stability)",
  "Startup (fast-paced, equity)",
  "Freelance / Remote",
  "Government / Public Sector",
  "Research / Academia",
  "Hybrid / Flexible",
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year", "Graduated"];

export default function ProfilePage() {
  const { update } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    degree: "",
    year: "",
    skills: [],
    interests: [],
    careerGoal: "",
    workStyle: "",
  });
  const [skillInput, setSkillInput] = useState("");

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      set("skills", [...form.skills, s]);
    }
    setSkillInput("");
  };

  const removeSkill = (s) => set("skills", form.skills.filter((x) => x !== s));

  const toggleInterest = (interest) => {
    set(
      "interests",
      form.interests.includes(interest)
        ? form.interests.filter((x) => x !== interest)
        : [...form.interests, interest]
    );
  };

  const canNext = () => {
    if (step === 0) return form.name && form.degree && form.year;
    if (step === 1) return form.skills.length >= 3;
    if (step === 2) return form.interests.length >= 1;
    return true;
  };

  const handleSubmit = () => {
    update({
      profile: form,
      currentStep: "quiz",
      verifiedSkills: [],
      quizzes: {},
      quizResults: {},
      profileAnalysis: null,
      careers: null,
      chosenCareer: null,
      roadmap: null,
    });
  };

  const totalSteps = 4;

  return (
    <div
      style={{
        maxWidth: 640,
        margin: "0 auto",
        padding: "40px 24px 80px",
        minHeight: "80vh",
      }}
    >
      {/* Step Indicator */}
      <div className="step-indicator" style={{ marginBottom: 40, padding: "0 20px" }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} style={{ display: "contents" }}>
            <div className={`step-dot ${i < step ? "completed" : i === step ? "active" : ""}`}>
              {i < step ? "✓" : i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div className={`step-line ${i < step ? "completed" : ""}`} />
            )}
          </div>
        ))}
      </div>

      <div className="glass-card animate-fade-in-up" style={{ padding: 32 }}>
        {/* Step 0: Basic Info */}
        {step === 0 && (
          <div>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              👋 Tell us about yourself
            </h2>
            <p style={{ color: "#94a3b8", marginBottom: 28, fontSize: "0.9rem" }}>
              Let's start with the basics.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label className="input-label">Full Name</label>
                <input
                  className="input-field"
                  placeholder="e.g. Priya Sharma"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>
              <div>
                <label className="input-label">Degree / Branch</label>
                <input
                  className="input-field"
                  placeholder="e.g. B.Tech CS, B.Com, BA English, BBA, LLB, B.Sc Physics..."
                  value={form.degree}
                  onChange={(e) => set("degree", e.target.value)}
                />
              </div>
              <div>
                <label className="input-label">Year of Study</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {YEARS.map((y) => (
                    <button
                      key={y}
                      className={`chip ${form.year === y ? "active" : ""}`}
                      onClick={() => set("year", y)}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Skills */}
        {step === 1 && (
          <div>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              🛠️ What are your skills?
            </h2>
            <p style={{ color: "#94a3b8", marginBottom: 28, fontSize: "0.9rem" }}>
              Add at least 3 skills. We'll quiz you on the top 3 to verify your level.
            </p>

            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input
                className="input-field"
                placeholder="Type a skill and press Enter..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <button className="btn-primary" onClick={addSkill} style={{ whiteSpace: "nowrap" }}>
                Add
              </button>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {form.skills.map((s) => (
                <span key={s} className="chip active" onClick={() => removeSkill(s)}>
                  {s} <HiX size={14} />
                </span>
              ))}
            </div>

            {form.skills.length < 3 && (
              <p style={{ fontSize: "0.82rem", color: "#f5576c" }}>
                Add at least {3 - form.skills.length} more skill{3 - form.skills.length > 1 ? "s" : ""}.
              </p>
            )}

            <p style={{ fontSize: "0.82rem", color: "#64748b", marginTop: 16 }}>
              💡 Examples: Python, Excel, Communication, Writing, Accounting, Tally, Research, Public Speaking, Photoshop, SQL, Leadership, Video Editing, Critical Thinking, Negotiation
            </p>
          </div>
        )}

        {/* Step 2: Interests */}
        {step === 2 && (
          <div>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              ✨ What interests you?
            </h2>
            <p style={{ color: "#94a3b8", marginBottom: 28, fontSize: "0.9rem" }}>
              Select all areas that excite you.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  className={`chip ${form.interests.includes(interest) ? "active" : ""}`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Goals & Style */}
        {step === 3 && (
          <div>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              🎯 Career Preferences
            </h2>
            <p style={{ color: "#94a3b8", marginBottom: 28, fontSize: "0.9rem" }}>
              Optional, but helps us give better recommendations.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label className="input-label">Career Goal (optional)</label>
                <input
                  className="input-field"
                  placeholder="e.g. Data Scientist at a product company"
                  value={form.careerGoal}
                  onChange={(e) => set("careerGoal", e.target.value)}
                />
              </div>
              <div>
                <label className="input-label">Preferred Work Style</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {WORK_STYLES.map((ws) => (
                    <button
                      key={ws}
                      className={`chip ${form.workStyle === ws ? "active" : ""}`}
                      onClick={() => set("workStyle", ws)}
                    >
                      {ws}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 32,
          }}
        >
          <button
            className="btn-ghost"
            onClick={() => (step > 0 ? setStep(step - 1) : update({ currentStep: "landing" }))}
          >
            <HiArrowLeft size={16} /> Back
          </button>

          {step < totalSteps - 1 ? (
            <button
              className="btn-primary"
              disabled={!canNext()}
              onClick={() => setStep(step + 1)}
            >
              Next <HiArrowRight />
            </button>
          ) : (
            <button className="btn-primary" onClick={handleSubmit}>
              Start Skill Verification <HiArrowRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
