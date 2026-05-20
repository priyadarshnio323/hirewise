import { isAuthenticated } from '@/lib/actions/auth.action'
import { redirect } from 'next/navigation';
import Navbar from '../../components/Navbar';  
import Footer from '@/components/Footer';

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) {
    redirect("/sign-in");
  }

  return (
    <div className='root-layout min-h-screen flex flex-col '>
       <header className='fixed top-0 left-0 w-full z-50'>
              <Navbar />   
      </header>
      <main className='flex-1 pt-20'>
    {children}
  </main>
  <footer className='w-full'>
    <Footer />
  </footer>
  
</div>

  );
};

export default RootLayout;

{/* <header className='fixed top-0 left-0 w-full z-50'>
              <Navbar />   
      </header>
      <main className='pt-14 flex-1'>
        {children}
      </main>
      <footer className='fixed bottom-0 w-full z-50'>
               <Footer />
      </footer>  */}


// import { isAuthenticated } from '@/lib/actions/auth.action'
// import { redirect } from 'next/navigation';
// import Navbar from '../../components/Navbar';  
// import Footer from '@/components/Footer';

// const RootLayout = async ({ children }: { children: React.ReactNode }) => {
//   const isUserAuthenticated = await isAuthenticated();

//   if (!isUserAuthenticated) {
//     redirect("/sign-in");
//   }

//   return (
//     // Move the gradient to the absolute outer wrapper to ensure the entire page (including nav/footer) stays perfectly cohesive
//     <div className='root-layout min-h-screen flex flex-col bg-gradient-to-b from-blue-50/70 via-white to-white select-none antialiased'>
      
//       {/* Navbar Container */}
//       <header className='fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-blue-50/30 shadow-sm shadow-blue-900/[0.02]'>
//         <Navbar />   
//       </header>

//       {/* Main Content Area */}
//       {/* pt-[72px] ensures content sits perfectly below standard nav heights without overlapping */}
//       <main className='flex-1 pt-[72px] flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
//         {children}
//       </main>

//       {/* Footer Container */}
//       <footer className='w-full border-t border-slate-100 bg-white/40 backdrop-blur-sm'>
//         <Footer />
//       </footer>
      
//     </div>
//   );
// };

// export default RootLayout;
