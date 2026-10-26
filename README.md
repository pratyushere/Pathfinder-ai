# 🧭 PathFinder AI — AI-Powered Student Career Guidance System

An intelligent career guidance platform built for Indian college students. Uses multiple AI agents (powered by Google Gemini) to verify skills, recommend personalized career paths, and generate adaptive learning roadmaps.

---

## ✨ Features

### 1. Student Profile Input
Multi-step form collecting name, degree/branch, year, skills (tag-style), interests (chips), career goals, and work style preferences.

### 2. Skill Verification (Key Differentiator)
- AI generates 5-question MCQ quizzes for the top 3 skills
- Classifies each skill as Beginner / Intermediate / Advanced
- Shows a "Claimed vs Verified" comparison chart
- All later recommendations use **verified** levels

### 3. Career Recommendations
- 3 personalized career paths with match %, rationale, required skills, entry roles, salary ranges (INR)
- India-specific options (campus placements, GATE, CAT, UPSC, etc.)

### 4. Future Simulator
- Side-by-side comparison with radar chart: skill gaps, demand, effort, growth
- Pick one career to pursue

### 5. Skill Gap Analysis + Learning Roadmap
- Visual gap analysis (required vs verified skills)
- 10-week roadmap with free resources (NPTEL, YouTube, freeCodeCamp, Coursera audit)
- 2–3 portfolio project suggestions

### 6. Progress Tracking & Adaptive Feedback
- Mark weeks as Done / Too Hard / Too Easy
- AI adapts remaining roadmap based on feedback
- Overall progress bar

### 7. Agentic Architecture
Five separate AI agents, each with its own prompt:
1. **Profile Analyzer Agent** — Analyzes the student profile
2. **Quiz Generator Agent** — Creates skill verification quizzes
3. **Career Recommender Agent** — Generates personalized career paths
4. **Roadmap Planner Agent** — Creates week-by-week learning plans
5. **Feedback Adapter Agent** — Adjusts roadmaps based on student feedback

---

## 🏗️ Tech Stack

| Layer     | Technology                     |
|-----------|-------------------------------|
| Frontend  | React (Vite) + Tailwind CSS  |
| Backend   | Node.js + Express             |
| AI        | Google Gemini API (gemini-2.5-flash) |
| Charts    | Recharts                      |
| Storage   | Browser localStorage          |

---

## 📁 Project Structure

```
pathfinder-ai/
├── client/                   # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── AgentProgress.jsx
│   │   │   ├── Skeletons.jsx
│   │   │   └── Disclaimer.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── QuizPage.jsx
│   │   │   ├── CareersPage.jsx
│   │   │   ├── SimulatorPage.jsx
│   │   │   ├── RoadmapPage.jsx
│   │   │   └── DashboardPage.jsx
│   │   ├── services/         # API service layer
│   │   │   └── api.js
│   │   ├── context/          # React context (state management)
│   │   │   └── AppContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css         # Design system
│   ├── index.html
│   └── vite.config.js
│
├── server/                   # Express backend
│   ├── agents/               # AI agent modules
│   │   ├── profileAnalyzer.js
│   │   ├── quizGenerator.js
│   │   ├── careerRecommender.js
│   │   ├── roadmapPlanner.js
│   │   └── feedbackAdapter.js
│   ├── routes/
│   │   └── api.js
│   ├── utils/
│   │   └── gemini.js         # Gemini API wrapper with retry
│   ├── index.js
│   ├── .env
│   └── .env.example
│
└── README.md
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js 18+
- A Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### 1. Clone and install

```bash
# Install server dependencies
cd pathfinder-ai/server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure API key

```bash
# In the server directory, edit .env
cd ../server
# Set your Gemini API key:
# GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Run both servers

**Terminal 1 — Backend:**
```bash
cd pathfinder-ai/server
npm run dev
# Runs on http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd pathfinder-ai/client
npm run dev
# Runs on http://localhost:5173
```

### 4. Open the app
Visit **http://localhost:5173** in your browser.

---

## 🔄 User Flow

```
Landing → Profile Form → Skill Verification (Quiz × 3)
  → Career Recommendations → Future Simulator
  → Learning Roadmap → Progress Tracking → Dashboard
```

---

## 🤖 Agentic Architecture

Each AI agent operates as a separate backend endpoint with its own specialized prompt:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│ Profile Analyzer │ →  │  Quiz Generator   │ →  │ Career Recommender  │
│     Agent       │    │      Agent        │    │       Agent         │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
                                                        │
                                                        ▼
                       ┌──────────────────┐    ┌─────────────────────┐
                       │ Feedback Adapter  │ ←  │  Roadmap Planner    │
                       │     Agent        │    │       Agent         │
                       └──────────────────┘    └─────────────────────┘
```

- All agents return **strict JSON** responses
- Each call includes **one retry** on failure
- The frontend shows agent progress indicators during processing

---

## ⚠️ Disclaimer

AI-generated guidance. Verify with mentors and official sources before making career decisions. Salary ranges are approximate and vary by location, company, and experience.

---

## 📄 License

MIT
