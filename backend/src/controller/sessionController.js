import { chatClient, streamClient } from "../lib/stream.js"
import Session from "../models/Session.js"

export const createSession=async(req,res)=>{
    try {
        const {problem, difficulty}=req.body
        const userId =req.user._id
        const clerkId= req.user.clerkId

        if(!problem || !difficulty) return res.status(400).json({message:"problem and difficulty required"})
        
         //callerId to generate unique call
        const callerId= `session_${Date.now()}_${Math.random().toString(36).substring(7)}`

        //create session in db
        const session= await Session.create({problem,difficulty,host:userId,callerId})

        //create stream video call
        await streamClient.video.call("default",callerId).getOrCreate({
            data:{
                created_by_id:clerkId,
                custom:{ problem, difficulty, sessionId: session._id.toString()}
            }
        })

        //create stream chat msg
        await chatClient.channel("messaging",callerId,{
            name:`${problem} Session`,
            created_by_id:clerkId,
            members:[clerkId]
        })

        await channel.create()
        res.status(201).json({session})
    } catch (error) {
        console.log("error in createSession controller", error.message)
        res.status(500).json({message:"internal server error"})
    }
}

export const getActiveSession=async(req,res)=>{
    try {
        const session=await Session.find({status:"active"}).populate("host","name profileImage email clerkId").sort({createdAt:-1}).limit(20)
        res.status(200).json({session})
    } catch (error) {
        console.log("error in getActiveSession controller", error.message)
        res.status(500).json({message:"internal server error"})
    }
}

export const getMyRecentSession=async(req,res)=>{
    try {
        const userId= req.user._id
        const sessions= await Session.find({
            status:"completed",
            $or: [{host:userId},{participant:userId}]
        }).sort({createdAt:-1}).limit(20)
        res.status(200).json({sessions})
    } catch (error) {
        console.log("error in getMyRecentSession controller", error.message)
        res.status(500).json({message:"internal server error"})
    }
}

export const getSessionById=async(req,res)=>{
    try {
       const {id} =req.params
       const session=await Session.find(id).populate("host","name email profileImage clerkId").populate("partcipant","name email profileImage clerkId")
       if(!session) res.status(404).json({message:"session not found"})
       res.status(200).json({session})
    } catch (error) {
        console.log("error in getSessionById controller", error.message)
        res.status(500).json({message:"internal server error"})
    }
}

export const joinSession=async(req,res)=>{
    try {
        const {id}= req.params
        const userId=req.user._id
        const clerkId= req.user.clerkId

        const session= await Session.findById(id)
        if(!session) res.status(404).json({message:"session not found"})

        if(session.status!=="active") return res.status(400).json({message:"cannot join a completed session"})
        if(session.host.toString()===userId.toString()){
            return res.status(400).json({message:"host cannot be participant"})
        }

        //check if session is full
        if(session.participant) res.status(409).json({message:"session is full"})
        
        session.participant = userId
        await session.save()
        const channel= chatClient.channel("messaging",session.callerId)
        await channel.addMembers([clerkId])
        res.status(200).json({session})
    } catch (error) {
        console.log("error in joinSession controller", error.message)
        res.status(500).json({message:"internal server error"})
    }
}

export const endSession=async(req,res)=>{
    try {
        const {id}= req.params
        const userId= req.user._id

        const session=await Session.findById(id)
        if(session.participant) res.status(400).json({message:"session is full"})

        //check if user is host
        if(session.host.toString()!==userId.toString()) res.status(403).json({message:"only host can end the session"})
        
        //check if session is alredy complete
        if(session.status==="completed") res.status(400).json({message:"Session is expired"})

        //delete stream videocall channel
        const call= streamClient.video.call("default", session.callerId)
        await call.delete({hard: true})

        //delete stream chat channel
        const channel= chatClient.channel("messaging", session.callerId)
        await channel.delete()
        
        session.status="completed"
        await session.save()

        res.status(200).json({session, message:"sessionn deleted succesfully"})

    } catch (error) {
        console.log("error in joinSession controller", error.message)
        res.status(500).json({message:"internal server error"})
    }
}