// export const addProduct = async (req, res) => {
//     try {
//         const details = req.body;
//         if (!details) {
//             return res.status(400).json({ message: "Details are required", success: false });
//         }

//         const { title, description, price, Quantity, PNumber, category,color, date, imgSrc, imgSrc1, imgSrc2, imgSrc3 } = details;
//         if (!title || !description || !price || !Quantity || !PNumber || !category || !color || !date || !imgSrc) {
//             return res.status(400).json({ message: "All fields are required", success: false });
//         }
//         const product = await Product.create({
//             title,
//             description,
//             price,
//             Quantity,
//             PNumber,
//             category,
//             color,
//             date,
//             imgSrc,
//             imgSrc1,
//             imgSrc2,
//             imgSrc3
//         });

//         res.status(201).json({ message: "Product Added Successfully", success: true, product });
//     } catch (error) {
//         console.error("Error occurred while adding product:", error.message);
//         res.status(500).json({ message: "Error occurred while adding product", success: false, ErrorMessage: error.message });
//     }
// };

import { Product } from "../Models/ProductSchema.js";
import { Image } from "../Models/uploadImage.js";
import fs from "fs";
import path from "path";

export const addProductWithImages = async (req, res) => {
  try {
    // Handle uploaded images
    const files = req.files; // req.files is an object when using multer.fields
    // console.log(files);

    const allFiles = [];
    if (files.image) allFiles.push(...files.image);
    if (files.image1) allFiles.push(...files.image1);
    const imagePromises = allFiles.map((file) => {
      const { filename, path } = file;
      const newImage = new Image({ filename, path });
      return newImage.save(); // Save each image in the database
    });

    const savedImages = await Promise.all(imagePromises);

    // Extract image paths for saving in the product
    const imagePaths = savedImages.map((img) => img._id);

    // Handle product details
    const details = req.body;
    if (!details) {
      return res
        .status(400)
        .json({ message: "Details are required", success: false });
    }

    const {
      title,
      description,
      price,
      Quantity,
      PNumber,
      category,
      color,
      date,
    } = details;
    if (
      !title ||
      !description ||
      !price ||
      !Quantity ||
      !PNumber ||
      !category ||
      !color ||
      !date
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // Ensure the required image fields are provided
    if (imagePaths.length < 1) {
      return res
        .status(400)
        .json({ message: "At least one image is required", success: false });
    }

    const product = await Product.create({
      title,
      description,
      price,
      Quantity,
      PNumber,
      category,
      color,
      date,
      imgSrc: imagePaths[0], // Set the first image as the primary
      imgSrc1: imagePaths[1] || null, // Optional additional images
    });

    res.status(201).json({
      message: "Product and Images Added Successfully",
      success: true,
      product,
      images: savedImages,
    });
  } catch (error) {
    console.error(
      "Error occurred while adding product with images:",
      error.message
    );
    res.status(500).json({
      message: "Error occurred while adding product with images",
      success: false,
      errorMessage: error.message,
    });
  }
};

// Get all product

export const allProduct = async (req, res) => {
  try {
    const product = await Product.find().sort({ orderDate: -1 });
    res.json({ message: "These are the all products", product, success: true });
  } catch (error) {
    res.status(500).json({
      message: "Error occured while fetching products",
      success: false,
    });
  }
};

// find product by id
export const findProductById = async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  try {
    const product = await Product.findById(id);
    if (!product)
      return res.json({ message: "product not found", success: false });
    res.json({ message: "Product found", product, success: true });
  } catch (error) {
    res.json({
      message: "Failed to fetch product by id",
      success: false,
      message: error.message,
    });
  }
};

// update product by id
export const updateProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!product)
      return res.json({ message: "product not found", success: false });
    res.json({
      message: "Product updated successfully",
      product,
      success: true,
    });
  } catch (error) {
    res.json({ message: "Failed to update product by id", success: false });
  }
};

// delete product by id

export const deleteProductById = async (req, res) => {
  const id = req.params.id;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    const { imgSrc, imgSrc1 } = product;

    // Delete the images from the filesystem
    const deleteImage = async (imageId) => {
      if (!imageId) return; // Skip if no image ID
      const image = await Image.findById(imageId);
      if (image) {
        const imagePath = path.resolve("uploads", image.filename);
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
        await Image.findByIdAndDelete(imageId); // Remove image from database
      }
    };

    await deleteImage(imgSrc);
    await deleteImage(imgSrc1);

    // Delete the product from the database
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    res.json({
      message: "Product and associated images deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({
      message: "Failed to delete product by ID",
      success: false,
      errorMessage: error.message,
    });
  }
};
