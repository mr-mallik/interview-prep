Build a minimal, production-ready Next.js + TypeScript web app called **“Interview Prep Q&A Generator”**.
Goal: A user pastes a job description and their resume, the app calls an AI model, and returns structured interview questions with tailored answers, including “Tell me about yourself”. The user can download everything as a well-formatted `.txt` file. No database, no auth.

### Tech stack
- Next.js (latest with App Router) + TypeScript
- Tailwind CSS for styling
- Deployed to Vercel

### High-level behaviour
1. Single-page UI with:
   - Textarea for **Job Description** (required)
   - Textarea for **Resume** (required)
   - Select for **Role Level**: `Junior | Mid | Senior | Lead` (default: Mid)
   - Select for **Interview Type**: `General | Technical | Mixed` (default: Mixed)
   - Select or slider for **Number of questions**: options `10 | 15 | 20` (default: 15)
   - Primary button: **Generate Q&A**
2. On submit:
   - Call `/api/generate-qa` with JSON payload:
     `{ jobDescription, resume, targetRoleLevel, interviewType, numQuestions }`
   - Show a loading state and disable the form while the request is in-flight.
   - Handle errors gracefully with an inline error message.
3. On success:
   - Render the response in clear sections:
     - Role summary & candidate summary
     - “Tell me about yourself” (Long + Short)
     - Each Q&A section with title, list of questions + answers, and tags
     - A final list: “Questions to ask the interviewer”
   - Provide a **Download as .txt** button that generates a client-side text file with all content in a printable format.

### Data model for API response
Implement the following TypeScript types in a shared file, e.g. `src/types/qa.ts`:
```ts
export type QAItem = {
  question: string;
  answer: string;
  tags: string[];
};
export type QASection = {
  title: string;
  description?: string;
  items: QAItem[];
};
export type TellMeAboutYourself = {
  question: string;      // Always "Tell me about yourself"
  longAnswer: string;    // ~2 minutes spoken
  shortAnswer: string;   // ~45 seconds spoken
};
export type ApiResponse = {
  roleSummary: string;
  candidateSummary: string;
  tellMeAboutYourself: TellMeAboutYourself;
  sections: QASection[];
  suggestionsForInterviewerQuestions: string[];
};
```
The frontend must assume this exact response shape.

### API route implementation
- Create a route handler at `app/api/generate-qa/route.ts`.
- Method: `POST`, input JSON body:
```ts
type GenerateRequestBody = {
  jobDescription: string;
  resume: string;
  targetRoleLevel: "Junior" | "Mid" | "Senior" | "Lead";
  interviewType: "General" | "Technical" | "Mixed";
  numQuestions: number;
};
```
- Validate:
  - `jobDescription` and `resume` non-empty and not insanely large (e.g. <= 20k chars each).
  - `numQuestions` is one of `10, 15, 20`.
- If invalid, return `400` with a clear error message.
- The API must call an external AI model using generic environment variables:
  - `AI_API_BASE_URL`
  - `AI_API_KEY`
  - `AI_MODEL_NAME`
- Implement a helper at `src/lib/aiClient.ts` that:
  - Receives the `GenerateRequestBody`.
  - Builds a **system + user prompt** that instructs the model to:
    - Act as an interview prep assistant.
    - Read the job description and resume.
    - Produce **only** a JSON object matching `ApiResponse`.
    - Include:
      - Role summary
      - Candidate summary
      - A “Tell me about yourself” block with `longAnswer` and `shortAnswer`
      - Several sections of interview Q&A:
        - General/behavioral
        - Role-specific/technical
        - Motivation/company fit
        - Project/experience deep dives
        - Strengths/weaknesses/wrap-up
      - 3–5 “Questions to ask the interviewer”.
    - Use only information that can reasonably be inferred from JD + resume; no hallucinated companies or tools.
    - Use concise, spoken English suitable for real interviews.
    - Return strictly valid JSON with no markdown.
  - Sends a POST request to `AI_API_BASE_URL` with `AI_API_KEY` and `AI_MODEL_NAME`.
  - Parses the JSON response and returns `ApiResponse`. If parsing fails, throw a descriptive error.
- For now, mock the exact HTTP shape for a generic “chat completion” API like this (we will plug in a real provider later):
```ts
// Pseudo-structure, adapt to a generic chat API
const response = await fetch(process.env.AI_API_BASE_URL!, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.AI_API_KEY!}`,
  },
  body: JSON.stringify({
    model: process.env.AI_MODEL_NAME!,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.3,
  }),
});
```
- Assume the chosen provider returns an object with a `choices[0].message.content` string which should be the JSON. Parse it and validate minimally that required keys exist.

### UI details
- Build everything as a single page in `app/page.tsx` using server components where reasonable and a client component for the form + result.
- Layout:
  - Centered container, max-width ~900px.
  - Two-column layout on desktop (JD and Resume textareas side by side), stacked on mobile.
  - Clear labels and helper text under each textarea.
- After generating, scroll to the results section.
- Each section:
  - Title as `<h2>`
  - Optional description as subdued text.
  - Each Q&A as a card with:
    - Bold question
    - Normal text answer
    - Small tag pills for `tags`.
- Use Tailwind for simple, clean design; no heavy component libraries.

### Download as .txt implementation
- Implement a client-side function that:
  - Takes the `ApiResponse` object.
  - Serializes it into a human-readable `.txt` format with clear headings:
    - `[ROLE SUMMARY]`
    - `[CANDIDATE SUMMARY]`
    - `[TELL ME ABOUT YOURSELF - LONG]`
    - `[TELL ME ABOUT YOURSELF - SHORT]`
    - `[SECTION: <title`, etc.
  - Creates a `Blob` and triggers a download with a filename like:
    - `interview-prep-qa-{yyyy-mm-dd}.txt`
- Attach this to a **Download as .txt** button that is only enabled when `ApiResponse` is present.

### DX and misc
- Add a `README.md` explaining:
  - What the tool does.
  - How to set up environment variables for `AI_API_BASE_URL`, `AI_API_KEY`, `AI_MODEL_NAME`.
  - Local dev instructions and how to deploy to Vercel.
- Add basic error handling and edge-case handling in the UI (empty fields, API errors).
- Ensure the code is clean, typed, and structured in a way that I can extend later (e.g. adding PDF export or saving presets).
Please:
- Scaffold the full project,
- Implement the described functionality end-to-end,
- And make sure it’s ready to run locally with `npm install && npm run dev`.