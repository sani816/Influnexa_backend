import express from "express";
import {
  getBookings,
  createBooking,
  deleteBooking,
  updateStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

// GET
router.get("/", getBookings);

// POST
router.post("/", createBooking);

// DELETE
router.delete("/:id", deleteBooking);

// UPDATE STATUS
router.put("/:id", updateStatus);

export default router;