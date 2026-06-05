import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    date: String,
    time: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Consultation",
  consultationSchema
);