import { ENV } from "./env.js";
import mongoose from "mongoose"


export const connectDb= async()=>{
    try {
        if(!ENV.MONGO_URI){
            throw new Error("MONGO_URI is not defined")
        }
        await mongoose.connect(ENV.MONGO_URI)
        console.log("DB connected")
    } catch (error) {
        console.log("DB connection failed",error)
    }
}