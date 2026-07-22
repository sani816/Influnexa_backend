import axios from "axios";
import csv from "csv-parser";
import Creator from "../models/Creator.js";
import { Readable } from "stream";

export const uploadCreatorsCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "CSV file required",
      });
    }

    console.log("Cloudinary URL:", req.file.path);

    const creators = [];

    // Download CSV from Cloudinary
    const response = await axios.get(req.file.path, {
      responseType: "stream",
    });

    response.data
      .pipe(csv())

      .on("data", (row) => {
        creators.push({
          instagramUsername: row.instagramUsername,
          instagramLink: row.instagramLink,

          followersRange: Number(row.followersRange) || 0,

          fullName: row.fullName,
          email: row.email,
          mobileNumber: row.mobileNumber,
          whatsappNumber: row.whatsappNumber,

          gender: row.gender,
          dob: row.dob,

          campaignTypes: row.campaignTypes
            ? row.campaignTypes.split(",")
            : [],

          preferredCategory: row.preferredCategory
            ? row.preferredCategory.split(",")
            : [],

          reelRate: row.reelRate,
          storyRate: row.storyRate,
          postRate: row.postRate,

          ytVideoRate: row.ytVideoRate,
          ytShortsRate: row.ytShortsRate,

          youtubeName: row.youtubeName,
          youtubeLink: row.youtubeLink,
          youtubeSubs: Number(row.youtubeSubs) || 0,

          address1: row.address1,
          address2: row.address2,

          city: row.city,
          state: row.state,
          pincode: row.pincode,

          canReceiveProducts: row.canReceiveProducts,
          addressType: row.addressType,

          brandNames: row.brandNames,

          image: row.image || "",

          consent1: row.consent1 === "true",
          consent2: row.consent2 === "true",
          consent3: row.consent3 === "true",
        });
      })

      .on("end", async () => {
        try {
          const result = await Creator.insertMany(creators);

          res.status(201).json({
            success: true,
            message: `${result.length} creators uploaded successfully`,
          });

        } catch (err) {
          console.log(err);

          res.status(500).json({
            message: err.message,
          });
        }
      });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};