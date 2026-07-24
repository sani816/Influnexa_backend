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
    email:{
  type: String,
  sparse: true,
  unique: true,
},
    mobileNumber:{
    type:String,
    unique:true,
    sparse:true,
    },
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
    hasYoutube: {
  type: String,
  enum: ["Yes", "No","yes","no"],
  default: "No",
},


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

// 👇 ADD IT HERE
creatorSchema.pre("validate", function (next) {
  if (!this.email && !this.mobileNumber) {
    this.invalidate(
      "email",
      "Either email or mobile number is required."
    );

    this.invalidate(
      "mobileNumber",
      "Either email or mobile number is required."
    );
  }

  next();
});


// 🔥 SAFE MODEL FIX (IMPORTANT)
const Creator =
  mongoose.models.Creator || mongoose.model("Creator", creatorSchema);

export default Creator;