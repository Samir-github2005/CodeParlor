import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/clerk-react'
import React from 'react'
import toast from 'react-hot-toast'

export const HomePage = () => {
  return (
    <div>
        <button className='btn btn-secondary' onClick={()=> toast.success("Hello")}>Click me</button>
        <SignedOut>
            <SignInButton mode='modal'>
                <button>Login</button>
            </SignInButton>
        </SignedOut>
        <SignedIn>
            <SignOutButton mode='modal'>
                <button>Logout</button>
            </SignOutButton>
        </SignedIn>
    </div>
  )
}
