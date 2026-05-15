import mongoose from "mongoose"
import { ENV } from "./env.js"

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        const connect = await mongoose.connect(ENV.MONGO_URL)
        console.log(`Database connected : ${connect.connection.host}`)
    } catch (error) {
        console.error(`Database connection error : ${error.message}`)
        // Don't exit process here as it might be called from a background task
    }
}