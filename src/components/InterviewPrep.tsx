"use client";

import { useState, useRef } from "react";
import { ApiResponse } from "@/types/qa";
import Footer from "./Footer";

export default function InterviewPrep() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ApiResponse | null>(null);

    const [formData, setFormData] = useState({
        jobDescription: "",
        resume: "",
        targetRoleLevel: "Mid",
        interviewType: "Mixed",
        numQuestions: 15,
    });

    const resultsRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch("/api/generate-qa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to generate Q&A");
            }

            const data = await response.json();
            setResult(data);

            // Scroll to results after a short delay to allow rendering
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!result) return;

        const lines: string[] = [];
        lines.push(`INTERVIEW PREP Q&A - ${new Date().toLocaleDateString()}`);
        lines.push("==================================================");
        lines.push("");
        lines.push("[ROLE SUMMARY]");
        lines.push(result.roleSummary);
        lines.push("");
        lines.push("[CANDIDATE SUMMARY]");
        lines.push(result.candidateSummary);
        lines.push("");
        lines.push("==================================================");
        lines.push("");
        lines.push("[TELL ME ABOUT YOURSELF - LONG]");
        lines.push(result.tellMeAboutYourself?.longAnswer || "N/A");
        lines.push("");
        lines.push("[TELL ME ABOUT YOURSELF - SHORT]");
        lines.push(result.tellMeAboutYourself?.shortAnswer || "N/A");
        lines.push("");
        lines.push("==================================================");
        lines.push("");

        result.sections.forEach((section) => {
            lines.push(`[SECTION: ${section.title.toUpperCase()}]`);
            if (section.description) lines.push(section.description);
            lines.push("");
            section.items.forEach((item, idx) => {
                lines.push(`Q${idx + 1}: ${item.question}`);
                lines.push(`A: ${item.answer}`);
                lines.push(`Tags: ${item.tags.join(", ")}`);
                lines.push("");
            });
            lines.push("--------------------------------------------------");
            lines.push("");
        });

        lines.push("[QUESTIONS TO ASK THE INTERVIEWER]");
        result.suggestionsForInterviewerQuestions.forEach((q, i) => {
            lines.push(`${i + 1}. ${q}`);
        });

        const blob = new Blob([lines.join("\n")], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `interview-prep-qa-${new Date().toISOString().split("T")[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-12">
            <header className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    Interview Prep <span className="text-blue-600">Generator</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Paste your job description and resume below to get tailored interview questions, answers, and a "Tell me about yourself" script.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label htmlFor="jobDescription" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Job Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="jobDescription"
                            required
                            className="w-full h-64 p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm"
                            placeholder="Paste the full job description here..."
                            value={formData.jobDescription}
                            onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="resume" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Resume <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="resume"
                            required
                            className="w-full h-64 p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm"
                            placeholder="Paste your resume text here..."
                            value={formData.resume}
                            onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="roleLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Target Role Level
                        </label>
                        <select
                            id="roleLevel"
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                            value={formData.targetRoleLevel}
                            onChange={(e) => setFormData({ ...formData, targetRoleLevel: e.target.value as any })}
                        >
                            <option value="Junior">Junior</option>
                            <option value="Mid">Mid-Level</option>
                            <option value="Senior">Senior</option>
                            <option value="Lead">Lead / Staff</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="interviewType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Interview Type
                        </label>
                        <select
                            id="interviewType"
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                            value={formData.interviewType}
                            onChange={(e) => setFormData({ ...formData, interviewType: e.target.value as any })}
                        >
                            <option value="General">General / Behavioral</option>
                            <option value="Technical">Technical</option>
                            <option value="Mixed">Mixed</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Number of Questions
                        </label>
                        <div className="flex items-center space-x-4 pt-3">
                            {[10, 15, 20].map((num) => (
                                <label key={num} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="numQuestions"
                                        value={num}
                                        checked={formData.numQuestions === num}
                                        onChange={() => setFormData({ ...formData, numQuestions: num })}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{num}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] ${isLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center space-x-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Generating Interview Plan...</span>
                            </span>
                        ) : (
                            "Generate Q&A"
                        )}
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-300 text-sm text-center">
                        {error}
                    </div>
                )}
            </form>

            {result && (
                <div ref={resultsRef} className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-6">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Interview Plan</h2>
                        <button
                            onClick={handleDownload}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors font-medium"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Download .txt</span>
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Role Summary</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.roleSummary}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Candidate Fit</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.candidateSummary}</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-8 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                        <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-6">Tell Me About Yourself</h3>
                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded uppercase">Long Version (~2 min)</span>
                                </div>
                                <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{result.tellMeAboutYourself?.longAnswer || "Not available."}</p>
                            </div>
                            <div className="border-t border-indigo-200 dark:border-indigo-800 pt-6">
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded uppercase">Short Version (~45 sec)</span>
                                </div>
                                <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{result.tellMeAboutYourself?.shortAnswer || "Not available."}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {result.sections.map((section, idx) => (
                            <div key={idx} className="space-y-6">
                                <div className="border-l-4 border-blue-500 pl-4">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{section.title}</h3>
                                    {section.description && <p className="text-gray-500 dark:text-gray-400 mt-1">{section.description}</p>}
                                </div>
                                <div className="grid gap-6">
                                    {section.items.map((item, i) => (
                                        <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3">{item.question}</h4>
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{item.answer}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {item.tags.map((tag, t) => (
                                                    <span key={t} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Questions to Ask the Interviewer</h3>
                        <ul className="space-y-3">
                            {result.suggestionsForInterviewerQuestions.map((q, i) => (
                                <li key={i} className="flex items-start space-x-3">
                                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm font-bold">
                                        {i + 1}
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300">{q}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
