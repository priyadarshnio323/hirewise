import { Button } from '@/components/ui/Button'
import Link from 'next/link';
import InterviewCard from '@/components/InterviewCard';
import { getInterviewsByUserId } from '@/lib/actions/general.action';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getLatestInterviews } from '@/lib/actions/general.action';

const Page = async () => {
  const user = await getCurrentUser();
  const userInterviewsRaw = user ? await getInterviewsByUserId(user.id) : null;
  const userInterviews = userInterviewsRaw ?? [];

  const latestInterviewsRaw = user ? await getLatestInterviews({ 
    userId: user.id,  
    limit: 6 
  }) : null;
  const latestInterviews = latestInterviewsRaw ?? [];

  return (
    <>
        <section className='card-cta'>
          <div className='flex flex-col items-center justify-center gap-6 w-full'>
              <h2>
                 Master interviews through AI-powered practice and feedback
                 {/* <span className='text-primary-300'> interviews </span> */}
              </h2>
              <p className='text-lg'>Practice on real interview questions and get instant feedback</p>
              <Button asChild className='btn-primary animate-breathe max-sm:w-full'>
                <Link href='/interview'>Start an interview</Link>
              </Button>
          </div>
      </section>

<section className='features-block'>
  {/* Left Side: Content */}
  <div className='flex-1 flex flex-col justify-center gap-4'>
    <h1 className='text-4xl font-extrabold text-blue-600 tracking-tight'>
      Why HireWise?
    </h1>
    <p className='text-lg leading-relaxed text-slate-600 py-2 max-w-xl'>
      HireWise is your ultimate interview preparation companion, offering 
      <span className="font-semibold text-slate-900"> personalized AI-driven mock interviews</span>, 
      real-time feedback, and a vast library of questions to help you ace your next 
      job interview with confidence.
    </p>
  </div>

  {/* Right Side: Image */}
  <div className='flex-1 flex justify-center items-center'>
    <img src="/robo.png" alt="AI Icon" className="w-full max-w-md h-auto object-contain" />
  </div>

</section>
 <section>
  {/* <div>
          <h1 className='text-3xl font-bold w-full bg-[#ff4d00] text-white px-24 py-4 tracking-wider'>How it works?</h1>
    <div className='stepWrapper'>
      <div className="step odd">Step 1: Sign up and create your profile</div>
        <div className="step even">Step 2: Choose your interview preferences (role, type, tech stack, level)</div>
        <div className="step odd">Step 3: Start practicing with AI-powered mock interviews</div>
        <div className="step even">Step 4: Get instant feedback and improve your skills</div>
    </div>
     
    </div> */}
    <div>
                <h1 className='text-3xl font-bold w-full bg-gray-100 text-white px-24 py-4 tracking-wider'>How it works?</h1>

    </div>
   {/* <div className='steps-wrapper'>
  <div className='steps-flex'>
    
    <div className='step step-odd'>
      <p className='step-title'>Step 1</p>
      <p className='step-desc'>Set Up Your Interview — Tell our AI your role, tech stack, interview type and experience level through a quick voice conversation</p>
    </div>

    <div className='step step-even'>
      <p className='step-title'>Step 2</p>
      <p className='step-desc'>Generate Your Interview — AI creates personalised questions based on your profile and saves your interview card</p>
    </div>

    <div className='step step-odd'>
      <p className='step-title'>Step 3</p>
      <p className='step-desc'>Take the Live Interview — Practice with our AI interviewer who asks dynamic questions and adapts to your answers in real time</p>
    </div>

    <div className='step step-even'>
      <p className='step-title'>Step 4</p>
      <p className='step-desc'>Get Instant Feedback — Receive a detailed score and category breakdown immediately after your interview</p>
    </div>

  </div>
</div> */}

<div className='steps-wrapper'>
  <div className='steps-grid'>
    
    <div className='step step-dark '>
      <p className='step-title'>Step 1</p>
      <p className='step-desc'>Set Up Your Interview — Tell our AI your role, tech stack, interview type and experience level through a quick voice conversation</p>
    </div>

    <div className='step step-light'>
      <p className='step-title'>Step 2</p>
      <p className='step-desc'>Generate Your Interview — AI creates personalised questions based on your profile and saves your interview card</p>
    </div>

    <div className='step step-light'>
      <p className='step-title'>Step 3</p>
      <p className='step-desc'>Take the Live Interview — Practice with our AI interviewer who asks dynamic questions and adapts to your answers in real time</p>
    </div>

    <div className='step step-dark'>
      <p className='step-title'>Step 4</p>
      <p className='step-desc'>Get Instant Feedback — Receive a detailed score and category breakdown immediately after your interview</p>
    </div>

    <div className='step step-dark'>
      <p className='step-title'>Step 5</p>
      <p className='step-desc'>Explore Interviews — Browse interviews created by other users, search by role or tech stack, and take any interview that matches your preparation goals</p>
    </div>

    <div className='step step-light'>
      <p className='step-title'>Step 6</p>
      <p className='step-desc'>Track Your Progress — Review your feedback history, compare scores across multiple interviews, and identify areas where you have improved over time</p>
    </div>


  </div>
</div>

 </section>


      {/* <section className='features-block'>
        <div className='why-hirewise flex flex-col  gap-6'>
          <h1 className='text-4xl font-bold text-dark-300'>Why HireWise?</h1>
            

          <h1 className='text-left text-dark-100'>
            HireWise is your ultimate interview preparation companion, offering personalized AI-driven mock interviews, real-time feedback, and a vast library of questions to help you ace your next job interview with confidence.            
          </h1>
          <img src="/robo.png" alt="AI Icon" className="inline w-100 h-80 mr-2" />
        </div>

        

      </section> */}


      <section className="interview-block">
        <h2>My Interviews</h2>
        <div className="interviews-section">
  {user && userInterviews.length > 0 ? (
    userInterviews.slice(0, 3).map((interview) => (
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
  ) : (
    <p className="text-gray-500">
      {!user
        ? "Please login to see your interviews"
        : "No interviews yet. Click Start an interview above!"}
    </p>
  )}
</div>
         {user && userInterviews.length > 3 && (
    <div className="flex justify-end mt-4">
      <Link href="/my-interviews">
        <Button className="btn-secondary">View More →</Button>
      </Link>
    </div>
  )}
      </section>

      <section className='interview-block '>
        <h2>Explore Interviews</h2>
        <div className='interviews-section'>
          {!user ? (
            <p className="text-gray-500">Please login to see available interviews</p>
          ) : latestInterviews.length === 0 ? (
            <p className="text-gray-500">No interviews available from other users yet!</p>
          ) : (
            latestInterviews.slice(0, 3).map((interview) => (
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
         {user && userInterviews.length > 3 && (
    <div className="flex justify-end mt-4">
      <Link href="/explore">
        <Button className="btn-secondary">View More →</Button>
      </Link>
    </div>
  )}
      </section>
    </>
  );
};

export default Page;

{/* <div className='why-hirewise bg-gradient-to-r from-dark-400 to-primary-300 px-4 py-12 rounded-lg flex flex-col items-center gap-6'>
          <h1 className='text-2xl font-bold text-center text-dark-300'>How it works?</h1>
          
        </div>
        */}