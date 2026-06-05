import express from "express";

import {
  createRating,
  getRatings,
  getAverageRating,
} from "../controllers/ratingController.js";

const router = express.Router();

router.post("/", createRating);

router.get("/", getRatings);

router.get(
  "/average",
  getAverageRating
);

export default router;