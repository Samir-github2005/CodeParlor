import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router'
import { useUser } from '@clerk/clerk-react'
import { useState } from 'react'
import { useActiveSession, useCreateSession, useMyRecentSession } from '../hooks/useSession'
import WelcomeSection from '../components/WelcomeSection'
import StatsCards from '../components/StatsCards'
import ActiveSessions from '../components/ActiveSessions'
import RecentSessions from '../components/RecentSessions'
import { CreateSessionModal } from '../components/CreateSessionModal'

const DashboardPage = () => {
  const navigate= useNavigate()
  const {user}= useUser()
  const [showModal,setShowModal]= useState(false)
  const [roomConfig,setRoomConfig]= useState({
    problem:"",
    difficulty: ""
  })
  const createSessionMutation= useCreateSession()
  const {data: activeSession, isLoading: loadingActiveSession}= useActiveSession()
  const {data: recentSession, isLoading: loadingRecentSession}= useMyRecentSession()

  const handlecreateRoom=()=>{
   if(! roomConfig.problem || !roomConfig.difficulty) return
   createSessionMutation.mutate({
    problem: roomConfig.problem,
    difficulty: roomConfig.difficulty.toLowerCase()
   },{
    onSuccess:(data)=>{
      setShowModal(false)
      navigate(`/session/${data.session._id}`)
    }
   })
  }

  const activeSessions= activeSession?.session || []
  const recentSessions= recentSession?.sessions || []

  const isUserInSession = (session)=>{
    if(!user.id) return false
    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id
  }

  return (
    <>
    <div className='min-h-screen bg-base-300'>
      <Navbar/>
      <WelcomeSection onCreateSession={()=> setShowModal(true)} />
        <div className='container mx-auto px-6 pb-16'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <StatsCards
              activeSessionsCount={activeSessions.length}
              recentSessionsCount={recentSessions.length}
            />
            <ActiveSessions
            sessions={activeSessions}
            isLoading={loadingActiveSession}
            isUserInSession={isUserInSession}
            />

          </div>
          <RecentSessions sessions={recentSessions} isLoading={loadingRecentSession} />
        </div>
    </div>
    <CreateSessionModal isOpen={showModal} onClose={()=>setShowModal(false)} roomConfig={roomConfig} setRoomConfig={setRoomConfig} onCreateRoom={handlecreateRoom} isCreating={createSessionMutation.isPending} />
    </>    
  )
}

export default DashboardPage