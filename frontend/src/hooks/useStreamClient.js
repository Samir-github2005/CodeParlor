import { useState, useEffect } from 'react'
import { sessionApi } from "../api/session"
import { disconnectStreamClient, initializeStreamVideoClient } from '../lib/stream'
import { StreamChat } from "stream-chat";
import toast from 'react-hot-toast';

export const useStreamClient = (session, loadingSession, isHost, isParticipant) => {
  const [streamClient, setStreamClient] = useState(null)
  const [call, setCall] = useState(null)
  const [chatClient, setChatClient] = useState(null)
  const [channel, setChannel] = useState(null)
  const [isInitaializedCall, setIsInitaializedCall] = useState(true)

  useEffect(()=>{
    let videoCall = null;
    let chatClientInstance = null  // renamed: was shadowing the state variable

    const initCall =async()=>{
      if(!session?.callerId) return
      if(!isHost && !isParticipant) return

      try {
        const {token, userId, userName, userImage} = await sessionApi.getStreamToken()
        const client= await initializeStreamVideoClient({
          id: userId,
          name: userName,
          image: userImage
        },token)
        setStreamClient(client)
        videoCall= client.call("default",session.callerId)
        await videoCall.join({create:true})
        const apiKey= import.meta.env.VITE_STREAM_API_KEY        
        chatClientInstance= StreamChat.getInstance(apiKey)
        await chatClientInstance.connectUser({
          id: userId,
          name: userName,
          image: userImage
        },token)
        const channel= chatClientInstance.channel("messaging",session.callerId)
        await channel.watch()
        setCall(videoCall)
        setChatClient(chatClientInstance)
        setChannel(channel)
      } catch (error) {
        toast.error("Failed to initialize call")
        console.log("Stream init error:", error)
      } finally{
        setIsInitaializedCall(false)
      }
    }
    if(session && !loadingSession) initCall()
    return () => {
      (async ()=>{
        try {
          if(videoCall) await videoCall.leave()
          if(chatClientInstance) await chatClientInstance.disconnectUser()  // fixed: was always null
          await disconnectStreamClient() 
        } catch (error) {
          console.log("Error disconnecting from Stream",error)
        }
      })()
    }
  },[loadingSession,session,isHost,isParticipant])


  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitaializedCall
  }
}
