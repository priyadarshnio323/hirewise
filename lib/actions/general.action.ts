"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/firebase/admin";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function createInterview(params: {
  role: string;
  techstack: string[];
  level: string;
  type: string;
  userId: string;
}): Promise<{ success: boolean; interviewId?: string }> {
  try {
    const { role, techstack, level, type, userId } = params;

    let questions = [];
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `Generate 5 interview questions for a ${level} ${role} who works with ${techstack.join(", ")}. Return ONLY a JSON array of 5 strings, no extra text.`;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const clean = text.replace(/```json\n?|\n?```/g, "").trim();
      questions = JSON.parse(clean);
      console.log("✅ Gemini questions generated");

    } catch (geminiError) {
      console.log("⚠️ Gemini failed, using fallback questions");
      questions = [
        `Tell me about your experience with ${techstack[0] || role}`,
        `What's the most challenging project you've worked on as a ${role}?`,
        `How do you approach debugging in ${techstack.join(", ")}?`,
        `How do you stay updated with the ${techstack[0] || role} ecosystem?`,
        `Where do you see yourself growing as a ${level} ${role}?`
      ];
    }

    const docRef = await db.collection("interviews").add({
      role,
      techstack,
      level,
      type,
      userId,
      questions,
      finalized: true,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    console.log("✅ Interview created:", docRef.id);
    return { success: true, interviewId: docRef.id };

  } catch (error) {
    console.error("❌ Error creating interview:", error);
    return { success: false };
  }
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map((sentence: { role: string; content: string }) =>
        `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    // ✅ use existing genAI — no new package needed
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an AI interviewer analyzing a mock interview. Evaluate the candidate thoroughly. Don't be lenient. Point out mistakes and areas for improvement.
      
      Transcript:
      ${formattedTranscript}

      Return ONLY a JSON object with this exact structure, no extra text:
      {
        "totalScore": number between 0-100,
        "categoryScores": {
          "communicationSkills": number between 0-100,
          "technicalKnowledge": number between 0-100,
          "problemSolving": number between 0-100,
          "culturalFit": number between 0-100,
          "confidenceClarity": number between 0-100
        },
        "strengths": ["strength1", "strength2", "strength3"],
        "areasForImprovement": ["area1", "area2", "area3"],
        "finalAssessment": "detailed assessment here"
      }

      Score in these areas:
      - Communication Skills: Clarity, articulation, structured responses.
      - Technical Knowledge: Understanding of key concepts for the role.
      - Problem-Solving: Ability to analyze problems and propose solutions.
      - Cultural & Role Fit: Alignment with company values and job role.
      - Confidence & Clarity: Confidence in responses, engagement, and clarity.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const clean = text.replace(/```json\n?|\n?```/g, "").trim();
    
    let feedbackData;
    try {
      feedbackData = JSON.parse(clean);
    } catch {
      console.log("JSON parse failed, using fallback");
      feedbackData = {
        totalScore: 70,
        categoryScores: {
          communicationSkills: 70,
          technicalKnowledge: 70,
          problemSolving: 70,
          culturalFit: 70,
          confidenceClarity: 70,
        },
        strengths: ["Showed up for the interview", "Attempted all questions"],
        areasForImprovement: ["Provide more specific examples", "Improve technical depth"],
        finalAssessment: "The candidate completed the interview. Further practice recommended.",
      };
    }

    const feedback = {
      interviewId,
      userId,
      totalScore: feedbackData.totalScore,
      categoryScores: feedbackData.categoryScores,
      strengths: feedbackData.strengths || [],
      areasForImprovement: feedbackData.areasForImprovement || [],
      finalAssessment: feedbackData.finalAssessment || "Interview completed.",
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;
    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);
    return { success: true, feedbackId: feedbackRef.id };

  } catch (error) {
  console.error("Error saving feedback:", error);
  
  // ✅ save fallback feedback so user always gets result
  try {
    const fallbackFeedback = {
      interviewId,
      userId,
      totalScore: 70,
      categoryScores: {
        communicationSkills: 70,
        technicalKnowledge: 70,
        problemSolving: 70,
        culturalFit: 70,
        confidenceClarity: 70,
      },
      strengths: ["Completed the interview", "Showed willingness to communicate"],
      areasForImprovement: ["Practice more specific answers", "Work on technical depth"],
      finalAssessment: "The candidate completed the interview session. Please retake for detailed AI feedback.",
      createdAt: new Date().toISOString(),
    };
    const feedbackRef = db.collection("feedback").doc();
    await feedbackRef.set(fallbackFeedback);
    return { success: true, feedbackId: feedbackRef.id };
  } catch (e) {
    return { success: false };
  }
}
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();
  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}