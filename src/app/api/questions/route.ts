import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { jobTitle, industry, experience } = await req.json();

        const prompt = `
      You are an expert AI labor economist with a wicked sense of humor. 
      The user is a "${jobTitle}" in the "${industry}" industry with "${experience}" level of experience.
      
      CRITICAL VALIDATION STEP:
      Is "${jobTitle}" a plausible job role, career path, or serious hobby? 
      If it is complete gibberish (e.g., "asdfgh"), a single random character, offensive, or clearly not a role (e.g., "pizza", "car"), 
      return ONLY this JSON: { "error": "invalid_role", "message": "That doesn't sound like a known human role. Are you messing with the timeline?" }

      Otherwise, generate 11 unique multiple-choice or scale questions for an "AI Proof" resilience diagnostic.
      
      Goal: Measure 'AI Proof' resilience (How well this human survives automation).
      
      Requirements:
      1. Explore uniquely human traits in ${jobTitle}: creativity, ambiguity, senior strategy (if ${experience}), and social nuances.
      2. AI automates patterns; humans evolve beyond patterns. Frame questions around human evolution and machine immunity.
      3. For scale questions, use minLabel: "Machine Terrain" and maxLabel: "Human Stronghold" (or similar empowering labels).
      4. Ensure high values (towards 100) always represent high resilience/human edge.
      5. Dimensions: Repetition, Creativity, Emotions, Strategy, Physical, Data, Adaptability.
      6. Tone: Empowering, slightly playful, and optimistic.
      6. Format must be a JSON array of objects (unless returning the invalid_role error) following this TypeScript interface:
      
      interface Question {
        id: string; // prefix with 'ai-'
        text: string;
        type: "multiple-choice" | "scale";
        dimension: string;
        options?: { label: string; value: number }[]; // for multiple-choice (0-100 value)
        minLabel?: string; // for scale
        maxLabel?: string; // for scale
      }

      Return ONLY the JSON.
    `;

        const modelNames = ["gemini-flash-latest", "gemini-pro-latest", "gemini-1.5-flash", "gemini-pro"];
        let text = "";
        let lastError = null;

        for (const name of modelNames) {
            try {
                const model = genAI.getGenerativeModel({ model: name });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                text = response.text();
                if (text) break;
            } catch (err: any) {
                console.warn(`Gemini Model ${name} failed:`, err.message || err);
                lastError = err;
            }
        }

        if (!text) {
            throw lastError || new Error("All models failed to respond");
        }

        // Clean JSON from possible markdown wrappers
        const jsonStr = text.replace(/```json|```/g, "").trim();
        const aiQuestions = JSON.parse(jsonStr);

        return NextResponse.json(aiQuestions);
    } catch (error) {
        console.error("Gemini Error:", error);
        return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
    }
}
