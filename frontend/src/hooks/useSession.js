import {useMutation,useQuery,useQueryClient} from "@tanstack/react-query"
import toast from "react-hot-toast"
import { sessionApi } from "../api/session"


export const useCreateSession=()=>{
    return useMutation({
        mutationFn: sessionApi.createSession,
        onSuccess:()=>{
            toast.success("Session created successfully")
        },
        onError:(error)=>{
            toast.error(error.response.data.message)
        }
    })
}

export const useActiveSession=()=>{
    return useQuery({
        queryKey:["activeSession"],
        queryFn:sessionApi.getActiveSession,
    })
}

export const useMyRecentSession=()=>{
    return useQuery({
        queryKey:["myRecentSession"],
        queryFn:sessionApi.getMyRecentSession,
    })
}

export const useSessionById=(id)=>{
    return useQuery({
        queryKey:["session",id],
        queryFn:()=>sessionApi.getSessionById(id),
        enabled: !!id,
        refetchInterval: 5000
    })
}

export const useJoinSession=()=>{
    return useMutation({
        mutationFn:sessionApi.joinSession,
        onSuccess:()=>{
            toast.success("Joined session successfully")
        },
        onError:(error)=>{
            toast.error(error.response.data.message)
        }
    })
}   

export const useEndSession=()=>{
    return useMutation({
        mutationFn:sessionApi.endSession,
        onSuccess:()=>{
            toast.success("Session ended successfully")
        },
        onError:(error)=>{
            toast.error(error.response.data.message)
        }
    })
}   