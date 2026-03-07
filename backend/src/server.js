import express from "express"
import path from "path"
import { ENV } from "./lib/env.js"
import { connectDb } from "./lib/db.js"
import cors from "cors"
import {serve} from "inngest/express"
import { inngest, functions } from "./lib/inngest.js"
import {clerkMiddleware} from "@clerk/express"
import chatRoutes from "./routes/chatRoutes.js"

const port= ENV.PORT
const __dirname=path.resolve()
const app=express()
app.use(express.json())
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}))
app.use(clerkMiddleware())
app.use("/api/inngest",serve({ client: inngest, functions}))

app.use('/api/chat',chatRoutes)

app.get('/health',(req,res)=>{
    res.send("hey")
})


if(ENV.NODE_ENV=="production"){
    app.use(express.static(path.join(__dirname,'../frontend/dist')))

    app.get('/{*any}',(req,res)=>{
        res.sendFile(path.join(__dirname,'../frontend/dist/index.html'))
    })
}

const startServer=async()=>{
    try {
        await connectDb()
        app.listen(port,()=>{
        console.log(`server running on port ${port}`)
        })
    } catch (error) {
        console.log("server failed to start",error)
        process.exit(1)
    }
}

startServer()

// help me build an interview clone project 
