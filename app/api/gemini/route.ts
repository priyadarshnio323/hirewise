import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      message,
      userName,
      type,
      questions,
      messageHistory,
      role,
      level,
      techstack,
      interviewMode
    } = await req.json();

    console.log("📥 Received message:", message);
    console.log("📋 Type:", type);

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("❌ GEMINI_API_KEY is not set");
      return NextResponse.json({
        success: false,
        error: "API key not configured",
        reply: "Server configuration error. Please contact support."
      }, { status: 500 });
    }

    let conversationContext = "";
    if (messageHistory && messageHistory.length > 0) {
      conversationContext = messageHistory
        .map((msg: any) => `${msg.role === "assistant" ? "Interviewer" : "Candidate"}: ${msg.content}`)
        .join("\n");
    }

    const mode = interviewMode || "technical";
    const isFirstQuestion = message === "FIRST_QUESTION";

    let prompt = "";

    if (type === "generate") {
      prompt = `You are an AI interviewer named Alex helping ${userName} set up a mock interview.
      
Current conversation:
${conversationContext}

The user just said: "${message}"

Your task: Guide the user to provide:
1. What role they're applying for (e.g., Frontend Developer, Full Stack)
2. Their tech stack (e.g., React, Node.js, Python)
3. Their experience level (Junior, Mid, Senior)

Keep responses friendly and conversational. Ask ONE question at a time.
If they haven't provided all info, ask for the next piece.
If they've provided all info, confirm and say "Great! I've saved your interview preferences."

Your response:`;

    } else if (type === "interview-live") {

      if (isFirstQuestion) {
        // ✅ first question — no acknowledgement, just ask directly
        prompt = `You are a professional interviewer starting a mock interview.

Role: ${role || "Developer"}
Level: ${level || "Mid"}
Interview type: ${mode}
Tech stack: ${techstack?.join(", ") || "general"}

Ask one complete interview question. Keep it under 25 words. Never cut off mid sentence.


Example:
"Can you walk me through your experience with ${techstack?.[0] || "your main technology"} and how you have used it in a real project?"

Your first question:`;

      } else {
        // ✅ follow-up — acknowledge then ask
        prompt = `You are a professional interviewer conducting a mock interview.

Role: ${role || "Developer"}
Level: ${level || "Mid"}
Interview type: ${mode}
Tech stack: ${techstack?.join(", ") || "general"}

Conversation so far:
${conversationContext || "Interview just started."}

Candidate just said: "${message}"

Reply in exactly 2 sentences. Keep total response under 35 words. Never cut off mid sentence.
SENTENCE 1: Acknowledge in one short sentence.
SENTENCE 2: Ask one complete question ending with ?

Example:
"Good answer. Can you explain how you managed state in your React project?"

Your 2 sentence reply:`;
      }
    } else {
      // traditional interview
      prompt = `You are an AI interviewer. You have these specific questions to ask:
${questions?.map((q: string, i: number) => `${i + 1}. ${q}`).join("\n")}

Current conversation:
${conversationContext}

The candidate just said: "${message}"

Instructions:
- Acknowledge their answer briefly
- Ask the next question from your list
- Keep responses short and focused (2-3 sentences)
- If you've asked all questions, thank them for their time

Your response:`;
    }

    console.log("📤 Sending to Gemini API with model: gemini-2.5-flash");
    console.log("📝 isFirstQuestion:", isFirstQuestion);

    const MODEL_NAME = "gemini-2.5-flash";

    const callGemini = async (modelName: string) => {
      return await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500, // ✅ enough for 2 complete sentences
              topP: 0.8,
              topK: 40,
            }
          })
        }
      );
    };

    let response = await callGemini(MODEL_NAME);
    let data = await response.json();
    console.log("📥 Gemini response status:", response.status);

    // ✅ fallback to gemini-2.0-flash if first fails
    if (!response.ok) {
      console.error("❌ Primary model failed, trying fallback...");

      if (response.status === 429) {
        return NextResponse.json({
          success: true,
          reply: "I am getting too many requests right now. Please wait a few seconds and try again."
        });
      }

      response = await callGemini("gemini-2.0-flash");
      data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          return NextResponse.json({
            success: true,
            reply: "I am getting too many requests right now. Please wait a few seconds and try again."
          });
        }
        return NextResponse.json({
          success: true,
          reply: "I am having a temporary issue. Please say your answer again."
        });
      }
    }

    let reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("📤 FULL GEMINI REPLY:", JSON.stringify(reply));

    if (!reply || reply.trim().length < 10) {
      reply = isFirstQuestion
        ? `Can you tell me about your experience with ${techstack?.[0] || role || "your main technology"}?`
        : "That is a good answer. Can you tell me more about how you applied that in a real project?";
    }

    // ✅ simple cleanup only — no aggressive trimming
    reply = reply.replace(/\s+/g, " ").trim();

    if (!/[.?!]$/.test(reply)) {
      reply += ".";
    }

    console.log("✅ Final reply:", reply);

    return NextResponse.json({ success: true, reply });

  } catch (error: any) {
    console.error("❌ API Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      reply: "I apologize, but I am having trouble connecting. Could you please try again?"
    }, { status: 500 });
  }
}