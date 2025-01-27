import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Db } from "./Db/db.js";
import productRouter from "./Routes/productRouter.js";
import { Image } from "./Models/uploadImage.js";
import path from "path";
import { fileURLToPath } from "url"; // Import for ES module __dirname
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("uploads"));


// Enable CORS
app.use(cors());

// Database connection
Db();


// Test routes
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// Routers
app.use("/api/product", productRouter);




// Serve image by ID
app.get("/img/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const image = await Image.findById(id); // Ensure asynchronous operation is handled
        if (!image) {
            return res.status(404).json({ message: "Image not found", success: false });
        }
        const imagePath = path.join(__dirname, "uploads", image.filename);
        res.sendFile(imagePath);
    } catch (error) {
        res.status(500).json({
            message: "Error occurred while fetching image",
            success: false,
            ErrorMessage: error.message,
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
