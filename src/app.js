import express from "express"
import path from "path"
const app = express()
// const __dirname = path.resolve()
import { ENV } from "./config/env.js"
import { connectDB } from "./config/db.js"
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest.js";

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(clerkMiddleware())

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Success" })
})

// //static files
// if (ENV.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, "../admin/dist")))

//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname, "../admin", "dist", "index.html"))
//     })
// }


//start server
const startServer = async () => {
    try {
        await connectDB()
        app.listen(ENV.PORT, () => console.log(`Server is running on port no ${ENV.PORT}`))
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

startServer()
