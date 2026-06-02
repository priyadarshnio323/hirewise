
import InterviewNavbar from '@/components/InterviewNavbar';

export default function InterviewLayout({ children }: { children: React.ReactNode }) {
  return (
    // h-screen + overflow-hidden prevents any weird page scrolling or white space below
    <div className="w-full h-screen overflow-hidden flex flex-col ">
      
      {/* 1. Header takes up exact navbar height */}
      <header className='w-full'>
        <InterviewNavbar />   
      </header>

      {/* 2. Main content takes up exactly what's left, keeping everything perfectly on screen */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
