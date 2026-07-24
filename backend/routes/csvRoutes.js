import express from "express";

import uploadCSV from "../middleware/uploadCSV.js";

import {
  uploadCreatorsCSV,
  getLatestCSVReport,
  deleteCSVCreators,
  getCsvCreators,
  deleteCsvCreator
} from "../controllers/csvCreatorController.js";


const router = express.Router();


// Upload CSV File
router.post(
  "/upload",
  uploadCSV.single("file"),
  uploadCreatorsCSV
);


// Get All CSV Creators
router.get(
  "/",
  getCsvCreators
);


// Latest Upload Report
router.get(
  "/latest-report",
  getLatestCSVReport
);


// Delete Single CSV Creator
router.delete(
  "/:id",
  deleteCsvCreator
);


// Delete All CSV Creators
router.delete(
  "/",
  deleteCSVCreators
);


export default router;