import express from "express";

import uploadPayment from "../middleware/uploadPayment.js";

import {
  submitPaymentRequest,
  getAllPayments,
  approvePayment,
  rejectPayment,
  checkPaymentStatus,
  downloadCSV,
  resetDownload,
} from "../controllers/paymentController.js";

const router = express.Router();


// ======================================
// USER ROUTES
// ======================================

// Submit Payment Request
router.post(
  "/submit",
  uploadPayment.single("screenshot"),
  submitPaymentRequest
);

// Check Payment Status
router.get(
  "/status/:email",
  checkPaymentStatus
);

// Download Creator Data
router.post(
  "/download",
  downloadCSV
);


// ======================================
// ADMIN ROUTES
// ======================================

// Get All Payment Requests
router.get(
  "/all",
  getAllPayments
);

// Approve Payment
router.put(
  "/approve/:id",
  approvePayment
);

// Reject Payment
router.put(
  "/reject/:id",
  rejectPayment
);

// Unlock Download Again
router.put(
  "/reset-download/:id",
  resetDownload
);

export default router;