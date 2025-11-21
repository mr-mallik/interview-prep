import { NextRequest, NextResponse } from "next/server";
import { generateQA, GenerateRequestBody } from "@/lib/aiClient";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { jobDescription, resume, targetRoleLevel, interviewType, numQuestions } = body as GenerateRequestBody;

        // Validation
        if (!jobDescription || jobDescription.length > 20000) {
            return NextResponse.json(
                { error: "Job description is required and must be under 20k characters." },
                { status: 400 }
            );
        }
        if (!resume || resume.length > 20000) {
            return NextResponse.json(
                { error: "Resume is required and must be under 20k characters." },
                { status: 400 }
            );
        }
        if (![10, 15, 20].includes(numQuestions)) {
            return NextResponse.json(
                { error: "Number of questions must be 10, 15, or 20." },
                { status: 400 }
            );
        }

        const result = await generateQA({
            jobDescription,
            resume,
            targetRoleLevel,
            interviewType,
            numQuestions,
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("API Route Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
