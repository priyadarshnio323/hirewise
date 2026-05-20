// import dayjs from "dayjs";
// import Link from "next/link";
// import Image from "next/image";
// import { redirect } from "next/navigation";
// import { getFeedbackByInterviewId, getInterviewById } from "@/lib/actions/general.action";
// import { Button } from "@/components/ui/Button";
// import { getCurrentUser } from "@/lib/actions/auth.action";

// const Feedback = async ({ params }: { params: { id: string } }) => {
//   const { id } = await params;
//   const user = await getCurrentUser();
//   const interview = await getInterviewById(id);
//   if (!interview) redirect("/");
//   if(!user) {
//   return <div>User not found</div>;
// }

//   const feedback = await getFeedbackByInterviewId({
//     interviewId: id,
//     userId: user.id,
//   });

//   return (
//     <section className="section-feedback">
//       <div className="flex flex-row justify-center">
//         <h1 className="text-4xl font-semibold">
//           Feedback on the Interview —{" "}
//           <span className="capitalize">{interview.role}</span> Interview
//         </h1>
//       </div>

//       <div className="flex flex-row justify-center">
//         <div className="flex flex-row gap-5">
//           <div className="flex flex-row gap-2 items-center">
//             <Image src="/star.svg" width={22} height={22} alt="star" />
//             <p>
//               Overall Impression:{" "}
//               <span className="text-primary-200 font-bold">
//                 {feedback?.totalScore}
//               </span>
//               /100
//             </p>
//           </div>
//           <div className="flex flex-row gap-2">
//             <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
//             <p>
//               {feedback?.createdAt
//                 ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
//                 : "N/A"}
//             </p>
//           </div>
//         </div>
//       </div>

//       <hr />

//       <p>{feedback?.finalAssessment}</p>

//       {/* Category Scores */}
//       <div className="flex flex-col gap-4">
//         <h2>Breakdown of the Interview:</h2>
//         {feedback?.categoryScores && Object.entries(feedback.categoryScores).map(([key, value], index) => (
//           <div key={index}>
//             <p className="font-bold">
//               {index + 1}. {key.replace(/([A-Z])/g, ' $1').trim()} ({value.score as number}/100)
//             </p>
//           </div>
//         ))}
//       </div>

//       <div className="flex flex-col gap-3">
//         <h3>Strengths</h3>
//         <ul>
//           {feedback?.strengths?.map((strength, index) => (
//             <li key={index}>{strength}</li>
//           ))}
//         </ul>
//       </div>

//       <div className="flex flex-col gap-3">
//         <h3>Areas for Improvement</h3>
//         <ul>
//           {feedback?.areasForImprovement?.map((area, index) => (
//             <li key={index}>{area}</li>
//           ))}
//         </ul>
//       </div>

//       <div className="buttons">
//         <Button className="btn-secondary flex-1">
//           <Link href="/" className="flex w-full justify-center">
//             <p className="text-sm font-semibold text-primary-200 text-center">
//               Back to dashboard
//             </p>
//           </Link>
//         </Button>
//         <Button className="btn-primary flex-1">
//           <Link href={`/interview/${id}`} className="flex w-full justify-center">
//             <p className="text-sm font-semibold text-black text-center">
//               Retake Interview
//             </p>
//           </Link>
//         </Button>
//       </div>
//     </section>
//   );
// };

// export default Feedback;


import dayjs from "dayjs";
import Link from "next/link";
// import Image from "next/image";
import { redirect } from "next/navigation";
import { getFeedbackByInterviewId, getInterviewById } from "@/lib/actions/general.action";
import { Button } from "@/components/ui/Button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { GoStarFill } from "react-icons/go";
import { BsFillCalendar2Fill } from "react-icons/bs";
import FeedbackButtons from "@/components/ui/FeedbackButtons";



const Feedback = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const user = await getCurrentUser();
  const interview = await getInterviewById(id);
  if (!interview) redirect("/");
  if (!user) return <div>User not found</div>;

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  const score = feedback?.totalScore ?? 0;
  const scoreColor = score >= 80 ? "text-green-500" : score >= 50 ? "text-yellow-500" : "text-red-500";
  const scoreBg = score >= 80 ? "bg-green-50 border-green-200" : score >= 50 ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200";

  return (
    <section className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-8">

      {/* Header */}
      <div className="flex flex-col gap-2">
        <p className=" font-semibold text-dark-500 tracking-widest text-2xl text-center mb-4">Interview Feedback</p>
        <h1 className="text-3xl font-bold capitalize">
          {interview.role} Interview
        </h1>
        <div className="flex flex-row gap-6 mt-1">
          <div className="flex flex-row gap-2 items-center">
            {/* <Image src="/star.svg" width={18} height={18} alt="star" /> */}
            <GoStarFill fill="lightpink" />
            <p className="text-sm text-gray-500">
              Score: <span className={`font-bold text-base ${scoreColor}`}>{feedback?.totalScore ?? "N/A"}</span>/100
            </p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            {/* <Image src="/calendar.svg" width={18} height={18} alt="calendar fill-green" /> */}
            <BsFillCalendar2Fill fill="lightpink" />

          <p className="text-sm text-gray-500">
              {feedback?.createdAt ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A") : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Score card */}
      <div className={`flex items-center justify-between p-6 rounded-2xl border ${scoreBg}`}>
        <div>
          <p className="text-sm text-gray-500 mb-1">Overall Score</p>
          <p className={`text-5xl font-extrabold ${scoreColor}`}>{feedback?.totalScore ?? "N/A"}<span className="text-xl text-gray-400">/100</span></p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">Result</p>
          <p className={`text-xl font-bold ${scoreColor}`}>
            {score >= 80 ? "Excellent" : score >= 50 ? "Good" : "Needs Work"}
          </p>
        </div>
      </div>

      {/* Final Assessment */}
      <div className="flex flex-col gap-3 p-6 bg-gray-50 rounded-2xl border border-gray-100">
        <h2 className="text-lg font-semibold text-dark-100">Final Assessment</h2>
        <p className="text-gray-600 leading-relaxed">{feedback?.finalAssessment || "No assessment available."}</p>
      </div>

      {/* Category Breakdown */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-dark-100">Score Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {feedback?.categoryScores && Object.entries(feedback.categoryScores).map(([key, value], index) => {
const val = (value as unknown) as number;
            const barColor = val >= 80 ? "bg-green-400" : val >= 50 ? "bg-yellow-400" : "bg-red-400";
            return (
              <div key={index} className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-sm font-bold text-dark-100">{val}/100</p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${barColor}`}
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths */}
      <div className="flex flex-col gap-3 p-6 bg-green-50 rounded-2xl border border-green-100">
        <h2 className="text-lg font-semibold text-green-700">✅ Strengths</h2>
        <ul className="flex flex-col gap-2">
          {feedback?.strengths?.map((strength, index) => (
            <li key={index} className="flex items-start gap-2 text-green-800 text-sm">
              <span className="mt-1 w-2 h-2 rounded-full bg-green-400 shrink-0" />
              {strength}
            </li>
          ))}
        </ul>
      </div>

      {/* Areas for Improvement */}
      <div className="flex flex-col gap-3 p-6 bg-orange-50 rounded-2xl border border-orange-100">
        <h2 className="text-lg font-semibold text-orange-700">⚠️ Areas for Improvement</h2>
        <ul className="flex flex-col gap-2">
          {feedback?.areasForImprovement?.map((area, index) => (
            <li key={index} className="flex items-start gap-2 text-orange-800 text-sm">
              <span className="mt-1 w-2 h-2 rounded-full bg-orange-400 shrink-0" />
              {area}
            </li>
          ))}
        </ul>
      </div>

      {/* Buttons */}
      <div className="flex flex-row gap-4 max-sm:flex-col">
        {/* <Button className="btn-primary flex-1">
          <Link href="/" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-center">Back to Dashboard</p>
          </Link>
        </Button>
        <Button className="btn-secondary flex-1">
          <Link href={`/interview/${id}`} >
            <p  text-center>Retake Interview</p>
          </Link>
        </Button> */}
        <FeedbackButtons id={id} />
      </div>

     


    </section>
  );
};

export default Feedback;