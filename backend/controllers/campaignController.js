import Campaign from "../models/Campaign.js";



// ============================
// CREATE CAMPAIGN BY BRAND
// ============================

export const createCampaign = async(req,res)=>{

try{


const campaign = await Campaign.create({

    brandId:req.body.brandId,

    brandName:req.body.brandName,

    brandLogo:req.body.brandLogo,

    title:req.body.title,

    description:req.body.description,

    industry:req.body.industry,

    budget:req.body.budget,

    category:req.body.category,

    followersRange:req.body.followersRange,

    campaignType:req.body.campaignType


});


res.status(201).json({

    success:true,

    message:"Campaign created successfully",

    campaign

});


}
catch(error){

console.log(error);

res.status(500).json({

success:false,

message:error.message

});


}


};





// ============================
// GET ALL ACTIVE CAMPAIGNS
// ============================


export const getCampaigns = async(req,res)=>{


try{


const campaigns = await Campaign.find({
    status:"Active"
})
.sort({
    createdAt:-1
});


res.json(campaigns);


}
catch(error){


res.status(500).json({

message:error.message

});


}


};





// ============================
// GET BRAND CAMPAIGNS
// ============================


export const getBrandCampaigns = async(req,res)=>{


try{


const campaigns =
await Campaign.find({
brandId:req.params.brandId
});


res.json(campaigns);



}
catch(error){


res.status(500).json({

message:error.message

});


}


};






// ============================
// DELETE CAMPAIGN
// ============================


export const deleteCampaign = async(req,res)=>{


try{


await Campaign.findByIdAndDelete(
req.params.id
);


res.json({

success:true,

message:"Campaign deleted"

});


}
catch(error){

res.status(500).json({

message:error.message

});

}


};