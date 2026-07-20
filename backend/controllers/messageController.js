// import Message from "../models/Message.js";

// export const sendMessage = async (req, res) => {
//   try {
//     const { name, email, company, budget, message } = req.body;

//     const newMessage = await Message.create({
//       name,
//       email,
//       company,
//       budget,
//       message
//     });

//     res.status(201).json({
//       success: true,
//       message: "Message sent successfully",
//       data: newMessage,
//     });

//   } catch (error) {
//     console.error("MESSAGE ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };