import mongoose from "mongoose";

const csvUploadReportSchema = new mongoose.Schema(
  {
    totalRecords: {
      type: Number,
      default: 0,
    },

    successfulRecords: {
      type: Number,
      default: 0,
    },

    failedRecords: {
      type: Number,
      default: 0,
    },

    report: [
      {
        row: Number,

        // Upload Status
        status: String, // Uploaded / Failed
        reason: String,

        // Instagram
        instagramUsername: String,
        instagramLink: String,
        followersRange: Number,

        // Personal
        fullName: String,
        email: String,
        mobileNumber: String,
        whatsappNumber: String,
        gender: String,
        dob: String,

        // Categories
        preferredCategory: {
          type: [String],
          default: [],
        },

        campaignTypes: {
          type: [String],
          default: [],
        },

        // Pricing
        reelRate: String,
        storyRate: String,
        postRate: String,

        ytVideoRate: String,
        ytShortsRate: String,

        // YouTube
        youtubeName: String,
        youtubeLink: String,
        youtubeSubs: Number,

        // Address
        address1: String,
        address2: String,
        city: String,
        state: String,
        pincode: String,

        addressType: String,
        canReceiveProducts: String,

        // Brand
        brandNames: String,

        // Image
        image: String,

        // Consent
        consent1: Boolean,
        consent2: Boolean,
        consent3: Boolean,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CSVUploadReport =
  mongoose.models.CSVUploadReport ||
  mongoose.model("CSVUploadReport", csvUploadReportSchema);

export default CSVUploadReport;