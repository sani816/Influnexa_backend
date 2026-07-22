import fs from "fs";
import csv from "csv-parser";
import Creator from "../models/Creator.js";

// ================= UPLOAD CSV =================
export const uploadCreatorsCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "CSV file required",
      });
    }

    const creators = [];

    fs.createReadStream(req.file.path)
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
          console.log("TOTAL:", creators.length);

          const result = await Creator.insertMany(creators);

          console.log("INSERT SUCCESS");

          res.json(result);

        } catch (err) {
          console.log("INSERT ERROR:", err);

          res.status(500).json({
            message: err.message,
          });
        }
      });

  } catch (err) {

    console.log("MAIN ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};
// ================= DELETE CSV CREATORS =================
export const deleteCSVCreators = async (req, res) => {
  try {
    const result = await Creator.deleteMany({});

    res.json({
      success: true,
      message: `${result.deletedCount} creators deleted`,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};