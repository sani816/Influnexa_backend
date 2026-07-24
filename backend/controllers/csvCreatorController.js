import fs from "fs";
import csv from "csv-parser";
import CsvCreator from "../models/CsvCreator.js";
import CSVUploadReport from "../models/CSVUploadReport.js";
import { io } from "../server.js";

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

          phoneNumber: row["Phone Number"] || "",

          whatsappNumber: row["Whatsapp Number"] || "",

          fullName: row["Full Name"] || "",

          email: row["Email"] || "",

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

          hoboUserId:
            row["hoboUserId"] || "",
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
         let updatedRecords = 0;
          let failedRecords = 0;
          for (let i = 0; i < creators.length; i++) {
          const creator = creators[i]
        
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
        row: i + 2,
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
    creator.instagramUsername ||
    creator.instagramProfileLink;

const hasYoutube =
    creator.youtubeUsername ||
    creator.youtubeChannelLink;

if (!hasInstagram && !hasYoutube) {

    failedRecords++;

    report.push({
        row: i + 2,
        fullName: creator.fullName,
        email: creator.email,
        phoneNumber: creator.phoneNumber,
        instagramUsername: "",
        youtubeUsername: "",
        status: "Failed",
        reason: "Either Instagram or YouTube details are required"
    });

    continue;
}

try {

    let existingCreator = null;


    // Check existing creator by email
    if (creator.email?.trim()) {

        existingCreator = await CsvCreator.findOne({
            email: creator.email.trim()
        });

    }


    // If email not found then check mobile
    if (!existingCreator && creator.phoneNumber?.trim()) {

        existingCreator = await CsvCreator.findOne({
            phoneNumber: creator.phoneNumber.trim()
        });

    }



    // UPDATE EXISTING CREATOR
    if (existingCreator) {


        Object.assign(
            existingCreator,
            creator
        );


        await existingCreator.save();


        updatedRecords++;


        report.push({

            row: i + 2,

            fullName: creator.fullName,

            email: creator.email,

            phoneNumber: creator.phoneNumber,

            instagramUsername: creator.instagramUsername,

            youtubeUsername: creator.youtubeUsername,


            status: "Updated",

            reason: "Existing creator updated with latest CSV data"

        });


    }


    // CREATE NEW CREATOR
    else {


        await CsvCreator.create(creator);


        successfulRecords++;


        report.push({

            row: i + 2,

            fullName: creator.fullName,

            email: creator.email,

            phoneNumber: creator.phoneNumber,

            instagramUsername: creator.instagramUsername,

            youtubeUsername: creator.youtubeUsername,


            status: "Uploaded",

            reason: "New creator added successfully"

        });


    }



}
catch(error){


    failedRecords++;


    report.push({

        row: i + 2,

        fullName: creator.fullName,

        email: creator.email,

        phoneNumber: creator.phoneNumber,

        instagramUsername: creator.instagramUsername,

        youtubeUsername: creator.youtubeUsername,


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

const result = await CsvCreator.deleteMany({});


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
  search,

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
limit=20


}=req.query;



let filter={};



// =====================
// GLOBAL SEARCH
// =====================

// =====================
// GLOBAL SEARCH
// =====================

if (search) {
  filter.$or = [
    { fullName: { $regex: search, $options: "i" } },
    { email: { $regex: search, $options: "i" } },
    { instagramUsername: { $regex: search, $options: "i" } },
    { youtubeUsername: { $regex: search, $options: "i" } },
    { phoneNumber: { $regex: search, $options: "i" } },
    { whatsappNumber: { $regex: search, $options: "i" } },
    { city: { $regex: search, $options: "i" } },
    { state: { $regex: search, $options: "i" } },
    { country: { $regex: search, $options: "i" } },
  ];
}

// =====================
// TIMESTAMP
// =====================

if (timestamp)
  filter.timestamp = {
    $regex: timestamp,
    $options: "i",
  };

// =====================
// INSTAGRAM
// =====================

if (instagramUsername)
  filter.instagramUsername = {
    $regex: instagramUsername,
    $options: "i",
  };

if (instagramProfileLink)
  filter.instagramProfileLink = {
    $regex: instagramProfileLink,
    $options: "i",
  };

if (instagramFollowersRange)
  filter.instagramFollowersRange = instagramFollowersRange;

if (exactFollowers)
  filter.exactFollowers = Number(exactFollowers);

// =====================
// PERSONAL
// =====================

if (fullName)
  filter.fullName = {
    $regex: fullName,
    $options: "i",
  };

if (email)
  filter.email = {
    $regex: email,
    $options: "i",
  };

if (gender)
  filter.gender = gender;

if (dateOfBirth)
  filter.dateOfBirth = dateOfBirth;

if (photoLink) {
    filter.photoLink = {
        $regex: photoLink,
        $options: "i"
    };
}
// =====================
// CONTACT
// =====================

if (phoneNumber)
  filter.phoneNumber = {
    $regex: phoneNumber,
    $options: "i",
  };

if (whatsappNumber)
  filter.whatsappNumber = {
    $regex: whatsappNumber,
    $options: "i",
  };

// =====================
// CATEGORY
// =====================

if (categories)
  filter.categories = {
    $in: [categories],
  };

// =====================
// CAMPAIGN
// =====================

if (campaignType)
  filter.campaignType = {
    $in: [campaignType],
  };

if (whatKindOfDealDoYouParticipateIn)
  filter.whatKindOfDealDoYouParticipateIn = {
    $regex: whatKindOfDealDoYouParticipateIn,
    $options: "i",
  };

// =====================
// LANGUAGES
// =====================

if (languages)
  filter.languages = {
    $in: [languages],
  };

// =====================
// LOCATION
// =====================

if (city)
  filter.city = {
    $regex: city,
    $options: "i",
  };

if (state)
  filter.state = {
    $regex: state,
    $options: "i",
  };

if (country)
  filter.country = {
    $regex: country,
    $options: "i",
  };

if (pincode)
  filter.pincode = pincode;

if (landmark)
  filter.landmark = {
    $regex: landmark,
    $options: "i",
  };

if (fullAddress)
  filter.fullAddress = {
    $regex: fullAddress,
    $options: "i",
  };

// =====================
// YOUTUBE
// =====================

if (youtubeUsername)
  filter.youtubeUsername = {
    $regex: youtubeUsername,
    $options: "i",
  };

if (youtubeChannelLink)
  filter.youtubeChannelLink = {
    $regex: youtubeChannelLink,
    $options: "i",
  };
if (speakingVideoLink) {
    filter.speakingVideoLink = {
        $regex: speakingVideoLink,
        $options: "i"
    };
}
if (youtubeSubscribersRange)
  filter.youtubeSubscribersRange = youtubeSubscribersRange;

// =====================
// CELEBRITY
// =====================

if (areYouATvMoviesOttCelebrity)
  filter.areYouATvMoviesOttCelebrity = areYouATvMoviesOttCelebrity;

if (whatAllPlatformsAreYouAvailableOn) {
    filter.whatAllPlatformsAreYouAvailableOn = {
        $in: whatAllPlatformsAreYouAvailableOn.split(","),
    };
}
if (typeOfCeleb)
  filter.typeOfCeleb = {
    $regex: typeOfCeleb,
    $options: "i",
  };

// =====================
// PLATFORM
// =====================

if (platform)
  filter.platform = {
    $regex: platform,
    $options: "i",
  };

if (fetchedFromBrandPage)
  filter.fetchedFromBrandPage = fetchedFromBrandPage;

if (fetchedForBrand)
  filter.fetchedForBrand = {
    $regex: fetchedForBrand,
    $options: "i",
  };

if (fetchedDate)
  filter.fetchedDate = {
    $regex: fetchedDate,
    $options: "i",
  };

if (hoboUserId)
  filter.hoboUserId = hoboUserId;


if (commercialsFor1InstagramReel)
    filter.commercialsFor1InstagramReel =
        Number(commercialsFor1InstagramReel);

if (commercialsFor1InstagramStory)
    filter.commercialsFor1InstagramStory =
        Number(commercialsFor1InstagramStory);

if (commercialsFor1InstagramPost)
    filter.commercialsFor1InstagramPost =
        Number(commercialsFor1InstagramPost);

if (commercialsFor1DedicatedYouTubeVideo)
    filter.commercialsFor1DedicatedYouTubeVideo =
        Number(commercialsFor1DedicatedYouTubeVideo);

if (commercialsFor1IntegratedYouTubeVideo)
    filter.commercialsFor1IntegratedYouTubeVideo =
        Number(commercialsFor1IntegratedYouTubeVideo);

if (commercialsFor1DedicatedYouTubeShortsVideo)
    filter.commercialsFor1DedicatedYouTubeShortsVideo =
        Number(commercialsFor1DedicatedYouTubeShortsVideo);

if (commercialsFor1IntegratedYouTubeShortsVideo)
    filter.commercialsFor1IntegratedYouTubeShortsVideo =
        Number(commercialsFor1IntegratedYouTubeShortsVideo);

if (howManyAmazonReviewsYouDoPerMonth)
    filter.howManyAmazonReviewsYouDoPerMonth =
        Number(howManyAmazonReviewsYouDoPerMonth);

if (anyMessageForUs)
    filter.anyMessageForUs = {
        $regex: anyMessageForUs,
        $options: "i",
    };

if (bio)
    filter.bio = {
        $regex: bio,
        $options: "i",
    };



// DATABASE QUERY
// =====================


const pageNumber = Number(page);
const limitNumber = Number(limit);

const skip = (pageNumber - 1) * limitNumber;



const creators =
await CsvCreator
.find(filter)
.sort({
createdAt:-1
})
.skip(skip)
.limit(limitNumber);



const total =
await CsvCreator.countDocuments(filter);



res.status(200).json({

success:true,

total,

page:Number(page),

limit:Number(limit),

totalPages:
Math.ceil(total/limit),

data:creators


});



}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};