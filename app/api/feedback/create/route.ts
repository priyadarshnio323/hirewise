import { NextResponse } from "next/server";
import { createFeedback } from "@/lib/actions/general.action";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("🔵 Feedback API received:", body.interviewId);
    
    const result = await createFeedback(body);
    console.log("🟢 Feedback result:", result);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("🔴 Feedback API error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}