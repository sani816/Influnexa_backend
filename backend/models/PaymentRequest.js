import mongoose from "mongoose";

const paymentRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    paymentApp: {
      type: String,
      required: true,
      enum: [
        "Google Pay",
        "PhonePe",
        "Paytm",
        "UPI",
        "Bank Transfer",
        "Other",
      ],
    },

    amount: {
      type: Number,
      required: true,
      default: 1,
    },

    screenshot: {
      type: String,
      required: true,
    },

    // transactionId: {
    //   type: String,
    //   default: "",
    // },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    approved: {
      type: Boolean,
      default: false,
    },

    downloaded: {
      type: Boolean,
      default: false,
    },

    approvedAt: {
      type: Date,
    },

    downloadedAt: {
      type: Date,
    },

    filterData: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PaymentRequest", paymentRequestSchema);