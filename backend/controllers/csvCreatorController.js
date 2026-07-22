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
          console.log("Total creators:", creators.length);

          const result = await Creator.insertMany(creators);

          return res.status(201).json({
            success: true,
            message: `${result.length} creators uploaded successfully`,
          });

        } catch (err) {
          console.error("INSERT MANY ERROR:");
          console.error(err);

          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }
      })

      .on("error", (err) => {
        console.error("CSV ERROR:", err);

        return res.status(500).json({
          success: false,
          message: err.message,
        });
      });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
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