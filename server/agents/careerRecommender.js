import { callGemini } from "../utils/gemini.js";

/**
 * Career Recommender Agent
 * Generates 3 personalized career paths based on verified skills and profile.
 * Covers ALL fields — engineering, arts, commerce, science, law, media, and more.
 */
export async function recommendCareers(profile, verifiedSkills) {
  const skillSummary = verifiedSkills
    .map((s) => `${s.skill}: Verified as ${s.verifiedLevel} (${s.correctAnswers}/5 correct)`)
    .join("\n");

  const prompt = `You are an expert career counselor AI agent specializing in career guidance for ALL Indian college students — not just engineering students. You cover careers across Engineering, Arts, Commerce, Science, Law, Medicine, Media, Design, Government, and more.

Student Profile:
- Name: ${profile.name}
- Degree/Branch: ${profile.degree}
- Year of Study: ${profile.year}
- Interests: ${profile.interests.join(", ")}
- Career Goal: ${profile.careerGoal || "Not specified"}
- Work Style Preference: ${profile.workStyle || "Not specified"}

Verified Skill Levels (from quiz assessment):
${skillSummary}

All claimed skills: ${profile.skills.join(", ")}

Based on the VERIFIED skill levels (not claimed) AND the student's degree/branch, generate exactly 3 personalized career path recommendations.

IMPORTANT DIVERSITY RULES:
- Match careers to the student's ACTUAL background. A B.Com student should get commerce/finance careers, not software engineering.
- A journalism student should get media/communication careers.
- An arts student should get relevant arts/humanities careers.
- Even for engineering students, include at least ONE non-traditional or cross-disciplinary option.
- Consider the FULL spectrum of Indian careers:
  * Commerce: CA, CS, CMA, Investment Banking, Financial Analyst, Actuary, Tax Consultant
  * Arts/Humanities: Journalism, Content Writing, UX Research, Public Policy, Social Work, Teaching, Civil Services
  * Law: Corporate Law, Litigation, Legal Tech, Intellectual Property
  * Media: Film, Advertising, Digital Marketing, PR, Broadcasting
  * Design: UI/UX, Graphic Design, Product Design, Fashion Design, Interior Design
  * Management: MBA paths, HR, Operations, Consulting, Entrepreneurship
  * Government: UPSC, SSC, State PSC, Banking (IBPS/SBI), Railways, Defense
  * Science: Research, Pharma, Biotech, Environmental Science, Data Science
  * Engineering/Tech: Software Dev, Data Engineering, DevOps, Product Management, etc.

Return a JSON object with this exact structure:
{
  "careers": [
    {
      "id": 1,
      "title": "Career Title",
      "matchPercentage": 85,
      "whyItFits": "2-3 sentence explanation of why this career fits the student based on their degree, verified skills, and interests",
      "requiredSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
      "currentSkillMatch": ["skills the student already has at sufficient level"],
      "skillGaps": ["skills the student needs to develop"],
      "entryLevelRoles": ["Role 1", "Role 2", "Role 3"],
      "salaryRange": "₹X LPA - ₹Y LPA (approximate)",
      "indiaSpecific": "Relevant India-specific advice (campus placements, competitive exams like CA/GATE/CAT/UPSC/CLAT, specific companies or sectors, freelancing platforms, etc.)",
      "demandLevel": "High/Medium/Low",
      "growthPotential": "Description of 5-year growth trajectory",
      "effortLevel": "Description of effort needed over 6 months to become job-ready"
    }
  ]
}

IMPORTANT:
- matchPercentage should be realistic (50-95 range), based on how well verified skills align
- Salary ranges should be in INR LPA and marked as approximate
- Consider the student's year of study for recommendation timing
- Make recommendations SPECIFIC to their degree — don't suggest software dev to a journalism student unless they have relevant skills
- Return ONLY the JSON object, no markdown or extra text.`;

  return await callGemini(prompt);
}
