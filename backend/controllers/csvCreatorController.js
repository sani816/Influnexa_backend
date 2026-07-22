import fs from "fs";
import csv from "csv-parser";
import Creator from "../models/Creator.js";


export const uploadCreatorsCSV = async(req,res)=>{

 try{

   if(!req.file){
     return res.status(400).json({
       message:"CSV file required"
     });
   }


   const creators=[];


   fs.createReadStream(req.file.path)
   .pipe(csv())
   .on("data",(row)=>{

      creators.push({

        fullName: row.fullName,
        email: row.email,
        mobileNumber: row.mobileNumber,

        instagramUsername:
        row.instagramUsername,

        instagramLink:
        row.instagramLink,

        followersRange:
        Number(row.followersRange) || 0,

        gender:
        row.gender,

        campaignTypes:
        row.campaignTypes
        ? row.campaignTypes.split(",")
        : []

      });

   })

   .on("end",async()=>{


      await Creator.insertMany(creators);


      res.status(201).json({

        success:true,
        message:
        `${creators.length} creators uploaded`

      });


   });


 }
 catch(error){

   res.status(500).json({
     message:error.message
   });

 }

};