import axiosInstance from '../lib/axios.js'

export const sessionApi={
    createSession:async(data)=>{
        const res=await axiosInstance.post('/session',data)
        return res.data
    },
    getActiveSession:async()=>{
        const res=await axiosInstance.get(`/session/active`)
        return res.data
    },
    getMyRecentSession:async()=>{
        const res=await axiosInstance.get(`/session/my-recent`)
        return res.data
    },
    getSessionById:async(id)=>{
        const res=await axiosInstance.get(`/session/${id}`)
        return res.data
    },
    joinSession:async(id)=>{
        const res=await axiosInstance.post(`/session/${id}/join`)
        return res.data
    },
    endSession:async(id)=>{
        const res=await axiosInstance.post(`/session/${id}/end`)
        return res.data
    },
    getStreamToken:async()=>{
        const res=await axiosInstance.get(`/chat/token`)
        return res.data
    }
} 