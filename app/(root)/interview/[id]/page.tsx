import Agent from "@/components/Agent";
import { getInterviewById } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action"; // ✅ add this
import { notFound } from "next/navigation";

const InterviewPage = async ({ params }: { params: { id: string } }) => {
const { id } = params;  
  const interview = await getInterviewById(id);
  if (!interview) notFound();

  const user = await getCurrentUser(); // ✅ get current user

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{interview!.role} Interview</h1>
      <p className="text-gray-600 mb-6">
        Level: {interview!.level} | Tech: {interview!.techstack?.join(", ")}
      </p>
      
      <Agent
        userName={user?.name || "You"}  // ✅ real name
        userId={user?.id || interview!.userId}  // ✅ current user id
        interviewId={id}
        type="interview-live"
        role={interview!.role}
        level={interview!.level}
        techstack={interview!.techstack}
        interviewMode={interview!.type as "technical" | "behavioural" | "mixed"}
      />
    </div>
  );
};

export default InterviewPage;