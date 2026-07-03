import { CohereClient } from "cohere-ai";
import { NextResponse } from "next/server";

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY || "PLACEHOLDER",
});

const SYSTEM_PROMPT = `
You are "DevMatch Career Coach", an AI assistant built into the DevMatch Jobs platform.
You help software engineers with:
- Resume optimization for specific job descriptions.
- Interview preparation for tech roles.
- Salary negotiation strategies.
- Career path guidance (e.g., "Frontend → Full Stack → Engineering Manager").
- Skill gap analysis: "To get this job, you need to learn X, Y, Z".

Personality:
- Professional, encouraging, data-driven.
- Reference real market trends when possible.
- Be concise but actionable.
- Always suggest next steps.

Context:
DevMatch Jobs aggregates software engineering opportunities from Adzuna, LoopCV, and JSearch.
Users can sync their skill profiles automatically via the GitHub Skill DNA Analyzer.
`;

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();

        if (!process.env.COHERE_API_KEY) {
            return NextResponse.json(
                { message: "I'm currently in 'Offline Mode' (missing API Key). But I can tell you that DevMatch is looking premium!" },
                { status: 200 }
            );
        }

        const response = await cohere.chat({
            message,
            model: "command-r-plus",
            preamble: SYSTEM_PROMPT,
            chatHistory: history || [],
        });

        return NextResponse.json({
            message: response.text,
            history: [
                ...(history || []),
                { role: "USER", message },
                { role: "CHATBOT", message: response.text },
            ],
        });
    } catch (error) {
        console.error("Cohere API Error:", error);
        return NextResponse.json(
            { error: "Nexus AI is currently recalibrating. Please try again in a moment." },
            { status: 500 }
        );
    }
}
