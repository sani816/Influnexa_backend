import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    Company: String,
    budget: String,
    message:String
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "message",
  messageSchemaSchema
);