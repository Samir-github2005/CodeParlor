import { useState } from 'react'
import './App.css'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SignedOut>
        <SignInButton mode='modal'>Login</SignInButton>
      </SignedOut>
      {/* Show the user button when the user is signed in */}
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  )
}

export default App
