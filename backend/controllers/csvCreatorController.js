import fs from "fs";
import csv from "csv-parser";
import Creator from "../models/CsvCreator.js";
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

if (!creator.email?.trim() && !creator.mobileNumber?.trim()) {

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
        mobileNumber: creator.mobileNumber,
        instagramUsername: "",
        youtubeName: "",
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
    if (!existingCreator && creator.mobileNumber?.trim()) {

        existingCreator = await CsvCreator.findOne({
            mobileNumber: creator.mobileNumber.trim()
        });

    }



    // UPDATE EXISTING CREATOR
    if (existingCreator) {


        Object.assign(
            existingCreator,
            creator
        );


        await existingCreator.save();


        successfulRecords++;


        report.push({

            row: i + 2,

            fullName: creator.fullName,

            email: creator.email,

            mobileNumber: creator.mobileNumber,

            instagramUsername: creator.instagramUsername,

            youtubeName: creator.youtubeName,


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

            mobileNumber: creator.mobileNumber,

            instagramUsername: creator.instagramUsername,

            youtubeName: creator.youtubeName,


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

const result = await Creator.deleteMany({});


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


const creator = await Creator.findByIdAndDelete(id);



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

instagramUsername,
instagramLink,

followersRange,
exactFollowers,

category,

phoneNumber,
whatsappNumber,

fullName,
email,

gender,
dob,

campaignType,
dealType,

languages,

city,
state,
country,
pincode,

youtubeUsername,
youtubeChannelLink,
youtubeSubscribersRange,


isCelebrity,
celebrityType,


platform,

fetchedFromBrandPage,
fetchedForBrand,


hoboUserId,


page=1,
limit=20


}=req.query;



let filter={};



// =====================
// GLOBAL SEARCH
// =====================

if(search){

filter.$or=[


{
fullName:{
$regex:search,
$options:"i"
}
},


{
email:{
$regex:search,
$options:"i"
}
},


{
instagramUsername:{
$regex:search,
$options:"i"
}
},


{
youtubeUsername:{
$regex:search,
$options:"i"
}
},


{
mobileNumber:{
$regex:search,
$options:"i"
}
},


{
city:{
$regex:search,
$options:"i"
}
}



];

}





// =====================
// INSTAGRAM
// =====================


if(instagramUsername)
filter.instagramUsername={
$regex:instagramUsername,
$options:"i"
};



if(instagramLink)
filter.instagramLink={
$regex:instagramLink,
$options:"i"
};




// =====================
// FOLLOWERS
// =====================


if(followersRange)
filter.followersRange=followersRange;



if(exactFollowers)
filter.exactFollowers=exactFollowers;




// =====================
// PERSONAL
// =====================


if(fullName)
filter.fullName={
$regex:fullName,
$options:"i"
};



if(email)
filter.email={
$regex:email,
$options:"i"
};



if(gender)
filter.gender=gender;



if(dob)
filter.dob=dob;





// =====================
// CONTACT
// =====================


if(phoneNumber)
filter.phoneNumber={
$regex:phoneNumber,
$options:"i"
};



if(whatsappNumber)
filter.whatsappNumber={
$regex:whatsappNumber,
$options:"i"
};






// =====================
// CATEGORY
// =====================


if(category)
filter.categories={
$in:[
category
]
};






// =====================
// CAMPAIGN
// =====================


if(campaignType)
filter.campaignTypes={
$in:[
campaignType
]
};




if(dealType)
filter.dealType={
$regex:dealType,
$options:"i"
};






// =====================
// LOCATION
// =====================


if(city)
filter.city={
$regex:city,
$options:"i"
};



if(state)
filter.state={
$regex:state,
$options:"i"
};



if(country)
filter.country={
$regex:country,
$options:"i"
};



if(pincode)
filter.pincode=pincode;






// =====================
// YOUTUBE
// =====================


if(youtubeUsername)
filter.youtubeUsername={
$regex:youtubeUsername,
$options:"i"
};



if(youtubeChannelLink)
filter.youtubeChannelLink={
$regex:youtubeChannelLink,
$options:"i"
};



if(youtubeSubscribersRange)
filter.youtubeSubscribersRange=
youtubeSubscribersRange;








// =====================
// CELEBRITY
// =====================


if(isCelebrity)
filter.isCelebrity=isCelebrity;



if(celebrityType)
filter.celebrityType={
$regex:celebrityType,
$options:"i"
};







// =====================
// PLATFORM
// =====================


if(platform)
filter.platform={
$regex:platform,
$options:"i"
};






// =====================
// BRAND FETCH DATA
// =====================


if(fetchedFromBrandPage)
filter.fetchedFromBrandPage=fetchedFromBrandPage;



if(fetchedForBrand)
filter.fetchedForBrand={
$regex:fetchedForBrand,
$options:"i"
};






// =====================
// HOBO USER
// =====================


if(hoboUserId)
filter.hoboUserId=hoboUserId;






// DATABASE QUERY
// =====================


const skip =
(page-1)*limit;



const creators =
await CsvCreator
.find(filter)
.sort({
createdAt:-1
})
.skip(skip)
.limit(Number(limit));



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