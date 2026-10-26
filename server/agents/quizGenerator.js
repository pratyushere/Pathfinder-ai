import { callGemini } from "../utils/gemini.js";

/**
 * Quiz Generator Agent
 * Generates a 5-question MCQ quiz for a given skill to verify the student's proficiency.
 * Works for both technical and non-technical skills.
 */
export async function generateQuiz(skill, studentDegree) {
  const cleanSkill = (skill || "").trim();
  const prompt = `You are a specialized skill assessment AI agent for Indian college students.
Your ONLY task is to generate a 5-question multiple-choice quiz STRICTLY AND EXCLUSIVELY on the skill: "${cleanSkill}".

Student degree background: ${studentDegree || "General"} in India.

CRITICAL TOPIC ISOLATION RULES (MANDATORY):
1. STRICT TOPIC EXCLUSIVITY: Every single question (1 to 5), all options (A, B, C, D), and every explanation MUST be 100% directly and exclusively about "${cleanSkill}".
2. ABSOLUTELY ZERO TOPIC BLEED: Never mix in questions from other skills, hobbies, subjects, or degrees.
   - If the skill is "Writing Articles" or "Content Writing", EVERY question MUST test article writing (e.g. structuring articles, headlines, research, SEO writing, tone, citations, hooks, editing, audience engagement). Do NOT ask about cameras, photography, coding, or unrelated fields.
   - If the skill is "Photography", EVERY question MUST test photography (e.g. aperture, ISO, shutter speed, exposure triangle, framing, rule of thirds, lighting, lens types, depth of field). Do NOT ask about article writing or coding.
   - If the skill is "Python", EVERY question MUST test Python programming concepts, syntax, and libraries.
3. DIFFICULTY MIX: 2 Easy (core fundamental concepts of ${cleanSkill}), 2 Medium (practical scenario/application of ${cleanSkill}), 1 Hard (nuance/best practice in ${cleanSkill}).
4. FRIENDLY ASSESSMENT: Questions should feel like a fair assessment for a college student, NOT an intimidating exam.
5. FORMAT: Exactly 4 options (A, B, C, D) per question, with exactly one unambiguous correct answer and a brief helpful explanation.

Return a JSON object with this exact structure:
{
  "skill": "${cleanSkill}",
  "questions": [
    {
      "id": 1,
      "difficulty": "Easy",
      "question": "Question text testing ${cleanSkill}?",
      "options": {
        "A": "Option A text",
        "B": "Option B text",
        "C": "Option C text",
        "D": "Option D text"
      },
      "correctAnswer": "A",
      "explanation": "Brief explanation of why this answer is correct in the context of ${cleanSkill}"
    }
  ]
}

Return ONLY the JSON object, no markdown or extra text.`;

  const quiz = await callGemini(prompt);
  if (!quiz || !Array.isArray(quiz.questions)) {
    throw new Error(`Failed to generate valid quiz for ${cleanSkill}`);
  }
  quiz.skill = cleanSkill;
  return quiz;
}

/**
 * Evaluates quiz answers and classifies skill level.
 */
export function evaluateQuiz(quizData, userAnswers) {
  let correct = 0;
  const results = quizData.questions.map((q, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === q.correctAnswer;
    if (isCorrect) correct++;
    return {
      questionId: q.id,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
      difficulty: q.difficulty,
    };
  });

  let verifiedLevel;
  if (correct >= 4) {
    verifiedLevel = "Advanced";
  } else if (correct >= 2) {
    verifiedLevel = "Intermediate";
  } else {
    verifiedLevel = "Beginner";
  }

  return {
    skill: quizData.skill,
    totalQuestions: 5,
    correctAnswers: correct,
    percentage: (correct / 5) * 100,
    verifiedLevel,
    details: results,
  };
}
