import Message from "../models/Message.js";
// import nodemailer from "nodemailer";

export const sendMessage = async (req, res) => {
  try {
    const { name, email, company, budget, message } = req.body;

     const message=
          await Message.create({
            name,
            email,
            company,
            budget,
            message
          });

    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });

    // await transporter.sendMail({
    //   from: process.env.EMAIL_USER,
    //   to: process.env.EMAIL_USER,
    //   subject: "New Contact Form Message",
    //   html: `
    //     <h2>New Message Received</h2>
    //     <p><b>Name:</b> ${name}</p>
    //     <p><b>Email:</b> ${email}</p>
    //     <p><b>Company:</b> ${company}</p>
    //     <p><b>Budget:</b> ${budget}</p>
    //     <p><b>Message:</b> ${message}</p>
    //   `,
    // });

    res.status(201).json({
      success: true,
      message:
        "message sent successfully",
      message,
    });
  } catch (error) {
  console.error("BOOKING ERROR:", error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
  }
};