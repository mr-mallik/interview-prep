# Interview Prep Q&A Generator

A Next.js + TypeScript web application that generates tailored interview questions and answers based on a job description and resume using Google Gemini AI.

## Features

- **Tailored Q&A**: Generates interview questions specific to the role and your experience.
- **"Tell Me About Yourself"**: Creates both a long (2 min) and short (45 sec) version of this essential answer.
- **Role & Candidate Summary**: Provides a quick overview of the role and how you fit.
- **Interviewer Questions**: Suggests smart questions to ask the interviewer.
- **Downloadable**: Export your entire prep plan as a `.txt` file.

## Setup

1. **Clone the repository** (if applicable).

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Model**: Google Gemini (via `@google/generative-ai` SDK)
- **Deployment**: Vercel (recommended)

## Project Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: React components (Client-side).
- `src/lib`: Utility functions and API clients.
- `src/types`: TypeScript type definitions.
