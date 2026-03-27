import { isAuthenticated } from '@/lib/actions/auth.action'
import { redirect } from 'next/navigation';
import Link from 'next/link'
import React, { ReactNode } from 'react'

const RootLayout =  async ({children} : {children : ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated();
  if(!isUserAuthenticated){
    redirect("/sign-in");
  }
  return (
    <div className='root-layout'>
      <nav className='flex items-center gap-2'>
        <Link href={'/'}>
        <h2 className="text-primary-100">HireWise</h2>
        </Link>
      </nav>
      {children}
      
    </div>
  )
}

export default RootLayout