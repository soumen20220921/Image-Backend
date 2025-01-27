import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    Quantity: { type: Number, required: true },
    PNumber: { type: Number, required: true },
    category: { type: String, required: true },
    color: { type: String, required: true },
    date: { type: String, required: true },
    imgSrc: { type: String, required: true },
    imgSrc1: { type: String, required: true },
    imgSrc2: { type: String, required: true },
    imgSrc3: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

export const Product = mongoose.model("Product", productSchema);