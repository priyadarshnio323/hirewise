import  { ReactNode } from 'react'
import { Toaster } from 'sonner'

const AuthLayout = ({children} : {children : ReactNode}) => {
  return (
    <div className='min-h-screen w-full flex items-center justify-center px-4'>
      <div className='auth-layout'>
      {children}
      <Toaster />
    </div>
    </div>
  )
}

export default AuthLayout