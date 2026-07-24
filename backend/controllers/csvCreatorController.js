import fs from "fs";
import csv from "csv-parser";
import Creator from "../models/Creator.js";
import CSVUploadReport from "../models/CSVUploadReport.js";

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
          email: row.email?.trim() || undefined,
          mobileNumber: row.mobileNumber?.trim() ||undefined,
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

           const report = [];

         let totalRecords = creators.length;
         let successfulRecords = 0;
          let failedRecords = 0;
          for (let i = 0; i < creators.length; i++) {
          const creator = creators[i]
        
          if (!creator.fullName?.trim()) {

    failedRecords++;

    report.push({
        row: i + 2,
        fullName: "",
        email: creator.email,
        mobileNumber: creator.mobileNumber,
        instagramUsername: creator.instagramUsername,
        youtubeName: creator.youtubeName,
        status: "Failed",
        reason: "Full Name is required"
    });

    continue;
}

if (!creator.email && !creator.mobileNumber) {

    failedRecords++;

    report.push({
        row: i + 2,
        fullName: creator.fullName,
        email: "",
        mobileNumber: "",
        instagramUsername: creator.instagramUsername,
        youtubeName: creator.youtubeName,
        status: "Failed",
        reason: "Either Email or Mobile Number is required"
    });

    continue;
}
 const hasInstagram =
    creator.instagramUsername ||
    creator.instagramLink;

const hasYoutube =
    creator.youtubeName ||
    creator.youtubeLink;

if (!hasInstagram && !hasYoutube) {

    failedRecords++;

    report.push({
        row: i + 2,
        fullName: creator.fullName,
        email: creator.email,
        mobileNumber: creator.mobileNumber,
        instagramUsername: "",
        youtubeName: "",
        status: "Failed",
        reason: "Either Instagram or YouTube details are required"
    });

    continue;
}

if (creator.email?.trim()) {

    const emailExist = await Creator.findOne({
        email: creator.email
    });

    if (emailExist) {

        failedRecords++;

        report.push({
            row: i + 2,
            fullName: creator.fullName,
            email: creator.email,
            mobileNumber: creator.mobileNumber,
            instagramUsername: creator.instagramUsername,
            youtubeName: creator.youtubeName,
            status: "Failed",
            reason: "Email already exists"
        });

        continue;
    }
}

if (creator.mobileNumber?.trim()) {

    const mobileExist = await Creator.findOne({
        mobileNumber: creator.mobileNumber
    });

    if (mobileExist) {

        failedRecords++;

        report.push({
            row: i + 2,
            fullName: creator.fullName,
            email: creator.email,
            mobileNumber: creator.mobileNumber,
            instagramUsername: creator.instagramUsername,
            youtubeName: creator.youtubeName,
            status: "Failed",
            reason: "Mobile Number already exists"
        });

        continue;
    }
}
 try {

    await Creator.create(creator);

    successfulRecords++;

    report.push({
        row: i + 2,
        fullName: creator.fullName,
        email: creator.email,
        mobileNumber: creator.mobileNumber,
        instagramUsername: creator.instagramUsername,
        youtubeName: creator.youtubeName,
        status: "Uploaded",
        reason: "Successfully uploaded"
    });

}
catch(error){

    failedRecords++;

    report.push({
        row: i + 2,
        fullName: creator.fullName,
        email: creator.email,
        mobileNumber: creator.mobileNumber,
        instagramUsername: creator.instagramUsername,
        youtubeName: creator.youtubeName,
        status: "Failed",
        reason: error.message
    });

}

}
// SAVE REPORT PERMANENTLY
const savedReport = await CSVUploadReport.create({

    fileName: req.file.originalname,

    totalRecords,

    successfulRecords,

    failedRecords,

    report

});


fs.unlink(req.file.path, () => {});


return res.status(200).json({

    success: true,

    message: "CSV uploaded successfully",

    reportId: savedReport._id,

    totalRecords,

    successfulRecords,

    failedRecords,

    report

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

// get latest report

 export const getLatestCSVReport = async(req,res)=>{

try{

const report = await CSVUploadReport
.findOne()
.sort({
createdAt:-1
});

if(!report){
 return res.json({

success:true,

report:null,
message:"No CSV report found"

});
}
return res.json({

success:true,

report

});

}catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};
// ==========================
// DELETE ALL CREATORS
// ==========================
export const deleteCSVCreators = async (req,res)=>{

try{

const result = await Creator.deleteMany({});


const deletedReports = await CSVUploadReport.deleteMany({});

return res.json({

success:true,

message:`${result.deletedCount} creators deleted`

});


}
catch(error){

return res.status(500).json({

success:false,

message:error.message

});

}

};