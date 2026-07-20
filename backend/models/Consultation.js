import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    company:String,
    budget:Number,
    date: String,
    time: String,
    message:String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Consultation",
  consultationSchema
);