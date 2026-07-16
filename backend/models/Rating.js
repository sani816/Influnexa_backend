// import mongoose from "mongoose";

// const ratingSchema = new mongoose.Schema(
//   {
//     name: String,

//     email: String,

//     role: {
//       type: String,
//       enum: ["Brand", "Influencer"],
//       default: "Influencer",
//     },

//     rating: {
//       type: Number,
//       required: true,
//       min: 1,
//       max: 5,
//     },

//     feedback: String,
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.model(
//   "Rating",
//   ratingSchema
// );