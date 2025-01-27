// Import dotenv to load environment variables
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

// Use the DATABASE env variable or provide a fallback URI
const MONGODB_URI = process.env.DATABASE;

// Database connection function
export const Db = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: "Darsh_Backend",
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error: " + error);
    }
};
