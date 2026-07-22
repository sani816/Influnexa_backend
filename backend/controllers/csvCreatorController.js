import fs from "fs";
import csv from "csv-parser";
import Creator from "../models/Creator.js";


export const uploadCreatorsCSV = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        message: "CSV file required"
      });
    }


    const creators = [];


    fs.createReadStream(req.file.path)

      .pipe(csv())

      .on("data", (row) => {


        creators.push({

          // Instagram Details
          instagramUsername: row.instagramUsername,
          instagramLink: row.instagramLink,


          // Followers
          followersRange:
            Number(row.followersRange) || 0,


          // Personal Details
          fullName: row.fullName,
          email: row.email,

          mobileNumber:
            row.mobileNumber,

          whatsappNumber:
            row.whatsappNumber,


          gender:
            row.gender,

          dob:
            row.dob,


          // Campaign Details
          campaignTypes:
            row.campaignTypes
              ? row.campaignTypes.split(",")
              : [],


          // Location Details
          address:
            row.address,

          city:
            row.city,

          state:
            row.state,

          pincode:
            row.pincode,


          // Professional Details
          bio:
            row.bio,

          category:
            row.category,


          youtubeLink:
            row.youtubeLink,


          facebookLink:
            row.facebookLink,


          // Image
          image:
            row.image || "",


          // Status
          status:
            row.status || "Pending"

        });


      })


      .on("end", async () => {


        if (creators.length === 0) {

          return res.status(400).json({
            message:"CSV has no data"
          });

        }


        await Creator.insertMany(creators);


        res.status(201).json({

          success:true,

          message:
          `${creators.length} creators uploaded successfully`

        });


      });



  }

  catch(error){

    console.log(error);

    res.status(500).json({

      message:error.message

    });

  }

};