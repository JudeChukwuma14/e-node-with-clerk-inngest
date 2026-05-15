import mongoose from "mongoose"
import { ENV } from "./env.js"

export const connectDB = async () => {
    try {
        const connect = await mongoose.connect(ENV.MONGO_URL)
        console.log(`Database connected : ${connect.connection.host}`)
    } catch (error) {
        console.error(`Error : ${error.message}`)
        process.exit(1)
    }
}