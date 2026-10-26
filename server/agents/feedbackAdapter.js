import { callGemini } from "../utils/gemini.js";

/**
 * Feedback Adapter Agent
 * Adjusts the remaining roadmap based on student feedback (Too Hard / Too Easy).
 */
export async function adaptRoadmap(profile, currentRoadmap, weekNumber, feedback, completedWeeks) {
  const prompt = `You are an adaptive learning AI agent. A student has provided feedback on their learning roadmap.

Student: ${profile.name}, studying ${profile.degree}, Year ${profile.year}
Career Path: ${currentRoadmap.careerTitle}

Current week: ${weekNumber}
Student feedback for week ${weekNumber}: "${feedback}"

Completed weeks so far: ${JSON.stringify(completedWeeks)}

Remaining weeks to adjust (weeks ${weekNumber + 1} to ${currentRoadmap.totalWeeks}):
${JSON.stringify(currentRoadmap.weeks.filter((w) => w.week > weekNumber))}

Based on the feedback, adjust the REMAINING weeks of the roadmap:
- If "Too Hard": simplify topics, add more foundational resources, break down tasks into smaller steps, reduce estimated hours
- If "Too Easy": increase difficulty, add advanced topics, suggest more challenging tasks, add stretch goals

Return a JSON object with this exact structure:
{
  "adjustmentSummary": "Brief explanation of what was changed and why",
  "adjustedWeeks": [
    {
      "week": ${weekNumber + 1},
      "title": "Adjusted week title",
      "topics": ["Topic 1", "Topic 2"],
      "resources": [
        {
          "name": "Resource name",
          "url": "URL",
          "platform": "Platform name",
          "type": "Type"
        }
      ],
      "task": "Adjusted task description",
      "estimatedHours": 8
    }
  ]
}

IMPORTANT:
- Only return weeks from ${weekNumber + 1} onwards
- Keep using FREE resources (NPTEL, YouTube, freeCodeCamp, Coursera audit, GeeksforGeeks)
- Maintain continuity with what the student has already learned
- Return ONLY the JSON object, no markdown or extra text.`;

  return await callGemini(prompt);
}
