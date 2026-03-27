import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <Agent
      userName={user.name}
      userId={user.id}       // ✅ real userId, not "user1"
      type="generate"        // ✅ setup flow, not interview
      interviewMode="technical" // ✅ technical interview mode
    />
  );
};

export default Page;