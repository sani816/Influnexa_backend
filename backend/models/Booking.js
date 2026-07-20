import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    company: String,
    budget: String,
    message: String,

    type: {
      type: String,
      enum: ["contact", "consultation"],
      default: "contact",
    },

  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);