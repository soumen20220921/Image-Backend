import express from "express"
import {  addProductWithImages, allProduct, deleteProductById, findProductById, updateProductById } from "../Controllers/product.js";
import { uploadFields } from "../Middlewares/multer.js";

const router = express.Router();

router.post("/addProduct",uploadFields , addProductWithImages);
router.get("/getallproduct", allProduct);
router.get("/:id", findProductById);
router.put("/:id", updateProductById);
router.delete("/:id", deleteProductById);


export default router;