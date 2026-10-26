import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

// ─── Provider Clients ───────────────────────────────────────────────
const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

// ─── Individual Provider Calls ──────────────────────────────────────

async function callGeminiProvider(prompt) {
  const response = await gemini.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });
  const text = response.text.trim();
  return JSON.parse(text);
}

async function callOpenAIProvider(prompt) {
  if (!openai) throw new Error("OpenAI API key not configured");
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an AI that responds ONLY with valid JSON. No markdown, no explanation, just the JSON object.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });
  const text = response.choices[0].message.content.trim();
  return JSON.parse(text);
}

async function callGroqProvider(prompt) {
  if (!groq) throw new Error("Groq API key not configured");
  const models = ["openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b"];
  let lastError;
  for (const model of models) {
    try {
      const response = await groq.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: "You are an AI that responds ONLY with valid JSON. No markdown, no explanation, just the JSON object.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      });
      const text = response.choices[0].message.content.trim();
      return JSON.parse(text);
    } catch (err) {
      lastError = err;
      if (err.status === 429 || err.message?.includes("rate_limit")) {
        console.warn(`Groq model ${model} hit rate limit, trying next fallback model...`);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}


// ─── Racing Engine ──────────────────────────────────────────────────

/**
 * Creates a promise that rejects after the specified timeout.
 */
function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

/**
 * Races multiple AI providers simultaneously.
 * Returns the first successful JSON response.
 * Uses Promise.any() — resolves with the first provider to succeed.
 */
async function raceProviders(prompt, timeoutMs = 30000) {
  const providers = [];

  // Always include Gemini
  providers.push(
    withTimeout(callGeminiProvider(prompt), timeoutMs, "Gemini")
      .then((result) => {
        console.log("✅ Gemini won the race");
        return result;
      })
  );

  // Include OpenAI if configured
  if (openai) {
    providers.push(
      withTimeout(callOpenAIProvider(prompt), timeoutMs, "OpenAI")
        .then((result) => {
          console.log("✅ OpenAI won the race");
          return result;
        })
    );
  }

  // Include Groq if configured
  if (groq) {
    providers.push(
      withTimeout(callGroqProvider(prompt), timeoutMs, "Groq")
        .then((result) => {
          console.log("✅ Groq won the race");
          return result;
        })
    );
  }

  console.log(`🏁 Racing ${providers.length} providers...`);

  // Promise.any() resolves with the first fulfilled promise
  return Promise.any(providers);
}

// ─── Main Export ────────────────────────────────────────────────────

/**
 * Calls AI providers using a racing strategy.
 * 1. First, race all available providers simultaneously
 * 2. If all race entries fail, retry with exponential backoff
 */
export async function callGemini(prompt, retryCount = 2) {
  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      const result = await raceProviders(prompt);
      return result;
    } catch (error) {
      // Promise.any() throws AggregateError when ALL promises reject
      const errors = error.errors || [error];
      errors.forEach((e, i) =>
        console.error(`  Provider ${i + 1} failed:`, e.message)
      );

      if (attempt === retryCount) {
        throw new Error(
          `All AI providers failed after ${retryCount + 1} attempts. Last errors: ${errors.map((e) => e.message).join("; ")}`
        );
      }

      const backoffMs = 2000 * Math.pow(2, attempt); // 2s, 4s, 8s
      console.log(`🔄 All providers failed. Retrying in ${backoffMs / 1000}s... (attempt ${attempt + 2}/${retryCount + 1})`);
      await new Promise((r) => setTimeout(r, backoffMs));
    }
  }
}
