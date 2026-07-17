import express from "express";
import Creator from "../models/Creator.js";
import multer from "multer";

import {
  getAllCreators,
  createInfluencer,
  updateCreator,
  deleteCreator
} from "../controllers/creatorController.js";


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post(
  "/register",
  upload.single("creatorImage"),
  async (req, res) => {
    try {
      const creator = new Creator({
        ...req.body,
        image: req.file?.filename,
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
// UPDATE
router.put("/:id", upload.single("creatorImage"), updateCreator);

// DELETE
router.delete("/:id", deleteCreator);

export default router;