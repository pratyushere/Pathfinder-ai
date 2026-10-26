import { callGemini } from "../utils/gemini.js";

/**
 * Profile Analyzer Agent
 * Analyzes the student profile and returns a structured summary
 * with inferred strengths, potential career directions, and top skills to verify.
 */
export async function analyzeProfile(profile) {
  const prompt = `You are a career guidance AI agent for ALL Indian college students — including Engineering, Arts, Commerce, Science, Law, Medicine, Media, Design, and any other field.
Analyze this student profile and return a structured JSON summary.

Student Profile:
- Name: ${profile.name}
- Degree/Branch: ${profile.degree}
- Year of Study: ${profile.year}
- Skills: ${profile.skills.join(", ")}
- Interests: ${profile.interests.join(", ")}
- Career Goal: ${profile.careerGoal || "Not specified"}
- Preferred Work Style: ${profile.workStyle || "Not specified"}

Return a JSON object with this exact structure:
{
  "summary": "A 2-3 sentence summary of the student's profile, considering their specific degree/branch",
  "strengths": ["strength1", "strength2", "strength3"],
  "potentialDirections": ["direction1", "direction2", "direction3"],
  "topSkillsToVerify": ["skill1", "skill2", "skill3"],
  "observations": "Any notable observations about the profile"
}

IMPORTANT:
- topSkillsToVerify must contain exactly 3 skills from the student's listed skills, chosen as the most career-relevant ones for THEIR specific background.
- For non-technical students (e.g. B.Com, BA, BBA, LLB), pick skills like Communication, Writing, Accounting, Research, etc. — NOT coding skills they haven't listed.
- Keep India-specific context in mind (campus placements, competitive exams like CA/UPSC/CLAT/CAT, etc.)
- Return ONLY the JSON object, no markdown or extra text.`;

  return await callGemini(prompt);
}
