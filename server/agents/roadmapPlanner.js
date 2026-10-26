import { callGemini } from "../utils/gemini.js";

/**
 * Roadmap Planner Agent
 * Generates a week-by-week learning roadmap for the chosen career.
 */
export async function generateRoadmap(profile, chosenCareer, verifiedSkills) {
  const skillSummary = verifiedSkills
    .map((s) => `${s.skill}: ${s.verifiedLevel}`)
    .join(", ");

  const prompt = `You are a learning roadmap planner AI agent for Indian college students.

Student Profile:
- Name: ${profile.name}
- Degree/Branch: ${profile.degree}
- Year of Study: ${profile.year}

Chosen Career Path: ${chosenCareer.title}
Required Skills: ${chosenCareer.requiredSkills.join(", ")}
Current Skill Gaps: ${chosenCareer.skillGaps.join(", ")}

Verified Skill Levels: ${skillSummary}

Generate a detailed 10-week learning roadmap to bridge the skill gaps and prepare the student for the chosen career.

Return a JSON object with this exact structure:
{
  "careerTitle": "${chosenCareer.title}",
  "totalWeeks": 10,
  "skillGapAnalysis": {
    "required": ["skill1", "skill2"],
    "current": ["skill1 - level"],
    "gaps": ["skill that needs improvement or learning"]
  },
  "weeks": [
    {
      "week": 1,
      "title": "Week title/theme",
      "topics": ["Topic 1", "Topic 2"],
      "resources": [
        {
          "name": "Resource name",
          "url": "URL",
          "platform": "YouTube/NPTEL/freeCodeCamp/Coursera/etc.",
          "type": "Video/Course/Article"
        }
      ],
      "task": "A specific hands-on task or mini-project for this week",
      "estimatedHours": 8
    }
  ],
  "portfolioProjects": [
    {
      "title": "Project Title",
      "description": "What to build and why it helps",
      "skills": ["Skills demonstrated"],
      "difficulty": "Beginner/Intermediate/Advanced",
      "estimatedDays": 5
    }
  ]
}

IMPORTANT:
- Use FREE resources: NPTEL, YouTube channels, freeCodeCamp, Coursera (audit mode), GeeksforGeeks, etc.
- Resources should have real, well-known platform URLs (use general page URLs, not broken links)
- Tasks should be practical and buildable
- Difficulty should ramp up gradually
- Portfolio projects should be impressive for Indian campus placements/interviews
- Return ONLY the JSON object, no markdown or extra text.`;

  return await callGemini(prompt);
}
