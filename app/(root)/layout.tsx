
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
      <main className='flex-1 pt-10'>
    {children}
  </main>
  <footer className='w-full'>
    <Footer />
  </footer>
  
</div>

  );
};

export default RootLayout;


