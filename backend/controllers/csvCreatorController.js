import fs from "fs";
import csv from "csv-parser";
import Creator from "../models/Creator.js";

// ==========================
// UPLOAD CSV
// ==========================
export const uploadCreatorsCSV = async (req, res) => {
  try {
    console.log("===== CSV UPLOAD START =====");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file required",
      });
    }

    console.log("Uploaded File:", req.file);

    const creators = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())

      .on("data", (row) => {
        creators.push({
          instagramUsername: row.instagramUsername || "",
          instagramLink: row.instagramLink || "",

          followersRange: Number(row.followersRange) || 0,

          fullName: row.fullName || "",
          email: row.email || "",
          mobileNumber: row.mobileNumber || "",
          whatsappNumber: row.whatsappNumber || "",

          gender: row.gender || "",
          dob: row.dob || "",

          campaignTypes: row.campaignTypes
            ? row.campaignTypes.split(",").map((x) => x.trim())
            : [],

          preferredCategory: row.preferredCategory
            ? row.preferredCategory.split(",").map((x) => x.trim())
            : [],

          reelRate: row.reelRate || "",
          storyRate: row.storyRate || "",
          postRate: row.postRate || "",

          ytVideoRate: row.ytVideoRate || "",
          ytShortsRate: row.ytShortsRate || "",

          youtubeName: row.youtubeName || "",
          youtubeLink: row.youtubeLink || "",
          youtubeSubs: Number(row.youtubeSubs) || 0,

          address1: row.address1 || "",
          address2: row.address2 || "",

          city: row.city || "",
          state: row.state || "",
          pincode: row.pincode || "",

          canReceiveProducts: row.canReceiveProducts || "",
          addressType: row.addressType || "",

          brandNames: row.brandNames || "",

          image: row.image || "",

          consent1: row.consent1 === "true",
          consent2: row.consent2 === "true",
          consent3: row.consent3 === "true",
        });
      })

      .on("end", async () => {
        try {
          console.log("Total Creators:", creators.length);

          if (creators.length === 0) {
            return res.status(400).json({
              success: false,
              message: "CSV has no data",
            });
          }

          const batchSize = 500;

          for (let i = 0; i < creators.length; i += batchSize) {
            const batch = creators.slice(i, i + batchSize);

            await Creator.insertMany(batch, {
              ordered: false,
            });

            console.log(
              `Inserted ${Math.min(i + batchSize, creators.length)} / ${creators.length}`
            );
          }

          fs.unlink(req.file.path, () => {});

          return res.status(201).json({
            success: true,
            message: `${creators.length} creators uploaded successfully`,
          });

        } catch (err) {
          console.error("INSERT ERROR:");
          console.error(err);

          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }
      })

      .on("error", (err) => {
        console.error("CSV READ ERROR:", err);

        return res.status(500).json({
          success: false,
          message: err.message,
        });
      });

  } catch (err) {
    console.error("MAIN ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================
// DELETE ALL CREATORS
// ==========================
export const deleteCSVCreators = async (req, res) => {
  try {
    const result = await Creator.deleteMany({});

    return res.json({
      success: true,
      message: `${result.deletedCount} creators deleted`,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};