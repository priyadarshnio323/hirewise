import { NextResponse } from "next/server";
import { createInterview } from "@/lib/actions/general.action";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("🔵 API RECEIVED:", body); // ← ADD THIS

    const result = await createInterview(body);
    console.log("🟢 CREATE RESULT:", result); // ← ADD THIS

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        interviewId: result.interviewId 
      });
    } else {
      throw new Error("Failed to create interview");
    }
    
  } catch (error) {
    console.error("🔴 API ERROR:", error); // ← ADD THIS
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}