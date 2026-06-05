import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    workEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobileNumber: {
      type: String,
      trim: true,
    },

    brandName: {
      type: String,
      required: true,
      trim: true,
    },

    websiteUrl: {
      type: String,
      default: "",
    },

    instagramHandle: {
      type: String,
      default: "",
    },

    lookingFor: {
      type: [String],
      default: [],
    },

    budgetRange: {
      type: String,
      enum: [
        "Under ₹50K", "₹50K-₹2L", "₹2L-₹5L", "₹5L-₹10L", "₹10L+",
      ],
      default: "Not Specified",
    },

    preferredCategory: {
      type: [String],
      default: [],
    },

    influencerLocation: {
      type: String,
      default: "",
    },

    followersRange: {
      type: String,
      default: "",
    },

    campaignDescription: {
      type: String,
      default: "",
    },

    additionalNotes: {
      type: String,
      default: "",
    },

    consent: {
      type: Boolean,
      default: false,
    },

    // 🔥 ADMIN FEATURES
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "active",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 SAFE MODEL FIX (IMPORTANT)
const Brand =
  mongoose.models.Brand || mongoose.model("Brand", brandSchema);

export default Brand;