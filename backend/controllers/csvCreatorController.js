import fs from "fs";
import csv from "csv-parser";
import CsvCreator from "../models/CsvCreator.js";
import CSVUploadReport from "../models/CSVUploadReport.js";

import { io } from "../server.js";



// =============================
// CLEAN DATA FUNCTIONS
// =============================

const cleanText = (value) => {
    if (value === null || value === undefined) return "";

    const text = String(value).trim();

    if (
        text === "" ||
        text.toLowerCase() === "null" ||
        text.toLowerCase() === "undefined"
    ) {
        return "";
    }

    return text;
};



const cleanEmail = (value)=>{

    if(!value) return "";

    return String(value)
    .trim()
    .toLowerCase();

};



const cleanPhone = (value)=>{

    if(!value) return "";


    let phone = String(value)
    .trim()
    .replace(/\s+/g,"")
   .replace(/\.0$/,"");


    // Fix Excel scientific notation

    if(phone.includes("E") || phone.includes("e")){

        phone = Number(phone)
        .toFixed(0);

    }


    // remove country code

    phone = phone.replace("+91","");


    return phone;

};
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
      .pipe(csv({
  mapHeaders: ({header}) =>
    header.replace(/^\uFEFF/, "").trim()
}))
      .on("data", (row) => {
        creators.push({
          timestamp: row["Timestamp"] || "",

          instagramUsername: row["Instagram Username"] || "",

          instagramProfileLink: row["Instagram Profile Link"] || "",

          instagramFollowersRange:
            row["Instagram Followers Range"] || "",

          exactFollowers:
            Number(
              String(row["Exact Followers"] || "0").replace(/,/g, "")
            ) || 0,

          categories: row["Categories"]
            ? row["Categories"]
                .split(",")
                .map((item) => item.trim())
            : [],

          phoneNumber: cleanPhone(row["Phone Number"]) || "",

          whatsappNumber: cleanPhone(row["Whatsapp Number"])|| "",

          fullName: cleanText(row["Full Name"] )|| "",

          email:cleanEmail (row["Email"]) || "",

          gender: row["Gender"] || "",

          dateOfBirth: row["Date of Birth"] || "",

          campaignType: row["Campaign type"]
            ? row["Campaign type"]
                .split(",")
                .map((item) => item.trim())
            : [],

          whatKindOfDealDoYouParticipateIn:
            row["What kind of deal do you participate in"] || "",

          languages: row["Languages"]
            ? row["Languages"]
                .split(",")
                .map((item) => item.trim())
            : [],

          speakingVideoLink:
            row["Speaking Video Link"] || "",

          fullAddress:
            row["Full Address"] || "",

          landmark:
            row["Landmark"] || "",

          city:
            row["City"] || "",

          state:
            row["State"] || "",

          country:
            row["Country"] || "",

          pincode:
            row["Pincode"] || "",

          photoLink:
            row["Photo Link"] || "",

          youtubeUsername:
            row["YouTube Username"] || "",

          youtubeChannelLink:
            row["YouTube Channel Link"] || "",

          youtubeSubscribersRange:
            row["YouTube Subscribers Range"] || "",

          commercialsFor1InstagramReel:
            Number(row["Commercials For 1 Instagram Reel"]) || 0,

          commercialsFor1InstagramStory:
            Number(row["Commercials For 1 Instagram Story"]) || 0,

          commercialsFor1InstagramPost:
            Number(row["Commercials For 1 Instagram Post"]) || 0,

          commercialsFor1DedicatedYouTubeVideo:
            Number(
              row["Commercials For 1 Dedicated YouTube Video"]
            ) || 0,

          commercialsFor1IntegratedYouTubeVideo:
            Number(
              row["Commercials For 1 Integrated YouTube Video"]
            ) || 0,

          commercialsFor1DedicatedYouTubeShortsVideo:
            Number(
              row[
                "Commercials For 1 Dedicated YouTube Shorts Video"
              ]
            ) || 0,

          commercialsFor1IntegratedYouTubeShortsVideo:
            Number(
              row[
                "Commercials For 1 Integrated YouTube Shorts Video"
              ]
            ) || 0,

          anyMessageForUs:
            row["Any message for us"] || "",

          bio:
            row["Bio"] || "",

          areYouATvMoviesOttCelebrity:
            row["Are you a TV/movies/OTT celebrity"] || "",

          typeOfCeleb:
            row["Type of Celeb"] || "",

          whatAllPlatformsAreYouAvailableOn:
            row["What all platforms are you avilable on"]
              ? row["What all platforms are you avilable on"]
                  .split(",")
                  .map((item) => item.trim())
              : [],

          howManyAmazonReviewsYouDoPerMonth:
            Number(
              row["How many Amazon reviews you do per month"]
            ) || 0,

          fetchedFromBrandPage:
            row["Fetched from Brand Page"] || "",

          fetchedForBrand:
            row["Fetched For Brand"] || "",

          platform:
            row["Platform"] || "",

          fetchedDate:
            row["Fetched Date"] || "",

          hoboUserId: String(
  row["hoboUserId"] || ""
).trim(),
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
          
          const isFirstUpload =
  (await CsvCreator.countDocuments()) === 0;
           const report = [];

         let totalRecords = creators.length;
         let successfulRecords = 0;
         let updatedRecords = 0;
          let failedRecords = 0;

          
  await Promise.all(
  creators.map(async (creator, index) => {
        
//     if (!creator.fullName?.trim()) {

//     failedRecords++;

//     report.push({
//         row: i + 2,
//         fullName: "",
//         email: creator.email,
//         phoneNumber: creator.phoneNumber,
//         instagramUsername: creator.instagramUsername,
//         youtubeName: creator.youtubeName,
//         status: "Failed",
//         reason: "Full Name is required"
//     });

//     continue;
// }

if (!creator.email?.trim() && !creator.phoneNumber?.trim()) {

    failedRecords++;

    report.push({
        row: index  + 2,
        fullName: creator.fullName,
        email: "",
        phoneNumber: "",
        instagramUsername: creator.instagramUsername,
        youtubeUsername: creator.youtubeUsername,
        status: "Failed",
        reason: "Either Email or Mobile Number is required"
    });

    continue;
}
 const hasInstagram =
    cleanText(creator.instagramUsername) !== "" 


const hasYoutube =
    cleanText(creator.youtubeUsername) !== "" 

if (!hasInstagram && !hasYoutube) {

    failedRecords++;

    report.push({
        row: index + 2,
        fullName: creator.fullName,
        email: creator.email,
        phoneNumber: creator.phoneNumber,
        instagramUsername: creator.instagramUsername,
        youtubeUsername: creator.youtubeUsername,
        status: "Failed",
        reason: "Either Instagram or YouTube details are required"
    });

    continue;
}
try {

let existingCreator = null;


const email = cleanEmail(
    creator.email
);


const phone = cleanPhone(
    creator.phoneNumber
);



const instagramUsername = cleanText(
  creator.instagramUsername
).toLowerCase();

const youtubeUsername = cleanText(
    creator.youtubeUsername
).toLowerCase();

// VALIDATION

if (!isFirstUpload) {

    if (email) {
        existingCreator = await CsvCreator.findOne({
            email: {
                $regex: `^${email}$`,
                $options: "i"
            }
        });
    }

    if (!existingCreator && phone) {
        existingCreator = await CsvCreator.findOne({
            phoneNumber: phone
        });
    }

    if (!existingCreator && instagramUsername) {
        existingCreator = await CsvCreator.findOne({
            instagramUsername: {
                $regex: `^${instagramUsername}$`,
                $options: "i"
            }
        });
    }

    if (!existingCreator && youtubeUsername) {
        existingCreator = await CsvCreator.findOne({
            youtubeUsername: {
                $regex: `^${youtubeUsername}$`,
                $options: "i"
            }
        });
    }

}
// ===============================
// EXISTING USER
// ===============================

if(existingCreator){

let isUpdated = false;

let changedFields=[];



const compareFields=[


"fullName",

"email",

"phoneNumber",

"whatsappNumber",

"instagramUsername",

"instagramProfileLink",

"instagramFollowersRange",

"exactFollowers",

"categories",

"youtubeUsername",

"youtubeChannelLink",

"youtubeSubscribersRange",

"city",

"state",

"country",

"bio"

];



compareFields.forEach((key)=>{


let oldValue = existingCreator[key];

let newValue = creator[key];



if(Array.isArray(oldValue)){

oldValue = JSON.stringify(
oldValue.sort()
);

}



if(Array.isArray(newValue)){

newValue = JSON.stringify(
newValue.sort()
);

}



if(key==="phoneNumber" || key==="whatsappNumber"){

oldValue = cleanPhone(oldValue);
newValue = cleanPhone(newValue);

}
else{

oldValue = String(oldValue || "")
.trim()
.toLowerCase();


newValue = String(newValue || "")
.trim()
.toLowerCase();

}

if (oldValue !== newValue) {

    existingCreator[key] = creator[key];

    isUpdated = true;

    changedFields.push(key);

}


});


// Only save if something changed

if(isUpdated){

await existingCreator.save();

updatedRecords++;


report.push({

row:index+2,

fullName:creator.fullName,

email:creator.email,

phoneNumber:creator.phoneNumber,
instagramUsername: creator.instagramUsername,
youtubeUsername: creator.youtubeUsername,

status:"Updated",

reason:
`Updated fields: ${changedFields.join(", ")}`

});


}

else{


// Same data no update

report.push({

row:index+2,

fullName:creator.fullName,

email:creator.email,

phoneNumber:creator.phoneNumber,
instagramUsername: creator.instagramUsername,
youtubeUsername: creator.youtubeUsername,
status:"Skipped",

reason:"No changes found"

});


}

}



// ===============================
// NEW USER
// ===============================

else{


await CsvCreator.create(creator);


successfulRecords++;


report.push({

row:index+2,

fullName:creator.fullName,

email:
cleanEmail(
creator.email
),

phoneNumber:
cleanPhone(
creator.phoneNumber
),

instagramUsername: creator.instagramUsername,
youtubeUsername: creator.youtubeUsername,
status:"Uploaded",

reason:"New creator added"

});


}



}
catch(error){


failedRecords++;


report.push({

row:index+2,

status:"Failed",

reason:error.message

});
}
})
)
        

// SAVE REPORT PERMANENTLY
const savedReport = await CSVUploadReport.create({

    fileName: req.file.originalname,

    totalRecords,

    successfulRecords,
    updatedRecords,

    failedRecords,

    report

});


fs.unlink(req.file.path, () => {});

if(io){

io.emit(
"new-csv-creator"
);

}
return res.status(200).json({

    success: true,

    message: "CSV uploaded successfully",

    reportId: savedReport._id,

    totalRecords,

    successfulRecords,
    updatedRecords,

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

//  EDIT CSV CREATOR
export const updateCsvCreator = async (req, res) => {

  try {

    const updatedCreator = await CsvCreator.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new:true
      }
    );


    res.status(200).json({
      success:true,
      creator: updatedCreator
    });


  } catch(error){

    console.log("UPDATE CSV ERROR:", error);

    res.status(500).json({
      success:false,
      message:error.message
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

const result = await CsvCreator.deleteMany({});

await CSVUploadReport.deleteMany({});
const deletedReports = await CSVUploadReport.deleteMany({});
if(io){

io.emit(
"delete-all-csv-creators"
);

}
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

// DELETE SINGLE CSV CREATOR

export const deleteCsvCreator = async(req,res)=>{

try{


const {id} = req.params;


const creator = await CsvCreator.findByIdAndDelete(id);



if(!creator){

return res.status(404).json({

success:false,

message:"Creator not found"

});

}

if(io){

io.emit(
"delete-csv-creator",
id
);

}

return res.json({

success:true,

message:"CSV creator deleted successfully"

});


}
catch(error){


return res.status(500).json({

success:false,

message:error.message

});


}


};

export const getCsvCreators = async(req,res)=>{

try{


const {

  timestamp,

  instagramUsername,
  instagramProfileLink,
  instagramFollowersRange,
  exactFollowers,

  categories,

  phoneNumber,
  whatsappNumber,

  fullName,
  email,

  gender,
  dateOfBirth,

  campaignType,
  whatKindOfDealDoYouParticipateIn,
whatAllPlatformsAreYouAvailableOn,
  languages,

  speakingVideoLink,

  fullAddress,
  landmark,
  city,
  state,
  country,
  pincode,

  photoLink,

  youtubeUsername,
  youtubeChannelLink,
  youtubeSubscribersRange,

commercialsFor1InstagramReel,
commercialsFor1InstagramStory,
commercialsFor1InstagramPost,
commercialsFor1DedicatedYouTubeVideo,
commercialsFor1IntegratedYouTubeVideo,
commercialsFor1DedicatedYouTubeShortsVideo,
commercialsFor1IntegratedYouTubeShortsVideo,

howManyAmazonReviewsYouDoPerMonth,
anyMessageForUs,
bio,

  areYouATvMoviesOttCelebrity,
  typeOfCeleb,

  platform,

  fetchedFromBrandPage,
  fetchedForBrand,
  fetchedDate,

  hoboUserId,


page=1,
limit=100


}=req.query;



// ==============================
// FILTERS
// ==============================

const filter = {};

// ==============================
// PERSONAL DETAILS
// ==============================

if (fullName?.trim()) {
  filter.fullName = {
    $regex: fullName.trim(),
    $options: "i",
  };
}

if (email?.trim()) {
  filter.email = {
    $regex: email.trim(),
    $options: "i",
  };
}

if (phoneNumber?.trim()) {
  filter.phoneNumber = {
    $regex: phoneNumber.trim(),
    $options: "i",
  };
}

if (gender) {
  filter.gender = gender;
}

if (dateOfBirth?.trim()) {
  filter.dateOfBirth = {
    $regex: dateOfBirth.trim(),
    $options: "i",
  };
}
// ==============================
// INSTAGRAM
// ==============================

if (instagramUsername?.trim()) {
  filter.instagramUsername = {
    $regex: instagramUsername.trim(),
    $options: "i",
  };
}

if (instagramFollowersRange) {
  switch (instagramFollowersRange) {
    case "Under 2K":
      filter.exactFollowers = { $lt: 2000 };
      break;

    case "2K - 10K":
      filter.exactFollowers = {
        $gte: 2000,
        $lt: 10000,
      };
      break;

    case "10K - 50K":
      filter.exactFollowers = {
        $gte: 10000,
        $lt: 50000,
      };
      break;

    case "50K - 100K":
      filter.exactFollowers = {
        $gte: 50000,
        $lt: 100000,
      };
      break;

    case "100K - 500K":
      filter.exactFollowers = {
        $gte: 100000,
        $lt: 500000,
      };
      break;

    case "500K - 1M":
      filter.exactFollowers = {
        $gte: 500000,
        $lt: 1000000,
      };
      break;

    case "1M - 5M":
      filter.exactFollowers = {
        $gte: 1000000,
        $lt: 5000000,
      };
      break;

    case "5M+":
      filter.exactFollowers = {
        $gte: 5000000,
      };
      break;
  }
}

// Exact Followers Filter
if (req.query.exactFollowers?.trim()) {
  filter.$expr = {
    $regexMatch: {
      input: { $toString: "$exactFollowers" },
      regex: "^" + req.query.exactFollowers,
      options: "i"
    }
  };
}

// ==============================
// CATEGORY
// ==============================

if (categories) {
  filter.categories = {
    $in: [categories],
  };
}

// ==============================
// LOCATION
// ==============================

if (city?.trim()) {
  filter.city = {
    $regex: city.trim(),
    $options: "i",
  };
}

if (state) {
  filter.state = state;
}

if (country) {
  filter.country = country;
}

if (pincode?.trim()) {
  filter.pincode = {
    $regex: pincode.trim(),
    $options: "i",
  };
}

// ==============================
// YOUTUBE
// ==============================

if (youtubeUsername?.trim()) {
  filter.youtubeUsername = {
    $regex: youtubeUsername.trim(),
    $options: "i",
  };
}

if (youtubeSubscribersRange) {
  filter.youtubeSubscribersRange = youtubeSubscribersRange;
}

// ==============================
// CELEBRITY
// ==============================

if (typeOfCeleb) {
  filter.typeOfCeleb = typeOfCeleb;
}

// ==============================
// PLATFORM
// ==============================

if (platform) {
  filter.platform = platform;
}

// ==============================
// LANGUAGES
// ==============================

if (languages) {
  filter.languages = {
    $in: [languages],
  };
}

if (req.query.hoboUserId) {
  filter.hoboUserId = {
    $regex: "^" + req.query.hoboUserId,
    $options: "i"
  };
}
// ==============================
// CAMPAIGN TYPE
// ==============================

if (campaignType?.trim()) {
  filter.campaignType = {
    $in: [campaignType.trim()],
  };
}


// DATABASE QUERY
// =====================

const pageNumber = parseInt(page, 10) || 1;
const limitNumber = parseInt(limit, 10) || 100;

const skip = (pageNumber - 1) * limitNumber;

const creators = await CsvCreator.find(filter)
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limitNumber);

const total = await CsvCreator.countDocuments(filter);

res.status(200).json({
  success: true,
  total,
  page: pageNumber,
  limit: limitNumber,
  totalPages: Math.ceil(total / limitNumber),
  data: creators,
});



}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};