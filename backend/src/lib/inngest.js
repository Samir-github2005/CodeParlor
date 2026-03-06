import { Inngest } from "inngest";
import { connectDb } from "./db.js";
import {User} from "../models/User.js";


export const inngest= new Inngest({id:"talent-iq"})

const syncUser= inngest.createFunction(
    {id:"sync-user"},
    {event:"clerk/user.created"},
    async ({event})=>{
        await connectDb()
        const{id,email_addresses,first_name,last_name,image_url}=event.data
        const newUser=await User.create({
            clerkId:id,
            email:email_addresses[0].email_address,
            name:`${first_name} ${last_name}`,
            profileImage:image_url
        })
        return {newUser}
    }

)


const deleteUser= inngest.createFunction(
    {id:"delete-user"},
    {event:"clerk/user.deleted"},
    async ({event})=>{
        await connectDb()
        const{id}=event.data
        const deletedUser=await User.deleteOne({
            clerkId:id,
        })
        return {deletedUser}
    }

)

export const functions=[syncUser,deleteUser]
