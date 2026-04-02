import Agent from "@/components/Agent";
import { getInterviewById } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

const InterviewPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  
  console.log("Interview ID:", id);
  
  if (!id || id === "undefined") {
    notFound();
  }

  const interview = await getInterviewById(id);
  
  if (!interview) {
    notFound();
  }

  const user = await getCurrentUser();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{interview.role} Interview</h1>
      <p className="text-gray-600 mb-6">
        Level: {interview.level} | Tech: {interview.techstack?.join(", ")}
      </p>
      
      <Agent
        userName={user?.name || "You"}
        userId={user?.id || interview.userId}
        interviewId={id}
        type="interview-live"
        role={interview.role}
        level={interview.level}
        techstack={interview.techstack}
        interviewMode={interview.type as "technical" | "behavioural" | "mixed"}
      />
    </div>
  );
};

export default InterviewPage;