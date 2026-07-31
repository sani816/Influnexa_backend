import mongoose from "mongoose";


const campaignSchema = new mongoose.Schema(
{

    brandId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Brand",
        required:true
    },


    brandName:{
        type:String,
        required:true
    },


    brandLogo:{
        type:String,
        default:""
    },


    title:{
        type:String,
        required:true
    },


    description:{
        type:String,
        required:true
    },


    industry:{
        type:String,
        default:""
    },


    budget:{
        type:String,
        required:true
    },


    category:{
        type:String,
        required:true
    },


    followersRange:{
        type:String,
        required:true
    },


    campaignType:{
        type:String,
        default:"Paid"
    },


    status:{
        type:String,
        enum:[
            "Active",
            "Closed"
        ],
        default:"Active"
    },


    createdAt:{
        type:Date,
        default:Date.now
    }


});


export default mongoose.model(
    "Campaign",
    campaignSchema
);