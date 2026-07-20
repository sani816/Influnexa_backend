import express from "express";

import {
  bookConsultation,
  getAllConsultations,
  deleteConsultation,
} from "../controllers/consultationController.js";

const router = express.Router();

router.post(
  "/book-consultation",
  bookConsultation
);
router.get("/all", getAllConsultations);

router.delete("/:id", deleteConsultation);
export default router;