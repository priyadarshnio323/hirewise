import  { ReactNode } from 'react'
import { Toaster } from 'sonner'

const AuthLayout = ({children} : {children : ReactNode}) => {
  return (
   
    <div className='min-h-screen w-screen overflow-x-hidden'>
      {children}
      <Toaster />
    </div>
  )
}

export default AuthLayout