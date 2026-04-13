import {StreamVideo,StreamVideoClient} from "@stream-io/video-react-sdk"

const API_KEY = import.meta.env.VITE_STREAM_API_KEY

let client= null

export const initializeStreamVideoClient=async(user,token)=>{
    if(!API_KEY){
        throw new Error("Missing Stream API Key")
    }
    // Always create a fresh client — never reuse a stale one from a previous session
    if(client) {
        try { await client.disconnectUser() } catch(_) {}
        client = null
    }
    // Single-object form is required by current SDK — two-arg form skips token registration
    client = new StreamVideoClient({ apiKey: API_KEY, user, token })
    return client
}

export const disconnectStreamClient= async()=>{
    if(client){
        try {
            await client.disconnectUser()
        } catch (error) {
            console.log("Error disconnecting from Stream",error)
        } finally{
            client=null
        }
    }
}