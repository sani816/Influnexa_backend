import express from "express";
import {
  createBrand,
  getAllBrands,
  updateBrand,
//   deleteBrand,
} from "../controllers/brandController.js";

// import Notification from "../models/Notification.js";

const router = express.Router();

router.post("/register", createBrand);

router.get("/", getAllBrands);
router.put("/:id", updateBrand);
// router.delete("/brands/:id", deleteBrand);



export default router;