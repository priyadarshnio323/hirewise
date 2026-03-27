import { Button } from '@/components/ui/button'
import Link from 'next/link';
import Image from 'next/image';
import InterviewCard from '@/components/InterviewCard';
import { getInterviewsByUserId } from '@/lib/actions/general.action';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getLatestInterviews } from '@/lib/actions/general.action';

const Page = async () => {
  const user = await getCurrentUser();
  const userInterviewsRaw = user ? await getInterviewsByUserId(user.id) : null;
  const userInterviews = userInterviewsRaw ?? [];

  // ✅ fetch OTHER users interviews for "Take an Interview" section
  const latestInterviewsRaw = user ? await getLatestInterviews({ 
    userId: user.id,  // excludes current user's interviews
    limit: 6 
  }) : null;
  const latestInterviews = latestInterviewsRaw ?? [];

  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>Master interviews through AI-powered practice and feedback</h2>
          <p className='text-lg'>Practice on real interview questions and get instant feedback</p>
          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href='/interview'>Start an interview</Link>
          </Button>
        </div>
        <Image src='/robo.png' alt='robo-dude' width={400} height={400} className='max-sm:hidden'/>
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Your Interviews</h2>
        <div className='interviews-section'>
          {!user ? (
            <p className="text-gray-500">Please login to see your interviews</p>
          ) : userInterviews.length === 0 ? (
            <p className="text-gray-500">No interviews yet. Click Start an interview above!</p>
          ) : (
            userInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interviewId={interview.id}
                userId={user.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                level={interview.level}
                createdAt={interview.createdAt}
              />
            ))
          )}
        </div>
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take an Interview</h2>
        <div className='interviews-section'>
          {!user ? (
            <p className="text-gray-500">Please login to see available interviews</p>
          ) : latestInterviews.length === 0 ? (
            <p className="text-gray-500">No interviews available from other users yet!</p>
          ) : (
            latestInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interviewId={interview.id}
                userId={user.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                level={interview.level}
                createdAt={interview.createdAt}
              />
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default Page;