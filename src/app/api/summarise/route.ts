/**
 * API Route: Text Summarisation
 * 
 * @devnote Server-side only - keeps API key secure
 * @devnote Rate limiting should be added in production (e.g., upstash/ratelimit)
 * @devnote CORS configured for same-origin only
 */

import { NextRequest, NextResponse } from "next/server";
import { summariseText } from "@/lib/deepseek";

export const runtime = "nodejs"; // @devnote Use Node runtime for OpenAI SDK compatibility

/**
 * POST /api/summarise
 * 
 * Request body: { text: string }
 * Response: { summary: string } | { error: string }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { text } = body;

        // @devnote Input validation
        if (!text || typeof text !== "string") {
            return NextResponse.json(
                { error: "Invalid request: 'text' field required" },
                { status: 400 }
            );
        }

        // @devnote Limit input size to prevent abuse
        if (text.length > 50000) {
            return NextResponse.json(
                { error: "Text too long (max 50,000 characters)" },
                { status: 413 }
            );
        }

        const summary = await summariseText(text);

        return NextResponse.json({ summary }, { status: 200 });
    } catch (error) {
        // @devnote Log error for monitoring (add Sentry/LogRocket in production)
        console.error("[API /summarise] Error:", error);

        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Summarisation failed" },
            { status: 500 }
        );
    }
}
