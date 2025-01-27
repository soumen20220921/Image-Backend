import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    path: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

export const Image = mongoose.model("Image", imageSchema);