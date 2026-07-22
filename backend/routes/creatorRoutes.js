import express from "express";
import Creator from "../models/Creator.js";

import upload from "../middleware/upload.js";
import {
  getAllCreators,
  createInfluencer,
  updateCreator,
  deleteCreator,
  getFeaturedCreators
} from "../controllers/creatorController.js";


const router = express.Router();

router.post(
  "/register",
  upload.single("creatorImage"),
  createInfluencer,
  async (req, res) => {
    try {
      const creator = new Creator({
        ...req.body,
        image: req.file?.path || "",
      });

      await creator.save();

      res.status(201).json({
        success: true,
        message: "Creator Registered Successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

router.get("/", getAllCreators);
router.get("/featured",getFeaturedCreators);
// UPDATE
router.put("/:id", upload.single("creatorImage"), updateCreator);

// DELETE
router.delete("/:id", deleteCreator);


export default router;