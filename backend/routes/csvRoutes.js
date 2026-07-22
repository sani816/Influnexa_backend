import express from "express";
import uploadCSV from "../middleware/uploadCSV.js";
import {
 uploadCreatorsCSV
} from "../controllers/csvCreatorController.js";


const router = express.Router();


router.post(
 "/creators",
 uploadCSV.single("file"),
 uploadCreatorsCSV
);


export default router;