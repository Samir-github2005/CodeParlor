import { Navigate, Route, Routes } from 'react-router'
import {HomePage} from './pages/HomePage'
import { ProblemPage } from './pages/ProblemPage'
import { useUser } from '@clerk/clerk-react'
import {Toaster} from 'react-hot-toast'


function App() {
const {isSignedIn} = useUser()
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/problems' element={isSignedIn? <ProblemPage/> : Navigate({ to:'/'})}/>
      </Routes>
      <Toaster toastOptions={{duration:3000}}/>
    </>
  )
}

export default App
