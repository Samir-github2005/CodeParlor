import {StreamChat} from "stream-chat"
import { ENV } from "./env.js"
import {StreamClient} from "@stream-io/node-sdk"

const apiSecret=ENV.STREAM_API_SECRET
const apiKey=ENV.STREAM_API_KEY
if(!apiSecret || !apiKey){
    throw new Error("Missing Stream API credentials")
}

export const chatClient= StreamChat.getInstance(
  apiKey,
  apiSecret,
); // for chat-msg

export const streamClient= new StreamClient(apiKey, apiSecret)

export const upsertStreamUser=async(userData)=>{
    try {
        await chatClient.upsertUser(userData)
        console.log("Stream user upserted",userData)
    } catch (error) {
        console.log("Error upstreaming user",error)
    }
}

export const deleteStreamUser=async(userId)=>{
    try {
        await chatClient.deleteUser(userId)
        console.log("Stream user deleted",userId)
    } catch (error) {
        console.log("Error upstreaming user",error)
    }
}