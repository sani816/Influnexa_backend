import express from "express";

import {

createCampaign,
getCampaigns,
getBrandCampaigns,
deleteCampaign

} from "../controllers/campaignController.js";


const router = express.Router();



// Brand create campaign

router.post(
"/create",
createCampaign
);



// Public campaign page

router.get(
"/",
getCampaigns
);



// Brand dashboard campaigns

router.get(
"/brand/:brandId",
getBrandCampaigns
);



// Delete

router.delete(
"/:id",
deleteCampaign
);



export default router;