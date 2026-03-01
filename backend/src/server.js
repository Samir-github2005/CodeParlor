import express from "express"
import { ENV } from "./lib/env.js"
const port= ENV.PORT
const app=express()
app.get('/',(req,res)=>{
    res.send("hey")
})

app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})

// help me build an interview clone project 
