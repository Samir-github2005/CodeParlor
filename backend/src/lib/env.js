import dotenv from "dotenv"

dotenv.config({ quiet:true})

export const ENV={
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    MONGO_URI: process.env.MONGO_URI,
    CLIENT_URL:process.env.CLIENT_URL,
    CLERK_SECRET_KEY:process.env.CLERK_SECRET_KEY,
    CLERK_PUBLISHABLE_KEY:process.env.CLERK_PUBLISHABLE_KEY,
    STREAM_API_SECRET:process.env.STREAM_API_SECRET,
    STREAM_API_KEY:process.env.STREAM_API_KEY,
    INGEST_SIGNIN_KEY:process.env.INGEST_SIGNIN_KEY,
    INGEST_EVENT_KEY:process.env.INGEST_EVENT_KEY
}