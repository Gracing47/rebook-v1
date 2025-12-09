/**
 * DeepSeek AI Integration
 * 
 * @devnote Uses OpenAI-compatible SDK with DeepSeek base URL
 * @devnote API key should be stored in DEEPSEEK_API_KEY env variable
 * @devnote Model: deepseek-chat (fast, non-thinking mode)
 */

import OpenAI from "openai";

// @devnote Singleton pattern for client reuse across requests
const deepseek = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.DEEPSEEK_API_KEY,
});

/**
 * Summarise text using DeepSeek AI
 * 
 * @devnote Production strategy: streaming disabled for consistent response format
 * @devnote Cache-aware: DeepSeek automatically caches prompts for cost optimization
 * @devnote Error handling: throws typed errors for proper upstream handling
 */
export async function summariseText(text: string): Promise<string> {
    if (!process.env.DEEPSEEK_API_KEY) {
        throw new Error("DEEPSEEK_API_KEY environment variable not configured");
    }

    if (!text || text.trim().length === 0) {
        throw new Error("Cannot summarise empty text");
    }

    try {
        const completion = await deepseek.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: "You are an expert at creating concise, insightful summaries of text. Extract the key concepts and present them in a clear, structured format."
                },
                {
                    role: "user",
                    content: `Summarise the following text:\n\n${text}`
                }
            ],
            temperature: 0.3, // @devnote Lower temp for consistent, factual summaries
            max_tokens: 500,  // @devnote ~125 words for conciseness
        });

        const summary = completion.choices[0]?.message?.content;

        if (!summary) {
            throw new Error("No summary generated from DeepSeek");
        }

        return summary.trim();
    } catch (error) {
        // @devnote Wrap OpenAI errors with context for better debugging
        throw new Error(`DeepSeek summarisation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}
