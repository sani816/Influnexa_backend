import mongoose from "mongoose";

const csvUploadReportSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      default: "",
    },

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
        row: {
          type: Number,
        },

        status: {
          type: String,
          default: "",
        },

        reason: {
          type: String,
          default: "",
        },

        // ======================
        // CSV CREATOR FIELDS
        // ======================

        timestamp: {
          type: String,
          default: "",
        },

        instagramUsername: {
          type: String,
          default: "",
        },

        instagramProfileLink: {
          type: String,
          default: "",
        },

        instagramFollowersRange: {
          type: String,
          default: "",
        },

        exactFollowers: {
          type: Number,
          default: 0,
        },

        categories: {
          type: [String],
          default: [],
        },

        phoneNumber: {
          type: String,
          default: "",
        },

        whatsappNumber: {
          type: String,
          default: "",
        },

        fullName: {
          type: String,
          default: "",
        },

        email: {
          type: String,
          default: "",
        },

        gender: {
          type: String,
          default: "",
        },

        dateOfBirth: {
          type: String,
          default: "",
        },

        campaignType: {
          type: [String],
          default: [],
        },

        whatKindOfDealDoYouParticipateIn: {
          type: String,
          default: "",
        },

        languages: {
          type: [String],
          default: [],
        },

        speakingVideoLink: {
          type: String,
          default: "",
        },

        fullAddress: {
          type: String,
          default: "",
        },

        landmark: {
          type: String,
          default: "",
        },

        city: {
          type: String,
          default: "",
        },

        state: {
          type: String,
          default: "",
        },

        country: {
          type: String,
          default: "",
        },

        pincode: {
          type: String,
          default: "",
        },

        photoLink: {
          type: String,
          default: "",
        },

        youtubeUsername: {
          type: String,
          default: "",
        },

        youtubeChannelLink: {
          type: String,
          default: "",
        },

        youtubeSubscribersRange: {
          type: String,
          default: "",
        },

        commercialsFor1InstagramReel: {
          type: Number,
          default: 0,
        },

        commercialsFor1InstagramStory: {
          type: Number,
          default: 0,
        },

        commercialsFor1InstagramPost: {
          type: Number,
          default: 0,
        },

        commercialsFor1DedicatedYouTubeVideo: {
          type: Number,
          default: 0,
        },

        commercialsFor1IntegratedYouTubeVideo: {
          type: Number,
          default: 0,
        },

        commercialsFor1DedicatedYouTubeShortsVideo: {
          type: Number,
          default: 0,
        },

        commercialsFor1IntegratedYouTubeShortsVideo: {
          type: Number,
          default: 0,
        },

        anyMessageForUs: {
          type: String,
          default: "",
        },

        bio: {
          type: String,
          default: "",
        },

        areYouATvMoviesOttCelebrity: {
          type: String,
          default: "",
        },

        typeOfCeleb: {
          type: String,
          default: "",
        },

        whatAllPlatformsAreYouAvailableOn: {
          type: [String],
          default: [],
        },

        howManyAmazonReviewsYouDoPerMonth: {
          type: Number,
          default: 0,
        },

        fetchedFromBrandPage: {
          type: String,
          default: "",
        },

        fetchedForBrand: {
          type: String,
          default: "",
        },

        platform: {
          type: String,
          default: "",
        },

        fetchedDate: {
          type: String,
          default: "",
        },

        hoboUserId: {
          type: String,
          default: "",
        },
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