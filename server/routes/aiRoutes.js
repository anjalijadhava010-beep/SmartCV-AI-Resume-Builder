import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

router.post("/suggestions", async (req, res) => {
  try {
    const resume = req.body?.resume;

    if (!resume) {
      return res.status(400).json({
        message: "Resume information is required."
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        mode: "demo",
        suggestions: [
          "Improve your professional summary.",
          "Add more technical skills.",
          "Include measurable achievements in projects.",
          "Add your GitHub and LinkedIn profiles."
        ]
      });
    }

    // Connect Gemini with a shorter timeout
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,

      httpOptions: {
        timeout: 20000,
        retryOptions: {
          attempts: 1
        }
      }
    });

    const prompt = `
You are an expert resume improvement assistant.

Analyse this resume:

${JSON.stringify(resume)}

Give exactly 5 short and useful suggestions.

Focus on:
1. Professional summary
2. Technical skills
3. Education
4. Projects
5. Resume improvement

Do not invent any qualifications.

Return only a JSON array of strings.
`;

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 500
      }
    });

    const output = response.text?.trim();

    if (!output) {
      throw new Error("Gemini returned an empty response.");
    }

    const cleanOutput = output
      .replace(/^```json\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    const suggestions = JSON.parse(cleanOutput);

    res.json({
      mode: "gemini",
      suggestions: suggestions.slice(0, 5)
    });

  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(503).json({
      message: "Gemini is temporarily unavailable. Please try again."
    });
  }
});

export default router;