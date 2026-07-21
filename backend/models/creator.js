import mongoose from "mongoose";

const creatorSchema = new mongoose.Schema(
  {
    instagramUsername: String,
    instagramLink: String,
    followersRange: {
      type:Number,
      default:0
    },

    fullName: String,
    email: String,
    mobileNumber: String,
    whatsappNumber: String,

    gender: String,
    dob: String,

    campaignTypes: {
      type: [String],
      default: [],
    },
preferredCategory: {
  type: [String],
  default: [],
},
    reelRate: String,
    storyRate: String,
    postRate:String,

    ytVideoRate: String,
    ytShortsRate:String,

    youtubeName: String,
    youtubeLink: String,
    youtubeSubs: {
      type:Number,
      default:0
    },

    address1: String,
    address2: String,

    city: String,
    state: String,
    pincode: String,

    canReceiveProducts: String,
    addressType: String,

    brandNames: String,
    

  


    image: {
      type: String, // URL or uploaded file path
      default: "",
    },

    

    consent1: Boolean,
    consent2: Boolean,
    consent3: Boolean,
  },
  {
    timestamps: true,
  }
);

// 🔥 SAFE MODEL FIX (IMPORTANT)
const Creator =
  mongoose.models.Creator || mongoose.model("Creator", creatorSchema);

export default Creator;