import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";

export const inngest = new Inngest({ id: "Jcee-ECom" });

const syncUser = inngest.createFunction(
    { id: "sync-user", event: "clerk/user.created" },
    async ({ event }) => {
        const { id, email_addresses, first_name, last_name, image_url } = event.data;

        console.log("Processing clerk/user.created event for ID:", id);
        console.log("Event data received:", JSON.stringify(event.data, null, 2));

        await connectDB();

        const name = `${first_name || ""} ${last_name || ""}`.trim() || "User";

        const userData = {
            clerkId: id,
            email: email_addresses[0]?.email_address,
            name: name,
            imageUrl: image_url,
            address: [],
            wishlist: [],
        };

        try {
            const user = await User.findOneAndUpdate(
                { clerkId: id },
                { $set: userData },
                { upsert: true, new: true }
            );
            console.log("User synced successfully:", user._id);
        } catch (error) {
            console.error("Error syncing user to database:", error.message);
            throw error; // Rethrow so Inngest can handle retry if necessary
        }
    }
);

const deleteUserFromDB = inngest.createFunction(
    { id: "delete-user-from-db", event: "clerk/user.deleted" },
    async ({ event }) => {
        const { id } = event.data;
        console.log("Processing clerk/user.deleted event for ID:", id);

        await connectDB();

        try {
            const result = await User.deleteOne({ clerkId: id });
            console.log("User deleted from DB result:", result);
        } catch (error) {
            console.error("Error deleting user from database:", error.message);
            throw error;
        }
    }
);

export const functions = [syncUser, deleteUserFromDB];