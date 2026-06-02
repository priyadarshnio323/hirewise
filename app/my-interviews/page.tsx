import InterviewCard from '@/components/InterviewCard';
import { getInterviewsByUserId } from '@/lib/actions/general.action';
import { getCurrentUser } from '@/lib/actions/auth.action';
import InterviewControls from '@/components/InterviewControls';
import Navbar from '../../components/Navbar';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    type?: string;
  }>;
}

const Page = async ({ searchParams }: PageProps) => {
    
  const user = await getCurrentUser();
  const userInterviewsRaw = user ? await getInterviewsByUserId(user.id) : null;
  const userInterviews = userInterviewsRaw ?? [];

  const params = await searchParams;

  // Filter interviews server-side
  const filteredInterviews = userInterviews.filter((interview) => {
    // Filter by search term (role or tech)
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      const matchesRole = interview.role.toLowerCase().includes(searchLower);
      const matchesTech = interview.techstack.some(tech =>
        tech.toLowerCase().includes(searchLower)
      );
      if (!matchesRole && !matchesTech) return false;
    }

    // Filter by type
    if (params.type && params.type !== 'all') {
      if (interview.type.toLowerCase() !== params.type.toLowerCase()) return false;
    }

    return true;
  });

  return (
    <>
    <Navbar />
      <section className='interview-block-explore'>
        <div className='flex flex-row justify-between items-center flex-wrap gap-3'>
          <h2>My Interviews</h2>
          <InterviewControls basePath="/my-interviews" />
        </div>
      <div className='interviews-section'>
          {!user ? (
            <p className="text-gray-500">Please login to see available interviews</p>
          ) : filteredInterviews.length === 0 ? (
            <p className="text-gray-500">No interviews found matching your filters</p>
          ) : (
            filteredInterviews.map((interview) => (
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
  )
};

export default Page;