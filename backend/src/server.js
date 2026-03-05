import express from "express"
import path from "path"
import { ENV } from "./lib/env.js"
import { connectDb } from "./lib/db.js"
const port= ENV.PORT
const __dirname=path.resolve()
const app=express()
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
