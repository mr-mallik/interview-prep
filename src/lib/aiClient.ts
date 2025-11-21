import { GoogleGenerativeAI } from "@google/generative-ai";
import { ApiResponse } from "@/types/qa";

export type GenerateRequestBody = {
    jobDescription: string;
    resume: string;
    targetRoleLevel: "Junior" | "Mid" | "Senior" | "Lead";
    interviewType: "General" | "Technical" | "Mixed";
    numQuestions: number;
};

export async function generateQA(data: GenerateRequestBody): Promise<ApiResponse> {
    const { jobDescription, resume, targetRoleLevel, interviewType, numQuestions } = data;

    const systemPrompt = `You are an expert interview preparation assistant. Your goal is to help a candidate prepare for a job interview by generating tailored questions and answers based on their resume and the job description.

  Analyze the provided Job Description and Resume.
  Produce a structured JSON response containing:
  1. A concise "Role Summary" (what the company is looking for).
  2. A "Candidate Summary" (how the candidate fits).
  3. A "Tell me about yourself" section with two versions:
     - longAnswer: ~2 minutes spoken, detailed.
     - shortAnswer: ~45 seconds spoken, elevator pitch.
  4. ${numQuestions} interview questions divided into logical sections (e.g., General, Technical, Experience, etc.).
     - For each question, provide a high-quality, spoken-English answer that highlights the candidate's strengths from their resume.
     - Add relevant tags to each question.
  5. A list of 3-5 "Questions to ask the interviewer".

  Target Role Level: ${targetRoleLevel}
  Interview Type: ${interviewType}

  IMPORTANT:
  - Do NOT hallucinate companies, projects, or skills not present in the resume or implied by the JD.
  - Use professional but natural spoken English.
  - Return ONLY valid JSON matching the specified structure. No markdown formatting.
  - Ensure the "tellMeAboutYourself" object is present with "longAnswer" and "shortAnswer" keys.

  Example JSON Structure:
  {
    "roleSummary": "...",
    "candidateSummary": "...",
    "tellMeAboutYourself": {
      "question": "Tell me about yourself",
      "longAnswer": "...",
      "shortAnswer": "..."
    },
    "sections": [
      {
        "title": "General",
        "description": "...",
        "items": [
          { "question": "...", "answer": "...", "tags": ["..."] }
        ]
      }
    ],
    "suggestionsForInterviewerQuestions": ["..."]
  }
  `;

    const userPrompt = `JOB DESCRIPTION:
${jobDescription}

RESUME:
${resume}
`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("Missing GEMINI_API_KEY environment variable.");
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const result = await model.generateContent([systemPrompt, userPrompt]);
        const response = result.response;
        const text = response.text();

        if (!text) {
            throw new Error("Empty response from AI model");
        }

        return JSON.parse(text) as ApiResponse;
    } catch (error) {
        console.error("Error generating Q&A:", error);
        throw error;
    }
}
