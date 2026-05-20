"use client";
import { useRouter } from "next/navigation";
import ToggleButtonGroup from "@/components/ui/ToggleButtonGroup";

const FeedbackButtons = ({ id }: { id: string }) => {
  const router = useRouter();
  return (
    <ToggleButtonGroup
      buttons={[
        { label: "Back to Dashboard", onClick: () => router.push("/") },
        { label: "Retake Interview", onClick: () => router.push(`/interview/${id}`) },
      ]}
    />
  );
};

export default FeedbackButtons;