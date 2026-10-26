import express from "express";
import { analyzeProfile } from "../agents/profileAnalyzer.js";
import { generateQuiz, evaluateQuiz } from "../agents/quizGenerator.js";
import { recommendCareers } from "../agents/careerRecommender.js";
import { generateRoadmap } from "../agents/roadmapPlanner.js";
import { adaptRoadmap } from "../agents/feedbackAdapter.js";

const router = express.Router();

// ─── Agent 1: Analyze Profile ───────────────────────────────────────
router.post("/analyze-profile", async (req, res) => {
  try {
    const profile = req.body;
    if (!profile.name || !profile.skills || !profile.interests) {
      return res.status(400).json({ error: "Missing required profile fields" });
    }
    const analysis = await analyzeProfile(profile);
    res.json(analysis);
  } catch (error) {
    console.error("Profile analysis error:", error);
    res.status(500).json({ error: "Failed to analyze profile. Please try again." });
  }
});

// ─── Agent 2: Generate Quiz ─────────────────────────────────────────
router.post("/generate-quiz", async (req, res) => {
  try {
    const { skill, degree } = req.body;
    if (!skill) {
      return res.status(400).json({ error: "Skill is required" });
    }
    const quiz = await generateQuiz(skill, degree || "Engineering");
    res.json(quiz);
  } catch (error) {
    console.error("Quiz generation error:", error);
    res.status(500).json({ error: "Failed to generate quiz. Please try again." });
  }
});

// ─── Evaluate Quiz (local logic, no AI) ─────────────────────────────
router.post("/evaluate-quiz", (req, res) => {
  try {
    const { quizData, userAnswers } = req.body;
    if (!quizData || !userAnswers) {
      return res.status(400).json({ error: "Quiz data and answers are required" });
    }
    const result = evaluateQuiz(quizData, userAnswers);
    res.json(result);
  } catch (error) {
    console.error("Quiz evaluation error:", error);
    res.status(500).json({ error: "Failed to evaluate quiz." });
  }
});

// ─── Agent 3: Career Recommendations ────────────────────────────────
router.post("/recommend-careers", async (req, res) => {
  try {
    const { profile, verifiedSkills } = req.body;
    if (!profile || !verifiedSkills) {
      return res.status(400).json({ error: "Profile and verified skills are required" });
    }
    const recommendations = await recommendCareers(profile, verifiedSkills);
    res.json(recommendations);
  } catch (error) {
    console.error("Career recommendation error:", error);
    res.status(500).json({ error: "Failed to generate career recommendations. Please try again." });
  }
});

// ─── Agent 4: Generate Roadmap ──────────────────────────────────────
router.post("/generate-roadmap", async (req, res) => {
  try {
    const { profile, chosenCareer, verifiedSkills } = req.body;
    if (!profile || !chosenCareer || !verifiedSkills) {
      return res.status(400).json({ error: "Profile, chosen career, and verified skills are required" });
    }
    const roadmap = await generateRoadmap(profile, chosenCareer, verifiedSkills);
    res.json(roadmap);
  } catch (error) {
    console.error("Roadmap generation error:", error);
    res.status(500).json({ error: "Failed to generate roadmap. Please try again." });
  }
});

// ─── Agent 5: Adapt Roadmap ─────────────────────────────────────────
router.post("/adapt-roadmap", async (req, res) => {
  try {
    const { profile, currentRoadmap, weekNumber, feedback, completedWeeks } = req.body;
    if (!profile || !currentRoadmap || !weekNumber || !feedback) {
      return res.status(400).json({ error: "All fields are required for adaptation" });
    }
    const adapted = await adaptRoadmap(profile, currentRoadmap, weekNumber, feedback, completedWeeks || []);
    res.json(adapted);
  } catch (error) {
    console.error("Roadmap adaptation error:", error);
    res.status(500).json({ error: "Failed to adapt roadmap. Please try again." });
  }
});

export default router;
